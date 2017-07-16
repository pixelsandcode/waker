"use strict"
let moment  = require('moment')
let _       = require('lodash')
let request = require('request')
let Promise = require('bluebird')
let Path    = require('path')

let get_privates = (server, configs) => {
  let privates = {
    elastic: {
      tries: { maximum: 3 },
      health (type, now, counter, is_on = false) {
        if(privates.elastic.tries.maximum <= counter) return Promise.resolve({ connected: false, on: is_on })
        counter++
        return privates.elastic.check(type)
          .then( (result) => {
            if(result instanceof Error || result.body.status == 404 || result.body.found == false) {
              console.log(type, result.body)
              console.log(result.body.error)
              return { connected: false, on: false }
            }
            if(result.body._source.doc.created_at == now) {
              return { connected: true, on: true }
            }
            else {
              console.log(`Trying to connect to ES: ${counter}`)
              is_on = result.response.statusCode == 200
              return Promise.delay(2000)
                .then( () => {
                  return privates.elastic.health(type, now, counter, is_on)
                })
            }
          })
      },
      check (type) {
        return new Promise( (resolve, reject) => {
          request({
            method: 'GET',
            json: true,
            url: `http://${configs.main.searchengine[type].host}:${configs.main.searchengine[type].port}/${configs.main.searchengine[type].name}/couchbaseDocument/system_health`
          }, (error, response, body) => {
            console.log(type, error)
            if(error) return resolve(new Error(error))
            resolve({ body, response })
          })
        })
      }
    },
    servers () {
      let info = []
      _.each(server.connections, (connection) => {
        info.push(connection.info)
      })
      return info
    },
    deploy () {
      const path = Path.join(__dirname, '/..')
      const version = _.last( path.split('/') )
      return { version, path }
    }
  }
  return privates
}

module.exports = (server, configs, callback) => {
  let privates = get_privates(server, configs)
  let health = {
    couchbase: {},
    elastic: {},
    deploy: privates.deploy(),
    servers: privates.servers()
  }
  let now = moment().format()
  let promises = [], couchbase_state = true, elastic_state = true, xdcr_state = true
  _.each(configs.main.databases, (database) => {
    let db = require('puffer').instances[database.name]
    promises.push(
      db.upsert('system_health', { created_at: now } )
        .then( () => {
          return db.get('system_health', true)
        })
        .then( (doc) => {
          let state = (doc.created_at == now)
          if(!state) couchbase_state = false
          return health.couchbase[database.name] = { on: state }
        })
    )
  })
  Promise.all(promises)
    .then( () => {
      let promises = []
      _.each(configs.main.searchengine, (searchengine, type) => {
        promises.push(
          privates.elastic.health(type, now, 0)
            .then( (state) => {
              if(!state.on) elastic_state = false
              if(!state.connected) xdcr_state = false
              return health.elastic[type] = state
            })
        )
      })
      Promise.all(promises)
        .then( () => {
          if(!elastic_state) health.status = 'Elastic is down'
          else if(!xdcr_state) health.status = 'XDCR is down'
          else if(!couchbase_state) health.status = 'Couchbase is down'
          else health.status = 'All Healthy'
          callback(health)
        })
    })
}

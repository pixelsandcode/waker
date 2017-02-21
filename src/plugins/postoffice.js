"use strict"
let Promise = require('bluebird')
let _       = require('lodash')

module.exports = (server, config, system) => {
  return new Promise( (resolve, reject) => {
    if(config.enabled) {
      let database_names = _.map(system.databases, (db) => { return db.name })
      if(database_names.indexOf(config.database) < 0) return reject(new Error(`There is no configured database with name ""${config.database}`))
      let database = require('puffer').instances[config.database]
      server.register([
        {
          register: require('hapi-notification-server'),
          options: {
            database,
            config,
            url: system.url,
            scheme: system.scheme
          }
        }
      ], (err) => {
        if(err) return reject(err)
        resolve(true)
      })
    }
    else resolve(true)
  })
}

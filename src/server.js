"use strict";
let Hapi = require('hapi')
let Yaml = require('yml')

module.exports = (config_path) => {
  let config = Yaml.load(`${config_path}/configs.yml`)
  let waker_config = Yaml.load(`${config_path}/waker.yml`)
  let user_plugins = require(`${config_path}/plugins`)
  let user_methods = require(`${config_path}/methods`)
  let modules_loader = require(`${config_path}/modules`)
  let server = new Hapi.Server({
    connections: {
      load: {
        maxEventLoopDelay: config.server.timeout
      }
    },
    cache: {
      engine: require('catbox-redis'),
      host: config.cache.host,
      port: config.cache.port
    },
    load: {
      sampleInterval: config.server.sampling
    }
  })
  let labels = ['api']
  if(waker_config.plugins.bell.enabled) labels.push(waker_config.plugins.bell.label)
  if(waker_config.plugins.postoffice.enabled) labels.push(waker_config.plugins.postoffice.label)
  server.connection({ port: config.server.port, labels: labels })
  let load = () => {
    let methods = waker_config.methods
    if(methods.model.enabled) require(`${__dirname}/methods/model`)(server, config)
    if(methods.jobs.enabled) require(`${__dirname}/methods/jobs`)(server, config, methods.jobs)
    if(methods.redis.enabled) require(`${__dirname}/methods/redis`)(server, config)
    if(methods.bell.enabled) require(`${__dirname}/methods/bell`)(server, methods.bell)
    if(methods.postoffice.enabled) require(`${__dirname}/methods/postoffice`)(server, methods.postoffice)
    require(`${__dirname}/methods/json`)(server)
    require(`${__dirname}/decorators/reply`)(server)
    user_methods(server)
    require(`./plugins`)(server, config, waker_config, user_plugins, modules_loader)
  }
  let callback = (key) => {
    return () => {
      let connected = config.databases[key].connected = config.databases[key].instance.bucket.connected
      let name = config.databases[key].name
      if(connected)
        console.log(`Connected to Couchbase Bucket ${name}!`)
      else
        console.log(`Error: Couchbase Bucket ${name} is shutdown. Byeee!`)
      let failed = false
      for(let k in config.databases) {
        let v = config.databases[k]
        if(v.connected === null || v.connected === undefined)
          return false
        if(!v.connected) {
          failed = true
          break
        }
      }
      if(failed) {
        console.log `Server can't start. There was an issue with database.`
        return
      }
      load()
    }
  }
  return {
    server,
    mock: require('./mock')(config, waker_config.methods.model.enabled),
    start() {
      for(let k in config.databases) {
        let v = config.databases[k]
        v.instance = null
        v.callback = callback(k)
        if(config.databases.application.mock)
          v.instance = new require('puffer')(v, true)
        else
          v.instance = new require('puffer')(v)
      }
    },
    health(health_script) {
      server.route( require('./routes')(server, config, health_script) )
    }
  }
}

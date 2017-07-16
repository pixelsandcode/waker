"use strict";
let Hapi = require('hapi')
let Yaml = require('yml')

module.exports = (config) => {
  let cors = (config.hapi.cors != null && config.hapi.cors != undefined) ? config.hapi.cors : false
  let server = new Hapi.Server({
    connections: {
      load: {
        maxEventLoopDelay: config.main.server.timeout
      },
      routes: { cors }
    },
    cache: {
      engine: require('catbox-redis'),
      host: config.main.cache.host,
      port: config.main.cache.port
    },
    load: {
      sampleInterval: config.main.server.sampling
    }
  })
  let labels = ['api']
  if(config.plugins.bell.enabled)       labels.push(config.plugins.bell.label)
  if(config.plugins.postoffice.enabled) labels.push(config.plugins.postoffice.label)
  server.connection({ port: config.main.server.port, labels: labels })
  const load = () => {
    let helpers = config.helpers
    if(helpers.model.enabled) require(`${__dirname}/helpers/model`)(server, config)
    if(helpers.jobs.enabled)  require(`${__dirname}/helpers/jobs`)(server, config)
    if(helpers.redis.enabled) require(`${__dirname}/helpers/redis`)(server, config)
    if(helpers.bell.enabled)  require(`${__dirname}/helpers/bell`)(server, config)
    if(helpers.postoffice.enabled) require(`${__dirname}/helpers/postoffice`)(server, config)
    require(`${__dirname}/helpers/json`)(server)
    require(`${__dirname}/decorators/reply`)(server)
    waker.customMethods(server)
    require(`./plugins`)(waker, config)
  }
  const callback = (key) => {
    return () => {
      let connected = config.main.databases[key].connected = config.main.databases[key].instance.bucket.connected
      let name = config.main.databases[key].name
      if(connected)
        console.log(`Connected to Couchbase Bucket ${name}!`)
      else
        console.log(`Error: Couchbase Bucket ${name} is shutdown. Byeee!`)
      let failed = false
      for(let k in config.main.databases) {
        let v = config.main.databases[k]
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
  const waker = {
    server,
    mock: require('./mock')(config, config.helpers.model.enabled),
    start() {
      for(let k in config.main.databases) {
        let v = config.main.databases[k]
        v.instance = null
        v.callback = callback(k)
        if(config.main.databases.application.mock)
          v.instance = new require('puffer')(v, true)
        else
          v.instance = new require('puffer')(v)
      }
    },
    health(health_script) {
      server.route( require('./routes')(server, config, health_script) )
    },
    plugins (plugins) {
      waker.customPlugins = plugins
    },
    methods (methods) {
      waker.customMethods = methods
    },
    setModuleLoader (loader) {
      waker.moduleLoader = loader
    }
  }
  return waker
}

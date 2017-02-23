"use strict"

module.exports = (server, config) => {

  server.method('model.base', (db) => {
    if(config.databases[db] === null || config.databases[db] === undefined) throw new Error(`Database ${db} is not set on configs`)
    let source = null
    if(config.databases[db].mock)
      source = new require('puffer')({}, true)
    else
      source = require('puffer').instances[config.databases[db].name]
    return require('odme').CB({
      source: source,
      host: config.searchengine[db].host,
      port: config.searchengine[db].port,
      index: config.searchengine[db].name
    })
  })
}
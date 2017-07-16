"use strict"

module.exports = (server, config) => {

  server.method('model.base', (db) => {
    if(config.main.databases[db] === null || config.main.databases[db] === undefined) throw new Error(`Database ${db} is not set on configs`)
    let source = null
    if(config.main.databases[db].mock)
      source = new require('puffer')({}, true)
    else
      source = require('puffer').instances[config.main.databases[db].name]
    return require('odme').CB({
      source: source,
      host: config.main.searchengine[db].host,
      port: config.main.searchengine[db].port,
      index: config.main.searchengine[db].name
    })
  })
}
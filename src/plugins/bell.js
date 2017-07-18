"use strict"
let Promise = require('bluebird')
let _       = require('lodash')

module.exports = (server, config) => {
  const bellConfig = config.plugins.bell
  return new Promise( (resolve, reject) => {
    if(bellConfig.enabled) {
      if(config.main.databases[bellConfig.database] === null || config.main.databases[bellConfig.database] === undefined) return reject(new Error(`There is no configured database "${bellConfig.database}"`))
      let database = require('puffer').instances[config.main.databases[bellConfig.database].name]
      server.register([
        {
          register: require('hapi-notification-server'),
          options: {
            database,
            config: bellConfig
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

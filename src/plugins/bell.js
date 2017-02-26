"use strict"
let Promise = require('bluebird')
let _       = require('lodash')

module.exports = (server, config, system) => {
  return new Promise( (resolve, reject) => {
    if(config.enabled) {
      if(system.databases[config.database] === null || system.databases[config.database] === undefined) return reject(new Error(`There is no configured database "${config.database}"`))
      let database = require('puffer').instances[system.databases[config.database].name]
      server.register([
        {
          register: require('hapi-notification-server'),
          options: {
            database,
            config
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

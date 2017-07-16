"use strict"
let Promise = require('bluebird')
let _       = require('lodash')

module.exports = (server, config, system) => {
  return new Promise( (resolve, reject) => {
    if(config.enabled) {
      if(system.main.databases[config.database] === null || system.main.databases[config.database] === undefined) return reject(new Error(`There is no configured database "${config.database}"`))
      let database = require('puffer').instances[system.main.databases[config.database].name]
      server.register([
        {
          register: require('postoffice'),
          options: {
            database,
            config,
            url: system.main.url,
            scheme: system.main.scheme
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

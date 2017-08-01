"use strict"
let Promise = require('bluebird')
let _       = require('lodash')

module.exports = (server, config) => {
  const postofficeConfig = config.plugins.postoffice
  return new Promise( (resolve, reject) => {
    if(postofficeConfig.enabled) {
      if(config.main.databases[postofficeConfig.database] === null || config.main.databases[postofficeConfig.database] === undefined) return reject(new Error(`There is no configured database "${postofficeConfig.database}"`))
      let database = require('puffer').instances[config.main.databases[postofficeConfig.database].name]
      server.register([
        {
          register: require('postoffice'),
          options: {
            database,
            config: postofficeConfig,
            url: config.main.url,
            scheme: config.main.scheme
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

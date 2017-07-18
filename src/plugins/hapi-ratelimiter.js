"use strict"
let Promise = require('bluebird')

module.exports = (server, config, cache_config) => {
  cache_config = config.main.cache
  config = config.plugins['hapi-ratelimiter']
  return new Promise( (resolve, reject) => {
    if(config.enabled)
      server.register([
        {
          register: require('hapi-ratelimiter'),
          options: {
            redis: {
              host: cache_config.host,
              port: cache_config.port
            },
            namespace: config.namespace,
            global: {
              limit: config.limit,
              duration: config.duration
            }
          }
        }
      ], (err) => {
        if(err) return reject(err)
        resolve(true)
      })
    else resolve(true)
  })
}
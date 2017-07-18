"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  config = config.plugins['hapi-io']
  return new Promise( (resolve, reject) => {
    if (config.enabled)
      server.register([
        {
          register: require('hapi-io'),
          options: {
            auth: {
              mode: 'try',
              strategies : ['jwt', 'session']
            }
          }
        }
      ], (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    else resolve(true)
  })
}

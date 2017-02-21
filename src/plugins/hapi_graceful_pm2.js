"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  return new Promise( (resolve, reject) => {
    if (config.enabled)
      server.register([
        {
          register: require('hapi-graceful-pm2'),
          options: { timeout: 15000 }
        }
      ], (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    else resolve(true)
  })
}
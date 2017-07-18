"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  config = config.plugins.hapiman
  return new Promise((resolve, reject) => {
    if (config.enabled)
      server.register([
        {
          register: require('hapiman')
        }
      ], (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    else resolve(true)
  })
}

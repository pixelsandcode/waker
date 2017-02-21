"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  return new Promise( (resolve, reject) => {
    if(config.enabled) {
      let env = process.env.NODE_ENV || 'development'
      let lout_options = { endpoint: "/docs" }
      if(env != 'development')
        lout_options.auth = {
          strategy: 'session',
          mode: 'required',
          scope: ['developer']
        }
      server.register([
        {
          register: require('lout'),
          options: lout_options
        }
      ], (err) => {
        if(err) return reject(err)
        resolve(true)
      })
    }
    else resolve(true)
  })
}

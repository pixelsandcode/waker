"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  config = config.plugins.lout
  return new Promise( (resolve, reject) => {
    if(config.enabled) {
      let env = process.env.NODE_ENV || 'development'
      let lout_options = (config.options) ? config.options : { endpoint: "/docs" }
      if(config.auth_skip_enviornments.indexOf(env) < 0)
        lout_options.auth = {
          strategy: config.auth_strategy,
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

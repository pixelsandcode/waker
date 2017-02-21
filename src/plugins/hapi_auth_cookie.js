"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  return new Promise( (resolve, reject) => {
    if(config.enabled)
      server.register([
        { register: require('hapi-auth-cookie') }
      ], (err) => {
        if(err) return reject(err)
        server.auth.strategy('session', 'cookie', {
          password: config.password,
          isSecure: false,
          clearInvalid: true
        })
        resolve(true)
      })
    else resolve(true)
  })
}

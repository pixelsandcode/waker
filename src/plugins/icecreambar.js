"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  return new Promise( (resolve, reject) => {
    if(config.enabled)
      server.register([
        {
          register: require('icecreambar'),
          options: {
            accessToken: config.api_key,
            omittedResponseCodes: [400, 404]
          }
        }
      ], (err) => {
        if(err) return reject(err)
        console.log("Connected to Rollbar for exception reporting")
        resolve(true)
      })
    else resolve(true)
  })
}

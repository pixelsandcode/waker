"use strict"
let Promise = require('bluebird')

module.exports = (server, plugins) => {
  if(plugins.length < 1) return Promise.resolve(true)
  return new Promise( (resolve, reject) => {
    server.register(plugins, (err) => {
      if(err) return reject(err)
      resolve(true)
    })
  })
}

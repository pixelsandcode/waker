"use strict"
let Promise = require('bluebird')

module.exports = (server) => {

  server.method('redis.get', (key) => {
    let redis = server.plugins['hapi-redis'].client
    return new Promise((resolve, reject) => {
      redis.get(key, (err, reply) => {
        if (err) return reject(new Error(err))
        resolve(reply)
      })
    })
  })
}

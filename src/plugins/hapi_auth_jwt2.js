"use strict"
let Jwt = require('jsonwebtoken')
let Promise = require('bluebird')

let validate = (server, config) => {
  return (decoded, request, callback) => {
    let redis = server.plugins['hapi-redis'].client
    let key = `${config.cache_prefix}${request.auth.token}`
    redis.get(key, (err, value) => {
      if(err) return callback(null, true)
      callback(null, false)
    })
  }
}

let methods = (server, config) => {
  server.method('jwt.create', (data) => {
    return Jwt.sign(data, config.key, { expiresIn: config.expiration })
  })

  server.method('jwt.block', (token) => {
    let redis = server.plugins['hapi-redis'].client
    let key = `${config.cache_prefix}${token}`
    redis.multi().set(key, "blocked").expire(key, config.expiration).exec()
  })
}

module.exports = (server, config) => {
  return new Promise( (resolve, reject) => {
    if(config.enabled) {
      server.register([
        { register: require('hapi-auth-jwt2') }
      ], (err) => {
        if(err) return reject(err)
        server.auth.strategy('jwt', 'jwt', {
          key: config.key,
          validateFunc: validate(server, config),
          verifyOptions: { algorithms: [ 'HS256' ] }
        })
        methods(server, config)
        resolve(true)
      })
    }
    else resolve(true)
  })
}


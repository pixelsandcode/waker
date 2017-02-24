"use strict"
let Jwt     = require('jsonwebtoken')
let Promise = require('bluebird')
let moment  = require('moment')

let validate = (server, config) => {
  return (decoded, request, callback) => {
    let redis = server.plugins['hapi-redis'].client
    let key = `${config.cache_prefix}${request.auth.token}`
    redis.get(key, (err, value) => {
      if(err) return callback(err)
      if(value === null) return callback(null, true)
      callback(null, false)
    })
  }
}

let methods = (server, config) => {
  server.method('jwt.create', (data, expire = config.expiration) => {
    return Jwt.sign(data, config.key, { expiresIn: expire })
  })

  server.method('jwt.block', (token) => {
    let decoded = Jwt.decode(token, config.key)
    let redis = server.plugins['hapi-redis'].client
    let key = `${config.cache_prefix}${token}`
    let expiration = decoded.exp - moment().unix()
    redis.multi().set(key, "blocked").expire(key, expiration).exec()
  })

  server.method('jwt.renew', (token, expire = config.expiration) => {
    if(!config.allow_renew) throw new Error('Renewing tokens is not allowed')
    let decoded = Jwt.decode(token, config.key)
    if( (decoded.exp - moment().unix()) > config.renew_threshold ) return token
    server.methods.jwt.block(token, decoded)
    delete decoded.iat
    delete decoded.exp
    return server.methods.jwt.create(decoded, expire)
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
          verifyOptions: { algorithms: config.algorithms }
        })
        methods(server, config)
        resolve(true)
      })
    }
    else resolve(true)
  })
}

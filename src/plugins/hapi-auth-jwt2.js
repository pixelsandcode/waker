"use strict"
const Jwt     = require('jsonwebtoken')
const Promise = require('bluebird')
const moment  = require('moment')

const validate = (server, config) => {
  return (decoded, request, callback) => {
    let redis = server.plugins['hapi-redis'].client
    let key = `${config.cache_prefix}${request.auth.token}`
    redis.get(key, (err, value) => {
      if(err) return callback(err)
      if(!(decoded.exp == null || decoded.exp == undefined )) {
        if(value === null) return callback(null, true)
        callback(null, false)
      }
      else {
        if(value === null) return callback(null, false)
        callback(null, true)
      }
    })
  }
}

const methods = (server, config) => {

  server.method('jwt.create', (data, expire = config.expiration) => {
    return Jwt.sign(data, config.key, { expiresIn: expire, algorithm: config.algorithm })
  })

  server.method('jwt.createNonExpire', (data) => {
    let redis = server.plugins['hapi-redis'].client
    let token = Jwt.sign(data, config.key, { algorithm: config.algorithm })
    let key = `${config.cache_prefix}${token}`
    redis.set(key, 'valid')
    return token
  })

  server.method('jwt.block', (token) => {
    let decoded = Jwt.decode(token, config.key)
    let redis = server.plugins['hapi-redis'].client
    let key = `${config.cache_prefix}${token}`
    if(!(decoded.exp == null || decoded.exp == undefined )) {
      let expiration = decoded.exp - moment().unix()
      redis.multi().set(key, "blocked").expire(key, expiration).exec()
    }
    else {
      redis.del(key)
    }
  })

  server.method('jwt.renew', (token, expire = config.expiration) => {
    if(!token) throw new Error('Token is undefined')
    if(!config.allow_renew) throw new Error('Renewing tokens is not allowed')
    let decoded = Jwt.decode(token, config.key)
    if(decoded.exp == null || decoded.exp == undefined) return token
    if( (decoded.exp - moment().unix()) > config.renew_threshold ) return token
    server.methods.jwt.block(token, decoded)
    delete decoded.iat
    delete decoded.exp
    return server.methods.jwt.create(decoded, expire)
  })
}

const extentions = (server) => {

  server.ext('onPreResponse', (request, reply) => {
    const response = request.response;
    if (!response.isBoom && request.auth && request.auth.token)
      response.header('Authorization', server.methods.jwt.renew(request.auth.token))
    reply.continue();
  })
}

module.exports = (server, config) => {
  config = config.plugins['hapi-auth-jwt2']
  return new Promise( (resolve, reject) => {
    if(config.enabled) {
      server.register([
        { register: require('hapi-auth-jwt2') }
      ], (err) => {
        if(err) return reject(err)
        server.auth.strategy('jwt', 'jwt', {
          key: config.key,
          validateFunc: validate(server, config),
          verifyOptions: { algorithms: [config.algorithm] }
        })
        methods(server, config)
        extentions(server)
        resolve(true)
      })
    }
    else resolve(true)
  })
}

"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  return new Promise( (resolve, reject) => {
    let redis = require('redis').createClient(config.cache.port, config.cache.host)
    redis.get(`${config.app}.cacheserver`, (err, res) => {
      if(err)
        console.warn('Cache server is not working ...')
      else
        console.info(`Cache server is at ${config.cache.host}:${config.cache.port}`)
    })
    server.register ([
      { register: require('vision') },
      { register: require('inert') },
      {
        register: require('hapi-redis'),
        options: {
          connection: {
            host: config.cache.host,
            port: config.cache.port,
            opts: { parser: "javascript" }
          }
        }
      },
      {
        register: require('good'),
        options : {
          reporters: {
            console: [
              {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
              },
              {
                module: 'good-console'
              },
              'stdout'
            ]
          }
        }
      }
    ], (err) => {
      if (err) return reject(err)
      resolve(true)
    })
  })
}

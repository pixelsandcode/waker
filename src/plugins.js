"use strict"

module.exports = (server, config, waker_config) => {
  let plugins = waker_config.plugins
  require('./plugins/default')(server, config)
    .then( () => {
      return require('./plugins/icecreambar')(server, plugins.icecreambar)
    })
    .then( () => {
      return require('./plugins/lout')(server, plugins.lout)
    })
    .then( () => {
      return require('./plugins/hapi_io')(server, plugins.hapi_io)
    })
    .then( () => {
      return require('./plugins/hapi_graceful_pm2')(server, plugins.hapi_graceful_pm2)
    })
    .then( () => {
      return require('./plugins/hapi_auth_jwt2')(server, plugins.hapi_auth_jwt2)
    })
    .then( () => {
      return require('./plugins/hapi_auth_cookie')(server, plugins.hapi_auth_cookie)
    })
    .then( () => {
      return require('./plugins/hapi_ratelimiter')(server, plugins.hapi_ratelimiter, config.cache)
    })
    .then( () => {
      return require('./plugins/bell')(server, plugins.bell, config)
    })
    .then( () => {
      return require('./plugins/postoffice')(server, plugins.postoffice, config)
    })
    .then( () => {
      server.start( () => {
        console.info(`API server started at ${server.info.uri}`)
      })
    })
    .catch( (err) => {
      throw err
    })
    .done()
}
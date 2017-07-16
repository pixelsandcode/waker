"use strict"

module.exports = (waker, config) => {
  let plugins = config.plugins
  let server  = waker.server
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
      return require('./plugins/hapi_ratelimiter')(server, plugins.hapi_ratelimiter, config.main.cache)
    })
    .then( () => {
      return require('./plugins/bell')(server, plugins.bell, config)
    })
    .then( () => {
      return require('./plugins/postoffice')(server, plugins.postoffice, config)
    })
    .then( () => {
      return require('./plugins/user_plugins')(server, waker.customPlugins(server))
    })
    .then( () => {
      return waker.moduleLoader(server)
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
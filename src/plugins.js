"use strict"
const _       = require('lodash')
const Promise = require('bluebird')

module.exports = (waker, config) => {
  const server  = waker.server
  const plugins = config.plugins
  const promises = []
  promises.push(() => {
    return require('./plugins/default')(server, config)
  })
  _.each(plugins, (pluginsConfig, plugin) => {
    promises.push(() => {
      try {
        return require(`./plugins/${plugin}`)(server, config)
      }
      catch (err) {
        console.log(`WARNING: there is no plugin with name "${plugin}"`)
        return Promise.resolve(false)
      }
    })
  })
  Promise.reduce(promises, (total, func) => {
    return func()
  }, {}).then(() => {
    return require('./plugins/user_plugins')(server, waker.customPlugins(server))
  }).then(() => {
    return waker.moduleLoader(server, config)
  }).then(() => {
    server.start( (err) => {
      if(err) {
        console.log('API server no started due to an error:')
        console.log(err)
      }
      else
        console.info(`API server started at ${server.info.uri}`)
    })
    return true
  }).catch( (err) => {
    throw err
  }).done()
}
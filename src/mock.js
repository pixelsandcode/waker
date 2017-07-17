"use strict"
const Hapi = require('hapi')

module.exports = (config, model_enabled) => {
  const server = new Hapi.Server
  if(model_enabled) require('./helpers/model')(server, config)
  require('./helpers/json')(server)
  require('./decorators/reply')(server)
  return server
}

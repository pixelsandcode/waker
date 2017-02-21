"use strict"
let Hapi = require('hapi')


module.exports = (config, model_enabled) => {
  let server = new Hapi.Server
  if(model_enabled) require(`${__dirname}/methods/model`)(server, config)
  require(`${__dirname}/methods/json`)(server)
  require(`${__dirname}/decorators/reply`)(server)
  return server
}

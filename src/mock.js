"use strict"
let Hapi = require('hapi')


module.exports = (config, model_enabled) => {
  let server = new Hapi.Server
  if(model_enabled) require(`${__dirname}/helpers/model`)(server, config)
  require(`${__dirname}/helpers/json`)(server)
  require(`${__dirname}/decorators/reply`)(server)
  return server
}

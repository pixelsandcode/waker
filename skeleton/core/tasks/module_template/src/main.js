"use strict"
let Yaml = require('yml')

module.exports = (server, options, next) => {
  options.module = Yaml.load(`${__dirname}/defaults.yml`)
  server.route( require('./routes')(server, options) )
  require('./methods')(server, options)
  next()
}

"use strict"
let Yaml = require('yml')
let _    = require('lodash')

module.exports = (server, options, next) => {
  let defaults = Yaml.load(`${__dirname}/defaults.yml`)
  _.merge(options, defaults)
  server.route( require('./routes')(server, options) )
  require('./methods')(server, options)
  next()
}

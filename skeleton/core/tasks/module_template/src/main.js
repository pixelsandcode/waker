"use strict"
let Yaml = require('yml')
let _    = require('lodash')

module.exports = (server, options, next) => {
  let defaults = Yaml.load(`${__dirname}/defaults.yml`)
  _.merge(options, defaults)
  require('./routes')(server, options)
    .then( routes => {
      server.route(routes)
      require('./methods')(server, options)
      require('./environments/main')(server, options)
      next()
    })
    .catch( err => {
      console.log(err.message)
      next()
    })
}

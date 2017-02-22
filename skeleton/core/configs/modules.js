"use strict"
let Yaml = require('yml')
let _ = require('lodash')

module.exports = (server) => {
  let modules = Yaml.load(__dirname + "/modules.yml").modules
  if(modules === null) return
  let defaults = Yaml.load(__dirname + "/defaults.yml")
  let modules_register = _.map(modules, (module) => {
    return {
      register: require(module),
      options: defaults
    }
  })
  server.register(modules_register, (err) => {
    if(err) throw err
  })
}
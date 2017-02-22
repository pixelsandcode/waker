"use strict"
let _       = require('lodash')
let Promise = require('bluebird')
let Yaml    = require('yml')

module.exports = (server) => {
  let modules = Yaml.load(__dirname + "/modules.yml").modules
  let defaults = Yaml.load(__dirname + "/defaults.yml")
  return new Promise( (resolve, reject) => {
    if(modules === null) return resolve(true)
    let modules_register = _.map(modules, (module) => {
      return {
        register: require(module),
        options: defaults
      }
    })
    server.register(modules_register, (err) => {
      if(err) return reject(err)
      resolve(true)
    })
  })
}
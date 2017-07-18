const Yaml = require('yml')
const _    = require('lodash')
const fs   = require('fs')

const helpers = []
const files = fs.readdirSync(`${__dirname}`)
_.each(files, file => {
  const index = file.indexOf('.yml')
  if(index > -1) helpers.push(file.substr(0, index))
})
const config = {}
_.each(helpers, helper => {
  config[helper] = Yaml.load(`${__dirname}/${helper}.yml`)
})

module.exports = config

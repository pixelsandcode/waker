const Yaml = require('yml')
const _    = require('lodash')
const fs   = require('fs')

const plugins = []
const files = fs.readdirSync(`${__dirname}`)
_.each(files, file => {
  const index = file.indexOf('.yml')
  if(index > -1) plugins.push(file.substr(0, index))
})
const config = {}
_.each(plugins, plugin => {
  config[plugin] = Yaml.load(`${__dirname}/${plugin}.yml`)
})

module.exports = config

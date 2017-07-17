const Yaml     = require('yml')
const plugins  = require('./plugins/main')
const helpers  = require('./helpers/main')
const hapi     = Yaml.load(`${__dirname}/hapi.yml`)
const main     = Yaml.load(`${__dirname}/config.yml`)
const modules  = Yaml.load(`${__dirname}/modules.yml`).modules
const defaults = Yaml.load(`${__dirname}/defaults.yml`)

module.exports = { plugins, helpers, hapi, main, modules, defaults }

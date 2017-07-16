const Yaml = require('yml')
const _    = require('lodash')

const helpers = [
  'bell',
  'jobs',
  'model',
  'postoffice',
  'redis'
]

const config = {}
_.each(helpers, helper => {
  config[helper] = Yaml.load(`${__dirname}/${helper}.yml`)
})

module.exports = config
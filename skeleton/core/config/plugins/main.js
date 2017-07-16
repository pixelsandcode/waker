const Yaml = require('yml')
const _    = require('lodash')

const plugins = [
  'bell',
  'hapi-auth-cookie',
  'hapi-auth-jwt2',
  'hapi-graceful-pm2',
  'hapi-io',
  'hapi-ratelimiter',
  'icecreambar',
  'lout',
  'postoffice'
]

const config = {}
_.each(plugins, plugin => {
  config[plugin] = Yaml.load(`${__dirname}/${plugin}.yml`)
})

module.exports = config
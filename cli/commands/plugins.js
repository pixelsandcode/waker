"use strict"
let _     = require('lodash')
let chalk = require('chalk')

exports.command = 'plugins'
exports.desc = 'Shows version of plugins which is integrated to waker'
exports.builder = {}
exports.handler = function (argv) {
  let plugins = [
    'hapi-auth-cookie',
    'hapi-auth-jwt2',
    'hapi-graceful-pm2',
    'hapi-io',
    'hapi-notification-server',
    'hapi-ratelimiter',
    'hapi-redis',
    'icecreambar',
    'lout',
    'postoffice',
  ]
  let meta = require('../../package.json')
  console.log(chalk.bold.green(`hapi:`), chalk.white(`${meta.dependencies.hapi.slice(1)}`))
  _.each(plugins, (plugin) => {
    console.log(chalk.bold.yellow(`${plugin}:`), chalk.white(`${meta.dependencies[plugin].slice(1)}`))
  })
}
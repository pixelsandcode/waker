"use strict"

exports.command = 'version'
exports.desc = 'Shows version of waker'
exports.builder = {}
exports.handler = function (argv) {
  let meta = require('../../package.json')
  console.log(meta.version)
}
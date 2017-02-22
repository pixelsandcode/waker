"use strict"

exports.command = 'test'
exports.desc = 'test'
exports.builder = {}
exports.handler = function (argv) {
  console.log(__dirname)
}
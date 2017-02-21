"use strict"
let gulp    = require('gulp')
let nodemon = require('gulp-nodemon')

module.exports = () => {
  let nodemon_config = require('../nodemon.json')
  nodemon(nodemon_config)
    .on('restart', () => {
      console.log('restarted!')
    })
}
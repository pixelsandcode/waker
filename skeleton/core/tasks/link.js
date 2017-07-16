"use strict"
let Yaml = require('yml')
let _    = require('lodash')
let gulp = require('gulp')
let exec = require('gulp-exec')

module.exports = () => {
  let argv = require('yargs').alias('n', 'name').argv
  let reportOptions = {
    err: true,
    stderr: true,
    stdout: true
  }
  let root = '../../'
  let name = argv.name
  let modules = Yaml.load(__dirname + "/../config/modules.yml").modules
  if(!(name === null) && !(name === undefined)) {
    let current = modules[name]
    modules = {}
    modules[name] = current
  }
  let doer = ''
  if(argv.s) doer = 'sudo'
  console.log("This will take a while to install npms and link below plugin(s):")
  var cmds = _.map(modules, (n, p) => {
    console.log(` - ${n}`)
    return `cd ../modules/${p} && ${doer} npm install && ${doer} npm link . && cd ../../core && ${doer} npm link ${n}`
  })
  let cmd = cmds.join(' && ')
  gulp.src(root)
    .pipe( exec(cmd, {continueOnError: false}) )
    .pipe( exec.reporter(reportOptions) )
}
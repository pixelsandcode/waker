"use strict"
let Path     = require('path')
let fs       = require('fs')
let gulp     = require('gulp')
let exec     = require('gulp-exec')
let template = require('gulp-template')
let util     = require('gulp-util')
let Yaml     = require('yml')

module.exports = () => {
  let argv = require('yargs').alias('n', 'name').argv
  if(argv.name === null || argv.name === undefined) return console.warn("stage should be set to 'test' or 'production'")
  let root = Path.join(__dirname, '../../')
  let name = argv.name
  let cName = name.charAt(0).toUpperCase() + name.slice(1)
  let path_name = Path.join(root, `modules/${name}`)
  let templates = Path.join(root, 'core/tasks/module_template')
  let reportOptions = {
    err: true,
    stderr: true,
    stdout: true
  }
  let configs = Yaml.load(__dirname + "/../configs/configs.yml")
  let appName = configs.app
  let author = configs.author
  if( !fs.existsSync(path_name) ) {
    gulp.src(templates+'/**')
      .pipe( exec(`mkdir -p ${path_name}`, {continueOnError: false}) )
      .pipe( exec.reporter(reportOptions) )
      .pipe( template({ name, cName, appName, author }) )
      .pipe( gulp.dest(path_name) )
    //TODO Add new plugin's name to core/configs/plugins.yml
    //TODO run cd ../../core && gulp api:link -n ${plugin_name}
  }
  else
    util.log( util.colors.red(`${name} already exists!`) )
}

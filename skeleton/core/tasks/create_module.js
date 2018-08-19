"use strict"
let Path     = require('path')
let fs       = require('fs')
let gulp     = require('gulp')
let exec     = require('gulp-exec')
let template = require('gulp-template')
let colors   = require('ansi-colors')
let log      = require('fancy-log')
let Yaml     = require('yml')
let jsYaml   = require('js-yaml')

let update_modules = (app, module) => {
  let filename = Path.join(__dirname, '../config/modules.yml'),
    contents = fs.readFileSync(filename, 'utf8'),
    data     = jsYaml.load(contents)
  if(data.modules === null) data.modules = {}
  data.modules[module] = `${app}.${module}`
  fs.writeFileSync(filename, jsYaml.dump(data), 'utf8')
}

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
  let appName = "<%= app %>"
  if( !fs.existsSync(path_name) ) {
    gulp.src(templates+'/**')
      .pipe( exec(`mkdir -p ${path_name}`, {continueOnError: false}) )
      .pipe( exec.reporter(reportOptions) )
      .pipe( template({ name, cName }, {interpolate: /<%=interpolate_regex%>/g}) )
      .pipe( gulp.dest(path_name) )
      .on('end', () => {
        update_modules(appName, name)
        console.log("Please wait to link new module ...")
        gulp.src(root)
          .pipe( exec(`gulp api:link -n ${name}`, {continueOnError: false}) )
          .pipe( exec.reporter(reportOptions) )
      })
  }
  else
    log( colors.red(`Module with the name '${name}' already exists!`) )
}

"use strict"
let argv = require('yargs').argv
let gulp = require('gulp')
let gulp_help = require('gulp-help')(gulp, { aliases: ['h', '?', '-h'] })

if(argv.stage != 'deploy') {
  gulp_help.task("api:deploy", "Deploy to test or production servers. e.g. gulp api:deploy --stage=production", require('./tasks/deploy'), {
    options: {
      'stage': "set which deployment config should be loaded from deploy.yml."
    }
  })
  gulp_help.task("api:module:create", "Create a new module directory e.g. gulp api:module:create -n=blog", require('./tasks/create_module'), {
    options: {
      'name': "name of module to be created"
    }
  })
  gulp_help.task("api:run", "Running server", require('./tasks/run'))
}
gulp_help.task("api:link", "Link all plugin folders to main api folder as a dependency.", require('./tasks/link'), {
  options: {
    's': "it is a flag to show if the task should be run with sudo. to run with sudo do 'gulp api:link -s'",
    'n': "only link one plugin. e.g. gulp api:link -n blog"
  }
})

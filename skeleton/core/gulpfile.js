"use strict"
let argv = require('yargs').argv
let gulp = require('gulp')

if(argv.stage != 'deploy') {
  gulp.task("api:deploy", "Deploy to test or production servers. e.g. gulp api:deploy --stage=production", require('tasks/deploy'), {
    options: {
      'stage': "set which deployment config should be loaded from deploy.yml."
    }
  })
  gulp.task("api:module:create", "Create a new module directory e.g. gulp api:module:create -n=blog", require('tasks/create_module'), {
    options: {
      'name': "name of module to be created"
    }
  })
  gulp.task("api:run", "Running server", require('tasks/run'))
}
gulp.task("api:link", "Link all plugin folders to main api folder as a dependency.", require('task/link'), {
  options: {
    's': "it is a flag to show if the task should be run with sudo. to run with sudo do 'gulp api:link -s'",
    'n': "only link one plugin. e.g. gulp api:link -n blog"
  }
})

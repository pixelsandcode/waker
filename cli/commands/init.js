let figlet   = require('figlet')
let clear    = require('clear')
let chalk    = require('chalk')
let inquirer = require('inquirer')
let gulp     = require('gulp')
let template = require('gulp-template')
let exec     = require('gulp-exec')
let _        = require('lodash')
let merge    = require('merge-stream')
let Promise  = require('bluebird')

exports.command = 'init'
exports.desc = 'Create a new server'
exports.builder = {}
exports.handler = function (argv) {
  let path = argv.path
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('Waker', { horizontalLayout: 'full' })
    )
  );
  privates.ask()
    .then( (result) => {
      return privates.process(result, path)
    })
    .then( () => {
      console.log("Waker initiation finished!")
      return console.log("Please wait to install core npms ...")
      return privates.install_npms()
    })
    .then( () => {
      console.log("Core npms are installed. Enjoy! :)")
    })
}

let privates = {
  ask() {
    let questions = [
      {
        name: 'app',
        type: 'input',
        message: 'What is your app name?',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your app name:';
          }
        }
      },
      {
        name: 'url',
        type: 'input',
        message: 'What is your server url?',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter server url:';
          }
        }
      },
      {
        name: 'repository',
        type: 'input',
        message: 'What is your git repository?'
      },
      {
        name: 'author',
        type: 'input',
        message: 'What is the author name?',
        default: 'Waker'
      },
      {
        name: 'homepage',
        type: 'input',
        message: "What is the project's homepage?",
      },
      {
        name: 'scheme',
        type: 'input',
        message: "What is the app scheme?",
      },
      {
        name: 'server_sampling',
        type: 'input',
        message: "Enter server sampling :",
        default: 5000
      },
      {
        name: 'server_host',
        type: 'input',
        message: "Enter server host:",
        default: 'http://localhost'
      },
      {
        name: 'server_port',
        type: 'input',
        message: "Enter server port:",
        default: 3100
      },
      {
        name: 'server_timeout',
        type: 'input',
        message: "Enter server timeout:",
        default: 3000
      },
      {
        name: 'database_host',
        type: 'input',
        message: "Enter database host:",
        default: '127.0.0.1'
      },
      {
        name: 'database_name',
        type: 'input',
        message: "Enter database name:",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter database name:';
          }
        }
      },
      {
        name: 'searchengine_host',
        type: 'input',
        message: "Enter searchengin host:",
        default: 'localhost'
      },
      {
        name: 'searchengine_port',
        type: 'input',
        message: "Enter searchengin port:",
        default: 9200
      },
      {
        name: 'searchengine_name',
        type: 'input',
        message: "Enter searchengin name:",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter searchengin name:';
          }
        }
      },
      {
        name: 'cache_host',
        type: 'input',
        message: "Enter cache host:",
        default: '0.0.0.0'
      },
      {
        name: 'cache_port',
        type: 'input',
        message: "Enter cache port:",
        default: 6379
      }
    ];
    return inquirer.prompt(questions)
  },
  process(result, path = '.') {
    let src = `${__dirname}/../../skeleton/**`,
        dest = `${__dirname}/../../../../${path}`
    result.name = "<%= name %>"
    result.cName = "<%= cName %>"
    result.interpolate_regex = '<%=([\\s\\S]+?)%>'
    return privates.render(src, dest, result)
  },
  render(src, dest, data) {
    return new Promise( (resolve, reject) => {
      gulp.src(src, { dot: true })
        .pipe(template(data, {interpolate: /<%=([\s\S]+?)%>/g}))
        .pipe(gulp.dest(dest))
        .on('end', () => {
          resolve()
        })
    })
  },
  install_npms() {
    return new Promise( (resolve, reject) => {
      let root = `${__dirname}/../../../..`
      let reportOptions = {
        err: true,
        stderr: true,
        stdout: true
      }
      gulp.src(root)
        .pipe( exec(`cd core && npm install`, {continueOnError: false}) )
        .pipe( exec.reporter(reportOptions) )
        .on('end', () => {
          resolve()
        })
    })
  }
}
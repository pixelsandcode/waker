let figlet = require('figlet')
let clear = require('clear')
let chalk = require('chalk')
let inquirer = require('inquirer')

exports.command = 'init'
exports.desc = 'Create a new server'
exports.builder = {}
exports.handler = function (argv) {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('Waker', { horizontalLayout: 'full' })
    )
  );
  privates.ask(privates.process)
}

let privates = {
  ask(callback) {
    let questions = [
      {
        name: 'app',
        type: 'input',
        message: 'Enter your app name:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your app name';
          }
        }
      },
      {
        name: 'url',
        type: 'input',
        message: 'Enter your server url:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter server url';
          }
        }
      }
    ];
    inquirer.prompt(questions).then(callback);
  },
  process(result) {
    console.log(result)
  }
}
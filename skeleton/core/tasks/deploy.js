"use strict"
let Yaml = require('yml')

module.exports = () => {
  let argv = require('yargs').argv
  if(argv.stage === null || argv.stage === undefined) return console.warn("stage should be set to 'test', 'staging' or 'production'")
  let stage = argv.stage
  let config = Yaml.load(__dirname + "/deploy.yml", stage)
  // deployment script should go here
}

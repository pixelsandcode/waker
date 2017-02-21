#!/usr/bin/env node

let figlet = require('figlet')
let clear = require('clear')
let chalk = require('chalk')
let argv = require('yargs')
  .commandDir('commands')
  .demandCommand(1)
  .help()
  .argv
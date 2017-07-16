"use strict"
const config = require('./config/waker')
const waker = require('waker')(config)

waker.health(require('./health'))
waker.plugins(require('./plugins'))
waker.methods(require('./methods'))
waker.start()
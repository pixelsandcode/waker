"use strict"
let waker = require('waker')(`${__dirname}/configs`)

waker.health( require('./health') )

waker.start()
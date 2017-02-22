"use strict"
let waker = require('waker')('./configs')

let server = waker.server

server.register( require('configs/plugin') )

require('configs/methods')(server)
require('configs/modules')(server)

waker.health( require('./health') )

waker.start()
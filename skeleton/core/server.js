"use strict"
let waker = require('waker')(`${__dirname}/configs`)

let server = waker.server

server.register( require('./configs/plugins') )

require('./configs/methods')(server)
require('./configs/modules')(server)

waker.health( require('./health') )

waker.start()
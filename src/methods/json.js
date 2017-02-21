"use strict"
let JsonMask = require('json-mask')

module.exports = (server) => {

  server.method('json.mask', (data, mask) => {
    return JsonMask(data, mask)
  })
}

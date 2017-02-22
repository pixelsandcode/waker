"use strict"
let Boom = require('boom')

module.exports = (server) => {
  server.decorate('reply', 'nice', function(data, error = null) {
    return this.response( { data: data , error: error } )
  })

  server.decorate('reply', 'success', function(bool, data = null, error = null) {
    if(data === null || data === undefined) {
      return this.nice( { success: bool }, error)
    }
    data.success = bool
    return this.nice(data, error)
  })

  server.decorate('reply', 'fail', function(error) {
    return this.response( { data: { success: false }, error: error } )
  })

  server.decorate('reply', 'conflict', function(message) {
    return this.response( Boom.conflict(message) )
  })

  server.decorate('reply', 'not_found', function(message) {
    return this.response( Boom.notFound(message) )
  })

  server.decorate('reply', 'unauthorized', function(message) {
    return this.response( Boom.unauthorized(message) )
  })

  server.decorate('reply', 'badImplementation', function(message) {
    return this.response( Boom.badImplementation(message) )
  })

  server.decorate('reply', 'mask', function(data, mask) {
    return this.nice( server.methods.json.mask(data, mask) )
  })

  server.decorate('reply', 'cross_html', function(callback, content) {
    content = content.replace(/"/g, '\\"').replace(/(\r\n|\n|\r)/gm, '')
    return this.response(`${callback}(\"${content}\")`)
  })
}

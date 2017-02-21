"use strict"
let Boom = require('boom')

module.exports = (server) => {
  server.decorate('reply', 'nice', (data, error = null) => {
    return this.response( { data: data , error: error } )
  })

  server.decorate('reply', 'success', (bool, data = null, error = null) => {
    if(data === null || data === undefined) {
      return this.nice( { success: bool }, error)
    }
    data.success = bool
    return this.nice(data, error)
  })

  server.decorate('reply', 'fail', (error) => {
    return this.response( { data: { success: false }, error: error } )
  })

  server.decorate('reply', 'conflict', (message) => {
    return this.response( Boom.conflict(message) )
  })

  server.decorate('reply', 'not_found', (message) => {
    return this.response( Boom.notFound(message) )
  })

  server.decorate('reply', 'unauthorized', (message) => {
    return this.response( Boom.unauthorized(message) )
  })

  server.decorate('reply', 'badImplementation', (message) => {
    return this.response( Boom.badImplementation(message) )
  })

  server.decorate('reply', 'mask', (data, mask) => {
    return this.nice( server.methods.json.mask(data, mask) )
  })

  server.decorate('reply', 'cross_html', (callback, content) => {
    content = content.replace(/"/g, '\\"').replace(/(\r\n|\n|\r)/gm, '')
    return this.response(`${callback}(\"${content}\")`)
  })
}

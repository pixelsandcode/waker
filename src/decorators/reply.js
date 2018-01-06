"use strict"
const Boom = require('boom')
const _    = require('lodash')

const BoomTypes = [
  'badData',
  'badGateway',
  'badImplementation',
  'badRequest',
  'clientTimeout',
  'conflict',
  'entityTooLarge',
  'expectationFailed',
  'forbidden',
  'gatewayTimeout',
  'illegal',
  'internal',
  'lengthRequired',
  'locked',
  'notAcceptable',
  'notFound',
  'notImplemented',
  'paymentRequired',
  'preconditionFailed',
  'preconditionRequired',
  'proxyAuthRequired',
  'rangeNotSatisfiable',
  'resourceGone',
  'serverUnavailable',
  'tooManyRequests',
  'teapot',
  'unsupportedMediaType',
  'uriTooLong'
]

module.exports = (server) => {

  _.each(BoomTypes, type => {
    server.decorate('reply', type, function(message, data) {
      return this.response(Boom[type](message, data))
    })
  })

  server.decorate('reply', 'nice', function(data) {
    return this.response({ data })
  })

  server.decorate('reply', 'success', function(data = null) {
    if (data === null || data === undefined || data === true) {
      return this.nice({success: true})
    }
    else if (data === false) {
      return this.nice({success: false})
    }
    data.success = true
    return this.nice(data)
  })

  server.decorate('reply', 'fail', function(statusCode, message, data) {
    return this.response(Boom.create(statusCode, message, data))
  })

  server.decorate('reply', 'unauthorized', function(message, scheme, attributes) {
    return this.response(Boom.unauthorized(message, scheme, attributes))
  })

  server.decorate('reply', 'methodNotAllowed', function(message, data, allow) {
    return this.response(Boom.methodNotAllowed(message, data, allow))
  })

  server.decorate('reply', 'mask', function(data, mask) {
    return this.nice(server.methods.json.mask(data, mask))
  })

  server.decorate('reply', 'crossHtml', function(callback, content) {
    content = content.replace(/"/g, '\\"').replace(/(\r\n|\n|\r)/gm, '')
    return this.response(`${callback}(\"${content}\")`)
  })

  server.decorate('reply', 'error', function(err = {}, data = {}) {
    const api = {api: `${this.request.method.toUpperCase()} ${this.request.path}`}
    if (err.isBoom) {
      err.data = _.merge(data, api)
      return this.response(err)
    }
    _.merge(data, api)
    return this.response(Boom.badImplementation('something went wrong', data))
  })
}

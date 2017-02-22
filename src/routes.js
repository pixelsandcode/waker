"use strict"

module.exports = (server, config, health_script) => {
  return [
    {
      method: 'GET',
      path: '/health',
      handler: (request, reply) => {
        health_script(server, config, (result) => {
          reply.nice(result)
        })
      }
    }
  ]
}
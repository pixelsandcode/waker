module.exports = (server) => {

  server.ext('onPreResponse', function(request, reply) {
    const response = request.response
    if(!response.isBoom) return reply.continue()
    if(response.data) response.output.payload.error = response.data
    return reply(response)
  })
}
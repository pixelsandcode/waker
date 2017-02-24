module.exports = (server, options) => {

  let <%= cName %> = require('../models/main')(server, options)

  return {
    list (request, reply) {
      let <%= name %> = new <%= cName %>()
      reply.nice(<%= name %>.list())
    } 
  }
}

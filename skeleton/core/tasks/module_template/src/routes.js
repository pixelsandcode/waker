module.exports = (server, options) => {
  let <%= cName %> = require('./handlers/main')(server, options)

  return [
    {
      method: 'GET',
      path: '/v1/<%= name %>',
      config: {
        handler: <%= cName %>.list,
        description: 'TODO: System generated this',
        tags: ['system', 'TODO']
      }
    }
  ]
}

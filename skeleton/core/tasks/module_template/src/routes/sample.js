module.exports = (server, options) => {

  const <%= cName %> = require('../handlers/sample')(server, options)
  const <%= cName %>Validator = require('../validators/sampleValidator')(options)

  return [
    {
      method: 'GET',
      path: '/v1/<%= name %>',
      config: {
        handler: <%= cName %>.list,
        validate: <%= cName %>Validator.list,
        description: 'TODO: System generated this',
        tags: ['system', 'TODO']
      }
    }
  ]
}

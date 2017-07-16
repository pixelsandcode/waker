const _ = require('lodash')

module.exports = (server, options) => {
  const entities = [
    'sample'
  ]
  let routes = []
  _.each(entities, entity => {
    routes = _.concat(routes, require(`./routes/${entity}`)(server, options))
  })
  return routes
}
const _ = require('lodash')

module.exports = (server, config) => {
  const helpers = config.helpers
  _.each(helpers, (helperConfig, helper) => {
    try {
      if(helperConfig.enabled) require(`./helpers/${helper}`)(server, config)
    }
    catch (err) {
      console.log(`WARNING: there is no helper with name "${helper}"`)
    }
  })
  require('./helpers/json')(server)
}
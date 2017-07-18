const _       = require('lodash')
const fs      = require('fs')
const Promise = require('bluebird')

module.exports = (server, options) => {
  return new Promise((resolve, reject) => {
    fs.readdir(`${__dirname}/routes`, (err, files) => {
      if (err) return reject(new Error('there is an issue when trying to load routes'))
      let routes = []
      _.each(files, file => {
        if(file.indexOf('.js') > -1)
          routes = _.concat(routes, require(`./routes/${file}`)(server, options))
      })
      resolve(routes)
    })
  })
}

"use strict"

module.exports = (server, options) => {
  const env = process.env.NODE_ENV || 'development'
  try {
    require(`./${env}`)(server, options)
  }
  catch(err) {
    console.log(`WARNING: ${__dirname}/${env}.js doesn't exist.`)
  }
}


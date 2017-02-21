"use strict"
let Promise = require('bluebird')
let request = require('request')

module.exports = (server, config) => {

  server.method('bell.post', (data) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/messages`,
        body: JSON.stringify(data),
        method: 'POST'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on bell server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })

  server.method('bell.register', (data) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/users`,
        body: JSON.stringify(data),
        method: 'POST'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on bell server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })
}
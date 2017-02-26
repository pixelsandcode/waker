"use strict"
let Promise = require('bluebird')
let request = require('request')

module.exports = (server, config) => {

  server.method('postoffice.post', (trigger_point, data) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/v1/triggers/${trigger_point}/post`,
        body: JSON.stringify(data),
        method: 'POST'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on postoffice server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })

  server.method('postoffice.subscribe', (trigger_point, data) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/v1/triggers/${trigger_point}/subscribe`,
        body: JSON.stringify(data),
        method: 'POST'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on postoffice server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })

  server.method('postoffice.delete_all_subscribers', (trigger_point) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/v1/triggers/${trigger_point}/subscribers`,
        method: 'DELETE'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on postoffice server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })

  server.method('postoffice.subscribers', (trigger_point) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/v1/triggers/${trigger_point}/subscribers`,
        method: 'GET'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on postoffice server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })

  server.method('postoffice.unsubscribe', (email, data) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/v1/emails/${email}/unsubscribe`,
        body: JSON.stringify(data),
        method: 'POST'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on postoffice server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })

  server.method('postoffice.unsubscribe_list', (email) => {
    return new Promise( (resolve, reject) => {
      let options = {
        url: `${config.host}:${config.port}/v1/emails/${email}/unsubscribe_list`,
        method: 'GET'
      }
      request(options, (err, response, body) => {
        if(err)
          return reject( new Error(`something went wrong on postoffice server request: ${err}`) )
        resolve( JSON.parse(body) )
      })
    })
  })
}

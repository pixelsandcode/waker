"use strict"
const Boom = require('boom')

module.exports = (server, config) => {

  server.method('model.base', (db) => {
    if(config.main.databases[db] === null || config.main.databases[db] === undefined) throw new Error(`Database ${db} is not set on configs`)
    let source = null
    if(config.main.databases[db].mock)
      source = new require('puffer')({}, true)
    else
      source = require('puffer').instances[config.main.databases[db].name]
    const base = require('odme').CB({
      source: source,
      host: config.main.searchengine[db].host,
      port: config.main.searchengine[db].port,
      index: config.main.searchengine[db].name
    })
    return class extended extends base {

      static get (key, mask) {
        return super.get(key, mask)
          .then(result => {
            if (result instanceof Error) {
              if (result.isBoom) throw result
              console.log('Model Error (get):\n', result)
              throw Boom.badImplementation(`Something went wrong while getting object with key '${key}'.`)
            }
            return result
          })
      }

      create (mask) {
        return super.create(mask)
          .then(result => {
            if (result instanceof Error) {
              if (result.isBoom) throw result
              console.log('Model Error (create):\n', result)
              throw Boom.badImplementation("Something went wrong while creating object.")
            }
            return result
          })
      }

      update (mask) {
        return super.update(mask)
          .then(result => {
            if (result instanceof Error) {
              if (result.isBoom) throw result
              console.log('Model Error (update):\n', result)
              throw Boom.badImplementation(`Something went wrong while updating object with key ${this.key}.`)
            }
            return result
          })
      }

      remove (key) {
        return super.remove(key)
          .then(result => {
            if (result instanceof Error) {
              if (result.isBoom) throw result
              console.log('Model Error (remove):\n', result)
              throw Boom.badImplementation(`Something went wrong while removing object with key ${key}.`)
            }
            return result
          })
      }

      static find (keys, mask, asObject) {
        return super.find(keys, mask, asObject)
          .then(result => {
            if (result instanceof Error) {
              if (result.isBoom) throw result
              console.log('Model Error (find):\n', result)
              throw Boom.badImplementation("Something went wrong while finding data.")
            }
            return result
          })
      }
    }
  })
}

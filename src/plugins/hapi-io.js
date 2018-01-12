"use strict"
let Promise = require('bluebird')

module.exports = (server, config) => {
  config = config.plugins['hapi-io']
  return new Promise( (resolve, reject) => {
    if (config.enabled)
      server.register([
        {
          register: require('hapi-io'),
          options: {
            auth: {
              mode: 'try',
              strategies : ['jwt']
            },
            socketio: {
              handlePreflightRequest: function (req, res) {
                var headers = {
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                  'Access-Control-Allow-Origin': req.headers.origin,
                  'Access-Control-Allow-Credentials': true
                };
                res.writeHead(200, headers);
                res.end();
              }
            }
          }
        }
      ], (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    else resolve(true)
  })
}

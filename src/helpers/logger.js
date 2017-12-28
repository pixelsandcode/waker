const chalk  = require('chalk')
const moment = require('moment')

module.exports = (server, config) => {

  server.method('logger.info', (...messages) => {
    server.methods.logger.log('info', ...messages)
  })

  server.method('logger.success', (...messages) => {
    server.methods.logger.log('success', ...messages)
  })

  server.method('logger.error', (...messages) => {
    server.methods.logger.log('error', ...messages)
  })

  server.method('logger.log', (type, ...messages) => {
    let color
    switch(type) {
      case 'info':
        color = chalk.blue
        break
      case 'error':
        color = chalk.red
        break
      case 'success':
        color = chalk.green
        break
    }
    const time = moment().format('YYMMDD/HHmmss.SSS')
    console.log(color(`${time}, ${messages.join(' ')}`))
  })
}

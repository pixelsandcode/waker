"use strict"

module.exports = (server, options) => {
  return class <%= cName %> {
    list () {
      return {total: 0, list: []}
    }
  }
}
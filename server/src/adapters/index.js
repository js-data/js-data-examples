'use strict'

module.exports = function (adapter) {
  return require(`./${adapter}`)
}

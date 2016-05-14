'use strict'

const Promise = require('bluebird')

/**
 * This little generator simply saves us a lot of boilerplate code.
 *
 * @param {Function} method Method to wrap and make safe.
 * @return {Function} Wrapped method.
 */
exports.makeSafe = function (method) {
  return function (req, res, next) {
    return Promise.try(function () {
      return method(req, res, next)
    }).catch(next)
  }
}

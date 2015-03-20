/*
 * gulp-cordova
 * https://github.com/rcsole/gulp-cordova
 *
 * Copyright (c) 2015 Ricard Solé Casas
 * Licensed under the MIT license.
 */

var wrapper = require('./wrapper')
var gutil = require('gulp-util')
var chalk = require('chalk')
var map = require('map-stream')
var async = require('async')

var GULP_CORDOVA = '[gulp-cordova]'

module.exports = function(commands, options) {

  var endStream = null
  var opts = options || {}
  opts.rootDir = process.cwd()

  function cordovaError(message) {
    return new gutil.PluginError({
      plugin: GULP_CORDOVA,
      message: message
    })
  }

  function cordovaStream(file, callback) {
    endStream = callback

    if (!file.contents && !commands) {
      return endStream(new cordovaError('Please provide either a config file or a command object'))
    }

    if (file.contents && !commands) {
      commands = JSON.parse(file.contents.toString()).cordova
    }

    if (!Array.isArray(commands)) {
      return endStream(new cordovaError('Commands must be an array'))
    }

    if (!Array.isArray(commands[0])) {
      commands = [commands]
    }

    async.eachSeries(commands, function(command, next) {
      execute(command, next)
    }, function(err) {

      if (!opts.silent) {
        gutil.log(GULP_CORDOVA,
          'Going back to root directory:',
          opts.rootDir
        )
      }

      process.chdir(opts.rootDir)
      endStream()
    })
  }

  function execute(command, next) {

    if (opts.cwd) {
      process.chdir(opts.cwd)
    }

    if (!opts.silent) {
      gutil.log(GULP_CORDOVA,
        'Running command:', chalk.magenta('cordova'), chalk.cyan(command.join(' ')),
        'in', process.cwd())
    }

    wrapper(command, next)
  }

  return map(cordovaStream)
}

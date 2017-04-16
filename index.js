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

module.exports = function(commands, opts,cordova_options) {

  var endStream = null
  opts = opts || {}
  opts.rootDir = process.cwd()
  cordova_options=cordova_options||[]
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
      cordova_options=JSON.parse(file.contents.toString()).cordova_options||[]
    }

    if (!Array.isArray(commands)) {
      return endStream(new cordovaError('Commands must be an array'))
    }

    if (!Array.isArray(commands[0])) {
      commands = [commands]
    }

    async.eachOfSeries(commands, function(command,index, next) {
      execute(command,index, next)
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

  function execute(command,index, next) {
    var options={};
    if (opts.cwd) {
      process.chdir(opts.cwd)
    }

    if (!opts.silent) {
      gutil.log(GULP_CORDOVA,
        'Running command:', chalk.magenta('cordova'), chalk.cyan(command.join(' ')),
        'in', process.cwd())
    }
    if(cordova_options[index]){
      options=cordova_options[index];
    }

    wrapper(command,options, next)
  }

  return map(cordovaStream)
}

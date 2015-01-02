/*
 * gulp-cordovacli
 * https://github.com/rcsole/gulp-cordovacli
 *
 * Copyright (c) 2015 Ricard Solé Casas
 * Licensed under the MIT license.
 */

var spawn = require('win-spawn')
var gutil = require('gulp-util')
var chalk = require('chalk')
var map = require('map-stream')
var eachAsync = require('each-async')

module.exports = function(commands, options) {

  var opts = options || {}

  function cordova(file, cb) {
    if (!file && !commands) {
      throw new gutil.PluginError('[gulp-cordovacli]', 'Please provide either a config file or a command object')
    }

    if (file && !commands) {
      commands = JSON.parse(file.contents.toString()).cordova
    }

    if (!Array.isArray(commands)) {
      throw new gutil.PluginError('[gulp-cordovacli]', 'commands must be an array')
    }

    if (!Array.isArray(commands[0])) {
      commands = [commands]
    }

    eachAsync(commands, function(command, i, next) {
      runCommand(command, next, cb)
    }, cb)
  }

  function runCommand(command, next, cb) {
    gutil.log('[gulp-cordovacli]', 'Running command:', chalk.cyan(command.join(' ')))

    var opts = options ? options : {}
    var cordova = spawn('cordova', command)

    cordova.stdout.setEncoding('utf-8')
    cordova.stderr.setEncoding('utf-8')

    cordova.stdout.on('data', function(data) {
      if (opts.verbose) {
        gutil.log('[gulp-cordovacli]', chalk.blue(data))
      }
    })

    cordova.stderr.on('data', function(data) {
      if (opts.verbose) {
        gutil.log('[gulp-cordovacli]', chalk.yellow(data))
      }

      return cb()
    })

    cordova.on('close', function() {
      next()
    })
  }

  return map(cordova)
}

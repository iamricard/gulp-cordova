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

module.exports = function(command, options) {

  function runCommand(file, cb) {
    gutil.log('[gulp-cordovacli]', 'Running command:', chalk.cyan(command.join(' ')))

    var opts = options ? options : {}
    var cordova = spawn('cordova', command)

    cordova.stdout.setEncoding('utf-8')
    cordova.stderr.setEncoding('utf-8')

    cordova.stdout.on('data', function(data) {
      if (opts.verbose) {
        gutil.log('[gulp-cordovacli]', chalk.blue(data))
      }

      return cb()
    })

    cordova.stderr.on('data', function(data) {
      if (opts.verbose) {
        gutil.log('[gulp-cordovacli]', chalk.yellow(data))
      }

      return cb()
    })
  }

  return map(runCommand)
}

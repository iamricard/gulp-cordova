/*
 * Extracted from https://github.com/apache/cordova-cli/blob/master/src/cli.js
 *
 * gulp-cordova
 * https://github.com/rcsole/gulp-cordova
 *
 * Copyright (c) 2015 Ricard Solé Casas
 * Licensed under the MIT license.
 */

var cordova_lib = require('cordova-lib')
var _ = require('lodash')
var cordova = cordova_lib.cordova
var events = cordova_lib.events

function cordovaWrapper(commandArray, next) {

  var cmd = commandArray[0]
  var subcommand
  var msg
  var known_platforms = Object.keys(cordova_lib.cordova_platforms)

  if (!cordova.hasOwnProperty(cmd)) {
    return callback('Cordova does not know ' + cmd)
  }

  var opts = {
    platforms: [],
    options: [],
    verbose: false,
    silent: true,
    browserify: false
  }

  if (cmd == 'emulate' || cmd == 'build' || cmd == 'prepare' || cmd == 'compile') {

    opts.platforms = commandArray.slice(1)
    var badPlatforms = _.difference(opts.platforms, known_platforms)
    if (!_.isEmpty(badPlatforms)) {
      return callback('Unknown platforms: ' + badPlatforms.join(', '))
    }

    // CB-6976 Windows Universal Apps. Allow mixing windows and windows8 aliases
    opts.platforms = opts.platforms.map(function(platform) {
      // allow using old windows8 alias for new unified windows platform
      if (platform == 'windows8' && fs.existsSync('platforms/windows')) {
        return 'windows'
      }
      // allow using new windows alias for old windows8 platform
      if (platform == 'windows' &&
        !fs.existsSync('platforms/windows') &&
        fs.existsSync('platforms/windows8')) {
        return 'windows8'
      }
      return platform
    })

    cordova.raw[cmd].call(null, opts).done(next)
  } else if (cmd == 'run') {
    return callback('Run is not supported right now')
  } else if (cmd == 'serve') {
    var port = commandArray[1]
    cordova.raw.serve(port).done(next)
  } else if (cmd == 'create') {
    var cfg = {}
      // If we got a fourth parameter, consider it to be JSON to init the config.
    if (commandArray[4]) {
      cfg = JSON.parse(commandArray[4])
    }

    // create(dir, id, name, cfg)
    cordova.raw.create(commandArray[1] // dir to create the project in
      , commandArray[2] // App id
      , commandArray[3] // App name
      , cfg
    ).done(next)
  } else {
    // platform/plugins add/rm [target(s)]
    subcommand = commandArray[1] // sub-command like "add", "ls", "rm" etc.
    var targets = commandArray.slice(2) // array of targets, either platforms or plugins
    cordova.raw[cmd](subcommand.toString(), targets).done(next)
  }

}

module.exports = cordovaWrapper

var gulp = require('gulp')
var assert = require('assert')
var fs = require('fs')
var File = require('vinyl')
var rm = require('rimraf')

var cordova = require('../')

describe('gulp-cordovacli', function() {

  beforeEach(function(done) {
    gulp.src('.')
      .pipe(cordova(['create', 'test/test', 'test.test.test', 'Test'], { silent: true }))
      .on('close', function() {
        process.chdir('test/test')
        done()
      })
  })

  afterEach(function(done) {
    process.chdir('../../')
    rm('test/test', function() {
      done()
    })
  })

  describe('using a configuration file', function() {
    var CONFIG_FILE = '../fixtures.json'

    it('should run the commands from the configuration file', function(done) {
      gulp.src(CONFIG_FILE)
        .pipe(cordova(false, { silent: true }))
        .on('close', function() {
          assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    })

    it('explicit commands should override configuration file', function(done) {
      gulp.src(CONFIG_FILE)
        .pipe(cordova(['build'], { silent: true }))
        .on('close', function() {
          assert.equal(false, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    })
  })

  describe('without a configuration file', function() {
    it('should run the given commands', function (done) {
      gulp.src('.')
        .pipe(cordova(['platforms', 'add', 'browser'], { silent: true }))
        .on('close', function() {
          assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    });

    it('should run multiple commands', function (done) {
      gulp.src('.')
        .pipe(cordova([[
            "plugin",
            "add",
            "org.apache.cordova.device"
          ],[
            "platform",
            "add",
            "browser"
          ]], { silent: true }))
        .on('close', function() {
          assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))
          assert.equal(true, fs.existsSync(__dirname + '/test/plugins/org.apache.cordova.device'))

          done()
        })
    })
  })
})

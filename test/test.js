var gulp = require('gulp')
var assert = require('assert')
var fs = require('fs')
var File = require('vinyl')
var rm = require('rimraf')

var cordova = require('../')

describe('gulp-cordovacli', function() {
  this.timeout(8000)

  describe('using a configuration file', function() {
    var CONFIG_FILE = '../fixtures.json'

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

    it('should run the commands from the configuration file', function(done) {
      gulp.src(CONFIG_FILE)
        .pipe(cordova(false, { silent: true }))
        .on('close', function() {
          assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    })

    it('should not use the config file if commands are passed', function(done) {
      gulp.src(CONFIG_FILE)
        .pipe(cordova(['plugins', 'add', 'org.apache.cordova.device'], { silent: true }))
        .on('close', function() {
          assert.equal(false, fs.existsSync(__dirname + '/test/platforms/browser'))

          done()
        })
    })
  })
})

process.env.NODE_ENV = 'test'

var child = require('child_process')

var gulp = require('gulp')
var assert = require('assert')
var fs = require('fs')
var File = require('vinyl')
var rm = require('rimraf')

var cordova = require('../')

describe('gulp-cordova', function() {
  var CONFIG_FILE = './test/fixtures.json'

  it('should emit an error if no commands and no file are provided', function(done) {
    gulp.src('.')
      .pipe(cordova())
      .on('error', function(err) {
        assert(err)
        done()
      })
  })

  beforeEach(function(done) {
    gulp.src('.')
      .pipe(cordova(['create', 'test/test', 'test.test.test', 'Test'], { silent: true }))
      .on('close', function() {
        done()
      })
  })

  afterEach(function(done) {
    rm('./test/test', function() {
      done()
    })
  })

  after(function () {
    child.exec('rm -rf ./test/test');
  })

  it('should run the commands from the configuration file', function(done) {
    gulp.src(CONFIG_FILE)
      .pipe(cordova(false, { silent: true, cwd: __dirname + '/test' }))
      .on('close', function() {
        assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))

        done()
      })
  })

  it('explicit commands should override configuration file', function(done) {
    gulp.src(CONFIG_FILE)
      .pipe(cordova([[
        'platform',
        'add',
        'browser'
      ],
      [
        'platform',
        'rm',
        'browser'
      ]], { silent: true, cwd: __dirname + '/test' }))
      .on('close', function() {
        assert.equal(false, fs.existsSync(__dirname + '/test/platforms/browser'))

        done()
      })
  })

  it('should run the given commands', function (done) {
    gulp.src('.')
      .pipe(cordova(['platforms', 'add', 'browser'], { silent: true, cwd: __dirname + '/test' }))
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
        ]], { silent: true, cwd: __dirname + '/test' }))
      .on('close', function() {
        assert.equal(true, fs.existsSync(__dirname + '/test/platforms/browser'))
        assert.equal(true, fs.existsSync(__dirname + '/test/plugins/org.apache.cordova.device'))

        done()
      })
  })
})

gulp-cordova
============

[![Dependency Status](https://david-dm.org/rcsole/gulp-cordova.svg)](https://david-dm.org/rcsole/gulp-cordova)
[![Gittip](http://img.shields.io/gittip/rcsole.svg?style=flat)](https://www.gittip.com/rcsole/)
[![CircleCI](https://circleci.com/gh/rcsole/gulp-cordova/tree/master.svg?style=svg)](https://circleci.com/gh/rcsole/gulp-cordova/tree/master)

[![NPM](https://nodei.co/npm/gulp-cordova.png?downloads=true&stars=true&downloadRank=true)](https://nodei.co/npm/gulp-cordova/)

This aims to provide a very basic interface to be used in a gulp build system,
bare in mind this doesn't provide much really, it's just to abstract the spawn
process and the such.

~~I have no idea how to test this so that's why it has no tests, I would love it
if anyone out there would help me out figuring out how to test this.~~ I've
written a couple of tests but I am pretty sure they are not enough, and they
might not even be good. Help is still welcome!

As with many node projects, send a PR if it is accepted you're added to the
repo with full-access rights. If there are any bugs open an issue and we can
figure out a solution! Same thing for feature requests or any other kind of
problems you might have.

**Why this exists:** I'm building a project with cordova and I find it cumbersome
to have to go to the CLI every time and run `emulate` or `build` or `whatever`,
so I figured I'd write a short plugin. It's useful to me, I hope you find it
useful as well :) If you want to write a plugin that you think deserves this
name let me know and I might free it if I agree!

**Why this might be useful to you:** Initialise a project without a script,
instead use what you already use for the rest of your javascript projects. You
could also use it in watch tasks where you want to re-run the `emulate` command
when something specifically is updated.

API
---

There's two ways to use this plugin, via a JSON configuration file or just
passing parameters to the `cordova` function. **Note:** If you pass commands as a param
the file contents will be ignored.

### cordova()
Usage example:

```javascript
gulp.task('cordova:init', function() {
  gulp.src('./package.json')
    .pipe(cordova())
})
```

Notice I'm using `package.json` for demonstration purposes, but you may use any
`JSON` file. Just make sure the file has a key `cordova` and that key contains
an array with the command or an array of arrays for multiple commands.
`plugin_options` is optional.Few plugins expect additional parameters while adding,in that case please make sure it is in synch with `cordova` array list.Please keep a empty {} object for commands like platform,plugins in plugin_options list.
```json
file: config.json/package.json/xxx.json
{
  "cordova": [
    [
      "platform",
      "add",
      "ios",
      "android",
      "browser"
    ],
    [
      "plugins",
      "add",
      "org.apache.cordova.device",
      "org.apache.cordova.geolocation",
      "org.apache.cordova.console"
    ],
    [
      "plugin",
      "add",
      "cordova-plugin-googleplus"
    ]
  ],
  "plugin_options": [
    {},
    {},
    {
      "cli_variables":{
        "REVERSED_CLIENT_ID":"com.googleusercontent.apps.uniqueId"
      },
      "save":true
    }
  ]
}
```

### cordova(command, options,plugin_options)

#### command (optional)
Type: `array`

Values: In theory, any cordova cli command. I haven't tested all of them.

Eg:
```javascript
// ...
.pipe(cordova(['plugins', 'add', 'org.apache.cordova.battery-status', 'org.apache.cordova.device-motion']))
// ...
```

#### options (optional)
##### verbose
Type: `boolean`

Default: `false`
#### plugin_options ( optional )
Type: `array`

Few plugins expect additional parameters while adding,in that case please make sure it is in synch with `cordova` array list.Please keep a empty {} object for commands like platform,plugins in plugin_options list.

Eg:(side by side representation, wont work if copy and pasted).
```
"cordova": [                                plugin_options:[
    [                                         {},
      "platform",
      "add",
      "ios",
      "android",
      "browser"
    ],

    [                                         {},
      "plugins",
      "add",
      "org.apache.cordova.device",
      "org.apache.cordova.geolocation",
      "org.apache.cordova.console"
    ],

    [                                         {
      "plugin",                                 "cli_variables":{
      "add",                                       "REVERSED_CLIENT_ID":"com.googleusercontent.apps.uniqueId"
      "cordova-plugin-googleplus"               }
    ]                                           "save":true
                                              }

];                                          ];
```

##### cwd EXPERIMENTAL
Type: `string`

Default: `undefined`

You can use this to run the specified `cordova` command in a specific directory.

### Run command is not supported for the time being

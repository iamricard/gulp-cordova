gulp-cordovacli
===============

This aims to provide a very basic interface to be used in a gulp build system,
bare in mind this doesn't provide much really, it's just to abstract the spawn
process and the such.

I have no idea how to test this so that's why it has no tests, I would love it
if anyone out there would help me out figuring out how to test this.

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

### cordova(command, options)

#### command (required)
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

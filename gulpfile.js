var gulp = require('gulp');
var nconf = require('nconf');

// setup config
gulp.config = nconf.argv();

gulp.config.defaults({
  'nodemon': {
    script: 'server',
    watch: ['server/**/*'],
    ext: 'js json',
    ignore: ['server/public/**/*'],
    env: {
      NODE_ENV: 'development'
    }
  },
  'browserify': {
    src: './server/public/js/index.js',
    dest: './server/public/app.js',
    extentions: ['.hbs'],
    debug: true,
    watch: true
  }
});

// register single tasks
require('./task');

// register aliases
gulp.task('default', ['browserify', 'nodemon']);

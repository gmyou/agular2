// NOTE: I previously suggested doing this through Grunt, but had plenty of problems with
// my set up. Grunt did some weird things with scope, and I ended up using nodemon. This
// setup is now using Gulp. It works exactly how I expect it to and is WAY more concise.
var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    less = require('gulp-less'),
    node;
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./src/tsconfig.json');

const Dist = 'dist';

gulp.task('less', function () {
  return gulp.src('./src/assets/less/**/*.less')
    .pipe(less({
      paths: [ './src/less/includes' ]
    }))
    .pipe(gulp.dest('./dist/public/css'));
});

gulp.task('ts', function() {
    var tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(Dist));
});

gulp.task('pug', function() {
  return gulp.src(['./src/**/*.pug'])
    .pipe(gulp.dest(Dist));
});

gulp.task('njk', function() {
  return gulp.src(['./src/**/*.njk'])
    .pipe(gulp.dest(Dist));
});

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', ['ts'], function() {
  if (node) node.kill();
  node = spawn('node', [`${Dist}/main.js`], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('build', ['less', 'pug', 'njk', 'ts'], function() {
});

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', ['less', 'pug', 'njk', 'server'], function() {
  gulp.watch(['./src/**/*.ts'], ['server']);
  gulp.watch(['./src/**/*.less'], ['less']);
  gulp.watch(['./src/**/*.pug'], ['pug']);
  gulp.watch(['./src/**/*.njk'], ['njk']);
  // Need to watch for sass changes too? Just add another watch call!
  // no more messing around with grunt-concurrent or the like. Gulp is
  // async by default.
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
});

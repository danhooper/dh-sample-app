var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;

gulp.task('backend', function() {
    nodemon({
        script: './backend/index.js',
        ext: 'js'
    }).on('restart', function() {
        console.log('backend restarted');
    });
});

gulp.task('mongo', function(cb) {
    exec('mongod --dbpath ./backend/db/', function(err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
});

gulp.task('default', ['mongo', 'backend']);

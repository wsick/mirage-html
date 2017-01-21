var gulp = require('gulp'),
    runSequence = require('run-sequence');

module.exports = function (meta) {
    gulp.task('default', function (callback) {
        runSequence('build', 'pack-normal', callback);
    });
};
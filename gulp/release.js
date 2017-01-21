var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence');

module.exports = function (meta) {
    gulp.task('pack-normal', function() {
        gulp.src(['lib/mirage/dist/mirage.js', 'dist/mirage-html.plugin.js'])
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(concat('mirage-html.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('pack-min', function () {
        gulp.src(['lib/mirage/dist/mirage.min.js', 'dist/mirage-html.plugin.min.js'])
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(concat('mirage-html.min.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    });

    gulp.task('release', function(callback) {
        runSequence('bump', ['default', 'min'], ['pack-normal', 'pack-min'], callback);
    });
    gulp.task('release-nobump', function(callback) {
        runSequence(['default', 'min'], ['pack-normal', 'pack-min'], callback);
    });
    gulp.task('release-minor', function (callback) {
        runSequence('bump-minor', ['default', 'min'], ['pack-normal', 'pack-min'], callback);
    });
    gulp.task('release-major', function (callback) {
        runSequence('bump-major', ['default', 'min'], ['pack-normal', 'pack-min'], callback);
    });
};
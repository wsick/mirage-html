var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2');

module.exports = function (meta) {
    gulp.task('build', function () {
        var tsResult = gulp.src(meta.buildfiles)
            .pipe(sourcemaps.init())
            .pipe(ts({
                target: 'ES5',
                out: meta.name + '.plugin.js',
                declaration: true,
                removeComments: true
            }));

        return merge([
            tsResult.dts.pipe(gulp.dest('./dist')),
            tsResult.js
                .pipe(sourcemaps.write('./', {sourceRoot: `/${meta.name}/`, debug: true}))
                .pipe(gulp.dest('./dist'))
        ]);
    });
};
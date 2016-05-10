var gulp = require('gulp'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    runSequence = require('run-sequence'),
    minifyHtml = require('gulp-minify-html'),
    htmlreplace = require('gulp-html-replace');

gulp.task('css', require('./tasks/css'));
gulp.task('js', require('./tasks/js'));
gulp.task('i18n', require('./tasks/i18n'));
gulp.task('cssPage', require('./tasks/cssPage'));
gulp.task('jade-ru', require('./tasks/jade').ru);
gulp.task('jade-en', require('./tasks/jade').en);

var gzip = require('gulp-gzip');
gulp.task('gzip', function (cb) {
    return gulp.src('dist/js/datepicker.min.js')
        .pipe(gzip())
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function () {
    return del(['prod']);
});

gulp.task('html', function () {
    return gulp.src(['docs/index.html', 'docs/index-ru.html'])
        .pipe(htmlreplace({
            'css': 'dist/css/datepicker.min.css',
            'js': 'dist/js/datepicker.min.js',
            'i18n': 'dist/js/i18n/datepicker.en.js'
        }))
        .pipe(minifyHtml())
        .pipe(gulp.dest('prod/'));
});

gulp.task('build', ['css', 'js', 'i18n', 'cssPage', 'gzip', 'html'], function() {
    gulp.src('docs/css/**/*').pipe(gulp.dest('prod/css'));
    gulp.src('docs/js/**/*').pipe(gulp.dest('prod/js'));
    gulp.src('docs/img/**/*').pipe(gulp.dest('prod/img'));

    return gulp.src('dist/**/*')
        .pipe(gulp.dest('prod/dist'));
});

gulp.task('cleanBuild', function() {
    return runSequence('clean', 'build');
});

gulp.task('watch', function () {
    livereload.listen();

    gulp.watch('src/sass/*.scss', ['css']).on('change', function (file) {
        livereload.changed(file)
    });

    gulp.watch('src/js/**/*.js', ['js']).on('change', function (file) {
        livereload.changed(file)
    });

    gulp.watch('docs/sass/*.scss', ['cssPage']).on('change', function (file) {
        livereload.changed(file)
    });

    gulp.watch('docs/jade/**/*.jade', ['jade-ru', 'jade-en']).on('change', function (file) {
        livereload.changed(file)
    });
});





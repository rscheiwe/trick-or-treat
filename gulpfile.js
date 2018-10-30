/* jshint node: true, devel: true, esversion: 6 */

'use strict';

const argv = require('yargs').argv;
const eslint = require('gulp-eslint');
const git = require('gulp-git');
const gulp = require('gulp');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const prettify = require('gulp-jsbeautifier');
const runSequence = require('run-sequence');

gulp.task('lint', function () {
    return gulp.src(['./*.js', './*.json', 'test/*.js'])
        .pipe(eslint({
            configFile: './.eslintrc.json',
            fix: true,
        }))
        .pipe(eslint.formatEach());
});

gulp.task('prettify', function () {
    gulp.src(['./*.js', './*.json', 'test/*.js'])
        .pipe(prettify({
            indent_level: 4,
            indent_char: ' ',
            js: {
                indent_level: 2,
                file_types: ['.js', '.json'],
            },
        }))
        .pipe(prettify.reporter({
            verbosity: prettify.report.ALL,
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('prettify-validate', function () {
    return gulp.src(['./*.js', './*.json', 'test/*.js'])
        .pipe(prettify.validate())
        .pipe(prettify.reporter());
});

gulp.task('mocha', function () {
    return gulp.src(['test/*.js'], {
        read: false,
    }).pipe(mocha({
        reporter: 'list',
    })).on('error', gutil.log);
});

gulp.task('init', function () {
    console.log(argv.m);
});

gulp.task('add', function () {
    console.log('adding...');
    return gulp.src('.')
        .pipe(git.add());
});

gulp.task('commit', function () {
    console.log('commiting');
    if (argv.m) {
        return gulp.src('.')
            .pipe(git.commit(argv.m));
    }
});

gulp.task('push', function () {
    console.log('pushing...');
    if (argv.t) {
        git.push(argv.t, 'master', function (err) {
            if (err) throw err;
        });
    } else {
        git.push('origin', 'master', function (err) {
            if (err) throw err;
        });
    }
});

gulp.task('gitsend', function () {
    runSequence('add', 'commit', 'push');
});
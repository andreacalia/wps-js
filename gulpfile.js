'use strict';

const _ = require('lodash');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const fs = require('fs');
const del = require('del');

// Load package.json
var packageInfo = JSON.parse(fs.readFileSync('./package.json'));

// Clean the dist directory
gulp.task('_clean-dist-directory', function() {

   return del(['./dist/*']);

});

// Copy only the needed schemas into asset directory. It will reduce the size of generated browseryfied package
gulp.task('_schema-build', function() {

    const data = [
        {
            dir:  __dirname + '/node_modules/ogc-schemas/lib/',
            input: 'WPS_2_0.js',
            output: 'WPS_2_0.js'
        },
        {
            dir:  __dirname + '/node_modules/ogc-schemas/lib/',
            input: 'OWS_2_0.js',
            output: 'OWS_2_0.js'
        },
        {
            dir:  __dirname + '/node_modules/w3c-schemas/lib/',
            input: 'XLink_1_0.js',
            output: 'XLink_1_0.js'
        }
    ];

    const outputDir = __dirname + '/src/main/asset/schema/';
    const template = _.template('/* File generated using Gulp. Do not modify it manually */ <%= input %>');

    _.forEach(data, (schemaInfo) => {

        const schemaText = fs.readFileSync(schemaInfo.dir + schemaInfo.input, 'utf8');
        const schemaFile = template({input: schemaText});
        fs.writeFileSync(outputDir + schemaInfo.output, schemaFile, 'utf8');

        console.log(schemaInfo.output, 'successfully created');

    });

});

// browserify the main entry point of the library
gulp.task('_build-browser', ['_clean-dist-directory'], function() {

    return browserify({
            entries: './src/main/wps-js.js',
            insertGlobals : true,
            standalone: packageInfo.extra.externalName,
            debug: true
        })
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source(packageInfo.name + '-' + packageInfo.version + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/browser/'))
        .pipe(uglify())
        .pipe(rename(packageInfo.name + '-' + packageInfo.version + '.min.js'))
        .pipe(gulp.dest('./dist/browser/'));

});

// Make node module
gulp.task('_build-node', ['_clean-dist-directory'], function() {

    return gulp.src('./src/main/**/*.js')
        .pipe(debug())
        //.pipe(babel())
        //.pipe(uglify()) // TODO Decide whether to uglify or not the node distribution
        .pipe(gulp.dest('./dist/node/'));

});

// Build task
gulp.task('build-browser', ['_schema-build', '_build-browser']);
gulp.task('build-node', ['_schema-build', '_build-node']);
gulp.task('build-all', ['_schema-build', '_build-node', '_build-browser']);
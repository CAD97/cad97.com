
declare function require(name: string): any;

import { Gulpclass, Task, SequenceTask } from "gulpclass/Decorators";

var del = require("del");
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");

@Gulpclass()
export class Gulpfile {
    
    @Task("clean")
    clean(cb: Function) {
        return del(["www/**"], cb)
    }
    
    @Task("copy-files")
    copyFiles() {
        return gulp.src(["src/**/*.html",
                         "src/**/*.css",
                         "src/**/*.ico",
                         "src/**/*.png"])
                   .pipe(gulp.dest("www"));
    }
    
    @Task("build", ["clean", "copy-files"])
    build() {
        return browserify({
            basedir: '.',
            debug: false,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        }).plugin(tsify)
          .bundle()
          .pipe(source("bundle.js"))
          .pipe(buffer())
          .pipe(uglify())
          .pipe(sourcemaps.write("./"))
          .pipe(gulp.dest("www"));
    }
    
    @Task("dev-build", ["clean", "copy-files"])
    dev() {
        return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        }).plugin(tsify)
          .bundle()
          .pipe(source("bundle.js"))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(uglify())
          .pipe(sourcemaps.write("./"))
          .pipe(gulp.dest("www"));
    }
    
}


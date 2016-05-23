
declare function require(name: string): any;

import { Gulpclass, Task, SequenceTask } from "gulpclass/Decorators";

var del = require("del");
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var buffer = require("vinyl-buffer");

@Gulpclass(gulp)
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
    
    @Task("transpile")
    transpile() {
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
          .pipe(gulp.dest("www"));
    }
    
    @SequenceTask("build")
    build() {
        return ["clean", ["copy-files", "transpile"]];
    }
}


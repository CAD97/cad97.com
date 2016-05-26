
/// <reference path="typings/index.d.ts" />

declare function require(name: string): any;

import { Gulpclass, Task, SequenceTask } from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as uglify from "gulp-uglify";
import * as del from "del";

var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var buffer = require("vinyl-buffer");

var paths = {
    ts: ['src/main.ts'],
    html: 'src/**/*.html',
    css: 'src/**/*.css',
    img: ['src/**/*.ico', 'src/**/*.png'],
    dest: 'www'
}

@Gulpclass(gulp)
export class Gulpfile {
    
    @Task("clean")
    clean(cb: Function) {
        return del([paths.dest + '/**'], cb);
    }
    
    @Task("copy-html")
    copyHTML() {
        return gulp.src(paths.html)
                   .pipe(gulp.dest(paths.dest));
    }
    
    @Task("copy-css")
    copyCSS() {
        return gulp.src(paths.css)
                   .pipe(gulp.dest(paths.dest));
    }
    
    @Task("copy-img")
    copyICO() {
        return gulp.src(paths.img)
                   .pipe(gulp.dest(paths.dest));
    }
    
    @Task("transpile")
    transpile() {
        return browserify({
            basedir: '.',
            debug: false,
            entries: paths.ts,
            cache: {},
            packageCache: {}
        }).plugin(tsify)
          .bundle()
          .pipe(source("bundle.js"))
          .pipe(buffer())
          .pipe(uglify())
          .pipe(gulp.dest(paths.dest));
    }
    
    @Task("watch")
    watch() {
        gulp.watch(paths.ts, ['transpile']);
        gulp.watch(paths.html, ['copy-html']);
        gulp.watch(paths.css, ['copy-css']);
        gulp.watch(paths.img, ['copy-img']);
    }
    
    @SequenceTask("copy-static")
    copyFiles() {
        return [['copy-html', 'copy-css', 'copy-img']];
    }
    
    @SequenceTask("build")
    build() {
        return [["copy-static", "transpile"]];
    }
    
    @SequenceTask("clean-build")
    cleanBuild() {
        return ["clean", "build"];
    }
    
    @SequenceTask("start-dev")
    startDev() {
        return ['clean-build', 'watch'];
    }
}


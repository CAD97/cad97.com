
/// <reference path="typings/index.d.ts" />

import { Gulpclass, Task, SequenceTask } from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as ts from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as uglify from "gulp-uglify";
import * as del from "del";

const tsProject = ts.createProject('tsconfig.json');

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
        return gulp.src(paths.ts)
                   .pipe(sourcemaps.init({}))
                   .pipe(ts(tsProject))
                   .pipe(uglify())
                   .pipe(sourcemaps.write("./"))
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


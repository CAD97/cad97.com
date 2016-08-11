/// <reference path="typings/index.d.ts" />

import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as uglify from "gulp-uglify";
import * as mustache from "gulp-mustache";
import * as del from "del";
import ReadWriteStream = NodeJS.ReadWriteStream;

const tsProject = typescript.createProject("tsconfig.json");

const paths = {
    ts: ["src/main.ts"],
    mustache: {
        sources: "src/**/*.mustache",
        json: "src/mustache.json"
    },
    css: "src/**/*.css",
    img: ["src/**/*.ico", "src/**/*.png"],
    dest: "www"
};

// noinspection JSUnusedGlobalSymbols
@Gulpclass(gulp)
export class Gulpfile {

    // noinspection JSMethodCanBeStatic
    @Task("clean")
    clean(cb: Function) {
        return del([paths.dest + "/**"], cb);
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @Task("serve-html")
    serveHTML() {
        return gulp.src(paths.mustache.sources)
            .pipe(mustache(paths.mustache.json, {extension: ".html"}) as ReadWriteStream)
            // mustache twice because I need to nest the templates
            .pipe(mustache(paths.mustache.json, {extension: ".html"}) as ReadWriteStream)
            .pipe(gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @Task("copy-css")
    copyCSS() {
        return gulp.src(paths.css)
            .pipe(gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @Task("copy-img")
    copyICO() {
        return gulp.src(paths.img)
            .pipe(gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic
    @Task("transpile")
    transpile() {
        return gulp.src(paths.ts)
            .pipe(sourcemaps.init({}))
            .pipe(typescript(tsProject) as ReadWriteStream)
            .pipe(uglify() as ReadWriteStream)
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic
    @Task("watch")
    watch() {
        gulp.watch(paths.ts, ["transpile"]);
        gulp.watch([paths.mustache.sources, paths.mustache.json], ["serve-html"]);
        gulp.watch(paths.css, ["copy-css"]);
        gulp.watch(paths.img, ["copy-img"]);
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @SequenceTask("copy-static")
    copyFiles() {
        return [["serve-html", "copy-css", "copy-img"]];
    }

    // noinspection JSMethodCanBeStatic
    @SequenceTask("build")
    build() {
        return [["copy-static", "transpile"]];
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @SequenceTask("clean-build")
    cleanBuild() {
        return ["clean", "build"];
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @SequenceTask("start-dev")
    startDev() {
        return ["clean-build", "watch"];
    }
}


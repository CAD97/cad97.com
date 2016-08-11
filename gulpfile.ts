
/// <reference path="typings/index.d.ts" />

import { Gulpclass, Task, SequenceTask } from "gulpclass/Decorators";
import * as Gulp from "gulp";
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
@Gulpclass(Gulp)
export class Gulpfile {

    // noinspection JSMethodCanBeStatic
    @Task("clean")
    clean(cb: Function) {
        return del([paths.dest + "/**"], cb);
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @Task("serve-html")
    serveHTML() {
        return Gulp.src(paths.mustache.sources)
                   .pipe(mustache(paths.mustache.json, {extension: ".html"}) as ReadWriteStream)
                   .pipe(mustache(paths.mustache.json, {extension: ".html"}) as ReadWriteStream)
                   // mustache twice because I need to nest the templates
                   .pipe(Gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @Task("copy-css")
    copyCSS() {
        return Gulp.src(paths.css)
                   .pipe(Gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    @Task("copy-img")
    copyICO() {
        return Gulp.src(paths.img)
                   .pipe(Gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic
    @Task("transpile")
    transpile() {
        return Gulp.src(paths.ts)
                   .pipe(sourcemaps.init({}))
                   .pipe(typescript(tsProject) as ReadWriteStream)
                   .pipe(uglify() as ReadWriteStream)
                   .pipe(sourcemaps.write("./"))
                   .pipe(Gulp.dest(paths.dest));
    }

    // noinspection JSMethodCanBeStatic
    @Task("watch")
    watch() {
        Gulp.watch(paths.ts, ["transpile"]);
        Gulp.watch([paths.mustache.sources, paths.mustache.json], ["serve-html"]);
        Gulp.watch(paths.css, ["copy-css"]);
        Gulp.watch(paths.img, ["copy-img"]);
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


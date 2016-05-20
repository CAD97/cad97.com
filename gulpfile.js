
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var exec = require('child_process').exec;
var paths = {
    pages: ['src/*.html']
};

var browserifyArgs = {
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}

var watchedBrowserify = watchify(browserify(browserifyArgs).plugin(tsify));

gulp.task("copy-html", () => {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("www"));
});

gulp.task("lite-server", (cb) => {
    exec("npm run lite", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("www"));
}

gulp.task("build", ["copy-html"], () => {
    browserify(browserifyArgs)
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("www"));
});

gulp.task("dev", ["copy-html"], () => {
    bundle();
    watchedBrowserify.on("update", bundle);
    watchedBrowserify.on("log", gutil.log);
});

gulp.task("default", ["copy-html", "dev", "lite-server"]);


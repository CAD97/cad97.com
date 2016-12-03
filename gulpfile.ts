import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as uglify from "gulp-uglify";
import * as mustache from "gulp-mustache";
import * as del from "del";
import * as runSequence from "run-sequence";
import * as fs from "fs";
import ReadWriteStream = NodeJS.ReadWriteStream;

const tsProject = typescript.createProject("tsconfig.json");

const paths = {
    ts: ["src/main.ts"],
    mustache: {
        sources: "src/**/*.mustache",
        fragments: {
            "drawer": fs.readFileSync("fragments/drawer.mustache"),
            "footer": fs.readFileSync("fragments/footer.mustache"),
            "header": fs.readFileSync("fragments/header.mustache"),
            "htmlhead": fs.readFileSync("fragments/htmlhead.mustache"),
            "navigation": fs.readFileSync("fragments/navigation.mustache")
        }
    },
    css: "src/**/*.css",
    img: ["src/**/*.ico", "src/**/*.png"],
    dest: "www"
};


gulp.task("clean", (cb) => {
    return del([paths.dest + "/**"], cb);
});

gulp.task("serve-html", () => {
    return gulp.src(paths.mustache.sources)
        .pipe(mustache(paths.mustache.fragments, {extension: ".html"}) as ReadWriteStream)
        // mustache twice so I can nest tags
        .pipe(mustache(paths.mustache.fragments, {extension: ".html"}) as ReadWriteStream)
        .pipe(gulp.dest(paths.dest));
});

gulp.task("copy-css", () => {
    return gulp.src(paths.css)
        .pipe(gulp.dest(paths.dest));
});

gulp.task("copy-img", () => {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.dest));
});

gulp.task("transpile", () => {
    return gulp.src(paths.ts)
        .pipe(sourcemaps.init({}))
        .pipe(tsProject())
        .pipe(uglify() as ReadWriteStream)
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dest));
});

gulp.task("watch", () => {
    gulp.watch(paths.ts, ["transpile"]);
    gulp.watch([paths.mustache.sources], ["serve-html"]);
    // TODO: watch paths.mustache.fragments
    gulp.watch(paths.css, ["copy-css"]);
    gulp.watch(paths.img, ["copy-img"]);
});

gulp.task("copy-static", ["serve-html", "copy-css", "copy-img"]);

gulp.task("build", ["copy-static", "transpile"]);

gulp.task("clean-build", (cb) => runSequence("clean", "build", cb));

gulp.task("start-dev", (cb) => runSequence("clean-build", "watch", cb));

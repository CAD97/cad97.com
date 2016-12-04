import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as uglify from "gulp-uglify";
import * as mustachePipe from "gulp-mustache";
import * as mustache from "mustache";
import * as del from "del";
import * as runSequence from "run-sequence";
import * as fs from "fs";
import * as htmlmin from "gulp-htmlmin";
import ReadWriteStream = NodeJS.ReadWriteStream;

const tsProject = typescript.createProject("tsconfig.json");

const paths = {
    ts: [],
    mustache: {
        sources: "src/**/*.mustache",
        fragments: {
            "mdl-drawer": "fragments/mdl-drawer.mustache",
            "mdl-footer": "fragments/mdl-footer.mustache",
            "mdl-header": "fragments/mdl-header.mustache",
            "html-head": "fragments/html-head.mustache",
            "mdl-navigation": "fragments/mdl-navigation.mustache"
        },
        json: ["fragments/cells.json"]
    },
    css: "src/**/*.css",
    img: ["src/**/*.ico", "src/**/*.png"],
    dest: "www"
};

const view = (() => {
    const view = {};
    Object.keys(paths.mustache.fragments).forEach((key) => {
        view[key] = fs.readFileSync(paths.mustache.fragments[key]).toString();
    });
    Object.keys(view).forEach((key) => {
        view[key] = mustache.render(view[key], view);
    });
    const jsonViews = paths.mustache.json.map((path) => JSON.parse(fs.readFileSync(path).toString()));
    jsonViews.forEach((jsonView) => Object.keys(jsonView).forEach((key) => view[key] = jsonView[key]));
    return view;
})();

gulp.task("clean", (cb) => {
    return del([paths.dest + "/**"], cb);
});

gulp.task("serve-html", () => {
    return gulp.src(paths.mustache.sources)
        .pipe(mustachePipe(view, {extension: ".html"}) as ReadWriteStream)
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            preserveLineBreaks: true,
            removeComments: true,
        }))
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
    gulp.watch(paths.mustache.json.concat(paths.mustache.sources), ["serve-html"]);
    gulp.watch(Object.keys(paths.mustache.fragments).map((key) => paths.mustache.fragments[key]), ["serve-html"]);
    gulp.watch(paths.css, ["copy-css"]);
    gulp.watch(paths.img, ["copy-img"]);
});

gulp.task("copy-static", ["serve-html", "copy-css", "copy-img"]);

gulp.task("build", ["copy-static", "transpile"]);

gulp.task("clean-build", (cb) => runSequence("clean", "build", cb));

gulp.task("start-dev", (cb) => runSequence("clean-build", "watch", cb));

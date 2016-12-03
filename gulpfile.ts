import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import * as uglify from "gulp-uglify";
import * as mustachePipe from "gulp-mustache";
import * as mustache from "mustache";
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
            "drawer": "fragments/drawer.mustache",
            "footer": "fragments/footer.mustache",
            "header": "fragments/header.mustache",
            "htmlhead": "fragments/htmlhead.mustache",
            "navigation": "fragments/navigation.mustache"
        }
    },
    css: "src/**/*.css",
    img: ["src/**/*.ico", "src/**/*.png"],
    dest: "www"
};

const view = (() => {
    const temp1 = {};
    Object.keys(paths.mustache.fragments).forEach((key) => {
        temp1[key] = fs.readFileSync(paths.mustache.fragments[key]).toString();
    });
    const temp2 = {};
    Object.keys(temp1).forEach((key) => {
        temp2[key] = mustache.render(temp1[key], temp1);
    });
    return temp2;
})();

gulp.task("clean", (cb) => {
    return del([paths.dest + "/**"], cb);
});

gulp.task("serve-html", () => {
    return gulp.src(paths.mustache.sources)
        .pipe(mustachePipe(view, {extension: ".html"}) as ReadWriteStream)
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
    gulp.watch([paths.mustache.sources].concat(Object.keys(paths.mustache.fragments).map((key) => paths.mustache.fragments[key])), ["serve-html"]);
    gulp.watch(paths.css, ["copy-css"]);
    gulp.watch(paths.img, ["copy-img"]);
});

gulp.task("copy-static", ["serve-html", "copy-css", "copy-img"]);

gulp.task("build", ["copy-static", "transpile"]);

gulp.task("clean-build", (cb) => runSequence("clean", "build", cb));

gulp.task("start-dev", (cb) => runSequence("clean-build", "watch", cb));

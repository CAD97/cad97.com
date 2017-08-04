import * as browsersync from "browser-sync";
import * as del from "del";
import * as fs from "fs";
import * as gulp from "gulp";
import * as less from "gulp-less";
import * as mustache from "gulp-mustache";
import * as typescript from "gulp-typescript";
import * as memoize from "memoizee";

const browser = browsersync.create();
const tsProject = typescript.createProject("tsconfig.json");
const paths = {
    less: ["src/css/**/*.less"],
    mustache: {
        partials: {
            dir: "src/partials/",
            view: memoize(() => {
                let view: { [id: string]: string } = {};
                let files = fs.readdirSync(paths.mustache.partials.dir);
                files.forEach((file) => {
                    view[file.replace(/\.[^/.]+$/, "")] =
                        fs.readFileSync(`src/partials/${file}`).toString();
                });
                return view;
            }),
        },
        sources: ["src/html/**/*.mustache"],
    },
    ts: ["src/js/**/*.ts"],
    www: "www",
};

gulp.task("clean", () => {
    return del([paths.www + "/**/*"]);
});

gulp.task("serve-css", () => {
    return gulp.src(paths.less)
        .pipe(less({
            paths: paths.less,
        }))
        .pipe(gulp.dest(paths.www))
        .pipe(browser.stream());
});

gulp.task("serve-html", () => {
    return gulp.src(paths.mustache.sources)
        .pipe(mustache(paths.mustache.partials.view(), {extension: ".html"}, paths.mustache.partials.view()))
        .pipe(gulp.dest(paths.www))
        .pipe(browser.stream());
});

gulp.task("serve-js", () => {
    return gulp.src(paths.ts)
        .pipe(tsProject())
        .pipe(gulp.dest(paths.www))
        .pipe(browser.stream());
});

gulp.task("build", gulp.parallel("serve-css", "serve-html", "serve-js"));
gulp.task("default", gulp.series("clean", "build", function browserify() {
    browser.init({
        https: true,
        server: {
            baseDir: paths.www,
        },
    });

    gulp.watch(paths.less, gulp.parallel("serve-css"));
    gulp.watch(paths.mustache.sources, gulp.parallel("serve-html"));
    gulp.watch(paths.mustache.partials.dir, gulp.parallel("serve-html"));
    gulp.watch(paths.ts, gulp.parallel("serve-js"));
}));

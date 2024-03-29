import * as browsersync from "browser-sync";
import * as del from "del";
import * as fs from "fs";
import * as gulp from "gulp";
import * as gutil from "gulp-util";
import * as less from "gulp-less";
import * as mustache from "gulp-mustache";
import * as typescript from "gulp-typescript";
import * as postcss from "gulp-postcss";
import * as autoprefixer from "autoprefixer";
import * as memoize from "memoizee";
import { Transform } from "stream";

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
    img: ["src/img/**/*"],
    www: "www",
};

gulp.task("clean", () => {
    return del([paths.www + "/**/*"]);
});

gulp.task("serve-css", () => {
    const l = less({
        paths: paths.less,
    });
    l.on('error', (e) => {
        gutil.log(e);
        l.end();
    });

    return gulp.src(paths.less)
        .pipe(l)
        .pipe(postcss([autoprefixer()]) as Transform)
        .pipe(gulp.dest(paths.www))
        .pipe(browser.stream());
});

gulp.task("serve-html", () => {
    paths.mustache.partials.view.delete();
    return gulp.src(paths.mustache.sources)
        .pipe(mustache(paths.mustache.partials.view(), {extension: ".html"}, paths.mustache.partials.view()))
        .pipe(gulp.dest(paths.www))
        .pipe(browser.stream());
});

gulp.task("serve-img", () => {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.www))
        .pipe(browser.stream());
});

gulp.task("serve-js", () => {
    return gulp.src(paths.ts)
        .pipe(tsProject())
        .pipe(gulp.dest(paths.www))
        .pipe(browser.stream());
});

gulp.task("build", gulp.parallel("serve-css", "serve-html", "serve-js", "serve-img"));
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
    gulp.watch(paths.img, gulp.parallel("serve-img"));
    gulp.watch(paths.ts, gulp.parallel("serve-js"));
}));

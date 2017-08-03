import * as del from "del";
import * as fs from "fs";
import * as gulp from "gulp";
import * as mustache from "gulp-mustache";
import * as ts from "gulp-typescript";
import * as memoize from "memoizee";

const tsProject = ts.createProject("tsconfig.json");
const paths = {
    mustache: {
        partials: memoize(() => {
            let view: { [id: string]: string } = {};
            let files = fs.readdirSync("src/partials/");
            files.forEach((file) => {
                view[file.replace(/\.[^/.]+$/, "")] =
                    fs.readFileSync(`src/partials/${file}`).toString();
            });
            return view;
        }),
        sources: "src/html/**/*.mustache",
    },
    ts: "src/js/**/*.ts",
    www: "www",
};

gulp.task("clean", () => {
    return del([paths.www + "/**/*"]);
});

gulp.task("serve-html", () => {
    return gulp.src(paths.mustache.sources)
        .pipe(mustache(paths.mustache.partials(), {extension: ".html"}, paths.mustache.partials()))
        .pipe(gulp.dest(paths.www));
});

gulp.task("serve-js", () => {
    return gulp.src(paths.ts)
        .pipe(tsProject())
        .pipe(gulp.dest(paths.www));
});

gulp.task("build", gulp.parallel("serve-html", "serve-js"));
gulp.task("default", gulp.series("clean", "build"));

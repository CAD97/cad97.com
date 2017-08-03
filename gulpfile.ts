import * as gulp from "gulp";
import * as ts from "gulp-typescript";
import * as del from "del";
import * as mustache from "gulp-mustache";
import * as fs from "fs";

const tsProject = ts.createProject("tsconfig.json");
const paths = {
    ts: "src/js/**/*.ts",
    mustache: {
        sources: "src/html/**/*.mustache",
        view: () => {
            let view: { [id: string]: string } = {};
            let files = fs.readdirSync("src/templates/");
            files.forEach((file) => {
                view[file.replace(/\.[^/.]+$/, "")] =
                    fs.readFileSync(`src/templates/${file}`).toString();
            });
            return view;
        },
        partials: () => {
            let view: { [id: string]: string } = {};
            let files = fs.readdirSync("src/partials/");
            files.forEach((file) => {
                view[file.replace(/\.[^/.]+$/, "")] =
                    fs.readFileSync(`src/partials/${file}`).toString();
            });
            return view;
        }
    },
    www: "www"
};

gulp.task("clean", () => {
    return del([paths.www + "/**/*"]);
});

gulp.task("serve-html", () => {
    return gulp.src(paths.mustache.sources)
        .pipe(mustache(paths.mustache.view(), { extension: ".html" }, paths.mustache.partials()))
        .pipe(gulp.dest(paths.www));
});

gulp.task("serve-js", () => {
    return gulp.src(paths.ts)
        .pipe(tsProject())
        .pipe(gulp.dest(paths.www));
});

gulp.task("build", gulp.parallel("serve-html", "serve-js"));
gulp.task("default", gulp.series("clean", "build"));

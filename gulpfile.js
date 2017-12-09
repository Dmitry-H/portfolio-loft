const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const del = require("del");
const browserSync = require("browser-sync");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cssUnit = require("gulp-css-unit");
const newer = require("gulp-newer");
const imagemin = require("gulp-imagemin");

// const paths = {};


function pages() {
    return gulp.src("./src/templates/pages/*.pug")
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest("./dist"));
}

function styles() {
    return gulp.src("./src/sass/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass(/*{outputStyle: 'compressed'}*/).on("error", sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        /*.pipe(cssUnit({
            type: "px-to-rem",
            rootSize: 16
        }))*/
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("./dist/css"));
}

function images() {
    return gulp.src("./src/img/**/*.*")
        .pipe(newer("./dist/img"))
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/img"));
}

function fonts() {
    gulp.src("./src/fonts/**/*.*")
        .pipe(gulp.dest("./dist/fonts"));
}

function clear() {
    del.sync(["./dist/**", "!./dist", "!./dist/img", "!./dist/img/**"]);
}

function server() {
    browserSync({
        server: {
            baseDir: "./dest"
        },
        browser: "chrome"
    });
    browserSync.watch("./dest/**/*.*", browserSync.reload);
}

function watch() {
    gulp.watch("./src/templates/pages/*.pug", pages);
    gulp.watch("./src/img/**/*.*", images);
    gulp.watch("./src/fonts/**/*.*", fonts);
    gulp.watch("./src/sass/style.scss", styles);
    // gulp.watch("",);
    // gulp.watch("",);
}

gulp.task("default", gulp.series(
    clear,
    gulp.parallel(pages, styles, fonts, images),
    gulp.parallel(watch, server)
));

exports.pages = pages;
exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.clear = clear;
exports.server = server;
exports.watch = watch;
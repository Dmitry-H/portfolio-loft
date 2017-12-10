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
const watcher = require("gulp-watch");

const gulpWebpack = require("gulp-webpack");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

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

function scripts() {
    return gulp.src("./src/js/script.js")
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest("./dist/js"))
}

function images() {
    return gulp.src("./src/img/**/*.*")
        .pipe(newer("./dist/img"))
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest("./dist/img"));
}

function fonts() {
    return gulp.src("./src/fonts/**/*.*")
        .pipe(gulp.dest("./dist/fonts"));
}

function clear() {
    return del(["./dist/**/*.*", "./dist/**", "!./dist", "!./dist/img", "!./dist/img/**/*.*"]);
}

function server() {
    browserSync({
        server: {
            baseDir: "./dist"
        },
        browser: "chrome"
    });
    browserSync.watch("./dist/**/*.*", browserSync.reload);
}

function watch() {
    watcher("./src/templates/**/*.pug", pages);
    watcher("./src/img/**/*.*", images);
    watcher("./src/fonts/**/*.*" , fonts);
    watcher("./src/sass/**/*.scss", styles);
    watcher("./src/js/**/*.js", scripts);
}

gulp.task("build", gulp.series(
    clear,
    gulp.parallel(pages, styles, fonts, images, scripts)
));

gulp.task("default", gulp.series(
    clear,
    gulp.parallel(pages, styles, fonts, images, scripts),
    gulp.parallel(watch, server)
));

exports.pages = pages;
exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.clear = clear;
exports.server = server;
exports.watch = watch;
exports.scripts = scripts;
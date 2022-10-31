'use strict'
const gulp = require("gulp"); // сохраняем в переменную gulp большой объект, позволяющий создавать задачи, считывать и перемещать файлы
//import gulp from 'gulp';
//const { task, parallel, watch, series, lastRun, src, dest } = gulp;

const babel = require("gulp-babel");
const rename = require("gulp-rename");
const del = require('del');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat'); //конкатенирование файлов
const autoprefixer = require('gulp-autoprefixer'); // кросбраузерность + -webkit etc
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps'); //add sourcemaps
const groupCssMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');

const versionNumber = require('gulp-version-number'); // add version of Css & Js

const imagemin = require('gulp-imagemin'); // compress img
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const fileinclude = require('gulp-file-include'); //ипортирование частей
const minify = require('gulp-minify'); //minify
const uglify = require('gulp-uglify');
const purgecss = require('gulp-purgecss') // удаление неиспользуемых стилей

const zip = require('gulp-zip'); //архивирование бакапов

/*
const moveCSS = () => 
    gulp.src("./src/css/*.css")
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());

*/

const moveIMG = () =>
    gulp.src("./src/img/**")
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest("./dist/img/"))
        .pipe(browserSync.stream());

/*
const concatCss = () =>
    gulp.src('./src/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());

*/


const moveFonts = () =>
    gulp.src("./src/fonts/**")
        .pipe(gulp.dest("./dist/fonts/"));


const moveHtml = () =>
    gulp.src('./src/*.html')
        .pipe(fileinclude())
        .pipe(
            versionNumber({
                'value': '%DT%',
                'append': {
                    'key': '_v',
                    'cover': 0,
                    'to': [
                        'css',
                        'js'
                    ]
                },
                'output': {
                    'file': 'gulp/version.json'
                }
            })
        )
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());

function buildScss() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            // outputStyle: 'compressed'
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(groupCssMedia())   //Группируем медиа запросы
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(purgecss({content: ['src/**/*.html']}))  //убрать неиспользуемые стили
        .pipe(gulp.dest('./dist/css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write()) //добавить sourcemap
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
};

const minifyJs = () =>
    gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        /*
        .pipe(rename({
            suffix: "-min"
        }))
        */
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.stream());

const delDist = () => {
    return del('./dist');
}


//gulp.task("moveCSS", moveCSS);
gulp.task("moveIMG", moveIMG);
gulp.task("moveFonts", moveFonts);
//gulp.task("concatCss", concatCss);
gulp.task("moveHtml", moveHtml);
//gulp.task("buildStyles", buildStyles);
gulp.task("buildScss", buildScss);
gulp.task("minifyJs", minifyJs);

gulp.task("moveFiles", gulp.parallel("buildScss", "moveIMG", "minifyJs", "moveHtml", "moveFonts"));
gulp.task("moveCssJs", gulp.parallel("buildScss", "minifyJs", "moveFonts"));

gulp.task('mzip', function () {
    let curDate = new Date();
    const strDate = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + '-' + curDate.getHours() + '-' + curDate.getMinutes();
    console.log(strDate);
    return gulp.src([
        './src/**/*.*',
        './*.js',
        './.gitignore',
        './package.json',
        './README.md'
    ], {base: '.'})
        .pipe(zip('backUp_' + strDate + '.zip'))
        .pipe(gulp.dest('./backUp/'));
});


gulp.task('serve', () => {
    return browserSync.init({
        server: {
            baseDir: ['dist']
        },
        port: 9000,
        open: true
    });
});


const watchAll = () => {
    gulp.watch('./src/img/**', moveIMG).on('change', browserSync.reload);
    gulp.watch('./src/scss/**/*.scss', buildScss).on('change', browserSync.reload);
    gulp.watch('./src/**/*.html', moveHtml).on('change', browserSync.reload);
    gulp.watch('./src/js/*.js', minifyJs).on('change', browserSync.reload);
}

const devWatch = () => {
    gulp.watch('./src/scss/**/*.scss', buildScss).on('change', browserSync.reload);
    gulp.watch('./src/js/*.js', minifyJs).on('change', browserSync.reload);
}

gulp.task("build", gulp.series(delDist, 'moveFiles'));
gulp.task('dev', gulp.series('moveCssJs', gulp.parallel('serve', devWatch)));


gulp.task('default', gulp.series(delDist, 'moveFiles', gulp.parallel('serve', watchAll)));


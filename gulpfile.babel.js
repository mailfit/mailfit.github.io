import gulp from 'gulp';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import imagemin from 'gulp-imagemin';
import del from 'del';
import inlineCss from 'gulp-inline-css';
import sourcemaps from 'gulp-sourcemaps';
import conf from './gulp/paths/gulp';
import gulpXlsx from 'gulp-js-xlsx';
import typograf from 'gulp-typograf';
import xlsx from 'xlsx';
import rename from 'gulp-rename';

import browserSync from 'browser-sync';

browserSync.create();
global.$ = {
    fs: require('fs')
};
// CLEAN
export const clean = () => del(conf.path.clean);

// SERVER
export function connectDist() {
    browserSync.init({
        server: {
            baseDir: "./production"
        }
    });
}

//EXEL
export function excel(cb) {
    return gulp.src('./data/**/*.xlsx')
        .pipe(gulpXlsx.run({
            parseWorksheet: function(worksheet){
                var string = xlsx.utils.sheet_to_row_object_array(worksheet);
                return  string;
            }
        }))
        .pipe(rename({extname: '.json'}))
        .pipe(gulp.dest('./data/'));
        cb();
}

// HTML BUILD
export function html() {
    return gulp.src(conf.path.html.src.main)
        .pipe(pug({
            locals : {
                project: JSON.parse($.fs.readFileSync('./data/projects/project.json', 'utf8')),
            },
            pretty: '    '
        }))
        .pipe(typograf({
            locale: ['ru', 'en-US'],
            safeTags: [
                ['<no-typography>', '</no-typography>']
            ]
        }))
        .pipe(inlineCss({
            applyStyleTags: false,
            applyLinkTags: true,
            removeStyleTags: false,
            removeLinkTags: true
        }))
        .pipe(gulp.dest(conf.path.html.dist.main))
        .pipe(browserSync.stream());
}

// STYLE
export function style() {
    return gulp.src(conf.path.style.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))

        .pipe(sourcemaps.write())
        .pipe(gulp.dest(conf.path.style.dist))
        .pipe(browserSync.stream());
}

//IMAGE
export function image() {
  return gulp.src(conf.path.image.src)
    .pipe(imagemin([
        imagemin.svgo({plugins: [{removeViewBox: true}]})
    ], {
        verbose: true
    }))
    .pipe(gulp.dest(conf.path.image.dist))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream());
}

// WATCH
function watchFiles(cb) {
    gulp.watch('./data/**/*.xlsx', excel);
    gulp.watch(conf.path.html.watch, html); 
    gulp.watch(conf.path.style.watch, style);
    gulp.watch(conf.path.image.src, image);
    cb();
}

export { watchFiles as watch };

const build = gulp.series(
    clean,
    excel,
    style,
    gulp.parallel(
        image,
        html,
        connectDist,
        watchFiles
    )
);


gulp.task('build', gulp.series(build)); 

export default build;
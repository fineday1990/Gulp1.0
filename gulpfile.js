//gulp
const gulp = require('gulp');
//компилирует sass код в css
const sass = require('gulp-sass')(require('sass'));
//меняет название например main.css в main.min.css
const rename = require('gulp-rename');
//удаляет пробелы и минифицирует css файл
const cleanCSS = require('gulp-clean-css');
//переводит новые стандарты js в более ранние версии
const babel = require('gulp-babel');
//минифицирует js файлы
const uglify = require('gulp-uglify');
//отображает в панели разработчика в каком файле и на какой строке находится элемент
const sourcemaps = require('gulp-sourcemaps');
//добавляет автопрефиксы в CSS файл
const autoprefixer = require('gulp-autoprefixer');
//соединяет js файлы в один
const concat = require('gulp-concat');
//удаляет фалы из папки, чистит папку dist
const del = require('del');

// Настройка путей
const paths = {
    styles: {
        src: 'src/styles/**/*.sass',
        dest: 'dist/css/',
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/',
    },
};

//очистка
function clean() {
    return del(['dist']);
}

// работа со стилями
function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(
            cleanCSS({
                level: 2,
            })
        )
        .pipe(
            rename({
                basename: 'main',
                suffix: '.min',
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest));
}

// работа со скриптами
function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest));
}

// отслеживает изменения
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}

// series задает порядок выполения по очереди, parallel- параллельно
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;

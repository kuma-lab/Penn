var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    purgecss = require('gulp-purgecss');

gulp.task('default', ['minify-js', 'autoprefixer']);
gulp.task('default', ['concat','less']);

/**
 * Supprime les fichier defini
 */
gulp.task("clean", function () {
    return del([
        'js/dist.js',
        'js/dist.es5.js',
        'js/dist.min.js',
        'css/**/*'
    ]);
});

/**
 * Concatene les fichiers dans un seul fichier
 */
gulp.task('concat', ['clean'], function () {
    return gulp.src(
        [
            "js/dev/libraries/*",
            "js/dev/components/*",
            "js/dev/dispatchers/*",
            "js/dev/stores/*",
            "js/dev/controllers/*",
            "js/dev/application.js"
        ]
    ).pipe(concat('dist.js'))
        .pipe(gulp.dest('./dist'));
});

/**
 * Transpile le code ES6 vers ES5
 */
gulp.task("babel", ['concat'], function () {
    return gulp.src("./dist/dist.js")
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .pipe(rename('dist.es5.js'))
        .pipe(gulp.dest("js"));
});

/**
 * Build les fichiers less
 */
gulp.task('less', ['clean'], function () {
    return gulp.src([
      './less/pages/login/login.less',
      './less/pages/home/home.less',
      './less/pages/people/people.less',
      './less/pages/keyword/keyword.less',
        ])
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./css'));
});

/**
 * Optimise les feuilles de style css pour tout les navigateurs
 */
gulp.task('autoprefixer', ['less'], function () {
    gulp.src('css/**/*.css')
        .pipe(autoprefixer({
            browsers: ["firefox >= 15", "ios >= 8", "android >= 4.0", "and_uc >= 9.9"],
            cascade: false
        }))
        .pipe(gulp.dest('css'));
});

/**
 * Purge CSS : supprime les css inutilisés
 */
gulp.task('purgecss', function () {
    return gulp.src('css/**/*.css')
        .pipe(purgecss({
            content: ['../**/*.php']
        }))
        .pipe(gulp.dest('css'))
});

/**
 * Minify les fichiers
 */
gulp.task('minify-js', ['babel'], function () {
    gulp.src('js/dist.es5.js')
        .pipe(rename('dist.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});
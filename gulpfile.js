// --------------------------------------------
// Dependencies
// --------------------------------------------
var autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    minifycss = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    images = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();


// paths
var styleSrc = 'source/scss/**/*.scss',
    styleDest = 'build/assets/css/',
    htmlSrc = 'source/*.html',
    htmlDest = 'build/',
    vendorSrc = 'source/js/vendors/',
    vendorDest = 'build/assets/js/',
    scriptSrc = 'source/js/*.js',
    scriptDest = 'build/assets/js/',
    imgSrc = 'source/img/**/*',
    imgDest = 'build/assets/img/*';



// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------


// Minify HTML
gulp.task('html', function() {
    return gulp.src('source/**/*.html')
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('build'));
});


// Compiles all SCSS files
gulp.task('sass', function() {
    gulp.src('source/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(rename({
            basename: 'style'
        }))
        .pipe(gulp.dest('build/assets/css'))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/assets/css'));
});

gulp.task('images', function() {
    gulp.src('source/img/*')
        .pipe(plumber())
        .pipe(images())
        .pipe(gulp.dest('build/assets/img'));
});

// Uglify js files
gulp.task('scripts', function() {
    gulp.src('source/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'));
});

//Concat and Compress Vendor .js files
gulp.task('vendors', function() {
    gulp.src(
            [
                'source/js/vendors/vue.js',
                'source/js/vendors/*.js'
            ])
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'));
});



// Watch for changes
gulp.task('watch', function(){

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });

    gulp.watch(htmlSrc,['html']);
    gulp.watch(imgSrc,['images']);
    gulp.watch(styleSrc,['sass']);
    gulp.watch(scriptSrc,['scripts']);
    gulp.watch(vendorSrc,['vendors']);
    gulp.watch(['build/*.html', 'build/assets/css/*.css', 'build/assets/js/*.js', 'build/assets/js/vendors/*.js']).on('change', browserSync.reload);

});


// use default task to launch Browsersync and watch JS files
gulp.task('default', [ 'html', 'images', 'sass', 'scripts', 'vendors', 'watch'], function () {});

const gulp 	      = require('gulp');
const browserSync = require('browser-sync');
const nodemon     = require('gulp-nodemon');
const minify      = require('gulp-minify');
const minifyCSS   = require('gulp-clean-css');
const concat   	  = require('gulp-concat');
const watch    	  = require('gulp-watch');
const sassGlob 	  = require('gulp-sass-glob');
const sass     	  = require('gulp-sass');
const rename   	  = require('gulp-rename');

const reload = browserSync.reload;

/////////////////////
// - Browser-sync
/////////////////////
gulp.task('browser-sync', ['nodemon'], () =>  {
	browserSync.init(null, {
		proxy: "http://localhost:8080",
        files: [
			"public/**/*.js", 
			"public/css/screen.min.css", 
			"src/views/**/*.ejs", 
			"src/controllers/**/*.js", 
			"src/routes/**/*.js"
		],
        browser: "google chrome",
        port: 7000,
	});
});

/////////////////////
// - Restart server
/////////////////////
gulp.task('nodemon', (cb) => {
	
	var started = false;
	
	return nodemon({
		script: 'server.js'
	}).on('start', () => {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
    })
    .on('restart', () => {
        setTimeout(function() {
			reload({stream: false});
		}, 2000);
    })
});

/////////////////
// - SCSS/CSS
/////////////////
const SCSS_BUILD = 'src/build/scss/**/*.scss';
const SCSS_DEST  = 'public/css';

gulp.task('build_scss', function() {
    return gulp.src('src/build/scss/screen.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(SCSS_DEST))
});

// Detect changes in SCSS
gulp.task('watch_scss', () => {
    return watch(SCSS_BUILD, () => gulp.start('build_scss'));
})

/////////////////
// - JS
/////////////////
const JS_SRC  = 'build/js/*.js';
const JS_DEST = 'public/js/';
gulp.task('build_js', () => {
	return gulp.src(JS_SRC)
		.pipe(concat('bundle.js'))
		.pipe(minify({
			ext: {
				src: '.js',
				min: '.min.js'
			}
		}))
		.pipe(gulp.dest(JS_DEST))
});

gulp.task('watch_js', () => {
	return watch(JS_SRC, () => {
        gulp.start('build_js');
    });
})


gulp.task('default', ['browser-sync', 'build_scss', 'watch_scss', 'build_js', 'watch_js']);
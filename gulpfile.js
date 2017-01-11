var gulp = require('gulp'),         // look into node_modules for a folder named "gulp"
    sass = require('gulp-sass'),    // sass, so much faster than gems
    browserSync = require('browser-sync').create(), //now we talking!
    useref = require('gulp-useref'),  // combine js in right order
    uglify = require('gulp-uglify'),  // minify
    gulpIf = require('gulp-if'),      // minify only what we want!
    cssnano = require('gulp-cssnano'),// minify css
    del = require('del'),             // deletes; like for outdated dist
    runSequence = require('run-sequence'),// makes sure order is kept
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),     // utilities
    autoPrefixer = require('gulp-autoprefixer'),
		nodemon = require('gulp-nodemon');

gulp.task('sass', function() {
  return gulp.src('public/scss/**/*.scss') // Gets all files ending with .scss in public/scss
    .pipe(plumber(function(error) {
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    .pipe(sass())
    .pipe(autoPrefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('useref', function(){
  return gulp.src('public/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function() {
	return del.sync('dist');
})

gulp.task('build', function (callback) {
	runSequence('clean:dist',
		['sass', 'useref'],
		callback
	)
})

gulp.task('nodemon', function(cb) {
	var started = false;

	return nodemon({
		script: 'app.js'
	}).on('start', function() {
		if (!started) {
			cb();
			started = true;
		}
	})
});

gulp.task('browserSync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "localhost:5000",
		files: ["public/**/*.*"],
		port: 7000
	});
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('public/scss/**/*.scss', ['sass']);
  // Reload whenever the HTML or JS changes
  gulp.watch('public/*.html', browserSync.reload);
  gulp.watch('public/js/**/*.js', browserSync.reload);
});

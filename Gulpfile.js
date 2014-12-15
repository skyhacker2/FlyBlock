var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var del = require('del')
var copy = require('gulp-copy')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

var paths = {
	scripts: ['coffee/**/*.coffee']
}

gulp.task('clean', function(cb) {
	del(['src'], cb);
});

gulp.task('scripts', ['clean'], function() {
	return gulp.src(paths.scripts)
		.pipe(coffee({bare: true}).on('error', gutil.log))
		.pipe(gulp.dest('./src/'))
});

gulp.task('copy',['clean'], function() {
	return gulp.src("libs/**/*.js")
		.pipe(gulp.dest("./src/libs/"))
});

gulp.task('cleanPublish', function(cb) {
	del(['publish'], cb);
});

gulp.task('publish', ['cleanPublish'], function() {
	return gulp.src(['frameworks/cocos2d-html5/**/*.js', 'src/**/*.js', 'main.js'])
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('publish'))
});

gulp.task('default', ['scripts', 'copy']);
var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
gulp.task('sass', function() {
  return gulp.src('app/theme/style.css')
    .pipe(sass())
    .pipe(gulp.dest('app/theme/dist/css'))
});

gulp.task('js', function () {    
  return gulp.src('app/theme/js/**/*.js')
      .pipe(gulp.dest('app/theme/dist/js'));
});

gulp.task('watch', function(){
  gulp.watch('app/theme/scss/**/*.scss',gulp.series('sass'));
  gulp.watch('app/theme/js/**/*.js', gulp.series('js'));  
});

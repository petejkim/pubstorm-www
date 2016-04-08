var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    envify = require('gulp-envify'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    slm = require('gulp-slm'),
    sourcemaps = require('gulp-sourcemaps'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util'),
    eslint = require('gulp-eslint'),
    autoprefixer = require('gulp-autoprefixer'),
    rev = require('gulp-rev'),
    debug = require('gulp-debug'),
    sequence = require('gulp-sequence'),
    fingerprint = require('gulp-fingerprint'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    cache = require('gulp-cached'),
    chalk = require('chalk'),
    del = require('del'),
    path = require('path');

var srcJS = 'src/js/app.js',
    srcCSS = 'src/css/app.sass',
    vendorJSPath = 'vendor/js';

gulp.task('default', sequence('clean-dev', ['js-dev', 'lint-dev', 'css-dev', 'html-dev', 'slm-dev', 'images-dev']));

gulp.task('dist', sequence('clean-dist', ['images-dist', 'js-dist', 'css-dist', 'html-dist', 'slm-dist']));

gulp.task('lint', function() {
  return lintJS();
});

gulp.task('lint-dist', function() {
  return lintJS().pipe(eslint.failOnError());
});

gulp.task('clean', function(cb) {
  del(['build/**', '!build'], cb);
});

gulp.task('clean-dev', function(cb) {
  del(['build/dev/**', '!build/dev'], cb);
});

gulp.task('clean-dist', function(cb) {
  del(['build/dist/**', '!build/dist'], cb);
});

gulp.task('html-dev', function() {
  var dest = 'build/dev';

  copyHTML(dest);
  gulp.watch('src/html/**/*.html').on('change', function() {
    gutil.log('Copying ' + chalk.cyan('html') + '...');
    copyHTML(dest).on('end', function() {
      gutil.log('Copied ' + chalk.cyan('html'));
    });
  });
});

gulp.task('slm-dev', function() {
  var dest = 'build/dev';

  buildSlm(dest);
  gulp.watch('src/html/**/*.slm').on('change', function() {
    gutil.log('Building ' + chalk.cyan('Slm') + '...');
    buildSlm(dest).on('end', function() {
      gutil.log('Built ' + chalk.cyan('Slm'));
    });
  });
});

gulp.task('images-dev', function() {
  var dest = 'build/dev/images';
  del.sync([dest]);

  copyImages(dest);
  gulp.watch('src/images/**/*').on('change', function() {
    gutil.log('Copying ' + chalk.cyan('images') + '...');
    copyImages(dest).on('end', function() {
      gutil.log('Copied ' + chalk.cyan('images'));
    });
  });
});

gulp.task('js-dev', function() {
  var dest = 'build/dev/js';

  del.sync([dest]);

  var b = browserifyBundler({ debug: true });

  var jsOptions = {
    dest: dest,
    sourcemaps: true,
    compress: false,
    bundler: b,
    dev: true
  };

  var onBuild = function() {
    gutil.log('Built ' + chalk.cyan('JS'));
  };

  var build = function() {
    gutil.log('Building ' + chalk.cyan('JS') + '...');
    buildJS(jsOptions).on('end', onBuild);
  };

  build();
  watchify(b).on('update', build);
});

gulp.task('lint-dev', function() {
  gulp.start('lint');

  gulp.watch(['src/js/**/*.+(js|jsx|es6)', 'tests/**/*.+(js|jsx|es6)']).on('change', function() {
    gulp.start('lint');
  });
});

gulp.task('css-dev', function() {
  var dest = 'build/dev/css';

  del.sync([dest]);

  var cssOptions = {
    dest: dest,
    sourcemaps: true,
    compress: false,
    dev: true
  };

  buildCSS(cssOptions);

  gulp.watch(['src/css/**/*.sass', 'src/css/**/*.scss']).on('change', function() {
    gutil.log('Building ' + chalk.cyan('CSS') + '...');
    buildCSS(cssOptions).on('end', function() {
      gutil.log('Built ' + chalk.cyan('CSS'));
    });
  });
});

gulp.task('html-dist', function() {
  var dest = 'build/dist';
  return copyHTML(dest);
});

gulp.task('slm-dist', function() {
  var dest = 'build/dist';
  return buildSlm(dest);
});

gulp.task('images-dist', function() {
  var dest = 'build/dist/images';
  del.sync([dest]);
  return copyImages(dest);
});

gulp.task('js-dist', ['lint-dist'], function() {
  var dest = 'build/dist/js';

  del.sync([dest]);

  return buildJS({
    dest: dest,
    production: true,
    sourcemaps: false,
    compress: true,
    watch: false
  });
});

gulp.task('css-dist', function() {
  var dest = 'build/dist/css';

  del.sync([dest]);

  return buildCSS({
    dest: dest,
    sourcemaps: false,
    compress: true
  });
});

function copyHTML(dest) {
  dest = dest || 'build/dev';

  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest(dest));
}

function copyImages(dest) {
  dest = dest || 'build/dev/images';

  return gulp.src('src/images/**/*')
    .pipe(gulp.dest(dest));
}

function browserifyBundler(options) {
  var jsExtensions = ['.js', '.jsx', '.es6', '.json'];
  options = merge({
    extensions: jsExtensions,
    paths: [path.dirname(srcJS), vendorJSPath],
    cache: {},
    packageCache: {},
    noParse: ['jquery']
  }, options || {});

  if (process.env.FULL_PATHS === "true") {
    gutil.log("Using full paths for browserify");
    options.fullPaths = true;
  }

  var bundler = browserify(srcJS, options);
  bundler.add(require.resolve("babel/polyfill"));
  bundler.ignore("unicode/category/So");
  bundler.transform(babelify.configure({
    extensions: jsExtensions,
    compact: false,
    optional: ['es7.classProperties']
  }));
  return bundler;
}

function lintJS() {
  return gulp.src(['src/js/**/*.+(js|jsx|es6)', 'tests/**/*.+(js|jsx|es6)'])
    .pipe(cache('lint'))
    .pipe(eslint())
    .pipe(eslint.format());
}

function buildJS(options) {
  options = merge({
    dest: 'build/dev',
    sourcemaps: true,
    compress: false,
    bundler: null
  }, options || {});

  var js = options.bundler || browserifyBundler();

  js = js.bundle()
    .on('error', mapError)
    .pipe(source('app.js'))
    .pipe(buffer());

  if (options.production) {
    js = js.pipe(envify({ NODE_ENV: 'production' }));
  }

  if (options.compress) {
    js = js.pipe(uglify());
  }

  js.pipe(gulp.dest(options.dest));

  if (options.sourcemaps) {
    js = js.pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(options.dest));
  }

  return js;
}

function buildSlm(dest) {
  dest = dest || "build/dev";

  return gulp.src('./src/html/**/*.slm')
    .pipe(slm())
    .pipe(gulp.dest(dest));
}

function buildCSS(options) {
  options = merge({
    dest: 'build/dev',
    sourcemaps: true,
    compress: false
  }, options || {});

  var css = gulp.src(srcCSS);

  if (options.sourcemaps) {
    css = css.pipe(sourcemaps.init());
  }

  css = css.pipe(sass({
      outputStyle: options.compress ? 'compressed' : 'nested'
    }).on('error', mapError))
    .pipe(autoprefixer());

  if (options.sourcemaps) {
    css = css.pipe(sourcemaps.write());
  }

  css = css.pipe(gulp.dest(options.dest));
  return css;
}

function mapError(err) {
  if (err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': ' + chalk.yellow(err.fileName.replace(__dirname, ''))
      + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
      + ' & Column ' + chalk.magenta(err.columnNumber || err.column)
      + ': ' + chalk.blue(err.description));
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': ' + chalk.yellow(err.message));
  }
  this.emit('end');
}

function merge(a, b) {
  var o = {};
  if (a && b) {
    Object.keys(a).forEach(function(k) {
      o[k] = a[k];
    });
    Object.keys(b).forEach(function(k) {
      o[k] = b[k];
    });
    return o;
  }
}

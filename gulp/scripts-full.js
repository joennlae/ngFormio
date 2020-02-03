module.exports = function(gulp, plugins) {
  return function() {
    return plugins.browserify({
      entries: './src/formio-full.js',
      debug: false,
      standalone: 'formio',
      insertGlobalVars: {
        SignaturePad: function() {
          return 'require("signature_pad")';
        }
      },
      ignoreMissing: true
    })
      .bundle()
      .pipe(plugins.source('formio-full.js'))
      .pipe(plugins.wrap(plugins.template, {version: plugins.packageJson.version}))
      .pipe(plugins.derequire())
      .pipe(gulp.dest('dist/'))
      .pipe(plugins.rename('formio-full.min.js'))
      //.pipe(plugins.streamify(plugins.uglify({output: {comments: '/^!/'}})))
      .pipe(gulp.dest('dist/'));
  };
};

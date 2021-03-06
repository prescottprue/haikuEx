var gulp = require('gulp'),
connect = require('gulp-connect'),
ngConstant = require('gulp-ng-constant'),
rename = require('gulp-rename'),
s3 = require('gulp-s3'),
template = require('gulp-template'),
ngAnnotate = require('gulp-ng-annotate'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
clean = require('gulp-clean'),
cssmin = require('gulp-cssmin'),
stripDebug = require('gulp-strip-debug'),
stripNgLog = require('gulp-strip-ng-log'),
_ = require('underscore'),
nodemon = require('gulp-nodemon');

var pkg = require('./package.json');
var conf = require('./config.json');
var env = require('./env.json');
var refBuilder = require('./lib/refBuilder');
var assets = require('./assets');
var locatedStyleAssets = locateAssets('styles');
var locatedAppAssets = locateAssets('app');
var locatedVendorAssets = locateAssets('vendor');

/** Copy Style Assets to single styles.css file in distFolder
 */
gulp.task('assets:style',function () {
  return gulp.src(locatedStyleAssets)
  .pipe(cssmin({keepSpecialComments:0}))
  .pipe(concat('app.css'))
  .pipe(gulp.dest(conf.distFolder + '/styles/'));
});

/** Copy Vendor libs to single vendor.js file in distFolder
 */
gulp.task('assets:vendor', function () {
  return gulp.src(locatedVendorAssets)
  // Writes vendor.js to dist/ folder
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(conf.distFolder));
});

/** Copy Vendor libs to single vendor.js file in distFolder
 */
//TODO: Handle scripts per env
gulp.task('assets:vendorLib', function () {
  return gulp.src(locatedVendorLibAssets, {"base": './' + conf.devFolder + '/'})
  // Writes vendor.js to dist/ folder
  .pipe(gulp.dest(conf.distFolder));
});

/** Angular annotation and Application files concatination to haikuEx.js
   */
gulp.task('assets:app', function () {
  return gulp.src(locatedAppAssets)
    .pipe(ngAnnotate())
    .pipe(stripDebug()) //Remove all console.logs
    // .pipe(stripNgLog()) //Remove $logs (used with trackjs in production)
    .pipe(concat('haikuEx.js'))
    .pipe(gulp.dest(conf.distFolder));
});

/** Copy HTML files to distFolder in respective locations
 */
//TODO: Convert html files to js?
gulp.task('copyHtml', function(){
    return gulp.src([conf.devFolder + '/**/*.html', '!' + conf.devFolder + '/index-template.html', '!' + conf.devFolder + '/index.html', '!' + conf.devFolder+'/bower/**/*.html'], {base:'./'+conf.devFolder+'/'})
    .pipe(gulp.dest(conf.distFolder));
});

/** Copy Bower folders to distFolder in respective locations
 */
//TODO: Convert html files to js?
gulp.task('copyBower', function(){
  //List of directories to ignore when copying bower file
  var ignoreDirs = [
    'bower/angular-material/demos',
    'bower/angular-material/modules'
  ]
  ignoreArray = ignoreDirs.map(function (ref){
    return '!'+ conf.devFolder + '/' + ref + "/**";
  });
  console.log('bower ignore array:', ignoreArray);
    return gulp.src([conf.devFolder + '/bower/**'].concat(ignoreArray), {base:'./'+conf.devFolder+'/'})
    .pipe(gulp.dest(conf.distFolder));
});

/** Build script and style tags to place into HTML in dev folder
 */
gulp.task('assetTags:dev', function () {
  return gulp.src(conf.devFolder + '/index-template.html')
    .pipe(template({scripts:refBuilder.buildScriptTags('local'), styles:refBuilder.buildStyleTags('local')}))
    // Writes script reference to index.html dist/ folder
    .pipe(rename('index.html'))
    .pipe(gulp.dest(conf.devFolder));
});

/** Build script and style tags to place into HTML in dist folder
 */
gulp.task('assetTags:prod', function () {
  return gulp.src(conf.devFolder + '/index-template.html')
    .pipe(template({scripts:refBuilder.buildScriptTags('prod'), styles:refBuilder.buildStyleTags('prod')}))
    // Writes script reference to index.html devfolder
    .pipe(rename('index.html'))
    .pipe(gulp.dest(conf.distFolder));
});

/** Create Angular constants file using variables loaded from config.json
 */
gulp.task('buildEnv', function () {
  return ngConstant({
    name: 'haikuEx.const',
    constants: { 
      VERSION:pkg.version,  
      CONST:{
        FB_URL:env.fbUrl
      }
    },
    stream:true
  })
  // Writes config.js to dev folder
  .pipe(rename('app-const.js'))
  .pipe(gulp.dest(conf.devFolder));
});

/** Upload dist folder to S3
*/
gulp.task('s3Upload', function() {
	var s3Config = {
		key:process.env.AWS_ACCESS_KEY_ID,
		secret:process.env.AWS_SECRET_ACCESS_KEY,
		bucket:conf.s3.bucket,
		region:conf.s3.region || "us-east-1"
	};
	return gulp.src('./' + conf.distFolder + '/**')
    .pipe(s3(s3Config));
});

/** Run local server to host app folder
*/
gulp.task('connect:dev', function() {
  connect.server({
    root: conf.devFolder || 'app',
    // livereload: true,
    port: conf.port || 4000
  });
});


/** Run local server to host dist folder
*/
gulp.task('connect:dist', function() {
  connect.server({
    root: conf.distFolder || 'dist',
    // livereload: true,
    port: conf.port || 6000
  });
});

/** Run local Backend API server to host app folder
*/
gulp.task('connect:backend', function () {
  nodemon({
    script: 'server.js'
  , ext: 'js html'
  // , env: { 'NODE_ENV': 'development' }
  })
});

/** Locate assets within devFolder folder
*/
function locateAssets(assetType){
  return assets[assetType].map(function(asset){
    return './' + conf.devFolder + '/' + asset;
  });
}
/** Clean dist folder
*/
// gulp.task('clean', function(){
//   return gulp.src(conf.distFolder)
//   .pipe(clean());
// });
/** Clean dist folder
*/
gulp.task('watch-grunt', function(){
  gulp.watch(['./Gulpfile.js'], ['assets']);
});
gulp.task('watch-assets', function(){
  gulp.watch(['./assets.js'], ['assets']);
});
gulp.task('watch-html', function(){
  gulp.watch([conf.devFolder + '/**/*.html'], ['copyHtml']);
});
gulp.task('assets', ['copyHtml', 'copyBower',  'assets:vendor','assets:app', 'assets:style', 'assetTags:dev', 'assetTags:prod']);//TODO: Have this build for prod env

gulp.task('build', ['buildEnv', 'assets']);

gulp.task('upload', ['build','s3Upload']);

gulp.task('default', ['build','connect:backend']);

gulp.task('dist', ['build', 'connect:dist']);

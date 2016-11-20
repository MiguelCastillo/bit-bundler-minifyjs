var utils = require("belty");
var mkdirp = require("mkdirp");
var path = require("path");
var fs = require("fs");
var UglifyJS = require("uglify-js");

module.exports = function minify(options) {
  options = options || {};

  function minifier(bundle, filename) {
    if (bundle) {
      var settings = options[bundle.name] || options;
      var directory = path.dirname(filename);
      var extension = path.extname(filename);
      var basename = path.basename(filename);
      var minFilename = path.basename(basename, extension) + /*".min" +*/ extension;
      var sourceMapUrl = minFilename + ".map";
      var input = {}; input[basename] = bundle.result.toString();

      if (settings.sourceMap !== false) {
        settings = utils.extend({
          sourceMapInline: true,
          sourceMapUrl: sourceMapUrl,
          outSourceMap: minFilename
        }, settings);
      }

      var result = UglifyJS.minify(input,
        utils.merge({}, settings, {
          fromString: true
        })
      );

      if (result.map) {
        bundle.setSourcemap(result.map);
      }

      bundle.setContent(result.code);
    }

    return bundle;
  }

  function postbundle(bundler, context) {
    return context.visitBundles(minifier);
  }

  return {
    postbundle: postbundle
  };
};

var utils = require("belty");
var path = require("path");
var convertSourceMap = require("convert-source-map");
var UglifyJS = require("uglify-js");

function minify(options) {
  options = options || {};

  function minifier(bundle) {
    if (!bundle) {
      return bundle;
    }

    var settings = options[bundle.name] || options;
    settings = settings.options || settings;

    var basename = path.basename(bundle.dest);
    var minFilename = basename;
    var sourceMapUrl = minFilename + ".map";
    var input = {}; input[basename] = bundle.content.toString();

    if (settings.sourceMap !== false) {
      var data = splitSourcemap(bundle);
      sourceMap = data.map ? JSON.parse(data.map) : null;
      input[basename] = data.code;

      settings = utils.assign({}, settings, {
        sourceMap: {
          content: sourceMap,
          filename: minFilename,
          url: sourceMapUrl
        }
      });
    }

    if (settings.banner) {
      settings = utils.assign({
        output: {
          preamble: settings.banner
        }
      }, settings);
    }

    var result = UglifyJS.minify(input, settings);

    return bundle
      .setSourcemap(result.map)
      .setContent(result.code);
  }

  function splitSourcemap(bundle) {
    var sourceMap = bundle.sourcemap;
    var bundleContent = bundle.content.toString();
    var converter = convertSourceMap.fromSource(bundleContent, true);

    if (converter) {
      sourceMap = converter.toJSON();
      bundleContent = convertSourceMap.removeComments(bundleContent);
    }

    return {
      map: sourceMap,
      code: bundleContent
    };
  }

  function postbundle(bundler, context) {
    return context.visitBundles(minifier);
  }

  return {
    postbundle: postbundle
  };
};

module.exports = minify;

var utils = require("belty");
var mkdirp = require("mkdirp");
var path = require("path");
var convertSourceMap = require("convert-source-map");
var fs = require("fs");
var UglifyJS = require("uglify-js");

function minify(options) {
  options = options || {};

  function minifier(bundle, filename) {
    if (!bundle) {
      return bundle;
    }

    var settings = options[bundle.name] || options;
    settings = settings.options || settings;

    var basename = path.basename(filename);
    var minFilename = basename;
    var sourceMapUrl = minFilename + ".map";
    var input = {}; input[basename] = bundle.result.toString();

    if (settings.sourceMap !== false) {
      var data = splitSourcemap(bundle);
      sourceMap = data.map ? JSON.parse(data.map) : null;
      input[basename] = data.code;

      settings = utils.extend({
        sourceMapInline: true,
        sourceMapUrl: sourceMapUrl,
        inSourceMap: sourceMap,
        outSourceMap: minFilename
      }, settings);
    }

    if (settings.banner) {
      settings = utils.extend({
        output: {
          preamble: settings.banner
        }
      }, settings);
    }

    var result = UglifyJS.minify(input,
      utils.merge({}, settings, {
        fromString: true
      })
    );

    if (settings.sourceMapInline) {
      return bundle
        .setSourcemap(null)
        .setContent(result.code);
    }
    else {
      return bundle
        .setSourcemap(result.map)
        .setContent(result.code);
    }
  }

  function splitSourcemap(bundle) {
    var sourceMap = bundle.sourcemap;
    var bundleContent = bundle.content.toString();

    if (!sourceMap) {
      var converter = convertSourceMap.fromSource(bundleContent, true);

      if (converter) {
        sourceMap = converter.toJSON();
        bundleContent = convertSourceMap.removeComments(bundleContent);
      }
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

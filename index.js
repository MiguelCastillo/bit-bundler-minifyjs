var path = require("path");
var UglifyJS = require("uglify-js");

var defaults = {
  sourceMap: {
    content: "inline",
    url: "inline"
  }
};

function minify(options) {
  options = options || {};

  function minifier(bundle) {
    if (!bundle) {
      return bundle;
    }

    var settings = Object.assign({}, options[bundle.name] || options);
    var minFilename = path.basename(bundle.dest);
    var input = {};

    input[minFilename] = bundle.content.toString();

    if (settings.sourceMap !== false) {
      settings.sourceMap = Object.assign({}, defaults.sourceMap, settings.sourceMap);
    }

    if (settings.banner) {
      settings = Object.assign({
        output: {
          preamble: settings.banner
        }
      }, settings);
    }

    var result = UglifyJS.minify(input, settings);

    if (result.error) {
      throw new Error(result.error);
    }

    return bundle.setContent(result.code);
  }

  function postbundle(bundler, context) {
    return context.visitBundles(minifier);
  }

  return {
    postbundle: postbundle
  };
};

module.exports = minify;

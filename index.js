var path = require("path");
var UglifyJS = require("uglify-es");

var defaults = {
  sourceMap: {
    content: "inline",
    url: "inline"
  }
};

function minify(options) {
  options = options || {};

  function minifier(bundle) {
    if (!bundle || !bundle.content) {
      return bundle;
    }

    var settings = Object.assign({}, options[bundle.name] || options);

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

    var result = UglifyJS.minify(bundle.content.toString(), settings);

    if (result.error) {
      throw new Error(result.error);
    }

    return bundle.setContent(result.code);
  }

  function postbundle(bundler, context) {
    if (context.updateBundles) {
      return context.updateBundles(minifier);
    }

    return context.visitBundles(minifier);
  }

  return {
    postbundle: postbundle
  };
};

module.exports = minify;

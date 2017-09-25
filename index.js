var utils = require("belty");
var path = require("path");
var UglifyJS = require("uglify-js");

function minify(options) {
  options = options || {};

  function minifier(bundle) {
    if (!bundle) {
      return bundle;
    }

    var settings = options[bundle.name] || options;
    settings = settings.options || settings;

    var minFilename = path.basename(bundle.dest);
    var input = {};

    input[minFilename] = bundle.content.toString();

    if (settings.sourceMap !== false) {
      input[minFilename] = bundle.content.toString();

      settings = utils.assign({}, settings, {
        sourceMap: {
          content: "inline",
          url: "inline"
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

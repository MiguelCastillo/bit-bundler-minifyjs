# bit-bundler-minifyjs
bit-bundler plugin for minifying JavaScript

`bit-bundler-minifyjs` is actually a tiny wrapper for [UglifyJS](https://github.com/mishoo/UglifyJS2), so be sure to check it out for more details on all the available options.

# usage

## bit-bundler setup
``` javascript
var Bitbundler = require("bit-bundler");
var jsPlugin = require("bit-loader-js");
var minifyjs = require("bit-bundler-minifyjs");

var bitbundler = new Bitbundler({
  loader: {
    plugins: [
      jsPlugin()
    ]
  },
  bundler: {
    plugins: [
      minifyjs()
    ]
  }
});

bitbundler.bundle({
  src: "in.js",
  dest: "out.js"
});
```


## with code splitting

All options can actually be configured on a per bundle basis leveraging bundle names, which is really handy when spltting bundles.

``` javascript
var Bitbundler = require("bit-bundler");
var jsPlugin = require("bit-loader-js");
var splitter = require("bit-bundler-splitter");
var minifyjs = require("bit-bundler-minifyjs");

var bitbundler = new Bitbundler({
  loader: {
    plugins: [
      jsPlugin()
    ]
  },
  bundler: {
    plugins: [
      splitter("dist/vendor.js", { match: path: /node_modules/ })
      minifyjs({
        "dist/vendor.js": {
          sourceMap: false
        }
      })
    ]
  }
});

bitbundler.bundle({
  src: "in.js",
  dest: "out.js"
});
```

## bundle banner

A useful feature is adding a "banner" to the output minified file.

```
minifyjs({
  banner: "/*! (c) Miguel Castillo. Licensed under MIT */"
})
```


# options

All options are directly forwarded onto [UglifyJS](https://github.com/mishoo/UglifyJS2), so understanding what options are available is helpful if the default behavior isn't sufficient for you. For convenience, you can refer to the options below that are commonly used.

> The only [UglifyJS](https://github.com/mishoo/UglifyJS2) option that is preconfigured and cannot be changed is `fromString`, which is always set to `true` since `bit-bundler-minifyjs` feeds the source code directly into `UglifyJS`.


## `banner`

String value that is added to the top of the generated file. Useful for adding build and licensing information.  This option is a shorthand for `output.preamble` option in `UglifyJS`.

> This is a bit-bundler-minifyjs option, not an `UglifyJS` option.


## `sourceMap`

Flag to disable sourcemap generation. `true` by default.

> This is a bit-bundler-minifyjs option, not an `UglifyJS` option.


## `sourceMapInline`

Flag to tell `Uglify` to include the generated sourcemap inline in the minified source. `true` by default.


## `sourceMapUrl`

The sourcemap Url that is referenced in the minified source. This really is only applicable when sourcemaps are not inlined in the minified output. Used by the browser (or host application) in order to know where the sourcemap file is located. This is generated for you by `bit-bundler-minifyjs`, but it is still available in case you want to (for whatever reason) change the default behavior.

> Given the name of the output bundle `out.js`, then the calculated sourcemap file name is `out.js.map` and the actual output is `//# sourceMappingURL=out.js.map`.


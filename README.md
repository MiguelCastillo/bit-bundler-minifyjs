# bit-bundler-minifyjs

[![Build Status](https://travis-ci.org/MiguelCastillo/bit-bundler-minifyjs.svg?branch=master)](https://travis-ci.org/MiguelCastillo/bit-bundler-minifyjs) [![Greenkeeper badge](https://badges.greenkeeper.io/MiguelCastillo/bit-bundler-minifyjs.svg)](https://greenkeeper.io/)

[bit-bundler](https://github.com/MiguelCastillo/bit-bundler) plugin for minifying JavaScript

`bit-bundler-minifyjs` is actually a tiny wrapper for [UglifyJS](https://github.com/mishoo/UglifyJS2), so be sure to check it out for more details on all the available options.

# usage

## install

```
$ npm install --save-dev bit-bundler-minifyjs
```

## bit-bundler setup
``` javascript
var Bitbundler = require("bit-bundler");

var bitbundler = new Bitbundler({
  bundler: [
    "bit-bundler-minifyjs"
  ]
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

Bitbundler.bundle({
  src: "in.js",
  dest: "out.js"
}, {
  bundler: [
    ["bit-bundler-splitter", {
      name: "vendor",
      dest: "dist/vendor.js",
      match: { path: /node_modules/ }
    }],
    ["bit-bundler-minifyjs", {
      vendor: {
        sourceMap: false
      }
    }]
  ]
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


## `banner`

String value that is added to the top of the generated file. Useful for adding build and licensing information.  This option is a shorthand for `output.preamble` option in `UglifyJS`.

> This is a bit-bundler-minifyjs option, not an `UglifyJS` option. Internally, this is the `preamble` options in `UglifyJS`.


## `sourceMap`

Flag to disable sourcemap generation. Sourcemaps are generated inline, but they can be split out into a separate file with the plugin [bit-bundler-extractsm](https://github.com/MiguelCastillo/bit-bundler-extractsm). `sourceMap` is `true` by default.

> This is a bit-bundler-minifyjs option, not an `UglifyJS` option.

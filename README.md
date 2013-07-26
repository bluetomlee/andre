Andre
==============
Andre is a Node.js file-watching template compiler for [ejs](https://github.com/visionmedia/ejs) and [underscore](http://underscorejs.org) templates.  By default it will output compiled ejs templates as javascript files, although it can optionally output rendered templates files as well.  In addition to ejs, Andre can also use underscore as its templating engine, or you can specify a custom template engine.

#### example

The example below would compile and watch ejs files in the 'src' directory and output javascript files in the 'dist' directory:

```javascript
var andre = require('andre');
andre.watch('src', 'dist');
```

#### installation

```npm install andre

#### usage

andre.watch( watchPath, [ options | outputPath ], [callback] )

#### options

- extension       - used to determine which files to watch and compile; set to false or '*' for all files in a directory
- engine          - specify which template engine to use; can be set to 'underscore' (or just '_'), a custom compile function, or an object with a compile method; default is 'ejs'
- render          - render the template; requires a data option if true; default is false
- onDelete        - a function to be invoked when a file is deleted with a filepath paramater (by default, no action is taken)
- outputPath      - specifies the directory path to write the output files to
- outputExtension - specifies the file extension to append to output files; default is '.js' (or '.html' if render option is true)
- prettify        - prettify the output; default is true; currently only for javascript output
- sourceTemplate  - used for rendering the javascript files, this template will be passed two variables: name and source



#### test

To run tests for Andre, [Mocha](https://github.com/visionmedia/mocha) and [Expect.js](https://github.com/LearnBoost/expect.js) must be installed.  If they are not, install them using npm, e.g.

```npm install mocha expect.js -g

To run the tests, clone this repo, cd to your local repo's directory and type

```mocha


#### license

MIT (see LICENSE.txt)

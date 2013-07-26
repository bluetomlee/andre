Andre
==============
Andre is a Node.js file-watching template compiler for ejs and underscore templates.  By default it will output compiled templates as javascript files, although it can optionally output rendered templates files as well.

#### example

The example below would compile and watch ejs files in the 'src' directory and output javascript files in the 'dist' directory:

```javascript
var andre = require('andre');
andre.watch('src', 'dist');
```

#### installation

```npm install andre

#### test

To run tests for Andre, [Mocha](https://github.com/visionmedia/mocha) and [Expect.js](https://github.com/LearnBoost/expect.js) must be installed.  If they are not, install them using npm, e.g.

```npm install mocha expect.js -g

To run the tests, clone this repo, cd to its local directory and type

```mocha


#### license

MIT (see LICENSE.txt)

var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');
var ejs = require('ejs');
var underscore = require('underscore');
var beautifyJs = require('node-beautify').beautifyJs;

exports.watch = function(watchpath, options, callback) {

    var otype = typeof options;
    if (otype === 'function') {
        callback = options;
        options = null;
    } else if (otype === 'string') {
        options = {
            outputPath: options
        };
    }

    callback = callback || function(err, name, output) {
        if (err) throw err;
        console.log('(re)compiled ', name);
    };

    var defaults = {
        sourceTemplate: '(function (global) {\n  global.templates = global.templates || {};\n  global.templates.<%= name %> = <%= source %>;\n})(window);',
        engine: 'ejs',
        extension: '.ejs',
        render: false,
        prettify: true,
        compile: function(filepath) {
            var extension = path.extname(filepath);
            if (!settings.extension || settings.extension === '*' || extension === settings.extension) {
                fs.readFile(filepath, function(err, data) {
                    if (err) return callback(err);
                    var content = data.toString();
                    var name = path.basename(filepath, path.extname(filepath));
                    var template;
                    if (settings.engine === 'ejs') {
                        var compileOptions = {
                            filename: filepath,
                            compileDebug: true,
                            client: true
                        };
                        if (settings.templateSettings) {
                            compileOptions = underscore.merge(compileOptions, settings.templateSettings);
                        }
                        template = ejs.compile(content, compileOptions);
                    } else if (settings.engine === 'underscore') {
                        template = underscore.template(content);
                    } else if (typeof settings.engine === 'function') {
                        template = settings.engine(content);
                    } else if (settings.engine && settings.engine.compile) {
                        template = settings.engine.compile(content);
                    } else throw 'unknown template engine';
                    var output;
                    if (settings.render) {
                        if (typeof settings.data === 'function') {
                            settings.data(function(err, data) {
                                if (err) return callback(err);
                                writeOutput(template(data));
                            });
                        } else {
                            output = settings.data ? template(settings.data) : template();
                            writeOutput(output);
                        }
                    } else {
                        var srcTemplate = underscore.template(settings.sourceTemplate);
                        output = srcTemplate({
                            name: name,
                            source: template.source || template.toString()
                        });
                        if (settings.prettify) output = beautifyJs(output);
                        writeOutput(output);
                    }

                    function writeOutput(outputContent) {
                        var outputFilename = path.join(settings.outputPath, name + settings.outputExtension);
                        fs.writeFile(outputFilename, outputContent, function(err) {
                            if (err) return callback(err);
                            callback(null, name, output);
                        });

                    }
                });
            }

        }
    };

    var settings = options ? underscore.extend(defaults, options) : defaults;

    if (!settings.outputPath) throw new Error('outputPath not specified');
    if (!settings.outputExtension) {
        settings.outputExtension = settings.render ? '.html' : '.js';
    }
    if (settings.engine === 'underscore' || settings.engine === '_') {
        settings.engine = 'underscore';
        if (settings.templateSettings) underscore.templateSettings = settings.compileOptions;
    }

    var watcher = chokidar.watch(watchpath);

    watcher
        .on('add', settings.compile)
        .on('change', settings.compile)
        .on('error', callback);

    if (settings.onDelete) watcher.on('unlink', settings.onDelete);

};
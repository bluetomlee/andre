var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var andre = require('..');

var fixturesPath = path.join(__dirname, 'fixtures');
var distPath = path.join(fixturesPath, 'dist');
var expectedPath = path.join(fixturesPath, 'expected');
var srcPath = path.join(fixturesPath, 'src');
var tmplPath = path.join(fixturesPath, 'tmpl');

var write = fs.writeFileSync;
function read(filepath) {
    return fs.readFileSync(filepath).toString();
}
function expected(name) {
    return read(path.join(expectedPath, name));
}
function dist(name) {
    return read(path.join(distPath, name));
}
function tmpl(name) {
    return read(path.join(tmplPath, name));
}

describe("watch method", function() {

    var watch = andre.watch;

    it("automatically compiles template files", function(done) {
        var templatePath = path.join(srcPath, 'div.ejs');
        var writeTemplate = function(content) {
            fs.writeFileSync(templatePath, content);
        };
        // write the initial template (reset for test)
        writeTemplate('<div><%= text %></div>');
        var ctr = 0;
        watch(srcPath, distPath, function(err, name) {
            if (err) throw err;
            if (++ctr > 1) {
                expect(dist('div.js'))
                    .to.equal(expected('para.js'));
                done();
            } else {
                expect(dist('div.js'))
                    .to.equal(expected('div.js'));
                // for some unknown reason we have to wait for about 1/2 sec when checking for changes
                setTimeout(function() {
                    writeTemplate('<p><%= name %></p>');
                }, 1000);
            }
        });
    });


    it("automatically renders template files", function(done) {
        var templatePath = path.join(tmplPath, 'list.ejs');
        var writeTemplate = function(content) {
            fs.writeFileSync(templatePath, content);
        };
        // write the initial template (reset for test)
        writeTemplate('<ul><li><a href="<%= url %>"><%= text %></a></li></ul>');
        var ctr = 0;
        watch(tmplPath, {
            render: true,
            outputPath: distPath,
            data: {
                url: '\\',
                text: 'home'
            }
        }, function(err, name) {
            if (err) throw err;
            if (++ctr > 1) {
                expect(dist('list.html'))
                    .to.equal(expected('link.html'));
                done();
            } else {
                expect(dist('list.html'))
                    .to.equal(expected('list.html'));
                setTimeout(function() {
                    writeTemplate('<a href="<%= url %>"><%= text %></a>');
                }, 1000);
            }
        });
    });

});
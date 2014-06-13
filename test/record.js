var nock = require('nock');
var path = require('path');
var fs = require('fs');

module.exports = function (name, options) {
  options = options || {};
  var test_folder = options.test_folder || 'test';
  var fixtures_folder = options.fixtures_folder || 'fixtures';
  var fp = path.join(test_folder, fixtures_folder, name + '.js');
  var fixtures;

  return {
    before: function () {
      try {
        require('../' + fp);
        fixtures = true;
      } catch (e) {
        nock.recorder.rec({
          dont_print: true
        });
      }
    },
    after: function (done) {
      if (!fixtures) {
        fixtures = nock.recorder.play();
        var text = "var nock = require('nock');\n" + fixtures.join('\n');
        fs.writeFile(fp, text, done);
      } else {
        done();
      }
    }
  }
};

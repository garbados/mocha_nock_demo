var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var async = require('async');
var assert = require('assert');
var addInSet = require('../lib').addInSet;
var record = require('./record');

describe('addInSet', function () {
  var recorder = record('addInSet');
  before(recorder.before);

  before(function () {
    this.collection = 'addInSetTest';
  });

  beforeEach(function () {
    // prevent overlapping keys
    this.current_test_key = this.current_test_key || 0;
    this.key = String(this.current_test_key);
    this.current_test_key++;
  });

  after(function (done) {
    db.deleteCollection(this.collection)
    .then(function () {
      done();
    })
    .fail(done);
  });

  it('should insert 10 numbers in order', function (done) {
    var self = this;
    this.timeout(0);

    async.series([
      function (done) {
        // insert our data in order
        async.timesSeries(10, function (n, done) {
          addInSet(self.collection, self.key, n, done);
        }, done);
      },
      function (done) {
        // ensure our data is in order
        db.get(self.collection, self.key)
        .then(function (res) {
          var doc = res.body;
          assert(doc.numbers.length);
          // for each number we inserted
          // ensure they're inserted in order
          doc.numbers.reduce(function (a, b) {
            if (a) assert(b > a);
            return b;
          });
          done();
        })
        .fail(done);
      }
    ], done);
  });

  after(recorder.after);
});

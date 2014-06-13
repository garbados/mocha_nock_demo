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

  describe('should insert', function () {
    this.timeout(0);

    before(function () {
      var self = this;
      this.addInSetSeries = function (maximum, done) {
        async.timesSeries(maximum, addInSet.bind(null, self.collection, self.key), done);
      };

      this.assertOrder = function (done) {
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
      };

      this.addInSetTest = function (maximum, done) {
        async.series([
            self.addInSetSeries.bind(self, maximum),
            self.assertOrder
        ], done);
      };
    });

    it.only('10 numbers in order', function (done) {
      this.addInSetTest(10, done);
    });

    it('20 numbers in order', function (done) {
      this.addInSetTest(20, done);
    });

    it('30 numbers in order', function (done) {
      this.addInSetTest(30, done);
    });

    it('40 numbers in order', function (done) {
      this.addInSetTest(40, done);
    });
  });

  after(recorder.after);
});

var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);

function addInSet (collection, key, n, done) {
  function update (doc, done) {
    db.put(collection, key, doc)
    .then(function () {
      done();
    })
    .fail(done);
  }

  db.get(collection, key)
  .then(function (res) {
    var doc = res.body;
    doc.numbers.push(n);
    update(doc, done);
  })
  .fail(function (err) {
    if (err.statusCode === 404) {
      doc = {
        numbers: [n]
      };
      update(doc, done);
    } else {
      done(err);
    }
  });
}

module.exports = {
  addInSet: addInSet
};

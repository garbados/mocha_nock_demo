# Mocha Nock Demo

A demonstration of using Nock and Mocha together, using [Orchestrate.io][]

[Orchestrate.io]: http://orchestrate.io/

## Install

You'll need [git][] and [node.js][] to install the demo.

[git]: http://git-scm.com/
[node.js]: http://nodejs.org/

    git clone git@github.com:garbados/mocha_nock_demo.git
    cd mocha_nock_demo
    npm install
    export ORCHESTRATE_API_KEY=YOUR_API_KEY

Remember to replace `YOUR_API_KEY` with your actual Orchestrate API key.

## Usage

    npm test
    # record your HTTP calls

    npm test
    # run tests using those records

    NOCK_RECORD=1 npm test
    # re-record your HTTP calls

All the magic is in [test/record.js](https://github.com/garbados/mocha_nock_demo/blob/master/test/record.js),
so check it out to see how it works,
or use it in your own mocha tests, like this:

```javascript
var record = require('./record');

describe('your project', function () {
  var recorder = record('your_project');
  before(recorder.before);

  // ... all your tests

  after(recorder.after);
});
```

Enjoy!

## License

[ISC][], yo.

[ISC]: http://opensource.org/licenses/ISC

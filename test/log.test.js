const
    expect = require('expect'),
    {describe, test} = require('mocha'),
    log = require('../src/log.js');

describe('fua.core.log', function () {

    test.only('develop', function () {
        console.log(log);
    });

});

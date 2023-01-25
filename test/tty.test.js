const
    expect = require('expect'),
    {describe, test} = require('mocha'),
    tty = require('../src/tty.js');

describe('fua.core.tty', function () {

    test.only('develop', function () {
        console.log(tty);
    });

});

const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    util             = require('../src/core.util.js');

describe('core.util.logger', function () {

    test('logObject', function () {
        util.logObject('Hello World!');
        util.logObject({
            test:   'Hello World!',
            answer: 42,
            true:   true
        });
    });

    test('logTodo', function () {
        util.logTodo('Hello World!');
        // console.log(new Error('test'));
        util.logTodo('Lorem Ipsum');
    });

    test('logRequest/logResponse', async function () {
        const
            http   = require('http'),
            server = http.createServer(function (request, response) {
                util.logRequest(request);
                response.write('Hello World!');
                response.end();
            }),
            PORT   = 9090;

        await new Promise((resolve) => {
            server.listen(PORT, function () {
                const request = http.request({
                    hostname: 'localhost',
                    port:     PORT,
                    path:     '/test',
                    method:   'POST'
                }, function (response) {
                    util.logResponse(response);
                    resolve();
                });
                request.write('Lorem Ipsum');
                request.end();
            });
        });

        await new Promise(resolve => server.close(resolve));

    });

    describe('logTable', function () {

        test('rows: array of arrays, columns: null', function () {
            const columns = null;
            const rows    = [
                ['Hello', 'World'],
                ['Lorem', 'Ipsum']
            ];
            util.logTable(rows, columns);
        });

        test('rows: array of arrays, columns: array', function () {
            const columns = ['First Name', 'Last Name'];
            const rows    = [
                ['Simon', 'Petrac'],
                ['Jörg', 'Langkau']
            ];
            util.logTable(rows, columns);
        });

        test('rows: array of arrays, columns: object', function () {
            const columns = {
                0: 'firstName',
                1: 'lastName',
                _: 'index'
            };
            const rows    = [
                ['Simon', 'Petrac'],
                ['Jörg', 'Langkau']
            ];
            util.logTable(rows, columns);
        });

        test('rows: array of objects, columns: null', function () {
            const columns = null;
            const rows    = [
                {first: 'Test', 2: 'Test'},
                {first: 'Hello', last: 'World'},
                {first: 'Lorem', last: 'Ipsum'}
            ];
            util.logTable(rows, columns);
        });

        test('rows: array of objects, columns: array', function () {
            const columns = ['First Name', 'Last Name'];
            const rows    = [
                {0: 'Hello', 1: 'World'},
                {0: 'Lorem', 1: 'Ipsum', 2: 'Test'}
            ];
            util.logTable(rows, columns);
        });

        test('rows: array of objects, columns: object', function () {
            const columns = {
                _:    'Key',
                test: 'Test'
            };
            const rows    = [
                {test: 'Hello', test2: 'World'},
                {test: 'Simon'},
                {test: 'Jörg'}
            ];
            util.logTable(rows, columns);
        });

        test('rows: object of arrays, columns: null', function () {
            const columns = null;
            const rows    = {
                first:  ['Hello', 'World'],
                second: ['Lorem', 'Ipsum']
            };
            util.logTable(rows, columns);
        });

        test('rows: object of arrays, columns: array', function () {
            const columns = ['First Name', 'Second Name'];
            const rows    = {
                first:  ['Simon', 'Petrac'],
                second: ['Jörg', 'Langkau']
            };
            util.logTable(rows, columns);
        });

        test('rows: object of arrays, columns: object', function () {
            const columns = {
                _: 'POS',
                1: 'NAME'
            };
            const rows    = {
                first:  ['Simon', 'Petrac'],
                second: ['Jörg', 'Langkau']
            };
            util.logTable(rows, columns);
        });

        test('rows: object of objects, columns: null', function () {
            const columns = null;
            const rows    = {
                first:  {firstName: 'Simon', lastName: 'Petrac'},
                second: {firstName: 'Jörg', lastName: 'Langkau'}
            };
            util.logTable(rows, columns);
        });

        test('rows: object of objects, columns: array', function () {
            const columns = ['lastName'];
            const rows    = {
                first:  {1: 'Simon', 0: 'Petrac'},
                second: {1: 'Jörg', 0: 'Langkau'}
            };
            util.logTable(rows, columns);
        });

        test('rows: object of objects, columns: object', function () {
            const columns = {
                _:         'Key',
                firstName: 'First Name',
                lastName:  'Last Name',
                test:      '[Empty]'
            };
            const rows    = {
                first:  {firstName: 'Simon', lastName: 'Petrac'},
                second: {firstName: 'Jörg', lastName: 'Langkau'}
            };
            util.logTable(rows, columns);
        });

    });

});

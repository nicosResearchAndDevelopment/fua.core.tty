const
    expect = require('expect'),
    {describe, test} = require('mocha'),
    tty = require('../src/tty.js');

describe('fua.core.tty', function () {

    test.skip('develop', function () {
        console.log(tty.colors.enabled);

        // console.log(process.stdout.isTTY);
        // console.log(process.stdout.getColorDepth());
    });

    test('log', function () {
        tty.log('Hello World!');
        tty.log({
            test: 'Hello World!',
            answer: 42,
            true: true
        });
    });

    test('error', function () {
        tty.error({test: 'Hello World!'});
        tty.error(new Error('Hello World!'));
    });

    describe('colors', function () {

        test.skip('develop', function () {
            tty.output('colors = ' + tty.colors.depth);
            const step = 32;
            for (let red = 0; red < 256; red += step) {
                for (let green = 0; green < 256; green += step) {
                    for (let blue = 0; blue < 256; blue += step) {
                        const text = `(${red}, ${green}, ${blue})`;
                        tty.output(tty.colors.rgb(red, green, blue, text));
                    }
                }
            }

            const grey_step = 4;
            for (let grey = 0; grey < 256; grey += grey_step) {
                const text = `(${grey}, ${grey}, ${grey})`;
                tty.output(tty.colors.rgb(grey, grey, grey, text));
            }
        });

    });

    test('log.todo', function () {
        tty.log.todo('Hello World!');
        // console.log(new Error('test'));
        tty.log.todo('Lorem Ipsum');
    });

    test('log.request/response', async function () {
        const
            http = require('http'),
            server = http.createServer(function (request, response) {
                tty.log.request(request);
                response.write('Hello World!');
                response.end();
            }),
            PORT = 9090;

        await new Promise((resolve) => {
            server.listen(PORT, function () {
                const request = http.request({
                    hostname: 'localhost',
                    port: PORT,
                    path: '/test',
                    method: 'POST'
                }, function (response) {
                    tty.log.response(response);
                    resolve();
                });
                request.write('Lorem Ipsum');
                request.end();
            });
        });

        await new Promise(resolve => server.close(resolve));
    });

    describe('log.table', function () {

        test('rows: array of arrays, columns: null', function () {
            const columns = null;
            const rows = [
                ['Hello', 'World'],
                ['Lorem', 'Ipsum']
            ];
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: array of arrays, columns: array', function () {
            const columns = ['First Name', 'Last Name'];
            const rows = [
                ['Simon', 'Petrac'],
                ['Jörg', 'Langkau']
            ];
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: array of arrays, columns: object', function () {
            const columns = {
                0: 'firstName',
                1: 'lastName',
                _: 'index'
            };
            const rows = [
                ['Simon', 'Petrac'],
                ['Jörg', 'Langkau']
            ];
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: array of objects, columns: null', function () {
            const columns = null;
            const rows = [
                {first: 'Test', 2: 'Test'},
                {first: 'Hello', last: 'World'},
                {first: 'Lorem', last: 'Ipsum'}
            ];
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: array of objects, columns: array', function () {
            const columns = ['First Name', 'Last Name'];
            const rows = [
                {0: 'Hello', 1: 'World'},
                {0: 'Lorem', 1: 'Ipsum', 2: 'Test'}
            ];
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: array of objects, columns: object', function () {
            const columns = {
                _: 'Key',
                test: 'Test'
            };
            const rows = [
                {test: 'Hello', test2: 'World'},
                {test: 'Simon'},
                {test: 'Jörg'}
            ];
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: object of arrays, columns: null', function () {
            const columns = null;
            const rows = {
                first: ['Hello', 'World'],
                second: ['Lorem', 'Ipsum']
            };
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: object of arrays, columns: array', function () {
            const columns = ['First Name', 'Second Name'];
            const rows = {
                first: ['Simon', 'Petrac'],
                second: ['Jörg', 'Langkau']
            };
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: object of arrays, columns: object', function () {
            const columns = {
                _: 'POS',
                1: 'NAME'
            };
            const rows = {
                first: ['Simon', 'Petrac'],
                second: ['Jörg', 'Langkau']
            };
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: object of objects, columns: null', function () {
            const columns = null;
            const rows = {
                first: {firstName: 'Simon', lastName: 'Petrac'},
                second: {firstName: 'Jörg', lastName: 'Langkau'}
            };
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: object of objects, columns: array', function () {
            const columns = ['lastName'];
            const rows = {
                first: {1: 'Simon', 0: 'Petrac'},
                second: {1: 'Jörg', 0: 'Langkau'}
            };
            tty.log.table(rows, columns, this.test.title);
        });

        test('rows: object of objects, columns: object', function () {
            const columns = {
                _: 'Key',
                firstName: 'First Name',
                lastName: 'Last Name',
                test: '[Empty]'
            };
            const rows = {
                first: {firstName: 'Simon', lastName: 'Petrac'},
                second: {firstName: 'Jörg', lastName: 'Langkau'}
            };
            tty.log.table(rows, columns, this.test.title);
        });

    });

});

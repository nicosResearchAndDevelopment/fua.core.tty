const
    util = require('./util.js'),
    tty  = {};

tty.ESC = require('./tty.ESC.js');
tty.SGR = require('./tty.SGR.js');
tty.CPR = require('./tty.CPR.js');

tty.color  = require('./tty.color.js');
tty.style  = require('./tty.style.js');
tty.cursor = require('./tty.cursor.js');

/**
 * @param {BufferEncoding} [encoding='utf8']
 * @returns {Promise<string>}
 */
tty.read = (encoding = 'utf8') => new Promise((resolve, reject) => {
    /** @param {string | Buffer} data */
    const callback = (data) => resolve(Buffer.isBuffer(data) ? data.toString(encoding) : data);
    process.stdin.once('data', callback);
});

/**
 * @param {string | Buffer} data
 * @param {BufferEncoding} [encoding='utf8']
 * @returns {Promise<void>}
 */
tty.write = (data, encoding = 'utf8') => new Promise((resolve, reject) => {
    const callback = (err) => err ? reject(err) : resolve();
    process.stdout.write(data, encoding, callback);
});

/**
 * @param {string | Buffer} data
 * @param {BufferEncoding} [encoding='utf8']
 * @returns {Promise<void>}
 */
tty.write.error = (data, encoding = 'utf8') => new Promise((resolve, reject) => {
    const callback = (err) => err ? reject(err) : resolve();
    process.stderr.write(data, encoding, callback);
});

/**
 * @param {string} [prompt]
 * @returns {Promise<string>}
 */
tty.input = async function (prompt) {
    if (prompt) await tty.write(prompt + ': ');
    const data = await tty.read();
    return data.trim();
};

/**
 * @param {any} data
 */
tty.output = function (data) {
    tty.write(data + '\n').catch(console.error);
};

/**
 * @param {any} data
 */
tty.output.error = function (data) {
    tty.write.error(data + '\n').catch(console.error);
};

/**
 * @param {{[key: string]: any}} [locals={}]
 * @param {boolean} [banners=true]
 * @returns {Promise<void>}
 * @see https://docs.python.org/3/library/code.html
 */
tty.interact = async function (locals = {}, banners = true) {
    if (process.env.NODE_ENV === 'production') return;
    if (banners) tty.output('Interactive console attached.');
    let running  = true;
    const args   = [...Object.keys(locals), 'print', 'exit'];
    const values = [...Object.values(locals), tty.output, () => running = false];
    while (running) {
        const script = await tty.input('$');
        try {
            const runner = new Function(...args, 'return ' + script);
            const result = await runner.apply(null, values);
            if (typeof result !== 'undefined') tty.output(result);
        } catch (err) {
            tty.output.error(err);
        }
    }
    if (banners) tty.output('Interactive console disconnected.');
};

/**
 * @param {any} value
 * @returns {string}
 */
tty.inspect = function (value) {
    const options = {colors: tty.color.enabled, depth: null};
    return util.inspectWithOptions(value, options);
};

/**
 * @param {any} value
 */
tty.log = function (value) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect(value);
    tty.output(tty.color.grey(ts) + ' ' + text);
};

/**
 * @param {any} value
 */
tty.error = function (value) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect(value);
    tty.output.error(tty.color.grey(ts) + ' ' + tty.color.red(text));
};

/**
 * @param {string} [message='...']
 */
tty.log.text = function (message = '...') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.color.grey(ts) + ' ' + text);
};

/**
 * @param {string} [message='warning']
 */
tty.log.warning = function (message = 'warning') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.color.grey(ts) + ' ' + tty.color.yellow.bright(text));
};

/**
 * @param {string} [message='success']
 */
tty.log.success = function (message = 'success') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.color.grey(ts) + ' ' + tty.color.green(text));
};

/**
 * @param {string} [message='done']
 */
tty.log.done = function (message = 'done') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.color.grey(ts) + ' ' + tty.color.green(text));
};

/**
 * @param {string} [message='']
 */
tty.log.todo = function (message = '') {
    const errTarget       = {
        name:    tty.color.yellow(tty.style.bold('TODO')),
        message: message.trim().replace(/\s+/g, ' ')
    };
    const stackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    Error.captureStackTrace(errTarget, tty.log.todo);
    Error.stackTraceLimit = stackTraceLimit;
    const ts              = '[' + util.currentTime() + ']', text = errTarget.stack;
    tty.output(tty.color.grey(ts) + ' ' + text);
};

/**
 * @param {module:http.IncomingMessage | module:http.ClientRequest | Request} request
 * @returns {string}
 */
tty.inspect.request = function (request) {
    let result    = tty.style.bold(request.method)
        + ' ' + tty.color.cyan(request.url)
        + ' HTTP/' + (request.httpVersion || '');
    const headers = request.getHeaders
        ? Object.entries(request.getHeaders())
        : request.headers
            ? request.headers.entries
                ? request.headers.entries()
                : Object.entries(request.headers)
            : [];
    for (let [name, value] of headers) {
        const values = Array.isArray(value) ? value : [value]
        for (let header of values) {
            result += '\n  ' + tty.color.magenta(name) + ': ' + tty.color.green(header);
        }
    }
    return result;
};

/**
 * @param {module:http.IncomingMessage | module:http.ClientRequest | Response} request
 */
tty.log.request = function (request) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect.request(request);
    tty.output(tty.color.grey(ts) + ' ' + text);
};

/**
 * @param {module:http.IncomingMessage | module:http.ServerResponse} response
 * @returns {string}
 */
tty.inspect.response = function (response) {
    let result    = 'HTTP/' + (response.httpVersion || '')
        + ' ' + tty.style.bold(response.statusCode || response.status || '')
        + ' ' + tty.style.italic(response.statusMessage || response.statusText || '');
    const headers = response.getHeaders
        ? Object.entries(response.getHeaders())
        : response.headers
            ? response.headers.entries
                ? response.headers.entries()
                : Object.entries(response.headers)
            : [];
    for (let [name, value] of headers) {
        const values = Array.isArray(value) ? value : [value]
        for (let header of values) {
            result += '\n  ' + tty.color.magenta(name) + ': ' + tty.color.green(header);
        }
    }
    return result;
};

/**
 * @param {module:http.IncomingMessage | module:http.ServerResponse} response
 */
tty.log.response = function (response) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect.response(response);
    tty.output(tty.color.grey(ts) + ' ' + text);
};

/**
 * @param {Array<Array<unknown>> | Array<{[col: string]: unknown}> | {[row: string]: Array<unknown>} | {[row:string]: {[col: string]: unknown}}} rows
 * @param {Array<string> | {[key: number | string]: string}} [columns]
 * @param {string} [tableName]
 * @returns {string}
 */
tty.inspect.table = function (rows, columns, tableName) {
    const
        collapseWhitespace = (text) => text.replace(/\s+/g, ' ').trim(),
        colKeys            = columns ? Object.keys(columns) : [],
        colTitles          = columns ? Object.values(columns).map(collapseWhitespace) : [],
        colSizes           = columns ? colTitles.map(title => Math.max(3, title.length)) : [],
        // padValues          = (value, index) => value.padEnd(colSizes[index], ' '),
        padValues          = (value, index) => value.padStart((colSizes[index] + value.length) / 2, ' ').padEnd(colSizes[index], ' '),
        rowEntries         = [],
        resultEntries      = [];

    if (!columns) {
        const keySet = new Set();
        for (let row of Object.values(rows)) {
            for (let key of Object.keys(row)) {
                keySet.add(key);
            }
        }
        colKeys.push('_');
        colTitles.push(Array.isArray(rows) ? '(index)' : '(key)');
        colSizes.push(colTitles[0].length);
        for (let key of keySet) {
            colKeys.push(key);
            const title = collapseWhitespace(key);
            colTitles.push(title);
            colSizes.push(Math.max(3, title.length));
        }
    }

    for (let [rowIndex, row] of Object.entries(rows)) {
        const entry = new Array(colKeys.length);
        rowEntries.push(entry);
        for (let colIndex = 0; colIndex < colKeys.length; colIndex++) {
            const colKey = colKeys[colIndex];
            let colValue = '';
            if (colKey === '_') colValue += rowIndex;
            else colValue += row[colKey] ?? '';
            colValue = collapseWhitespace(colValue);
            if (colValue.length > colSizes[colIndex]) colSizes[colIndex] = colValue.length;
            entry[colIndex] = colValue;
        }
    }

    resultEntries.push((tableName ? tty.color.yellow(tableName) + ' ' : '') + tty.color.grey(`(${colTitles.length} columns, ${rowEntries.length} rows)`));
    resultEntries.push(tty.color.grey('┌─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┬─') + '─┐'));
    resultEntries.push(tty.color.grey('| ') + colTitles.map(padValues).map(tty.style.bold).join(tty.color.grey(' | ')) + tty.color.grey(' |'));
    resultEntries.push(tty.color.grey('├─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┼─') + '─┤'));
    for (let entry of rowEntries) {
        resultEntries.push(tty.color.grey('| ') + entry.map(padValues).join(tty.color.grey(' | ')) + tty.color.grey(' |'));
    }
    resultEntries.push(tty.color.grey('└─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┴─') + '─┘'));

    return resultEntries.join('\n');
};

/**
 * @param {Array<Array<unknown>> | Array<{[col: string]: unknown}> | {[row: string]: Array<unknown>} | {[row:string]: {[col: string]: unknown}}} rows
 * @param {Array<string> | {[key: number | string]: string}} [columns]
 * @param {string} [tableName]
 */
tty.log.table = function (rows, columns, tableName) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect.table(rows, columns, tableName);
    tty.output(tty.color.grey(ts) + ' ' + text);
};

util.sealModule(tty);
module.exports = tty;

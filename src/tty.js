const
    util = require('./util.js'),
    tty = {};

tty.colors = require('./tty.colors.js');

/**
 * @param {string} [prompt]
 * @returns {Promise<string>}
 */
tty.input = async function (prompt) {
    if (prompt) process.stdout.write(prompt + ': ');
    const data = await new Promise(resolve => process.stdin.once('data', resolve));
    return data.toString().trim();
};

/**
 * @param {any} data
 */
tty.output = function (data) {
    process.stdout.write(data + '\n');
};

/**
 * @param {any} data
 */
tty.output.error = function (data) {
    process.stderr.write(data + '\n');
};

// IDEA tty.interact like https://docs.python.org/3/library/code.html

/**
 * @param {any} value
 * @returns {string}
 */
tty.inspect = function (value) {
    const options = {colors: tty.colors.enabled, depth: null};
    return util.formatWithOptions(options, value);
};

/**
 * @param {any} value
 */
tty.log = function (value) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect(value);
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

/**
 * @param {any} value
 */
tty.error = function (value) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect(value);
    tty.output.error(tty.colors.grey(ts) + ' ' + tty.colors.red(text));
};

/**
 * @param {string} [message='...']
 */
tty.log.text = function (message = '...') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

/**
 * @param {string} [message='warning']
 */
tty.log.warning = function (message = 'warning') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + tty.colors.yellow.bright(text));
};

/**
 * @param {string} [message='success']
 */
tty.log.success = function (message = 'success') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + tty.colors.green(text));
};

/**
 * @param {string} [message='done']
 */
tty.log.done = function (message = 'done') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + tty.colors.green(text));
};

/**
 * @param {string} [message='']
 */
tty.log.todo = function (message = '') {
    const errTarget = {
        name: tty.colors.yellow(tty.colors.style.bold('TODO')),
        message: message.trim().replace(/\s+/g, ' ')
    };
    const stackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    Error.captureStackTrace(errTarget, tty.log.todo);
    Error.stackTraceLimit = stackTraceLimit;
    const ts = '[' + util.currentTime() + ']', text = errTarget.stack;
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

/**
 * @param {module:http.IncomingMessage | module:http.ClientRequest} request
 * @returns {string}
 */
tty.inspect.request = function (request) {
    let result = tty.colors.style.bold(request.method) + ' ' + tty.colors.cyan(request.url) + ' HTTP/' + request.httpVersion;
    for (let [key, value] of Object.entries(request.headers)) {
        result += '\n  ' + tty.colors.magenta(key) + ': ' + tty.colors.green(value);
    }
    return result;
};

/**
 * @param {module:http.IncomingMessage | module:http.ClientRequest} request
 */
tty.log.request = function (request) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect.request(request);
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

/**
 * @param {module:http.IncomingMessage | module:http.ServerResponse} response
 * @returns {string}
 */
tty.inspect.response = function (response) {
    let result = 'HTTP/' + response.httpVersion + ' ' + tty.colors.style.bold(response.statusCode) + ' ' + tty.colors.style.italic(response.statusMessage);
    for (let [key, value] of Object.entries(response.headers)) {
        result += '\n  ' + tty.colors.magenta(key) + ': ' + tty.colors.green(value);
    }
    return result;
};

/**
 * @param {module:http.IncomingMessage | module:http.ServerResponse} response
 */
tty.log.response = function (response) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect.response(response);
    tty.output(tty.colors.grey(ts) + ' ' + text);
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
        colKeys = columns ? Object.keys(columns) : [],
        colTitles = columns ? Object.values(columns).map(collapseWhitespace) : [],
        colSizes = columns ? colTitles.map(title => Math.max(3, title.length)) : [],
        // padValues          = (value, index) => value.padEnd(colSizes[index], ' '),
        padValues = (value, index) => value.padStart((colSizes[index] + value.length) / 2, ' ').padEnd(colSizes[index], ' '),
        rowEntries = [],
        resultEntries = [];

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

    resultEntries.push((tableName ? tty.colors.yellow(tableName) + ' ' : '') + tty.colors.grey(`(${colTitles.length} columns, ${rowEntries.length} rows)`));
    resultEntries.push(tty.colors.grey('┌─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┬─') + '─┐'));
    resultEntries.push(tty.colors.grey('| ') + colTitles.map(padValues).map(tty.colors.style.bold).join(tty.colors.grey(' | ')) + tty.colors.grey(' |'));
    resultEntries.push(tty.colors.grey('├─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┼─') + '─┤'));
    for (let entry of rowEntries) {
        resultEntries.push(tty.colors.grey('| ') + entry.map(padValues).join(tty.colors.grey(' | ')) + tty.colors.grey(' |'));
    }
    resultEntries.push(tty.colors.grey('└─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┴─') + '─┘'));

    return resultEntries.join('\n');
};

/**
 * @param {Array<Array<unknown>> | Array<{[col: string]: unknown}> | {[row: string]: Array<unknown>} | {[row:string]: {[col: string]: unknown}}} rows
 * @param {Array<string> | {[key: number | string]: string}} [columns]
 * @param {string} [tableName]
 */
tty.log.table = function (rows, columns, tableName) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect.table(rows, columns, tableName);
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

util.sealModule(tty);
module.exports = tty;

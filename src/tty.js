const
    util = require('./util.js'),
    tty = {};

tty.colors = require('./tty.colors.js');

tty.input = async function () {
    const data = await new Promise(resolve => process.stdin.once('data', resolve));
    return data.toString().trim();
};

tty.output = function (data) {
    process.stdout.write(data + '\n');
};

tty.output.error = function (data) {
    process.stderr.write(data + '\n');
};

tty.inspect = function (value) {
    const options = {colors: tty.colors.enabled, depth: null};
    return util.formatWithOptions(options, value);
};

tty.log = function (value) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect(value);
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

tty.error = function (value) {
    const ts = '[' + util.currentTime() + ']', text = tty.inspect(value);
    tty.output.error(tty.colors.grey(ts) + ' ' + tty.colors.red(text));
};

tty.log.text = function (message = '...') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

tty.log.warning = function (message = 'warning') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + tty.colors.yellow.bright(text));
};

tty.log.success = function (message = 'success') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + tty.colors.green(text));
};

tty.log.done = function (message = 'done') {
    const ts = '[' + util.currentTime() + ']', text = '' + message;
    tty.output(tty.colors.grey(ts) + ' ' + tty.colors.green(text));
};

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

tty.log.request = function (request) {
    let text = tty.colors.style.bold(request.method) + ' ' + tty.colors.cyan(request.url) + ' HTTP/' + request.httpVersion;
    for (let [key, value] of Object.entries(request.headers)) {
        text += '\n  ' + tty.colors.magenta(key) + ': ' + tty.colors.green(value);
    }
    const ts = '[' + util.currentTime() + ']';
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

tty.log.response = function (response) {
    let text = 'HTTP/' + response.httpVersion + ' ' + tty.colors.style.bold(response.statusCode) + ' ' + tty.colors.style.italic(response.statusMessage);
    for (let [key, value] of Object.entries(response.headers)) {
        text += '\n  ' + tty.colors.magenta(key) + ': ' + tty.colors.green(value);
    }
    const ts = '[' + util.currentTime() + ']';
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

tty.log.table = function (rows, columns, tableName) {
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

    const ts = '[' + util.currentTime() + ']', text = resultEntries.join('\n');
    tty.output(tty.colors.grey(ts) + ' ' + text);
};

// TODO

util.sealModule(tty);
module.exports = tty;

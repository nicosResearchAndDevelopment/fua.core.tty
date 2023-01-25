const
    _         = require('./core.util.js'),
    _color    = require('./core.util.logger.colors.js'),
    {inspect} = require('util');

function _log(txt) {
    const
        ts  = _.NODE_PROD ? _.dateTime() : _.localTime(),
        log = _color.grey('[' + ts + ']') + ' ' + txt;

    process.stdout.write(log + '\n');
} // _log

exports.logText = function (txt) {
    _log(txt);
}; // logText

exports.logWarning = function (msg = 'warning') {
    _log(_color.yellowBright(msg));
}; // logWarning

exports.logDone = function (msg = 'done') {
    _log(_color.green(msg));
}; // logDone

exports.logSuccess = function (msg = 'success') {
    _log(_color.green(msg));
}; // logSuccess

exports.logError = function (err) {
    _log(_color.redBright(err?.stack ?? err));
}; // logError

exports.logObject = function (obj) {
    // TODO implement own function
    _log(inspect(obj, {
        depth:   10,
        colors:  true,
        sorted:  true,
        getters: true
    }));
}; // logObject

exports.logTodo = function (msg = '') {
    const
        tempErrorTarget = {
            name:    _color.yellow(_color.bold('TODO')),
            message: msg.trim().replace(/\s+/g, ' ')
        },
        prevTraceLimit  = Error.stackTraceLimit;

    Error.stackTraceLimit = 1;
    Error.captureStackTrace(tempErrorTarget, exports.logTodo);
    Error.stackTraceLimit = prevTraceLimit;

    _log(tempErrorTarget.stack);
}; // logTodo

exports.logRequest = function (request) {
    let str = _color.bold(request.method) + ' ' + _color.cyan(request.url) + ' HTTP/' + request.httpVersion;
    for (let [key, value] of Object.entries(request.headers)) {
        str += '\n  ' + _color.magenta(key) + ': ' + _color.green(value);
    }
    _log(str);
}; // logRequest

exports.logResponse = function (response) {
    let str = 'HTTP/' + response.httpVersion + ' ' + _color.bold(response.statusCode) + ' ' + _color.italic(response.statusMessage);
    for (let [key, value] of Object.entries(response.headers)) {
        str += '\n  ' + _color.magenta(key) + ': ' + _color.green(value);
    }
    _log(str);
}; // logResponse

let tableCount = 0;

exports.logTable = function (rows, columns, tableName) {
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

    if (!tableName) {
        tableCount++;
        tableName = 'Table ' + tableCount;
    }

    resultEntries.push(_color.yellow(tableName) + ' ' + _color.grey(`(${colTitles.length} columns, ${rowEntries.length} rows)`));
    resultEntries.push(_color.grey('┌─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┬─') + '─┐'));
    resultEntries.push(_color.grey('| ') + colTitles.map(padValues).map(_color.bold).join(_color.grey(' | ')) + _color.grey(' |'));
    resultEntries.push(_color.grey('├─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┼─') + '─┤'));
    for (let entry of rowEntries) {
        resultEntries.push(_color.grey('| ') + entry.map(padValues).join(_color.grey(' | ')) + _color.grey(' |'));
    }
    resultEntries.push(_color.grey('└─' + colSizes.map(size => ''.padEnd(size, '─')).join('─┴─') + '─┘'));

    return _log(resultEntries.join('\n'));
};

const
    util = exports,
    {formatWithOptions} = require('util');

util.inspectWithOptions = (value, options = {}) => formatWithOptions(options, value);

util.sealModule = function (target) {
    Object.freeze(target);
    for (const child of Object.values(target)) {
        if (child instanceof RegExp) continue;
        if (child instanceof Object) util.sealModule(child);
    }
};

util.currentTime = process.env.NODE_ENV === 'production' ? function () {
    const current = new Date();
    return current.toISOString();
} : function () {
    const current = new Date();
    return current.getHours().toString().padStart(2, '0')
        + ':' + current.getMinutes().toString().padStart(2, '0')
        + ':' + current.getSeconds().toString().padStart(2, '0')
        + '.' + current.getMilliseconds().toString().padStart(3, '0');
};

util.offsetText = function (text, offset) {
    return text.replace(/^/mg, ''.padStart(offset, ' '));
};

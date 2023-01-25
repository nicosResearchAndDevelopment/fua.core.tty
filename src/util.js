const
    util = exports,
    {formatWithOptions} = require('util');

util.formatWithOptions = formatWithOptions;

util.sealModule = function sealModule(target) {
    Object.freeze(target);
    for (const child of Object.values(target)) {
        if (child instanceof RegExp) continue;
        if (child instanceof Object) sealModule(child);
    }
};

util.currentTime = process.env.NODE_ENV === 'production' ? function prodTime() {
    const current = new Date();
    return current.toISOString();
} : function localTime() {
    const current = new Date();
    return current.getHours().toString().padStart(2, '0')
        + ':' + current.getMinutes().toString().padStart(2, '0')
        + ':' + current.getSeconds().toString().padStart(2, '0')
        + '.' + current.getMilliseconds().toString().padStart(3, '0');
};

util.offsetText = function offsetText(text, offset) {
    return text.replace(/^/mg, ''.padStart(offset, ' '));
};

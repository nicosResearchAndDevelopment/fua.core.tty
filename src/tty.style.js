const SGR = require('./tty.SGR.js');

/**
 * @param {string} text
 * @param {string} [OPEN]
 * @param {string} [CLOSE]
 * @returns {string}
 * @see https://github.com/doowb/ansi-colors/blob/master/index.js doowb - ansi-colors
 * @see https://github.com/lukeed/kleur/blob/master/colors.mjs lukeed - kleur/colors
 */
const style = function (text, OPEN, CLOSE) {
    text = '' + text;
    if (!style.enabled || !text || !OPEN || !CLOSE) return text;
    return OPEN + text.split(CLOSE).join(CLOSE + OPEN) + CLOSE;
};

/** @type {boolean} */
style.enabled = (() => {
    if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
    if (process.env.NODE_DISABLE_COLORS === '1' || process.env.NO_COLOR) return false;
    return process.stdout && process.stdout.isTTY;
})();

// Modifiers: https://nodejs.org/api/util.html#modifiers
style.reset = () => style.enabled ? SGR.RESET : '';

style.bold             = (text) => style(text, SGR.BOLD, SGR.NORMAL_COLOR_OR_INTENSITY);
style.faint            = (text) => style(text, SGR.FAINT, SGR.NORMAL_COLOR_OR_INTENSITY);
style.italic           = (text) => style(text, SGR.ITALIC, SGR.NOT_ITALIC_NOT_FRAKTUR);
style.underline        = (text) => style(text, SGR.UNDERLINE, SGR.UNDERLINE_OFF);
style.underline.double = (text) => style(text, SGR.DOUBLY_UNDERLINE_OR_BOLD_OFF, SGR.UNDERLINE_OFF);
style.strike           = (text) => style(text, SGR.CROSSED_OUT, SGR.NOT_CROSSED_OUT);

module.exports = style;

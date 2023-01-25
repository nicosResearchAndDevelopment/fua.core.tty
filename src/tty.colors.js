/**
 * @see https://github.com/doowb/ansi-colors/blob/master/index.js doowb - ansi-colors
 * @see https://github.com/lukeed/kleur/blob/master/colors.mjs lukeed - kleur/colors
 */
const colors = exports;

colors.SGR = require('./tty.colors.SGR.js');

/** @type {boolean} */
colors.enabled = (function ttyColorsEnabled() {
    if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
    if (process.env.NODE_DISABLE_COLORS === '1' || process.env.NO_COLOR) return false;
    return process.stdout && process.stdout.isTTY && process.stdout.hasColors();
})();

/** @type {1 | 4 | 8 | 24} */
colors.depth = (function ttyColorsSupported() {
    if (!(colors.enabled && process.stdout && process.stdout.isTTY)) return 1;
    return process.stdout.getColorDepth();
})();

// Modifiers: https://nodejs.org/api/util.html#modifiers
colors.reset = () => colors.enabled ? colors.SGR.RESET : '';
colors.inverse = (text) => colors.style(text, colors.SGR.REVERSE_VIDEO, colors.SGR.INVERSE_OFF);

/**
 * @param {string} text
 * @param {string} [OPEN]
 * @param {string} [CLOSE]
 * @param {RegExp} [RE_CLOSE]
 * @returns {string}
 */
colors.style = function (text, OPEN, CLOSE, RE_CLOSE) {
    if (!colors.enabled || !text || !OPEN || !CLOSE) return text;
    if (!RE_CLOSE || !text.includes(CLOSE)) return OPEN + text + CLOSE;
    return OPEN + text.replace(RE_CLOSE, CLOSE + OPEN) + CLOSE;
};

colors.style.bold = (text) => colors.style(text, colors.SGR.BOLD, colors.SGR.NORMAL_COLOR_OR_INTENSITY, colors.SGR.RE.NORMAL_COLOR_OR_INTENSITY);
colors.style.faint = (text) => colors.style(text, colors.SGR.FAINT, colors.SGR.NORMAL_COLOR_OR_INTENSITY, colors.SGR.RE.NORMAL_COLOR_OR_INTENSITY);
colors.style.italic = (text) => colors.style(text, colors.SGR.ITALIC, colors.SGR.NOT_ITALIC_NOT_FRAKTUR, colors.SGR.RE.NOT_ITALIC_NOT_FRAKTUR);
colors.style.underline = (text) => colors.style(text, colors.SGR.UNDERLINE, colors.SGR.UNDERLINE_OFF, colors.SGR.RE.UNDERLINE_OFF);
colors.style.underline.double = (text) => colors.style(text, colors.SGR.DOUBLY_UNDERLINE_OR_BOLD_OFF, colors.SGR.UNDERLINE_OFF, colors.SGR.RE.UNDERLINE_OFF);
colors.style.strike = (text) => colors.style(text, colors.SGR.CROSSED_OUT, colors.SGR.NOT_CROSSED_OUT, colors.SGR.RE.NOT_CROSSED_OUT);

// SEE https://nodejs.org/api/util.html#foreground-colors

colors.black = (text) => colors.style(text, colors.SGR.FG_BLACK, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.red = (text) => colors.style(text, colors.SGR.FG_RED, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.green = (text) => colors.style(text, colors.SGR.FG_GREEN, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.yellow = (text) => colors.style(text, colors.SGR.FG_YELLOW, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.blue = (text) => colors.style(text, colors.SGR.FG_BLUE, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.magenta = (text) => colors.style(text, colors.SGR.FG_MAGENTA, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.cyan = (text) => colors.style(text, colors.SGR.FG_CYAN, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.white = (text) => colors.style(text, colors.SGR.FG_WHITE, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.grey = (text) => colors.black.bright(text);
colors.gray = (text) => colors.black.bright(text);

colors.black.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_BLACK, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.red.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_RED, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.green.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_GREEN, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.yellow.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_YELLOW, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.blue.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_BLUE, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.magenta.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_MAGENTA, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.cyan.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_CYAN, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);
colors.white.bright = (text) => colors.style(text, colors.SGR.FG_BRIGHT_WHITE, colors.SGR.DEFAULT_FOREGROUND_COLOR, colors.SGR.RE.DEFAULT_FOREGROUND_COLOR);

// SEE https://nodejs.org/api/util.html#background-colors

colors.black.background = (text) => colors.style(text, colors.SGR.BG_BLACK, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.red.background = (text) => colors.style(text, colors.SGR.BG_RED, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.green.background = (text) => colors.style(text, colors.SGR.BG_GREEN, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.yellow.background = (text) => colors.style(text, colors.SGR.BG_YELLOW, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.blue.background = (text) => colors.style(text, colors.SGR.BG_BLUE, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.magenta.background = (text) => colors.style(text, colors.SGR.BG_MAGENTA, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.cyan.background = (text) => colors.style(text, colors.SGR.BG_CYAN, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.white.background = (text) => colors.style(text, colors.SGR.BG_WHITE, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.grey.background = (text) => colors.black.bright.background(text);
colors.gray.background = (text) => colors.black.bright.background(text);

colors.black.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_BLACK, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.red.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_RED, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.green.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_GREEN, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.yellow.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_YELLOW, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.blue.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_BLUE, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.magenta.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_MAGENTA, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.cyan.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_CYAN, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);
colors.white.bright.background = (text) => colors.style(text, colors.SGR.BG_BRIGHT_WHITE, colors.SGR.DEFAULT_BACKGROUND_COLOR, colors.SGR.RE.DEFAULT_BACKGROUND_COLOR);

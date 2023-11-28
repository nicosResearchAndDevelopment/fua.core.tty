const
    SGR   = require('./tty.SGR.js'),
    style = require('./tty.style.js');

/**
 * @param {string} text
 * @param {string} [OPEN]
 * @returns {string}
 * @see https://github.com/doowb/ansi-colors/blob/master/index.js doowb - ansi-colors
 * @see https://github.com/lukeed/kleur/blob/master/colors.mjs lukeed - kleur/colors
 */
const color = function (text, OPEN) {
    return color.enabled ? style(text, OPEN, SGR.DEFAULT_FOREGROUND_COLOR) : '' + text;
};

/**
 * @param {string} text
 * @param {string} [OPEN]
 * @returns {string}
 */
color.background = function (text, OPEN) {
    return color.enabled ? style(text, OPEN, SGR.DEFAULT_BACKGROUND_COLOR) : '' + text;
};

/** @type {boolean} */
color.enabled = (() => {
    if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
    if (process.env.NODE_DISABLE_COLORS === '1' || process.env.NO_COLOR) return false;
    return process.stdout && process.stdout.isTTY && process.stdout.hasColors();
})();

/** @type {1 | 4 | 8 | 24} */
color.depth = (() => {
    if (!(color.enabled && process.stdout && process.stdout.isTTY)) return 1;
    if (process.env.FORCE_COLOR) return parseInt(process.env.FORCE_COLOR);
    return process.stdout.getColorDepth();
})();

// Modifiers: https://nodejs.org/api/util.html#modifiers
color.inverse = (text) => style(text, SGR.REVERSE_VIDEO, SGR.INVERSE_OFF);

// SEE https://nodejs.org/api/util.html#foreground-colors

color.black   = (text) => color(text, SGR.FG_BLACK);
color.red     = (text) => color(text, SGR.FG_RED);
color.green   = (text) => color(text, SGR.FG_GREEN);
color.yellow  = (text) => color(text, SGR.FG_YELLOW);
color.blue    = (text) => color(text, SGR.FG_BLUE);
color.magenta = (text) => color(text, SGR.FG_MAGENTA);
color.cyan    = (text) => color(text, SGR.FG_CYAN);
color.white   = (text) => color(text, SGR.FG_WHITE);
color.grey    = (text) => color.black.bright(text);
color.gray    = (text) => color.black.bright(text);

color.black.bright   = (text) => color(text, SGR.FG_BRIGHT_BLACK);
color.red.bright     = (text) => color(text, SGR.FG_BRIGHT_RED);
color.green.bright   = (text) => color(text, SGR.FG_BRIGHT_GREEN);
color.yellow.bright  = (text) => color(text, SGR.FG_BRIGHT_YELLOW);
color.blue.bright    = (text) => color(text, SGR.FG_BRIGHT_BLUE);
color.magenta.bright = (text) => color(text, SGR.FG_BRIGHT_MAGENTA);
color.cyan.bright    = (text) => color(text, SGR.FG_BRIGHT_CYAN);
color.white.bright   = (text) => color(text, SGR.FG_BRIGHT_WHITE);

/**
 * @param {number} red from 0 to 255
 * @param {number} green from 0 to 255
 * @param {number} blue from 0 to 255
 * @param {string} text
 * @returns {string}
 */
color.rgb = function (red, green, blue, text) {
    if (color.depth >= 24) {
        return color(text, SGR.FG_COLOR_24(Math.floor(red), Math.floor(green), Math.floor(blue)));
    } else if (color.depth >= 8) {
        //   16-231:  6 × 6 × 6 cube (216 colors): 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5)
        //  232-255:  grayscale from black to white in 24 steps
        const index = (green !== red || green !== blue)
            ? 16 + 36 * Math.floor(0.0234375 * red) + 6 * Math.floor(0.0234375 * green) + Math.floor(0.0234375 * blue)
            : 232 + Math.floor(0.09375 * green);
        return color(text, SGR.FG_COLOR_8(Math.floor(index)));
    } else if (color.depth >= 4) {
        //    0-  7:  standard colors (as in ESC [ 30–37 m)
        //    8- 15:  high intensity colors (as in ESC [ 90–97 m)
        const index = Math.floor(red / 128) + 2 * Math.floor(green / 128) + 4 * Math.floor(blue / 128);
        return color(text, SGR.FG_COLOR_8(Math.floor(index)));
    } else {
        return text;
    }
};

// SEE https://nodejs.org/api/util.html#background-colors

color.background.black   = (text) => color.background(text, SGR.BG_BLACK);
color.background.red     = (text) => color.background(text, SGR.BG_RED);
color.background.green   = (text) => color.background(text, SGR.BG_GREEN);
color.background.yellow  = (text) => color.background(text, SGR.BG_YELLOW);
color.background.blue    = (text) => color.background(text, SGR.BG_BLUE);
color.background.magenta = (text) => color.background(text, SGR.BG_MAGENTA);
color.background.cyan    = (text) => color.background(text, SGR.BG_CYAN);
color.background.white   = (text) => color.background(text, SGR.BG_WHITE);
color.background.grey    = (text) => color.background.black.bright(text);
color.background.gray    = (text) => color.background.black.bright(text);

color.background.black.bright   = (text) => color.background(text, SGR.BG_BRIGHT_BLACK);
color.background.red.bright     = (text) => color.background(text, SGR.BG_BRIGHT_RED);
color.background.green.bright   = (text) => color.background(text, SGR.BG_BRIGHT_GREEN);
color.background.yellow.bright  = (text) => color.background(text, SGR.BG_BRIGHT_YELLOW);
color.background.blue.bright    = (text) => color.background(text, SGR.BG_BRIGHT_BLUE);
color.background.magenta.bright = (text) => color.background(text, SGR.BG_BRIGHT_MAGENTA);
color.background.cyan.bright    = (text) => color.background(text, SGR.BG_BRIGHT_CYAN);
color.background.white.bright   = (text) => color.background(text, SGR.BG_BRIGHT_WHITE);

/**
 * @param {number} red from 0 to 255
 * @param {number} green from 0 to 255
 * @param {number} blue from 0 to 255
 * @param {string} text
 * @returns {string}
 */
color.background.rgb = function (red, green, blue, text) {
    if (color.depth >= 24) {
        return color.background(text, SGR.BG_COLOR_24(Math.floor(red), Math.floor(green), Math.floor(blue)));
    } else if (color.depth >= 8) {
        //   16-231:  6 × 6 × 6 cube (216 colors): 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5)
        //  232-255:  grayscale from black to white in 24 steps
        const index = (green !== red || green !== blue)
            ? 16 + 36 * Math.floor(0.0234375 * red) + 6 * Math.floor(0.0234375 * green) + Math.floor(0.0234375 * blue)
            : 232 + Math.floor(0.09375 * green);
        return color.background(text, SGR.BG_COLOR_8(Math.floor(index)));
    } else if (color.depth >= 4) {
        //    0-  7:  standard colors (as in ESC [ 30–37 m)
        //    8- 15:  high intensity colors (as in ESC [ 90–97 m)
        const index = Math.floor(red / 128) + 2 * Math.floor(green / 128) + 4 * Math.floor(blue / 128);
        return color.background(text, SGR.BG_COLOR_8(Math.floor(index)));
    } else {
        return text;
    }
};

module.exports = color;

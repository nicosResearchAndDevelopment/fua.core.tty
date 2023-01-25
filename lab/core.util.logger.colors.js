const enabled = _enabled();

function _enabled() {
    if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
    if (process.env.NODE_DISABLE_COLORS === '1' || process.env.NO_COLOR) return false;
    return process.stdout && process.stdout.isTTY && process.stdout.hasColors();
} // _enabled

/**
 * @param {number} open
 * @param {number} close
 * @returns {function(string): string}
 * @see https://chrisyeh96.github.io/2020/03/28/terminal-colors.html Chris Yeh - Terminal Colors
 * @see https://github.com/doowb/ansi-colors/blob/master/index.js doowb - ansi-colors
 * @see https://github.com/lukeed/kleur/blob/master/colors.mjs lukeed - kleur/colors
 * @see https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences List of ANSI color escape sequences
 */
function _create(open, close) {
    const
        openTag    = `\x1b[${open}m`,
        closeTag   = `\x1b[${close}m`,
        closeRegex = new RegExp(`\\x1b\\[${close}m`, 'g');

    return function (txt) {
        txt = '' + txt;
        if (!(enabled && txt)) return txt;
        if (!txt.includes(closeTag)) return openTag + txt + closeTag;
        return openTag + txt.replace(closeRegex, closeTag + openTag) + closeTag;
    };
} // _create

// Modifiers: https://nodejs.org/api/util.html#modifiers
exports.reset           = _create(0, 0);
exports.bold            = _create(1, 22);
exports.italic          = _create(3, 23);
exports.underline       = _create(4, 24);
exports.strikethrough   = _create(9, 29);
exports.strikeThrough   = exports.strikethrough;
exports.crossedout      = exports.strikethrough;
exports.crossedOut      = exports.strikethrough;
exports.hidden          = _create(8, 28);
exports.dim             = _create(2, 22);
exports.faint           = exports.dim;
exports.overlined       = _create(53, 55);
exports.blink           = _create(5, 25);
exports.inverse         = _create(7, 27);
exports.swapcolors      = exports.inverse;
exports.swapColors      = exports.inverse;
exports.doubleunderline = _create(21, 24);
exports.doubleUnderline = exports.doubleunderline;
exports.framed          = _create(51, 54);

// Foreground colors: https://nodejs.org/api/util.html#foreground-colors
exports.black         = _create(30, 39);
exports.red           = _create(31, 39);
exports.green         = _create(32, 39);
exports.yellow        = _create(33, 39);
exports.blue          = _create(34, 39);
exports.magenta       = _create(35, 39);
exports.cyan          = _create(36, 39);
exports.white         = _create(37, 39);
exports.gray          = _create(90, 39);
exports.grey          = exports.gray;
exports.blackBright   = exports.gray;
exports.redBright     = _create(91, 39);
exports.greenBright   = _create(92, 39);
exports.yellowBright  = _create(93, 39);
exports.blueBright    = _create(94, 39);
exports.magentaBright = _create(95, 39);
exports.cyanBright    = _create(96, 39);
exports.whiteBright   = _create(97, 39);

// Background colors: https://nodejs.org/api/util.html#background-colors
exports.bgBlack         = _create(40, 49);
exports.bgRed           = _create(41, 49);
exports.bgGreen         = _create(42, 49);
exports.bgYellow        = _create(43, 49);
exports.bgBlue          = _create(44, 49);
exports.bgMagenta       = _create(45, 49);
exports.bgCyan          = _create(46, 49);
exports.bgWhite         = _create(47, 49);
exports.bgGray          = _create(100, 49);
exports.bgGrey          = exports.bgGray;
exports.bgBlackBright   = exports.bgGray;
exports.bgRedBright     = _create(101, 49);
exports.bgGreenBright   = _create(102, 49);
exports.bgYellowBright  = _create(103, 49);
exports.bgBlueBright    = _create(104, 49);
exports.bgMagentaBright = _create(105, 49);
exports.bgCyanBright    = _create(106, 49);
exports.bgWhiteBright   = _create(107, 49);

Object.freeze(exports);
// Object.entries(exports).forEach(([name, fn]) => console.log(fn(name))); // TEST

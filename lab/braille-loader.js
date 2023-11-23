const colors = require('../src/tty.colors.js');

// IDEA a progress bar like in docker: [⣿⣿⣿⣿⣿⣿⣿] (the dots are bold and green)
// SEE https://en.wikipedia.org/wiki/Braille_Patterns#Block
// NOTE fill from bottom-left to top-right

const chars = ['\u2800', '\u2840', '\u2844', '\u2846', '\u2847', '\u28c7', '\u28e7', '\u28f7', '\u28ff'];

const log = (...values) => console.log('[' + colors.style.bold(colors.green(values.map(val => chars[val]).join(''))) + ']')

log(8, 8, 3, 0);
log(8, 8, 8, 8);

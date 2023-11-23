const colors = require('../src/tty.colors.js');
const async  = require('@nrd/fua.core.async');
const ts     = require('@nrd/fua.core.ts');

// IDEA a progress bar like in docker: [⣿⣿⣿⣿⣿⣿⣿] (the dots are bold and green)
// SEE https://en.wikipedia.org/wiki/Braille_Patterns#Block
// NOTE fill from bottom-left to top-right

const chars = ['\u2800', '\u2840', '\u2844', '\u2846', '\u2847', '\u28c7', '\u28e7', '\u28f7', '\u28ff'];

// const log = (...values) => console.log('[' + colors.style.bold(colors.green(values.map(val => chars[val]).join(''))) + ']')
// log(8, 8, 3, 0);
// log(8, 8, 8, 8);

async.iife(async function main() {

    for (let i = 0, n = 10, k = chars.length, max = n * k - 1; i <= max; i++) {
        let block = '';
        for (let j = 0, q = i; j < n; j++) {
            block += chars[Math.min(q, k - 1)];
            q = Math.max(0, q - k);
        }
        const out = '[' + colors.style.bold(colors.green(block)) + '] ' + i + '/' + max;
        process.stdout.write(out);
        await ts.pause(20);
        process.stdout.moveCursor(-out.length);
    }

    process.stdout.write('\n');

    for (let i = 0, max = 105, k = chars.length, n = Math.floor(max / k); i <= max; i++) {
        let block = '';
        for (let j = 0, q = i; j < n; j++) {
            block += chars[Math.min(q, k - 1)];
            q = Math.max(0, q - k);
        }
        const out = '[' + colors.style.bold(colors.green(block)) + '] ' + i + '/' + max;
        process.stdout.write(out);
        await ts.pause(20);
        process.stdout.moveCursor(-out.length);
    }

    process.stdout.write('\n');

    for (let i = 0, max = 102, k = chars.length, n = Math.ceil(max / k); i <= max; i++) {
        let block = '';
        for (let j = 0, q = i; j < n; j++) {
            block += chars[Math.min(q, k - 1)];
            q = Math.max(0, q - k);
        }
        const out = '[' + colors.style.bold(colors.green(block)) + '] ' + i + '/' + max;
        process.stdout.write(out);
        await ts.pause(20);
        process.stdout.moveCursor(-out.length);
    }

});

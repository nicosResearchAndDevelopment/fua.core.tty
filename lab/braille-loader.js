const
    async       = require('@fua/core.async'),
    ts          = require('@fua/core.ts'),
    ProgressBar = require('./ProgressBar.js'),
    cursor      = require('../src/tty.cursor.js');

// IDEA a progress bar like in docker: [⣿⣿⣿⣿⣿⣿⣿] (the dots are bold and green)
// SEE https://en.wikipedia.org/wiki/Braille_Patterns#Block
// NOTE fill from bottom-left to top-right

async.iife(async function main() {

    const progress = new ProgressBar({
        size:  60,
        total: 60 * 8,
        chars: ProgressBar.D8
    });

    cursor(false);
    for (let i = progress.value; i <= progress.total; i++) {
        progress.update(i);
        await ts.pause(0);
    }
    cursor(true);

});

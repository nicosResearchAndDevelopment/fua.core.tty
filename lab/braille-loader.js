const async       = require('@nrd/fua.core.async');
const ts          = require('@nrd/fua.core.ts');
const ProgressBar = require('./ProgressBar.js');

// IDEA a progress bar like in docker: [⣿⣿⣿⣿⣿⣿⣿] (the dots are bold and green)
// SEE https://en.wikipedia.org/wiki/Braille_Patterns#Block
// NOTE fill from bottom-left to top-right

async.iife(async function main() {

    const progress = new ProgressBar({
        size:  60,
        total: 60 * 8,
        chars: ProgressBar.D8
    });

    for (let i = progress.value; i <= progress.total; i++) {
        progress.update(i);
        await ts.pause(0);
    }

});

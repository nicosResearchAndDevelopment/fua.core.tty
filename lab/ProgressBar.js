const
    readline   = require('readline'),
    style      = require('../src/tty.style.js'),
    color      = require('../src/tty.color.js'),
    BrailleBar = require('./BrailleBar.js');

class ProgressBar extends BrailleBar {

    update(value) {
        this.value    = value;
        const dots    = this.toString();
        const bar     = style.bold(color.green(dots));
        const current = style.bold(this.value);
        const total   = style.bold(this.total);
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 1);
        // process.stdout.clearLine();
        // process.stdout.cursorTo(0);
        process.stdout.write('[' + bar + '] ' + current + '/' + total);
    }

}

module.exports = ProgressBar;

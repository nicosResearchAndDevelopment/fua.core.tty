const
    readline   = require('readline'),
    colors     = require('../src/tty.colors.js'),
    BrailleBar = require('./BrailleBar.js');

class ProgressBar extends BrailleBar {

    update(value) {
        this.value    = value;
        const dots    = this.toString();
        const bar     = colors.style.bold(colors.green(dots));
        const current = colors.style.bold(this.value);
        const total   = colors.style.bold(this.total);
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 1);
        // process.stdout.clearLine();
        // process.stdout.cursorTo(0);
        process.stdout.write('[' + bar + '] ' + current + '/' + total);
    }

}

module.exports = ProgressBar;

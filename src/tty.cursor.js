const
    ESC = require('./tty.ESC.js'),
    CPR = require('./tty.CPR.js');

const cursor = function (enabled) {
    if (!process.stdout.isTTY) throw new Error('not a tty');
    process.stdout.write(ESC.DECTECM(enabled));
};

cursor.save = function () {
    if (!process.stdout.isTTY) throw new Error('not a tty');
    process.stdout.write(ESC.DECSC);
};

cursor.restore = function () {
    if (!process.stdout.isTTY) throw new Error('not a tty');
    process.stdout.write(ESC.DECRC);
};

cursor.get = async function () {
    if (!process.stdout.isTTY) throw new Error('not a tty');
    const prevRawMode = process.stdin.isRaw;
    process.stdin.setRawMode(true);
    const data = await new Promise((resolve) => {
        process.stdin.once('data', resolve);
        process.stdout.write(CPR.sequence);
    });
    process.stdin.setRawMode(prevRawMode);
    const pos = CPR.parse(data);
    if (!pos) throw new Error('position not found');
    return pos;
};

cursor.set = async function ({x, y}) {
    if (!process.stdout.isTTY) throw new Error('not a tty');
    await new Promise((resolve) => {
        process.stdout.cursorTo(x, y, resolve);
    });
};

cursor.move = async function ({dx, dy}) {
    if (!process.stdout.isTTY) throw new Error('not a tty');
    await new Promise((resolve) => {
        process.stdout.moveCursor(dx, dy, resolve);
    });
};

module.exports = cursor;

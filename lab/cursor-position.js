// SEE https://man7.org/linux/man-pages/man4/console_codes.4.html

console.log('Lorem Ipsum');
console.log('Hello World!');
process.stdout.write('bliblablub');

getCursorPosition().then((pos) => {
    process.stdout.write('\n');
    console.log(pos);
    setCursorPosition(pos);
    process.stdout.write('_blubliblab');
}).catch(console.error);

function getCursorPosition() {
    return new Promise((resolve, reject) => {
        const prevRawMode = process.stdin.isRaw;
        process.stdin.setRawMode(true);
        process.stdin.once('data', (data) => {
            try {
                process.stdin.setRawMode(prevRawMode);
                const answer = Buffer.isBuffer(data) ? data.toString() : data; // ESC [ y ; x R
                const match  = /\x1B\[(?<column>\d+);(?<row>\d+)R/.exec(answer);
                if (!match) throw new Error('position not found');
                resolve({
                    x: Number(match.groups.row) - 1,
                    y: Number(match.groups.column) - 1
                });
            } catch (err) {
                reject(err);
            }
        });
        process.stdout.write('\x1B[6n');
    });
}

function setCursorPosition(pos) {
    process.stdout.cursorTo(pos.x, pos.y);
}

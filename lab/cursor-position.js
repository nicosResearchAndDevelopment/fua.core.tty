const
    cursor = require('../src/tty.cursor.js');

console.log('Lorem Ipsum');
console.log('Hello World!');
process.stdout.write('bliblablub');

cursor.get().then(async (pos) => {
    process.stdout.write('\n');
    console.log('pos:', pos);
    cursor.save();
    await cursor.set(pos);
    process.stdout.write('_blubliblab');
    cursor.restore();
}).catch(console.error);

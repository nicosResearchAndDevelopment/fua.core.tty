const tty = require('../src/tty.js');

(async function Main() {

    await tty.interact({ping: 'pong'});

})().catch(console.error);

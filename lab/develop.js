const tty = require('../src/tty.js');
const {formatWithOptions, inspect} = require('util');

(async function Main() {

    // tty.write('input?');
    // const input = await tty.read();
    // tty.write('input = >' + input + '<');

    // console.log(process.stdout.getColorDepth());
    // console.log(tty.colors.grey('Hello ' + tty.colors.style.bold('World') + '!'));

    // process.stdout.write(formatWithOptions({colors: true}, {test: 'Hello World!'}));
    // tty.log({test: 'Hello World!'});

    // tty.log('Hello World!');
    // tty.error({test: 'Hello World!'});
    // tty.error(new Error('Hello World!'));

    // tty.log('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.');
    // tty.log('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, \nsed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. \nAt vero eos et accusam et justo duo dolores et ea rebum. \nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.');

    // tty.log.todo();

    tty.output('colors = ' + tty.colors.depth);
    const step = 32;
    for (let red = 0; red < 256; red += step) {
        for (let green = 0; green < 256; green += step) {
            for (let blue = 0; blue < 256; blue += step) {
                const text = `(${red}, ${green}, ${blue})`;
                tty.output(tty.colors.rgb(red, green, blue, text));
            }
        }
    }

    const grey_step = 4;
    for (let grey = 0; grey < 256; grey += grey_step) {
        const text = `(${grey}, ${grey}, ${grey})`;
        tty.output(tty.colors.rgb(grey, grey, grey, text));
    }

})().catch(console.error);

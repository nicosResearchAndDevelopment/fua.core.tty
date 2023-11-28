/**
 * @see https://man7.org/linux/man-pages/man4/console_codes.4.html
 */
const ESC = (value) => `\x1B${value}`;

ESC.RIS = ESC('c'); // Reset
ESC.IND = ESC('D'); // Linefeed
ESC.NEL = ESC('E'); // Newline
ESC.HTS = ESC('H'); // Set tab stop at current column
ESC.RI  = ESC('M'); // Reverse linefeed

ESC.DECSC = ESC(7); // Save current state (cursor coordinates, attributes, character sets pointed at by G0, G1)
ESC.DECRC = ESC(8); // Restore state most recently saved by ESC 7

ESC.DECALN = ESC('#8'); // DEC screen alignment test - fill screen with E's

ESC.DECPNM = ESC('>'); // Set numeric keypad mode
ESC.DECPAM = ESC('='); // Set application keypad mode

ESC.DECSCNM     = (enabled) => ESC('[?5' + (enabled ? 'h' : 'l')); // Set reverse-video mode
ESC.DECSCNM.ON  = ESC.DECSCNM(true);
ESC.DECSCNM.OFF = ESC.DECSCNM(false);

ESC.DECTECM     = (enabled) => ESC('[?25' + (enabled ? 'h' : 'l')); // Make cursor visible
ESC.DECTECM.ON  = ESC.DECTECM(true);
ESC.DECTECM.OFF = ESC.DECTECM(false);

module.exports = ESC;

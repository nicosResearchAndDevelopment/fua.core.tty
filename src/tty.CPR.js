/**
 * Cursor Position Report (CPR)
 * @see https://man7.org/linux/man-pages/man4/console_codes.4.html
 * @see https://ecma-international.org/publications-and-standards/standards/ecma-48/
 */
const CPR = {
    sequence: '\x1B[6n',
    matcher:  /\x1B\[(\d+);(\d+)R/,
    match(value) {
        const [match, column, row] = CPR.matcher.exec(value) || [];
        if (match) return {column, row};
    },
    parse(value) {
        const match = CPR.match(value);
        if (match) return {
            x: Number(match.row) - 1,
            y: Number(match.column) - 1
        }
    }
};

module.exports = CPR;

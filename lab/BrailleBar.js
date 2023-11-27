/** @see https://en.wikipedia.org/wiki/Braille_Patterns#Block */
class BrailleBar {

    static D6 = ['\u2800', '\u2804', '\u2806', '\u2807', '\u2827', '\u2837', '\u283f'];
    static D8 = ['\u2800', '\u2840', '\u2844', '\u2846', '\u2847', '\u28c7', '\u28e7', '\u28f7', '\u28ff'];

    constructor(options = {}) {
        this.size       = options.size ?? 40;
        this.value      = options.value ?? 0;
        this.total      = options.total ?? 1;
        this.chars      = options.chars ?? BrailleBar.D8;
        this.base       = this.chars.length - 1;
        this.resolution = this.base * this.size;
        this.empty      = this.chars.at(0);
        this.filled     = this.chars.at(-1);
    }

    toString() {
        const count = Math.round(this.resolution * this.value / this.total);
        if (count === this.resolution) return ''.padStart(this.size, this.filled);
        const filledSlots  = ''.padStart(Math.floor(count / this.base), this.filled);
        const fractionSlot = this.chars.at(count % this.base);
        return (filledSlots + fractionSlot).padEnd(this.size, this.empty);
    }

}

module.exports = BrailleBar;

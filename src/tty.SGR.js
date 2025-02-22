/**
 * Select Graphic Rendition (SGR)
 * @see https://gist.github.com/JS-Zheng/b3dbacbd5bfac30871f19fc8337f84ca
 * @see https://man7.org/linux/man-pages/man4/console_codes.4.html
 * @see https://strasis.com/documentation/limelight-xe/reference/ecma-48-sgr-codes
 * @see https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences
 * @see https://gist.github.com/JS-Zheng/b3dbacbd5bfac30871f19fc8337f84ca
 * @see https://chrisyeh96.github.io/2020/03/28/terminal-html
 */
const SGR = (value) => `\x1B[${value}m`;

SGR.RESET                                                      = SGR(0);
SGR.BOLD                                                       = SGR(1);
SGR.FAINT                                                      = SGR(2);
SGR.ITALIC                                                     = SGR(3);
SGR.UNDERLINE                                                  = SGR(4);
SGR.SLOW_BLINK                                                 = SGR(5);
SGR.RAPID_BLINK                                                = SGR(6);
SGR.REVERSE_VIDEO                                              = SGR(7);
SGR.CONCEAL                                                    = SGR(8);
SGR.CROSSED_OUT                                                = SGR(9);
SGR.PRIMARY_FONT                                               = SGR(10);
SGR.ALTERNATE_FONT                                             = (n) => SGR(11 + n);
SGR.FRAKTUR                                                    = SGR(20);
SGR.DOUBLY_UNDERLINE_OR_BOLD_OFF                               = SGR(21);
SGR.NORMAL_COLOR_OR_INTENSITY                                  = SGR(22);
SGR.NOT_ITALIC_NOT_FRAKTUR                                     = SGR(23);
SGR.UNDERLINE_OFF                                              = SGR(24);
SGR.BLINK_OFF                                                  = SGR(25);
SGR.INVERSE_OFF                                                = SGR(27);
SGR.REVEAL                                                     = SGR(28);
SGR.NOT_CROSSED_OUT                                            = SGR(29);
SGR.FG_BLACK                                                   = SGR(30);
SGR.FG_RED                                                     = SGR(31);
SGR.FG_GREEN                                                   = SGR(32);
SGR.FG_YELLOW                                                  = SGR(33);
SGR.FG_BLUE                                                    = SGR(34);
SGR.FG_MAGENTA                                                 = SGR(35);
SGR.FG_CYAN                                                    = SGR(36);
SGR.FG_WHITE                                                   = SGR(37);
SGR.FG_COLOR_8                                                 = (n) => SGR([38, 5, n].join(';'));
SGR.FG_COLOR_24                                                = (r, g, b) => SGR([38, 2, r, g, b].join(';'));
SGR.DEFAULT_FOREGROUND_COLOR                                   = SGR(39);
SGR.BG_BLACK                                                   = SGR(40);
SGR.BG_RED                                                     = SGR(41);
SGR.BG_GREEN                                                   = SGR(42);
SGR.BG_YELLOW                                                  = SGR(43);
SGR.BG_BLUE                                                    = SGR(44);
SGR.BG_MAGENTA                                                 = SGR(45);
SGR.BG_CYAN                                                    = SGR(46);
SGR.BG_WHITE                                                   = SGR(47);
SGR.BG_COLOR_8                                                 = (n) => SGR([48, 5, n].join(';'));
SGR.BG_COLOR_24                                                = (r, g, b) => SGR([48, 2, r, g, b].join(';'));
SGR.DEFAULT_BACKGROUND_COLOR                                   = SGR(49);
SGR.FRAMED                                                     = SGR(51);
SGR.ENCIRCLED                                                  = SGR(52);
SGR.OVERLINED                                                  = SGR(53);
SGR.NOT_FRAMED_OR_ENCIRCLED                                    = SGR(54);
SGR.NOT_OVERLINED                                              = SGR(55);
SGR.IDEOGRAM_UNDERLINE_OR_RIGHT_SIDE_LINE                      = SGR(60);
SGR.IDEOGRAM_DOUBLE_UNDERLINE_OR_DOUBLE_LINE_ON_THE_RIGHT_SIDE = SGR(61);
SGR.IDEOGRAM_OVERLINE_OR_LEFT_SIDE_LINE                        = SGR(62);
SGR.IDEOGRAM_DOUBLE_OVERLINE_OR_DOUBLE_LINE_ON_THE_LEFT_SIDE   = SGR(63);
SGR.IDEOGRAM_STRESS_MARKING                                    = SGR(64);
SGR.IDEOGRAM_ATTRIBUTES_OFF                                    = SGR(65);
SGR.FG_BRIGHT_BLACK                                            = SGR(90);
SGR.FG_BRIGHT_RED                                              = SGR(91);
SGR.FG_BRIGHT_GREEN                                            = SGR(92);
SGR.FG_BRIGHT_YELLOW                                           = SGR(93);
SGR.FG_BRIGHT_BLUE                                             = SGR(94);
SGR.FG_BRIGHT_MAGENTA                                          = SGR(95);
SGR.FG_BRIGHT_CYAN                                             = SGR(96);
SGR.FG_BRIGHT_WHITE                                            = SGR(97);
SGR.BG_BRIGHT_BLACK                                            = SGR(100);
SGR.BG_BRIGHT_RED                                              = SGR(101);
SGR.BG_BRIGHT_GREEN                                            = SGR(102);
SGR.BG_BRIGHT_YELLOW                                           = SGR(103);
SGR.BG_BRIGHT_BLUE                                             = SGR(104);
SGR.BG_BRIGHT_MAGENTA                                          = SGR(105);
SGR.BG_BRIGHT_CYAN                                             = SGR(106);
SGR.BG_BRIGHT_WHITE                                            = SGR(107);

module.exports = SGR;

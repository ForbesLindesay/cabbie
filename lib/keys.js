// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

/**
 * Web-driver keys
 *
 * @class Keys
 * @module WebDriver
 * @submodule Core
 */
var Keys = {

    /**
     * NULL key
     *
     * @property NULL
     * @static
     * @type {String}
     */
    NULL: '\uE000',


    /**
     * Break key
     *
     * @property BREAK
     * @static
     * @type {String}
     */
    BREAK: '\uE001',

    /**
     * Pause key
     *
     * @property PAUSE
     * @static
     * @type {String}
     */
    PAUSE: '\uE00B',

    /**
     * Help key
     *
     * @property HELP
     * @static
     * @type {String}
     */
    HELP: '\uE002',

    /**
     * Clear key
     *
     * @property CLEAR
     * @static
     * @type {String}
     */
    CLEAR: '\uE005',


    /**
     * Backspace key
     *
     * @property BACKSPACE
     * @static
     * @type {String}
     */
    BACKSPACE: '\uE003',

    /**
     * Escape key
     *
     * @property ESCAPE
     * @static
     * @type {String}
     */
    ESCAPE: '\uE00C',

    /**
     * Tab key
     *
     * @property TAB
     * @static
     * @type {String}
     */
    TAB: '\uE004',


    /**
     * Return key (not enter)
     *
     * @property RETURN
     * @static
     * @type {String}
     */
    RETURN: '\uE006',

    /**
     * Enter key (not return)
     *
     * @property ENTER
     * @static
     * @type {String}
     */
    ENTER: '\uE007',


    /**
     * Shift key
     *
     * @property SHIFT
     * @static
     * @type {String}
     */
    SHIFT: '\uE008',

    /**
     * Control key
     *
     * @property CONTROL
     * @static
     * @type {String}
     */
    CONTROL: '\uE009',

    /**
     * Alternate key
     *
     * @property ALT
     * @static
     * @type {String}
     */
    ALT: '\uE00A',


    /**
     * Space-bar key
     *
     * @property SPACE
     * @static
     * @type {String}
     */
    SPACE: '\uE00D',


    /**
     * Page-up key
     *
     * @property PAGE_UP
     * @static
     * @type {String}
     */
    PAGE_UP: '\uE00E',

    /**
     * Page-down key
     *
     * @property PAGE_DOWN
     * @static
     * @type {String}
     */
    PAGE_DOWN: '\uE00F',


    /**
     * End key
     *
     * @property END
     * @static
     * @type {String}
     */
    END: '\uE010',

    /**
     * Home key
     *
     * @property HOME
     * @static
     * @type {String}
     */
    HOME: '\uE011',


    /**
     * Left-arrow key
     *
     * @property LEFT_ARROW
     * @static
     * @type {String}
     */
    LEFT_ARROW: '\uE012',

    /**
     * Up-arrow key
     *
     * @property UP_ARROW
     * @static
     * @type {String}
     */
    UP_ARROW: '\uE013',

    /**
     * Right-arrow key
     *
     * @property RIGHT_ARROW
     * @static
     * @type {String}
     */
    RIGHT_ARROW: '\uE014',

    /**
     * Down-arrow key
     *
     * @property DOWN_ARROW
     * @static
     * @type {String}
     */
    DOWN_ARROW: '\uE015',


    /**
     * Insert key
     *
     * @property INSERT
     * @static
     * @type {String}
     */
    INSERT: '\uE016',

    /**
     * Delete key
     *
     * @property DELETE
     * @static
     * @type {String}
     */
    DELETE: '\uE017',


    /**
     * Semicolon key
     *
     * @property SEMICOLON
     * @static
     * @type {String}
     */
    SEMICOLON: '\uE018',

    /**
     * Equals key
     *
     * @property EQUALS
     * @static
     * @type {String}
     */
    EQUALS: '\uE019',


    /**
     * Number 0 on number-pad
     *
     * @property NUMPAD0
     * @static
     * @type {String}
     */
    NUMPAD0: '\uE01A',

    /**
     * Number 1 on number-pad
     *
     * @property NUMPAD1
     * @static
     * @type {String}
     */
    NUMPAD1: '\uE01B',

    /**
     * Number 2 on number-pad
     *
     * @property NUMPAD2
     * @static
     * @type {String}
     */
    NUMPAD2: '\uE01C',

    /**
     * Number 3 on number-pad
     *
     * @property NUMPAD3
     * @static
     * @type {String}
     */
    NUMPAD3: '\uE01D',

    /**
     * Number 4 on number-pad
     *
     * @property NUMPAD4
     * @static
     * @type {String}
     */
    NUMPAD4: '\uE01E',

    /**
     * Number 5 on number-pad
     *
     * @property NUMPAD5
     * @static
     * @type {String}
     */
    NUMPAD5: '\uE01F',

    /**
     * Number 6 on number-pad
     *
     * @property NUMPAD6
     * @static
     * @type {String}
     */
    NUMPAD6: '\uE020',

    /**
     * Number 7 on number-pad
     *
     * @property NUMPAD7
     * @static
     * @type {String}
     */
    NUMPAD7: '\uE021',

    /**
     * Number 8 on number-pad
     *
     * @property NUMPAD8
     * @static
     * @type {String}
     */
    NUMPAD8: '\uE022',

    /**
     * Number 9 on number-pad
     *
     * @property NUMPAD9
     * @static
     * @type {String}
     */
    NUMPAD9: '\uE023',


    /**
     * "*" key
     *
     * @property MULTIPLY
     * @static
     * @type {String}
     */
    MULTIPLY: '\uE024',

    /**
     * "+" key
     *
     * @property ADD
     * @static
     * @type {String}
     */
    ADD: '\uE025',

    /**
     * "-" key
     *
     * @property SUBTRACT
     * @static
     * @type {String}
     */
    SUBTRACT: '\uE027',

    /**
     * "/" key
     *
     * @property DIVIDE
     * @static
     * @type {String}
     */
    DIVIDE: '\uE029',

    /**
     * Separator key (Locale independent)
     *
     * @property SEPARATOR
     * @static
     * @type {String}
     */
    SEPARATOR: '\uE026',

    /**
     * "." key
     *
     * @property DECIMAL
     * @static
     * @type {String}
     */
    DECIMAL: '\uE028',


    /**
     * F1 key
     *
     * @property F1
     * @static
     * @type {String}
     */
    F1: '\uE031',

    /**
     * F2 key
     *
     * @property F2
     * @static
     * @type {String}
     */
    F2: '\uE032',

    /**
     * F3 key
     *
     * @property F3
     * @static
     * @type {String}
     */
    F3: '\uE033',

    /**
     * F4 key
     *
     * @property F4
     * @static
     * @type {String}
     */
    F4: '\uE034',

    /**
     * F5 key
     *
     * @property F5
     * @static
     * @type {String}
     */
    F5: '\uE035',

    /**
     * F6 key
     *
     * @property F6
     * @static
     * @type {String}
     */
    F6: '\uE036',

    /**
     * F7 key
     *
     * @property F7
     * @static
     * @type {String}
     */
    F7: '\uE037',

    /**
     * F8 key
     *
     * @property F8
     * @static
     * @type {String}
     */
    F8: '\uE038',

    /**
     * F9 key
     *
     * @property F9
     * @static
     * @type {String}
     */
    F9: '\uE039',

    /**
     * F10 key
     *
     * @property F10
     * @static
     * @type {String}
     */
    F10: '\uE03A',

    /**
     * F11 key
     *
     * @property F11
     * @static
     * @type {String}
     */
    F11: '\uE03B',

    /**
     * F12 key
     *
     * @property F12
     * @static
     * @type {String}
     */
    F12: '\uE03C',


    /**
     * "Windows" key
     *
     * @property WINDOWS
     * @static
     * @type {String}
     */
    WINDOWS: '\uE03D',

    /**
     * "Command" (Apple) key
     *
     * @property COMMAND
     * @static
     * @type {String}
     */
    COMMAND: '\uE03D'
};

module.exports = Keys;
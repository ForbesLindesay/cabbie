// @disable-prettier: It messes up the unprintable keyboard characters

/*
 * Web-driver keys
 */
const KeyboardKeyEnum = {
    /*
     * NULL key
     */
    NULL: '\uE000',
    /*
     * Break key
     */
    BREAK: '\uE001',
    /*
     * Pause key
     */
    PAUSE: '\uE00B',
    /*
     * Help key
     */
    HELP: '\uE002',
    /*
     * Clear key
     */
    CLEAR: '\uE005',
    /*
     * Backspace key
     */
    BACKSPACE: '\uE003',
    /*
     * Escape key
     */
    ESCAPE: '\uE00C',
    /*
     * Tab key
     */
    TAB: '\uE004',
    /*
     * Return key (not enter)
     */
    RETURN: '\uE006',
    /*
     * Enter key (not return)
     */
    ENTER: '\uE007',
    /*
     * Shift key
     */
    SHIFT: '\uE008',
    /*
     * Control key
     */
    CONTROL: '\uE009',
    /*
     * Alternate key
     */
    ALT: '\uE00A',
    /*
     * Space-bar key
     */
    SPACE: '\uE00D',
    /*
     * Page-up key
     */
    PAGE_UP: '\uE00E',
    /*
     * Page-down key
     */
    PAGE_DOWN: '\uE00F',
    /*
     * End key
     */
    END: '\uE010',
    /*
     * Home key
     */
    HOME: '\uE011',
    /*
     * Left-arrow key
     */
    LEFT_ARROW: '\uE012',
    /*
     * Up-arrow key
     */
    UP_ARROW: '\uE013',
    /*
     * Right-arrow key
     */
    RIGHT_ARROW: '\uE014',
    /*
     * Down-arrow key
     */
    DOWN_ARROW: '\uE015',
    /*
     * Insert key
     */
    INSERT: '\uE016',
    /*
     * Delete key
     */
    DELETE: '\uE017',
    /*
     * Semicolon key
     */
    SEMICOLON: '\uE018',
    /*
     * Equals key
     */
    EQUALS: '\uE019',
    /*
     * number 0 on number-pad
     */
    NUMPAD0: '\uE01A',
    /*
     * number 1 on number-pad
     */
    NUMPAD1: '\uE01B',
    /*
     * number 2 on number-pad
     */
    NUMPAD2: '\uE01C',
    /*
     * number 3 on number-pad
     */
    NUMPAD3: '\uE01D',
    /*
     * number 4 on number-pad
     */
    NUMPAD4: '\uE01E',
    /*
     * number 5 on number-pad
     */
    NUMPAD5: '\uE01F',
    /*
     * number 6 on number-pad
     */
    NUMPAD6: '\uE020',
    /*
     * number 7 on number-pad
     */
    NUMPAD7: '\uE021',
    /*
     * number 8 on number-pad
     */
    NUMPAD8: '\uE022',
    /*
     * number 9 on number-pad
     */
    NUMPAD9: '\uE023',
    /*
     * "*" key
     */
    MULTIPLY: '\uE024',
    /*
     * "+" key
     */
    ADD: '\uE025',
    /*
     * "-" key
     */
    SUBTRACT: '\uE027',
    /*
     * "/" key
     */
    DIVIDE: '\uE029',
    /*
     * Separator key (Locale independent)
     */
    SEPARATOR: '\uE026',
    /*
     * "." key
     */
    DECIMAL: '\uE028',
    /*
     * F1 key
     */
    F1: '\uE031',
    /*
     * F2 key
     */
    F2: '\uE032',
    /*
     * F3 key
     */
    F3: '\uE033',
    /*
     * F4 key
     */
    F4: '\uE034',
    /*
     * F5 key
     */
    F5: '\uE035',
    /*
     * F6 key
     */
    F6: '\uE036',
    /*
     * F7 key
     */
    F7: '\uE037',
    /*
     * F8 key
     */
    F8: '\uE038',
    /*
     * F9 key
     */
    F9: '\uE039',
    /*
     * F10 key
     */
    F10: '\uE03A',
    /*
     * F11 key
     */
    F11: '\uE03B',
    /*
     * F12 key
     */
    F12: '\uE03C',
    /*
     * "Windows" key
     */
    WINDOWS: '\uE03D',
    /*
     * "Command" (Apple) key
     */
    COMMAND: '\uE03D'
};

export default KeyboardKeyEnum;

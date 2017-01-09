export type KeyboardKey = '\uE000' | '\uE001' | '\uE00B' | '\uE002' | '\uE005' | '\uE003' | '\uE00C' | '\uE004' | '\uE006' | '\uE007' | '\uE008' | '\uE009' | '\uE00A' | '\uE00D' | '\uE00E' | '\uE00F' | '\uE010' | '\uE011' | '\uE012' | '\uE013' | '\uE014' | '\uE015' | '\uE016' | '\uE017' | '\uE018' | '\uE019' | '\uE01A' | '\uE01B' | '\uE01C' | '\uE01D' | '\uE01E' | '\uE01F' | '\uE020' | '\uE021' | '\uE022' | '\uE023' | '\uE024' | '\uE025' | '\uE027' | '\uE029' | '\uE026' | '\uE028' | '\uE031' | '\uE032' | '\uE033' | '\uE034' | '\uE035' | '\uE036' | '\uE037' | '\uE038' | '\uE039' | '\uE03A' | '\uE03B' | '\uE03C' | '\uE03D' | '\uE03D';
/**
 * Web-driver keys
 */
const KeyboardKeysEnum = {

  /**
   * NULL key
   */
  NULL: ('\uE000': '\uE000'),

  /**
   * Break key
   */
  BREAK: ('\uE001': '\uE001'),

  /**
   * Pause key
   */
  PAUSE: ('\uE00B': '\uE00B'),

  /**
   * Help key
   */
  HELP: ('\uE002': '\uE002'),

  /**
   * Clear key
   */
  CLEAR: ('\uE005': '\uE005'),

  /**
   * Backspace key
   */
  BACKSPACE: ('\uE003': '\uE003'),

  /**
   * Escape key
   */
  ESCAPE: ('\uE00C': '\uE00C'),

  /**
   * Tab key
   */
  TAB: ('\uE004': '\uE004'),

  /**
   * Return key (not enter)
   */
  RETURN: ('\uE006': '\uE006'),

  /**
   * Enter key (not return)
   */
  ENTER: ('\uE007': '\uE007'),

  /**
   * Shift key
   */
  SHIFT: ('\uE008': '\uE008'),

  /**
   * Control key
   */
  CONTROL: ('\uE009': '\uE009'),

  /**
   * Alternate key
   */
  ALT: ('\uE00A': '\uE00A'),

  /**
   * Space-bar key
   */
  SPACE: ('\uE00D': '\uE00D'),

  /**
   * Page-up key
   */
  PAGE_UP: ('\uE00E': '\uE00E'),

  /**
   * Page-down key
   */
  PAGE_DOWN: ('\uE00F': '\uE00F'),

  /**
   * End key
   */
  END: ('\uE010': '\uE010'),

  /**
   * Home key
   */
  HOME: ('\uE011': '\uE011'),

  /**
   * Left-arrow key
   */
  LEFT_ARROW: ('\uE012': '\uE012'),

  /**
   * Up-arrow key
   */
  UP_ARROW: ('\uE013': '\uE013'),

  /**
   * Right-arrow key
   */
  RIGHT_ARROW: ('\uE014': '\uE014'),

  /**
   * Down-arrow key
   */
  DOWN_ARROW: ('\uE015': '\uE015'),

  /**
   * Insert key
   */
  INSERT: ('\uE016': '\uE016'),

  /**
   * Delete key
   */
  DELETE: ('\uE017': '\uE017'),

  /**
   * Semicolon key
   */
  SEMICOLON: ('\uE018': '\uE018'),

  /**
   * Equals key
   */
  EQUALS: ('\uE019': '\uE019'),

  /**
   * Number 0 on number-pad
   */
  NUMPAD0: ('\uE01A': '\uE01A'),

  /**
   * Number 1 on number-pad
   */
  NUMPAD1: ('\uE01B': '\uE01B'),

  /**
   * Number 2 on number-pad
   */
  NUMPAD2: ('\uE01C': '\uE01C'),

  /**
   * Number 3 on number-pad
   */
  NUMPAD3: ('\uE01D': '\uE01D'),

  /**
   * Number 4 on number-pad
   */
  NUMPAD4: ('\uE01E': '\uE01E'),

  /**
   * Number 5 on number-pad
   */
  NUMPAD5: ('\uE01F': '\uE01F'),

  /**
   * Number 6 on number-pad
   */
  NUMPAD6: ('\uE020': '\uE020'),

  /**
   * Number 7 on number-pad
   */
  NUMPAD7: ('\uE021': '\uE021'),

  /**
   * Number 8 on number-pad
   */
  NUMPAD8: ('\uE022': '\uE022'),

  /**
   * Number 9 on number-pad
   */
  NUMPAD9: ('\uE023': '\uE023'),

  /**
   * "*" key
   */
  MULTIPLY: ('\uE024': '\uE024'),

  /**
   * "+" key
   */
  ADD: ('\uE025': '\uE025'),

  /**
   * "-" key
   */
  SUBTRACT: ('\uE027': '\uE027'),

  /**
   * "/" key
   */
  DIVIDE: ('\uE029': '\uE029'),

  /**
   * Separator key (Locale independent)
   */
  SEPARATOR: ('\uE026': '\uE026'),

  /**
   * "." key
   */
  DECIMAL: ('\uE028': '\uE028'),

  /**
   * F1 key
   */
  F1: ('\uE031': '\uE031'),

  /**
   * F2 key
   */
  F2: ('\uE032': '\uE032'),

  /**
   * F3 key
   */
  F3: ('\uE033': '\uE033'),

  /**
   * F4 key
   */
  F4: ('\uE034': '\uE034'),

  /**
   * F5 key
   */
  F5: ('\uE035': '\uE035'),

  /**
   * F6 key
   */
  F6: ('\uE036': '\uE036'),

  /**
   * F7 key
   */
  F7: ('\uE037': '\uE037'),

  /**
   * F8 key
   */
  F8: ('\uE038': '\uE038'),

  /**
   * F9 key
   */
  F9: ('\uE039': '\uE039'),

  /**
   * F10 key
   */
  F10: ('\uE03A': '\uE03A'),

  /**
   * F11 key
   */
  F11: ('\uE03B': '\uE03B'),

  /**
   * F12 key
   */
  F12: ('\uE03C': '\uE03C'),

  /**
   * "Windows" key
   */
  WINDOWS: ('\uE03D': '\uE03D'),

  /**
   * "Command" (Apple) key
   */
  COMMAND: ('\uE03D': '\uE03D')
};

module.exports = Keys;
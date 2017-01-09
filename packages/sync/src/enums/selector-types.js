export type SelectorType = 'class name' | 'css selector' | 'id' | 'name' | 'link text' | 'partial link text' | 'tag name' | 'xpath';
const SelectorTypeEnum = {
  /**
   * Class-name selector type
   */
  CLASS: ('class name': 'class name'),

  /**
   * Css selector type, using the native css selector support
   */
  CSS: ('css selector': 'css selector'),

  /**
   * Id selector type
   */
  ID: ('id': 'id'),

  /**
   * Name selector type
   */
  NAME: ('name': 'name'),

  /**
   * Link text selector type, finding a link that fits the selector.
   * The full link-text needs to match.
   */
  LINK_TEXT: ('link text': 'link text'),

  /**
   * Partial-link text selector type, finding a link that partially fits the selector.
   * Only a part of the link-text needs to match.
   */
  PARTIAL_LINK_TEXT: ('partial link text': 'partial link text'),

  /**
   * Tag-name selector type
   */
  TAG: ('tag name': 'tag name'),

  /**
   * XPath selector type
   */
  XPATH: ('xpath': 'xpath')
};

export default SelectorTypeEnum;
// Maestro text selectors are regular expressions, so a title like
// "Alien (film)" must be escaped before it is used as a selector.
output.featuredTitle = maestro.copiedText;
output.featuredTitleRe = maestro.copiedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

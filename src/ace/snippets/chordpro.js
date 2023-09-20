/* eslint-disable no-template-curly-in-string */
define('ace/snippets/chordpro.snippets', ['require', 'exports', 'module'], (require, exports, module) => {
  module.exports = '# title tag\n'
    + 'snippet t\n'
    + '\t{title: ${1:title}}\n'
    + 'snippet title\n'
    + '\t{title: ${1:title}}\n'

+ '# subtitle tag\n'
    + 'snippet st\n'
    + '\t{subtitle: ${1:name}}\n'
    + 'snippet sub\n'
    + '\t{subtitle: ${1:name}}\n'
    + 'snippet subtitle\n'
    + '\t{subtitle: ${1:name}}\n'

+ '# artist tag\n'
    + 'snippet a\n'
    + '\t{artist: ${1:name}}\n'
    + 'snippet artist\n'
    + '\t{artist: ${1:name}}\n'

+ '# album tag\n'
    + 'snippet al\n'
    + '\t{album: ${1:title}}\n'
    + 'snippet album\n'
    + '\t{album: ${1:title}}\n'

+ '# comment tag\n'
    + 'snippet c\n'
    + '\t{comment: ${1:description}}\n'
    + 'snippet comment\n'
    + '\t{comment: ${1:description}}\n'

+ '# chorus block\n'
    + 'snippet soc\n'
    + '\t{start_of_chorus}\n'
    + 'snippet eoc\n'
    + '\t{end_of_chorus}\n'
    + 'snippet chorus\n'
    + '\t{start_of_chorus}\n'
    + '\t{comment: ${1:Chorus}}\n'
    + '\t${2:Music}\n'
    + '\t{end_of_chorus}\n'

+ '# tabs block\n'
    + 'snippet sot\n'
    + '\t{start_of_tab}\n'
    + 'snippet eot\n'
    + '\t{end_of_tab}\n'
    + 'snippet tab\n'
    + '\t{start_of_tab}\n'
    + '\tA|-${1:-}--------------------------------|\n'
    + '\tE|----------------------------------|\n'
    + '\tC|----------------------------------|\n'
    + '\tG|----------------------------------|\n'
    + '\t{end_of_tab}\n'

+ '# define tag\n'
    + 'snippet d\n'
    + '\t{define: ${1:name} frets ${2:G_fretNum} ${3:C_fretNum} ${4:E_fretNum} ${5:A_fretNum} fingers ${6:fingerNum} ${7:fingerNum} ${8:fingerNum} ${9:fingerNum}}\n'
    + 'snippet add\n'
    + '\tadd: string ${1:stringNum} fret ${2:fretNum} finger ${3:fingerNum}\n'

+ '# single-liners\n'
    + 'snippet col\n'
    + '\t{column_break}\n'
    + 'snippet column\n'
    + '\t{column_break}\n'
    + 'snippet colb\n'
    + '\t{column_break}\n'

+ '# that\'s all folks!\n'
+ '# chord usage\n'
    + 'snippet [\n'
    + '\t[${1:Chord}]\n';
});

// eslint-disable-next-line no-unused-vars
define('ace/snippets/chordpro', ['require', 'exports', 'module', 'ace/snippets/chordpro.snippets'], (require, exports, module) => {
  exports.snippetText = require('./chordpro.snippets');
  exports.scope = 'chordpro';
});

(() => {
  window.require(['ace/snippets/chordpro'], (m) => {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m;
    }
  });
})();

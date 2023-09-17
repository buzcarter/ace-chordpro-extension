// eslint-disable-next-line no-unused-vars
define('ace/mode/chordpro', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/chordpro_highlight_rules'], (require, exports, module) => {
  const oop = require('../lib/oop');
  const TextMode = require('../snippets/text').Mode;
  const { ChordproHighlightRules } = require('./chordpro_highlight_rules');

  function Mode() {
    this.HighlightRules = ChordproHighlightRules;
  }

  oop.inherits(Mode, TextMode);

  (function extendWorker() {
    // eslint-disable-next-line no-unused-vars
    this.createWorker = function createWorker(session) {
      return null;
    };

    this.$id = 'ace/mode/chordpro';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});

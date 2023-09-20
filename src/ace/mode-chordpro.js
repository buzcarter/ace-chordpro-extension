// eslint-disable-next-line no-unused-vars
define('ace/mode/chordpro_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (require, exports, module) => {
  const oop = require('../lib/oop');
  const { TextHighlightRules } = require('./text_highlight_rules');

  const ChordProHighlightRules = function CpmHighlightRules() {
    // capture groups
    const reOpenBrace = '(^\\s*{)'; // no spaces allowed between "{" and the command, removed \\s*
    const reCloseBrace = '(\\s*}\\s*$)';
    const reColon = '(\\s*:)';
    // stand alone
    const reNumber = '\\b[0-9]+\\b';

    // token (CSS classes names)
    const tkBrace = 'meta.tag';
    const tkCommand = 'meta';
    const tkSingleTag = 'entity.name';

    this.$rules = {
      start: [{
        token: 'comment',
        regex: '^#.*$', // debated this, for now MUST be first character (otherwise allow \\s*)
      }, {
        token: [tkBrace, tkSingleTag, tkBrace],
        regex: `${reOpenBrace}(column_break|new_page|np|colb|start_of_chorus|soc|end_of_chorus|eoc)${reCloseBrace}`,
        caseInsensitive: true,
      }, {
        token: [tkBrace, tkSingleTag, tkBrace],
        regex: `${reOpenBrace}(start_of_tab|sot)${reCloseBrace}`,
        caseInsensitive: true,
        next: 'tabBlockTag',
      }, {
        token: [tkBrace, tkCommand, tkBrace],
        regex: `${reOpenBrace}(define)${reColon}`,
        caseInsensitive: true,
        next: 'defineTag',
      }, {
        // tkCommand?
        token: [tkBrace, 'meta', tkBrace, 'text', tkBrace],
        regex: `${reOpenBrace}(c|comment)${reColon}(.*)${reCloseBrace}`,
        caseInsensitive: true,
      }, {
        token: [tkBrace, tkCommand, tkBrace, 'string', tkBrace],
        regex: `${reOpenBrace}(title|t|subtitle|st|artist|album|instrument|tuning|key|k)${reColon}(.*)${reCloseBrace}`,
        caseInsensitive: true,
      }, {
        token: [tkBrace, 'invalid', tkBrace, 'string', tkBrace],
        regex: `${reOpenBrace}([-\\S]+)${reColon}(.*)${reCloseBrace}`,
        caseInsensitive: true,
      }, {
        token: [tkBrace, 'invalid', tkBrace],
        regex: `${reOpenBrace}(.+)${reCloseBrace}`,
        caseInsensitive: true,
      }, {
        token: 'constant.numeric',
        regex: reNumber,
      }, {
        token: ['constant.character.escape', 'keyword', 'constant.character.escape'],
        regex: '(\\[)(.*?)(\\])',
      }, {
        token: 'text',
        regex: '\\s+',
      }],

      defineTag: [{
        token: tkBrace,
        regex: reCloseBrace,
        next: 'start',
      }, {
        token: 'constant.mumeric',
        regex: reNumber,
      }, {
        token: 'keyword.control',
        regex: '\\b(fingers|frets|finger|fret|string)\\b',
        caseInsensitive: true,
      }, {
        token: [tkCommand, tkBrace],
        regex: `\\b(add)${reColon}`,
        caseInsensitive: true,
      }, {
        defaultToken: 'string',
      }],

      tabBlockTag: [{
        token: [tkBrace, tkSingleTag, tkBrace],
        regex: `${reOpenBrace}(end_of_tab|eot)${reCloseBrace}`,
        caseInsensitive: true,
        next: 'start',
      }, {
        token: 'comment.line',
        regex: '-+',
      }, {
        token: 'constant.character',
        regex: '\\|+',
      }, {
        token: 'string',
        regex: '[a-gA-G][b#]?',
      }, {
        token: 'constant.mumeric',
        regex: reNumber,
      }, {
        defaultToken: 'comment',
      }],
    };
    this.normalizeRules();
  };

  oop.inherits(ChordProHighlightRules, TextHighlightRules);

  // eslint-disable-next-line no-unused-vars
  ChordProHighlightRules.getTagRule = function cpmTagRule(start) {
    return {
      token: 'comment.doc.tag.storage.type',
      regex: '\\b(?:TODO|FIXME|XXX|HACK)\\b',
    };
  };

  ChordProHighlightRules.getStartRule = function cpmStartRule(start) {
    return {
      token: 'comment.doc',
      regex: '\\/\\*(?=\\*)',
      next: start,
    };
  };

  ChordProHighlightRules.getEndRule = function cnonEndRule(start) {
    return {
      token: 'comment.doc',
      regex: '\\*\\/',
      next: start,
    };
  };

  exports.ChordProHighlightRules = ChordProHighlightRules;
});

// eslint-disable-next-line no-unused-vars
define('ace/mode/chordpro_autocomplete_chords', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (require, exports, module) => {
  const ChordsRegEx = /\[(.*?)\]/g;

  // to play with IE we'll use an object instead of plain array
  const find = (text) => {
    const chords = {};
    const m = text.match(ChordsRegEx);

    if (!m || m.length < 1) {
      return {};
    }
    for (let i = m.length - 1; i >= 0; i--) {
      if (!chords[m[i]]) {
        chords[m[i]] = 0;
      }
      chords[m[i]]++;
    }
    return chords;
  };

  const compare = (a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    return (a.value > b.value) ? 1 : 0;
  };

  const getChords = (text) => {
    const chords = find(text);
    return Object.keys(chords)
      .map((key) => ({
        value: key,
        meta: `${chords[key]} occurrence${chords[key] > 1 ? 's' : ''}`,
      }))
      .sort(compare);
  };

  function getCompletions(editor, session, pos, prefix, callback) {
    callback(null, getChords(editor.getValue()));
  }

  exports.ChordProAutocompleteChords = {
    id: 'chordCompleter',
    getCompletions,
  };
});

// eslint-disable-next-line no-unused-vars
define('ace/mode/chordpro', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/ext/language_tools', 'ace/mode/chordpro_highlight_rules', 'ace/mode/chordpro_autocomplete_chords'], (require, exports, module) => {
  const oop = require('../lib/oop');
  const { Mode: TextMode } = require('./text');
  const { setCompleters } = require('../ext/language_tools');
  const { ChordProHighlightRules } = require('./chordpro_highlight_rules');
  const { ChordProAutocompleteChords } = require('./chordpro_autocomplete_chords');

  setCompleters([ChordProAutocompleteChords]);

  const Mode = function cpmMode() {
    this.HighlightRules = ChordProHighlightRules;
  };

  oop.inherits(Mode, TextMode);

  (function cpmWorker() {
    // eslint-disable-next-line no-unused-vars
    this.createWorker = (session) => null;

    this.$id = 'ace/mode/chordpro';
    this.snippetFileId = 'ace/snippets/chordpro';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});

(() => {
  window.require(['ace/mode/chordpro'], (m) => {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m;
    }
  });
})();

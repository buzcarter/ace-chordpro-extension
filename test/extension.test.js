/**
 * Tests run against the BUILT bundle (dist/ace-chordpro.min.js), loaded into a
 * simulated browser page the way a user's page loads it. Run `npm run build` first
 * (`npm test` alone will fail with a clear message if dist/ is missing).
 */
const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');
const { JSDOM } = require('jsdom');

const BUNDLE = resolve(__dirname, '../dist/ace-chordpro.min.js');
let ace;
let window;

before(() => {
  assert.ok(existsSync(BUNDLE), 'dist/ace-chordpro.min.js is missing: run `npm run build` first');
  const dom = new JSDOM('<!DOCTYPE html><div id="editor"></div>', { runScripts: 'outside-only', pretendToBeVisual: true });
  ({ window } = dom);
  window.eval(readFileSync(BUNDLE, 'utf8'));
  ({ ace } = window);
  assert.ok(ace, 'bundle defines window.ace');
});

/** Tokenizes `lines`, carrying state line to line; returns [{type, value}] per line. */
function tokenize(lines) {
  const { Mode } = ace.require('ace/mode/chordpro');
  const tokenizer = new Mode().getTokenizer();
  let state = 'start';
  return lines.map((line) => {
    const out = tokenizer.getLineTokens(line, state);
    state = out.state;
    return out.tokens.filter((t) => t.value.trim() !== '');
  });
}

// token values keep surrounding spaces (e.g. after "title:"), so compare trimmed
const typeOf = (tokens, value) => (tokens.find((t) => t.value.trim() === value) || {}).type;

test('the bundle includes the license header first, with the Ace BSD notice intact', () => {
  const head = readFileSync(BUNDLE, 'utf8').slice(0, 3000);
  assert.match(head, /^\/\*!\n \* @name @ukegeeks\/ace-chordpro-extension/);
  assert.match(head, /Copyright \(c\) 2010, Ajax\.org B\.V\./);
  assert.match(head, /Redistributions in binary form must reproduce the above copyright/);
});

test('chords in [brackets] are keywords', () => {
  const [line] = tokenize(['I want to go [G]back to my [A7]little grass shack']);
  assert.equal(typeOf(line, 'G'), 'keyword');
  assert.equal(typeOf(line, 'A7'), 'keyword');
  assert.equal(typeOf(line, '['), 'constant.character.escape');
});

test('directives, comments and unknown directives', () => {
  const [title, comment, note, unknown] = tokenize([
    '{title: My Little Grass Shack}',
    '{c: Verse 1}',
    '# a note to self',
    '{flavour: vanilla}',
  ]);
  assert.equal(typeOf(title, 'title'), 'meta');
  assert.equal(typeOf(title, 'My Little Grass Shack'), 'string');
  assert.equal(typeOf(comment, 'c'), 'meta');
  assert.equal(note[0].type, 'comment');
  assert.equal(typeOf(unknown, 'flavour'), 'invalid');
});

test('numbers inside {define} and tab blocks are constant.numeric', () => {
  const [define, , tabLine] = tokenize([
    '{define: G frets 0 2 3 2 fingers 0 1 3 2}',
    '{start_of_tab}',
    'A|--3--5--|',
    '{end_of_tab}',
  ]);
  assert.equal(typeOf(define, '2'), 'constant.numeric');
  assert.equal(typeOf(define, 'frets'), 'keyword.control');
  assert.equal(typeOf(tabLine, '3'), 'constant.numeric');
  assert.equal(typeOf(tabLine, 'A'), 'string');
});

test('snippets register for the mode, and "t" expands to a title tag', () => {
  const { Mode } = ace.require('ace/mode/chordpro');
  const { snippetFileId } = new Mode();
  assert.equal(snippetFileId, 'ace/snippets/chordpro');

  const { snippetManager } = ace.require('ace/snippets');
  const { snippetText } = ace.require(snippetFileId);
  const snippets = snippetManager.parseSnippetFile(snippetText);
  const title = snippets.find((s) => s.tabTrigger === 't');
  assert.ok(title, 'a "t" snippet exists');
  assert.match(title.content, /^\{title: /);
});

test('the chord completer lists the song\'s chords, counted and ranked first', () => {
  const { Mode } = ace.require('ace/mode/chordpro');
  const { completer } = new Mode();
  assert.ok(completer, 'the mode provides its own completer');

  const song = '[G]I want to go [G]back, [A7]Hawaii, [D7]so long [G]ago';
  let result;
  completer.getCompletions({ getValue: () => song }, null, null, '', (err, list) => { result = list; });
  // arrays from the simulated page live in another JS realm: copy into Node arrays to compare
  assert.deepEqual(Array.from(result, (c) => c.value), ['[A7]', '[D7]', '[G]']);
  assert.equal(result.find((c) => c.value === '[G]').meta, '3 occurrences');
  assert.equal(result.find((c) => c.value === '[A7]').meta, '1 occurrence');
  assert.ok(result.every((c) => c.score >= 1000), 'chords outrank word/snippet suggestions');
});

test('Ace\'s keyword completer uses the chord completer only for ChordPro sessions', () => {
  const { keyWordCompleter } = ace.require('ace/ext/language_tools');
  const { EditSession } = ace.require('ace/edit_session');
  const { Mode: ChordProMode } = ace.require('ace/mode/chordpro');
  const { Mode: TextMode } = ace.require('ace/mode/text');
  const song = '[C]one [F]two';
  const ask = (session) => {
    let list;
    const editor = { getValue: () => session.getValue(), session };
    keyWordCompleter.getCompletions(editor, session, { row: 0, column: 0 }, '', (err, l) => { list = l; });
    return Array.from(list || [], (c) => c.value);
  };

  assert.deepEqual(ask(new EditSession(song, new ChordProMode())), ['[C]', '[F]']);
  assert.ok(!ask(new EditSession(song, new TextMode())).includes('[C]'), 'plain-text editors get no chord suggestions');
});

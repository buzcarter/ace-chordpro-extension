/* eslint-disable no-console */
/**
 * Builds dist/ace-chordpro.min.js: the vendored Ace files plus the ChordPro mode,
 * snippets and theme, concatenated in load order and minified.
 *
 * The licence header (Ace's BSD notice + this package's banner) is written
 * FIRST and kept OUT of the minifier, so the notice that Ace's licence requires
 * survives intact. Also copies src/styles/*.css to dist/styles/.
 *
 *   node tasks/build.js
 */
const { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } = require('fs');
const { resolve } = require('path');
const { minify } = require('terser');
const { author, description, homepage, license, name, version } = require('../package.json');

const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');

// Load order matters: Ace core first, then extensions, the mode, its snippets, the theme.
const SOURCES = [
  'ace.js',
  'ext-inline_autocomplete.js',
  'ext-language_tools.js',
  'ext-searchbox.js',
  'mode-chordpro.js',
  'snippets/chordpro.js',
  'theme-idle_fingers.js',
].map((file) => resolve(ROOT, 'src/ace', file));

const ACE_LICENSE = `/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */`;

function aceVersion(aceSource) {
  const m = aceSource.match(/version\s*=\s*"(\d+\.\d+\.\d+)"/);
  return m ? m[1] : 'unknown';
}

async function build() {
  const sources = SOURCES.map((file) => readFileSync(file, 'utf8'));
  const banner = `/*!
 * @name ${name}
 * @version ${version}
 * @description ${description}
 * @author ${author}
 * @license ${license}
 * @link ${homepage}
 * @copyright Copyright (C) 2012-${new Date().getUTCFullYear()} ${author}
 * [GNU General Public License](http://www.gnu.org/licenses/gpl.html)
 * @see https://ace.c9.io/ Ace Editor (version ${aceVersion(sources[0])}), BSD licence below
 */
${ACE_LICENSE}
`;

  const { code } = await minify(sources.join('\n;\n'), { format: { comments: false } });

  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });
  writeFileSync(resolve(DIST, 'ace-chordpro.min.js'), `${banner}${code}\n`);
  cpSync(resolve(ROOT, 'src/styles'), resolve(DIST, 'styles'), { recursive: true });

  console.info(`dist/ace-chordpro.min.js (${Math.round((banner.length + code.length) / 1024)} KiB), dist/styles/`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

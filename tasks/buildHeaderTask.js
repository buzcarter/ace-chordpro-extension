/* eslint-disable no-console */
const { resolve } = require('path');
const { mkdirSync, writeFileSync } = require('fs');
const { author, description, homepage, license, name, version } = require('../package.json');

const aceLicense = `
/* ***** BEGIN LICENSE BLOCK *****
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
 * ***** END LICENSE BLOCK ***** */
`;

function buildHeaderTask() {
  console.info('begin prebuild task buildHeaderTask');

  mkdirSync(resolve(__dirname, '../.tmp'));
  writeFileSync(resolve(__dirname, '../.tmp/header.js'), `
/* Ace Editor License... */
${aceLicense}
/**!
 * @name ${name}
 * @version ${version} (built ${new Date().toUTCString()})
 * @description ${description}
 * @author ${author}
 * @license ${license}
 * @link ${homepage}
 * @copyright Copyright (C) 2012-2023 ${author}
 * [GNU General Public License](http://www.gnu.org/licenses/gpl.html)
 * @see https://ace.c9.io/ Ace Editor, (version 1.27.0)
 */
`);

  console.info('buildHeaderTask complete.');
}

buildHeaderTask();

define('ace/snippets', ['require', 'exports', 'module', 'ace/lib/lang', 'ace/range', 'ace/keyboard/hash_handler', 'ace/tokenizer', 'ace/lib/dom'], (e, t, n) => {
  const r = e('./lib/lang');
  const i = e('./range').Range;
  const s = e('./keyboard/hash_handler').HashHandler;
  const o = e('./tokenizer').Tokenizer;
  const u = i.comparePoints;
  const a = function () {
    this.snippetMap = {}, this.snippetNameMap = {};
  };
  (function () {
    this.getTokenizer = function () {
      function e(e, t, n) {
        return e = e.substr(1), /^\d+$/.test(e) && !n.inFormatString ? [{
          tabstopId: parseInt(e, 10),
        }] : [{
          text: e,
        }];
      }

      function t(e) {
        return `(?:[^\\\\${e}]|\\\\.)`;
      }
      return a.$tokenizer = new o({
        start: [{
          regex: /:/,
          onMatch(e, t, n) {
            return n.length && n[0].expectIf ? (n[0].expectIf = !1, n[0].elseBranch = n[0], [n[0]]) : ':';
          },
        }, {
          regex: /\\./,
          onMatch(e, t, n) {
            const r = e[1];
            return r == '}' && n.length ? e = r : '`$\\'.indexOf(r) != -1 ? e = r : n.inFormatString && (r == 'n' ? e = '\n' : r == 't' ? e = '\n' : 'ulULE'.indexOf(r) != -1 && (e = {
              changeCase: r,
              local: r > 'a',
            })), [e];
          },
        }, {
          regex: /}/,
          onMatch(e, t, n) {
            return [n.length ? n.shift() : e];
          },
        }, {
          regex: /\$(?:\d+|\w+)/,
          onMatch: e,
        }, {
          regex: /\$\{[\dA-Z_a-z]+/,
          onMatch(t, n, r) {
            const i = e(t.substr(1), n, r);
            return r.unshift(i[0]), i;
          },
          next: 'snippetVar',
        }, {
          regex: /\n/,
          token: 'newline',
          merge: !1,
        }],
        snippetVar: [{
          regex: `\\|${t('\\|')}*\\|`,
          onMatch(e, t, n) {
            n[0].choices = e.slice(1, -1).split(',');
          },
          next: 'start',
        }, {
          regex: `/(${t('/')}+)/(?:(${t('/')}*)/)(\\w*):?`,
          onMatch(e, t, n) {
            const r = n[0];
            return r.fmtString = e, e = this.splitRegex.exec(e), r.guard = e[1], r.fmt = e[2], r.flag = e[3], '';
          },
          next: 'start',
        }, {
          regex: `\`${t('`')}*\``,
          onMatch(e, t, n) {
            return n[0].code = e.splice(1, -1), '';
          },
          next: 'start',
        }, {
          regex: '\\?',
          onMatch(e, t, n) {
            n[0] && (n[0].expectIf = !0);
          },
          next: 'start',
        }, {
          regex: '([^:}\\\\]|\\\\.)*:?',
          token: '',
          next: 'start',
        }],
        formatString: [{
          regex: `/(${t('/')}+)/`,
          token: 'regex',
        }, {
          regex: '',
          onMatch(e, t, n) {
            n.inFormatString = !0;
          },
          next: 'start',
        }],
      }), a.prototype.getTokenizer = function () {
        return a.$tokenizer;
      }, a.$tokenizer;
    }, this.tokenizeTmSnippet = function (e, t) {
      return this.getTokenizer().getLineTokens(e, t).tokens.map((e) => e.value || e);
    }, this.$getDefaultValue = function (e, t) {
      if (/^[A-Z]\d+$/.test(t)) {
        const n = t.substr(1);
        return (this.variables[`${t[0]}__`] || {})[n];
      }
      if (/^\d+$/.test(t)) return (this.variables.__ || {})[t];
      t = t.replace(/^TM_/, '');
      if (!e) return;
      const r = e.session;
      switch (t) {
        case 'CURRENT_WORD':
          var i = r.getWordRange();
        case 'SELECTION':
        case 'SELECTED_TEXT':
          return r.getTextRange(i);
        case 'CURRENT_LINE':
          return r.getLine(e.getCursorPosition().row);
        case 'PREV_LINE':
          return r.getLine(e.getCursorPosition().row - 1);
        case 'LINE_INDEX':
          return e.getCursorPosition().column;
        case 'LINE_NUMBER':
          return e.getCursorPosition().row + 1;
        case 'SOFT_TABS':
          return r.getUseSoftTabs() ? 'YES' : 'NO';
        case 'TAB_SIZE':
          return r.getTabSize();
        case 'FILENAME':
        case 'FILEPATH':
          return '';
        case 'FULLNAME':
          return 'Ace';
      }
    }, this.variables = {}, this.getVariableValue = function (e, t) {
      return this.variables.hasOwnProperty(t) ? this.variables[t](e, t) || '' : this.$getDefaultValue(e, t) || '';
    }, this.tmStrFormat = function (e, t, n) {
      const r = t.flag || '';
      let i = t.guard;
      i = new RegExp(i, r.replace(/[^gi]/, ''));
      const s = this.tokenizeTmSnippet(t.fmt, 'formatString');
      const o = this;
      const u = e.replace(i, function () {
        o.variables.__ = arguments;
        const e = o.resolveVariables(s, n);
        let t = 'E';
        for (let r = 0; r < e.length; r++) {
          const i = e[r];
          if (typeof i === 'object') {
            e[r] = '';
            if (i.changeCase && i.local) {
              const u = e[r + 1];
              u && typeof u === 'string' && (i.changeCase == 'u' ? e[r] = u[0].toUpperCase() : e[r] = u[0].toLowerCase(), e[r + 1] = u.substr(1));
            } else i.changeCase && (t = i.changeCase);
          } else t == 'U' ? e[r] = i.toUpperCase() : t == 'L' && (e[r] = i.toLowerCase());
        }
        return e.join('');
      });
      return this.variables.__ = null, u;
    }, this.resolveVariables = function (e, t) {
      function o(t) {
        const n = e.indexOf(t, r + 1);
        n != -1 && (r = n);
      }
      const n = [];
      for (var r = 0; r < e.length; r++) {
        const i = e[r];
        if (typeof i === 'string') n.push(i);
        else {
          if (typeof i !== 'object') continue;
          if (i.skip) o(i);
          else {
            if (i.processed < r) continue;
            if (i.text) {
              let s = this.getVariableValue(t, i.text);
              s && i.fmtString && (s = this.tmStrFormat(s, i)), i.processed = r, i.expectIf == null ? s && (n.push(s), o(i)) : s ? i.skip = i.elseBranch : o(i);
            } else i.tabstopId != null ? n.push(i) : i.changeCase != null && n.push(i);
          }
        }
      }
      return n;
    }, this.insertSnippet = function (e, t) {
      function l(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          let r = e[n];
          if (typeof r === 'object') {
            if (a[r.tabstopId]) continue;
            const i = e.lastIndexOf(r, n - 1);
            r = t[i] || {
              tabstopId: r.tabstopId,
            };
          }
          t[n] = r;
        }
        return t;
      }
      const n = e.getCursorPosition();
      const r = e.session.getLine(n.row);
      const i = r.match(/^\s*/)[0];
      const s = e.session.getTabString();
      let o = this.tokenizeTmSnippet(t);
      o = this.resolveVariables(o, e), o = o.map((e) => (e == '\n' ? e + i : typeof e === 'string' ? e.replace(/\t/g, s) : e));
      const u = [];
      o.forEach((e, t) => {
        if (typeof e !== 'object') return;
        const n = e.tabstopId;
        let r = u[n];
        r || (r = u[n] = [], r.index = n, r.value = '');
        if (r.indexOf(e) !== -1) return;
        r.push(e);
        const i = o.indexOf(e, t + 1);
        if (i === -1) return;
        const s = o.slice(t + 1, i);
        const a = s.some((e) => typeof e === 'object');
        a && !r.value ? r.value = s : s.length && (!r.value || typeof r.value !== 'string') && (r.value = s.join(''));
      }), u.forEach((e) => {
        e.length = 0;
      });
      var a = {};
      for (let c = 0; c < o.length; c++) {
        const h = o[c];
        if (typeof h !== 'object') continue;
        const p = h.tabstopId;
        const d = o.indexOf(h, c + 1);
        if (a[p]) {
          a[p] === h && (a[p] = null);
          continue;
        }
        const v = u[p];
        const m = typeof v.value === 'string' ? [v.value] : l(v.value);
        m.unshift(c + 1, Math.max(0, d - c)), m.push(h), a[p] = h, o.splice.apply(o, m), v.indexOf(h) === -1 && v.push(h);
      }
      let g = 0;
      let y = 0;
      let b = '';
      o.forEach((e) => {
        typeof e === 'string' ? (e[0] === '\n' ? (y = e.length - 1, g++) : y += e.length, b += e) : e.start ? e.end = {
          row: g,
          column: y,
        } : e.start = {
          row: g,
          column: y,
        };
      });
      const w = e.getSelectionRange();
      const E = e.session.replace(w, b);
      const S = new f(e);
      S.addTabstops(u, w.start, E), S.tabNext();
    }, this.$getScope = function (e) {
      let t = e.session.$mode.$id || '';
      t = t.split('/').pop();
      if (t === 'html' || t === 'php') {
        t === 'php' && (t = 'html');
        const n = e.getCursorPosition();
        let r = e.session.getState(n.row);
        typeof r === 'object' && (r = r[0]), r.substring && (r.substring(0, 3) == 'js-' ? t = 'javascript' : r.substring(0, 4) == 'css-' ? t = 'css' : r.substring(0, 4) == 'php-' && (t = 'php'));
      }
      return t;
    }, this.getActiveScopes = function (e) {
      const t = this.$getScope(e);
      const n = [t];
      const r = this.snippetMap;
      return r[t] && r[t].includeScopes && n.push.apply(n, r[t].includeScopes), n.push('_'), n;
    }, this.expandWithTab = function (e) {
      const t = e.getCursorPosition();
      const n = e.session.getLine(t.row);
      const r = n.substring(0, t.column);
      const i = n.substr(t.column);
      const s = this.snippetMap;
      let o;
      return this.getActiveScopes(e).some(function (e) {
        const t = s[e];
        return t && (o = this.findMatchingSnippet(t, r, i)), !!o;
      }, this), o ? (e.session.doc.removeInLine(t.row, t.column - o.replaceBefore.length, t.column + o.replaceAfter.length), this.variables.M__ = o.matchBefore, this.variables.T__ = o.matchAfter, this.insertSnippet(e, o.content), this.variables.M__ = this.variables.T__ = null, !0) : !1;
    }, this.findMatchingSnippet = function (e, t, n) {
      for (let r = e.length; r--;) {
        const i = e[r];
        if (i.startRe && !i.startRe.test(t)) continue;
        if (i.endRe && !i.endRe.test(n)) continue;
        if (!i.startRe && !i.endRe) continue;
        return i.matchBefore = i.startRe ? i.startRe.exec(t) : [''], i.matchAfter = i.endRe ? i.endRe.exec(n) : [''], i.replaceBefore = i.triggerRe ? i.triggerRe.exec(t)[0] : '', i.replaceAfter = i.endTriggerRe ? i.endTriggerRe.exec(n)[0] : '', i;
      }
    }, this.snippetMap = {}, this.snippetNameMap = {}, this.register = function (e, t) {
      function o(e) {
        return e && !/^\^?\(.*\)\$?$|^\\b$/.test(e) && (e = `(?:${e})`), e || '';
      }

      function u(e, t, n) {
        return e = o(e), t = o(t), n ? (e = t + e, e && e[e.length - 1] != '$' && (e += '$')) : (e += t, e && e[0] != '^' && (e = `^${e}`)), new RegExp(e);
      }

      function a(e) {
        e.scope || (e.scope = t || '_'), t = e.scope, n[t] || (n[t] = [], i[t] = {});
        const o = i[t];
        if (e.name) {
          const a = o[e.name];
          a && s.unregister(a), o[e.name] = e;
        }
        n[t].push(e), e.tabTrigger && !e.trigger && (!e.guard && /^\w/.test(e.tabTrigger) && (e.guard = '\\b'), e.trigger = r.escapeRegExp(e.tabTrigger)), e.startRe = u(e.trigger, e.guard, !0), e.triggerRe = new RegExp(e.trigger, '', !0), e.endRe = u(e.endTrigger, e.endGuard, !0), e.endTriggerRe = new RegExp(e.endTrigger, '', !0);
      }
      var n = this.snippetMap;
      var i = this.snippetNameMap;
      var s = this;
      e.content ? a(e) : Array.isArray(e) && e.forEach(a);
    }, this.unregister = function (e, t) {
      function i(e) {
        const i = r[e.scope || t];
        if (i && i[e.name]) {
          delete i[e.name];
          const s = n[e.scope || t];
          const o = s && s.indexOf(e);
          o >= 0 && s.splice(o, 1);
        }
      }
      var n = this.snippetMap;
      var r = this.snippetNameMap;
      e.content ? i(e) : Array.isArray(e) && e.forEach(i);
    }, this.parseSnippetFile = function (e) {
      e = e.replace(/\r/g, '');
      const t = [];
      let n = {};
      const r = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
      let i;
      while (i = r.exec(e)) {
        if (i[1]) {
          try {
            n = JSON.parse(i[1]), t.push(n);
          } catch (s) {}
        }
        if (i[4]) n.content = i[4].replace(/^\t/gm, ''), t.push(n), n = {};
        else {
          const o = i[2];
          const u = i[3];
          if (o == 'regex') {
            const a = /\/((?:[^\/\\]|\\.)*)|$/g;
            n.guard = a.exec(u)[1], n.trigger = a.exec(u)[1], n.endTrigger = a.exec(u)[1], n.endGuard = a.exec(u)[1];
          } else o == 'snippet' ? (n.tabTrigger = u.match(/^\S*/)[0], n.name || (n.name = u)) : n[o] = u;
        }
      }
      return t;
    }, this.getSnippetByName = function (e, t) {
      const n = this.snippetNameMap;
      let r;
      return this.getActiveScopes(t).some((t) => {
        const i = n[t];
        return i && (r = i[e]), !!r;
      }, this), r;
    };
  }).call(a.prototype);
  var f = function (e) {
    if (e.tabstopManager) return e.tabstopManager;
    e.tabstopManager = this, this.$onChange = this.onChange.bind(this), this.$onChangeSelection = r.delayedCall(this.onChangeSelection.bind(this)).schedule, this.$onChangeSession = this.onChangeSession.bind(this), this.$onAfterExec = this.onAfterExec.bind(this), this.attach(e);
  };
  (function () {
    this.attach = function (e) {
      this.index = -1, this.ranges = [], this.tabstops = [], this.selectedTabstop = null, this.editor = e, this.editor.on('change', this.$onChange), this.editor.on('changeSelection', this.$onChangeSelection), this.editor.on('changeSession', this.$onChangeSession), this.editor.commands.on('afterExec', this.$onAfterExec), this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    }, this.detach = function () {
      this.tabstops.forEach(this.removeTabstopMarkers, this), this.ranges = null, this.tabstops = null, this.selectedTabstop = null, this.editor.removeListener('change', this.$onChange), this.editor.removeListener('changeSelection', this.$onChangeSelection), this.editor.removeListener('changeSession', this.$onChangeSession), this.editor.commands.removeListener('afterExec', this.$onAfterExec), this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler), this.editor.tabstopManager = null, this.editor = null;
    }, this.onChange = function (e) {
      const t = e.data.range;
      const n = e.data.action[0] == 'r';
      const r = t.start;
      const i = t.end;
      const s = r.row;
      const o = i.row;
      let a = o - s;
      let f = i.column - r.column;
      n && (a = -a, f = -f);
      if (!this.$inChange && n) {
        const l = this.selectedTabstop;
        const c = !l.some((e) => u(e.start, r) <= 0 && u(e.end, i) >= 0);
        if (c) return this.detach();
      }
      const h = this.ranges;
      for (let p = 0; p < h.length; p++) {
        const d = h[p];
        if (d.end.row < r.row) continue;
        if (u(r, d.start) < 0 && u(i, d.end) > 0) {
          this.removeRange(d), p--;
          continue;
        }
        d.start.row == s && d.start.column > r.column && (d.start.column += f), d.end.row == s && d.end.column >= r.column && (d.end.column += f), d.start.row >= s && (d.start.row += a), d.end.row >= s && (d.end.row += a), u(d.start, d.end) > 0 && this.removeRange(d);
      }
      h.length || this.detach();
    }, this.updateLinkedFields = function () {
      const e = this.selectedTabstop;
      if (!e.hasLinkedRanges) return;
      this.$inChange = !0;
      const n = this.editor.session;
      const r = n.getTextRange(e.firstNonLinked);
      for (let i = e.length; i--;) {
        const s = e[i];
        if (!s.linked) continue;
        const o = t.snippetManager.tmStrFormat(r, s.original);
        n.replace(s, o);
      }
      this.$inChange = !1;
    }, this.onAfterExec = function (e) {
      e.command && !e.command.readOnly && this.updateLinkedFields();
    }, this.onChangeSelection = function () {
      if (!this.editor) return;
      const e = this.editor.selection.lead;
      const t = this.editor.selection.anchor;
      const n = this.editor.selection.isEmpty();
      for (let r = this.ranges.length; r--;) {
        if (this.ranges[r].linked) continue;
        const i = this.ranges[r].contains(e.row, e.column);
        const s = n || this.ranges[r].contains(t.row, t.column);
        if (i && s) return;
      }
      this.detach();
    }, this.onChangeSession = function () {
      this.detach();
    }, this.tabNext = function (e) {
      const t = this.tabstops.length - 1;
      let n = this.index + (e || 1);
      n = Math.min(Math.max(n, 0), t), this.selectTabstop(n), n == t && this.detach();
    }, this.selectTabstop = function (e) {
      let t = this.tabstops[this.index];
      t && this.addTabstopMarkers(t), this.index = e, t = this.tabstops[this.index];
      if (!t || !t.length) return;
      this.selectedTabstop = t;
      if (!this.editor.inVirtualSelectionMode) {
        const n = this.editor.multiSelect;
        n.toSingleRange(t.firstNonLinked.clone());
        for (let r = t.length; r--;) {
          if (t.hasLinkedRanges && t[r].linked) continue;
          n.addRange(t[r].clone(), !0);
        }
      } else this.editor.selection.setRange(t.firstNonLinked);
      this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    }, this.addTabstops = function (e, t, n) {
      if (!e[0]) {
        const r = i.fromPoints(n, n);
        c(r.start, t), c(r.end, t), e[0] = [r], e[0].index = 0;
      }
      const s = this.index;
      const o = [s, 0];
      const u = this.ranges;
      const a = this.editor;
      e.forEach(function (e) {
        for (let n = e.length; n--;) {
          const r = e[n];
          const s = i.fromPoints(r.start, r.end || r.start);
          l(s.start, t), l(s.end, t), s.original = r, s.tabstop = e, u.push(s), e[n] = s, r.fmtString ? (s.linked = !0, e.hasLinkedRanges = !0) : e.firstNonLinked || (e.firstNonLinked = s);
        }
        e.firstNonLinked || (e.hasLinkedRanges = !1), o.push(e), this.addTabstopMarkers(e);
      }, this), o.push(o.splice(2, 1)[0]), this.tabstops.splice.apply(this.tabstops, o);
    }, this.addTabstopMarkers = function (e) {
      const t = this.editor.session;
      e.forEach((e) => {
        e.markerId || (e.markerId = t.addMarker(e, 'ace_snippet-marker', 'text'));
      });
    }, this.removeTabstopMarkers = function (e) {
      const t = this.editor.session;
      e.forEach((e) => {
        t.removeMarker(e.markerId), e.markerId = null;
      });
    }, this.removeRange = function (e) {
      let t = e.tabstop.indexOf(e);
      e.tabstop.splice(t, 1), t = this.ranges.indexOf(e), this.ranges.splice(t, 1), this.editor.session.removeMarker(e.markerId);
    }, this.keyboardHandler = new s(), this.keyboardHandler.bindKeys({
      Tab(e) {
        if (t.snippetManager && t.snippetManager.expandWithTab(e)) return;
        e.tabstopManager.tabNext(1);
      },
      'Shift-Tab': function (e) {
        e.tabstopManager.tabNext(-1);
      },
      Esc(e) {
        e.tabstopManager.detach();
      },
      Return(e) {
        return !1;
      },
    });
  }).call(f.prototype);
  var l = function (e, t) {
    e.row == 0 && (e.column += t.column), e.row += t.row;
  };
  var c = function (e, t) {
    e.row == t.row && (e.column -= t.column), e.row -= t.row;
  };
  e('./lib/dom').importCssString('.ace_snippet-marker {    -moz-box-sizing: border-box;    box-sizing: border-box;    background: rgba(194, 193, 208, 0.09);    border: 1px dotted rgba(211, 208, 235, 0.62);    position: absolute;}'), t.snippetManager = new a();
})

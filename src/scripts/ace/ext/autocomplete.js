define('ace/autocomplete', ['require', 'exports', 'module', 'ace/keyboard/hash_handler', 'ace/autocomplete/popup', 'ace/autocomplete/util', 'ace/lib/event', 'ace/lib/lang', 'ace/snippets'], (e, t, n) => {
  const r = e('./keyboard/hash_handler').HashHandler;
  const i = e('./autocomplete/popup').AcePopup;
  const s = e('./autocomplete/util');
  const o = e('./lib/event');
  const u = e('./lib/lang');
  const a = e('./snippets').snippetManager;
  const f = function () {
    this.autoInsert = !0, this.keyboardHandler = new r(), this.keyboardHandler.bindKeys(this.commands), this.blurListener = this.blurListener.bind(this), this.changeListener = this.changeListener.bind(this), this.mousedownListener = this.mousedownListener.bind(this), this.mousewheelListener = this.mousewheelListener.bind(this), this.changeTimer = u.delayedCall(() => {
      this.updateCompletions(!0);
    });
  };
  (function () {
    this.$init = function () {
      this.popup = new i(document.body || document.documentElement), this.popup.on('click', (e) => {
        this.insertMatch(), e.stop();
      });
    }, this.openPopup = function (e, t, n) {
      this.popup || this.$init(), this.popup.setData(this.completions.filtered);
      const r = e.renderer;
      if (!n) {
        this.popup.setRow(0), this.popup.setFontSize(e.getFontSize());
        const i = r.layerConfig.lineHeight;
        const s = r.$cursorLayer.getPixelPosition(this.base, !0);
        s.left -= this.popup.getTextLeftOffset();
        const o = e.container.getBoundingClientRect();
        s.top += o.top - r.layerConfig.offset, s.left += o.left - e.renderer.scrollLeft, s.left += r.$gutterLayer.gutterWidth, this.popup.show(s, i);
      }
    }, this.detach = function () {
      this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler), this.editor.off('changeSelection', this.changeListener), this.editor.off('blur', this.blurListener), this.editor.off('mousedown', this.mousedownListener), this.editor.off('mousewheel', this.mousewheelListener), this.changeTimer.cancel(), this.popup && this.popup.hide(), this.activated = !1, this.completions = this.base = null;
    }, this.changeListener = function (e) {
      const t = this.editor.selection.lead;
      (t.row != this.base.row || t.column < this.base.column) && this.detach(), this.activated ? this.changeTimer.schedule() : this.detach();
    }, this.blurListener = function () {
      document.activeElement != this.editor.textInput.getElement() && this.detach();
    }, this.mousedownListener = function (e) {
      this.detach();
    }, this.mousewheelListener = function (e) {
      this.detach();
    }, this.goTo = function (e) {
      let t = this.popup.getRow();
      const n = this.popup.session.getLength() - 1;
      switch (e) {
        case 'up':
          t = t < 0 ? n : t - 1;
          break;
        case 'down':
          t = t >= n ? -1 : t + 1;
          break;
        case 'start':
          t = 0;
          break;
        case 'end':
          t = n;
      }
      this.popup.setRow(t);
    }, this.insertMatch = function (e) {
      e || (e = this.popup.getData(this.popup.getRow()));
      if (!e) return !1;
      if (e.completer && e.completer.insertMatch) e.completer.insertMatch(this.editor);
      else {
        if (this.completions.filterText) {
          const t = this.editor.selection.getAllRanges();
          for (var n = 0, r; r = t[n]; n++) r.start.column -= this.completions.filterText.length, this.editor.session.remove(r);
        }
        e.snippet ? a.insertSnippet(this.editor, e.snippet) : this.editor.execCommand('insertstring', e.value || e);
      }
      this.detach();
    }, this.commands = {
      Up(e) {
        e.completer.goTo('up');
      },
      Down(e) {
        e.completer.goTo('down');
      },
      'Ctrl-Up|Ctrl-Home': function (e) {
        e.completer.goTo('start');
      },
      'Ctrl-Down|Ctrl-End': function (e) {
        e.completer.goTo('end');
      },
      Esc(e) {
        e.completer.detach();
      },
      Space(e) {
        e.completer.detach(), e.insert(' ');
      },
      Return(e) {
        e.completer.insertMatch();
      },
      'Shift-Return': function (e) {
        e.completer.insertMatch(!0);
      },
      Tab(e) {
        e.completer.insertMatch();
      },
      PageUp(e) {
        e.completer.popup.gotoPageUp();
      },
      PageDown(e) {
        e.completer.popup.gotoPageDown();
      },
    }, this.gatherCompletions = function (e, t) {
      const n = e.getSession();
      const r = e.getCursorPosition();
      const i = n.getLine(r.row);
      const o = s.retrievePrecedingIdentifier(i, r.column);
      this.base = e.getCursorPosition(), this.base.column -= o.length;
      let u = [];
      return s.parForEach(e.completers, (t, i) => {
        t.getCompletions(e, n, r, o, (e, t) => {
          e || (u = u.concat(t)), i();
        });
      }, () => {
        t(null, {
          prefix: o,
          matches: u,
        });
      }), !0;
    }, this.showPopup = function (e) {
      this.editor && this.detach(), this.activated = !0, this.editor = e, e.completer != this && (e.completer && e.completer.detach(), e.completer = this), e.keyBinding.addKeyboardHandler(this.keyboardHandler), e.on('changeSelection', this.changeListener), e.on('blur', this.blurListener), e.on('mousedown', this.mousedownListener), e.on('mousewheel', this.mousewheelListener), this.updateCompletions();
    }, this.updateCompletions = function (e) {
      if (e && this.base && this.completions) {
        const t = this.editor.getCursorPosition();
        const n = this.editor.session.getTextRange({
          start: this.base,
          end: t,
        });
        if (n == this.completions.filterText) return;
        this.completions.setFilter(n);
        if (!this.completions.filtered.length) return this.detach();
        this.openPopup(this.editor, n, e);
        return;
      }
      this.gatherCompletions(this.editor, (t, n) => {
        const r = n && n.matches;
        if (!r || !r.length) return this.detach();
        this.completions = new l(r), this.completions.setFilter(n.prefix);
        const i = this.completions.filtered;
        if (!i.length) return this.detach();
        if (this.autoInsert && i.length == 1) return this.insertMatch(i[0]);
        this.openPopup(this.editor, n.prefix, e);
      });
    }, this.cancelContextMenu = function () {
      var e = function (t) {
        this.editor.off('nativecontextmenu', e), t && t.domEvent && o.stopEvent(t.domEvent);
      }.bind(this);
      setTimeout(e, 10), this.editor.on('nativecontextmenu', e);
    };
  }).call(f.prototype), f.startCommand = {
    name: 'startAutocomplete',
    exec(e) {
      e.completer || (e.completer = new f()), e.completer.showPopup(e), e.completer.cancelContextMenu();
    },
    bindKey: 'Ctrl-Space|Ctrl-Shift-Space|Alt-Space',
  };
  var l = function (e, t, n) {
    this.all = e, this.filtered = e, this.filterText = t || '';
  };
  (function () {
    this.setFilter = function (e) {
      if (e.length > this.filterText && e.lastIndexOf(this.filterText, 0) === 0) var t = this.filtered;
      else var t = this.all;
      this.filterText = e, t = this.filterCompletions(t, this.filterText), t = t.sort((e, t) => t.exactMatch - e.exactMatch || t.score - e.score);
      let n = null;
      t = t.filter((e) => {
        const t = e.value || e.caption || e.snippet;
        return t === n ? !1 : (n = t, !0);
      }), this.filtered = t;
    }, this.filterCompletions = function (e, t) {
      const n = [];
      const r = t.toUpperCase();
      const i = t.toLowerCase();
      e: for (var s = 0, o; o = e[s]; s++) {
        const u = o.value || o.caption || o.snippet;
        if (!u) continue;
        let a = -1;
        let f = 0;
        let l = 0;
        var c; var
          h;
        for (let p = 0; p < t.length; p++) {
          const d = u.indexOf(i[p], a + 1);
          const v = u.indexOf(r[p], a + 1);
          c = d >= 0 ? v < 0 || d < v ? d : v : v;
          if (c < 0) continue e;
          h = c - a - 1, h > 0 && (a === -1 && (l += 10), l += h), f |= 1 << c, a = c;
        }
        o.matchMask = f, o.exactMatch = l ? 0 : 1, o.score = (o.score || 0) - l, n.push(o);
      }
      return n;
    };
  }).call(l.prototype), t.Autocomplete = f, t.FilteredList = l;
})

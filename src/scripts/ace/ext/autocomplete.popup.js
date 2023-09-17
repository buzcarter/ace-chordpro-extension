define('ace/autocomplete/popup', ['require', 'exports', 'module', 'ace/edit_session', 'ace/virtual_renderer', 'ace/editor', 'ace/range', 'ace/lib/event', 'ace/lib/lang', 'ace/lib/dom'], (e, t, n) => {
  const r = e('../edit_session').EditSession;
  const i = e('../virtual_renderer').VirtualRenderer;
  const s = e('../editor').Editor;
  const o = e('../range').Range;
  const u = e('../lib/event');
  const a = e('../lib/lang');
  const f = e('../lib/dom');
  const l = function (e) {
    const t = new i(e);
    t.$maxLines = 4;
    const n = new s(t);
    return n.setHighlightActiveLine(!1), n.setShowPrintMargin(!1), n.renderer.setShowGutter(!1), n.renderer.setHighlightGutterLine(!1), n.$mouseHandler.$focusWaitTimout = 0, n;
  };
  const c = function (e) {
    const t = f.createElement('div');
    const n = new l(t);
    e && e.appendChild(t), t.style.display = 'none', n.renderer.content.style.cursor = 'default', n.renderer.setStyle('ace_autocomplete'), n.setOption('displayIndentGuides', !1);
    const r = function () {};
    n.focus = r, n.$isFocused = !0, n.renderer.$cursorLayer.restartTimer = r, n.renderer.$cursorLayer.element.style.opacity = 0, n.renderer.$maxLines = 8, n.renderer.$keepTextAreaAtCursor = !1, n.setHighlightActiveLine(!1), n.session.highlight(''), n.session.$searchHighlight.clazz = 'ace_highlight-marker', n.on('mousedown', (e) => {
      const t = e.getDocumentPosition();
      n.selection.moveToPosition(t), c.start.row = c.end.row = t.row, e.stop();
    });
    let i; const s = new o(-1, 0, -1, Infinity);
    var c = new o(-1, 0, -1, Infinity);
    c.id = n.session.addMarker(c, 'ace_active-line', 'fullLine'), n.setSelectOnHover = function (e) {
      e ? s.id && (n.session.removeMarker(s.id), s.id = null) : s.id = n.session.addMarker(s, 'ace_line-hover', 'fullLine');
    }, n.setSelectOnHover(!1), n.on('mousemove', (e) => {
      if (!i) {
        i = e;
        return;
      }
      if (i.x == e.x && i.y == e.y) return;
      i = e, i.scrollTop = n.renderer.scrollTop;
      const t = i.getDocumentPosition().row;
      s.start.row != t && (s.id || n.setRow(t), p(t));
    }), n.renderer.on('beforeRender', () => {
      if (i && s.start.row != -1) {
        i.$pos = null;
        const e = i.getDocumentPosition().row;
        s.id || n.setRow(e), p(e, !0);
      }
    }), n.renderer.on('afterRender', () => {
      const e = n.getRow();
      const t = n.renderer.$textLayer;
      const r = t.element.childNodes[e - t.config.firstRow];
      if (r == t.selectedNode) return;
      t.selectedNode && f.removeCssClass(t.selectedNode, 'ace_selected'), t.selectedNode = r, r && f.addCssClass(r, 'ace_selected');
    });
    const h = function () {
      p(-1);
    };
    var p = function (e, t) {
      e !== s.start.row && (s.start.row = s.end.row = e, t || n.session._emit('changeBackMarker'), n._emit('changeHoverMarker'));
    };
    n.getHoveredRow = function () {
      return s.start.row;
    }, u.addListener(n.container, 'mouseout', h), n.on('hide', h), n.on('changeSelection', h), n.session.doc.getLength = function () {
      return n.data.length;
    }, n.session.doc.getLine = function (e) {
      const t = n.data[e];
      return typeof t === 'string' ? t : t && t.value || '';
    };
    const d = n.session.bgTokenizer;
    return d.$tokenizeRow = function (e) {
      let t = n.data[e];
      const r = [];
      if (!t) return r;
      typeof t === 'string' && (t = {
        value: t,
      }), t.caption || (t.caption = t.value);
      let i = -1;
      let s; let
        o;
      for (var e = 0; e < t.caption.length; e++) {
        o = t.caption[e], s = t.matchMask & 1 << e ? 1 : 0, i !== s ? (r.push({
          type: t.className || `${s ? 'completion-highlight' : ''}`,
          value: o,
        }), i = s) : r[r.length - 1].value += o;
      }
      if (t.meta) {
        const u = n.renderer.$size.scrollerWidth / n.renderer.layerConfig.characterWidth;
        t.meta.length + t.caption.length < u - 2 && r.push({
          type: 'rightAlignedText',
          value: t.meta,
        });
      }
      return r;
    }, d.$updateOnChange = r, d.start = r, n.session.$computeWidth = function () {
      return this.screenWidth = 0;
    }, n.isOpen = !1, n.isTopdown = !1, n.data = [], n.setData = function (e) {
      n.data = e || [], n.setValue(a.stringRepeat('\n', e.length), -1), n.setRow(0);
    }, n.getData = function (e) {
      return n.data[e];
    }, n.getRow = function () {
      return c.start.row;
    }, n.setRow = function (e) {
      e = Math.max(-1, Math.min(this.data.length, e)), c.start.row != e && (n.selection.clearSelection(), c.start.row = c.end.row = e || 0, n.session._emit('changeBackMarker'), n.moveCursorTo(e || 0, 0), n.isOpen && n._signal('select'));
    }, n.on('changeSelection', () => {
      n.isOpen && n.setRow(n.selection.lead.row);
    }), n.hide = function () {
      this.container.style.display = 'none', this._signal('hide'), n.isOpen = !1;
    }, n.show = function (e, t, r) {
      const s = this.container;
      const o = window.innerHeight;
      const u = window.innerWidth;
      const a = this.renderer;
      const f = a.$maxLines * t * 1.4;
      let l = e.top + this.$borderSize;
      l + f > o - t && !r ? (s.style.top = '', s.style.bottom = `${o - l}px`, n.isTopdown = !1) : (l += t, s.style.top = `${l}px`, s.style.bottom = '', n.isTopdown = !0), s.style.display = '', this.renderer.$textLayer.checkForSizeChanges();
      let c = e.left;
      c + s.offsetWidth > u && (c = u - s.offsetWidth), s.style.left = `${c}px`, this._signal('show'), i = null, n.isOpen = !0;
    }, n.getTextLeftOffset = function () {
      return this.$borderSize + this.renderer.$padding + this.$imageSize;
    }, n.$imageSize = 0, n.$borderSize = 1, n;
  };
  f.importCssString('.ace_autocomplete.ace-tm .ace_marker-layer .ace_active-line {    background-color: #CAD6FA;    z-index: 1;}.ace_autocomplete.ace-tm .ace_line-hover {    border: 1px solid #abbffe;    margin-top: -1px;    background: rgba(233,233,253,0.4);}.ace_autocomplete .ace_line-hover {    position: absolute;    z-index: 2;}.ace_rightAlignedText {    color: gray;    display: inline-block;    position: absolute;    right: 4px;    text-align: right;    z-index: -1;}.ace_autocomplete .ace_completion-highlight{    color: #000;    text-shadow: 0 0 0.01em;}.ace_autocomplete {    width: 280px;    z-index: 200000;    background: #fbfbfb;    color: #444;    border: 1px lightgray solid;    position: fixed;    box-shadow: 2px 3px 5px rgba(0,0,0,.2);    line-height: 1.4;}'), t.AcePopup = c;
})

define('ace/autocomplete/text_completer', ['require', 'exports', 'module', 'ace/range'], (e, t, n) => {
  function s(e, t) {
    const n = e.getTextRange(r.fromPoints({
      row: 0,
      column: 0,
    }, t));
    return n.split(i).length - 1;
  }

  function o(e, t) {
    const n = s(e, t);
    const r = e.getValue().split(i);
    const o = Object.create(null);
    const u = r[n];
    return r.forEach((e, t) => {
      if (!e || e === u) return;
      const i = Math.abs(n - t);
      const s = r.length - i;
      o[e] ? o[e] = Math.max(s, o[e]) : o[e] = s;
    }), o;
  }
  var r = e('ace/range').Range;
  var i = /[^a-zA-Z_0-9\$\-]+/;
  t.getCompletions = function (e, t, n, r, i) {
    const s = o(t, n, r);
    const u = Object.keys(s);
    i(null, u.map((e) => ({
      name: e,
      value: e,
      score: s[e],
      meta: 'local',
    })));
  };
}),
(function () {
  window.require(['ace/ext/language_tools'], () => {});
}());

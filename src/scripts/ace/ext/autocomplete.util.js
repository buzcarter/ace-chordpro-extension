define('ace/autocomplete/util', ['require', 'exports', 'module'], (e, t, n) => {
  t.parForEach = function (e, t, n) {
    let r = 0;
    const i = e.length;
    i === 0 && n();
    for (let s = 0; s < i; s++) {
      t(e[s], (e, t) => {
        r++, r === i && n(e, t);
      });
    }
  };
  const r = /[a-zA-Z_0-9\$-]/;
  t.retrievePrecedingIdentifier = function (e, t, n) {
    n = n || r;
    const i = [];
    for (let s = t - 1; s >= 0; s--) {
      if (!n.test(e[s])) break;
      i.push(e[s]);
    }
    return i.reverse().join('');
  }, t.retrieveFollowingIdentifier = function (e, t, n) {
    n = n || r;
    const i = [];
    for (let s = t; s < e.length; s++) {
      if (!n.test(e[s])) break;
      i.push(e[s]);
    }
    return i;
  };
})

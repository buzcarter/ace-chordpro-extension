(() => {
  let finder;

  function ChordFinder() {
    const re = /\[(.*?)\]/gi;

    // to play with IE we'll use an object instead of plain array
    const find = (text) => {
      const chords = {};
      const m = text.match(re);

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

    // public interface
    return {
      getChords,
    };
  }

  function getCompletions(editor, session, pos, prefix, callback) {
    if (!finder) {
      finder = new ChordFinder();
    }
    callback(null, finder.getChords(editor.getValue()));
  }

  window.ugsAce = Object.assign(window.ugsAce || {}, {
    ChordFinder,
    chordCompleter: {
      getCompletions,
    },
  });
})();

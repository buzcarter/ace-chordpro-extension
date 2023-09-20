(() => {
  const Ids = {
    EDITOR: 'aceEditor',
  };

  const Selectors = {
    EDITOR: `#${Ids.EDITOR}`,
    HAMBURGER_BTN: '#aceHeaderHamburgerBtn',
    HELP_WRAP: '#aceHelp',
    SOURCE: '#chordProSource',
  };

  const Styles = {
    OPEN: 'ugs-ace-help__wrap--open',
    EDITOR_HELP_VISIBLE: 'ugs-ace-editor--help-open',
  };

  let isHelpOpen = false;

  function showHelp() {
    isHelpOpen = !isHelpOpen;
    document
      .querySelector(Selectors.HELP_WRAP)
      .classList
      .toggle(Styles.OPEN, isHelpOpen);
    document
      .querySelector(Selectors.EDITOR)
      .classList
      .toggle(Styles.EDITOR_HELP_VISIBLE, isHelpOpen);
  }

  function initAce(songText) {
    const editor = window.ace.edit(Ids.EDITOR);
    editor.setTheme('ace/theme/idle_fingers');
    editor.session.setMode('ace/mode/chordpro');
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
    });
    editor.completers = [window.ugsAce.chordCompleter];
    editor.setValue(songText);
    editor.gotoLine(1);
  }

  function initHelp() {
    document.querySelector(Selectors.HELP_WRAP).innerHTML = window.ugsAce.helpHtml;
    document.querySelector(Selectors.HAMBURGER_BTN).addEventListener('click', showHelp);
  }

  function init() {
    const songText = document.querySelector(Selectors.SOURCE).value;
    initHelp();
    initAce(songText);
  }

  init();
})();

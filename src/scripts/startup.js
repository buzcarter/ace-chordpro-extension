(() => {
  const Selectors = {
    EDITOR: '#aceEditor',
    HAMBURGER_BTN: '#aceHeaderHamburgerBtn',
    HELP_WRAP: '#aceHelp',
    SOURCE: '#chordProSource',
  };

  const Styles = {
    OPEN: 'ugs-ace-help__wrap--open',
    EDITOR_HELP_VISIBLE: 'ugs-ace-editor--help-open',
  };

  let isHelpOpen = false;
  let editor = null;

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

  function showAce() {
    editor = window.ace.edit('aceEditor');
    editor.setTheme('ace/theme/idle_fingers');
    editor.getSession().setMode('ace/mode/chordpro');
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
    });
    editor.completers = [window.ugsAce.chordCompleter];
    copySongToAce();
  }

  function copySongToAce() {
    const songText = document.querySelector(Selectors.SOURCE).value;
    editor.setValue(songText);
    editor.gotoLine(1);
  }

  function init() {
    document.querySelector(Selectors.HELP_WRAP).innerHTML = window.ugsAce.helpHtml;
    document.querySelector(Selectors.HAMBURGER_BTN).addEventListener('click', showHelp);
    showAce();
  }

  init();
})();

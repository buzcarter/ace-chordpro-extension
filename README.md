# UkeGeeks Ace Editor ChordPro Language Extension

ChordPro song editing extension for the [Ace Editor](https://ace.c9.io/) (version 1.27.0).

Try the [Live Editor Demo](https://buzcarter.github.io/ace-chordpro-extension/editor.html) (includes Help tips)

For a basic setup look at [Live Minimal Editor](https://buzcarter.github.io/ace-chordpro-extension/basic.html)

**Important:** *This is early stages of updating the UkeGeek's Scriptasaurus Song Editor, as such,
this is an alpha test release: the final installation & usage is likely to change greatly.*

![ukegeeks-AceEditor-ChordPro-extension-screenshot](./docs/imgs/ukegeeks-AceEditor-ChordPro-extension-screenshot.png)

## Installation

Download the files and run locally:

```
git clone https://github.com/buzcarter/ace-chordpro-extension.git
```

Download the [project Zipped from GitHub](https://github.com/buzcarter/ace-chordpro-extension/archive/refs/heads/main.zip)

Use within another app:

```
npm install @ukegeeks/ace-chordpro-extension
```

## Demo

Load "editor.html" (includes help sidebar) in your browser.

Currently the `define` & `tab` statements auto-complete snippet defaults to four strings (for ukulele fans out there)

## Usage

Load "basic.html" (a barebones usage) in your browser.

```html
<pre id="songEditor" class="my-editor">
{title: The Tao of Lasso}

Boy, I [A7]love meeting [D7]people’s moms.
It’s like [B7]reading an [E7]instruction manual 
as to why they’re [G] nuts.
</pre>
<script src="{path to your installation}/dist/ace-chordpro.min.js"></script>
```

```js
const EDITOR_ID = 'my-editor';

// Let Ace know where it should inject itself on the page,
// it will grab the contents within this elemtn (`<pre/>`)
const editor = window.ace.edit(EDITOR_ID);

// choose a color scheme (see Ace prebuilts for dozens of choices)
editor.setTheme('ace/theme/idle_fingers');

// Now we tell Ace to treat our text as ChordPro
editor.session.setMode('ace/mode/chordpro');
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
});
```

## License

This library is licensed under [GNU General Public License](http://www.gnu.org/licenses/gpl.html).

Use it, change it, fork it, but please leave the author attribution.

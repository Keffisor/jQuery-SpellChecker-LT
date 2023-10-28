[![Commit Activity](https://img.shields.io/github/commit-activity/m/Keffisor/JDAExpansion)](https://github.com/Keffisor/JDAExpansion/commits/master)
<br>
# JQuery-SpellChecker-LT
**JQuery-SpellChecker-LT** - Add a SpellChecker integration to any editor using LanguageTool's API.

## Demo
<img src="https://keffisor21.com/github/jquery-spellchecker-lt/imgs/preview.gif"/>
<img src="https://keffisor21.com/github/jquery-spellchecker-lt/imgs/1.png"/>
<img src="https://keffisor21.com/github/jquery-spellchecker-lt/imgs/2.png"/>
<img src="https://keffisor21.com/github/jquery-spellchecker-lt/imgs/3.png"/>
<p>You can try in the live demo at https://keffisor21.com/github/jquery-spellchecker-lt/.</p>

## Usage

You can just init the spellchecker with the default configuration using jQuery.
```
$('#documentEditor').spellchecker();
```

### Custom Options

You can provide custom options to the spellchecker.
```
$('#documentEditor').spellchecker({
  endpoint_url: "https://api.languagetool.org/v2/check",
  request_cooldown: 6.2
});
```

<b>Options available:<b>
- ```endpoint_url```: The URL where will connect to retrieve the spell check. This is ideal for set a custom languagetool server endpoint.
- ```request_cooldown```: Change the wait time when the user start's typing to connect into the endpoint.


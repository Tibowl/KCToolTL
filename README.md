# Deckbuilder translator
![Example](https://i.imgur.com/xoZcP4w.png)

## Bookmarklet
Add the following code as a bookmark:
```js
javascript:$.get("https://raw.githubusercontent.com/Tibowl/DeckbuilderTL/master/Inject.js?v="+new Date().getTime(), eval)
```

Alternative (Could potentionally work on other sites):
```js
javascript:var $TL=new XMLHttpRequest;$TL.open("GET","https://raw.githubusercontent.com/Tibowl/DeckbuilderTL/master/Inject.js?v="+new Date().getTime());$TL.onreadystatechange=()=>eval($TL.responseText);$TL.send();
```

![Bookmarklet install](https://i.imgur.com/NQkuAmb.png)
### Usage:
Click on the bookmark to inject the translator.

## Usage (without bookmarklet):
1. Go to [Deckbuilder](http://kancolle-calc.net/deckbuilder.html)
2. Open development console (Press F12 and go to console tab)
3. Execute the following script:

```js
$.get("https://raw.githubusercontent.com/Tibowl/DeckbuilderTL/master/Inject.js?v="+new Date().getTime(), eval)
```

Alternative:
```js
var $TL=new XMLHttpRequest;
$TL.open("GET","https://raw.githubusercontent.com/Tibowl/DeckbuilderTL/master/Inject.js?v="+new Date().getTime());
$TL.onreadystatechange = () => eval($TL.responseText);
$TL.send();
```

## Site support
### Supported sites:
- http://kancolle-calc.net/deckbuilder.html
- https://db.kcwiki.org/drop/

### Todo/WIP
- https://noro6.github.io/kcTools/
- https://dque.github.io/seiku/
- http://kancollecalc.jp/air_supremacy.html?
- https://kcjervis.github.io/jervis/#/
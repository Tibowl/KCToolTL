var transList = {}, updateCount = 0;
function translate() {
    walk(document.body);
    setTimeout(translate, 50);
}
function walk(node) {
    var child, next;
    switch (node.nodeType) {
    case 1: // Element
    case 9: // Document
    case 11: // Document fragment
        child = node.firstChild;
        while (child) {
            next = child.nextSibling;
            walk(child);
            handleTitle(child);
            child = next;
        }
        break;
    case 3: // Text node
        if (node.parentElement.tagName.toLowerCase() != "script")
            handleText(node);
        break;
    }
}
function handleText(textNode) {
    if(textNode.isHandeled != updateCount) {
        let v = translateText(textNode.nodeValue)
        if(textNode.nodeValue !== v)
            textNode.nodeValue = v;
        textNode.isHandeled = updateCount;
    }
}
function handleTitle(titleNode) {
    if(titleNode.isHandeled != updateCount && titleNode.title) {
        let v = translateText(titleNode.title)
        if(titleNode.title !== v)
            titleNode.title = v;
        titleNode.isHandeled = updateCount;
    }
}
function translateText(v) {
    let prevProp = [""];
    for (var prop of Object.keys(transList).sort((a,b) => b.length - a.length)) {
        var strippedV = v;
        for (var i = 0; i < prevProp.length; i++) 
            strippedV = strippedV.replace(prevProp[i], "");
        if (/*transList.hasOwnProperty(prop) && v.includes(prop) && */ !v.split(prop)[0].match(/ \($/) && strippedV.includes(prop)) {
            v = v.replace(prop, transList[prop])
            prevProp.push(prop);
        }
    }
    return v;
}
function download(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
            if(callback)
                callback(JSON.parse(xmlhttp.responseText));

            let newData = JSON.parse(xmlhttp.responseText);
            Object.keys(newData).forEach((k) => transList[k] = newData[k]);
            if(!updateCount)
                translate();
            updateCount++;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

download('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/items.json', (data) => window.gItems && gItems.forEach((a) => a.name = data[a.name]||a.name));
download('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/ships.json', (data) => window.gShips && gShips.forEach((a) => Object.keys(data).sort((a,b) => b.length - a.length).forEach((b) => a.name = a.name.replace(b, data[b]))));
download('https://raw.githubusercontent.com/Tibo442/DeckbuilderTL/master/Translations.json?v='+new Date().getTime());
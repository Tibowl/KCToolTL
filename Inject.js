let transList = {},
    downloadCount = 0,
    sorted = []

const printTime = false
function translate() {
    const start = new Date().getTime()
    walk(document.body)
    const end = new Date().getTime()

    if(printTime)
        console.log("Time:", end - start)

    setTimeout(translate, 100)
}

function walk(node) {
    let child, next
    switch (node.nodeType) {
        case 1: // Element
        case 9: // Document
        case 11: // Document fragment
            child = node.firstChild
            while (child) {
                next = child.nextSibling
                walk(child)
                if (child.lastHandled !== downloadCount) {
                    handle(child, "title")
                    handle(child, "label")
                    child.lastHandled = downloadCount
                }
                child = next
            }
            break
        case 3: // Text node
            if (node.parentElement.tagName.toLowerCase() !== "script")
                if (node.lastHandled !== downloadCount) {
                    handle(node, "nodeValue")
                    node.lastHandled = downloadCount
                }
            break
    }
}

function handle(node, key) {
    if (node[key]) {
        const v = translateText(node[key])
        if (node[key] !== v)
            node[key] = v
    }
}

function translateText(line) {
    let stripped = line // Prevents recursive TLs
    for (let entry of sorted)
        if (entry.regex.test(stripped)) {
            line = line.replace(entry.regex, entry.translated)
            stripped = stripped.replace(entry.regex, "")
        }
    return line
}

function download(url, escape, callback) {
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
            const newData = JSON.parse(xmlhttp.responseText)
            if (callback)
                callback(newData)
            addData(newData, escape)
            if (downloadCount == 2)
                translate()
            downloadCount++
        }
    }
    xmlhttp.open("GET", url, true)
    xmlhttp.send()

}

function addData(newData, escape) {
    Object.entries(newData).forEach((k) => transList[escape ? escapeRegExp(k[0]) : k[0]] = k[1])
    sorted = Object.keys(transList)
        .sort((a, b) => b.length - a.length)
        .map(key => {
            const regex = new RegExp(key)
            regex.global = true
            return {
                regex,
                translated: transList[key]
            }
        })
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

download('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/items.json', true, (data) => window.gItems && gItems.forEach((a) => a.name = data[a.name] || a.name))
download('https://raw.githubusercontent.com/KC3Kai/kc3-translations/master/data/en/ships.json', true, (data) => window.gShips && gShips.forEach((a) => Object.keys(data).sort((a, b) => b.length - a.length).forEach((b) => a.name = a.name.replace(b, data[b]))))
download('https://raw.githubusercontent.com/Tibowl/KCToolTL/master/Translations.json?v=' + new Date().getTime(), false)
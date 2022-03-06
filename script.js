// some code stolen/inspired by flamemasternxf's the grind

function player() {
    return {
        points: new Decimal(0),
        gain: [new Decimal(Math.random), new Decimal(1), new Decimal(2), new Decimal(0)], // [0] determines whether we get [1] or [2] points
    }
}

let data = player()

function update() {
    if(data.gain[0].gte(0.5)) data.gain[3] = data.gain[2]
    else if(data.gain[0].lt(0.5)) data.gain[3] = data.gain[1]
    data.points = data.points.add(data.gain[3])

    if(document.getElementById("points")) document.getElementById("points")?.innerHTML = data.points.toStringWithDecimalPlaces(4)
    if(document.getElementById("min")) document.getElementById("min")?.innerHTML = data.gain[1].toStringWithDecimalPlaces(4)
    if(document.getElementById("max")) document.getElementById("max")?.innerHTML = data.gain[2].toStringWithDecimalPlaces(4)
}

setInterval(update(), 1000)

function save() {
    window.localStorage.setItem('this-is-rng', JSON.stringify(data))
}

function load() {
    let save = JSON.parse(window.localStorage.getItem('this-is-rng'))
    if(save !== undefined) fixSave(data, save)
}

function fixSave(main=player(), data) {
    if(typeof data === "object") {
        Object.keys(data).forEach(i => {
            if(main[i] instanceof Decimal) {
                main[i] = new Decimal(data[i]!==null?data[i]:main[i])
            } else if(typeof main[i] == "object") {
                fixSave(main[i], data[i])
            } else {
                main[i] = data[i]
            }
        })
        return main
    }
    else return player()
}

function fixOldSaves() {
    // fix important things from old versions
}

function exportSave() {
    save()
    let exportedData = btoa(JSON.stringify(data));
    let exportedDataText = document.createElement("textarea");
    exportedDataText.value = exportedData;
    document.body.appendChild(exportedDataText);
    exportedDataText.select();
    exportedDataText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(exportedDataText);
}

function importSave() {
    let importedData = prompt("Paste your save here!")
    data = Object.assign(player(), JSON.parse(atob(importedData)))
    save()
    location.reload()
}

window.setInterval(function() {
    save()
}, 1000);

window.onload = function() {
    load()
    fixOldSaves()
}

function fullReset() {
    exportSave()
    deleteSave()
    location.reload()
}

function deleteSave() {
    window.localStorage.removeItem('this-is-rng')
}
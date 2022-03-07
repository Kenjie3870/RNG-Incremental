// some code stolen/inspired by flamemasternxf's the grind

function player() {
    return {
        points: new Decimal(0),
        gain: [new Decimal(Math.random()), new Decimal(1), new Decimal(2), new Decimal(0)], // [0] determines whether we get [1] or [2] points
        upgrades: [[new Decimal(0), new Decimal(5e1), new Decimal(1), new Decimal(2)], 
                   [new Decimal(0), new Decimal(1.5e3), new Decimal(1), new Decimal(0.5)]] // outermost array displays upgrades, inner array displays amount, cost, effect, and effect base
    }
}

let data = player()

function update() {
    if(data.gain[0].gte(0.7)) data.gain[3] = data.gain[2]
    else if(data.gain[0].lt(0.7)) data.gain[3] = data.gain[1]
    data.points = data.points.add(data.gain[3])
    data.gain[0] = new Decimal(Math.random())

    if(data.upgrades[0][0].gte(1)) {data.gain[1] = data.upgrades[0][2], data.gain[2] = new Decimal(2).mul(data.upgrades[0][2])}
    if(data.upgrades[1][0].gte(1)) {data.upgrades[0][3] = new Decimal(2).add(data.upgrades[1][2])}

    if(document.getElementById("loading")) document.getElementById("loading").innerHTML = ""

    if(document.getElementById("points")) document.getElementById("points").innerHTML = data.points.toStringWithDecimalPlaces(2)
    if(document.getElementById("min")) document.getElementById("min").innerHTML = data.gain[1].toStringWithDecimalPlaces(2)
    if(document.getElementById("max")) document.getElementById("max").innerHTML = data.gain[2].toStringWithDecimalPlaces(2)

    if(document.getElementById("a1-amnt")) document.getElementById("a1-amnt").innerHTML = data.upgrades[0][0].toStringWithDecimalPlaces(2)
    if(document.getElementById("a1-cost")) document.getElementById("a1-cost").innerHTML = data.upgrades[0][1].toStringWithDecimalPlaces(2)+" points"
    if(document.getElementById("a1-efft")) document.getElementById("a1-efft").innerHTML = "x"+data.upgrades[0][2].toStringWithDecimalPlaces(2)
    if(document.getElementById("a1-base")) document.getElementById("a1-base").innerHTML = data.upgrades[0][3].toStringWithDecimalPlaces(2)

    if(document.getElementById("a2-amnt")) document.getElementById("a2-amnt").innerHTML = data.upgrades[1][0].toStringWithDecimalPlaces(2)
    if(document.getElementById("a2-cost")) document.getElementById("a2-cost").innerHTML = data.upgrades[1][1].toStringWithDecimalPlaces(2)+" points"
    if(document.getElementById("a2-efft")) document.getElementById("a2-efft").innerHTML = "+"+data.upgrades[1][2].toStringWithDecimalPlaces(2)+", +"+data.upgrades[1][2].mul(0.8).toStringWithDecimalPlaces(2)
    if(document.getElementById("a2-base")) document.getElementById("a2-base").innerHTML = data.upgrades[1][3].toStringWithDecimalPlaces(2)
}

function buyUpgradeA1() {
    if(data.points.gte(data.upgrades[0][1])) {
        data.points = data.points.sub(data.upgrades[0][1])
        data.upgrades[0][0] = data.upgrades[0][0].add(1)
        data.upgrades[0][1] = new Decimal(data.upgrades[1][0].gte(1) ? new Decimal(3).add(data.upgrades[1][2].mul(0.8)) : 3).pow(data.upgrades[0][0]).mul(5e1)
        data.upgrades[0][2] = data.upgrades[0][3].pow(data.upgrades[0][0])

        data.gain[1] = data.upgrades[0][2]
        data.gain[2] = new Decimal(2).mul(data.upgrades[0][2])
    }
    else {
        data.upgrades[0][1] = new Decimal(data.upgrades[1][0].gte(1) ? new Decimal(3).add(data.upgrades[1][2].mul(0.8)) : 3).pow(data.upgrades[0][0]).mul(5e1)
        data.upgrades[0][2] = data.upgrades[0][3].pow(data.upgrades[0][0])
    }
}

function buyUpgradeA2() {
    if(data.points.gte(data.upgrades[1][1])) {
        data.points = data.points.sub(data.upgrades[1][1])
        data.upgrades[1][0] = data.upgrades[1][0].add(1)
        data.upgrades[1][1] = new Decimal(10).pow(data.upgrades[1][0]).mul(1.5e3)
        data.upgrades[1][2] = data.upgrades[1][3].mul(data.upgrades[1][0])

        data.upgrades[0][1] = new Decimal(data.upgrades[1][0].gte(1) ? new Decimal(3).add(data.upgrades[1][2].mul(0.8)) : 3).pow(data.upgrades[0][0]).mul(5e1)
        data.upgrades[0][2] = data.upgrades[0][3].pow(data.upgrades[0][0])
        data.upgrades[0][3] = new Decimal(2).add(data.upgrades[1][2])
        data.gain[1] = data.upgrades[0][2]
        data.gain[2] = new Decimal(2).mul(data.upgrades[0][2])
    }
    else {
        data.upgrades[0][1] = new Decimal(data.upgrades[1][0].gte(1) ? new Decimal(3).add(data.upgrades[1][2].mul(0.8)) : 3).pow(data.upgrades[0][0]).mul(5e1)
        data.upgrades[0][2] = data.upgrades[0][3].pow(data.upgrades[0][0])
        data.upgrades[0][3] = new Decimal(2).add(data.upgrades[1][2])
        data.upgrades[1][1] = new Decimal(10).pow(data.upgrades[1][0]).mul(1.5e3)
        data.upgrades[1][2] = data.upgrades[1][3].mul(data.upgrades[1][0])
    }
}

setInterval(update, 1000)

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
}, 2500);

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
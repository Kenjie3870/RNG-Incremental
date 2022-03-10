// some code stolen/inspired by flamemasternxf's the grind

function player() {
    return {
        points: new Decimal("0"),
        gain: {determine: new Decimal(Math.random()), min: new Decimal(1), max: new Decimal(2), final: new Decimal(0)},
        time: 0,
        a1: {amount: new Decimal(0), cost: new Decimal(10), scaling: new Decimal(1), effect: new Decimal(0), base: new Decimal(1)},
        a2: {amount: new Decimal(0), cost: new Decimal(100), scaling: new Decimal(1.2), effect: new Decimal(0), base: new Decimal(0.1)},
        a3: {amount: new Decimal(0), cost: new Decimal(500), scaling: new Decimal(1.05), effect: new Decimal(1), base: new Decimal(0.15)}
    }
}

const data = player()

function update() {
    if(data.gain.determine.gte(0.6)) data.gain.final = data.gain.max
    else if(data.gain.determine.lt(0.6)) data.gain.final = data.gain.min
    data.points = data.points.add(data.gain.final)
    data.gain.determine = new Decimal(Math.random())

    if(data.a1.amount.gte(1)) data.gain.max = new Decimal(2).add(data.a1.effect).mul(data.a3.amount.gte(1) ? data.a3.effect : new Decimal(1))
    data.gain.min = data.a3.amount.gte(1) ? data.a3.effect : new Decimal(1)
    if(data.a2.amount.gte(1)) data.a1.base = new Decimal(1).add(data.a2.effect)

    data.time++
}

function updateUI() {
    if(document.getElementById("loading")) document.getElementById("loading").style.display = "none"

    if(document.getElementById("points")) document.getElementById("points").innerHTML = `You have ${format(data.points)} points.`
    if(document.getElementById("pointsGain")) document.getElementById("pointsGain").innerHTML = `You get either ${format(data.gain.min)} or ${format(data.gain.max)} every second.`
    if(document.getElementById("timePlayed")) document.getElementById("timePlayed").innerHTML = `You've spent ${data.time} seconds playing this game.`

    if(document.getElementById("a1-base")) document.getElementById("a1-base").innerHTML = `Add ${format(data.a1.base)} to the second gain.`
    if(document.getElementById("a1-effect")) document.getElementById("a1-effect").innerHTML = `You've bought ${format(data.a1.amount)} of these, adding ${format(data.a1.effect)} to the second gain. You need ${format(data.a1.cost)} to buy this again.`
    if(document.getElementById("a2-base")) document.getElementById("a2-base").innerHTML = `Increase A1's base by ${format(data.a2.base)}.`
    if(document.getElementById("a2-effect")) document.getElementById("a2-effect").innerHTML = `You've bought ${format(data.a2.amount)} of these, increasing A1's base by ${format(data.a2.effect)}. You need ${format(data.a2.cost)} to buy this again.`
    if(document.getElementById("a3-base")) document.getElementById("a3-base").innerHTML = `Multiply both gains by ${format(data.a3.base)}.`
    if(document.getElementById("a3-effect")) document.getElementById("a3-effect").innerHTML = `You've bought ${format(data.a3.amount)} of these, multiplying both gains by ${format(data.a3.effect)}. You need ${format(data.a3.cost)} to buy this again.`

    if(document.getElementById("a2")) document.getElementById("a2").style.display = data.a1.amount.gte(6) ? "block" : "none"
    if(document.getElementById("a3")) document.getElementById("a3").style.display = data.a2.amount.gte(4) ? "block" : "none"
}

function buyA1() {
    let upg = data.a1
    let points = data.points
    let gain = data.gain

    if(points.gte(upg.cost)) {
        data.points = data.points.sub(upg.cost)
        upg.amount = upg.amount.add(1)
    }
    upg.scaling = upg.amount.div(10).add(1)
    upg.cost = upg.scaling.pow(upg.amount).mul(10)
    upg.effect = upg.base.mul(upg.amount)
    gain.max = new Decimal(2).add(upg.effect).mul(data.a3.amount.gte(1) ? data.a3.effect : new Decimal(1))
    gain.min = data.a3.amount.gte(1) ? data.a3.effect : new Decimal(1)
}

function buyA2() {
    let upg = data.a2
    let affupg = data.a1
    let points = data.points
    let gain = data.gain

    if(points.gte(upg.cost)) {
        data.points = data.points.sub(upg.cost)
        upg.amount = upg.amount.add(1)
    }
    upg.scaling = upg.amount.div(9).add(1)
    upg.cost = upg.scaling.pow(upg.amount).mul(100)
    upg.effect = upg.base.mul(upg.amount)
    gain.max = new Decimal(2).add(upg.effect).mul(data.a3.amount.gte(1) ? data.a3.effect : new Decimal(1))
    gain.min = data.a3.amount.gte(1) ? data.a3.effect : new Decimal(1)

    affupg.base = new Decimal(1).add(upg.effect)
    affupg.effect = affupg.base.mul(affupg.amount)
}

function buyA3() {
    let upg = data.a3
    let points = data.points
    let gain = data.gain

    if(points.gte(upg.cost)) {
        data.points = data.points.sub(upg.cost)
        upg.amount = upg.amount.add(1)
    }
    upg.scaling = upg.amount.div(15).add(1)
    upg.cost = upg.scaling.pow(upg.amount).mul(500)
    upg.effect = upg.base.mul(upg.amount).add(1)
    gain.max = new Decimal(2).add(upg.effect).mul(upg.effect)
    gain.min = upg.effect
}

setInterval(update, 1000)
setInterval(updateUI, 10)

function save() {
    window.localStorage.setItem('this-is-rng', JSON.stringify(data))
}

function load() {
    let save = JSON.parse(window.localStorage.getItem('this-is-rng'))
    if(save !== undefined) fixSave(data, save)
    updateUI()
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
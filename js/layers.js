addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#A61384",
    requires(){
        gain = new Decimal(1)
        gain = 5
        if (hasUpgrade('p', 14)) (gain -= upgradeEffect('p', 14))
        if (hasUpgrade('p', 31)) (gain -= tmp[this.layer].upgrades[31].effect.first)
        return gain
    }, // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "bao", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("p", 13)) {mult = mult.times(tmp['p'].upgrades[13].effect.first)}
        if (hasUpgrade('p', 21)) mult = mult.times(upgradeEffect('p', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "You gonna start somewhere",
            description() {
                return "Each upgrade in this row increases bao gain"
            },
            cost: new Decimal(1),
            effect(){
                let gainAdd = 0, gainBase = 1
                if (hasUpgrade("p", 23)) {gainBase += tmp[this.layer].upgrades[23].effect.second}
                if (hasUpgrade("p", 32)) {gainBase += tmp[this.layer].upgrades[32].effect.second}
                gainBase += buyableEffect('p', 12) //buyable p, 12 boost gainbase
                if (hasUpgrade("p", 11)) {gainAdd += gainBase}
                if (hasUpgrade("p", 12)) {gainAdd += gainBase}
                if (hasUpgrade("p", 13)) {gainAdd += gainBase}
                if (hasUpgrade("p", 14)) {gainAdd += gainBase}
                if (hasUpgrade("p", 15)) {gainAdd += gainBase}
                if (hasUpgrade("p", 12)) {gainAdd *= upgradeEffect("p", 12)}
                {gainAdd *= buyableEffect("p", 13)} //buyable p, 13
                if (hasUpgrade("p", 13)) {gainAdd *= tmp[this.layer].upgrades[13].effect.second}
                if (hasUpgrade("p", 32)) {gainAdd *= tmp[this.layer].upgrades[32].effect.first}
                return gainAdd
            },
            effectDisplay() { return "+" + format(this.effect()) }
        },
        12: {
            title: "2 is more than 1",
            description: "Multiplies previous effect by 2",
            cost: new Decimal(6),
            effect(){
                return 2;
            } 
        },
        13: {
            title: "Triplet",
            description: "+15% prestige point gain, x1.5 effect of (1, 1)",
            cost: new Decimal(18),
            effect(){
                let mult = {}
                mult.first = 1.15
                mult.second = 1.5
                return mult;
            } 
        },
        14: {
            title: "Quadcicle",
            description: "-1 base bao requirement to prestige points",
            cost: new Decimal(30),
            effect(){
                return 1
            } 
        },
        15: {
            title: "Rolling Rampage",
            description: "x2.5 bao gain and unlock a first buyable",
            cost: new Decimal(50),
            effect(){
                let eff = 2.5
                if (hasUpgrade('p', 44)) {eff += upgradeEffect('p', 44)}
                return eff
            } 
        },
        21: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5) {return true}
                else {return false}
            },
            title: "Hexagon",
            description: "Each upgrade in this row additively increases prestige point gain",
            cost: new Decimal(100),
            effect(){
                let gainAdd = 1, gainBase = 0.08
                if (hasUpgrade("p", 31)) {gainBase *= tmp[this.layer].upgrades[31].effect.second}
                if (hasUpgrade("p", 21)) {gainAdd += gainBase}
                if (hasUpgrade("p", 22)) {gainAdd += gainBase}
                if (hasUpgrade("p", 23)) {gainAdd += gainBase}
                if (hasUpgrade("p", 24)) {gainAdd += gainBase}
                if (hasUpgrade("p", 25)) {gainAdd += gainBase}
                {gainAdd *= buyableEffect("p", 13)} //buyable p, 13
                return gainAdd
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        22: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5) {return true}
                else {return false}
            },
            title: "Hept-up",
            description: "Bao gain is increased based on current bao",
            cost: new Decimal(150),
            effect(){
                let gainbase, scale = 10
                if (hasUpgrade('p', 44)) {scale -= upgradeEffect('p', 44)}
                if((Math.log(player.points) / Math.log(scale)) <= 1) {gainbase = 1}
                else {gainbase = Math.log(player.points) / Math.log(scale)}
                return gainbase
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        23: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5) {return true}
                else {return false}
            },
            title: "Fight in octagon",
            description: "+0.01 buyable base, +2 base of (1,1)",
            cost: new Decimal(250),
            effect(){
                let mult = {}
                mult.first = 0.01
                mult.second = 2
                return mult;
            },
        },
        24: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5) {return true}
                else {return false}
            },
            title: "Leon Kirilin",
            description(){
                if(hasUpgrade('p', 33) == 0) {return "x2 bao gain under 1000 bao, x3 - above 1000"}
                else {return "x6 bao gain"}
            },
            cost: new Decimal(350),
            effect(){
                let mult = 3
                if (hasUpgrade('p', 33)) {mult *= upgradeEffect('p', 33)}
                if (hasUpgrade('p', 44)) {mult += upgradeEffect('p', 44)}
                if(player.points <= 1000 && hasUpgrade('p', 33 == 0)) {return mult.sub(1)}
                else {return mult}
            },
        },
        25: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5) {return true}
                else {return false}
            },
            title: "Ten eSportsmen",
            description: "x3.22 bao gain and unlock a new buyable",
            cost: new Decimal(500),
            effect(){
                let eff = 3.22
                if (hasUpgrade('p', 44)) {eff += upgradeEffect('p', 44)}
                return eff;
            },
        },
        31: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5) {return true}
                else {return false}
            },
            title: "Experiment 011",
            description: "Each upgrade in this row reduces bao requirement by 0.2. Also x2.5 (2,1) base",
            cost: new Decimal(100000),
            effect(){
                let eff = {} 
                eff.first = 0
                if (hasUpgrade('p', 31)) {eff.first += 0.2}
                if (hasUpgrade('p', 32)) {eff.first += 0.2}
                if (hasUpgrade('p', 33)) {eff.first += 0.2}
                if (hasUpgrade('p', 34)) {eff.first += 0.2}
                if (hasUpgrade('p', 35)) {eff.first += 0.2}
                eff.second = 2.5
                return eff;
            },
            effectDisplay() { return "-" + format(tmp[this.layer].upgrades[31].effect.first) }
        },
        32: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5) {return true}
                else {return false}
            },
            title: "'The Twelve' - Aleksandr Blok",
            description: "x1.5 (1,1) effect, Increases (1,1) base based on prestige points",
            cost: new Decimal(5e5),
            effect(){
                let eff = {}
                eff.first = 1.5
                if((Math.log(player[this.layer].points) / Math.log(5)) <= 1) {eff.second = 1}
                else {eff.second = Math.log(player[this.layer].points) / Math.log(2)}
                return eff;
            },
            effectDisplay() { return format(tmp[this.layer].upgrades[32].effect.second) }
        },
        33: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5) {return true}
                else {return false}
            },
            title: "Unknown thirteenth",
            description: "x2 (2,4) multiplier, (2,4) no longer depends on current bao",
            cost: new Decimal(1.5e6),
            effect(){
                let eff
                eff = 2
                return eff;
            },
        },
        34: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5) {return true}
                else {return false}
            },
            title: "Prestige tr14l",
            description: "+0.01 first buyable base, x0.85 second buyable cost",
            cost: new Decimal(2.5e6),
            effect(){
                let eff = {}
                eff.first = 0.01
                eff.second = 0.85
                return eff;
            },
        },
        35: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5) {return true}
                else {return false}
            },
            title: "F15herman",
            description: "+50 max level of buyables and unlock third buyable",
            cost: new Decimal(3e6),
            effect(){
                return 50;
            },
        },
        41: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5) {return true}
                else {return false}
            },
            title: "x = 16",
            description: "Each upgrade in this row increases max buyables level by 10",
            cost: new Decimal(1e8),
            effect(){
                return 10;
            },
        },
        42: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5) {return true}
                else {return false}
            },
            title: "Chance of applying - 17%",
            description: "Double third buyable effect, second buyable scales 40% better",
            cost: new Decimal(2.5e8),
            effect(){
                let eff = {}
                eff.first = 2
                eff.second = 0.1
                return eff;
            },
        },
        43: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5) {return true}
                else {return false}
            },
            title: "18 causes to rob the bank",
            description: "^1.18 bao gain",
            cost: new Decimal(1e9),
            effect(){
                return 1.18;
            },
        },
        44: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5) {return true}
                else {return false}
            },
            title: "19? Yes",
            description: "+1 to bao gain multiplier in prestige upgrades, (2,2) scales better",
            cost: new Decimal(1e11),
            effect(){
                return 1;
            },
        },
        45: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5) {return true}
                else {return false}
            },
            title: "DLC is 20$",
            description: "Unlocks new layer (WIP)",
            cost: new Decimal(5e11),
            effect(){
                return 1;
            },
        },
    },
    buyables: {
        11: {
            unlocked(){ 
                if (hasUpgrade('p', 15) == 1) {return true}
                else {return false}
            },
            title: "Lost opportunities", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = new Decimal(20 * Math.pow(1.1, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                gainBase = 1.1
                if (hasUpgrade("p", 23)) {gainBase += tmp[this.layer].upgrades[23].effect.first}
                if (hasUpgrade("p", 34)) {gainBase += tmp[this.layer].upgrades[34].effect.first}
                return Decimal.pow(gainBase, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " prestige points\n\
                Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
                Bao gain x" + format(data.effect) + "\n\
                5th buyable unlocks second row of upgrades"
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit(){
                let gain = 100
                if (hasUpgrade('p', 35)) {gain += upgradeEffect('p', 35)}
                if (hasUpgrade('p', 41)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 42)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 43)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 44)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 45)) {gain += upgradeEffect('p', 41)}
                return gain
            },
        },
        12: {
            unlocked(){ 
                if (hasUpgrade('p', 25) == 1) {return true}
                else {return false}
            },
            title: "Practice makes perfect", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let baseCost = 250
                if (hasUpgrade("p", 34)) {gainBase *= tmp[this.layer].upgrades[34].effect.second}
                let cost = new Decimal(baseCost * Math.pow(1.15, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff, coeff1 = 1.25
                if (hasUpgrade('p', 42)) {coeff1 += tmp["p"].upgrades[42].effect.second}
                eff = Math.pow(0.5 * x, coeff1) + 1 * x
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " prestige points\n\
                Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
                +" + format(data.effect) + " (1,1) base\n\
                5th buyable unlocks third row of upgrades"
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit(){
                gain = 100
                if (hasUpgrade('p', 35)) {gain += upgradeEffect('p', 35)}
                if (hasUpgrade('p', 41)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 42)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 43)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 44)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 45)) {gain += upgradeEffect('p', 41)}
                return gain
            },
        },
        13: {
            unlocked(){ 
                if (hasUpgrade('p', 35) == 1) {return true}
                else {return false}
            },
            title: "Find out your hidden bao", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let baseCost = 1e7
                let cost = new Decimal(baseCost * Math.pow(1.25, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                let eff, coeff1 = 1
                if (hasUpgrade('p', 42)) {coeff1 *= tmp["p"].upgrades[42].effect.first}
                eff = 1 + (0.01 * coeff1 * x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " prestige points\n\
                Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
                +" + format((data.effect - 1) * 100) + "% to (1,1) and (2,1) effects\n\
                5th buyable unlocks fourth row of upgrades"
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
            },
            purchaseLimit(){
                gain = 100
                if (hasUpgrade('p', 35)) {gain += upgradeEffect('p', 35)}
                if (hasUpgrade('p', 41)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 42)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 43)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 44)) {gain += upgradeEffect('p', 41)}
                if (hasUpgrade('p', 45)) {gain += upgradeEffect('p', 41)}
                return gain
            },
        },
    },
})

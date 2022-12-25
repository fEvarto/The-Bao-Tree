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
        let gain = new Decimal(5)
        if (hasUpgrade('p', 14)) (gain -= tmp[this.layer].upgrades[14].effect.first)
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
        if (hasUpgrade("j", 11)) {mult = mult.times(tmp['j'].upgrades[11].effect.first)}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){
        let perc = 0.05 * player['j'].points
        if (hasMilestone('j', 3)){return perc}
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
                if (!inChallenge('j', 11)){
                let gainAdd = 0, gainBase = 1
                if (hasUpgrade("p", 14)) {gainBase += tmp[this.layer].upgrades[14].effect.second}
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
                }
                else {return 1}
            },
            effectDisplay() { return "+" + format(this.effect()) }
        },
        12: {
            title: "2 is more than 1",
            description: "Multiplies previous effect",
            cost: new Decimal(6),
            effect(){
                let eff = 2, max = 20, current = player['j'].points
                if (current >= max) {current = max}
                if (hasMilestone('j', 7)){eff = 2 * Math.pow(1.5, current)}
                return eff;
            },
            effectDisplay(){
                return "x" + format(this.effect())
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
            description: "-1 base bao requirement to prestige points, +0.25 to (1,1) base",
            cost: new Decimal(30),
            effect(){
                let mult = {}
                mult.first = 1
                mult.second = 0.25
                return mult;
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
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 5)) {return true}
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
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "Hept-up",
            description: "Bao gain is increased based on current bao",
            cost: new Decimal(150),
            effect(){
                let gainbase, scale = 10
                if((Math.log(player.points) / Math.log(scale)) <= 1) {gainbase = 1}
                else {gainbase = Math.log(player.points) / Math.log(scale)}
                return gainbase
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        23: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "Fight in octagon",
            description: "+0.01 buyable base, +1.5 base of (1,1)",
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
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "Leon Kirilin",
            description(){
                if(hasUpgrade('p', 33) == 0) {return "x2 bao gain under 1000 bao, x3 - above 1000"}
                else {return "x6 bao gain"}
            },
            cost: new Decimal(350),
            effect(){
                let mult = new Decimal(3)
                if (hasUpgrade('p', 33)) {mult *= upgradeEffect('p', 33)}
                if (hasUpgrade('p', 44)) {mult += upgradeEffect('p', 44)}
                if (player.points <= 1000 && !hasUpgrade('p', 33)) {return mult.sub(1)}
                else {return mult}
            },
        },
        25: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "Ten eSportsmen",
            description: "x3.22 bao gain and unlock a new buyable",
            cost: new Decimal(500),
            effect(){
                let eff = 3.22
                return eff;
            },
        },
        31: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 5)) {return true}
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
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "The Twentieth Slave",
            description: "x1.5 (1,1) effect, Increases (1,1) base based on prestige points",
            cost: new Decimal(5e5),
            effect(){
                let eff = {}
                eff.first = 1.5
                if((Math.log(player[this.layer].points) / Math.log(5)) <= 1) {eff.second = 1}
                else {
                    let max = 2 * challengeCompletions('j', 11);
                    if (player['j'].points < max) {eff.second = (Math.log(player[this.layer].points) / Math.log(2)) * Math.pow(2, player['j'].points)}
                    else {eff.second = (Math.log(player[this.layer].points) / Math.log(2)) * Math.pow(2, max)}
                }
                return eff;
            },
            effectDisplay() { return "+" + format(tmp[this.layer].upgrades[32].effect.second) }
        },
        33: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 5)) {return true}
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
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 5)) {return true}
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
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 5)) {return true}
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
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "x = 16",
            description: "Each upgrade in this row increases max buyables level by 10",
            cost: new Decimal(1e8),
            effect(){
                let eff = 10
                if (hasUpgrade('p', 42)) {eff += 10}
                if (hasUpgrade('p', 43)) {eff += 10}
                if (hasUpgrade('p', 44)) {eff += 10}
                if (hasUpgrade('p', 45)) {eff += 10}
                return eff;
            },
        },
        42: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "Chance of applying - 17%",
            description: "x1.5 third buyable effect, second buyable scales 50% better",
            cost: new Decimal(2.5e8),
            effect(){
                let eff = {}
                eff.first = 1.5
                eff.second = 0.15
                return eff;
            },
        },
        43: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 5)) {return true}
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
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "19? Yes",
            description: "Increases bao gain multiplier in prestige upgrades",
            cost: new Decimal(1e11),
            effect(){
                if (!hasUpgrade('j',15)){return 2;}
                else {return 2 + (upgradeEffect('j',15) * player['j'].points)}
            },
            effectDisplay(){
                return "+" + format(this.effect())
            }
        },
        45: {
            unlocked(){ 
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 5)) {return true}
                else {return false}
            },
            title: "DLC is 20$",
            description: "Unlocks new layer",
            cost: new Decimal(5e11),
            effect(){
                return 1e4;
            }
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
                if (!inChallenge('j',12)){
                let eff, gainBase = 1.1, softcap = 1e8
                if (hasUpgrade("p", 23)) {gainBase += tmp[this.layer].upgrades[23].effect.first}
                if (hasUpgrade("p", 34)) {gainBase += tmp[this.layer].upgrades[34].effect.first}
                eff = Decimal.pow(gainBase, x)
                eff *= buyableEffect("p", 14);
                return eff
                }
                else {return 1}
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
                let gain = 100, max = 25
                if (hasUpgrade('p', 35)) {gain += upgradeEffect('p', 35)}
                if (hasUpgrade('p', 41)) {gain += upgradeEffect('p', 41)}
                if (hasMilestone('j', 5)) {
                    if (player['j'].points < max) {gain += 2 * player['j'].points}
                    else {gain += 2 * max}
                }
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
                if (hasUpgrade("p", 34)) {baseCost *= tmp[this.layer].upgrades[34].effect.second}
                let cost = new Decimal(baseCost * Math.pow(1.15, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                if (!inChallenge('j',12)){
                let eff, coeff1 = 1.3, max = Math.floor(1 * challengeCompletions('j', 12)), current = player['j'].points
                if (current >= max) {current = max}
                exp = 1.1 + (0.02 * current)
                if (hasUpgrade('p', 42)) {coeff1 += tmp[this.layer].upgrades[42].effect.second}
                eff = Math.pow(0.5 * x, coeff1) + 1 * x
                if (hasMilestone("j", 0)) {eff *= Math.pow(exp, player['j'].points)};
                eff *= buyableEffect("p", 14);
                return eff;
                }
                else {return 0}
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
                gain = 100, max = 25
                if (hasUpgrade('p', 35)) {gain += upgradeEffect('p', 35)}
                if (hasUpgrade('p', 41)) {gain += upgradeEffect('p', 41)}
                if (hasMilestone('j', 5)) {
                    if (player['j'].points < max) {gain += 2 * player['j'].points}
                    else {gain += 2 * max}
                }
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
                let baseCost = 1e7, baseCoeff = new Decimal(1.25)
                if (hasMilestone('j', 1)) {baseCoeff -= 0.05}
                let cost = new Decimal(baseCost * Math.pow(baseCoeff, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                if (!inChallenge('j',12)){
                let eff; let coeff1 = 1
                if (hasUpgrade('p', 42)) {coeff1 *= tmp[this.layer].upgrades[42].effect.first}
                if (!hasMilestone('j',6)){eff = 1 + (0.02 * coeff1 * x)}
                else {eff = 1 + (((0.02 + (0.005 * player['j'].points)) * coeff1 * x))}
                eff *= buyableEffect("p", 14);
                return eff;
                }
                else {return 1}
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
                gain = 100, max = 25
                if (hasUpgrade('p', 35)) {gain += upgradeEffect('p', 35)}
                if (hasUpgrade('p', 41)) {gain += upgradeEffect('p', 41)}
                if (hasMilestone('j', 5)) {
                    if (player['j'].points < max) {gain += 2 * player['j'].points}
                    else {gain += 2 * max}
                }
                return gain
            },
        },
        14: {
            unlocked(){ 
                if (hasUpgrade('j', 21) == 1) {return true}
                else {return false}
            },
            title: "It could have been abandonded", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let baseCost = 1e25, baseCoeff = new Decimal(1.3)
                let cost = new Decimal(baseCost * Math.pow(baseCoeff, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                if (!inChallenge('j',12)){
                    let eff, gainBase = 1.02
                    eff = Decimal.pow(gainBase, x)
                    return eff
                    }
                    else {return 1}
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " prestige points\n\
                Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
                x" + format(data.effect) + " previous buyables effect"
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
                gain = 100, max = 25
                if (hasUpgrade('p', 35)) {gain += upgradeEffect('p', 35)}
                if (hasUpgrade('p', 41)) {gain += upgradeEffect('p', 41)}
                if (hasMilestone('j', 5)) {
                    if (player['j'].points < max) {gain += 2 * player['j'].points}
                    else {gain += 2 * max}
                }
                return gain
            },
        },
    },
})

//UP - PRESTIGE, DOWN - JINGU

addLayer("j", {
    
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#ff4400",                       // The color for this layer, which affects many elements.
    resource: "jingu mastery",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "bao",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires() {
        let eff = new Decimal (1e22);
        if (hasUpgrade('j', 12)) {eff /= tmp['j'].upgrades[12].effect.first}
        return eff;
    },              // The amount of the base needed to  gain 1 of the prestige currency.                                        
    type: "static",                         
    exponent(){
        return Math.pow(1.33, x)
    },                          

    effect(){
        let max = 10, current = player['j'].points
        if (current >= max) {current = max}
        if (!hasUpgrade('j', 14)){return Math.pow(1.3, player['j'].points)}
        else{
            return Math.pow(1.3 + (upgradeEffect('j', 14) * current), player['j'].points)
        }
    },
    effectDescription(){
        return "which multiplies bao gain by " + format(tmp['j'].effect)
    },

    gainMult() {      
        let eff = new Decimal(1)
        if (hasUpgrade("j", 12)) {eff = eff.div(tmp['j'].upgrades[12].effect.second)}
        return eff
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('p', 45) || player["j"].points >= 1 },          // Returns a bool for if this layer's node should be visible in the tree.
    milestones: {
        0: {
            requirementDescription: "1 jingu mastery",
            effectDescription: "x1.1 second buyable effect per every jingu you have (uncapped)",
            done() { return player["j"].points >= 1 },
        },
        1: {
            requirementDescription: "2 jingu masteries",
            effectDescription: "Reduces third buyable cost scaling",
            done() { return player["j"].points >= 2 },
        },
        2: {
            requirementDescription: "3 jingu masteries",
            effectDescription: "Unlock new jingu milestones and upgrades",
            done() { return player["j"].points >= 3 },
        },
        3: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "6 jingu masteries",
            effectDescription: "Gain 5% of prestige point gain every second per every jingu you have",
            done() { return player["j"].points >= 6 },
        },
        4: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "8 jingu masteries",
            effectDescription: "Unlock a first jingu challenge",
            done() { return player["j"].points >= 8 },
        },
        5: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "10 jingu masteries",
            effectDescription: "Makes PP upgrades always visible. Increases cap of PP buyables by 2 per every jingu you have (caps at 25 jingu)",
            done() { return player["j"].points >= 10 },
        },
        6: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "12 jingu masteries",
            effectDescription: "Unlock a second jingu challenge. Increases third PP buyable base by 0.5% effect per every jingu you have",
            done() { return player["j"].points >= 12 },
        },
        7: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "13 jingu masteries",
            effectDescription: "Multiplies PP upgrade (1,2) base by 1.5 per every jingu you have (caps at 20 jingu). Unlocks new jingu content",
            done() { return player["j"].points >= 13 },
        },
        8: {
            unlocked(){ return hasMilestone('j',7)},
            requirementDescription: "15 jingu masteries",
            effectDescription: "Increases cap of jingu upgrade (1,1) by 1 per every jingu you have (caps at 10 jingu)",
            done() { return player["j"].points >= 15 },
        },
    },
    upgrades:{
        11: {
            title: "New mastery",
            description: "Multiplies PP gain per every jingu you have (caps at 10 jingu)",
            cost: new Decimal(3),
            effect(){
                let eff = {}, base = 10, max = 10, max2 = 10, current = player['j'].points, current2 = player['j'].points
                if (current2 >= max2) {current2 = max2}
                if (hasMilestone('j', 8)) {max += current2}
                if (hasUpgrade('j',13)) {base += upgradeEffect('j', 13)}
                if (current >= max) {current = max}
                eff.first = Math.pow(base, current)
                eff.second = Math.pow(base/3, current)
                return eff;
            },
            effectDisplay() { 
                if (hasUpgrade('j', 13) == 0) {return format(tmp['j'].upgrades[11].effect.first) + "x" }
                else {return format(tmp['j'].upgrades[11].effect.first) + "x, " + format(tmp['j'].upgrades[11].effect.second) + "x" }
            }
        },
        12: {
            unlocked(){ return hasMilestone('j',2)},
            title: "Forbidden techniques",
            description: "/1e2 jingu requirements, x1.1 jingu gain per every jingu you have",
            cost: new Decimal(4),
            effect(){
                let eff = {}
                eff.first = 1e2
                eff.second = Math.pow(1.1, player['j'].points)
                return eff;
            },
            effectDisplay(){
                return "x" + format(tmp['j'].upgrades[12].effect.second)
            }
        },
        13: {
            unlocked(){ return hasMilestone('j',2)},
            title: "Ascension",
            description: "Jingu upgrade (1,1) boosts bao at reduced rate, +2 base to jingu (1,1)",
            cost: new Decimal(6),
            effect(){
                return 2;
            },
        },
        14: {
            unlocked(){ return hasMilestone('j',2)},
            title: "Fever",
            description: "Increases jingu effect base by 0.07 per every jingu you have (caps at 10 jingu)",
            cost: new Decimal(9),
            effect(){
                return 0.07;
            },
        },
        15: {
            unlocked(){ return hasMilestone('j',2)},
            title: "Higher to soar - harder to fall",
            description: "Increases PP upgrade (4,4) effect per every jingu you have",
            cost: new Decimal(11),
            effect(){
                let eff = 1, max = 20, current = player['j'].points
                if (current >= max) {current = max}
                if (hasUpgrade('j', 22)) {eff += upgradeEffect('j', 22) * current}
                return eff;
            },
            effectDisplay(){
                return ("+" + format(this.effect()))
            }
        },
        21: {
            unlocked(){ return hasMilestone('j',2)},
            title(){ if (!hasUpgrade("j",21)) {return "???"}
            else {return "Mastery from the basement"}
            },
            description(){
                if (!hasUpgrade("j",21)) {return "???"}
                else {return "Unlocks mysterious fourth PP buyable"}
            },
            cost: new Decimal(12),
            effect(){
                return 1;
            },
        },
        22: {
            unlocked(){ return hasMilestone('j',7)},
            title: "Afraid of heights",
            description: "Increases jingu upgrade (4,4) effect by 0.2 per every jingu you have (caps at 20 jingu)",
            cost: new Decimal(14),
            effect(){
                return 0.2;
            },
        },
    },
    challenges:{
        11: {
            unlocked(){
                return hasMilestone('j', 4)
            },
            name: "Dry start",
            challengeDescription() {return ("PP upgrade (1,1) base equal to 1\n\ Completions: " + challengeCompletions('j',11) + "/" + this.completionLimit())},
            rewardDescription(){
                return "x2 to second effect of PP upgrade (3,2) per every jingu you have (caps at " + this.onComplete() + " jingu)"
            },
            goalDescription(){return format(1e20 * Math.pow(100, challengeCompletions('j', 11))) + " bao"},
            canComplete(){
               return player.points.gte(1e20 * Math.pow(100, challengeCompletions('j', 11)))
            },
            onComplete(){return (2 * challengeCompletions('j', 11))},
            completionLimit(){
                let eff = 10;
                return eff;
            }
        },
        12: {
            unlocked(){
                return hasMilestone('j', 6)
            },
            name: "It isn't working",
            challengeDescription() {return ("PP buyables have no effect\n\ Completions: " + challengeCompletions('j',12) + "/" + this.completionLimit())},
            rewardDescription(){
                return "+0.02 to first jingu milestone base per every jingu you have (caps at " + this.onComplete() + " jingu)"
            },
            goalDescription(){return format(1e20 * Math.pow(50, challengeCompletions('j', 12))) + " bao"},
            canComplete(){
               return player.points.gte(1e20 * Math.pow(50, challengeCompletions('j', 12)))
            },
            onComplete(){return (1 * challengeCompletions('j', 12))},
            completionLimit(){
                let eff = 10;
                return eff;
            }
        },
    }
}
)

//UP - JINGU, DOWN - ACHIEVEMENTS

addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#f5de18",                       // The color for this layer, which affects many elements.
    resource: "unlocked achievements",            // The name of this layer's main prestige resource.
    row: "side",                                 // The row this layer is on (0 is the first row).
            // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "none",                         // Determines the formula used for calculating prestige currency.                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    effect(){
        let eff
        eff = Math.pow(1.03, player[this.layer].points)
        return eff
    },
    effectDescription(){
        return "which multiplies bao gain by " + format(tmp['a'].effect)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    achievements: {
        11: {
            name: "The story starts...",
            tooltip: "Buy your first upgrade",
            done(){
                return hasUpgrade('p', 11)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        12: {
            name: "Back to the fit",
            tooltip: "Unlock your first buyable",
            done(){
                return hasUpgrade('p', 15)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        13: {
            name: "On the track",
            tooltip: "Get 10000 bao",
            done(){
                return player.points >= 10000 ? 1 : 0
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        14: {
            name: "Solo",
            tooltip: "Buy (2,5) upgrade",
            done(){
                return hasUpgrade('p', 25)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        15: {
            name: "You fear is less than before",
            tooltip: "Get rid of depend of bao in (2,4)",
            done(){
                return hasUpgrade('p', 33)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        16: {
            name: "Three (Six)",
            tooltip: "Increase (2,1) effect to 3",
            done(){
                return tmp['p'].upgrades[21].effect >= 3 ? 1 : 0
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        17: {
            name: "New mastery is coming...",
            tooltip: "Unlock second layer",
            done(){
                return hasUpgrade('p', 45)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        21: {
            unlocked(){ return player["a"].points >= 7},
            name: "New mastery",
            tooltip: "Get your first jingu mastery",
            done(){
                return player['j'].points >= 1
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        22: {
            unlocked(){ return player["a"].points >= 7},
            name: "Lilflation",
            tooltip: "Buy first jingu upgrade",
            done(){
                return hasUpgrade('j', 11)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        23: {
            unlocked(){ return player["a"].points >= 7},
            name: "Are there idle elements?",
            tooltip: "Get PP passively",
            done(){
                return hasMilestone('j', 3)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        24: {
            unlocked(){ return player["a"].points >= 7},
            name: "Closer to pantheon",
            tooltip: "Unlock your first challenge",
            done(){
                return hasMilestone('j', 4)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        25: {
            unlocked(){ return player["a"].points >= 7},
            name: "Raindrop",
            tooltip: "Complete your first challenge for the first time",
            done(){
                return challengeCompletions('j', 11) >= 1
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        26: {
            unlocked(){ return player["a"].points >= 7},
            name: "A bottle of water",
            tooltip: "Complete your first challenge 5 times",
            done(){
                return challengeCompletions('j', 11) >= 5
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        27: {
            unlocked(){ return player["a"].points >= 7},
            name: "You know WTF must you do",
            tooltip: "Unlock your second challenge",
            done(){
                return hasMilestone('j', 6)
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        31: {
            unlocked(){ return player["a"].points >= 14},
            name: "A broken button",
            tooltip: "Complete second jingu challenge for the first time",
            done(){
                return challengeCompletions('j', 12) >= 1
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        32: {
            unlocked(){ return player["a"].points >= 14},
            name: "Repairing",
            tooltip: "Complete second jingu challenge for the 5 times",
            done(){
                return challengeCompletions('j', 12) >= 5
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        33: {
            unlocked(){ return player["a"].points >= 14},
            name: "Long dozen",
            tooltip: "Up 13th jingu mastery",
            done(){
                return player['j'].points >= 13
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
        34: {
            unlocked(){ return player["a"].points >= 14},
            name: "Lucky man",
            tooltip: "Have 777 PP buyables simultaneously",
            done(){
                return (getBuyableAmount('p', 11) + getBuyableAmount('p', 12) + getBuyableAmount('p', 13) + getBuyableAmount('p', 14)) >= 777
            },
            onComplete(){
                player["a"].points = player["a"].points.add(1)
            }
        },
    },
})


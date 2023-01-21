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
        if (!inChallenge('j', 13)){
        return new Decimal(1)
        }
        else {return new Decimal(1 / (2 + (0.5 * challengeCompletions('j', 13))))}
    },
    passiveGeneration(){
        let perc = 0.05 * player['j'].points
        if (hasMilestone('j', 3)){return perc}
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){
            if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate(){
        if (hasMilestone('j', 5)){
        if (tmp['p'].buyables[11].canAfford && getBuyableAmount('p', 11) < tmp['p'].buyables[11].purchaseLimit){addBuyables('p',11,1 + hasMilestone('j',11))}
        if (tmp['p'].buyables[12].canAfford && getBuyableAmount('p', 12) < tmp['p'].buyables[12].purchaseLimit){addBuyables('p',12,1 + hasMilestone('j',11))}
        if (tmp['p'].buyables[13].canAfford && getBuyableAmount('p', 13) < tmp['p'].buyables[13].purchaseLimit){addBuyables('p',13,1 + hasMilestone('j',11))}
        if (tmp['p'].buyables[14].canAfford && getBuyableAmount('p', 14) < tmp['p'].buyables[14].purchaseLimit){addBuyables('p',14,1 + hasMilestone('j',11))}
        }
    },
    autoUpgrade(){
        if (hasMilestone('j', 11)) {return true}
        else {return false}
    },
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
                if (hasUpgrade('TC', 12)) {eff *= upgradeEffect('TC',12)}
                return eff;
            },
            effectDisplay(){
                return "x" + format(this.effect())
            }
        },
        13: {
            title: "Triplet",
            description: "+33% prestige point gain, x1.5 effect of 'You gonna start somewhere'",
            cost: new Decimal(18),
            effect(){
                let mult = {}
                mult.first = 1.33
                mult.second = 1.5
                return mult;
            } 
        },
        14: {
            title: "Quadcicle",
            description: "-1 base bao requirement to prestige points, +0.25 'You gonna start somewhere' base",
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
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Hexagon",
            description: "Each upgrade in this row additively increases prestige point gain",
            cost: new Decimal(100),
            effect(){
                let gainAdd = 1, gainBase = 0.1
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
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Hept-up",
            description: "Bao gain is increased based on current bao",
            cost: new Decimal(150),
            effect(){
                let gainbase, scale = 12, base = 1
                if (hasUpgrade('p',45)) {scale -= upgradeEffect('p',45)}
                if((Math.log(player.points) / Math.log(scale)) <= 1) {gainbase = 1 + base}
                else {gainbase = (Math.log(player.points) / Math.log(scale)) + base}
                if (hasMilestone('j',6)){gainbase *= Math.pow(1.01, player['j'].points)}
                if (hasUpgrade('TC',13)){gainbase *= upgradeEffect('TC', 13)}
                return gainbase
            },
            effectDisplay() { return format(this.effect()) + "x" }
        },
        23: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Fight in octagon",
            description: "+0.01 'Lost opportunities' base, +1.5 'You gonna start somewhere' base",
            cost: new Decimal(250),
            effect(){
                let mult = {}
                mult.first = 0.01
                mult.second = 1.5
                return mult;
            },
        },
        24: {
            unlocked(){ 
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 4)) {return true}
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
                if (getBuyableAmount('p', 11) >= 5 || hasMilestone('j', 4)) {return true}
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
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Experiment 011",
            description: "Each upgrade in this row reduces bao requirement by 0.2. Also x2.5 'Hexagon' base",
            cost: new Decimal(100000),
            effect(){
                let eff = {} 
                eff.first = 0
                if (hasUpgrade('p', 31)) {eff.first += 0.2}
                if (hasUpgrade('p', 32)) {eff.first += 0.2}
                if (hasUpgrade('p', 33)) {eff.first += 0.2}
                if (hasUpgrade('p', 34)) {eff.first += 0.2}
                if (hasUpgrade('p', 35)) {eff.first += 0.2}
                eff.second = 2
                return eff;
            },
            effectDisplay() { return "-" + format(tmp[this.layer].upgrades[31].effect.first) }
        },
        32: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "The Twentieth Slave",
            description: "x1.5 'You gonna start somewhere' effect, Increases its base based on PP",
            cost: new Decimal(5e5),
            effect(){
                let eff = {}
                eff.first = 1.5
                if((Math.log(player[this.layer].points) / Math.log(5)) <= 1) {eff.second = 1}
                else {
                    let max = 2 * challengeCompletions('j', 11);
                    if (!hasUpgrade('TC',14)){
                    if (player['j'].points < max) {eff.second = (Math.log(player[this.layer].points) / Math.log(2)) * Math.pow(2, player['j'].points)}
                    else {eff.second = (Math.log(player[this.layer].points) / Math.log(2)) * Math.pow(2, max)}}
                    else{
                        if (player['j'].points < max) {eff.second = (Math.log(player[this.layer].points) / Math.log(2)) * Math.pow(2 + upgradeEffect('TC',14), player['j'].points)}
                        else {eff.second = (Math.log(player[this.layer].points) / Math.log(2)) * Math.pow(2 + upgradeEffect('TC',14), max)}
                    }
                }
                return eff;
            },
            effectDisplay() { return "+" + format(tmp[this.layer].upgrades[32].effect.second) }
        },
        33: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Unknown thirteenth",
            description: "x2 'Leon Kirilin' multiplier, it no longer depends on current bao",
            cost: new Decimal(1.5e6),
            effect(){
                let eff
                eff = 2
                return eff;
            },
        },
        34: {
            unlocked(){ 
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Prestige tr14l",
            description: "+0.01 'Lost opportunities' base, x0.85 'Practice makes perfect' cost",
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
                if (getBuyableAmount('p', 12) >= 5 || hasMilestone('j', 4)) {return true}
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
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 4)) {return true}
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
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Chance of applying - 17%",
            description: "x1.5 'Find out your hidden bao' effect, 'Practice makes perfect' scales 50% better",
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
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 4)) {return true}
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
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 4)) {return true}
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
                if (getBuyableAmount('p', 13) >= 5 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "DLC is 20$",
            description: "Reduces 'Hept-up' logarithm scaling base. Unlocks new layer",
            cost: new Decimal(5e11),
            effect(){
                return 2;
            }
        },
    },
    buyables: {
        11: {
            unlocked(){ 
                if (hasUpgrade('p', 15) == 1 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Lost opportunities", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost, baseCoeff = 1.1
                if (inChallenge('j',21)) {baseCoeff *= 2} 
                cost = new Decimal(20 * Math.pow(baseCoeff, x))
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
                if (hasUpgrade('p', 25) == 1 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Practice makes perfect", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let baseCost = 250, baseCoeff = 1.15
                if (inChallenge('j',21)) {baseCoeff *= 2} 
                if (hasUpgrade("p", 34)) {baseCost *= tmp[this.layer].upgrades[34].effect.second}
                let cost = new Decimal(baseCost * Math.pow(baseCoeff, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                if (!inChallenge('j',12)){
                let eff, coeff1 = 1.3, max = Math.floor(1.5 * challengeCompletions('j', 12)), current = player['j'].points
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
                if (hasUpgrade('p', 35) == 1 || hasMilestone('j', 4)) {return true}
                else {return false}
            },
            title: "Find out your hidden bao", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let baseCost = 1e7, baseCoeff = new Decimal(1.2)
                if (inChallenge('j',21)) {baseCoeff *= 2} 
                let cost = new Decimal(baseCost * Math.pow(baseCoeff, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                if (!inChallenge('j',12)){
                let eff; let coeff1 = 1
                if (hasUpgrade('p', 42)) {coeff1 *= tmp[this.layer].upgrades[42].effect.first}
                if (!hasMilestone('j',1)){eff = 1 + (0.02 * coeff1 * x)}
                else {eff = 1 + (((0.02 + (0.005 * player['j'].points)) * coeff1 * x))}
                if (eff != 1) {eff *= buyableEffect("p", 14);}
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
                if (hasUpgrade('j', 21)) {return true}
                else {return false}
            },
            title: "It could have been abandonded", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let baseCost = 1e25, baseCoeff = new Decimal(1.3)
                if (inChallenge('j',21)) {baseCoeff *= 2} 
                let cost = new Decimal(baseCost * Math.pow(baseCoeff, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                if (!hasUpgrade('TC',22)){max = Math.floor(1.5 * challengeCompletions('j', 21))}
                else {max = Math.floor(1.5 * challengeCompletions('j', 21) * upgradeEffect('TC',22))}
                if (!inChallenge('j',12)){
                    current = player['j'].points
                    if (current >= max) {current = max}
                    let eff, gainBase = 1.02
                    gainBase += (0.001 * current)
                    eff = Decimal.pow(gainBase, x)
                    if (hasUpgrade('TC',24))(eff = Math.pow(eff, upgradeEffect('TC', 24)))
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
        let max = 10, current = player['j'].points, max2 = 20, current2 = player['j'].points - 10, current3 = player['j'].points, max3 = 20
        if (hasUpgrade('j',24)) {max3 += (tmp['j'].upgrades[24].effect.first * current)}
        if (current3 >= max3) {current3 = max3}
        if (current2<= 0) {current2 = 0} if (current2 >= max2) {current2 = max2}
        if (hasMilestone('j', 9)){max += current2}
        if (current >= max) {current = max}
        if (!hasUpgrade('j', 14)){return Math.pow(1.3, player['j'].points)}
        else{
            if (!hasUpgrade('TC',23)){
            return Math.pow(1.3 + (upgradeEffect('j', 14) * current3), player['j'].points)}
            else {return Math.pow(1.3 + (upgradeEffect('j', 14) * current3), player['j'].points) * upgradeEffect('TC',23)}
        }
    },
    effectDescription(){
        return "which multiplies bao gain by " + format(tmp['j'].effect) + " (base cap at 20 jingu)"
    },

    gainMult() {      
        let eff = new Decimal(1)
        if (hasUpgrade("j", 12)) {eff = eff.div(tmp['j'].upgrades[12].effect.second)}
        return eff
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    hotkeys: [
        {key: "j", description: "J: Reset gain jingu", onPress(){
            if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return hasUpgrade('p', 45) || player["j"].points >= 1 },          // Returns a bool for if this layer's node should be visible in the tree.
    milestones: {
        0: {
            requirementDescription: "1 jingu mastery",
            effectDescription: "x1.1 'Practice makes perfect' effect per every jingu you have (uncapped)",
            done() { return player["j"].points >= 1 },
        },
        1: {
            requirementDescription: "2 jingu masteries",
            effectDescription: "Increases 'Find out your hidden bao' base by 0.5% per every jingu you have",
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
            effectDescription: "Makes PP upgrades and buyables always visible. Unlock a first jingu challenge",
            done() { return player["j"].points >= 8 },
        },
        5: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "10 jingu masteries",
            effectDescription: "Autobuys PP buyables (autobuyer considers cost as requirement). Increases cap of PP buyables by 2 per every jingu you have (caps at 25)",
            done() { return player["j"].points >= 10 },
        },
        6: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "12 jingu masteries",
            effectDescription: "Unlock a second jingu challenge. Multiplies 'Hept-up' effect by 1.01 per every jingu you have (compounding)",
            done() { return player["j"].points >= 12 },
        },
        7: {
            unlocked(){ return hasMilestone('j',2)},
            requirementDescription: "13 jingu masteries",
            effectDescription: "Multiplies '2 is more than 1' base by 1.5 per every jingu you have (caps at 20). Unlocks new jingu content",
            done() { return player["j"].points >= 13 },
        },
        8: {
            unlocked(){ return hasMilestone('j',7)},
            requirementDescription: "15 jingu masteries",
            effectDescription: "Increases cap of 'New mastery' by 1 per every jingu you have (max at 10)",
            done() { return player["j"].points >= 15 },
        },
        9: {
            unlocked(){ return hasMilestone('j',7)},
            requirementDescription: "17 jingu masteries",
            effectDescription: "+1 'Fever' cap per every jingu above 10 you have (max at 27). +0.03 to 'Fever' base. Unlocks third jingu challenge",
            done() { return player["j"].points >= 17 },
        },
        11: {
            unlocked(){ return hasMilestone('j',7)},
            requirementDescription: "20 jingu masteries",
            effectDescription: "Autobuys all PP upgrades. Doubles buyable autobuy speed",
            done() { return player["j"].points >= 20 },
        },
        12: {
            unlocked(){ return player["j"].points >= 24},
            requirementDescription: "24 jingu masteries and 11 tiger claws",
            effectDescription: "Unlocks fifth jingu challenge",
            done() { return (player["j"].points >= 24 && player['TC'].points >= 11) },
        },
    },
    upgrades:{
        11: {
            title: "New mastery",
            description: "Multiplies PP gain per every jingu you have (caps at 10 jingu)",
            cost: new Decimal(3),
            effect(){
                let eff = {}, base = 10, max = 10, max2 = 10, current = player['j'].points, max3 = Math.floor(1.6 * challengeCompletions('j', 13)), current3 = player['j'].points
                current2 = player['j'].points - 10; if (current2 <= 0) {current2 = 0}
                if (current2 >= max2) {current2 = max2}
                if (current3 >= max3) {current3 = max3}
                if (hasMilestone('j', 8)) {max += current2}
                if (hasUpgrade('j',13)) {base += upgradeEffect('j', 13)}
                base += 0.5 * max3
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
                if (hasUpgrade('j',23)) {eff.second = Math.pow(Math.pow(1.1,player['j'].points), upgradeEffect('j',23))}
                if (hasUpgrade('TC',15)) {eff.second *= upgradeEffect('TC',15)}
                return eff;
            },
            effectDisplay(){
                return "x" + format(tmp['j'].upgrades[12].effect.second)
            }
        },
        13: {
            unlocked(){ return hasMilestone('j',2)},
            title: "Ascension",
            description: "'New mastery' boosts bao at reduced rate, +2 base to it",
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
                let eff = 0.07
                if (hasMilestone('j',9)){eff += 0.03}
                return eff;
            },
        },
        15: {
            unlocked(){ return hasMilestone('j',2)},
            title: "Higher to soar - harder to fall",
            description: "Increases '19? Yes' effect per every jingu you have",
            cost: new Decimal(11),
            effect(){
                let eff = 1, max = 16, current = player['j'].points
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
            description: "Increases 'Higher to soar...' effect by 0.25 per every jingu you have (caps at 16 jingu)",
            cost: new Decimal(14),
            effect(){
                return 0.25;
            },
        },
        23: {
            unlocked(){ return hasMilestone('j',7)},
            title: "Eternal evolution",
            description: "Cube second 'Forbidden techniques' effect",
            cost: new Decimal(20),
            effect(){
                return 3;
            },
        },
        24: {
            unlocked(){ return hasMilestone('j',7)},
            title: "CSP-032",
            description: "+1 to jingu effect cap per every 4 jingu you have, ^1.001 bao gain per every jingu you have (additive and uncapped)",
            cost: new Decimal(21),
            effect(){
                let eff = {};
                eff.first = 0.25;
                eff.second = 1 + (0.001 * player['j'].points);
                return eff;
            },
            effectDisplay(){
                return ("^" + format(tmp['j'].upgrades[24].effect.second))
            }
        },
        25: {
            unlocked(){ return hasUpgrade('j',24)},
            title: "What is this?",
            description: "Unlocks new layer",
            cost: new Decimal(22),
            effect(){
                return 0;
            }
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
                if (hasUpgrade('TC',14)){
                return "x" + format (2 + upgradeEffect('TC',14)) + " to second effect of 'The Twentieth Slave' per every jingu you have (caps at " + this.onComplete() + " jingu)"
                }
                else{
                    return "x2 to second effect of 'The Twentieth Slave' per every jingu you have (caps at " + this.onComplete() + " jingu)"
                    }
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
            onComplete(){return Math.floor(1.5 * challengeCompletions('j', 12))},
            completionLimit(){
                let eff = 10;
                return eff;
            }
        },
        13: {
            unlocked(){
                return player['j'].best >= 18
            },
            name: "Ouch, it's painful",
            challengeDescription() {return ("PP gain is in " + format(2+ (0.5 * challengeCompletions('j',13))) +"th root\n\ Completions: " + challengeCompletions('j',13) + "/" + this.completionLimit())},
            rewardDescription(){
                return "+0.5 'New mastery' base per every jingu you have (caps at " + this.onComplete() + " jingu). 5th completion unlocks next challenge"
            },
            goalDescription(){return format(1e40 * Math.pow(1e4, challengeCompletions('j', 13))) + " bao"},
            canComplete(){
               return player.points.gte(1e40 * Math.pow(1e4, challengeCompletions('j', 13)))
            },
            onComplete(){return Math.floor(1.6 * challengeCompletions('j', 13))},
            completionLimit(){
                let eff = 10;
                return eff;
            }
        },
        21: {
            unlocked(){
                return challengeCompletions('j',13) >= 5
            },
            name: "You know it's worthless",
            challengeDescription() {return ("PP buyables cost scaling are drastically increased <br>" + "Completions: " + challengeCompletions('j',21) + "/" + this.completionLimit())},
            rewardDescription(){
                return "+0.002 'It could have been abandonded' base per every jingu you have (caps at " + this.onComplete() + " jingu)"
            },
            goalDescription(){return format(1e50 * Math.pow(1e5, challengeCompletions('j', 21))) + " bao"},
            canComplete(){
               return player.points.gte(1e50 * Math.pow(1e5, challengeCompletions('j', 21)))
            },
            onComplete(){
                if (hasUpgrade('TC',22)){ return Math.floor(1.5 * challengeCompletions('j', 21) * upgradeEffect('TC',22))}
                else{ return Math.floor(1.5 * challengeCompletions('j', 21))}
            },
            completionLimit(){
                let eff = 10;
                return eff;
            }
        },
        22: {
            unlocked(){
                return hasMilestone('j', 12)
            },
            name: "Torned flesh",
            challengeDescription() {return ("Tiger claw upgrades are useless <br>" + "Completions: " + challengeCompletions('j',22) + "/" + this.completionLimit())},
            rewardDescription(){
                return "+0.1 to 'Plantation' cap per every jingu you have (caps at " + this.onComplete() + " jingu). Also /10 tiger claw requirement per completion"
            },
            goalDescription(){return format(1e60 * Math.pow(1e6, challengeCompletions('j', 22))) + " bao"},
            canComplete(){
               return player.points.gte(1e60 * Math.pow(1e6, challengeCompletions('j', 22)))
            },
            onComplete(){return (2 * challengeCompletions('j', 22))},
            completionLimit(){
                let eff = 10;
                return eff;
            }
        },
    }
}
)

//UP - JINGU, DOWN - XPERIENCE

addLayer("TC", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        tigerexp: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        mult1: new Decimal(1)
    }},

    color: "#00ff54",                       // The color for this layer, which affects many elements.
    resource: "tiger claw",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "bao",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires() {
        let eff = new Decimal(1e85)
        if (hasUpgrade('TC', 11)) {eff = eff.div(upgradeEffect('TC', 11))}
        eff = eff.div(Math.pow(10, challengeCompletions('j',22)))
        return eff
    },            // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.66,                          // "normal" prestige gain is (currency^exponent).
    effect(){
        let eff = {}
        eff.first = Math.pow(1.5, player['TC'].best)
        eff.second = player['TC'].mult1
        return eff
    },
    effectDescription(){
        return "which provides " + format(tmp['TC'].effect.first) + " tiger experience per second (based on best) and boosts all tiger claw upgrades' multipliers by x" + format(tmp['TC'].effect.second) + "(based on current)"
    },
    gainMult() {  
        let eff = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        if (hasUpgrade('TC', 11)) {eff = eff.div(upgradeEffect('TC', 11))}
        return eff               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return hasUpgrade('j', 25) || player["TC"].points >= 1 },          // Returns a bool for if this layer's node should be visible in the tree.
    tabFormat: [
        "main-display",
        ["prestige-button"],
        "prestige-button",
        "blank",
        ["display-text",
            function() { return 'You have ' + format(player['TC'].tigerexp) + ' tiger experience' },
            { "color": "white", "font-size": "16px", "font-family": "Inconsolata" }],
        "blank",
        "milestones",
        "blank",
        "upgrades"
    ],
    update(diff){
        player['TC'].tigerexp = player['TC'].tigerexp.add(tmp['TC'].effect.first*diff)
        player['TC'].mult1 = 1 + Math.pow(0.1*player['TC'].points, 2)
    },
    upgrades:{
        11: {
            title: "Cursed treasure",
            description: "Boosts tiger claw gain and reduces its requirement based on tiger experience",
            cost: new Decimal(1),
            effect(){
                if (!inChallenge('j',22)){
                let eff
                eff = Math.pow(player['TC'].tigerexp,0.55)
                eff *= player['TC'].mult1
                if (hasUpgrade('TC',21))(eff = Math.pow(eff,upgradeEffect('TC',21)))
                return eff
                }
                else {return 1}
            },
            effectDisplay(){
                return ('x' + format(this.effect()))
            }
        },
        12: {
            title: "Bounty",
            description: "Boosts '2 is more than 1' based on tiger experience",
            cost: new Decimal(2),
            effect(){
                if (!inChallenge('j',22)){
                let eff
                eff = Math.pow(player['TC'].tigerexp,0.33)
                eff *= player['TC'].mult1
                return eff
                }
                else {return 1}
            },
            effectDisplay(){
                return ('x' + format(this.effect()))
            }
        },
        13: {
            title: "Request timeout error",
            description: "Boosts 'Hept-up' based on tiger experience",
            cost: new Decimal(4),
            effect(){
                if (!inChallenge('j',22)){
                let eff, scale = 40
                if((Math.log(player['TC'].tigerexp) / Math.log(scale)) <= 1) {eff = 1}
                else {eff = (Math.log(player['TC'].tigerexp) / Math.log(scale))}
                eff *= player['TC'].mult1
                return eff
                }
                else {return 1}
            },
            effectDisplay(){
                return ('x' + format(this.effect()))
            }
        },
        14: {
            title: "Plantation",
            description: "Tiger experience increases 'Dry start' reward base(cap at 1)",
            cost: new Decimal(6),
            effect(){
                let eff, scale = 1e3, cap = 1, max = 2 * challengeCompletions('j', 22);
                if (player['j'].points <= max){cap += 0.1 * player['j'].points} else {cap += 0.1 * max}
                if (!inChallenge('j',22)){
                    if((Math.log(player['TC'].tigerexp) / Math.log(scale)) <= 0) {eff = 0}
                    else if ((Math.log(player['TC'].tigerexp) / Math.log(scale) >= cap)) {eff = cap}
                    else {eff = (Math.log(player['TC'].tigerexp) / Math.log(scale))}
                return eff}
                else {return 0}
            },
            effectDisplay(){
                return ('+' + format(this.effect()))
            }
        },
        15: {
            title: "There is no limit",
            description: "Tiger experience multiplies second 'Forbidden techniques' effect",
            cost: new Decimal(8),
            effect(){
                if (!inChallenge('j',22)){
                let eff = Math.pow(player['TC'].tigerexp, 0.75)
                eff *= player['TC'].mult1
                return eff
                }
                else {return 1}
            },
            effectDisplay(){
                return ('x' + format(this.effect()))
            }
        },
        21: {
            unlocked(){ return player['TC'].tigerexp >= 1e5},
            title: "Beat it",
            description: "Bring 'Cursed treasure' effect to 1.5th power (applies after second TC bonus)",
            cost: new Decimal(15),
            effect(){
                if (!inChallenge('j',22)){
                    return 1.5
                    }
                    else {return 1}
            },
        },
        22: {
            unlocked(){ return player['TC'].tigerexp >= 1e5},
            title: "Now it worth",
            description: "Tiger experience multiplies 'You know it's worthless' cap (caps at 2) (second TC effect doesn't work)",
            cost: new Decimal(16),
            effect(){
                    let eff, scale = 7.5e3, cap = 2
                if (!inChallenge('j',22)){
                    if((Math.log(player['TC'].tigerexp) / Math.log(scale)) <= 1) {eff = 1}
                    else if ((Math.log(player['TC'].tigerexp) / Math.log(scale) >= cap)) {eff = cap}
                    else {eff = (Math.log(player['TC'].tigerexp) / Math.log(scale))}
                return eff}
                else {return 1}
            },
            effectDisplay(){
                return ('x' + format(this.effect()))
            }
        },
        23: {
            unlocked(){ return player['TC'].tigerexp >= 1e5},
            title: "More fever",
            description: "Tiger experience multiplies jingu layer effect",
            cost: new Decimal(18),
            effect(){
                if (!inChallenge('j',22)){
                    let eff
                    eff = Math.pow(player['TC'].tigerexp,0.3)
                    if (hasUpgrade('TC',21))(eff *= upgradeEffect('TC',21))
                    eff *= player['TC'].mult1
                    return eff
                    }
                    else {return 1}
            },
            effectDisplay(){
                return ('x' + format(this.effect()))
            }
        },
        24: {
            unlocked(){ return player['TC'].tigerexp >= 1e5},
            title: "1001010100101",
            description: "Brings 'It could have been abandoned' to power based on tiger experience(cap at 2)",
            cost: new Decimal(20),
            effect(){
                let eff, scale = 5e4, cap = 2
            if (!inChallenge('j',22)){
                if((Math.log(player['TC'].tigerexp) / Math.log(scale)) <= 1) {eff = 1}
                else if ((Math.log(player['TC'].tigerexp) / Math.log(scale) >= cap)) {eff = cap}
                else {eff = (Math.log(player['TC'].tigerexp) / Math.log(scale))}
            return eff}
            else {return 1}
            },
            effectDisplay(){
            return ('^' + format(this.effect()))
            }
        },
        25: {
            unlocked(){ return player['TC'].tigerexp >= 1e5},
            title: "Tiger galaxy",
            description: "Unlocks tiger galaxy(WIP)",
            cost: new Decimal(23),
            effect(){
                return 1
            },
        },
    }
})
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
        let perc = new Decimal(0.05 * player['j'].points)
        if (hasMilestone('j', 3) && player['j'].gain){return perc}
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){
            if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate(){
        let mult = 1
        if (hasMilestone('j',13)) {mult *= 5}
        if (hasMilestone('j', 5) && player['j'].buy){
        if (tmp['p'].buyables[11].canAfford && getBuyableAmount('p', 11) < tmp['p'].buyables[11].purchaseLimit){addBuyables('p',11,(1 + hasMilestone('j',11)) * mult)}
        if (tmp['p'].buyables[12].canAfford && getBuyableAmount('p', 12) < tmp['p'].buyables[12].purchaseLimit){addBuyables('p',12,(1 + hasMilestone('j',11)) * mult)}
        if (tmp['p'].buyables[13].canAfford && getBuyableAmount('p', 13) < tmp['p'].buyables[13].purchaseLimit){addBuyables('p',13,(1 + hasMilestone('j',11)) * mult)}
        if (tmp['p'].buyables[14].canAfford && getBuyableAmount('p', 14) < tmp['p'].buyables[14].purchaseLimit){addBuyables('p',14,(1 + hasMilestone('j',11)) * mult)}
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
                if (hasUpgrade("p", 34)) {gainBase += tmp[this.layer].upgrades[34].effect}
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
                gainAdd = Math.pow(gainAdd, buyableEffect('TC',33))
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
                let mult = {}, add = 0.33
                mult.first = 1 + add
                mult.second = 1.5
                if (hasUpgrade('p',23)) {add *= upgradeEffect('p',23); mult.second *= upgradeEffect('p',23)}
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
            description(){ if(!shiftDown) {return "Bao gain is increased based on current bao"}
            else {return "Base formula: log12(x) + 1"}},
            cost: new Decimal(150),
            effect(){
                let gainbase = new Decimal(), scale = 12, base = 1
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
            description: "Doubles 'Triplet' effect",
            cost: new Decimal(250),
            effect(){
                let mult = 2
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
                let mult = 3
                if (hasUpgrade('p', 33)) {mult *= upgradeEffect('p', 33)}
                if (hasUpgrade('p', 44)) {mult += upgradeEffect('p', 44)}
                if (player.points <= 1000 && !hasUpgrade('p', 33)) {return (mult - 1)}
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
            description: "Each upgrade in this row reduces bao requirement by 0.2. Also x2 'Hexagon' base",
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
            description(){ if(!shiftDown) {return "x1.5 to 'You gonna start somewhere' effect. Upgrade adds to its base based on PP"}
            else {return "Base formula: log5(x)"}},
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
            description: "+14 to both 'You gonna start somewhere' and 'Practice makes perfect' base",
            cost: new Decimal(2.5e6),
            effect(){
                let eff = 14
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
    buyables:{
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
                let eff, gainBase = 1.125, softcap = 1e8
                gainBase += buyableEffect('TC',22)
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
                gain += buyableEffect('TC', 34)
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
                let cost = new Decimal(baseCost * Math.pow(baseCoeff, x))
                return cost
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                if (!inChallenge('j',12)){
                let eff, coeff1 = 1.3, max, current = player['j'].points
                if (hasUpgrade('TC',34)) {max = Math.floor(1.5 * challengeCompletions('j', 12) * upgradeEffect('TC',34))}
                else {max = Math.floor(1.5 * challengeCompletions('j', 12))}
                if (current >= max) {current = max}
                exp = 1.1 + (0.02 * current)
                if (hasUpgrade('p', 42)) {coeff1 += tmp[this.layer].upgrades[42].effect.second}
                eff = Math.pow(0.5 * x, coeff1) + 1 * x
                if (hasUpgrade('p',34)) {eff += upgradeEffect('p',34)}
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
                gain += buyableEffect('TC', 34)
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
                gain += buyableEffect('TC', 34)
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
                gain += buyableEffect('TC', 34)
                return gain
            },
        },
    },
})
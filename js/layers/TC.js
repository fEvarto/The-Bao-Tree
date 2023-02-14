addLayer("TC", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        tigerexp: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        tg: new Decimal(0),
    }},

    color: "#00ff54",                       // The color for this layer, which affects many elements.
    resource: "tiger claw",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "bao",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.
    autoPrestige(){return hasMilestone('j',14) && player['j'].autobuy == true},
    resetsNothing(){return hasMilestone('j',15)},  
    requires() {
        let eff = new Decimal(1e85)
        if (hasUpgrade('TC', 11)) {eff = eff.div(upgradeEffect('TC', 11))}
        eff = eff.div(Math.pow(10, challengeCompletions('j',22)))
        eff = eff.div(buyableEffect('TC',32))
        return eff
    },            // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.66,                          // "normal" prestige gain is (currency^exponent).
    effect(){
        let eff = {}
        if (player['TC'].best == 0) {eff.first = 0} else {
           if(!hasUpgrade('TC',31)) {eff.first = Math.pow(1.5, player['TC'].best)}
           else {eff.first = Math.pow(1.5 + upgradeEffect('TC',31), player['TC'].best)}
        }
        if (!hasUpgrade('TC',33)){eff.second = 1 + Math.pow(0.1*player['TC'].points, 2)}
        else {eff.second = 1 + Math.pow(0.1*player['TC'].points, 2) * upgradeEffect('TC',33)}
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
    layerShown() { return hasUpgrade('j', 25) || player["TC"].best >= 1 },          // Returns a bool for if this layer's node should be visible in the tree.,
    update(diff){
        player['TC'].tigerexp = player['TC'].tigerexp.add(tmp['TC'].effect.first*diff)
    },
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                ["prestige-button"],
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return 'You have ' + format(player['TC'].tigerexp) + ' tiger experience' },
                    { "color": "white", "font-size": "16px", "font-family": "Inconsolata" }],
                "blank",
                "upgrades"
                ],
        
        },
        "Tiger galaxy": {
            unlocked() {return hasUpgrade('TC',25) || player['TC'].buyables[11] >= 1},
            content: [
                ["display-text",
                    function() { return 'You have ' + format(Math.round(player['TC'].tg)) + ' tiger galaxy <br>Buying a tiger galaxy buyable halves your tiger experience, but you can get one of significant boosts' },
                    { "color": "white", "font-size": "16px", "font-family": "Inconsolata" }],
                "blank",
                "buyables",
                "clickables"
                ],
        },
},
upgrades:{
    11: {
        title: "Cursed treasure",
        description(){ if(!shiftDown) {return "Tiger experience reduces tiger claw requirement and multiplies its gain"}
            else {return "Base formula: x^0.55"}},
        cost: new Decimal(1),
        effect(){
            if (!inChallenge('j',22)){
            let eff
            eff = Math.pow(player['TC'].tigerexp,0.55)
            eff *= tmp['TC'].effect.second
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
        description(){ if(!shiftDown) {return "Tiger experience boosts '2 is more than 1'"}
            else {return "Base formula: x^0.33"}},
        cost: new Decimal(2),
        effect(){
            if (!inChallenge('j',22)){
            let eff
            eff = Math.pow(player['TC'].tigerexp,0.33)
            eff *= tmp['TC'].effect.second
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
        description(){ if(!shiftDown) {return "Tiger experience boosts 'Hept-up'"}
            else {return "Base formula: log40(x)"}},
        cost: new Decimal(4),
        effect(){
            if (!inChallenge('j',22)){
            let eff, scale = 40
            if((Math.log(player['TC'].tigerexp) / Math.log(scale)) <= 1) {eff = 1}
            else {eff = (Math.log(player['TC'].tigerexp) / Math.log(scale))}
            eff *= tmp['TC'].effect.second
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
        description(){ if(!shiftDown) {return "Tiger experience increases 'Dry start' base"}
            else {return "Base formula: log1000(x) - 1, base cap at 1"}},
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
        description(){ if(!shiftDown) {return "Boost second 'Forbidden techniques' effect based on tiger experience"}
            else {return "Base formula: x^0.75"}},
        cost: new Decimal(8),
        effect(){
            if (!inChallenge('j',22)){
            let eff = Math.pow(player['TC'].tigerexp, 0.75)
            eff *= tmp['TC'].effect.second
            return eff
            }
            else {return 1}
        },
        effectDisplay(){
            return ('x' + format(this.effect()))
        }
    },
    21: {
        unlocked(){ return player['TC'].tigerexp >= 2e4},
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
        unlocked(){ return player['TC'].tigerexp >= 2e4},
        title: "Now it worth",
        description(){ if(!shiftDown) {return "Tiger experience multiplies 'You know it's worthless' effect cap"}
            else {return "Base formula: log7500(x), base cap at 2, second TC effect doesn't work"}},
        cost: new Decimal(16),
        effect(){
                let eff, scale = 7.5e3, cap = 2
                cap += buyableEffect('TC',31)
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
        unlocked(){ return player['TC'].tigerexp >= 2e4},
        title: "More fever",
        description(){ if(!shiftDown) {return "Tiger experience boosts jingu layer effect"}
            else {return "Base formula: x^(π/10)"}},
        cost: new Decimal(18),
        effect(){
            if (!inChallenge('j',22)){
                let eff
                eff = Math.pow(player['TC'].tigerexp,0.31415926)
                if (hasUpgrade('TC',21))(eff *= upgradeEffect('TC',21))
                eff *= tmp['TC'].effect.second
                if (hasUpgrade('TC',32)){eff = Math.pow(eff, tmp['TC'].upgrades[32].effect)}
                return eff
                }
                else {return 1}
        },
        effectDisplay(){
            return ('x' + format(this.effect()))
        }
    },
    24: {
        unlocked(){ return player['TC'].tigerexp >= 2e4},
        title: "1001010100101",
        description(){ if(!shiftDown) {return "Bring 'It coult have been abandoned' to power based on tiger experience"}
            else {return "Base formula: log5e4(x), base cap at 2"}},
        cost: new Decimal(20),
        effect(){
            let eff, scale = 5e4, cap = 2
            cap += buyableEffect('TC',31)
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
        unlocked(){ return player['TC'].tigerexp >= 2e4},
        title: "Tiger galaxy",
        description: "Unlocks tiger galaxy",
        cost: new Decimal(23),
        effect(){
            return 1
        },
    },
    31: {
        unlocked(){ return player['TC'].buyables[11] >= 4},
        title: "Hidden beast",
        description: "Each upgrade in this row increases first TC effect gain exponent by 0.1",
        cost: new Decimal(28),
        effect(){
            let eff = 0
            if (hasUpgrade('TC',31)) {eff += 0.1}
            if (hasUpgrade('TC',32)) {eff += 0.1}
            if (hasUpgrade('TC',33)) {eff += 0.1}
            if (hasUpgrade('TC',34)) {eff += 0.1}
            if (hasUpgrade('TC',35)) {eff += 0.1}
            return eff
        },
        effectDisplay(){
            return ('+' + format(this.effect()))
        }
    },
    32: {
        unlocked(){ return player['TC'].buyables[11] >= 8},
        title: "Fatal disease",
        description: "Square 'More fever' effect",
        cost: new Decimal(33),
        effect(){
            if (!inChallenge('j',22)){
            return 2
            }
            else {return 1}
        },
    },
    33: {
        unlocked(){ return player['TC'].buyables[11] >= 12},
        title: "Sharpness",
        description: "x10 to second TC effect",
        cost: new Decimal(41),
        effect(){
            if (!inChallenge('j',22)){
            return 10
            }
            else {return 1}
        },
    },
    34: {
        unlocked(){ return player['TC'].buyables[11] >= 16},
        title: "80 inches under",
        description(){ if(!shiftDown) {return "Tiger experience boosts 'It isn't working' effect cap"}
            else {return "Base formula: log1e10(x), caps at 2"}},
        cost: new Decimal(52),
        effect(){
            let eff, scale = 1e10, cap = 2
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
    35: {
        unlocked(){ return player['TC'].buyables[11] >= 20},
        title: "Deeper in the dark",
        description: "Unlocks brand new feature [WIP]",
        cost: new Decimal(59),
        effect(){
            return 1
        },
    },
},
buyables:{
    11: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Tiger galaxy", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost, baseCoeff = 1.1
            if (inChallenge('j',21)) {baseCoeff *= 2} 
            cost = new Decimal(1e117 * Math.pow(2e3, x * Math.pow(1.06, x)))
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return 1
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " bao\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            Buy a tiger galaxy"
        },
        canAfford() {
            return player.points.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player['TC'].tigerexp = player['TC'].tigerexp.div(2)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
            player['TC'].tg = player['TC'].tg.add(buyableEffect('TC',11)) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
        },
        purchaseLimit(){
            return 40
        },
    },
    21: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Jinger", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return x
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            +1 to jingu challenge completions cap per level"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
    22: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Antimatter galaxy", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return 0.02 * x
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            +0.02 to 'Lost opportunities' base per level"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)	
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
    23: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Mastery abuse", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return 0.5 * x
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            -0.5 to 'CSP-032' first effect's threshold per level"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)	
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
    24: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Studying new techniques", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return x
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            +1 to 'Eternal evolution' power per level"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)	
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
    31: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Extra finger", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return (0.2 * x)
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            +0.2 to 'Now it worth' and '1001010100101' caps per level"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)	
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
    32: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "I found it!", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return Math.pow(100, x)
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            /100 tiger claw requirement per level"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)	
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
    33: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Back to the origins", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return 1 + (0.05 * x)
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            ^1.05 'You gonna start somewhere' effect per level (additive)"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)	
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
    34: {
        unlocked(){ 
            if (hasUpgrade('TC', 25)) {return true}
            else {return false}
        },
        title: "Phantom impact", // Optional, displayed at the top in a larger font
        cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
            let cost = 1
            return cost
        },
        effect(x) { // Effects of owning x of the items, x is a decimal
            return (10 * x)
        },
        display() { // Everything else displayed in the buyable button after the title
            let data = tmp[this.layer].buyables[this.id]
            return "Cost: " + format(data.cost) + " tiger galaxy\n\
            Amount: " + player[this.layer].buyables[this.id] + "/" + format(data.purchaseLimit) + "\n\
            +10 to PP buyables cap per level (additive)"
        },
        canAfford() {
            return player['TC'].tg.gte(tmp[this.layer].buyables[this.id].cost)},
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.sub(cost)	
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
        },
        purchaseLimit(){
            return 5
        },
        sellOne(){
            if (player[this.layer].buyables[this.id] > 0){
            cost = tmp[this.layer].buyables[this.id].cost
            player['TC'].tg = player['TC'].tg.add(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].sub(1)
            player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.sub(cost)
            }
        }
    },
}
}
)
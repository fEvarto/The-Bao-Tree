addLayer("j", {
    
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer
        gain: false,
        buy: false,
        autobuy: false
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
    autoPrestige(){return (hasMilestone('j',14) && player['j'].autobuy == true)},
    resetsNothing(){return hasMilestone('j',15)},                  
    tabFormat: {
        "Milestones": {
            content: [
                "main-display",
                ["prestige-button"],
                "prestige-button",
                "blank",
                "milestones",
                ["toggles", ['j', "gain"], ['j','buy'],['j','autobuy']],
                ],
        
        },
        "Upgrades": {
            content: [
                "main-display",
                ["prestige-button"],
                "prestige-button",
                "blank",
                "upgrades"
                ],
        },
        "Challenges": {
            unlocked() {return hasMilestone('j',4)},
            content: [
                "main-display",
                ["prestige-button"],
                "prestige-button",
                "blank",
                "challenges"
                ],
        },
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
    hotkeys: [
        {key: "j", description: "J: Reset gain jingu", onPress(){
            if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return hasUpgrade('p', 45) || player["j"].best >= 1 },          // Returns a bool for if this layer's node should be visible in the tree.
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
            toggles:[
                ['j','gain'],
            ]
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
            toggles:[
                ['j','buy'],
            ]
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
        13: {
            unlocked(){ return player["j"].points >= 25},
            requirementDescription: "30 jingu masteries",
            effectDescription: "x5 PP autobuy speed",
            done() { return player["j"].points >= 30 },
        },
        14: {
            unlocked(){ return player["j"].points >= 30},
            requirementDescription: "40 jingu masteries",
            effectDescription: "Autobuy jingu and tiger claw",
            done() { return player["j"].points >= 40 },
            toggles:[
                ['j','autobuy']
            ],
        },
        15: {
            unlocked(){ return player["j"].points >= 40},
            requirementDescription: "50 jingu masteries",
            effectDescription: "Jingu and tiger claw reset nothing",
            done() { return player["j"].points >= 50 },
        },
    },
    upgrades:{
        11: {
            title: "New mastery",
            description(){ if(!shiftDown) {return "Multiplies PP gain per every jingu you have"}
            else {return "Boost base and base cap is 10"}},
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
            description(){ if(!shiftDown) {return "Increases jingu layer effect per every jingu you have"}
            else {return "Base cap at 10 jingu, upgrade base is +0.07"}},
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
            description(){ if(!shiftDown) {return "Increases '19? Yes' effect per every jingu you have"}
            else {return "Provides additive bonus"}},
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
                let eff = new Decimal(3)
                eff = eff.add(buyableEffect('TC',24))
                return eff;
            },
        },
        24: {
            unlocked(){ return hasMilestone('j',7)},
            title: "CSP-032",
            description(){ if (!shiftDown){ return "+1 to jingu milestone 10 cap per every 4 jingu you have, ^1.001 bao gain per every jingu you have"}
            else {return 'Second effect is uncapped and scales additively'}},
            cost: new Decimal(21),
            effect(){
                let eff = {}; let threshold = 4
                threshold -= buyableEffect('TC',23)
                eff.first = Math.floor(player['j'].points / threshold);
                eff.second = 1 + (0.001 * player['j'].points);
                return eff;
            },
            effectDisplay(){
                return ("+" + format(tmp['j'].upgrades[24].effect.first) + ", ^" + format(tmp['j'].upgrades[24].effect.second))
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
                let eff = new Decimal(10);
                eff = eff.add(buyableEffect('TC', 21))
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
            onComplete(){
                if (!hasUpgrade('TC',34)){return Math.floor(1.5 * challengeCompletions('j', 12))}
                else{return Math.floor(1.5 * challengeCompletions('j', 12) * upgradeEffect('TC',34))}},
            completionLimit(){
                let eff = new Decimal(10);
                eff = eff.add(buyableEffect('TC', 21))
                return eff;
            }
        },
        13: {
            unlocked(){
                return hasMilestone('j',9)
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
                let eff = new Decimal(10);
                eff = eff.add(buyableEffect('TC', 21))
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
                let eff = new Decimal(10);
                eff = eff.add(buyableEffect('TC', 21))
                return eff;
            }
        },
        22: {
            unlocked(){
                return hasMilestone('j', 12)
            },
            name: "Torn flesh",
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
                let eff = new Decimal(10);
                eff = eff.add(buyableEffect('TC', 21))
                return eff;
            }
        },
    }
}
)
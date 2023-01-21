let modInfo = {
	name: "The Bao Tree",
	id: "Mod #322",
	author: "fEvarto",
	pointsName: "bao",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Bao Tree",
	discordLink: "https://discord.gg/wAv6EHtMtf",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2: Tiger Claw",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v0.2: Tiger Claw</h2><br>
		- Brand new layer - Tiger claw - based on subcurrency - tiger experience <br>
		- Achievements layer have been deleted - soon new feature will be presented <br>
		- Massive boosts' rebalance <br>
	<h3>Balance changes and bugfixes</h3><br>
		- Fixed wrong names and descriptions of boosts <br>
		- Fixed bug with "Fight in octagon" granted +2 to (1,1) base instead of +1.5 <br>
		- "Triplet": PP gain: +15% -> +33% <br>
		- "Hexagon": PP gain: 8% -> 10% per upgrade <br>
		- "Hept-up": formula has changed: log10(x) -> 1 + log12(x) (minimum log effect is still x1)<br>
		- "Experiment 011": "Hexagon" base multiplier: x2.5 -> x2 <br>
		- "DLC is $20": now reduces "Hept-up" logarithm base scaling (compensates nerf) <br>
		- Jingu milestone 2: no longer reduces "Find out your hidden bao" cost scaling, now increases its base by 0.5% per every jingu you have<br>
		- "Find out your hidden bao": cost scaling was reduced (so former jingu milestone 2 boost is compensated)<br>
		- Jingu milestone 7: no longer increases "Find out your hidden bao" base, now multiplies "Hept-up" effect by x1.01 per every jingu you have(compounding)<br>
		- Jingu challenge 3: unlocks at: 18 -> 17 jingu, now mentions in jingu milestone 10
		- "Afraid of Heights": "Higher to soar..." effect increasing: +0.2 -> +0.25, cap: 20 -> 16 jingu (max effect remained the same)<br>
	<h3>Current endgame: 23 tiger claws, 28 jingu, ~e117 bao</h3>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	
	let gain = new Decimal(1)
	if (hasUpgrade('p', 11)) {gain = gain.add(upgradeEffect('p', 11))}
	if (hasUpgrade('p', 15)) {gain = gain.times(upgradeEffect('p', 15))}
	gain = gain.times(buyableEffect('p', 11)) //buyable p, 11
	if (hasUpgrade('p', 22)) {gain = gain.times(upgradeEffect('p', 22))}
	if (hasUpgrade('p', 24)) {gain = gain.times(upgradeEffect('p', 24))}
	if (hasUpgrade('p', 25)) {gain = gain.times(upgradeEffect('p', 25))}
	gain = gain.times(tmp['j'].effect)
	if(hasUpgrade('j',13)) {gain = gain.times(tmp['j'].upgrades[11].effect.second)}
	if(hasUpgrade('j',24)) {gain = gain.pow(tmp['j'].upgrades[24].effect.second)}
	if (hasUpgrade('p', 43)) {gain = gain.pow(upgradeEffect('p', 43))}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return (player.points.gte(new Decimal("1e94")))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
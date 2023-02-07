let modInfo = {
	name: "The Bao Tree",
	id: "Mod #322",
	author: "fEvarto",
	pointsName: "bao",
	modFiles: ["layers/PP.js", "layers/j.js", "layers/TC.js", "tree.js"],

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
	<h2>v0.2.1: Tiger Galaxy</h2><br>
		- New tiger claw layer feature - tiger galaxy <br>
		- TOOLTIP: all features have been distributed to subtabs <br>
		- Boosts' rebalance <br>
	<h3>Balance changes and bugfixes</h3><br>
		- Fixed bug with tiger experience gain on 0 TC (other values remained the same) <br>
		- Fixed wrong endgame (again) <br>
		- 'Lost opportunities': effect base have been increased: x1.1 -> x1.125 <br>
		- PP upgrades no longer increases 'Lost opportunities' base <br>
		- 'Fight in octagon': no longer increases 'You gonna start somewhere' base, now doubles 'Triplet' effect instead <br>
		- 'Prestige tr14l': no longer reduces 'Practice makes perfect' cost, now adds 14 to both 'Practice makes perfect' and 'You gonna start somewhere' base <br>
		- Second row of TC upgrades: requires: 100000 -> 20000 to unlock
	<h3>Current endgame: 56 tiger claws, 48 jingu, up to e280 bao</h3>`

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
	if(!canGenPoints()){return new Decimal(0)}
	else{
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
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {

}}

// Display extra things at the top of the page
var displayThings = [

]

// Determines when the game "ends"
function isEndgame() {
	return (player.points.gte(new Decimal(1e322)))
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
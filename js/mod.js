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
	num: "0.1: Jingu Mastery",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v0.1.3: Jingu Pantheon, pt. III</h2><br>
		- Last Jingu Pantheon upgrade before brand new layer <br>
		- Much QoL changes <br>
		- Jingu layer became larger<br>
	<h3>What's new in layer</h3><br>
		- 2 challenges<br>
		- 3 upgrades<br>
		- 2 milestones<br>
	<h3>Balance changes and bugfixes</h3><br>
		- Fixed bug with fourth buyable visibility <br>
		- Achievement "Lucky man" deleted due to bugs <br>
		- Jingu layer: now has base cap at 20 jingu <br>
		- Jingu milestone 5: now makes PP upgrades (one milestone earlier) and buyables visible(QoL)<br>
		- Jingu milestone 6: no longer makes upgrades visible, now autobuys PP buyables instead(QoL)<br>
		- Jingu challenge 2: jingu cap: 1 -> 1.5 per completion (rounded down) <br>
	<h3>Current endgame: 22 jingu, ~e84 bao</h3>`

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
	gain = gain.times(tmp['a'].effect)
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
	return (player.points.gte(new Decimal("1e84")))
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
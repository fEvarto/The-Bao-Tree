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
	name: "Jingu Mastery",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v0.1: Jingu Mastery</h2><br>
		- Part of second achievements row <br>
		- A whole new layer! Yeah<br>
	<h3>What does it contain?</h3><br>
		- 5 milestones<br>
		- 3 upgrades<br>
		<br>
	<h3>Rebalancing and bug fixes</h3><br>
		- Fixed bug when (4,1) effect worked on upgrades in his row without buying upgrade<br>
		- Second buyable: base scaling became better<br>
		- Third buyable: doubled based effect<br>
		- (1,4): now adds 0.25 to (1,1) base<br>
		- (2,3): (1,1) base was reduced: +2 -> +1.5<br>
		- (4,2): 3rd buyable multiplier: x2 -> x1.5, 2nd buyable scaling: ~40% -> ~50%<br>
		- (4,4): no longer affects (2,2) and (2,5), adds 1 -> 2 to mult<br>
	<h3>Beta: Discord server</h3><br>
	<h3>Current endgame: 8 jingu, ~e30 bao, ~e25 PP</h3>`

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
	return (player.points.gte(new Decimal("1e30")))
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
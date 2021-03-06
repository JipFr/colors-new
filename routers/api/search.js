
const { get_palette, get_collection } = require("../../util");
const { get_user } = require("../../util/user");

module.exports = async (req, res) => {
	let query = decodeURIComponent(req.body.query);

	/**
	 * PALETTES
	 */
	let palettes = db.collection("palettes");
	await palettes.createIndex({
		name: "text"
	});
	let relevantPalettes = await palettes.find({
		$text: {
			$search: query
		}
	}).toArray();
	let relevantPaletteIds = relevantPalettes.filter(i => i).map(p => p.id);
	
	// Now map it to get_user so that private information and such is removed
	let newPalettes = await Promise.all(relevantPaletteIds.filter(i => i).map(id => get_palette(id, (req.user || {}).id)));

	/** 
	 * USERS
	 */
	let users = db.collection("users");
	await users.createIndex({
		slug: "text",
		"user.displayName": "text"
	});
	let relevantUsers = await users.find({
		$text: {
			$search: query
		}
	}).toArray();
	
	let newUsers = await Promise.all(relevantUsers.map(u => get_user(u.id)));
	newUsers = newUsers.map(u => {
		return {
			slug: u.slug,
			name: u.user.displayName,
			id: u.id,
			bio: u.bio	
		}
	});

	/**
	 * COLLECTIONS
	 */
	let collections = db.collection("collections");
	await collections.createIndex({
		slug: "text",
		description: "text",
		title: "text",
	});
	let relevantCollections = await collections.find({
		$text: {
			$search: query
		}
	}).toArray();
	let relevantCollectionIds = relevantCollections.map(p => p.id);
	
	// Now map it to get_user so that private information and such is removed
	let newCollections = await Promise.all(relevantCollectionIds.map(id => get_collection(id)));


	res.json({
		palettes: newPalettes.filter(i => i).slice(0, 10),
		users: newUsers.filter(i => i).slice(0, 10),
		collections: newCollections.filter(i => i).slice(0, 10)
	});

}
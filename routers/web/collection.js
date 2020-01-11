const { get_user } = require("../../util/user");
const { get_current_page } = require("../../util");
const { universal_handlebar } = require("../../config.json");

// User page router
const user_router = async (req, res) => {
	
	let user = await get_user(req.user.id);
	let prefix = "";
	let page_collection = {
		title: "Collectie test",
		description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
		members: [
			{
				"slug": "jip",
				"role": "admin"
			},
			{
				"slug": "mevrouwjip",
				"role": "member"
			}
		]
	}
	let current_page = "main";

	let user_is_member = page_collection.members.find(u => u.slug === user.slug);
	let user_role = user_is_member ? user_is_member.role : null;

	res.render("collection_wrapper", {
		layout: "main",
		user: user,
		page: {
			collection: page_collection
		},
		current_page,
		universal: universal_handlebar,
		head_title: page_collection ? `${prefix}${page_collection.title}` : "Collection not found",
		palettes: req.params.palette,
		is_admin: true
	});
}

module.exports = user_router;
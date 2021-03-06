
const user_id = document.body.dataset.you;
let collection_slug = document.querySelector(".settings_wrapper").dataset.collectionSlug;
let members;

function init() {

	console.log("Better start rendering members");

	fetch("/api/c/get_members", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			collection_slug,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}

		members = d.members;
		render_members();

	});

}

window.addEventListener("load", init);

function render_members() {
	let member_div = document.querySelector(".member_settings_members");
	member_div.innerHTML = "";

	for(let member of members) {
		let node = document.importNode(document.querySelector("template.user_small").content, true);
		

		node.querySelector(".user_small").setAttribute("data-person-username", member.slug);
		node.querySelector(".user_small_pfp").src = `/image/${member.id}`;
		node.querySelector(".username").href = `/u/${member.slug}/`;
		node.querySelector(".name_main").innerHTML = member.display;
		node.querySelector(".username").innerHTML = `u/${member.slug}`;

		node.querySelector(".person_control_toggle_write").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-command"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>`;
		node.querySelector(".person_control_toggle_write").removeAttribute("onclick");
		if(member.role === "admin") {
			node.querySelector(".person_control_toggle_write").setAttribute("data-can-write", true);
			node.querySelector(".person_control_toggle_write").classList.add("write");
		}

		if(!member.is_owner) {
			node.querySelector(".person_control_toggle_write").addEventListener("click", evt => {
				let el = evt.currentTarget;
				let username = el.closest("[data-person-username]").dataset.personUsername;
				set_person_permissions(username, collection_slug, el.classList.contains("write") ? "member" : "admin");
			});
		}

		node.querySelector(".person_control_remove").removeAttribute("onclick");
		node.querySelector(".person_control_remove").addEventListener("click", () => {
			console.log(member.id);
			toggle_member(member.id, false);
		});

		if(member.is_owner || member.id === user_id) {

			if(member.id === user_id) {
				node.querySelector(".user_small").classList.add("is_self");
			}

			node.querySelector(".person_control_remove").remove();
			node.querySelectorAll(".person_control").forEach(el => {
				el.removeAttribute("onclick");
			});
		}


		member_div.appendChild(node);
	}

}


function set_title(new_title) {
	fetch("/api/c/set_title", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_title,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.reload();
	});
}

function set_color(new_color) {
	fetch("/api/c/set_color", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_color,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.reload();
	});
}

function set_bio(new_bio) {
	fetch("/api/c/set_bio", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_bio,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.reload();
	});
}

function set_slug(new_slug) {
	fetch("/api/c/set_slug", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			new_slug,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		location.href = `/c/${d.new_slug}/settings/`;
	});
}


function toggle_member(member_slug, add = true) {
	fetch("/api/c/toggle_member", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			member_slug,
			add,
			collection: collection_slug
		})
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		document.querySelector("#add_member").value = "";
		init();
	});
}

function set_person_permissions(username, collection, new_role) {
	console.log(username, collection, new_role);
	fetch("/api/c/set_person_permissions/", {
		method: "POST",
		body: JSON.stringify({
			collection,
			username,
			new_role
		}),
		headers: {
			"content-type": "application/json"
		}
	}).then(d => d.json()).then(d => {
		if(d.status !== 200) {
			create_overlay({
				title: d.err,
				btn_value: "OK",
				on_submit: _ => true,
				can_cancel: false,
				fields: []
			});
			return;
		}
		members = d.members;
		render_members();
	});
}

function delete_collection() {
	let current_title = document.querySelector("[data-current-title]").dataset.currentTitle;
	create_overlay({
		title: `Really delete ${current_title}?`,
		btn_value: "Delete collection",
		btn_is_delete: true,
		on_submit: res => {
			really_delete_collection();
			return true;
		},
		can_cancel: true,
		fields: []
	});
	return;
}

function really_delete_collection() {
	fetch("/api/c/delete_collection", {
		method: "POST",
		body: JSON.stringify({
			collection: collection_slug
		}),
		headers: {
			"content-type": "application/json"
		}
	}).then(d => d.json()).then(d => {
		console.log(d);
		if(d.status === 200) {
			location.href = d.url;
		}
	});
}
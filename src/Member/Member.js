const Message = require("../Message/Message");

class BaseChannel {
	constructor() {
		this.messages = new Map();
	}
}

class Member extends BaseChannel {
	constructor(username, id, avatar, permissions) {
		super();

		this.username = username;

		this.id = id;

		this.avatar = avatar;
		this.permissions = permissions;
	}
}

module.exports = Member;

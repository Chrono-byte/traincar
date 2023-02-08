class BaseChannel {
	constructor() {
		this.messages = new Map();
	}
}

class Channel extends BaseChannel {
	constructor(id, name, description, owner, client) {
		super();

		this.name = name;
		this.description = description;

		this.id = id;

		this.members = new Map();

		this.owner = owner;

		this.client = client;
	}

	send(message) {
		this.client.socket.json({
			op: 0,
			type: "MESSAGE",
			data: {
				content: message.content,
				reply: {
					yes: (message.reply ? true : false),
					message: message.reply
				}
			}
		});
	}
}

module.exports = { Channel };

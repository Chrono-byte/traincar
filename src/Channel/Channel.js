const Message = require("../Message/Message");

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
		var msg;

		if (typeof message == "object") {
			// Create a new message
			msg = new Message(message, this.client, this.id);

			// restrucure the message
			msg = {
				content: msg.content,
				channel: msg.channel.id
			};

			// send the message to the server
			this.client.socket.json({
				op: 0,
				data: msg,
				type: "MESSAGE"
			});
		} else if (typeof message == "string") {
			// Create a new message
			msg = new Message(message, this.client, this.id);

			// restrucure the message
			msg = {
				content: msg.content,
				channel: this.id
			};

			// send the message to the server
			this.client.socket.json({
				op: 0,
				data: msg,
				type: "MESSAGE"
			});
		}
	}
}

module.exports = { Channel };

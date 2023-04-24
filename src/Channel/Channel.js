import Message from "../Message/Message.js";

class BaseChannel {
	constructor() {
		this.messages = new Map();
	}
}

class Channel extends BaseChannel {
	#client;

	constructor(channel, client) {
		super();

		this.name = channel.name;
		this.description = channel.description;

		this.id = channel.id;

		this.members = new Map();

		this.owner = channel.owner;

		this.#client = client;
	}

	send(message) {
		let msg;

		if (typeof message == "object" || typeof message == "string") {
			// Create a new message
			msg = new Message(message, this.#client, this.id);

			// restrucure the message
			msg = {
				content: msg.content,
				channel: this.id,
			};

			// send the message to the server
			this.#client.socket.json({
				op: 0,
				data: msg,
				type: "MESSAGE"
			});
		} else {
			throw new TypeError("Message must be a string or object");
		}
	}
}

export default Channel;

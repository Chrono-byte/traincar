class Message {
	constructor(data, client) {
		this.content = data.content;
		this.author = data.author;
		this.channel = client.channels.get(data.channel.id);
	}

	reply(message) {
		this.channel.send(message);
	}
}

module.exports = Message;
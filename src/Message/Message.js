class Message {
	constructor(data, client, channel) {
		this.content = (data.content ? data.content : data);
		this.author = data.author;
		this.channel = client.channels.get(data.channel?.id) || channel;

		this.createdAt = new Date();

		this.client = client;
	}

	reply(content) {
		this.channel.send(content, this.id);
	}
}

module.exports = Message;

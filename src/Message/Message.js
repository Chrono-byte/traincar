class Message {
	#client;

	constructor(data, client, channel) {
		this.content = (data.content ? data.content : data);
		this.author = data.author;
		this.channel = client.channels.get(data.channel?.id) || channel;

		this.createdAt = new Date();

		this.#client = client;

		this.id = data.id;
	}

	reply(content) {
		this.channel.send(content, this.id);
	}
}

export default Message;

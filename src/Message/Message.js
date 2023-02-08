class Message {
	constructor(data, client, replyingTo) {
		this.content = data.content;
		this.author = data.author;
		this.channel = client.channels.get(data.channel.id);

		this.reply = {
			yes: (replyingTo ? true : false),
			message: replyingTo
		};
	}

	reply (content) {
		this.channel.send({
			content: content,
			replyingTo: this.id
		});
	}
}

module.exports = Message;

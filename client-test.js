"use strict";

/*
 * Hammer - A simple WebSocket-based chat server & client written in JavaScript.
 *
 * Traincar - Simple API wrapper for Hammer.
 *
 * Copyright (C) 2023 Michael G. <chrono@disilla.org>
 * All rights reserved.
*/

const { Client } = require("./src/index.js");
const client = new Client({
	hostname: "localhost",
	port: 8080
});


client.on("message", (message) => {
	console.log(`Received message from ${message.author.username} (${message.author.id}): ${message.content}`);

	// regex to match "Hello, NAME"
	const regex = /^Hello, ([a-zA-Z0-9]+)!$/;

	// if the message matches the regex
	switch (message.content) {
		case "Hello, world!":
			if (client.username == "chrono") {
				message.reply(`Hello, ${message.author.username}!`);

				console.log("greetings sent");
				return;
			}
			if (client.username == "admin") {
				message.reply(`Hello, ${message.author.username}!`);

				console.log("greetings sent");
				return;
			}
			break;
		default:
			if (regex.test(message.content)) {
				console.log("greetings received");
				return;
			}
			break;

	}
});

client.on("ready", () => {
	// log our username and id
	console.log(`Logged in as ${client.username} (${client.id})`);

	// log the size of our channels and users
	console.log(`Channels: ${client.channels.size}`);
	console.log(`Users: ${client.members.size}`);

	// search for a channel named "general"
	const channel = client.channels.find("general");

	// if the channel exists
	if (channel) {
		// send a message to the channel
		channel.send("Hello, world!");
	}
});

client.on("joinChannel", (channel) => {
	console.log(`Joined channel ${channel.name} (${channel.id}) with description ${channel.description}`);
});

client.on("logout", () => {
	console.log("Logged out");
});

if (process.argv[2] === "1") {
	client.login("admin@disilla.org", "password");
} else if (process.argv[2] === "2") {
	client.login("me@disilla.org", "password");
} else {
	throw new Error("Invalid user");
}

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
const client = new Client("localhost", 8080);

client.on("message", (message) => {
	console.log(message);
});

client.on("ready", () => {
	// log our username and id
	console.log(`Logged in as ${client.username} (${client.id})`);

	// log size of client.channels
	console.log(`Loaded ${client.channels.size} channels.`);

	// create a new channel, then join it, then list the channel's owner
	// client.createChannel(`test${Math.floor(Math.random() * 10000)}`, "test channel").then((channel) => {
	// 	console.log(`Created channel ${channel.name} (${channel.id}) with description ${channel.description}`);
	// 	client.joinChannel(channel.id).then((channel) => { });
	// });

	client.channels.forEach((channel) => {
		console.log("Sending message to channel " + channel.name);
		channel.send("Hello, world!");
	});
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

// client.logout();

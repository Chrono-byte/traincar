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
})

client.on('ready', () => {
    // log our username and id
    console.log(`Logged in as ${client.username} (${client.id})`);

    // check the status of the server
    client.api.status().then((status) => {
        console.log(`Server Name: ${status.name}`);
        console.log(`Server Description: ${status.description}`);

        console.log(status);
    })
})

client.on("joinChannel", (channel) => {
    console.log(`Joined channel ${channel.name} (${channel.id}) with description ${channel.description}`);
})

client.on("logout", () => {
    console.log("Logged out");
})

client.login("admin@disilla.org", "password");

// client.logout();
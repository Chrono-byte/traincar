"use strict";

/*
 * Hammer - A simple WebSocket-based chat server & client written in JavaScript.
 *
 * Traincar - Simple API wrapper for Hammer.
 *
 * Copyright (C) 2023 Michael G. <chrono@disilla.org>
 * All rights reserved.
*/

const { Client } = require("./src/Client/client");
const client = new Client("localhost", 8080);

client.on("message", (message) => {
    console.log(message);
})

client.on('ready', () => {
    // log our username and id
    console.log(`Logged in as ${client.username} (${client.id})`);

    // check the status of the server
    // client.api.getStatus().then((status) => {
    //     console.log(status);
    // })

    // try to create a new channel
    client.createChannel("test");
});

client.on("logout", () => {
    console.log("Logged out");
})

// login
client.login("admin@disilla.org", "password");
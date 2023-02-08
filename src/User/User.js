"use strict";

/*
 * Hammer - A simple WebSocket-based chat server & client written in JavaScript.
 *
 * Traincar - Simple API wrapper for Hammer.
 *
 * Copyright (C) 2023 Michael G. <chrono@disilla.org>
 * All rights reserved.
*/

class User {
	constructor(id, username, permissions) {
		this.id = id;
		this.username = username;
		this.permissions = permissions;
	}
}

module.exports = { User };

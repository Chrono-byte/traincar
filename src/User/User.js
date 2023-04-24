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
	constructor(user) {
		this.username = user.username;
		this.id = user.id;
		this.avatarURL = user.avatarURL;
		this.permissions = user.permissions;

		this.joinedAt = user.joinedAt;
	}
}

export default User;

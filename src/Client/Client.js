"use strict";

/*
 * Hammer - A simple WebSocket-based chat server & client written in JavaScript.
 *
 * Traincar - Simple API wrapper for Hammer.
 *
 * Copyright (C) 2023 Michael G. <chrono@disilla.org>
 * All rights reserved.
*/

const { WebSocket } = require("ws");
const { EventEmitter } = require("events");

const { Channel } = require("../Channel/Channel");
const { User } = require("../User/User");
const Message = require("../Message/Message");

// hammer client
class Client extends EventEmitter {
	constructor(host, port) {
		super();

		// set host and port
		this.host = host;
		this.port = port;

		// client user
		// this.user = new User();

		// handle messages from the client
		this.messageEmitter = new EventEmitter();

		// initialize data structures
		this.channels = new Map();
		this.users = new Map();
	}

	login(username, password) {
		// authenticate with the auth server
		fetch(`http://${this.host}:${this.port + 1}/auth/login/email?username=${username}&password=${password}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			} else if (response.status === 500) {
				throw new Error(`Internal server error ${response.body}`);
			} else if (response.status === 422) {
				throw new Error("Invalid username or password");
			} else {
				throw new Error(`Unknown error ${response.status}`);
			}
		}).then(data => {
			// check that token is valid
			if (data.token == null) {
				throw new Error("Invalid token");
			}

			// set token
			this.token = data.token;

			// set username and id
			this.username = data.username;
			this.id = data.id;

			// connect to websocket
			this.emit("login");
		}).catch(error => {
			if (error.code === "ECONNREFUSED") {
				throw new Error("Server is offline");
			} else if (error.code === "ECONNRESET") {
				throw new Error("Server is offline");
			} else {
				console.error(error);
			}
		});


		this.on("login", () => {
			// connect to websocket
			try {
				// connect to websocket
				this.socket = new WebSocket(`ws://${this.host}:${this.port}?token=${this.token}`);
			} catch {
				console.error("Failed to connect to server");
				// emit the logout event
				this.emit("logout");
			}

			// once the socket is open
			this.socket.onopen = (event) => {
				//
			};

			// when socket is closed, emit the close event
			this.socket.onclose = () => {
				// remove all client data
				this.channels.clear();
				this.users.clear();
				this.username = null;
				this.id = null;
				this.token = null;
				this.user = null;

				// set socket to closed

				// emit the logout event
				this.emit("logout");
			}

			// handle conection errors
			this.socket.onerror = (error) => {
				console.error(`WebSocket error: ${error.message}`);
			}

			// Listen for messages from the server
			this.socket.onmessage = (event) => {
				let message;

				try {
					message = JSON.parse(event.data);
				} catch {
					throw new Error("Could not parse message");
				}

				if (message.op == 9 && message.type == "ERROR") {
					throw new Error(`Error: ${message.data.message}`);
				}

				switch (message.type) {
					case "HELLO":
						if (message.data.message == "Authorized" && message.op == 10) {
							// send HELLO
							this.socket.send(JSON.stringify({
								op: 11,
								data: {
									heartbeat_interval: 1000,
									heartbeat_timeout: 5000
								},
								type: "IDENTIFY"
							}))

							// wait 125ms then request channels on the server
							setTimeout(() => {
								// get all channels that the user is in api:port/api/user/:id/channels
								fetch(`http://${this.host}:${this.port + 1}/api/user/${this.id}/channels`, {
									method: 'GET',
									headers: {
										'Content-Type': 'application/json',
										'Authorization': `${this.token}`
									}
								}).then(response => {
									if (response.status === 200) {
										return response.json();
									} else if (response.status === 500) {
										throw new Error(`Internal server error ${response.body}`);
									} else if (response.status === 401) {
										throw new Error("Invalid username or password");
									} else {
										throw new Error(`Unknown error ${response.status}`);
									}
								}).then(data => {
									// add all channels to the client
									for (let channel of data) {
										channel = channel[1];

										var { id, name, description, owner } = channel;

										this.channels.set(id, new Channel(id, name, description, owner, this));
									}

									// emit the ready event
									this.emit("ready");
								}).catch(error => {
									console.error(`Failed to get channels: ${error}`);
								});
							}, 125);

							// wait 250ms then request users on the server
							/* setTimeout(() => {
								// get all users on the server api:port/api/users
								fetch(`http://${this.host}:${this.port + 1}/api/users`, {
									method: 'GET',
									headers: {
										'Content-Type': 'application/json',
										'Authorization': `${this.token}`
									}
								}).then(response => {
									if (response.status === 200) {
										return response.json();
									} else if (response.status === 500) {
										throw new Error(`Internal server error ${response.body}`);
									} else if (response.status === 401) {
										throw new Error("Invalid username or password");
									} else {
										throw new Error(`Unknown error ${response.status}`);
									}
								}).then(data => {}).catch(error => {
									console.error(`Failed to get users: ${error}`);
								});
							}, 250); */
						} else {
							throw new Error(`Error: ${message.data.message}`);
						}
						break;
					case "HEARTBEAT":
						// send heartbeat ack
						this.socket.send(JSON.stringify({
							op: 11,
							data: {},
							type: "HEARTBEAT_ACK"
						}))

						this.emit("heartbeat", message);
						break;
					case "MESSAGE": // message event

						// create a new message object
						let msg = new Message(message.data, this);

						// remove the recursive Client object from the message
						delete msg.channel.client;

						this.emit("message", msg);
						break;
					case "CHANNEL_JOIN":
						// set channel convenience variable
						var channel = message.data.channel;

						// add channel to channels map
						this.channels.set(channel.id, new Channel(channel.name, channel.description, channel.id, channel.owner, this));

						// emit the joinChannel event with the channel
						this.emit("joinChannel", this.channels.get(message.data.channel.id));
						break;
					case "CHANNEL_LEAVE": // leave channel event
						this.emit("leaveChannel", message);
						break;
					case "CHANNEL_UPDATE": // update channel event
						this.emit("updateChannel", message);
						break;
					case "CREATE_USER": // create user event
						this.emit("createUser", message);
						break;
					case "UPDATE_USER":
						this.emit("updateUser", message);
						break;
					case "DELETE_USER":
						this.emit("deleteUser", message);
						break;
					case "UPDATE_USER":
						this.emit("updateUser", message);
						break;
					case "UPDATE_MEMBERS":
						// get the channel that the members are being updated for
						var channel = this.channels.get(message.data.channel);

						// update the members
						channel.members = message.data.members;

						this.emit("updateMembers", message);
						break;
					default:
						console.error(`Unknown message type from server, most likely a bug or an unimplemented feature ${message.type}`);
						break;
				}

				// console.log(`[message] Data received from server: ${event.data}`);
			};
		});
	}

	logout() {
		try {
			this.socket.close();
		} catch {
			console.error("Failed to close socket, most likely not connected to server");
		}
	}

	joinChannel(channel) {
		return fetch(`http://${this.host}:${this.port + 1}/api/channels/${channel}/members`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `${this.token}`
			}
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
			if (response.status === 500) {
				throw new Error("Internal server error");
			}
		}).then(data => {
			return data;
		}).catch(error => {
			console.log(error);
		});
	}

	leaveChannel(channel) {

	}

	deleteChannel(channel) {
		return fetch(`http://${this.host}:${this.port + 1}/api/channels/${channel}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `${this.token}`
			}
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then(data => {
			appendMessage("Channel deleted: " + data.channelName);
		}).catch(error => {
			console.log(error);
		});
	}

	createChannel(channel, description) {
		return fetch(`http://${this.host}:${this.port + 1}/api/channels`, {
			body: JSON.stringify({
				"name": channel,
				"description": description
			}),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `${this.token}`
			}
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			} else if (response.status === 409) {
				throw new Error(`Channel ${channel} already exists`);
			} else if (response.status === 406) {
				throw new Error("Channel name must be alphanumeric and lowercase");
			} else if (response.status === 401) {
				throw new Error("Unauthorized: Invalid token");
			} else if (response.status === 403) {
				throw new Error("Forbidden: You do not have permission to create channel");
			} else if (response.status === 404) {
				throw new Error("Not Found: Invalid channel id");
			} else if (response.status === 500) {
				throw new Error("Internal server error");
			} else {
				// throw new Error(`Error: ${response.status} - ${response.statusText}`);
			}
		}).then(data => {
			this.emit("CREATE_CHANNEL", data.id);
			return data;
		}).catch(error => {
			console.log(error);
		});
	}

	getChannelInfo(channel) {
		return fetch(`http://${this.host}:${this.port + 1}/api/channels/${channel}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application',
				'Authorization': `${this.token}`
			}
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then(data => {
			return data;
		}).catch(error => {
			console.log(error);
		}
		);
	}

	api = {
		// gets the status + brand of the server
		status: () => {
			return fetch(`http://${this.host}:${this.port + 1}/api/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${this.token}`
				}
			}).then(response => {
				if (response.status === 200) {
					return response.json();
				}
			}).then(data => {
				return data;
			}).catch(error => {
				console.log(error);
			});
		}
	}


}

module.exports = Client;

var client_store;

class BaseChannel {
  constructor() {
    this.messages = new Map();
  }
}

class Channel extends BaseChannel {
  constructor(name, description, id, owner) {
    super();

    this.name = name;
    this.description = description;

    this.id = id;

    this.members = new Map();

    this.owner = owner;
  }

  send(message) {
    console.log(`Sending message to channel ${this.id}: ${message}`);;
  }
}

class DirectMessageChannel extends BaseChannel {
  constructor(id, members) {
    super();

    this.id = id;

    this.members = [1, 2];
  }
}

module.exports = { Channel };

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

    client_store = client
  }

  send(message) {
    console.log(`Sending message to channel ${this.id}: ${message}`);;
  }
}

module.exports = { Channel };

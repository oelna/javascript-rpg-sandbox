const ROOM = class {
	constructor(name, id, attributes = {}, connections = {}) {
		this.name = name;
		this.id = id || ('_' + Math.random().toString(36).substr(2, 6));
		this.attributes = {};
		this.connections = {};

		// merge custom with default values
		Object.assign(this.attributes, {
            'setting': 'dungeon',
			'difficulty': 1,
			'visited': false,
			'requires': []
        }, attributes);

        Object.assign(this.connections, {
            'front': null,
            'back': null,
            'left': null,
            'right': null
        }, connections);
	}

	enter() {
		console.log();
	}

	leave() {
		console.log('You hasten your pace to get out of this place');
	}

	/*
	get id() {
		return this.id;
	}

	set id(id) {
		this.id = id;
	}
	*/
}

export {ROOM};

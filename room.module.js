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
			'requires': []
        }, attributes);

        Object.assign(this.connections, {
            'front': null,
            'back': null,
            'left': null,
            'right': null
        }, connections);
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

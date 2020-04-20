const CHARACTER = class {
	constructor(name, attributes = {}) {
		this.name = name;
		this.attributes = {};

		// merge custom with default values
		Object.assign(this.attributes, {
            'strength': 3,
			'constitution': 3,
			'dexterity': 3,
			'intelligence': 3,
			'wisdom': 3,
			'charisma': 3
        }, attributes);
	}

	attack() {
		alert('boink!');
	}
}

export {CHARACTER};

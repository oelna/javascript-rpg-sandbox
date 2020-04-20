import {RANDOM} from './random.module.js';
import {TITLES} from './titles.module.js';

const ITEM = class {
	constructor(name, id, attributes = {}) {
		this.name = name;
		this.id = id || ('_' + Math.random().toString(36).substr(2, 6));
		this.attributes = {};

		// merge custom with default values
		Object.assign(this.attributes, {
            'strength': 0,
			'constitution': 0,
			'dexterity': 0,
			'intelligence': 0,
			'wisdom': 0,
			'charisma': 0,
			'maxMana': 0,
			'maxHealth': 0,
			'resLightning': 0,
			'resFire': 0,
			'resCold': 0,
			'resPoison': 0
        }, attributes);
	}

	rerollStats() {
		let titles = new TITLES();
		let generator = new RANDOM();

		this.name = titles.generateTitle();

		for (const stat in this.attributes) {
			let newValue = generator.weighted([0,1,2,3,4], [16,8,4,2,1]);
			// console.log('stat', stat, newValue);
			this.attributes[stat] = newValue;
		}
	}
}

export {ITEM};

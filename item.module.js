import {RANDOM} from './random.module.js';
import {TITLES} from './titles.module.js';

const ITEM = class {
	constructor(name, id, type, attributes = {}) {
		this.name = name;
		this.id = id || ('_' + Math.random().toString(36).substr(2, 6));
		this.type = type;
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
		
		let generator = new RANDOM();
		this.type = generator.pick(['head', 'body', 'legs', 'hand', 'accessory', 'bracelet']);

		
		let titleOptions = {
			'type': ['Item'],
			'descriptor': ['Void', 'Blood', 'Burnt', 'Undead', 'Frozen', 'Night', 'Drowned', 'Moonlight', 'Sun', 'Poisoned', 'Invisible', 'Ancient'],
			'actor': ['Queen', 'Prince', 'King', 'Elder', 'Scholar', 'Statue', 'Serpent', 'Slave Master', 'Lord', 'Lady', 'Demon', 'Caretaker'],
			'sentences': [
				'{type} of the {descriptor} {actor}',
				'The {actor}\'s {descriptor} {type}',
				'The {actor}\'s {type}',
				// 'The {actor} and the {descriptor} {actor}',
				'The {descriptor} {type}'
			]
		};
		if (this.type === 'head') titleOptions.type = ['Cap', 'Crown', 'Tiara', 'Diadem', 'Hairdo'];
		if (this.type === 'body') titleOptions.type = ['Armor', 'Mail', 'Chain Mail', 'Plate', 'Breast Plate', 'Boiled Leather', 'Rags', 'Soiled Cloth', 'Cloak'];
		if (this.type === 'legs') titleOptions.type = ['Pants', 'Hotpants', 'Skirt'];
		if (this.type === 'hand') titleOptions.type = ['Sword', 'Club', 'Dagger', 'Scimitar', 'Brass Knuckles', 'Shield'];
		if (this.type === 'accessory') titleOptions.type = ['Ring', 'Bracelet', 'Emerald Ring', 'Diamond Ring', 'Sapphire Ring'];
		if (this.type === 'bracelet') titleOptions.type = ['Chain', 'Amulet'];
		let titles = new TITLES(titleOptions);
		this.name = titles.generateTitle();

		for (const stat in this.attributes) {
			let newValue = generator.weighted([0,1,2,3,4], [16,8,4,2,1]);
			// console.log('stat', stat, newValue);
			this.attributes[stat] = newValue;
		}
	}
}

export {ITEM};

const TITLES = class {
	constructor() {
		this.titles = {
			'type': ['Temple', 'Prison', 'House', 'Mansion', 'Dungeon', 'World', 'Castle', 'Graveyard', 'Library', 'Visage', 'Monument', 'Sin', 'Rise'],
			'descriptor': ['Void', 'Blood', 'Burnt', 'Undead', 'Frozen', 'Night', 'Drowned', 'Moonlight', 'Sun', 'Poisoned', 'Invisible', 'Ancient'],
			'actor': ['Queen', 'Prince', 'King', 'Elder', 'Scholar', 'Statue', 'Serpent', 'Slave Master', 'Lord', 'Lady', 'Demon', 'Caretaker'],
			'sentences': [
				'{type} of the {descriptor} {actor}',
				'The {actor}\'s {descriptor} {type}',
				'The {actor}\'s {type}',
				'The {actor} and the {descriptor} {actor}',
				'The {descriptor} {type}'
			]
		}
	}

	randomArrayItem(arr) {
		if (!arr || arr.length === 0) return false;

		return arr[Math.floor(Math.random() * arr.length)];
	}

	extractRandomArrayItem(name) {
		if (!name) return false;

		const randomIndex = Math.floor(Math.random() * this.titles[name].length);
		const extractedString = this.titles[name][randomIndex];

		// remove the string from the array
		this.titles[name].splice(randomIndex, 1);

		return extractedString;
	}

	generateTitle() {
		let sentence = this.randomArrayItem(this.titles.sentences);

		for (let item of ['type', 'descriptor', 'actor']) {
			// how many occurrences of this string?
			let pattern = new RegExp('{'+item+'}', 'g');
			const amount = (sentence.match(pattern) || []).length;

			// replace each occurrence with a unique random string
			for (let i = 0; i < amount; i += 1) {
				const word = this.extractRandomArrayItem(item);

				pattern = new RegExp('{'+item+'}');
				sentence = sentence.replace(pattern, word);
			}
		}

		return sentence;
	}
}

export {TITLES};

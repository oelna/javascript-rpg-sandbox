'use strict';

import {CHARACTER} from './character.module.js';
import {TITLES} from './titles.module.js';
import {BUBBLES} from './bubbles.module.js';
import {ROOM} from './room.module.js';
import {RANDOM} from './random.module.js';

var game = window.game || {};

game.init = function () {
	let warrior = new CHARACTER('Hector', {
		'strength': 10,
		'charisma': 5,
		'dexterity': 7
	});

	game.RANDOM = new RANDOM();
	game.TITLES = new TITLES();
	
	let room1 = new ROOM(
		game.TITLES.generateTitle(),
		'_' + game.RANDOM.string(4, 'abcdefghijklmnopqrstuvwxyz'),
		{
			'setting': 'dungeon',
			'difficulty': 3,
			'requires': [
				{ 'dexterity': 5 },
				{ 'dexterity': 5 }
			]
		},
		{
			'front': 'room2',
			'left': 'room3'
		}
	);
	console.log(room1);

	console.log(warrior.name, warrior.attributes);
	console.log('coin toss', game.RANDOM.bool());
	// console.log(game.TITLES.generateTitle());

	document.querySelector('h1').textContent = game.TITLES.generateTitle();

	let speech1 = new BUBBLES('#bubbles', [
		'One beautiful spring day during the 2020 pandemic, a very hairy man decided to abandon his quest to find an even younger, less pregnant girlfriend and decided to collaborate with the current, old, boring one to write an exciting adventure for his son Cedar, also known as his daughter Sapphire.',
		'The Current Boring Old Girlfriend decided to write this little text to have a good preview of the actual story and layout, because sometimes that is what you need.',
		'And it\'s also a wonderful opportunity to passive-aggressively convey whatever this is going for. Sometimes I don\'t even know! Do you?'
	], function () {
		console.log('bubble callback');
	});
	//document.querySelector('body').appendChild();

	// let x = {};
	// x.newBool = game.RANDOM.bool();
	// x.newRandom = game.RANDOM.random(); /* random float between 0 and 1 */
	// x.newInteger = game.RANDOM.int(20, 80); /* random integer between 20 and 80 */
	// x.newFloat = game.RANDOM.float(20.0, 80.0); /* random float between 20.0 and 80.0 */
	// x.newChance = game.RANDOM.chance(80.0); /* 80% chance to return true */
	// x.newString = game.RANDOM.string(40, '0123456789abcdef'); /* random 40 character string, using [0-9a-f] */
	// x.newPick = game.RANDOM.pick(['one', 'two', 'three']); /* returns a random value from an array */
	// x.newShuffledArray = game.RANDOM.shuffle(['a', 'b', 'c', 'd', 'e', 'f']); /* returns a shuffled array */
	// x.newWeightedPick = game.RANDOM.weighted(['a', 'b', 'c', 'd', 'e', 'f'], [1,1,1,2,2,6]); /* returns a weighted array pick */
	// console.log(x);
}

window.addEventListener('DOMContentLoaded', game.init);

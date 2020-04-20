'use strict';

import {RANDOM} from './random.module.js';
import {CHARACTER} from './character.module.js';
import {TITLES} from './titles.module.js';
import {BUBBLES} from './bubbles.module.js';
import {ROOM} from './room.module.js';
import {ITEM} from './item.module.js';


var game = window.game || {};

game.init = function () {

	game.elements = {
		'inventory': document.querySelector('#inventory'),
		'lootbox': document.querySelector('#lootbox')
	}

	let warrior = new CHARACTER('Hector', {
		'strength': 10,
		'charisma': 5,
		'dexterity': 7
	});

	// generate 7 items, as a demo
	let items = [];
	for (var i = 0; i < 7; i++) {

		let item = new ITEM();
		item.rerollStats();
		console.log(item);
	}

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
	document.querySelector('h1').textContent = room1.name;

	console.log(warrior.name, warrior.attributes);
	console.log('coin toss', game.RANDOM.bool());
	// console.log(game.TITLES.generateTitle());

	
	const inventorySlots = Array.from(game.elements.inventory.querySelectorAll('.slot'));
	const lootbox = [game.elements.lootbox];
	const dragContainers = inventorySlots.concat(lootbox);

	game.drake = dragula({
		'containers': dragContainers,
		'revertOnSpill': true,
		'accepts': function (el, target, source, sibling) {
			const sourceType = el.getAttribute('data-type');
			const targetType = target.getAttribute('data-accept');

			const targetLimit = target.getAttribute('data-limit');
			const targetOccupied = target.querySelectorAll('.item:not(.gu-transit)');

			if (targetLimit > targetOccupied.length) {
				if (targetType.toLowerCase() == 'all') {
					// accept all types
					// console.log('this spot accepts all types.');
					return true;
				} else {
					// check type requirement
					// console.log('type requirements', sourceType, targetType, target);
					return sourceType == targetType;
				}
			} else {
				// spot is full
				console.log('spot is full!', targetOccupied.length, targetLimit);
				return false;
			}
		}
	});

	game.drake.on('over', function (el, container, source) {
		container.classList.add('highlight-drop');
	});

	game.drake.on('out', function (el, container, source) {
		container.classList.remove('highlight-drop');
	});

	game.drake.on('drag', function (el, source) {
		if (!el.targets) {
			const sourceType = el.getAttribute('data-type');
			el.targets = game.elements.inventory.querySelectorAll('div[data-accept="'+sourceType+'"]:not(.full)');
		}

		el.targets.forEach(function (e, i) {
			e.classList.add('highlight-target');
		});
	});

	game.drake.on('dragend', function (el, container, source) {
		if (el.targets) {
			el.targets.forEach(function (e, i) {
				e.classList.remove('highlight-target');
			});
		}
	});

	game.drake.on('drop', function (el, container, source) {
		const occupancy = container.querySelectorAll('.item');
		if (container.getAttribute('data-limit') == occupancy.length) {
			container.classList.add('full');
		}

		if (source.querySelectorAll('*').length == 0) {
			console.log('container is now empty again');
			source.classList.remove('full');
		}

		var event = new CustomEvent('inventoryChange');
		game.elements.inventory.dispatchEvent(event);

		console.log('dropped item', el);
	});

	// global listener for inventory item removal via click
	document.addEventListener('click', function (event) {
		const item = event.target.closest('.item');
		if (item) {
			if (item.matches('#inventory .item')) { /* magic number, err, string! */
				
				const slot = item.closest('.slot');

				// remove the item from the inventory
				game.elements.lootbox.appendChild(item);

				// update slot full status
				if (slot) {
					const slotOccupancy = slot.querySelectorAll('.item').length;
					if (slotOccupancy < parseInt(slot.getAttribute('data-limit'))) {
						slot.classList.remove('full');
					}
				}

				var event = new CustomEvent('inventoryChange');
				game.elements.inventory.dispatchEvent(event);

				console.log('unequipped item');
			}
			
		}
		
	});

	game.elements.inventory.addEventListener('inventoryChange', function (event) {
		console.log('inventory content changed!');
	});


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

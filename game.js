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

	game.character = {
		'stats': new Vue({
			'el': '#character-stats',
			'data': {
				'strength': 3,
				'constitution': 3,
				'dexterity': 3,
				'intelligence': 3,
				'wisdom': 3,
				'charisma': 3,
				'maxMana': 10,
				'maxHealth': 10,
				'resLightning': 0,
				'resFire': 0,
				'resCold': 0,
				'resPoison': 0
			}
		}),
		'inventory': new Vue({
			'el': '#inventory-container',
			'data': {
				'show': true,
				'drake': null, /* dragula instance */
				'containerEl': null,
				'lootboxEl': null,
				'lootboxItems': [],
				'inventoryEl': null,
				'inventorySlots': []
			},
			'watch': {
				'inventorySlots': function () {
					console.warn('inventory slots changed');
				}
			},
			'created': function () {
				/*
				console.log(this.containerEl);
				dragula({
					'containers': this.$el.querySelector('#lootbox'),
					'revertOnSpill': true
				});
				*/
			},
			'mounted': function () {
				const self = this;
				this.containerEl = this.$el;
				this.lootboxEl = this.$el.querySelector('#lootbox');
				this.inventoryEl = this.$el.querySelector('#inventory');
				this.inventorySlots = Array.from(this.inventoryEl.querySelectorAll('.slot'));

				const dragContainers = this.inventorySlots.concat([this.lootboxEl]);

				this.drake = dragula({
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
								return true;
							} else {
								// check type requirement
								return sourceType == targetType;
							}
						} else {
							// spot is full
							return false;
						}
					}
				});

				this.drake.on('over', function (el, container, source) {
					container.classList.add('highlight-drop');
				});

				this.drake.on('out', function (el, container, source) {
					container.classList.remove('highlight-drop');
				});

				this.drake.on('drag', function (el, source) {
					if (!el.targets) {
						const sourceType = el.getAttribute('data-type');
						el.targets = self.inventoryEl.querySelectorAll('div[data-accept="'+sourceType+'"]:not(.full)');
					}

					el.targets.forEach(function (e, i) {
						e.classList.add('highlight-target');
					});
				});

				this.drake.on('dragend', function (el, container, source) {
					if (el.targets) {
						el.targets.forEach(function (e, i) {
							e.classList.remove('highlight-target');
						});
					}
				});

				this.drake.on('drop', function (el, container, source) {

					let isInventory = false;
					
					// messy matching
					if (container.getAttribute('id').startsWith('inv') && self.inventoryEl.getAttribute('id').startsWith('inv')) {
						isInventory = true;
					}

					const occupancy = container.querySelectorAll('.item');
					if (container.getAttribute('data-limit') == occupancy.length) {
						container.classList.add('full');
					}

					if (source.querySelectorAll('*').length == 0) {
						console.log('container is now empty again');
						source.classList.remove('full');
					}

					// click removal of equipped items
					if (isInventory) {
						el.addEventListener('click', function (event) {

							const slot = this.closest('.slot');

							// remove the item from the inventory
							self.lootboxEl.appendChild(this);

							// update slot full status
							if (slot) {
								const slotOccupancy = slot.querySelectorAll('.item').length;
								if (slotOccupancy < parseInt(slot.getAttribute('data-limit'))) {
									slot.classList.remove('full');
								}
							}

							const changeEvent = new CustomEvent('inventoryChange');
							self.inventoryEl.dispatchEvent(changeEvent);

							console.log('unequipped item');
						});
					}

					const changeEvent = new CustomEvent('inventoryChange');
					self.inventoryEl.dispatchEvent(changeEvent);

					console.log('dropped item', el);
				});
			}
		})
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
		// console.log(item);
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

	game.elements.inventory.addEventListener('inventoryChange', function (event) {
		console.log('inventory content changed!');
		game.character.stats.maxHealth += 2;
		game.character.stats.strength += 3;
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

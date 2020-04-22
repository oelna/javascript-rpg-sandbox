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

	// generate 7 items, as a demo
	let randomItems = [];
	for (var i = 0; i < 7; i++) {

		let item = new ITEM();
		item.rerollStats();
		randomItems.push(item);
		// console.log(item);
	}

	Vue.component('inventory-slot', {
		'data': function () {
			return {
				'count': 0
			}
		},
		'props': ['items'],
		'methods': {
			'isFull': function () {
				return false;
			},
			'dragStart': function () {
				return false;
			},
			'dragEnd': function () {
				return false;
			},
			'dragAdd': function () {
				return false;
			},
			'inventorySlotOptions': function () {
				return {
					'group': {
						'name': 'inventory',
						'put': function (to, from, item, event) {
							// limit the amount of items in a slot
							if (to.options.dataLimit <= to.el.querySelectorAll('.item').length) {
								return false;
							}
							// limit to item type as well
							if (to.options.dataAccept !== item.getAttribute('data-type')) {
								return false;
							}
							
							return true;
						}
					}
				}
			}
		},
		'template': '<draggable class="slot" id="inv-hand-right" data-accept="hand" data-limit="1" v-model="items.items" v-bind="inventorySlotOptions()" :class="(isFull(items)) ? \'full\' : \'\'" @start="dragStart" @end="dragEnd" @add="dragAdd"><div>x</div></draggable>'
	});

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
				'containerEl': null,
				'lootboxEl': null,
				'lootboxItems': randomItems,
				'inventoryEl': null,
				'inventorySlots': [],
				'inventoryItems': {
					'head': {
						'limit': 1,
						'items': []
					},
					'body': {
						'limit': 1,
						'items': []
					},
					'legs': {
						'limit': 1,
						'items': []
					},
					'handRight': {
						'limit': 1,
						'items': []
					},
					'handLeft': {
						'limit': 1,
						'items': []
					},
					'accessoryRight': {
						'limit': 1,
						'items': []
					},
					'accessoryLeft': {
						'limit': 1,
						'items': []
					},
					'accessoryNeck': {
						'limit': 1,
						'items': []
					},
				}
			},
			'watch': {
				'inventoryItems': function () {
					console.warn('inventory items changed');
				}
			},
			'created': function () {

			},
			'methods': {
				'inventorySlotOptions': function () {
					return {
						'group': {
							'name': 'inventory',
							'put': function (to, from, item, event) {
								// limit the amount of items in a slot
								if (to.options.dataLimit <= to.el.querySelectorAll('.item').length) {
									return false;
								}
								// limit to item type as well
								if (to.options.dataAccept !== item.getAttribute('data-type')) {
									return false;
								}
								
								return true;
							}
						}
					}
				},
				'isFull': function (container) {
					return container.items.length >= container.limit;
				},
				'dragStart': function (event) {
					if (!event.item.targets) {
						const sourceType = event.item.getAttribute('data-type');
						event.item.targets = this.inventoryEl.querySelectorAll('div[data-accept="'+sourceType+'"]'); // :not(.full)
					}

					event.item.targets.forEach(function (e, i) {
						e.classList.add('highlight-target');
					});
				},
				'dragEnd': function (event) {
					if (event.item.targets) {
						event.item.targets.forEach(function (e, i) {
							e.classList.remove('highlight-target');
						});
					}
				},
				'dragAdd': function (event) {
					/*
					console.log('drag add', event);
					console.log('target list', event.to);
					console.log('source list', event.from);
					console.log('old index', event.oldIndex);
					console.log('new index', event.newIndex);
					*/

					const self = this;
					const container = event.to;
					const source = event.from;

					const changeEvent = new CustomEvent('inventoryChange');
					self.inventoryEl.dispatchEvent(changeEvent);
				},
				'unequip': function (event, item, container) {

					this.lootboxItems.push(item);
					
					// get the array index of the clicked item
					const index = container.items.findIndex(function (element) {
						return element.id === item.id;
					});
					// remove the item from the container
					container.items.splice(index, 1);

					const changeEvent = new CustomEvent('inventoryChange');
					this.inventoryEl.dispatchEvent(changeEvent);
				}
			},
			'mounted': function () {
				this.containerEl = this.$el;
				this.lootboxEl = this.$el.querySelector('#lootbox');
				this.inventoryEl = this.$el.querySelector('#inventory');
				this.inventorySlots = Array.from(this.inventoryEl.querySelectorAll('.slot'));
			}
		})
	}

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

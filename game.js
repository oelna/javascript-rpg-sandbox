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

	game.character = {};

	// generate 7 items, as a demo
	let randomItems = [];
	for (var i = 0; i < 7; i++) {

		let item = new ITEM();
		item.rerollStats();
		randomItems.push(item);
		// console.log(item);
	}

	game.character.stats = new Vue({
		'el': '#character-stats',
		'data': {
			'base': {
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
			},
			'bonuses': {

			}
		},
		'methods':  {
			'computedAttribute': function (attribute) {
				let value = this.base[attribute];
				if (this.bonuses[attribute]) {
					value += this.bonuses[attribute];
				}
				return value;
			}
		}
	});

	Vue.component('inventory-slot', {
		'data': function () {
			return {

			}
		},
		'props': ['slot-data'],
		'methods': {
			'isFull': function (container) {
				return container.items.length >= container.limit;
			},
			'dragStart': function (event) {
				if (!event.item.targets) {
					const sourceType = event.item.getAttribute('data-type');
					
					event.item.targets = this.$parent.inventoryEl.querySelectorAll('div[data-accept="'+sourceType+'"]'); // :not(.full)
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
				
				const self = this;
				const container = event.to;
				const source = event.from;
				*/

				const changeEvent = new CustomEvent('inventoryChange');
				this.$parent.inventoryEl.dispatchEvent(changeEvent);

				this.recalculateStats();
			},
			'dragRemove': function (event) {
				
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
							if (to.options.dataAccept !== item.getAttribute('data-type') && to.options.dataAccept !== 'all') {
								return false;
							}

							return true;
						}
					}
				}
			},
			'recalculateStats': function () {

				const bonusesTotal = {};

				for (let slot in this.$parent.inventoryItems) {
					const items = this.$parent.inventoryItems[slot].items;
					items.forEach(function (item, index) {
						for (let attribute in item.attributes) {

							if (!bonusesTotal[attribute]) bonusesTotal[attribute] = 0;
							bonusesTotal[attribute] += item.attributes[attribute];
						}
					});
				}

				// apply the bonuses
				game.character.stats.bonuses = bonusesTotal;
			}
		},
		'template': '<draggable class="slot" :id="slotData.name" :data-accept="slotData.type" :data-limit="slotData.limit" v-model="slotData.items" v-bind="inventorySlotOptions()" :class="(isFull(slotData)) ? \'full\' : \'\'" @start="dragStart" @end="dragEnd" @add="dragAdd" @remove="dragRemove"><inventory-item v-for="item in slotData.items" :key="item.id" v-bind:item="item" v-bind:slot-name="slotData"></inventory-item></draggable>'
	});

	Vue.component('inventory-item', {
		'data': function () {
			return {
				'displayAttributes': false
			}
		},
		'props': ['item', 'slot-name'],
		'methods': {
			'unequip': function (event, item, container) {

				const parent = this.$parent.$parent.$parent;

				parent.lootboxItems.lootbox.items.push(item);

				// get the array index of the clicked item
				const index = container.items.findIndex(function (element) {
					return element.id === item.id;
				});

				// remove the item from the container
				container.items.splice(index, 1);

				const changeEvent = new CustomEvent('inventoryChange');
				parent.inventoryEl.dispatchEvent(changeEvent);

				// notify the slot method
				this.$parent.$parent.recalculateStats();
			},
			'showAttributes': function (event) {
				this.displayAttributes = true;
			},
			'hideAttributes': function () {
				this.displayAttributes = false;
			},
			'outputAttributes': function () {

				let output = '<dl>';
				for (let attribute in this.item.attributes) {
					if (this.item.attributes[attribute] !== 0) {
						let bonus = this.item.attributes[attribute];
						let newStat = game.character.stats.computedAttribute(attribute) + bonus;
						let value = (this.item.attributes[attribute] > 0) ? '<dd>+'+bonus+'<span class="change"> &rarr; '+newStat+'</span>' : '<dd class="negative">'+bonus.toString()+'<span class="change"> &rarr; '+newStat+'</span>';
						output += '<dt>'+attribute+'</dt>'+value+'</dd>';
					}
				}
				output += '</dl>';
				return output;
			}
		},
		'template': '<div class="item" :data-type="item.type" @click="unequip($event,item,slotName)" @mouseover="showAttributes($event)" @mouseout="hideAttributes()"><h2>{{ item.name }}</h2><div class="attributes" :class="(displayAttributes) ? \'\' : \'hidden\'" v-html="outputAttributes()"></div></div>'
	});

	game.character.inventory = new Vue({
		'el': '#inventory-container',
		'data': {
			'show': true,
			'containerEl': null,
			'lootboxEl': null,
			'lootboxItems': {
				'lootbox': {
					'element': null,
					'name': 'lootbox',
					'type': 'all',
					'limit': 12,
					'items': randomItems
				}
			},
			'inventoryEl': null,
			// 'inventorySlots': [],
			'inventoryItems': {
				'head': {
					'element': null,
					'name': 'inv-head',
					'type': 'head',
					'limit': 1,
					'items': []
				},
				'body': {
					'element': null,
					'name': 'inv-body',
					'type': 'body',
					'limit': 1,
					'items': []
				},
				'legs': {
					'element': null,
					'name': 'inv-legs',
					'type': 'legs',
					'limit': 1,
					'items': []
				},
				'handRight': {
					'element': null,
					'name': 'inv-hand-right',
					'type': 'hand',
					'limit': 1,
					'items': []
				},
				'handLeft': {
					'element': null,
					'name': 'inv-hand-left',
					'type': 'hand',
					'limit': 1,
					'items': []
				},
				'accessoryRight': {
					'element': null,
					'name': 'inv-accessory-right',
					'type': 'accessory',
					'limit': 2,
					'items': []
				},
				'accessoryLeft': {
					'element': null,
					'name': 'inv-accessory-left',
					'type': 'accessory',
					'limit': 2,
					'items': []
				},
				'accessoryNeck': {
					'element': null,
					'name': 'inv-accessory-neck',
					'type': 'bracelet',
					'limit': 1,
					'items': []
				},
			}
		},
		'methods': {
			
		},
		'mounted': function () {

			// populate inventory elements
			for (let slot in this.inventoryItems) {
				let id = this.inventoryItems[slot].name;
				this.inventoryItems[slot].element = document.querySelector('#' + id);
				if (!this.inventoryItems[slot].element) console.warn('No element found for', slot);
			}
			// populate lootbox element
			for (let slot in this.lootboxItems) {
				let id = this.lootboxItems[slot].name;
				this.lootboxItems[slot].element = document.querySelector('#' + id);
				if (!this.lootboxItems[slot].element) console.warn('No element found for', slot);
			}

			this.containerEl = this.$el;
			this.lootboxEl = this.$el.querySelector('#lootbox');
			this.inventoryEl = this.$el.querySelector('#inventory');
		}
	});

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
	// console.log('coin toss', game.RANDOM.bool());
	// console.log(game.TITLES.generateTitle());

	game.elements.inventory.addEventListener('inventoryChange', function (event) {
		console.warn('inventory content changed!');
		// game.character.stats.maxHealth += 2;
		// game.character.stats.strength += 3;
	});

	/*
	let speech1 = new BUBBLES('#bubbles', [
		'One beautiful spring day during the 2020 pandemic, a very hairy man decided to abandon his quest to find an even younger, less pregnant girlfriend and decided to collaborate with the current, old, boring one to write an exciting adventure for his son Cedar, also known as his daughter Sapphire.',
		'The Current Boring Old Girlfriend decided to write this little text to have a good preview of the actual story and layout, because sometimes that is what you need.',
		'And it\'s also a wonderful opportunity to passive-aggressively convey whatever this is going for. Sometimes I don\'t even know! Do you?'
	], function () {
		console.log('bubble callback');
	});
	*/
	let speech2 = new BUBBLES('#bubbles', [
		"You stand in a busy road, keeping an eye out for trouble. Some nearby shouting draws your attention, and you push your way through the crowd to see what's happening. You discover that a wagon has turned on its side in the middle of the road! The wagon is empty, and Craig is very strong, so you should be able to lift it back onto its wheels.",
		"Unfortunately that wasn't quite enough to right the wagon.",
		"With a mighty heave, you push the wagon upright. The elderly owner shakes your hand and thanks you, and scurries to get the wagon out of the road."
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

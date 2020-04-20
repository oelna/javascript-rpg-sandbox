const BUBBLES = class {
	constructor(selector, strings = [], whenDone) {
		this.ele = document.querySelector(selector);
		this.selector = selector;
		this.strings = strings;
		this.callback = whenDone;
		this.currentIndex = 0;

		if (this.ele.length == 0) {
			console.error('No container element provided!');
			return;
		}

		this.present();
	}

	present() {
		let self = this;

		// clear container
		this.ele.innerHTML = '';

		let nextButton = document.createElement('button');
		nextButton.classList.add('hidden', 'next');
		if (!this.strings[this.currentIndex + 1]) {
			// last string
			nextButton.textContent = 'Close';
			nextButton.classList.add('close');
			nextButton.addEventListener('click', function (event) {
				self.ele.innerHTML = '';
				if (typeof self.callback === 'function') {
					self.callback();
				}
			});
		} else {
			// normal string
			nextButton.textContent = 'Next';
			nextButton.addEventListener('click', function (event) {
				self.present();
			});
		}

		let text = document.createElement('div');
		// text.textContent = this.strings[this.currentIndex];
		
		this.ele.appendChild(text);
		this.crawlText(this.strings[this.currentIndex], this.selector + ' > div', 15, function (target) {
			self.ele.querySelector('button.next').classList.remove('hidden');
		}, null);
		this.ele.appendChild(nextButton);

		this.currentIndex += 1;
	}

	crawlText(text, selector, speed, callback, delay) {
		const targetElement = document.querySelector(selector);

		// check for missing data 
		if (!text || text.length < 1) { return; }
		if (!selector || targetElement.length == 0) { return; }

		targetElement.innerHTML = '';

		// save the data to the DOM node
		targetElement.setTextData = {
			'characters': text.split(''),
			//'speed': speed || 40,
			//'ele': targetElement,
			'interval': null,
			'i': 0,
			'callback': callback,
			'delay': delay || 0,
			'delayTimeout': null
		};

		targetElement.setTextData.interval = setInterval(function (targetEle) {
			const i = targetEle.setTextData.i;
			const ele = targetEle;

			if (targetEle.setTextData.characters[i] == "\n") {
				ele.innerHTML += '<br />';
			} else {
				ele.innerHTML += targetEle.setTextData.characters[i];
			}

			if (targetEle.setTextData.i == (targetEle.setTextData.characters.length - 1)) {
				targetEle.setTextData.i = 0;
				clearInterval(targetEle.setTextData.interval);

				if (typeof callback === 'function') {
					if (targetEle.setTextData.delay > 0) {
						targetEle.setTextData.delayTimeout = setTimeout(function (callback) {
							callback(targetElement);
						}, targetEle.setTextData.delay, callback);
					} else {
						callback(targetElement);
					}
				}

				return;
			}

			targetEle.setTextData.i += 1;
		}, (speed || 40), targetElement);
	}
}

export {BUBBLES};

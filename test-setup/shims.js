const store = {};

// Required by React 16+ as a shim for tests
global.requestAnimationFrame = callback => {
	setTimeout(callback, 0);
};

global.localStorage = {
	setItem: (item, val) => {
		store[item] = val;
	},
	getItem: item => store[item],
	removeItem: item => delete store[item],
};

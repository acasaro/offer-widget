import { getQueryString } from '../../src/util/http-utils';

describe('HTTP Utilities Tests', () => {
	it('should retrieve the value of a given query string', () => {
		// Get around issues with JSDom not allowing window to be directly edited/persisted
		Object.defineProperty(window.location, 'search', {
			writable: true,
			value: '?testQs=true&test2=',
		});

		expect(getQueryString('testQs')).toBe('true');
		expect(getQueryString('fruit')).toBe(null);
		expect(getQueryString('test2')).toBe('');

		Object.defineProperty(window.location, 'search', {
			writable: true,
			value: '?testQs=true&fruit=pineapple',
		});

		expect(getQueryString('fruit')).toBe('pineapple');
	});
});

import { useMockData } from '../src/initialization-helper';

describe('Initialization Helper Test', () => {
	it('should return true if the query string is set for mock data and the user is in a dev environment', () => {
		Object.defineProperty(window.location, 'search', {
			writable: true,
			value: '?useMockData=false',
		});

		expect(useMockData()).toBeFalsy();

		process.env.NODE_ENV = 'development';
		Object.defineProperty(window.location, 'search', {
			writable: true,
			value: '?useMockData=true',
		});

		expect(useMockData()).toBeTruthy();
	});

	afterEach(() => {
		// Reset environment
		process.env.NODE_ENV = 'test';
	});
});

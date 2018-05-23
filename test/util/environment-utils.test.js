import {
	getEnvironment,
	getApiUrl,
	getAppUrl,
	useLayer7,
	getEndpoint,
	getMockData,
} from '../../src/util/environment-utils';
import { APP, API, ENDPOINTS } from '../../src/util/constants/environment';

describe('Environment Utilities Tests', () => {
	// Wipe environment before each test
	beforeEach(() => {
		process.env.NODE_ENV = '';
	});

	it('should return current environment, or development if unset', () => {
		const environments = ['development', 'test', 'stage', 'production'];
		const testEnv = env => {
			process.env.NODE_ENV = env;
			expect(getEnvironment()).toBe(env);
		};

		expect(getEnvironment()).toBe('development');
		environments.forEach(env => testEnv(env));
	});

	it('should return the appropriate api url, dependent on environment', () => {
		const testEnv = (env, check) => {
			process.env.NODE_ENV = env;
			expect(getApiUrl()).toBe(check);
		};

		testEnv(null, API.DEV);
		testEnv('development', API.DEV);
		testEnv('production', API.PRODUCTION);
		testEnv('stage', API.STAGE);
		testEnv('test', API.TEST);
	});

	it('should return the appropriate app url, dependent on environment', () => {
		const testEnv = (env, check) => {
			process.env.NODE_ENV = env;
			expect(getAppUrl()).toBe(check);
		};

		testEnv(null, APP.DEV);
		testEnv('development', APP.DEV);
		testEnv('production', APP.PRODUCTION);
		testEnv('stage', APP.STAGE);
		testEnv('test', APP.TEST);
	});

	it('useLayer7 should return true if in stage or production, else false', () => {
		process.env.NODE_ENV = 'development';
		expect(useLayer7()).toBe(false);

		process.env.NODE_ENV = 'stage';
		expect(useLayer7()).toBe(true);

		process.env.NODE_ENV = 'production';
		expect(useLayer7()).toBe(true);
	});

	it('getEndpoint should return correct endpoint based on current environment', () => {
		const testEndpoint = service => {
			process.env.NODE_ENV = 'test';
			expect(getEndpoint(service)).toBe(ENDPOINTS[service].insecure);

			process.env.NODE_ENV = 'stage';
			expect(getEndpoint(service)).toBe(ENDPOINTS[service].layer7);
		};

		['eligibility', 'finance', 'rx', 'leadInteraction', 'leadPromotion'].forEach(service => testEndpoint(service));

		process.env.NODE_ENV = 'test';
	});

	it('getMockData should return mock data file path, depending on the environment', () => {
		expect(getMockData('test')).toBe('/etc/designs/digitaladvocacy/clientlibs/homepage-ui/mock-data/test');
		Object.defineProperty(window.location, 'href', {
			writable: true,
			value: 'http://localhost:8080/test/okay',
		});

		expect(getMockData('test')).toBe('/mock-data/test');
	});

	// Set environment back to test
	afterAll(() => {
		process.env.NODE_ENV = 'test';
	});
});

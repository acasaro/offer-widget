import { forOwn } from 'lodash';
import {
	injectAnalyticsScript,
	updatePageDataLayer,
	postAnalyticsData,
	AnalyticsQueue,
	updateTracking,
} from '../../src/util/analytics-utils';
import { POST_TYPES, ANALYTICS_SCRIPT_SRC } from '../../src/util/constants/analytics';

describe('Analytics Utilities Tests', () => {
	it('should inject the right script based on the environment, fail if bad url is supplied', async () => {
		jest.useFakeTimers();

		process.env.NODE_ENV = 'production';
		injectAnalyticsScript();
		jest.runAllTimers();

		const satLib = document.getElementById('satLibScript');
		expect(satLib.src).toBe(ANALYTICS_SCRIPT_SRC.PROD);
		satLib.remove();

		process.env.NODE_ENV = 'test';
		injectAnalyticsScript();

		const satLib2 = document.getElementById('satLibScript');
		expect(satLib2.src).toBe(ANALYTICS_SCRIPT_SRC.DEFAULT);
		satLib2.remove();

		// Change src URL to fail
		ANALYTICS_SCRIPT_SRC.DEFAULT = '//thisshouldfail';

		const p = injectAnalyticsScript();
		jest.runAllTimers();

		const val = await p;
		expect(window._satellite).toBeFalsy();
		expect(val).toBeFalsy();
	});

	it('should resolve the promise if the script successfully adds its globals', async () => {
		Object.defineProperty(window, '_satellite', {
			writable: true,
			value: { pageBottom: jest.fn() },
		});

		const p = injectAnalyticsScript();
		jest.runAllTimers();

		const val = await p;
		expect(val).toBeTruthy();
		expect(window._satellite.pageBottom).toHaveBeenCalled();
	});

	it('should populate pageDataLayer with defaults when values are not passed in', () => {
		updatePageDataLayer('home page', 'loggedin', 'Angus Young', 'google.com', '');
		expect(window.pageDataLayer).toEqual({
			content: {
				pageName: 'home page',
				referringSite: 'google.com',
				referringSiteSection: '',
				siteSectionL1: '',
				siteSectionL2: '',
				siteSectionL3: '',
				businessUnit: 'optum',
				website: 'myoptum',
			},
			user: {
				loginStatus: 'loggedin',
				userType: 'consumer',
			},
			dacoData: {
				protected: {
					user: {
						userName: 'Angus Young',
						userType: 'consumer',
						login: 'loggedin',
					},
				},
			},
		});
	});

	it('should post the correct tracking data based on the action type', () => {
		window.publishPostPageData = jest.fn();
		const fireTest = type => {
			window.publishPostPageData.mockClear();
			expect(postAnalyticsData(type, { contentHere: 'fake content' })).toBe(true);
		};

		forOwn(POST_TYPES, type => fireTest(type));
	});

	it('should not send analytics data from queue when publishPostPageData is unavailable', () => {
		window.publishPostPageData = undefined;
		const queue = new AnalyticsQueue();
		queue.queueOrExecute('testType', { testData: 'testVal' });
		expect(queue.queue).toHaveLength(1);
		queue.executeQueue();
		jest.runAllTimers();
		expect(queue.queue).toHaveLength(1);
	});

	it('should process the queue when publishPostPageData is available', () => {
		window.publishPostPageData = undefined;
		const queue = new AnalyticsQueue();
		queue.queueOrExecute('testType', { testData: 'testVal' });
		window.publishPostPageData = jest.fn();
		expect(window.publishPostPageData).not.toHaveBeenCalled();
		queue.executeQueue();
		expect(window.publishPostPageData).toHaveBeenCalled();
	});

	it('should not start the queue execution if already running', () => {
		window.publishPostPageData = undefined;
		const queue = new AnalyticsQueue();
		queue.executeQueue = jest.fn();
		queue.runningTime = 1000;
		queue.queueOrExecute('test', { testData: 'testVal' });
		expect(queue.executeQueue).not.toHaveBeenCalled();
	});

	// Reset environment to test
	afterAll(() => {
		process.env.NODE_ENV = 'test';
	});
});

import { get } from 'lodash';
import { getEnvironment } from './environment-utils';
import { POST_TYPES, SECTION_NAMES, ANALYTICS_SCRIPT_SRC } from './constants/analytics';

// To do: strip out unnecessary stuff, only post offers. to the postDataObject, and on click.

export class AnalyticsQueue {
	// Wait a max of ten seconds
	static MAX_WAIT = 10000;

	// Check every second for publishPostPageData
	static CHECK_EVERY = 1000;

	constructor() {
		this.queue = [];
		this.runningTime = 0;
	}

	// Executes publishPostPageData immediately if possible,
	// else adds analytics data to queue for retry
	queueOrExecute = (type, content) => {
		if (window.publishPostPageData) {
			window.publishPostPageData(type, content);
		} else {
			this.queue.push({ type, content });
			// If the analytics queue hasn't started processing, start it
			if (this.runningTime === 0) {
				this.executeQueue();
			}
		}
	};

	executeQueue = () => {
		// If publishPostPageData is available, send all queued
		// items to Adobe analytics, then clear the queue
		if (window.publishPostPageData) {
			this.queue.forEach(item => {
				window.publishPostPageData(item.type, item.content);
			});

			this.queue = [];
		} else if (this.runningTime < AnalyticsQueue.MAX_WAIT) {
			this.runningTime += AnalyticsQueue.CHECK_EVERY;
			window.setTimeout(this.executeQueue, AnalyticsQueue.CHECK_EVERY);
		}
	};
}

// Instantiate analytics queue immediately, but don't start timers
const analyticsQueue = new AnalyticsQueue();

// TODO: make businessUnit & website parameters, rather than hardcoded

export const updatePageDataLayer = (pageName, loginStatus, userName, referringSite, referringSiteSection) => {
	const updatedPageDataLayer = {
		content: {
			pageName,
			referringSite,
			referringSiteSection,
			siteSectionL1: '',
			siteSectionL2: '',
			siteSectionL3: '',
			businessUnit: 'optum',
			website: 'myoptum',
		},
		user: {
			loginStatus,
			userType: 'consumer',
		},
		dacoData: {
			protected: {
				user: {
					userName,
					userType: 'consumer',
					login: loginStatus,
				},
			},
		},
	};

	window.pageDataLayer = { ...window.pageDataLayer, ...updatedPageDataLayer };
};

export const updateTracking = eligibility => {
	const href = window.location.href;
	const referringSiteSection = '';
	let loginStatus = '';
	let userName = '';
	let referringSite = '';
	loginStatus = 'not loggedin';
	let page = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
	let pageName = page.replace('.html', '');

	updatePageDataLayer(pageName, loginStatus, userName, referringSite, referringSiteSection);
};

/**
 * injectAnalyticsScript  - Appends environment-specific satellite library script to document head, calls _satellite.pageBottom()
 */
export const injectAnalyticsScript = async () => {
	const satelliteLibScript = document.createElement('script');
	satelliteLibScript.async = true;
	satelliteLibScript.id = 'satLibScript';
	satelliteLibScript.src = getEnvironment() === 'production' ? ANALYTICS_SCRIPT_SRC.PROD : ANALYTICS_SCRIPT_SRC.DEFAULT;

	document.head.appendChild(satelliteLibScript);

	// Page needs analytics. Wait up to 2 seconds for analytics to have loaded
	// before bailing
	const CHECK_EVERY = 50;
	const MAX_WAIT = 2000;
	let timer = 0;
	return new Promise(resolve => {
		const loadInterval = window.setInterval(() => {
			if (window._satellite && window._satellite.pageBottom) {
				window.clearInterval(loadInterval);

				// If no pageDataLayer is present, create one
				if (!window.pageDataLayer) {
					updateTracking();
				}
				// If no publishPostPageData available, initialize the analytics script
				if (!window.publishPostPageData) {
					window._satellite.pageBottom();
				}
				resolve(true);
			} else if (timer > MAX_WAIT) {
				window.clearInterval(loadInterval);
				resolve(false);
			} else {
				timer += CHECK_EVERY;
			}
		}, CHECK_EVERY);
	});
};

export const postAnalyticsData = (type, content) => {
	const postObject = {
		user: get(window, 'pageDataLayer.user'),
		content: content,
	};

	// Either execute or add the current analytics post to the queue
	analyticsQueue.queueOrExecute(type, postObject);

	return analyticsQueue.queue.length === 0;
};

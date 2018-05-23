import { get } from 'lodash';
import { API, APP, ENDPOINTS } from './constants/environment';

/**
 * getEnvironment - Returns the current environment, or development by default
 * @returns {String}
 */
export const getEnvironment = () => {
	if (process.env.NODE_ENV) {
		return process.env.NODE_ENV;
	}

	return 'development';
};

/**
 * userLayer7 - Whether or not to use Layer7 protected endpoints
 * @returns {Boolean}
 */
export const useLayer7 = () => {
	const environment = getEnvironment();
	return environment === 'stage' || environment === 'production';
};

/**
 * getApiUrl  - Returns the URL for the api, given the current environment
 * @returns {String}
 */
export const getApiUrl = () => {
	switch (getEnvironment()) {
		case 'production':
			return API.PRODUCTION;
		case 'stage':
			return API.STAGE;
		case 'test':
			return API.TEST;
		case 'development':
		default:
			return API.DEV;
	}
};

/**
 * getAppUrl  - Returns the URL for the app, given the environment
 * @returns {String}
 */
export const getAppUrl = () => {
	switch (getEnvironment()) {
		case 'production':
			return APP.PRODUCTION;
		case 'stage':
			return APP.STAGE;
		case 'test':
			return APP.TEST;
		case 'development':
		default:
			return APP.DEV;
	}
};

/**
 * getEndpoint  - Returns the endpoint based on environment
 * @returns {String}
 */
export const getEndpoint = service => get(ENDPOINTS, `${service}.${useLayer7() ? 'layer7' : 'insecure'}`);

/**
 * getMockData  - Returns the filepath for given mock data file
 * @param {String} fileName name of file to find path for
 * @returns {String}
 */
export const getMockData = fileName => {
	const isLocal = window.location.href.includes('localhost');
	return isLocal
		? `/mock-data/${fileName}`
		: `/etc/designs/digitaladvocacy/clientlibs/homepage-ui/mock-data/${fileName}`;
};

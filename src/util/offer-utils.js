import { get, forOwn } from 'lodash';
import { isNullEmptyOrUndefined } from './string-utils';
import { getApiUrl, getEndpoint, getMockData } from './environment-utils';
import { useMockData } from '../initialization-helper';

export const sortOffers = (offers = []) =>
	offers.sort((a, b) => {
		// Prioritize AEM sort order if applicable, otherwise use OGM-specified sort order
		const aOrder = get(a, 'content.order', a.order);
		const bOrder = get(b, 'content.order', b.order);

		return parseInt(aOrder, 10) - parseInt(bOrder, 10);
	});

/**
 * hasModal - checks if object has non-null keys
 * @param {Object} modalArray
 * @returns {Boolean}
 */
export const hasModal = modalArray => {
	// default false
	let hasModal = false;
	forOwn(modalArray, (value, key) => {
		// if any of the modal keys are not null, return true
		if (!isNullEmptyOrUndefined(value)) {
			hasModal = true;
		}
	});

	return hasModal;
};

/**
 * getOffersUrl - should return offers GET url or mock data, depending on mock data
 */

// TODO: parameterize the query strings depending on the portal making the request
export const getOffersUrl = () => {
	return useMockData()
		? getMockData('offers-mock-data.json')
		: getApiUrl() + '/' + getEndpoint('leadInteraction') + '?portal=homepage&language=en';
};

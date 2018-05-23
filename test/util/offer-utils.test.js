import { sortOffers, hasModal, getOffersUrl } from '../../src/util/offer-utils';
import mockOffersData from '../../src/mock-data/offers-mock-data.json';

describe('Offer Utilities Tests', () => {
	it('should return properly sorted offers', () => {
		const offers = [{ order: '2', templates: [] }, { order: '1' }, { order: '0', templates: [] }];
		expect(sortOffers(offers).map(offer => offer.order)).toEqual(['0', '1', '2']);
	});

	it('should return an empty array when none is passed in', () => {
		expect(sortOffers()).toEqual([]);
	});

	it('should return correct value from hasModal is passed an object with non-null keys', () => {
		const noModal = {
			title: null,
			prop: '',
			thing: undefined,
		};
		const modal = {
			title: null,
			prop: '',
			thing: 'hey this is valid',
		};

		expect(hasModal(noModal)).toBe(false);
		expect(hasModal(modal)).toBe(true);
	});

	it('should return either mock data or correct url based on query param', () => {
		const correctMockData = '/etc/designs/digitaladvocacy/clientlibs/homepage-ui/mock-data/offers-mock-data.json';
		const correctUrl =
			'https://offer-api-dev-ofd-api-nonprod.ose-ctc-core.optum.com/api/ogn/v1.0/offers?portal=homepage&language=en';

		Object.defineProperty(window.location, 'search', {
			writable: true,
			value: '?useMockData=true',
		});

		expect(getOffersUrl()).toBe(correctMockData);

		Object.defineProperty(window.location, 'search', {
			writable: true,
			value: '?useMockData=false',
		});

		expect(getOffersUrl()).toBe(correctUrl);
	});
});

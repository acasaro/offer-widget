import React from 'react';
import axios from 'axios';
import { mount, shallow } from 'enzyme';
import { Offers, mapStateToProps } from '../../../src/components/offers/offers';
import { getApiUrl, getEndpoint } from '../../../src/util/environment-utils';
import mockOffersData from '../../../src/mock-data/offers-mock-data.json';
import { empty } from 'rxjs/observable/empty';
import { postAnalyticsData } from '../../../src/util/analytics-utils';

describe('Offers Component', () => {
	it('should render a blank offers if no props are passed in', () => {
		const offers = shallow(<Offers />);

		expect(offers).toMatchSnapshot();
	});

	it('should change page if handlePageChange is passed new page, stay same if passed same', () => {
		const offers = mount(<Offers />);
		offers.setState({ offers: mockOffersData.offers, currentOffer: mockOffersData.offers[0] });

		offers.instance().handlePageChange(mockOffersData.offers[0]);
		expect(offers.state().currentOffer).toBe(mockOffersData.offers[0]);

		offers.instance().handlePageChange(mockOffersData.offers[1]);
		expect(offers.state().currentOffer).toBe(mockOffersData.offers[1]);
	});

	it('should set offers data with setOffersData', () => {
		const offers = shallow(<Offers />);
		const emptyState = {
			offers: [],
			options: {},
			currentOffer: {},
		};

		expect(offers.state()).toEqual(emptyState);
		offers.instance().setOffersData({ data: mockOffersData });
		expect(offers.state()).toEqual({
			offers: mockOffersData.offers,
			currentOffer: mockOffersData.offers[0],
			options: mockOffersData.options,
		});
	});

	it('should return false with handleError', () => {
		const offers = shallow(<Offers />);
		let fn = () => {
			throw new Error(false);
		};
		const result = offers.instance().handleError(fn);
		expect(result).toBe(false);
	});

	it('should return true with checkActionSuccess when response code is equal to 10200', () => {
		const mockResponse = {
			data: {
				postResult: {
					postOutput: {
						resultMeta: { transactionId: '0' },
						status: { messages: { message: [{ code: '10200', name: 'OK', severity: 'INFO', description: 'null' }] } },
					},
				},
			},
		};
		const offers = shallow(<Offers />);

		const actionSuccess = offers.instance().checkActionSuccess(mockResponse);
		expect(actionSuccess).toBe(true);

		mockResponse.data.postResult.postOutput.status.messages.message[0].code = '11111';
		const actionFail = offers.instance().checkActionSuccess(mockResponse);
		expect(actionFail).toBe(false);
	});

	it('should return the correct data structure from constructInteraction', () => {
		const offers = mount(<Offers />);
		offers.setState({ offers: mockOffersData.offers, currentOffer: mockOffersData.offers[0] });
		const currentOffer = offers.state('currentOffer');

		const expectedInteraction = {
			url: getApiUrl() + '/' + getEndpoint('leadPromotion') + '/' + currentOffer.offerCode,
			data: {
				blackListDays: currentOffer.blacklistTime,
				dispositionText: currentOffer.template.notInterested.title,
				eventDesc: currentOffer.template.title,
				eventName: 'NoInterest',
				memberId: currentOffer.memberId,
				opportunityTypeCd: currentOffer.opportunityTypeCd,
				treatmentCode: currentOffer.treatmentCode,
			},
		};

		const noInterestInteraction = offers.instance().constructInteraction('NoInterest');
		expect(noInterestInteraction).toEqual(expectedInteraction);

		// Update to expect TellMeMore
		expectedInteraction.data.eventName = 'TellMeMore';
		expectedInteraction.data.dispositionText = currentOffer.template.tellMeMore.title;

		const tellMoreInteraction = offers.instance().constructInteraction('TellMeMore');
		expect(tellMoreInteraction).toEqual(expectedInteraction);
	});

	it('should send a post request through axios when sendInteraction is called', () => {
		const offers = mount(<Offers />);
		offers.setState({ offers: mockOffersData.offers, currentOffer: mockOffersData.offers[0] });

		// Construct interaction is already tested, so just test that post request is made
		const spy = jest.spyOn(axios, 'post');

		const request = offers.instance().sendInteraction('Something');
		expect(axios.post).toHaveBeenCalled();
	});

	it('should dispatch the myoptumOffersLoaded event when offers have successfully loaded', () => {
		let eventDispatched;
		window.addEventListener('myoptumOffersLoaded', () => {
			eventDispatched = true;
		});

		const offers = mount(<Offers />);
		offers.instance().dispatchOffersLoaded();

		expect(eventDispatched).toBe(true);
	});
});

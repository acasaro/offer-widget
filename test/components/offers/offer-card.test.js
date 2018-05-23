import React from 'react';
import { mount, shallow } from 'enzyme';
import OfferCard from '../../../src/components/offers/offer-card';

const mockOffer = {
	order: '2',
	blacklistTime: '7.0',
	offerCode: '000010293',
	interestedLink: 'https://this-is-a-test-link.com',
	description: 'Looks like you could save time and possibly money when you switch to home delivery.',
	title: 'Save time with home delivery.',
	type: 'Pharmacy_RetailMailOrder',
	category: 'Pharmacy',
	treatmentCode: '151b.2836.107b902a.ffffffffb47ec2d2',
	expirationDate: 'Sun Jan 21 13:38:00 CST 2018',
	opportunityTypeCd: 'SUMLCA',
	memberId: '1234',
	template: [
		{
			title: 'Save time with home delivery.',
			content: 'Looks like you could save time and possibly money when you switch to home delivery.',
			image: '',
			icon: '',
			tellMeMore: {
				title: 'View Details',
				link: 'https://chp-stage.Optumrx.com/secure/my-medicine-cabinet',
				linkIcon: 'newTab',
				openNewWindow: true,
			},
			notInterested: {
				title: 'Not Interested',
				link: '',
				linkIcon: 'caret',
				openNewWindow: true,
			},
		},
	],
};

const modal = {
	title: 'You may be able to save on your prescriptions.',
	content: 'Compare pharmacy pricing and see if lower-cost medications are available to you.',
	cta: 'View Details',
	ctaLink: 'https://chp-stage.Optumrx.com/secure/my-medicine-cabinet',
	dismiss: 'Close',
};

describe('OfferCard Component', () => {
	it('should render an offer card component without an icon or image if no icon or image are passed in', () => {
		const currentOffer = { ...mockOffer, icon: '', image: '' };
		const card = shallow(<OfferCard {...currentOffer} handleClick={() => {}} />);

		expect(card.find('.icon-circle')).toHaveLength(0);
		expect(card.find('.offer-image')).toHaveLength(0);
	});

	it('should render an offer card component with an icon if an icon is passed in', () => {
		const tmpMock = { ...mockOffer, icon: 'test' };
		const card = mount(<OfferCard {...tmpMock} handleClick={() => {}} />);
		expect(card.find('.icon-circle')).toHaveLength(1);
	});

	it('should render an offer card component with an image if an image is passed in', () => {
		const tmpMock = {
			...mockOffer,
			image: 'https://myoptum-stage.optum.com/content/dam/OptumDashboard/ad-box/logos/OPTUMRx_RGB.png',
		};
		const card = mount(
			<OfferCard {...tmpMock} removeOffer={() => {}} type={'Pharmacy_RetailMailOrder'} icon="" image="image.jpg" />
		);
		expect(card.find('.offer-image')).toHaveLength(1);
	});

	it('should render an offer card component with a cta if an cta is passed in', () => {
		const card = shallow(
			<OfferCard {...mockOffer} removeOffer={() => {}} cta={{ link: 'https://google.com/', text: 'Google' }} />
		);
		expect(card.find('.offer-cta')).toHaveLength(1);
	});

	it('should call removeOffer when .remove-offer is clicked on', () => {
		const mockRemove = jest.fn();
		const card = mount(<OfferCard {...mockOffer} handleClick={mockRemove} />);

		card
			.find('.remove-offer')
			.first()
			.simulate('click');
		expect(mockRemove).toHaveBeenCalled();
	});

	it('should call tellMore when .tellMore is clicked on', () => {
		const mockTellMore = jest.fn();
		const card = mount(<OfferCard {...mockOffer} handleClick={mockTellMore} />);

		card
			.find('.offer-cta')
			.first()
			.simulate('click');

		expect(mockTellMore).toHaveBeenCalled();
	});

	it('should toggle modal when modal is passed in, and offer-cta is clicked', () => {
		const card = mount(<OfferCard {...mockOffer} modal={modal} handleClick={() => {}} />);

		expect(card.state().modalOpen).toBe(false);
		card
			.find('.offer-cta')
			.first()
			.simulate('click');
		expect(card.state().modalOpen).toBe(true);
	});
});

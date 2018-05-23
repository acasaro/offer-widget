import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
import { getApiUrl, getEndpoint, getMockData } from '../../util/environment-utils';
import { useMockData } from '../../initialization-helper';
import { postAnalyticsData } from '../../util/analytics-utils';
import { getOffersUrl } from '../../util/offer-utils';
import OfferCard from './offer-card';
import Pagination from '../general/pagination/pagination';
import './_offers.scss';
import { POST_TYPES } from '../../util/constants/analytics';

export class Offers extends Component {
	static propTypes = {
		cacheId: PropTypes.string,
		portal: PropTypes.string,
	};

	static defaultProps = {
		cacheId: '',
	};

	state = {
		offers: [],
		options: {},
		currentOffer: {},
	};

	getOffersData = () => {
		return new Promise(resolve => {
			resolve(
				axios
					.get(getOffersUrl(), {
						headers: {
							'Content-Type': 'application/json',
							UUID: this.props.cacheId,
						},
					})
					.then(this.setOffersData)
					.catch(this.handleError)
			);
		});
	};

	handleError = error => {
		if (error.response) {
			// analytics
			const postObject = {
				errorType: error.response.status,
				errorName: error.response.data.message ? error.response.data.message : error.response.statusText,
				referringPortal: this.props.portal,
			};
			postAnalyticsData(POST_TYPES.OFFER_UI_ERRORS, postObject);
		}
		return false;
	};

	setOffersData = res => {
		// only set offers data if there's at least one
		if (get(res, 'data.offers[0]')) {
			this.setState({
				offers: res.data.offers,
				currentOffer: res.data.offers[0],
				options: res.data.options,
			});
			return true;
		}
		return false;
	};

	// Fetch offers data
	componentDidMount = async () => {
		await this.getOffersData();

		// After offers data comes back, dispatch 'offersLoaded' event
		this.dispatchOffersLoaded();

		//analytics
		let objOffer = Object.keys(this.state.offers).map(key => this.state.offers[key]);
		let eligibleOffers = objOffer.map(offer => offer.title).join('|');
		const postObject = {
			offerName: this.state.currentOffer.title,
			offerType: this.state.currentOffer.type,
			eligibleOffers: eligibleOffers,
			referringPortal: this.props.portal,
		};
		postAnalyticsData(POST_TYPES.OFFER_PAGELOAD, postObject);
	};

	handleClick = interaction => {
		const offersArray = this.state.offers;
		for (let i = 0; i < this.state.offers.length; i++) {
			if (this.state.currentOffer.offerCode === this.state.offers[i].offerCode) {
				offersArray.splice(i, 1);
			}
		}
		this.setState({
			offers: offersArray,
			currentOffer: offersArray[0],
		});
		this.sendInteraction(interaction);
	};

	sendInteraction = interaction => {
		const interactionData = this.constructInteraction(interaction);
		axios
			.post(interactionData.url, interactionData.data)
			.then(this.checkActionSuccess)
			.catch(this.handleError);
	};

	checkActionSuccess = response => {
		//analytics
		const result = response.data.postResult.postOutput.status.messages.message[0].code;
		if (result === '10200') {
			const postObject = {
				status: 'success',
				referringPortal: this.props.portal,
			};
			postAnalyticsData(POST_TYPES.OFFER_API, postObject);
			return true;
		}
		return false;
	};

	constructInteraction = interaction => {
		const thisOffer = this.state.currentOffer;
		const nextOffer = this.state.offers[0];

		let dispTxt = '';
		if (interaction === 'NoInterest') {
			dispTxt = thisOffer.template.notInterested.title;

			//analytics:
			if (this.state.offers.length > 0) {
				const postObject = {
					offerName: nextOffer.title,
					offerType: nextOffer.type,
					linkName: nextOffer.template.notInterested.title,
					offerNavType: 'not interested click',
					referringPortal: this.props.portal,
				};
				postAnalyticsData(POST_TYPES.OFFER, postObject);
			}
		} else if (interaction === 'TellMeMore') {
			dispTxt = thisOffer.template.tellMeMore.title;

			//analytics:
			if (this.state.offers.length > 0) {
				const postObject = {
					offerName: nextOffer.title,
					offerType: nextOffer.type,
					linkName: nextOffer.template.tellMeMore.title,
					offerNavType: 'view details click',
					referringPortal: this.props.portal,
				};
				postAnalyticsData(POST_TYPES.OFFER, postObject);
			}
		}
		return {
			url: getApiUrl() + '/' + getEndpoint('leadPromotion') + '/' + thisOffer.offerCode,
			data: {
				blackListDays: thisOffer.blacklistTime,
				dispositionText: dispTxt,
				eventDesc: thisOffer.template.title,
				eventName: interaction,
				memberId: thisOffer.memberId,
				opportunityTypeCd: thisOffer.opportunityTypeCd,
				treatmentCode: thisOffer.treatmentCode,
			},
		};
	};

	dispatchOffersLoaded = () => {
		var event = document.createEvent('Event');
		event.initEvent('myoptumOffersLoaded', false, true);
		const isOffer = this.state.offers.length > 0 ? true : false;
		event.detail = { hasOffer: isOffer };
		window.dispatchEvent(event);
		return true;
	};

	/**
	 * handlePageChange - Changes the page to the offer with a matching offerCode\
	 *
	 * @param {String} newPage offerCode of offer being paged to
	 */
	handlePageChange = newPage => {
		const currentPageKey = this.state.currentOffer.offerCode;
		const newPageKey = newPage.offerCode;

		// If page isn't new, do nothing
		//if (currentPageKey !== newPageKey) {
		const postObject = {
			offerName: newPage.template.title,
			offerType: newPage.type,
			offerNavType: 'navigation dot click',
			referringPortal: this.props.portal,
		};
		postAnalyticsData(POST_TYPES.OFFER, postObject);
		this.setState({ currentOffer: newPage });
		//}
	};

	render = () => {
		const { offers, options, currentOffer } = this.state;
		const shouldShow = this.state.currentOffer && Object.keys(this.state.currentOffer).length > 0;

		return (
			<div className={classNames('offers', { 'has-offers': shouldShow })}>
				{shouldShow && (
					<OfferCard
						handleClick={this.handleClick}
						title={get(currentOffer, 'template.title')}
						description={get(currentOffer, 'template.content')}
						image={get(currentOffer, 'template.image')}
						icon={get(currentOffer, 'template.icon')}
						notInterested={get(currentOffer, 'template.notInterested')}
						tellMeMore={get(currentOffer, 'template.tellMeMore')}
						altText={get(currentOffer, 'template.alt')}
						modal={get(currentOffer, 'template.modal')}
						type={currentOffer.type}
						offerCode={currentOffer.offerCode}
						category={currentOffer.category}
						portal={this.props.portal}
					/>
				)}

				{offers &&
					offers.length > 1 &&
					options &&
					options.displayPagination && (
						<Pagination
							uniqueId="offerCode"
							activePage={currentOffer.offerCode}
							pages={offers}
							handlePageChange={this.handlePageChange}
						/>
					)}
			</div>
		);
	};
}

export default Offers;

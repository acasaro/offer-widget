import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { forOwn } from 'lodash';
import Card from '../general/card/card';
import { hasModal } from '../../util/offer-utils';
import { linkTarget } from '../../util/dom-utils';
import AnalyticsLink from '../general/analytics-link/analytics-link';
import { POST_TYPES } from '../../util/constants/analytics';
import { isNullEmptyOrUndefined } from '../../util/string-utils';
import Modal from '../general/modal/modal';

class OfferCard extends Component {
	static propTypes = {
		title: PropTypes.string,
		description: PropTypes.string,
		type: PropTypes.string,
		handleClick: PropTypes.func,
		tellMeMore: PropTypes.shape({
			title: PropTypes.string,
			link: PropTypes.string,
			openNewWindow: PropTypes.bool,
			linkIcon: PropTypes.string,
		}),
		notInterested: PropTypes.shape({
			title: PropTypes.string,
			linkIcon: PropTypes.string,
			link: PropTypes.string,
			openNewWindow: PropTypes.bool,
		}),
		icon: PropTypes.string,
		image: PropTypes.string,
		altText: PropTypes.string,
		modal: PropTypes.shape({
			title: PropTypes.string,
			content: PropTypes.string,
			cta: PropTypes.string,
			ctaLink: PropTypes.string,
			dismiss: PropTypes.string,
		}),
		portal: PropTypes.string,
	};

	static defaultProps = {
		title: '',
		description: '',
		type: '',
		tellMeMore: {},
		notInterested: {},
		icon: '',
		image: '',
		altText: '',
		modal: {},
	};

	state = {
		modalOpen: false,
	};

	// Toggles the modal (opened === true, closed === false)
	toggleModal = () => {
		// if modal is open, then send interaction
		if (this.state.modalOpen) {
			this.tellMore();
		}
		this.setState(prevState => ({ modalOpen: !prevState.modalOpen }));
	};

	//isMobile = () => window.innerWidth < 200;

	tellMore = () => this.props.handleClick('TellMeMore');

	removeOffer = () => this.props.handleClick('NoInterest');

	render = () => {
		const { title, description, type, image, icon, tellMeMore, notInterested, altText, modal, portal } = this.props;

		const { modalOpen } = this.state;

		const isCentered = Boolean(icon);
		// const isMobile = {isMobile};
		// console.log("isMobile"+isMobile);
		// console.log("window.innerWidth < 200"+window.innerWidth);

		const tellMoreClickHandler = hasModal(modal) ? this.toggleModal : this.tellMore;
		return (
			<Card extraClasses="offer-card">
				{icon && (
					<div className="icon-container icon-circle centered">
						<span className={`icon ${icon} icon-large`} alt={altText} />
					</div>
				)}

				{image && (
					<div className="icon-container">
						<img src={image} className="offer-image icon-img" alt={altText} />
					</div>
				)}
				<div className={`offer-card__text ${isCentered ? 'centered' : ''}`}>
					<h6 className="offer-card__title">{title}</h6>
					<p className="offer-card__description">{description}</p>
				</div>
				<div className="button-col">
					<AnalyticsLink
						className={`button button-primary offer-cta ${tellMeMore.linkIcon}`}
						onClick={tellMoreClickHandler}
						type={POST_TYPES.OFFER_LINKS}
						analyticsData={{
							offerName: title,
							offerType: type,
							linkName: tellMeMore.title,
							referringPortal: portal,
						}}
						href={tellMeMore.link}
						target={linkTarget(tellMeMore.openNewWindow)}
					>
						{tellMeMore.title}
					</AnalyticsLink>

					<AnalyticsLink
						className={`button button-outline remove-offer ${notInterested.linkIcon}`}
						onClick={this.removeOffer}
						type={POST_TYPES.OFFER_LINKS}
						href={notInterested.link}
						role="button"
						analyticsData={{
							offerName: title,
							offerType: type,
							linkName: notInterested.title,
							referringPortal: portal,
						}}
					>
						{notInterested.title}
					</AnalyticsLink>
				</div>

				{hasModal && (
					<Modal
						analyticsOfferName={modal.title}
						analyticsOfferType={this.props.type}
						analyticsLinkName="offer modal close"
						portal={this.props.portal}
						handleClose={this.toggleModal}
						heading={modal.title}
						isOpen={modalOpen}
						closeText={modal.dismiss}
					>
						<p>{modal.content}</p>
						<a href={'tel:' + modal.content}>{modal.content}</a>
					</Modal>
				)}
			</Card>
		);
	};
}

export default OfferCard;

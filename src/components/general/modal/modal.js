import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AnalyticsLink from '../analytics-link/analytics-link';
import { POST_TYPES } from '../../../util/constants/analytics';
import { getTabbables } from '../../../util/dom-utils';
import './_modal.scss';

class Modal extends Component {
	static propTypes = {
		analyticsContentName: PropTypes.string,
		analyticsContentCategory: PropTypes.string,
		portal: PropTypes.string,
		handleClose: PropTypes.func,
		heading: PropTypes.string,
		isOpen: PropTypes.bool,
		children: PropTypes.node,
		closeText: PropTypes.string,
	};

	componentDidMount = () => window.addEventListener('keydown', this.accessibleKeys);

	componentWillReceiveProps = nextProps => {
		// If tabbables haven't been found yet, find them
		if (nextProps.isOpen && !this.tabbables.length) {
			this.tabbables = getTabbables(this.containerElement);
		}

		// If the modal wasn't previously open, but is being opened,
		// let's add a tab handler
		if (!this.props.isOpen && nextProps.isOpen && this.tabbables.length) {
			// Save the focused element prior to opening the modal (so we can)
			// return focus back after the modal is closed again
			this.focusBack =
				document.activeElement && document.activeElement !== document.body
					? document.activeElement
					: document.querySelector(':focus');

			// Focus on the first tabbable
			this.tabbables[0].focus();
		}
	};

	componentWillUnmount = () => window.removeEventListener('keydown', this.accessibleKeys);

	// Store tabbable elements within the modal
	tabbables = [];
	focusBack = null;

	/**
	 * accessibleKeys - Handles user-triggered keydown events. Esc closes modal,
	 *                   tabs stay within the modal until the modal is closed
	 *
	 * @param {Event} e -  An event triggered by user input
	 */
	accessibleKeys = e => {
		if ((e.key === 'Escape' || e.keyCode === 27) && this.props.isOpen) {
			this.closeModal(e);
		} else if ((e.key === 'Tab' || e.keyCode === 9) && this.props.isOpen && this.tabbables.length) {
			e.preventDefault();
			e.stopPropagation();

			const currentIndex = Array.prototype.indexOf.call(this.tabbables, e.target);

			// If not on a valid tabbable, tab to zero index
			let changeTo = 0;

			// If shift was being pressed, tab one back (unless at 0 index)
			// If at zero index, cycle back to last tabbable
			if (e.shiftKey && currentIndex !== -1) {
				changeTo = currentIndex === 0 ? this.tabbables.length - 1 : currentIndex - 1;
			} else if (currentIndex !== -1) {
				changeTo = currentIndex === this.tabbables.length - 1 ? 0 : currentIndex + 1;
			}

			this.tabbables[changeTo].focus();
		}
	};

	/**
	 * closeModal - Closes the modal and returns focus back to the
	 *               element selected prior to opening the modal (a11y)
	 *
	 * @param {Event} e -  An event triggered by user input
	 */
	closeModal = e => {
		this.props.handleClose(e);

		if (this.focusBack) {
			this.focusBack.focus();
			this.focusBack = null;
		}
	};

	render() {
		const {
			analyticsOfferName,
			analyticsOfferType,
			analyticsLinkName,
			portal,
			heading,
			isOpen,
			children,
			closeText,
		} = this.props;

		return (
			<div className={classNames('modal', { 'is-open': isOpen })}>
				<div className="modal-container">
					<div
						className="modal-content"
						role="dialog"
						ref={el => {
							this.containerElement = el;
						}}
					>
						<AnalyticsLink
							type={POST_TYPES.OFFER_LINKS}
							analyticsData={{
								offerName: analyticsOfferName,
								offerType: analyticsOfferType,
								linkName: analyticsLinkName,
								portal: portal,
							}}
							role="button"
							onClick={this.closeModal}
							className="button button-close close"
						/>
						<div className="modal-header">{heading}</div>
						<div className="modal-body">{children}</div>
						<br />
						<AnalyticsLink
							type={POST_TYPES.OFFER_LINKS}
							analyticsData={{
								offerName: analyticsOfferName,
								offerType: analyticsOfferType,
								linkName: analyticsLinkName,
								portal: portal,
							}}
							role="button"
							className="button button-primary"
							onClick={this.closeModal}
						>
							{closeText}
						</AnalyticsLink>
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isNullEmptyOrUndefined } from '../../../util/string-utils';
import { postAnalyticsData } from '../../../util/analytics-utils';

class AnalyticsLink extends Component {
	static propTypes = {
		alt: PropTypes.string,
		analyticsData: PropTypes.shape({
			campaignValue: PropTypes.string,
		}),
		ariaControls: PropTypes.string,
		ariaExpanded: PropTypes.bool,
		ariaLabel: PropTypes.string,
		children: PropTypes.node,
		className: PropTypes.string,
		href: PropTypes.string,
		id: PropTypes.string,
		onBlur: PropTypes.func,
		onClick: PropTypes.func,
		onFocus: PropTypes.func,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func,
		role: PropTypes.string,
		style: PropTypes.object,
		target: PropTypes.string,
		type: PropTypes.string,
	};

	handleClick = e => {
		const { type, analyticsData, onClick, href } = this.props;

		// If no link was passed in, preventDefault
		if (isNullEmptyOrUndefined(href) && e && e.preventDefault) {
			e.preventDefault();
		}

		// Post the analytics data
		postAnalyticsData(type, analyticsData);

		// Second, call the main click handler from props
		if (onClick && typeof onClick === 'function') {
			onClick(e);
		}
	};

	render = () => {
		const {
			href,
			id,
			className,
			alt,
			ariaControls,
			ariaLabel,
			ariaExpanded,
			role,
			onFocus,
			onBlur,
			onMouseEnter,
			onMouseLeave,
			style,
			target,
			children,
		} = this.props;
		const link = isNullEmptyOrUndefined(href) ? '#' : href;

		// Standard HTML attributes to be added to anchor tag
		const htmlAttrProps = {
			onMouseEnter,
			onMouseLeave,
			onBlur,
			onFocus,
			alt,
			className,
			id,
			role,
			style,
			target,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-label': ariaLabel,
		};

		return (
			<a
				ref={el => {
					this.linkElement = el;
				}}
				href={link}
				onClick={this.handleClick}
				{...htmlAttrProps}
			>
				{children}
			</a>
		);
	};
}

export default AnalyticsLink;

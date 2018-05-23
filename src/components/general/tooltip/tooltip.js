import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { postAnalyticsData } from '../../../util/analytics-utils';
import './_tooltip.scss';

class Tooltip extends Component {
	static propTypes = {
		analyticsType: PropTypes.string,
		children: PropTypes.node,
		label: PropTypes.string,
		uniqueId: PropTypes.string.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			expanded: false,
			clickedOpen: false,
		};
	}

	// Add handler to hide tooltip on a click outside of tooltip
	componentDidMount = () => document.addEventListener('click', this.handleClickOutside);

	// Remove handler to hide tooltip on a click outside of tooltip
	componentWillUnmount = () => document.removeEventListener('click', this.handleClickOutside);

	// If a tooltip was clicked open, we only hide it on a click outside of the tooltip
	handleClickOutside = e => {
		if (this.tooltipElement && !this.tooltipElement.contains(e.target)) {
			this.setState({ expanded: false, clickedOpen: false });
		}
	};

	toggleTooltip = e => {
		e.preventDefault();
		const isClick = e.type === 'click';

		// Post the analytics data if expanding
		if (!this.state.expanded) {
			postAnalyticsData(this.props.analyticsType, { contentName: this.props.label });
		}

		this.setState(prevState => {
			const newState = {
				expanded: isClick || (!isClick && !prevState.expanded && !prevState.clickedOpen) || prevState.clickedOpen,
			};

			if (newState.expanded && isClick) {
				newState.clickedOpen = true;
			} else if (!newState.expanded) {
				newState.clickedOpen = false;
			}

			return newState;
		});
	};

	render = () => {
		const { expanded } = this.state;
		const { children, uniqueId, label } = this.props;

		return (
			<div
				className="tooltip-container"
				ref={el => {
					this.tooltipElement = el;
				}}
			>
				<a
					href="#"
					className="button button-circle button-tooltip"
					aria-label={`Informational Tooltip for ${label}`}
					aria-expanded={expanded}
					aria-controls={uniqueId}
					role="button"
					onClick={this.toggleTooltip}
					onFocus={this.toggleTooltip}
					onBlur={this.toggleTooltip}
					onMouseEnter={this.toggleTooltip}
					onMouseLeave={this.toggleTooltip}
				>
					<span aria-hidden="true">i</span>
				</a>

				<div className="tooltip-content" aria-hidden={!expanded} role="region" id={uniqueId}>
					{children}
				</div>
			</div>
		);
	};
}

export default Tooltip;

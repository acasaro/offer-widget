import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './_examples.scss';

// The CacheIdChanger incomplete/broken, but not a necessary feature at the moment
class CacheIdChanger extends Component {
	static propTypes = {
		cacheId: PropTypes.string,
	};

	static defaultProps = {
		cacheId: '',
	};

	state = {
		newCacheId: this.props.cacheId,
		isExpanded: false,
	};

	handleChange = e => this.setState({ newCacheId: e.target.value });

	handleSubmit = () => {
		localStorage.setItem(
			// prettier-ignore
			"myoptumLibs-activeCacheId",
			// prettier-ignore
			JSON.stringify({ id: this.state.newCacheId, displayTitle: "Custom" })
		);
		window.location.href = '/';
	};

	toggleCacheIdSelector = () => this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

	render = () => {
		const { newCacheId, isExpanded } = this.state;
		return (
			<div
				className={classNames('cache-id-changer', {
					'is-expanded': isExpanded,
				})}
			>
				<div className="form">
					<h1>Enter a CacheID:</h1>

					<input id="cacheIdChanger" className="input" onChange={this.handleChange} value={newCacheId} />
					<button className="button button-primary" onClick={this.handleSubmit}>
						Set
					</button>
				</div>
			</div>
		);
	};
}

export default CacheIdChanger;

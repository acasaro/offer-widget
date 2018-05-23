import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Page extends Component {
	static propTypes = {
		isActive: PropTypes.bool,
		page: PropTypes.object,
		handlePageChange: PropTypes.func,
	};

	switchActive = () => this.props.handlePageChange(this.props.page);

	render = () => {
		const { isActive } = this.props;
		return (
			<button
				className={classNames('button', 'paging-circle', { 'is-active': isActive })}
				onClick={this.switchActive}
			/>
		);
	};
}

export default Page;

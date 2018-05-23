import React from 'react';
import PropTypes from 'prop-types';
import Page from './page';
import './_pagination.scss';

const Pagination = ({ pages = [], activePage = '', uniqueId = 'key', handlePageChange }) => (
	<div className="pagination">
		{pages.map(page => (
			<Page
				key={page[uniqueId]}
				isActive={Boolean(activePage === page[uniqueId])}
				page={page}
				handlePageChange={handlePageChange}
			/>
		))}
	</div>
);

Pagination.propTypes = {
	handlePageChange: PropTypes.func,
	activePage: PropTypes.string,
	pages: PropTypes.array,
	uniqueId: PropTypes.string,
};

export default Pagination;

import React from 'react';
import PropTypes from 'prop-types';
import './_card.scss';

const Card = ({ children, extraClasses = '' }) => <div className={`card ${extraClasses}`}>{children}</div>;

Card.propTypes = {
	children: PropTypes.node,
	extraClasses: PropTypes.string,
};

export default Card;

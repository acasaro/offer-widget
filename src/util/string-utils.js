import React from 'react';
import { forOwn } from 'lodash';
import AnalyticsLink from '../components/general/analytics-link/analytics-link';
import { POST_TYPES } from '../util/constants/analytics';

export const REPLACEMENT_VARIABLE_OPTION_TYPES = {
	ON_CLICK: 'onClick',
	STYLED_SPAN: 'styledSpan',
};

/**
 * getExcerpt - Returns an excerpt from a longer string
 *
 * @param {String} content      Longer block of content
 * @param {Number} approxLength Number of characters desired, approximately
 * @returns {String}
 */
export const getExcerpt = (content, approxLength) => {
	if (content.length <= approxLength) {
		return content;
	}

	// Split content by words
	const contentArray = content.substr(0, approxLength).split(' ');

	// Set the last "word" in the array to an ellipsis
	contentArray[contentArray.length - 1] = '...';
	return contentArray.join(' ');
};

/**
 * getUniqueId - Generate a random HTML id
 *
 * @returns {String}
 */
export const getUniqueId = () =>
	`component_${Math.random()
		.toString(36)
		.substr(2, 6)}`;

/**
 * replaceVariables - Replaces {{variables}} from AEM with JS variables
 *
 * @param {String}  str       String to search and replace variables in
 * @param {Object}  variables Variables to replace in str, key = var name
 * @returns {String|JSX}
 */
export const replaceVariables = (str = '', variables = {}) => {
	if (!str || !str.length) {
		return '';
	}

	forOwn(variables, (value, key) => {
		const strVar = `{{${key}}}`;
		const index = str.indexOf(strVar);

		if (index > -1) {
			const keyLength = strVar.length;
			let firstHalf = '';

			if (index !== 0) {
				firstHalf = str.substr(0, index);
			}

			const lastHalf = str.substr(index + keyLength);

			// If the variable being replaced is something dynamic (an object),
			// we can return JSX for render
			if (typeof value === 'object' && Object.keys(value).length) {
				// Check for click handlers, and return a link with a handler
				if (value[REPLACEMENT_VARIABLE_OPTION_TYPES.ON_CLICK]) {
					str = (
						<span>
							{firstHalf && <span className="first-half">{firstHalf}</span>}
							<AnalyticsLink
								href="#"
								onClick={value[REPLACEMENT_VARIABLE_OPTION_TYPES.ON_CLICK]}
								className={value.anchorClass}
								type={POST_TYPES.CUSTOM_LINK}
								analyticsData={{ contentName: 'Retry Now link - api error message', contentCategory: 'error page' }}
							>
								{value.text}
							</AnalyticsLink>
							{lastHalf && <span className="second-half">{lastHalf}</span>}
						</span>
					);
					// If there needs to be a span (with a specific class) wrapping the variable,
					// we can return some JSX to handle that
				} else if (value[REPLACEMENT_VARIABLE_OPTION_TYPES.STYLED_SPAN]) {
					str = (
						<span>
							{firstHalf && <span className="first-half">{firstHalf}</span>}
							<span className={value[REPLACEMENT_VARIABLE_OPTION_TYPES.STYLED_SPAN]}>{value.text}</span>
							{lastHalf && <span className="second-half">{lastHalf}</span>}
						</span>
					);
				}
			} else {
				str = firstHalf + value + lastHalf;
			}
		}
	});

	return str;
};

/**
 * formatCurrency - Convert a number string to currency format
 *
 * Adapted from https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
 *
 * @param {String}  str          String to format as currency
 * @param {String}  currencySign Symbol to prepend to currency string output
 * @returns {String}
 */
export const formatCurrency = (str, currencySign) =>
	`${currencySign}${Number.parseFloat(str)
		.toFixed(2)
		.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;

/**
 * trim - Trims a string if it exists, else returns blank string
 *
 * @param {String} str     String to trim spaces from
 * @returns {String}
 */
export const trim = str => (str && str.length ? str.replace(/^\s+|\s+$/gm, '') : '');

/**
 * isNullEmptyOrUndefined - Checks to see if the parameter is null,
 * empty, or undefined.
 *
 * @param {*} str     Item to verify
 * @returns {Boolean}
 */
export const isNullEmptyOrUndefined = str =>
	str === null || typeof str === 'undefined' || (typeof str === 'string' && trim(str) === '');

/**
 * toTitleCase - Converts strings to title case
 *
 * @param {String} str
 * @returns {String}
 */
export const toTitleCase = str =>
	str && str.length ? str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : '';

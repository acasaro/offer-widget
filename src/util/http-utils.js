import axios from 'axios';
import { get as lodashGet } from 'lodash';

/**
 * getQueryString - Get a query string parameter by name
 * Adapted from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 *
 * @param {String} name   Name of parameter to retrieve
 * @returns {{String|Null}}
 */
export const getQueryString = name => {
	const url = lodashGet(window, 'location.search');
	name = name.replace(/[[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
	const results = regex.exec(url);

	if (!results) {
		return null;
	}

	if (!results[2]) {
		return '';
	}

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { get } from 'lodash';
import { isNullEmptyOrUndefined } from './string-utils';

export const checkIfElementExists = selector => {
	const element = document.querySelector(selector);
	if (element !== null) {
		return true;
	}
	return false;
};

export const renderIfExists = (Component, selector, opts = {}) => {
	if (checkIfElementExists(selector)) {
		render(Component, document.querySelector(selector));
		return true;
	}
	// If mounting was unsuccessful, return false and put up a console warning
	console.warn(`Attempting to mount to ${selector} failed. DOM node not found.`);
	return false;
};

/**
 * linkTarget  - takes in boolean, returns '_blank' for true, '_self' for false
 * @param {Boolean}  openNewWindow       Whether to open in new tab or not
 * @returns {String}
 */
export const linkTarget = openNewWindow => (openNewWindow ? '_blank' : '_self');

export const getTabbables = element => {
	const tabbableQuery = ['input', 'select', 'a[href]', 'textarea', 'button', '[role=button]', '[tabindex]'];

	return element.querySelectorAll(tabbableQuery.join(','));
};

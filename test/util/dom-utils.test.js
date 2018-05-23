import React from 'react';
import { render } from 'react-dom';
import { renderIfExists, linkTarget } from '../../src/util/dom-utils';

describe('DOM Utilities Tests', () => {
	it('should return true when a component is mounted, false when not', () => {
		// Should fail to mount, because <test-elem> doesn't exist yet
		expect(renderIfExists(<div />, 'test-elem')).toBe(false);

		// But should succeed when <test-elem> is present in the DOM
		const testElem = document.createElement('test-elem');
		document.body.appendChild(testElem);
		expect(renderIfExists(<div />, 'test-elem')).toBe(true);
	});

	it('should return the correct link target using linkTarget', () => {
		const isTrue = linkTarget(true);
		const isFalse = linkTarget(false);
		expect(isTrue).toBe('_blank');
		expect(isFalse).toBe('_self');
	});
});

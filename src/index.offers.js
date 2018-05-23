import React from 'react';
import { renderIfExists, checkIfElementExists } from './util/dom-utils';
// Currently we're only using the OM widget on homepage, which we know has the analyticsScript.
// Once we add this widget to other portals, we'll need to check if script is injected already.
import { injectAnalyticsScript } from './util/analytics-utils';
import Offers from './components/offers/offers';

// Import base styles
import './public/stylesheets/base.scss';

export const initialize = (options = {}) => {
	// Check every one second for ten seconds to see if myoptum-offers exists
	const renderIfExistsAndClear = () => {
		if (checkIfElementExists('myoptum-offers')) {
			clearInterval(waitForRender);
			renderIfExists(<Offers cacheId={options.cacheId} portal={options.portal} />, 'myoptum-offers');
		}
	};

	const waitForRender = setInterval(renderIfExistsAndClear, 250);

	const stopAfterTen = setTimeout(() => {
		clearInterval(waitForRender);
	}, 10000);
};

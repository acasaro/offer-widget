import React from 'react';
import { getEnvironment } from './util/environment-utils';
import { getQueryString } from './util/http-utils';
import { renderIfExists } from './util/dom-utils';
import { injectAnalyticsScript } from './util/analytics-utils';
import Offers from './components/offers/offers';
import CacheIdChanger from './components/cache-id-changer/cache-id-changer';
import './public/stylesheets/base.scss';

// Add proper analytics script to document head
injectAnalyticsScript().then(() => {
	const localCache = JSON.parse(localStorage.getItem('myoptumLibs-activeCacheId'));
	const cacheId = localCache ? localCache.id : '';

	if (getEnvironment() === 'development' && getQueryString('changeUser')) {
		renderIfExists(<CacheIdChanger cacheId={cacheId} />, '#root');
	} else {
		renderIfExists(<Offers cacheId={cacheId} portal="Homepage" />, 'myoptum-offers');
	}
});

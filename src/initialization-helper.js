import { getEnvironment } from './util/environment-utils';
import { getQueryString } from './util/http-utils';

export const useMockData = () =>
	['development', 'test', 'stage'].includes(getEnvironment()) && getQueryString('useMockData') === 'true';

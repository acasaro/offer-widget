export const API = {
	PRODUCTION: '/api',
	STAGE: '/api',
	TEST: 'https://offer-api-dev-ofd-api-nonprod.ose-ctc-core.optum.com/api',
	DEV: 'https://offer-api-dev-ofd-api-nonprod.ose-ctc-core.optum.com/api',
};

export const APP = {
	PRODUCTION: '/',
	STAGE: '/',
	TEST: '/',
	DEV: '/',
};

export const ENDPOINTS = {
	eligibility: {
		layer7: 'eligibility',
		insecure: 'ogn/dashboard/gateway/member/eligibilities/v1.0/read',
	},
	finance: {
		layer7: 'finance',
		insecure: 'ogn/dashboard/gateway/member/accounts/v1.0/read',
	},
	rx: {
		layer7: 'rx',
		insecure: 'ogn/dashboard/gateway/member/prescriptions/v1.0/read',
	},
	leadPromotion: {
		layer7: 'offers',
		insecure: 'ogn/v1.0/offers',
	},
	leadInteraction: {
		layer7: 'ogn/v1.0/offers',
		insecure: 'ogn/v1.0/offers',
	},
	lawwClaims: {
		layer7: 'eligibility',
		insecure: 'ogn/dashboard/gateway/member/laww/claims/v1.0/read',
	},
};

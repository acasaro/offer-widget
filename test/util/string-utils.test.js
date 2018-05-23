import React from 'react';
import { shallow } from 'enzyme';
import {
	getUniqueId,
	getExcerpt,
	replaceVariables,
	formatCurrency,
	isNullEmptyOrUndefined,
	toTitleCase,
	REPLACEMENT_VARIABLE_OPTION_TYPES,
} from '../../src/util/string-utils';

describe('String Utilities Tests', () => {
	it('should return a unique HTML id', () => {
		// Ensure that no id matches in a test of 10 generated IDs.
		const sampleSet = [];
		for (let i = 0; i < 10; i += 1) {
			sampleSet.push(getUniqueId());
		}

		expect(sampleSet).toHaveLength(10);

		// A array containing only uniques from the sampleSet should be the same length (10)
		expect(Array.from(new Set(sampleSet))).toHaveLength(10);
	});

	it('should return an excerpt ending with a full word followed by an ellipsis', () => {
		// Prometheus by Goethe
		const testString = 'Bedecke deinen Himmel, Zeus. Mit Wolkendunst! Und übe Knaben gleich, der Disteln köpft.';
		expect(getExcerpt(testString, 17)).toBe('Bedecke deinen ...');
		expect(getExcerpt(testString, 67)).toBe('Bedecke deinen Himmel, Zeus. Mit Wolkendunst! Und übe Knaben ...');
		expect(getExcerpt(testString, 87)).toBe(testString);
	});

	it('should return a string with variables replaced dynamically', () => {
		const testVars = {
			name: 'Goofy',
			favoriteColor: 'red',
		};

		expect(replaceVariables()).toBe('');
		expect(replaceVariables('{{name}} has the favorite color: {{favoriteColor}}.', testVars)).toBe(
			'Goofy has the favorite color: red.'
		);
		expect(replaceVariables('ding ding!', { ok: 'no change' })).toBe('ding ding!');
	});

	it('should properly format currencies', () => {
		expect(formatCurrency('123', '$')).toBe('$123.00');
		expect(formatCurrency('123123.12', '$')).toBe('$123,123.12');
	});

	it('isNullEmptyOrUndefined should return true for null empty or undefined values, else false', () => {
		expect(isNullEmptyOrUndefined(null)).toEqual(true);
		expect(isNullEmptyOrUndefined('')).toEqual(true);
		expect(isNullEmptyOrUndefined('')).toEqual(true);
		expect(isNullEmptyOrUndefined(undefined)).toEqual(true);
		expect(isNullEmptyOrUndefined()).toEqual(true);
		expect(isNullEmptyOrUndefined('Martin Sheen')).toEqual(false);
		expect(isNullEmptyOrUndefined('Antonio Banderas')).toEqual(false);
	});

	it('toTitleCase should return a string that is titlecase', () => {
		expect(toTitleCase('THIS SHOULD BE TITLECASE')).toEqual('This Should Be Titlecase');
		expect(toTitleCase('this string should also be titlecase')).toEqual('This String Should Also Be Titlecase');
		expect(toTitleCase('8080 localhost ST, ST. PAUL MN')).toEqual('8080 Localhost St, St. Paul Mn');

		expect(toTitleCase()).toEqual('');
	});

	it('replaceVariables should return a link if an onClick option is passed in', () => {
		const output = replaceVariables('test {{varHere}} output', {
			varHere: {
				[REPLACEMENT_VARIABLE_OPTION_TYPES.ON_CLICK]: () => {},
				text: 'link',
			},
		});

		expect(shallow(output).text()).toEqual('test <AnalyticsLink /> output');
		expect(shallow(output).find('AnalyticsLink')).toHaveLength(1);
	});

	it('replaceVariables should return a span with a className if the styledSpan option is passed in', () => {
		const output = replaceVariables('test {{varHere}} output', {
			varHere: {
				[REPLACEMENT_VARIABLE_OPTION_TYPES.STYLED_SPAN]: 'fancyClass',
				text: 'span',
			},
		});

		expect(shallow(output).text()).toEqual('test span output');
		expect(shallow(output).find('.fancyClass')).toHaveLength(1);
		expect(
			shallow(output)
				.find('.fancyClass')
				.text()
		).toEqual('span');
	});

	it('replaceVariables should return the original string if an unknown configuration is passed in', () => {
		expect(
			replaceVariables('test {{ok}}', {
				ok: { correcthorsebatterystaple: 'xkcd' },
			})
		).toBe('test {{ok}}');
	});
});

import React from 'react';
import { mount } from 'enzyme';
import AnalyticsLink from '../../../src/components/general/analytics-link/analytics-link';
import { postAnalyticsData } from '../../../src/util/analytics-utils';

jest.mock('../../../src/util/analytics-utils', () => ({
	postAnalyticsData: jest.fn(),
}));

describe('Analytics link component', () => {
	beforeEach(() => {
		process.env.NODE_ENV = 'test';
	});

	it('should correctly render a component', () => {
		const wrapper = mount(<AnalyticsLink />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should call the original click handler when an analytics link is clicked', () => {
		const mockOnClick = jest.fn();
		const wrapper = mount(<AnalyticsLink onClick={mockOnClick} />);
		postAnalyticsData.mockClear();
		wrapper.simulate('click');
		expect(mockOnClick).toHaveBeenCalled();
		expect(postAnalyticsData).toHaveBeenCalled();
	});

	it('should call postAnalyticsData but not an onClick if no onClick is passed in', () => {
		const wrapper = mount(<AnalyticsLink />);
		postAnalyticsData.mockClear();
		wrapper.simulate('click');
		expect(postAnalyticsData).toHaveBeenCalled();
	});

	it('should not call event.preventDefault if there is an href provided', () => {
		const wrapper = mount(<AnalyticsLink href="http://something.com" />);
		const event = {
			preventDefault: jest.fn(),
		};
		wrapper.instance().handleClick(event);
		expect(event.preventDefault).not.toHaveBeenCalled();
	});

	afterEach(() => {
		// Set environment back to test
		process.env.NODE_ENV = 'test';
	});
});

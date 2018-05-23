import React from 'react';
import { shallow, mount } from 'enzyme';
import Tooltip from '../../../src/components/general/tooltip/tooltip';

describe('Tooltip component', () => {
	const fakeUniqueId = 'component_p90e9b';
	const tooltip = shallow(
		<Tooltip uniqueId={fakeUniqueId}>
			<div>
				<p>This is a test child node</p>
			</div>
		</Tooltip>
	);

	it('should render a tooltip', () => {
		expect(tooltip).toMatchSnapshot();
	});

	it('should toggle the tooltip on mouseenter, mouseleave, blur, and focus', () => {
		const button = tooltip.find('.button-tooltip');
		const initialState = tooltip.state().expanded;
		button.simulate('mouseEnter', { preventDefault: () => {} });
		expect(tooltip.state().expanded).not.toEqual(initialState);
		button.simulate('mouseLeave', { preventDefault: () => {} });
		expect(tooltip.state().expanded).toEqual(initialState);
		button.simulate('blur', { preventDefault: () => {} });
		expect(tooltip.state().expanded).not.toEqual(initialState);
		button.simulate('focus', { preventDefault: () => {} });
		expect(tooltip.state().expanded).toEqual(initialState);
	});

	it('should change expanded and clickedOpen state to false when clicked outside of the tooltip', () => {
		const wrapper = mount(<Tooltip uniqueId={fakeUniqueId} />);
		wrapper.setState({ expanded: true, clickedOpen: true });
		const tooltipElement = wrapper.instance().tooltipElement;

		// Set up the contains method to return false
		tooltipElement.contains = () => false;
		document.dispatchEvent(new Event('click'));

		expect(wrapper.state('expanded')).toBe(false);
		expect(wrapper.state('clickedOpen')).toBe(false);

		// Set up the contains method to return true
		tooltipElement.contains = () => true;
		wrapper.setState({ expanded: true, clickedOpen: true });
		document.dispatchEvent(new Event('click'));

		expect(wrapper.state('expanded')).toBe(true);
		expect(wrapper.state('clickedOpen')).toBe(true);

		// Listener should be removed on unmount
		document.removeEventListener = jest.fn();
		wrapper.unmount();
		expect(document.removeEventListener).toHaveBeenCalled();
	});

	it('should set clickedOpen state to true when tooltip is clicked to open', () => {
		const button = tooltip.find('.button-tooltip');
		tooltip.setState({ expanded: false, clickedOpen: false });
		button.simulate('click', { preventDefault: () => {}, type: 'click' });
		expect(tooltip.state('expanded')).toBe(true);
		expect(tooltip.state('clickedOpen')).toBe(true);
	});
});

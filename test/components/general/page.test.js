import React from 'react';
import { mount, shallow } from 'enzyme';
import Page from '../../../src/components/general/pagination/page';

describe('Page Component', () => {
	it('should render a page component with is-active class when active', () => {
		const page = shallow(<Page isActive pageKey="test1" handlePageChange={() => {}} />);
		expect(page.find('.is-active')).toHaveLength(1);
	});

	it('should render a page component without is-active class when not active', () => {
		const page = shallow(<Page isActive={false} pageKey="test1" handlePageChange={() => {}} />);
		expect(page.find('.is-active')).toHaveLength(0);
	});

	it('should trigger the click handler when the page button is clicked on', () => {
		const handlePageChangeMock = jest.fn();
		const page = mount(<Page isActive={false} pageKey="test1" handlePageChange={handlePageChangeMock} />);
		page.simulate('click');
		expect(handlePageChangeMock).toHaveBeenCalled();
	});
});

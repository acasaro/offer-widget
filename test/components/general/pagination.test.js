import React from 'react';
import { mount, shallow } from 'enzyme';
import Pagination from '../../../src/components/general/pagination/pagination';
import Page from '../../../src/components/general/pagination/page';

describe('Pagination Component', () => {
	it('should render a pagination component', () => {
		const mockPages = [{ key: 'test1' }, { key: 'test2' }];
		const pagination = mount(<Pagination pages={mockPages} activePage="test1" handlePageChange={() => {}} />);
		expect(pagination).toMatchSnapshot();
		expect(pagination.find(Page).find('.is-active')).toHaveLength(1);
	});

	it('should still render a pagination component with missing props', () => {
		const pagination = shallow(<Pagination handlePageChange={() => {}} />);
		expect(pagination).toMatchSnapshot();
	});
});

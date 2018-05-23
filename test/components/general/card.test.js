import React from 'react';
import { shallow } from 'enzyme';
import Card from '../../../src/components/general/card/card';

describe('Card Component', () => {
	it('should render a card component', () => {
		const card = shallow(<Card />);
		expect(card).toMatchSnapshot();
	});
});

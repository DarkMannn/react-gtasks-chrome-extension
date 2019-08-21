import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import TasklistItem from './tasklist-item.js';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('TasklistItem component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<TasklistItem></TasklistItem>);
        expect(wrapper.find('div')).toBeTruthy();
    });
});

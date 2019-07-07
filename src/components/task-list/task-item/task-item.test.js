import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import TaskItem from './task-item.js';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('TaskItem component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<TaskItem></TaskItem>);
        expect(wrapper.find('div')).toBeTruthy();
    });
});

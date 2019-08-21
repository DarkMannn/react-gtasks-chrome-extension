import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GTasks from './g-tasks.js';
import TasklistItem from './tasklist-item/tasklist-item.js';
import TaskItem from './task-item/task-item.js';

Enzyme.configure({ adapter: new Adapter() });

describe('GTasks component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<GTasks gapiTasks={{ dummyProp: 'dummyValue' }}></GTasks>);
        expect(wrapper.find('div')).toBeTruthy();
        expect(wrapper.find(TasklistItem)).toBeTruthy();
        expect(wrapper.find(TaskItem)).toBeTruthy();
    });
});

import React from 'react';
import TasklistItem from './tasklist-item.js';
import { render } from '@testing-library/react';
import { toHaveTextContent } from '@testing-library/jest-dom';

expect.extend({ toHaveTextContent });

describe('TasklistItem component', () => {

    it('renders properly', async () => {

        const { findByTestId } = render(
            <TasklistItem title='title' isHovered={true}></TasklistItem>
        );

        const titleDiv = await findByTestId('tasklistItem');
        expect(titleDiv).toHaveTextContent('title');
    });
});

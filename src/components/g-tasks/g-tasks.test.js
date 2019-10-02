import React from 'react';
import GTasks from './g-tasks.js';
import TasklistItem from './tasklist-item/tasklist-item.js';
import TaskItem from './task-item/task-item.js';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import { toHaveTextContent } from '@testing-library/jest-dom';

expect.extend({ toHaveTextContent });

describe.skip('GTasks component', () => {

    it('renders properly when focused', async () => {

        const { findByTestId } = render(
            <TaskItem
                title='title'
                status="needsAction"
                due="11-11-2011"
                notes="notes"
                isHovered={true}>
            </TaskItem>
        );

        const checkboxDiv = await waitForElement(() => findByTestId('checkbox'));
        const titleDiv = await waitForElement(() => findByTestId('title'));
        const dueDiv = await waitForElement(() => findByTestId('due'));
        const notesDiv = await waitForElement(() => findByTestId('notes'));

        expect(checkboxDiv).toHaveTextContent('\u2610');
        expect(titleDiv).toHaveTextContent('title');
        expect(dueDiv).toHaveTextContent('11-11-2011');
        expect(notesDiv).toHaveTextContent('notes');
    });
});

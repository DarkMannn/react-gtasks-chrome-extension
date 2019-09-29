import React from 'react';
import TaskItemZoomed from './task-item-zoomed.js';
import { render, waitForElement } from '@testing-library/react';
import { toHaveValue } from '@testing-library/jest-dom';

expect.extend({ toHaveValue });

describe('TaskItemZoomed component', () => {

    it('renders properly', async () => {

        const testDue = '11-11-2011'
        const testDueFormated = new Date('11-11-2011').toISOString().split('T')[0];

        const { findAllByDisplayValue } = render(
            <TaskItemZoomed
                title='title'
                due={testDue}
                notes="notes">
            </TaskItemZoomed>
        );

        const titleInput = await waitForElement(() => findAllByDisplayValue('title'));
        const dueInput = await waitForElement(() =>
            findAllByDisplayValue(testDueFormated)
        );
        const notesInput = await waitForElement(() => findAllByDisplayValue('notes'));

        expect(titleInput).toBeDefined();
        expect(dueInput).toBeDefined();
        expect(notesInput).toBeDefined();
    });
});

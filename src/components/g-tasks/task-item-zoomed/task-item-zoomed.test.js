import React from 'react';
import TaskItemZoomed from './task-item-zoomed.js';
import { render } from '@testing-library/react';
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

        const titleInput = await findAllByDisplayValue('title');
        const dueInput = await findAllByDisplayValue(testDueFormated);
        const notesInput = await findAllByDisplayValue('notes');

        expect(titleInput).toBeDefined();
        expect(dueInput).toBeDefined();
        expect(notesInput).toBeDefined();
    });
});

import React from 'react';
import TaskItem from './task-item.js';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import { toHaveTextContent } from '@testing-library/jest-dom';

expect.extend({ toHaveTextContent });

describe('TaskItem component', () => {

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

    it('renders properly when unfocused', async () => {

        expect.assertions(4);

        const { findByTestId } = render(
            <TaskItem
                title='title'
                status="needsAction"
                due="11-11-2011"
                notes="notes"
                isHovered={false}>
            </TaskItem>
        );

        const checkboxDiv = await waitForElement(() => findByTestId('checkbox'));
        expect(checkboxDiv).toHaveTextContent('\u2610');

        const titleDiv = await waitForElement(() => findByTestId('title'));
        expect(titleDiv).toHaveTextContent('title');

        try {
            await waitForElement(() => findByTestId('due'));
        }
        catch (err) {
            expect(err.message).toContain('Unable to find an element by: [data-testid="due"]');
        }

        try {
            await waitForElement(() => findByTestId('notes'));
        }
        catch (err) {
            expect(err.message).toContain('Unable to find an element by: [data-testid="notes"]');
        }
    }, 10000);

    it('calls onBlur callback when blurred', async () => {

        jest.useFakeTimers();
        const mockOnBlurCallback = jest.fn((textContent) => textContent);
        const { findByTestId } = render(
            <TaskItem
                title='title'
                status="needsAction"
                due="11-11-2011"
                notes="notes"
                isHovered={true}
                isEditingActive={true}
                onBlurCallback={mockOnBlurCallback}>
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

        fireEvent.blur(titleDiv);
        expect(mockOnBlurCallback.mock.calls.length).toBe(1);
        expect(mockOnBlurCallback.mock.calls[0][0]).toBe('title');
        expect(mockOnBlurCallback.mock.results[0].value).toBe('title');
    });
});

import React from 'react';
import TasklistItem from './tasklist-item.js';
import { render, fireEvent } from '@testing-library/react';
import { toHaveTextContent } from '@testing-library/jest-dom';

expect.extend({ toHaveTextContent });

describe('TasklistItem component', () => {

    it('renders properly', async () => {

        const { findByTestId, findByText } = render(
            <TasklistItem title='title' isHovered={true}></TasklistItem>
        );

        await findByTestId('tasklistItem');

        const titleDiv = await findByText('title');
        expect(titleDiv).toHaveTextContent('title');
    });

    it('calls onBlur callback when blurred', async () => {

        jest.useFakeTimers();
        const mockOnBlurCallback = jest.fn((textContent) => textContent);
        const { findByTestId, findByText } = render(
            <TasklistItem
                title='title'
                isHovered={true}
                isEditingActive={true}
                onBlurCallback={mockOnBlurCallback}>
            </TasklistItem>
        );

        await findByTestId('tasklistItem');

        const titleDiv = await findByText('title');
        expect(titleDiv).toHaveTextContent('title');

        fireEvent.blur(titleDiv);
        expect(mockOnBlurCallback.mock.calls.length).toBe(1);
        expect(mockOnBlurCallback.mock.calls[0][0]).toBe('title');
        expect(mockOnBlurCallback.mock.results[0].value).toBe('title');
    });
});

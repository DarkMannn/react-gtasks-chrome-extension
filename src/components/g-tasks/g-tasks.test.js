import React from 'react';
import { act } from 'react-dom/test-utils';
import GTasks from './g-tasks.js';
import { render, fireEvent } from '@testing-library/react';
import {
    toHaveTextContent,
    toBeInTheDocument
} from '@testing-library/jest-dom';

jest.mock('../../util/make-custom-gapi-tasks.js');
expect.extend({
    toHaveTextContent,
    toBeInTheDocument
});

let findByTestId;
let findByText;
let findByDisplayValue;
let gapiTasksMock;

describe('GTasks component', () => {

    beforeEach(async () => {

        jest.useFakeTimers();
        gapiTasksMock = {};
        await act(async () => {

            ({ findByTestId, findByText, findByDisplayValue } = render(
                <GTasks gapiTasks={gapiTasksMock}></GTasks>
            ));
        });
    });

    it('loads and renders tasklists at the initial render', async () => {

        const titleDiv = await findByTestId('header');
        expect(titleDiv).toHaveTextContent('Select a Tasklist');

        const itemsDiv = await findByTestId('items');
        expect(itemsDiv).toBeInTheDocument();

        for (const num of [0, 1, 2]) {
            const tasklist = await findByText(`tasklist${num}`);
            expect(tasklist).toBeInTheDocument();
        }
    });

    it('loads tasklist, then deletes a tasklist', async () => {

        expect.assertions(5);

        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 76, ctrlKey: true, shiftKey: true }); // l
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 46, ctrlKey: true }); // del
            jest.runOnlyPendingTimers();
        });

        const titleDiv = await findByTestId('header');
        expect(titleDiv).toHaveTextContent('Select a Tasklist');

        const itemsDiv = await findByTestId('items');
        expect(itemsDiv).toBeInTheDocument();

        for (const num of [1, 2]) {
            const tasklist = await findByText(`tasklist${num}`);
            expect(tasklist).toBeInTheDocument();
        }

        try {
            await findByText(`tasklist0`); // deleted tasklist
        }
        catch (err) {
            expect(err.message).toContain('Unable to find an element with the text: tasklist0.');
        }
    });

    it('loads tasks from selected tasklist', async () => {

        fireEvent.keyDown(document, { keyCode: 76, ctrlKey: true, shiftKey: true }); // l
        fireEvent.keyDown(document, { keyCode: 13, shiftKey: true }); // enter
        jest.runOnlyPendingTimers();

        const titleDiv = await findByTestId('header');
        expect(titleDiv).toHaveTextContent('tasklist0');

        const itemsDiv = await findByTestId('items');
        expect(itemsDiv).toBeInTheDocument();

        for (const num of [0, 1, 2, 3, 4]) {
            const tasklist = await findByText(`task${num}`);
            expect(tasklist).toBeInTheDocument();
        }
    });

    it('loads tasklist, then tasks, then scrolls up, then loads tasklist again', async () => {

        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 76, ctrlKey: true, shiftKey: true }); // l
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 13, shiftKey: true }); // enter
            jest.runOnlyPendingTimers();
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 38 }); // up
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 13 }); // enter
            jest.runOnlyPendingTimers();
        });

        const titleDiv = await findByTestId('header');
        expect(titleDiv).toHaveTextContent('Select a Tasklist');

        const itemsDiv = await findByTestId('items');
        expect(itemsDiv).toBeInTheDocument();

        for (const num of [0, 1, 2]) {
            const tasklist = await findByText(`tasklist${num}`);
            expect(tasklist).toBeInTheDocument();
        }
    });

    it('loads tasklist, then tasks, then scrolls down, then deletes a task', async () => {

        expect.assertions(7);

        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 76, ctrlKey: true, shiftKey: true }); // l
            jest.runOnlyPendingTimers();
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 13, shiftKey: true }); // enter
            jest.runOnlyPendingTimers();
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 40 }); // down
            jest.runOnlyPendingTimers();
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 46, ctrlKey: true }); // del
            jest.runOnlyPendingTimers();
        });

        const titleDiv = await findByTestId('header');
        expect(titleDiv).toHaveTextContent('tasklist0');

        const itemsDiv = await findByTestId('items');
        expect(itemsDiv).toBeInTheDocument();

        for (const num of [0, 2, 3, 4]) {
            const tasklist = await findByText(`task${num}`);
            expect(tasklist).toBeInTheDocument();
        }

        try {
            await findByText(`task1`); // deleted task
        }
        catch (err) {
            expect(err.message).toContain('Unable to find an element with the text: task1.');
        }
    });

    it('loads tasklist, then tasks, then scrolls down, then completes a task', async () => {

        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 76, ctrlKey: true, shiftKey: true }); // l
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 13, shiftKey: true }); // enter
            jest.runOnlyPendingTimers();
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 40 }); // down
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 32, ctrlKey: true }); // space
        });

        const titleDiv = await findByTestId('header');
        expect(titleDiv).toHaveTextContent('tasklist0');

        const itemsDiv = await findByTestId('items');
        expect(itemsDiv).toBeInTheDocument();

        for (const num of [0, 1, 2, 3, 4]) {
            const tasklist = await findByText(`task${num}`);
            expect(tasklist).toBeInTheDocument();
        }

        // find checked box
        await findByText('\u2611');
    });

    it('loads tasklist, then tasks, then scrolls down, then expands a task, then deletes due input', async () => {

        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 76, ctrlKey: true, shiftKey: true }); // l
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 13, shiftKey: true }); // enter
            jest.runOnlyPendingTimers();
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 40 }); // down
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 13, shiftKey: true }); // enter
            jest.runOnlyPendingTimers();
        });

        const titleDiv = await findByTestId('header');
        expect(titleDiv).toHaveTextContent('Tasklist: tasklist0');

        await findByDisplayValue('title');
        await findByDisplayValue('notes');
        await findByDisplayValue('2011-11-11');

        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 40 }); // down
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 40 }); // down
        });
        await act(async () => {

            fireEvent.keyDown(document, { keyCode: 46, ctrlKey: true }); // del
            jest.runOnlyPendingTimers();
        });

        await findByDisplayValue('title');
        await findByDisplayValue('notes');
        await findByDisplayValue('');
    });
});

import MakeOnBlurCallback from './make-on-blur-callback.js';
import { actionCreators } from './g-tasks-actions.js';
import * as RequestsEnqueuer from '../../util/requests-enqueuer.js';

const nextTickAsync = () => new Promise((resolve) => process.nextTick(resolve));
describe('MakeOnBlurCallback', () => {

    let items;
    let tasklist;
    let cursor;
    let dispatch;
    let GapiTasks;
    let onBlurCallback;
    let onErrorMock;

    beforeAll(async () => {

        jest.useFakeTimers();
        onErrorMock = jest.fn();
        RequestsEnqueuer.init(onErrorMock);
    });

    describe('Testing item creation', () => {

        beforeAll(async () => {

            items = ['placeholder', 'item1', 'item2'];
            tasklist = { id: 'fakeTasklistId' };
            cursor = 1;
            dispatch = jest.fn();
            GapiTasks = {
                createTask: jest.fn(() => Promise.resolve({ result: 'createdItem' }))
            };
            onBlurCallback = MakeOnBlurCallback(
                { items, tasklist, cursor, isNextBlurInsertion: true },
                dispatch,
                GapiTasks
            );
        });

        it('runs callback successfully and creates new item', async () => {

            onBlurCallback('newTitle');
            jest.runOnlyPendingTimers();
            await nextTickAsync();

            expect(dispatch.mock.calls.length).toBe(3);
            expect(dispatch.mock.calls[0][0]).toStrictEqual(actionCreators.toggleIsEditingActive(false));
            expect(dispatch.mock.calls[1][0].type).toBe('RELOAD_TASKS');
            expect(dispatch.mock.calls[1][0].items[0].title).toBe('newTitle');
            expect(dispatch.mock.calls[2][0].type).toBe('REPLACE_TASK');
            expect(dispatch.mock.calls[2][0].newTask).toBe('createdItem');

            expect(GapiTasks.createTask.mock.calls.length).toBe(1);
            expect(GapiTasks.createTask.mock.calls[0][0]).toBe(tasklist.id);
            expect(GapiTasks.createTask.mock.calls[0][1]).toStrictEqual({ title: 'newTitle'});

            expect(onErrorMock.mock.calls.length).toBe(0);
        });
    });

    describe('Testing item update', () => {

        beforeAll(async () => {

            const itemStrings = ['item1', 'item2', 'item3'];
            items = itemStrings.map((itemString, index) => ({ id: index + 1, title: itemString }));
            tasklist = { id: 'fakeTasklistId' };
            cursor = 2;
            dispatch = jest.fn();
            GapiTasks = {
                updateTask: jest.fn(() => Promise.resolve()),
                moveTask: jest.fn(() => Promise.resolve())
            };
            onBlurCallback = MakeOnBlurCallback(
                { items, tasklist, cursor, isNextBlurInsertion: false },
                dispatch,
                GapiTasks
            );
        });
        afterEach(async () => {

            dispatch.mockClear();
        });

        it('runs callback successfully but skips updating because item has not changed', async () => {

            onBlurCallback('item2');
            jest.runOnlyPendingTimers();
            await nextTickAsync();

            expect(dispatch.mock.calls.length).toBe(1);
            expect(dispatch.mock.calls[0][0]).toStrictEqual(actionCreators.toggleIsEditingActive(false));

            expect(GapiTasks.updateTask.mock.calls.length).toBe(0);
            expect(GapiTasks.moveTask.mock.calls.length).toBe(0);
        });

        it('runs callback successfully and updates the active item', async () => {

            const expectedUpdatedItems = items.map((item, index) =>
                index === 1 ? { id: item.id, title: 'newItem2' } : item
            );
            onBlurCallback('newItem2');

            jest.runOnlyPendingTimers();
            await nextTickAsync();

            expect(dispatch.mock.calls.length).toBe(2);
            expect(dispatch.mock.calls[0][0]).toStrictEqual(actionCreators.toggleIsEditingActive(false));
            expect(dispatch.mock.calls[1][0]).toStrictEqual(actionCreators.reloadTasks(expectedUpdatedItems));

            expect(GapiTasks.updateTask.mock.calls.length).toBe(1);
            expect(GapiTasks.moveTask.mock.calls.length).toBe(1);
        });
    })
});

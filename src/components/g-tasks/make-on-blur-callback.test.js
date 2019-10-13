import MakeOnBlurCallback from './make-on-blur-callback.js';
import { actionCreators } from './g-tasks-actions.js';
import * as RequestsEnqueuer from '../../util/requests-enqueuer.js';

const nextTickAsync = () => new Promise((resolve) => process.nextTick(resolve));

describe('MakeOnBlurCallback', () => {

    let items;
    let task;
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

    describe('Tasklists are active', () => {

        describe('Testing item creation', () => {

            beforeAll(async () => {

                items = ['placeholder', 'item1', 'item2'];
                cursor = 0;
                dispatch = jest.fn();
                GapiTasks = {
                    createTasklist: jest.fn(() => Promise.resolve('createdItem'))
                };
                onBlurCallback = MakeOnBlurCallback({
                    items, tasklist, cursor,
                    isNextBlurInsertion: true, isListPickerExpanded: true
                }, dispatch, GapiTasks);
            });

            it('runs callback successfully and creates new item', async () => {

                onBlurCallback('newTitle');
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(4);
                expect(dispatch.mock.calls[0][0]).toStrictEqual(actionCreators.toggleIsEditingActive(false));
                expect(dispatch.mock.calls[1][0]).toStrictEqual(actionCreators.toggleIsLoading());
                expect(dispatch.mock.calls[2][0].type).toBe('RELOAD_ITEMS');
                expect(dispatch.mock.calls[2][0].items[0]).toBe('createdItem');
                expect(dispatch.mock.calls[3][0]).toStrictEqual(actionCreators.toggleIsLoading());

                expect(GapiTasks.createTasklist.mock.calls.length).toBe(1);
                expect(GapiTasks.createTasklist.mock.calls[0][0]).toStrictEqual({ title: 'newTitle'});

                expect(onErrorMock.mock.calls.length).toBe(0);
            });
        });

        describe('Testing item update', () => {

            beforeAll(async () => {

                const itemStrings = ['item1', 'item2', 'item3'];
                items = itemStrings.map((itemString, index) => ({ id: index, title: itemString }));
                cursor = 1;
                dispatch = jest.fn();
                GapiTasks = {
                    updateTasklist: jest.fn(() => Promise.resolve())
                };
                onBlurCallback = MakeOnBlurCallback({
                    items, tasklist, cursor,
                    isNextBlurInsertion: false, isListPickerExpanded: true
                }, dispatch, GapiTasks);
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

                expect(GapiTasks.updateTasklist.mock.calls.length).toBe(0);
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
                expect(dispatch.mock.calls[1][0]).toStrictEqual(actionCreators.reloadItems(expectedUpdatedItems));

                expect(GapiTasks.updateTasklist.mock.calls.length).toBe(1);
            });
        });
    });

    describe('Task is active', () => {

        describe('Testing task update', () => {

            beforeAll(async () => {

                const items = [{ title: 'title' }, { notes: 'notes' }, { due: 'due' }];
                cursor = 1;
                dispatch = jest.fn();
                GapiTasks = {
                    updateTask: jest.fn(() => Promise.resolve({}))
                };
                task = items.reduce((task, item) => ({ ...task, ...item }), {});
                tasklist = { id: 'someId' };
                onBlurCallback = MakeOnBlurCallback({
                    items, task, tasklist, cursor, isTaskExpanded: true,
                    isNextBlurInsertion: false, isListPickerExpanded: false
                }, dispatch, GapiTasks);
            });
            afterEach(async () => {

                dispatch.mockClear();
            });

            it('does not update a task because there were no changes', async () => {

                onBlurCallback({ title: 'title' }); // unchanged name is passed
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(1);
                expect(dispatch.mock.calls[0][0]).toStrictEqual(actionCreators.toggleIsEditingActive(false));

                expect(GapiTasks.updateTask.mock.calls.length).toBe(0);
            });

            it('runs callback successfully but skips updating because item has not changed', async () => {

                onBlurCallback({ title: 'newTitle' });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                const expectedNewTask = { ...task, title: 'newTitle' };

                expect(dispatch.mock.calls.length).toBe(2);
                expect(dispatch.mock.calls[0][0]).toStrictEqual(actionCreators.toggleIsEditingActive(false));
                expect(dispatch.mock.calls[1][0]).toStrictEqual(actionCreators.expandTask(expectedNewTask));

                expect(GapiTasks.updateTask.mock.calls.length).toBe(1);
            });
        });
    });

    describe('Tasks are active', () => {

        describe('Testing item creation', () => {

            beforeAll(async () => {

                items = ['placeholder', 'item1', 'item2'];
                tasklist = { id: 'fakeTasklistId' };
                cursor = 1;
                dispatch = jest.fn();
                GapiTasks = {
                    createTask: jest.fn(() => Promise.resolve('createdItem'))
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
                expect(dispatch.mock.calls[1][0].type).toBe('RELOAD_ITEMS');
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
                expect(dispatch.mock.calls[1][0]).toStrictEqual(actionCreators.reloadItems(expectedUpdatedItems));

                expect(GapiTasks.updateTask.mock.calls.length).toBe(1);
                expect(GapiTasks.moveTask.mock.calls.length).toBe(1);
            });
        });
    });
});

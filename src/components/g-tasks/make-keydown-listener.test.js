import MakeKeyDownListener from './make-keydown-listener.js';
import { gTasksReducer, initialState } from './g-tasks-reducer.js';
import * as RequestsEnqueuer from '../../util/requests-enqueuer.js';

const nextTickAsync = () => new Promise((resolve) => process.nextTick(resolve));
const MakeTestReducer = (initState) => {

    let state = { ...initState };

    return jest.fn((action) => {

        const newState = gTasksReducer(state, action);
        state = { ...newState };
        return state;
    });
};

describe('MakeKeydownListener', () => {

    let keydownListener;
    let keyCode;
    let initState;
    let dispatch;
    let GapiTasks;
    let onErrorMock;

    beforeAll(async () => {

        jest.useFakeTimers();
        onErrorMock = jest.fn();
        RequestsEnqueuer.init(onErrorMock);
    });
    afterEach(async () => {

        dispatch.mockClear();
    });

    describe('Testing keys', () => {

        describe('Key 38 - arrow up', () => {

            beforeEach(async () => {

                keyCode = 38;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 4,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true
                };
                dispatch = MakeTestReducer(initState);
                GapiTasks = {
                    moveTask: jest.fn(() => Promise.resolve({}))
                };
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);
            });

            it('scrolls one row above', async () => {

                keydownListener({ keyCode });

                expect(dispatch.mock.calls.length).toBe(1);
                const newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(3);
                expect(newState.navigationDir).toBe('up');
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item1', 'item2', 'item3', 'item4'
                ]);
            });

            it('moves focused task one row above', async () => {

                keydownListener({ keyCode, shiftKey: true });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(1);
                const newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(3);
                expect(newState.navigationDir).toBe('up');
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item1', 'item3', 'item2', 'item4'
                ]);

                expect(GapiTasks.moveTask.mock.calls.length).toBe(1);
                expect(GapiTasks.moveTask.mock.calls[0][0]).toBe(initState.tasklist.id);
                expect(GapiTasks.moveTask.mock.calls[0][1]).toBe(initState.items[initState.cursor - 1].id);
                expect(GapiTasks.moveTask.mock.calls[0][2]).toBe(initState.items[initState.cursor - 3].id);
            });
        });

        describe('Key 40 - arrow down', () => {

            beforeEach(async () => {

                keyCode = 40;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true
                };
                dispatch = MakeTestReducer(initState);
                GapiTasks = {
                    moveTask: jest.fn(() => Promise.resolve({}))
                };
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);
            });

            it('scrolls one row above', async () => {

                keydownListener({ keyCode });

                expect(dispatch.mock.calls.length).toBe(1);
                const newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(3);
                expect(newState.navigationDir).toBe('down');
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item1', 'item2', 'item3', 'item4'
                ]);
            });

            it('moves focused task one row above', async () => {

                keydownListener({ keyCode, shiftKey: true });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(1);
                const newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(3);
                expect(newState.navigationDir).toBe('down');
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item2', 'item1', 'item3', 'item4'
                ]);

                expect(GapiTasks.moveTask.mock.calls.length).toBe(1);
                expect(GapiTasks.moveTask.mock.calls[0][0]).toBe(initState.tasklist.id);
                expect(GapiTasks.moveTask.mock.calls[0][1]).toBe(initState.items[initState.cursor - 1].id);
                expect(GapiTasks.moveTask.mock.calls[0][2]).toBe(initState.items[initState.cursor].id);
            });
        });

        describe('Key 46 - delete', () => {

            beforeEach(async () => {

                keyCode = 46;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true
                };
                dispatch = MakeTestReducer(initState);
                GapiTasks = {
                    deleteTask: jest.fn(() => Promise.resolve({}))
                };
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);
            });

            it('removed task both locally and via api', async () => {

                keydownListener({ keyCode, ctrlKey: true });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(1);
                const newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(0);
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item2', 'item3', 'item4'
                ]);

                expect(GapiTasks.deleteTask.mock.calls.length).toBe(1);
                expect(GapiTasks.deleteTask.mock.calls[0][0]).toBe(initState.tasklist.id);
                expect(GapiTasks.deleteTask.mock.calls[0][1]).toBe(initState.items[initState.cursor - 1].id);
            });
        });

        describe('Key 32 - space', () => {

            beforeEach(async () => {

                keyCode = 32;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item, status: 'needsAction'
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true
                };
                dispatch = MakeTestReducer(initState);
                GapiTasks = {
                    updateTask: jest.fn(() => Promise.resolve({})),
                    moveTask: jest.fn(() => Promise.resolve({}))
                };
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);
            });

            it('toggles active item as completed/needsAction', async () => {

                let newState;

                // toggle item as 'completed'
                keydownListener({ keyCode, ctrlKey: true });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(1);
                newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(2);
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item1', 'item2', 'item3', 'item4'
                ]);
                expect(newState.items.map((item) => item.status)).toStrictEqual([
                    'needsAction', 'completed', 'needsAction', 'needsAction', 'needsAction'
                ]);

                expect(GapiTasks.updateTask.mock.calls.length).toBe(1);
                expect(GapiTasks.updateTask.mock.calls[0][0]).toBe(initState.tasklist.id);
                expect(GapiTasks.updateTask.mock.calls[0][1]).toBe(initState.items[initState.cursor - 1].id);
                expect(GapiTasks.updateTask.mock.calls[0][2]).toStrictEqual(initState.items[initState.cursor - 1]);

                expect(GapiTasks.moveTask.mock.calls.length).toBe(1);
                expect(GapiTasks.moveTask.mock.calls[0][0]).toBe(initState.tasklist.id);
                expect(GapiTasks.moveTask.mock.calls[0][1]).toBe(initState.items[initState.cursor - 1].id);
                expect(GapiTasks.moveTask.mock.calls[0][2]).toStrictEqual(initState.items[initState.cursor - 2].id);

                // toggle item as 'needsAction'
                keydownListener({ keyCode, ctrlKey: true });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(2);
                newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(2);
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item1', 'item2', 'item3', 'item4'
                ]);
                expect(newState.items.map((item) => item.status)).toStrictEqual([
                    'needsAction', 'needsAction', 'needsAction', 'needsAction', 'needsAction'
                ]);
            });
        });

        describe('Key 72 - h', () => {

            it('toggles listing of item from all to only incomplete ones', async () => {

                keyCode = 72;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item, status: index === 1 ? 'completed' : 'needsAction'
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true
                };
                dispatch = MakeTestReducer(initState);
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);

                keydownListener({ keyCode, ctrlKey: true, shiftKey: true });

                expect(dispatch.mock.calls.length).toBe(1);
                const newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(0);
                expect(newState.showCompleted).toBe(false);
                expect(newState.items.map((item) => item.title)).toStrictEqual([
                    'item0', 'item2', 'item3', 'item4'
                ]);
            });

            it('toggles listing of item from only incomplete ones to all', async () => {

                keyCode = 72;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item, status: 'needsAction'
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true,
                    showCompleted: false
                };
                dispatch = MakeTestReducer(initState);
                GapiTasks = {
                    loadTasks: jest.fn(() => Promise.resolve(['itemX', 'itemY']))
                };
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);

                keydownListener({ keyCode, ctrlKey: true, shiftKey: true });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(2);

                const middleState = dispatch.mock.results[0].value;
                expect(middleState.cursor).toBe(2);
                expect(middleState.showCompleted).toBe(false);
                expect(middleState.isLoading).toBe(true);

                const newState = dispatch.mock.results[1].value;
                expect(newState.cursor).toBe(0);
                expect(newState.showCompleted).toBe(true);
                expect(newState.items).toStrictEqual(['itemX', 'itemY']);

                const showCompleted = true
                expect(GapiTasks.loadTasks.mock.calls.length).toBe(1);
                expect(GapiTasks.loadTasks.mock.calls[0][0]).toBe(initState.tasklist.id);
                expect(GapiTasks.loadTasks.mock.calls[0][1]).toBe(showCompleted);
            });
        });

        describe('Key 13 - enter', () => {

            it('edits a task', async () => {

                keyCode = 13;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item, status: index === 1 ? 'completed' : 'needsAction'
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true,
                    isEditingActive: false
                };
                dispatch = MakeTestReducer(initState);
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);

                keydownListener({ keyCode });

                expect(dispatch.mock.calls.length).toBe(1);
                const newState = dispatch.mock.results[0].value;
                expect(newState.cursor).toBe(2);
                expect(newState.isEditingActive).toBe(true);
            });

            it('expands a task', async () => {

                keyCode = 13;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item, status: index === 1 ? 'completed' : 'needsAction'
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true,
                    isEditingActive: false
                };
                GapiTasks = {
                    loadTask: jest.fn(() => Promise.resolve({ title: 'x' }))
                };
                dispatch = MakeTestReducer(initState);
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);

                keydownListener({ keyCode, shiftKey: true });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(2);

                const middleState = dispatch.mock.results[0].value;
                expect(middleState.cursor).toBe(2);
                expect(middleState.isLoading).toBe(true);

                const newState = dispatch.mock.results[1].value;
                expect(newState.cursor).toBe(2);
                expect(newState.items).toStrictEqual([{ title: 'x' }]);

                expect(GapiTasks.loadTask.mock.calls.length).toBe(1);
            });

            it('loads all task', async () => {

                keyCode = 13;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    items: ['tasklist0', 'tasklist1', 'tasklist2', 'tasklist3'].map((item, index) => ({
                        id: index + 1, title: item
                    })),
                    isListPickerExpanded: true,
                    isAppFocused: true,
                    isEditingActive: false
                };
                GapiTasks = {
                    loadTasks: jest.fn(() => Promise.resolve(['itemX', 'itemY']))
                };
                dispatch = MakeTestReducer(initState);
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);

                keydownListener({ keyCode });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(2);

                const middleState = dispatch.mock.results[0].value;
                expect(middleState.cursor).toBe(2);
                expect(middleState.isLoading).toBe(true);

                const newState = dispatch.mock.results[1].value;
                expect(newState.cursor).toBe(1);
                expect(newState.items).toStrictEqual(['itemX', 'itemY']);

                const showCompleted = true;
                expect(GapiTasks.loadTasks.mock.calls.length).toBe(1);
                expect(GapiTasks.loadTasks.mock.calls[0][0]).toBe(initState.items[initState.cursor].id);
                expect(GapiTasks.loadTasks.mock.calls[0][1]).toBe(showCompleted);
            });

            it('loads all tasklists', async () => {

                keyCode = 13;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 0,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: true,
                    isEditingActive: false
                };
                GapiTasks = {
                    loadTasklists: jest.fn(() => Promise.resolve(['itemX', 'itemY']))
                };
                dispatch = MakeTestReducer(initState);
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);

                keydownListener({ keyCode });
                jest.runOnlyPendingTimers();
                await nextTickAsync();

                expect(dispatch.mock.calls.length).toBe(2);

                const middleState = dispatch.mock.results[0].value;
                expect(middleState.cursor).toBe(0);
                expect(middleState.isLoading).toBe(true);

                const newState = dispatch.mock.results[1].value;
                expect(newState.cursor).toBe(0);
                expect(newState.items).toStrictEqual(['itemX', 'itemY']);

                expect(GapiTasks.loadTasklists.mock.calls.length).toBe(1);
            });
        });

        describe('Key 76 - l', () => {

            beforeEach(async () => {

                keyCode = 76;
                initState = {
                    ...initialState,
                    isLoading: false,
                    itemMaxLimit: 8,
                    cursor: 2,
                    tasklist: { id: 'fakeTasklistId'},
                    items: ['item0', 'item1', 'item2', 'item3', 'item4'].map((item, index) => ({
                        id: index + 1, title: item, status: 'needsAction'
                    })),
                    isListPickerExpanded: false,
                    isAppFocused: false
                };
                dispatch = MakeTestReducer(initState);
                keydownListener = MakeKeyDownListener(initState, dispatch, GapiTasks);
            });

            it('toggles app focus', async () => {

                keydownListener({ keyCode, ctrlKey: true, shiftKey: true }); // focus
                keydownListener({ keyCode, ctrlKey: true, shiftKey: true }); // blur

                expect(dispatch.mock.calls.length).toBe(2);

                const middleState = dispatch.mock.results[0].value;
                expect(middleState.isAppFocused).toBe(true);

                const newState = dispatch.mock.results[1].value;
                expect(newState.isAppFocused).toBe(false);
            });
        });
    });
});

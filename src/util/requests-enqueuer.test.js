import * as RequestsEnqueuer from './requests-enqueuer.js';

const nextTickAsync = () => new Promise((resolve) => process.nextTick(resolve));

describe('RequestsEnqueuer', () => {

    let onErrorMock;

    beforeAll(async () => {

        jest.useFakeTimers();
        onErrorMock = jest.fn(() => 'Error');
        RequestsEnqueuer.init(onErrorMock);
    });

    it('does nothing if initiated twice', async () => {

        RequestsEnqueuer.init();
    });

    it('properly enqueues async functions (requests)', async () => {

        const request1 = jest.fn(() => Promise.resolve(1));
        const request2 = jest.fn(() => Promise.resolve(2));
        const request3 = jest.fn(() => Promise.reject(3));
        const request4 = jest.fn(() => Promise.resolve(4));

        expect(setTimeout).toHaveBeenCalledTimes(1);
        for (const req of [request1, request2, request3, request4]) {

            RequestsEnqueuer.enqueue(req);
            await nextTickAsync();
            jest.runOnlyPendingTimers();
        }
        expect(setTimeout).toHaveBeenCalledTimes(5);

        expect(request1.mock.calls.length).toBe(1);
        expect(request2.mock.calls.length).toBe(1);
        expect(request3.mock.calls.length).toBe(1);
        expect(onErrorMock.mock.calls.length).toBe(1);
        expect(request4.mock.calls.length).toBe(0);
    });
});


const requestObjects = [];

let wasInitiated = false;
let onError;

const _generateRandomId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
async function _makeRequest() {

    while (requestObjects.length) {
        const { request: nextRequest, id } = requestObjects.shift();
        try {
            await nextRequest(id);
        }
        catch (err) {
            requestObjects.length = 0;
            onError();
        }
    }
    setTimeout(_makeRequest, 100);
};

export const init = (onErrorCb) => {

    if (wasInitiated) {
        return;
    }
    onError = onErrorCb;
    wasInitiated = true;
    _makeRequest();
};

export const enqueue = (request) => {

    const id = _generateRandomId();
    requestObjects.push({ request, id });
    return id;
};


const requestObjects = [];

let wasInitiated = false;
let onError;

const generateRandomId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
async function makeRequest() {

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
    setTimeout(makeRequest, 100);
};

export const init = (onErrorCb) => {

    if (wasInitiated) {
        return;
    }
    onError = onErrorCb;
    wasInitiated = true;
    makeRequest();
};

export const enqueue = (request) => {

    const id = generateRandomId();
    requestObjects.push({ request, id });
    return id;
};

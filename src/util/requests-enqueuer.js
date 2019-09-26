
const requests = [];

let wasInitiated = false;
let onError;

async function makeRequest() {

    while (requests.length) {

        const nextRequest = requests.shift();
        try {
            await nextRequest();
        }
        catch (err) {
            requests.length = 0;
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
    makeRequest();
    wasInitiated = true;
};

export const enqueue = (request) => {

    requests.push(request);
};

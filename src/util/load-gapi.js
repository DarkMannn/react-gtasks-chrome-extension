const GAPI_URL = 'https://apis.google.com/js/api.js';
const API_KEY = 'AIzaSyBUMaTxGVn51tl7MFmY5j10RvhxlU_BnKc';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'];

const _loadGapiScript = () => new Promise((resolve, reject) => {

    const script = document.createElement('script');
    script.src = GAPI_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {

        const callback = () => {

            resolve(window.gapi);
        };
        window.gapi.load('client', { callback, onerror: reject });
    };
    document.head.appendChild(script);
});
const _getAuthToken = () => new Promise((resolve) => {
    /* global chrome */
    chrome.identity.getAuthToken({interactive: true}, (token) => {

        resolve(token);
    });
});
const _initGapiClient = async (gapi, token) => {

    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
    });
    gapi.client.setToken({ 'access_token': token });
};

const loadGapi = async () => {

    const gapi = await _loadGapiScript();
    const token = await _getAuthToken();
    await _initGapiClient(gapi, token);

    return gapi;
};

export default loadGapi;

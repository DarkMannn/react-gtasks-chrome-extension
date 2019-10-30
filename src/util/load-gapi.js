/* global chrome */
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
const _initGapiClient = async (gapi, token) => {

    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
    });
    gapi.client.setToken({ 'access_token': token });
};
const _getAuthToken = (isInteractive) => new Promise((resolve) => {

    chrome.identity.getAuthToken({ interactive: isInteractive }, resolve);
});
const _getAuthTokenAndClearStorageIfNeeded = async () => {

    const cachedToken = await _getAuthToken(false);
    if (cachedToken) {
        return cachedToken;
    }
    chrome.storage.clear();
    const token = await _getAuthToken(true);
    return token;
};

const loadGapi = async () => {

    const token = await _getAuthTokenAndClearStorageIfNeeded();
    const gapi = await _loadGapiScript();
    await _initGapiClient(gapi, token);
    return gapi;
};

export default loadGapi;

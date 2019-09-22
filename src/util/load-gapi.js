const GAPI_URL = 'https://apis.google.com/js/api.js';
const CLIENT_ID = '748268010155-9vu3642be1b9ktf230uedab0m63i60ob.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGm2a7dU4Ae_g5kCuYkCJyL8xiIJA6jMM';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'];
const SCOPES = 'https://www.googleapis.com/auth/tasks';

let gapi;

const loadGapiScript = () => new Promise((resolve, reject) => {

    const script = document.createElement('script');
    script.src = GAPI_URL;
    script.onload = () => {

        gapi = window.gapi;
        gapi.load('client:auth2', { callback: resolve, onerror: reject });
    };
    document.body.appendChild(script);
});

const initGapiClient = () => gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
});

const loadGapi = async () => {

    await loadGapiScript();
    await initGapiClient();
    return gapi;
};

export default loadGapi;

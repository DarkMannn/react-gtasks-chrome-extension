const GAPI_URL = 'https://apis.google.com/js/api.js?onload=onGapiLoad';
const CLIENT_ID = '748268010155-9vu3642be1b9ktf230uedab0m63i60ob.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGm2a7dU4Ae_g5kCuYkCJyL8xiIJA6jMM';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'];
const SCOPES = 'https://www.googleapis.com/auth/tasks';

let gapi;

const _loadGapiScript = () => new Promise((resolve, reject) => {

    const script = document.createElement('script');
    script.src = GAPI_URL;
    script.async = true;
    script.defer = true;
    // const waitForGapi = () => {

    //     // console.log('going!!!!');
    //     // console.log(window.gapi);
    //     if (!window.gapi) {
    //         return setTimeout(waitForGapi, 1000)
    //     }
    //     gapi = window.gapi;
    //     gapi.load('client:auth2', { callback: resolve, onerror: reject });
    // };
    // setTimeout(waitForGapi, 1000);

    // script.onload = () => {

    //     // gapi = window.gapi;
    //     // gapi.load('client:auth2', { callback: resolve, onerror: reject });
    //     // console.log(window.gapi);
    //     setTimeout(waitForGapi, 1000);
    // };
    document.body.appendChild(script);
});

const _initGapiClient = () => gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
});

const loadGapi = async () => {

    await _loadGapiScript();
    await _initGapiClient();
    return gapi;
};

// loadGapi();

// const script = document.createElement('script');
// script.src = GAPI_URL;
// script.async = true;
// script.defer = true;
// document.body.appendChild(script);

// function onGapiLoad() {

//     console.log('IDE');
//     console.log(window.gapi);
// };

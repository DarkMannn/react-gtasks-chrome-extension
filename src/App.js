import React, {
    useState,
    useEffect
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import GTasks from './components/g-tasks/g-tasks.js';

let gapi;

const GAPI_URL = 'https://apis.google.com/js/api.js';
const CLIENT_ID = '748268010155-9vu3642be1b9ktf230uedab0m63i60ob.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBGm2a7dU4Ae_g5kCuYkCJyL8xiIJA6jMM';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'];
const SCOPES = 'https://www.googleapis.com/auth/tasks';

const loadGapi = () => new Promise((resolve, reject) => {

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

const mainCss = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    border: 2px solid black;
    text-align: center;
`;
const headerCss = css`
    background-color: #282c34;
    width: 100%;
    height: 10vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5vh;
`;
const bodyCss = css`
    width: 100%;
    height: 100%;
    color: #282c34;
    font-size: 2vh;
`;

function App() {

    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [hasErrored, setHasErrored] = useState(false);

    const signIn = () => gapi.auth2.getAuthInstance().signIn()
        .then(() => {

            setIsSignedIn(true);
        })
        .catch(() => {

            setHasErrored(true);
        });

    useEffect(function loadGapiAndSetState() {

        loadGapi()
            .then(initGapiClient)
            .then(() => {

                setIsLoading(false);
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    setIsSignedIn(true);
                }
            })
            .catch(() => {

                setHasErrored(true);
            });
    }, []);

    let body;
    if (isLoading) {
        body = <div>Loading...</div>;
    }
    else if (hasErrored) {
        body = <div>Something happened. Please reload page. :/</div>;
    }
    else if (!isSignedIn) {
        body = <button onClick={signIn}>Authorize</button>
    }
    else {
        body = <GTasks gapiTasks={gapi.client.tasks}></GTasks>;
    }

    return <div css={mainCss}>
        <header css={headerCss}>Google Tasks Power Mode</header>
        <div css={bodyCss}>{body}</div>
    </div>;
}

export default App;

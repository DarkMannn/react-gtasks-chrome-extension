import React, {
    useState,
    useEffect
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import GTasks from './components/g-tasks/g-tasks.js';
import loadGapi from './util/load-gapi.js';

let gapi;

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
            .then((initializedGapi) => {

                setIsLoading(false);
                gapi = initializedGapi;
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

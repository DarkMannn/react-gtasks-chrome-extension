import React, {
    useEffect, useLayoutEffect, useReducer, useMemo, useCallback
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';

import * as RequestsEnqueuer from '../../util/requests-enqueuer.js';
import MakeCustomGapiTasks from '../../util/make-custom-gapi-tasks.js';
import MakeKeydownListener from './make-keydown-listener.js';
import MakeOnBlurCallback from './make-on-blur-callback.js';
import { gTasksReducer, initialState } from './g-tasks-reducer.js';
import { actionCreators } from './g-tasks-actions.js';

import TasklistItem from './tasklist-item/tasklist-item.js';
import TaskItem from './task-item/task-item.js';
import TaskItemZoomed from './task-item-zoomed/task-item-zoomed.js';
import Instructions from './instructions/instructions.js';

const mainCss = css`
    outline: none;
    opacity: ${({ isLoading }) => isLoading ? 0.6 : 1};
    background-color: ${({ hasErrored }) => hasErrored ? 'salmon' : 'white'};
    transition: background-color, opacity 0.15s linear 0s;
`;
const headingCss = css`
    height: 30px;
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
    background-color: ${({ isHovered }) => isHovered ? 'cadetblue' : 'white'};
    transition: background-color 0.15s linear 0s;
`;
const headingHelperCss = css`
    height: 5px;
    padding: 0;
    margin-top: 0;
    font-size: 10px;
`;
const arrowDivCss = css`
    border-bottom: 1px solid black;
    height: 25px;
    width: 100%;
    background-color: white;
`;
const upArrowDivCss = css`
    ${arrowDivCss}
`;
const downArrowDivCss = css`
    ${arrowDivCss}
    border-top: 1px solid black;
    position: absolute;
    bottom: ${({ showFor }) =>
        showFor === 'tasklist' ? '100px'
        : showFor === 'tasks' ? '136px'
        : '64px'
    };
    left: 0;
`;
const arrowSignCss = css`
    border: ${({ canScroll }) => canScroll ? 'solid black' : 'solid lightgray'};
    transition: border 0.15s linear 0s;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
`;
const upArrowSignCss = css`
    ${arrowSignCss}
    transform: rotate(-135deg);
`;
const downArrowSignCss = css`
    ${arrowSignCss}
    transform: rotate(45deg) translateY(-5px);
`;

function GTasks({ gapiTasks }) {

    const [state, dispatch] = useReducer(gTasksReducer, initialState);

    const {
        isLoading, hasErrored, cursor, items, tasklist, task,
        itemMaxLimit, itemOffset, isListPickerExpanded,
        isTaskExpanded, isEditingActive, isNextBlurInsertion
    } = state;
    const showFor =
        isListPickerExpanded ? 'tasklist'
        : isTaskExpanded ? 'task'
        : 'tasks';

    const GapiTasks = useMemo(() => MakeCustomGapiTasks(gapiTasks), [gapiTasks]);
    const onBlurCallback = useCallback(
        MakeOnBlurCallback({
            items, cursor, tasklist, task,
            isNextBlurInsertion, isListPickerExpanded, isTaskExpanded
        }, dispatch, GapiTasks),
        [
            GapiTasks, items, cursor, tasklist, task,
            isNextBlurInsertion, isListPickerExpanded, isTaskExpanded
        ]
    );
    const keydownListener = MakeKeydownListener(state, dispatch, GapiTasks);
    const resizeListener = (keepCursor) => {

        dispatch(actionCreators.resizeContent(window.innerHeight, keepCursor));
    };


    useEffect(function initRequestsEnqueuer() {

        const onError = () => {

            dispatch(actionCreators.toggleHasErrored());
        };
        RequestsEnqueuer.init(onError);
    }, []);

    useEffect(function initData() {

        (async function() {

            if (hasErrored) {
                return;
            }
            const items = await GapiTasks.loadTasklists();
            dispatch(actionCreators.loadTasklists(items));
        })();
    }, [GapiTasks, hasErrored]);

    useEffect(function attachKeydownListener() {

        window.addEventListener('keydown', keydownListener);
        return () => {

            window.removeEventListener('keydown', keydownListener);
        };
    }, [keydownListener]);

    useEffect(function attachResizeListener() {

        window.addEventListener('resize', resizeListener);
    }, []);

    useEffect(function invokeResizeListener() {

        const keepCursor = true;
        resizeListener(keepCursor);
    }, [showFor]);

    useLayoutEffect(function calculateItemOffset() {

        dispatch(actionCreators.calculateItemOffset());
    }, [cursor]);

    const shouldRender = (index) => index > itemOffset - 1
        && index <= itemMaxLimit + itemOffset - (isListPickerExpanded ? 0 : 1);
    let headerHtml;
    let itemsHtml;
    if (hasErrored) {
        headerHtml = 'An Error Occurred';
        itemsHtml = 'Press <Shift + R> to restart app'
    }
    else if (isTaskExpanded) {
        headerHtml = <>
            Tasklist: {tasklist.title}
            {cursor === 0 && <p css={headingHelperCss}>* press &lt;enter&gt; to return to tasks *</p>}
        </>;
        itemsHtml = <TaskItemZoomed
            title={task.title}
            notes={task.notes}
            due={task.due}
            cursor={cursor}
            isEditingActive={isEditingActive}
            onBlurCallback={onBlurCallback}>
        </TaskItemZoomed>;
    }
    else if (isListPickerExpanded) {
        headerHtml = 'Select a Tasklist';
        itemsHtml = items.map((item, index) => shouldRender(index)
            && <TasklistItem
                key={index}
                title={item.title}
                isHovered={index === cursor}
                isEditingActive={isEditingActive && index === cursor}
                onBlurCallback={onBlurCallback}>
            </TasklistItem>
        );
    }
    else {
        headerHtml = <>
            Tasklist: {tasklist.title}
            {cursor === 0 && <p css={headingHelperCss}>* press &lt;enter&gt; to change tasklist *</p>}
        </>;
        itemsHtml = items.map((item, index) => shouldRender(index)
            && <TaskItem
                key={index}
                title={item.title}
                due={item.due && new Date(item.due).toISOString().split('T')[0]}
                notes={item.notes}
                status={item.status}
                isHovered={index === cursor - 1}
                isOnTopFaded={index === 0 && cursor === 0}
                isEditingActive={isEditingActive && index === cursor - 1}
                onBlurCallback={onBlurCallback}>
            </TaskItem>
        );
    }

    return <div isLoading={isLoading} hasErrored={hasErrored} css={mainCss}>
        <div data-testid="header" css={headingCss} isHovered={!isListPickerExpanded && cursor === 0}>
            {headerHtml}
        </div>
        {!isTaskExpanded &&
        <div css={upArrowDivCss}>
            <span canScroll={itemOffset} css={upArrowSignCss}></span>
        </div>
        }
        <div data-testid="items">
            {itemsHtml}
        </div>
        {!isTaskExpanded &&
        <div showFor={showFor} css={downArrowDivCss}>
            <span
                canScroll={!(itemOffset + itemMaxLimit === items.length || items.length < itemMaxLimit)}
                css={downArrowSignCss}>
            </span>
        </div>
        }
        <Instructions showFor={showFor}></Instructions>
    </div>;
}

export default GTasks;

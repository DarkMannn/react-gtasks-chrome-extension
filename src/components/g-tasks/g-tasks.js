import React, { useEffect, useLayoutEffect, useReducer, useMemo, useCallback } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import MakeCustomGapiTasks from '../../util/make-custom-gapi-tasks.js';
import MakeKeydownListener from './make-keydown-listener.js';
import MakeOnBlurCallback from './make-on-blur-callback.js';
import { gTasksReducer, initialState } from './g-tasks-reducer.js';
import { actionCreators } from './g-tasks-actions.js';
import TasklistItem from './tasklist-item/tasklist-item.js';
import TaskItem from './task-item/task-item.js';
import TaskItemZoomed from './task-item-zoomed/task-item-zoomed.js';

const mainCss = css`
    outline: none;
    border-right: ${({ isAppFocused }) => isAppFocused ? '3px solid gray' : 'none'};
    border-left: ${({ isAppFocused }) => isAppFocused ? '3px solid gray' : 'none'};
`;
const headingCss = css`
    height: 30px;
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
    outline: ${({ isHovered }) => isHovered ? '3px solid khaki' : 'none'};
    outline-offset: -3px;
`;
const headingHelperCss = css`
    height: 5px;
    padding: 0;
    margin-top: 0;
    font-size: 10px;
`;

function GTasks({ gapiTasks }) {

    const [{
        cursor, items, itemMaxLimit, itemOffset, tasklist,
        isListPickerExpanded, isItemExpanded, isAppFocused,
        isEditingActive, isNextBlurInsertion, showCompleted
    }, dispatch] = useReducer(gTasksReducer, initialState);
    const GapiTasks = useMemo(() => MakeCustomGapiTasks(gapiTasks), [gapiTasks]);
    const keydownListener = useMemo(
        () => MakeKeydownListener(
            {
                items, cursor, tasklist, showCompleted, isEditingActive,
                isListPickerExpanded, isAppFocused
            },
            dispatch,
            GapiTasks
        ),
        [
            GapiTasks, cursor, isAppFocused, isEditingActive,
            isListPickerExpanded, items, showCompleted, tasklist
        ]
    );
    const onBlurCallback = useCallback(
        MakeOnBlurCallback(
            { items, cursor, tasklist, showCompleted, isNextBlurInsertion },
            dispatch,
            GapiTasks
        ),
        [GapiTasks, items, cursor, tasklist, showCompleted, isNextBlurInsertion]
    );

    useEffect(function initData() {

        (async function() {

            const { items } = await GapiTasks.loadTasklists();
            dispatch(actionCreators.loadTasklists(items));
        })();
    }, [GapiTasks]);

    useEffect(function attachKeydownListener() {

        window.addEventListener('keydown', keydownListener);
        return () => {

            window.removeEventListener('keydown', keydownListener);
        };
    }, [keydownListener]);

    useEffect(function attachResizeListener() {

        const resizeListener = () => {

            dispatch(actionCreators.resizeContent(window.innerHeight));
        };
        resizeListener();
        window.addEventListener('resize', resizeListener);
    }, []);

    useLayoutEffect(function calculateItemOffset() {

        dispatch(actionCreators.calculateItemOffset());
    }, [cursor]);

    const shouldRender = (index) => index > itemOffset - 1
        && index <= itemMaxLimit + itemOffset - (isListPickerExpanded ? 0 : 1);
    let headerHtml;
    let itemsHtml;
    if (isItemExpanded) {
        const zoomedItem = items[0];
        headerHtml = 'Return to tasks';
        itemsHtml = <TaskItemZoomed
            title={zoomedItem.title}
            notes={zoomedItem.notes}
            due={zoomedItem.due}>
        </TaskItemZoomed>;
    }
    else if (isListPickerExpanded) {
        headerHtml = 'Select a Task List';
        itemsHtml = items.map((item, index) => shouldRender(index)
            && <TasklistItem
                    key={item.id}
                    title={item.title}
                    isHovered={index === cursor}>
            </TasklistItem>
        );
    }
    else {
        headerHtml = <>
            {tasklist.title}
            {cursor === 0 && <p css={headingHelperCss}>* press enter to change tasklist*</p>}
        </>;
        itemsHtml = items.map((item, index) => shouldRender(index)
            && <TaskItem
                key={item.id || index}
                title={item.title}
                due={item.due && new Date(item.due).toISOString().split('T')[0]}
                notes={item.notes}
                status={item.status}
                isHovered={index === cursor - 1}
                isEditingActive={isEditingActive && index === cursor - 1}
                onBlurCallback={onBlurCallback}>
            </TaskItem>
        );
    }

    return <div isAppFocused={isAppFocused} css={mainCss}>
        <div css={headingCss} isHovered={!isListPickerExpanded && cursor === 0}>{headerHtml}</div>
        {itemsHtml}
    </div>;
}

export default GTasks;

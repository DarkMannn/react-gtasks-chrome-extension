import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import TaskListPicker from './task-list-picker/task-list-picker.js';
import TaskItem from './task-item/task-item.js';

const mainCss = css`
    outline: none;
`;

let cachedItemOffset = 0;

function TaskList() {

    const divRef = useRef();
    const listPickerRef = useRef();
    const [cursor, setCursor] = useState(0);
    const [itemMaxLimit, setItemMaxLimit] = useState(0);
    const [navigationDir, setNavigationDir] = useState('down');
    const [items, setItems] = useState([...Array(5)]);
    const [isPickerActive, setIsPickerActive] = useState(false);
    const navigationHandler = (e) => {
        if (e.keyCode === 38 && cursor > 0) {
            setCursor(prevCursor => prevCursor - 1);
            setNavigationDir('up');
        }
        else if (e.keyCode === 40 && cursor < items.length - (isPickerActive ? 1 : 0)) {
            setCursor(prevCursor => prevCursor + 1);
            setNavigationDir('down');
        }
        else if (e.keyCode === 13) {
            if (!isPickerActive && cursor === 0) {
                setItems(dummyTaskListItems);
                setIsPickerActive(true);
                setCursor(0);
            }
            if (isPickerActive) {
                listPickerRef.current.setTaskList();
                setItems([...Array(80)]);
                setIsPickerActive(false);
                setCursor(0);
            }
        }
    };

    useEffect(function calculateItemMaxLimit() {

        const upperHeaderHeight = 95;
        const taskListNameHeight = 63;
        const taskItemHeight = 36;
        const calculateItemMaxLimit = () => Math.floor(
            ((window.innerHeight - upperHeaderHeight - taskListNameHeight) / taskItemHeight) - 1
        );

        window.addEventListener('resize', () => {
            setItemMaxLimit(calculateItemMaxLimit());
        });
        setItemMaxLimit(calculateItemMaxLimit());
    }, []);

    return <div css={mainCss} onKeyDown={navigationHandler} tabIndex="0">
        <TaskListPicker
            ref={listPickerRef}
            isActive={isPickerActive}
            isHovered={cursor === 0}
            cursor={cursor}
            taskLists={items}></TaskListPicker>
        {!isPickerActive &&
            <div ref={divRef}>{
                items.map((item, index) => {

                    const calculateItemOffset = () => cachedItemOffset !== 0
                        ? cachedItemOffset + 1
                        : (cursor > itemMaxLimit)
                            ? (cursor - itemMaxLimit)
                            : 0;
                    const itemOffset = (navigationDir === 'down')
                        ? calculateItemOffset()
                        : (navigationDir === 'up' && cachedItemOffset === cursor)
                            ? cachedItemOffset === 0
                                ? cachedItemOffset
                                : cachedItemOffset - 1
                            : cachedItemOffset;

                    if (index === items.length - 1) {
                        cachedItemOffset = itemOffset;
                    }
                    const shouldRender = itemOffset < (index + 1) && (index + 1) <= (itemMaxLimit + itemOffset);

                    return shouldRender && <TaskItem
                        key={index}
                        title={`item-${index + 1}`}
                        due={'12/12/2010'}
                        notes={notes}
                        isHovered={cursor === index + 1}></TaskItem>;
                })
            }</div>
        }
    </div>;
}

export default TaskList;

let notes = `
    ovo je notes jedan ali vredan
    i da vidimo kako ce ici sada, mozda da mozda ne
    ali definitivno da nije da i ne
`;
let dummyTaskListItems = [...Array(20)].map((_, ind) => `List${ind}`);

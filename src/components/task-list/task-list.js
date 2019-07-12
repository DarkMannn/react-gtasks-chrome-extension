import React, {
    useState,
    useRef
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import TaskListPicker from './task-list-picker/task-list-picker.js';
import TaskItem from './task-item/task-item.js';

const mainCss = css`
    outline: none;
`;

function TaskList() {

    const listPickerRef = useRef();
    const [cursor, setCursor] = useState(0);
    const [items, setItems] = useState([...Array(5)]);
    const [isPickerActive, setIsPickerActive] = useState(false);
    const navigationHandler = (e) => {
        if (e.keyCode === 38 && cursor > 0) {
            setCursor(prevCursor => prevCursor - 1);
        }
        else if (e.keyCode === 40 && cursor < items.length - (isPickerActive ? 1 : 0)) {
            setCursor(prevCursor => prevCursor + 1);
        }
        else if (e.keyCode === 13) {
            if (!isPickerActive && cursor === 0) {
                setItems(dummyTaskListItems);
                setIsPickerActive(true);
                setCursor(0);
            }
            if (isPickerActive) {
                listPickerRef.current.setTaskList();
                setItems([...Array(8)]);
                setIsPickerActive(false);
                setCursor(0);
            }
        }
    };

    return <div css={mainCss} onKeyDown={navigationHandler} tabIndex="0">
        <TaskListPicker
            ref={listPickerRef}
            isActive={isPickerActive}
            isHovered={cursor === 0}
            cursor={cursor}
            taskLists={items}></TaskListPicker>
        {!isPickerActive &&
            <div>{
                items.map((item, index) =>
                    <TaskItem
                        key={index}
                        title={`item-${index + 1}`}
                        due={'12/12/2010'}
                        notes={notes}
                        isHovered={cursor === index + 1}></TaskItem>
                )
            }</div>
        }
    </div>;
}

export default TaskList;

let notes = `asdfsfasdfasdfasdfasdfasdfasdfasdfasdfasdfas`;
let dummyTaskListItems = [...Array(8)].map((_, ind) => `List${ind}`);

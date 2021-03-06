import { useEffect } from 'react';

const setCursorAtTheEnd = (node) => {

    if (node.setSelectionRange && node.type !== 'date') {
        var len = node.value.length * 2;
        node.setSelectionRange(len, len);
        node.scrollTop = 999999;
        return;
    }

    const range = document.createRange();
    const sel = window.getSelection();
    const childNodesLength = node.childNodes.length;
    const lastChildNode = node.childNodes[childNodesLength - 1];

    if (!lastChildNode) {
        return;
    }

    range.setStart(lastChildNode, lastChildNode.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
};

const useFocusAndSetCursor = (elRef, condition) => {

    useEffect(function focusAndSetCursor() {

        if (condition) {
            elRef.current.focus();
            setCursorAtTheEnd(elRef.current);
        }
    }, [elRef, condition]);
};

export default useFocusAndSetCursor;

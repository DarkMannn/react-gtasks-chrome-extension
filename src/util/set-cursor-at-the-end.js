
const setCursorAtTheEnd = (node) => {

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

export default setCursorAtTheEnd;

import isNumber from 'lodash/lang/isNumber';
import React, { PropTypes } from 'react';
export const draggableClassNames = ['selectionStart', 'selectionEnd', 'caretSvg'].reduce(function (obj, key) {
    obj[key] = key
    return obj
}, {});

export default function Caret ({caretPosition, sequenceLength, className}) {
    return (
        <line
            className={className}
            strokeWidth='1px'
            style={ { opacity: 9, zIndex: 100,  cursor: "ew-resize",} }//tnr: the classname needs to be cursor here!
            x1={caretPosition}
            y1={0}
            x2={caretPosition}
            y2={100}
            stroke="blue"
            />
    )
}

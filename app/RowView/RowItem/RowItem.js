import React, { PropTypes } from 'react';
import { HOC as Cerebral } from 'cerebral-view-react';
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import { columnizeString, elementWidth, calculateRowLength } from '../utils';
import styles from './RowItem.scss';

class RowItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dragging: false
        };
    }

    _charWidth() {
        if (this.refs.fontMeasure) return this.refs.fontMeasure.getBoundingClientRect().width;
        return null;
    }

    maxSequenceLength(columnWidth) {
        var sequenceWidthPx = elementWidth(this.refs.sequenceContainer);
        return calculateRowLength(this._charWidth(), sequenceWidthPx, columnWidth);
    }

    _resizeSVG() {
        var {
            sequenceContainer: svg
        } = this.refs;

        var bbox = svg.getBBox();
        var width = Math.floor(bbox.x + bbox.width);
        var height = Math.floor(bbox.y + bbox.height);
        svg.setAttribute('height', height + 'px');
        svg.setAttribute('width', width + 'px');
        svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    }

    componentDidMount() {
        this._resizeSVG();
    }

    componentDidUpdate() {
        this._resizeSVG();
    }

    _processProps(props) {
        var {
            sequenceData,
            columnWidth
        } = props;

        var {
            sequence,
            offset
        } = sequenceData;

        var complement = getComplementSequenceString(sequence);

        var renderedSequence = columnizeString(sequence, columnWidth);
        var renderedComplement = columnizeString(complement, columnWidth);

        this.setState({
            renderedSequence: renderedSequence,
            renderedComplement: renderedComplement,
            renderedOffset: (offset || 0) + 1
        });
    }

    _nearestBP(x) {
        var {
            offset
        } = this.props.sequenceData;

        var columnWidth = this.props.columnWidth;
        var charWidth = this._charWidth();

        var localBP = Math.ceil(x / charWidth);
        var gaps = Math.floor(localBP / columnWidth);
        return offset + localBP - gaps;
    }

    _handleMouseEvent(event, callback, toggleDragging) {
        var dragging = this.state.dragging;
        if (toggleDragging || dragging) {
            var nearestBP = this._nearestBP(event.nativeEvent.offsetX);

            callback({
                shiftHeld: event.shiftKey,
                nearestBP,
                false
            });
        }

        if (toggleDragging) {
            this.setState({
                dragging: !dragging
            });
        }
    }

    componentWillMount() {
        this._processProps(this.props);
    }

    componentWillReceiveProps(nextProps, context) {
        this._processProps(nextProps);
    }

    _highlight(highlight) {
        if (!highlight || highlight.start == -1 && highlight.end == -1) return null;

        var { start, end } = highlight;
        var {
            sequenceData,
            columnWidth
        } = this.props;
        var {
            offset,
            sequence: {
                length
            }
        } = sequenceData;

        start -= 1;
        end -= 1;

        var rowStart = offset;
        var rowEnd = offset + length;

        if (start <= rowEnd && end >= rowStart) {
            var renderStart = (start > rowStart) ? start - rowStart : 0;
            var renderEnd = (end < rowEnd) ? end - rowStart : rowEnd - rowStart;

            renderStart += Math.floor(renderStart / columnWidth);
            renderEnd += Math.floor(renderEnd / columnWidth);

            var renderWidth = renderEnd - renderStart;
            var charWidth = this._charWidth();

            return <rect x={renderStart * charWidth} y={0} width={renderWidth * charWidth} height={10} fill={'blue'} />;
        }

        return null;
    }

    render() {
        var {
            className,
            index,
            signals,
            selectionLayer
        } = this.props;

        var {
            renderedSequence,
            renderedComplement,
            renderedOffset
        } = this.state;

        return (
            <div
                className={styles.rowItem + ' ' + className}
            >
                <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>

                <div className={styles.margin}>
                    {renderedOffset}
                </div>

                <svg ref={'sequenceContainer'}
                     className={styles.sequenceContainer}
                     onMouseDown={e => this._handleMouseEvent(e, signals.editorDragStarted, true)}
                     onMouseMove={e => this._handleMouseEvent(e, signals.editorDragged, false)}
                     onMouseUp={e => this._handleMouseEvent(e, signals.editorDragStopped, true)}
                >
                    {this._highlight(selectionLayer)}

                    <text ref={'sequence'} className={styles.sequence}>
                        <tspan className={styles.sequence}>
                            {renderedSequence}
                        </tspan>

                        <tspan x={0} dy={'1.2em'} className={styles.sequence + ' ' + styles.reversed}>
                            {renderedComplement}
                        </tspan>
                    </text>
                </svg>
            </div>
        );
    }

}

let LinkedRowItem = Cerebral(RowItem, {
    selectionLayer: ['selectionLayer']
});

export {
    LinkedRowItem as default,
    RowItem as DummyRowItem
};

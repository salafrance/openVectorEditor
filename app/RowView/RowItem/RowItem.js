import React, { PropTypes } from 'react';
import throttle from 'lodash/function/throttle';
import { HOC as Cerebral } from 'cerebral-view-react';
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import { columnizeString, elementWidth, calculateRowLength, circularUnion } from './utils';
import styles from './RowItem.scss';

class RowItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    _charWidth() {
        var {fontMeasure} = this.refs;
        if (fontMeasure) return fontMeasure.getBoundingClientRect().width;
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

    _handleMouseEvent(event, callback) {
        if (!event.nativeEvent) return; // FIXME: Don't rely on nativeEvent.
        var nearestBP = this._nearestBP(event.nativeEvent.offsetX);

        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            false
        });
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
            },
            totalSequenceSize
        } = sequenceData;

        start -= 1;
        end -= 1;

        var rowStart = offset;
        var rowEnd = offset + length;

        var union = circularUnion(rowStart, rowEnd, start, end, totalSequenceSize);

        if (union) {
            var renderStart = union.start - rowStart;
            var renderEnd = union.end - rowStart;

            renderStart += Math.floor(renderStart / columnWidth);
            renderEnd += Math.floor(renderEnd / columnWidth);

            var renderWidth = renderEnd - renderStart;
            var charWidth = this._charWidth();

            return <rect className={styles.highlight} x={renderStart * charWidth} y={0} width={renderWidth * charWidth} height={'100%'}  />;
        }

        return null;
    }

    render() {
        var {
            className,
            index,
            signals,
            selectionLayer,
            dragStart,
            drag,
            dragStop
        } = this.props;

        var {
            renderedSequence,
            renderedComplement,
            renderedOffset
        } = this.state;

        var onDragStart = throttle(e => this._handleMouseEvent(e, dragStart), 250);
        var onDrag = throttle(e => this._handleMouseEvent(e, drag), 250);
        var onDragStop = throttle(e => this._handleMouseEvent(e, dragStop), 250);

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
                     onMouseDown={onDragStart}
                     onMouseMove={onDrag}
                     onMouseUp={onDragStop}
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

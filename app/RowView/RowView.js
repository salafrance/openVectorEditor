import React, { PropTypes } from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './RowView.scss';
import assign from 'lodash/object/assign';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import RowItem, { DummyRowItem } from './RowItem/RowItem.js';
import Draggable from 'react-draggable';

@Cerebral({
    embedded: ['embedded'],
    sequenceData: ['combinedSequenceData'],
    columnWidth: ['columnWidth']
})

export default class RowView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            dragging: false
        };
    }

    _dragStart(opts) {
        var {signals} = this.props;

        signals.editorDragStarted(opts);

        this.setState({
            dragging: true
        });
    }

    _drag(opts) {
        var {signals} = this.props;

        if (this.state.dragging) {
            signals.editorDragged(opts);
        }
    }

    _dragStop(opts) {
        var {signals} = this.props;

        signals.editorDragStopped(opts);

        this.setState({
            dragging: false
        });
    }

    _populateRows() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            fontMeasure,
            rowMeasure
        } = this.refs;

        var {
            sequence,
            size
        } = sequenceData;

        if (size <= 0) return;

        var rowLength = rowMeasure.maxSequenceLength(columnWidth);

        if (rowLength === 0) return;

        var rowData = [];

        for (let i = 0; i < size; i += rowLength) {
            let data = {};
            data.sequence = sequence.substr(i, rowLength);
            data.offset = i;
            data.totalSequenceSize = size;
            data = assign({}, sequenceData, data);
            rowData.push(data);
        }

        this.setState({
            rowData: rowData
        });
    }

    componentDidMount() {
        new ResizeSensor(this.refs.rowView, this._populateRows.bind(this));
        this._populateRows();
    }

    render() {
        var {
            columnWidth,
            signals
        } = this.props;

        var {
            embedded,
            rowData
        } = this.state;

        return (
            <div ref={'rowView'}
                    className={ styles.rowView }
                    style={ embedded ? { display: 'none' } : null } // prime this inline for embedded version
                    onMouseUp={e => { this._dragStop(e) }}
                    onMouseLeave={e => { this._dragStop(e) }}
            >
                <DummyRowItem ref={'rowMeasure'} sequenceData={{ sequence: '' }} className={styles.rowMeasure}/>

                    {rowData.map((datum, index ) => {
                        return (
                            <RowItem
                                className={'veRowItem'}
                                sequenceData={datum}
                                columnWidth={columnWidth}
                                dragStart={this._dragStart.bind(this)}
                                drag={this._drag.bind(this)}
                                dragStop={this._dragStop.bind(this)}
                            />
                        );
                    })}
                }
            </div>
        );
    }

}

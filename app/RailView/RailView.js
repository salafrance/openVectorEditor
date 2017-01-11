import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import styles from './RailView.scss';
import Caret from './Caret';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    selectionLayer: ['selectionLayer']
})
export default class RailView extends React.Component {

    render() {
        var {
            sequenceLength,
            selectionLayer
        } = this.props;

        var annotationsSvgs = [];

        if (selectionLayer && selectionLayer.start !== -1 && selectionLayer.end !== -1) {
            annotationsSvgs.push(
                <Caret
                    key='caretStart'
                    caretPosition={selectionLayer.start}
                    sequenceLength={sequenceLength}
                    />
            );
            annotationsSvgs.push(
                <Caret
                    key='caretEnd'
                    caretPosition={selectionLayer.end + 1}
                    sequenceLength={sequenceLength}
                    />
            );
        }

        return (
            <svg
                className={styles.svg}
                viewBox={'-150 -150 300 300'}
            >
                <marker id="codon" markerWidth="3" markerHeight="3" refx="0" refy="3" orient="auto">
                    <circle fill="red" cx="0" cy="0" r="2"/>
                </marker>
                <marker id="arrow" markerWidth="3" markerHeight="3" refx="0" refy="3" orient="auto">
                    <path
                        d="M 0 0 L 0 6 L 9 150 L 200 50"
                        stroke="red"
                        strokeWidth="3"
                        fill="none"
                        />
                </marker>

                {annotationsSvgs}
            </svg>
        );
    }

}

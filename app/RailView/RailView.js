import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import styles from './RailView.scss';
import Caret from './Caret';
import Bar from './Bar';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    selectionLayer: ['selectionLayer'],
    showAxis: ['showAxis']
})
export default class RailView extends React.Component {

    render() {
        var {
            sequenceLength,
            selectionLayer,
            showAxis
        } = this.props;

        var annotationsSvgs = [];
        const baseWidth = 250;

        if (showAxis) {
            annotationsSvgs.push(<Bar baseWidth={baseWidth} />);
        }

        if (selectionLayer && selectionLayer.selected) {
            let {
                start,
                end
            } = selectionLayer;

            annotationsSvgs.push(
                <path
                    style={{opacity: .4}}
                    d={`M ${start}, -4 L ${end}, -4 L ${end}, 8 L ${start}, 8 Z`}
                    fill={'blue'}
                />
            );

            annotationsSvgs.push(
                <Caret
                    key='caretStart'
                    caretPosition={start}
                    sequenceLength={sequenceLength}
                    />
            );
            annotationsSvgs.push(
                <Caret
                    key='caretEnd'
                    caretPosition={end + 1}
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

                <g transform={`translate(-${baseWidth / 2}, 0) scale(${baseWidth / sequenceLength}, 1)`}>
                    { annotationsSvgs }
                </g>
            </svg>
        );
    }

}

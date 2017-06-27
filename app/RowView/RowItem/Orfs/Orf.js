import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

export default class Orf extends React.Component {

    singleClick() {
        this.props.signals.orfClicked({ annotation: this.props.annotation });
    }

    doubleClick() {
        this.props.signals.orfClicked({ annotation: this.props.annotation });
        this.props.signals.sidebarToggle({ sidebar: true, annotation: this.props.annotation, view: "row" });
        // this.props.signals.adjustWidth();
    }

    handleClick(e) {
        var clicks = 0;
        var timeout;

        return function() {
            clicks += 1;

            if (clicks === 1) {
                timeout = setTimeout(function() {
                    this.singleClick();
                    clicks = 0;
                }.bind(this), 250);

            } else {
                clearTimeout(timeout);
                this.doubleClick();
                clicks = 0;
            }
        }.bind(this)
    }

    render() {
        var {
            bpsPerRow,
            height,
            rangeType,
            normalizedInternalStartCodonIndices=[],
            forward,
            annotation,
            widthInBps,
            charWidth=16,
            signals
        } = this.props;

        var frame = annotation.frame;
        // frame is one of [0,1,2]
        var color = 'red';
        if (frame === 1) {
            color = 'green';
        } else if (frame === 2) {
            color = 'blue';
        }

        var width = widthInBps * (charWidth-1) * 1.2;
        var heightWithArrow = height + 12;
        var halfwayPoint = heightWithArrow/2;
        var endCircle;
        var arrow = null;
        var arrowOffset = 0.25*(width/widthInBps);

        var circle = <circle
                        key='circle'
                        r={height*1.5}
                        cx='0'
                        cy={halfwayPoint}
                        transform={ forward ? null : `translate(${width},0)` }
                        />

        if (rangeType === 'end' || rangeType === 'beginningAndEnd') {
            arrow = (<path
                        transform={forward ?
                            `translate(${width+arrowOffset},0)` :
                            `translate(${-arrowOffset},0) scale(-1,1)`
                        }
                        d= {`M 0 ${halfwayPoint} L -18 ${halfwayPoint+6} L -18 ${halfwayPoint-6} Z`}
                        />
                    )
        }

        if (rangeType === 'start' || rangeType === 'beginningAndEnd') {
            endCircle = circle;
        }

        var path = `
            M 0,${halfwayPoint+height/2}
            L ${width},${halfwayPoint+height/2}
            L ${width},${halfwayPoint-height/2}
            L 0,${halfwayPoint-height/2}
            z`

        var codonIndices = normalizedInternalStartCodonIndices.map(function (internalStartCodon,index) {
            var startBp = 0;
            if (forward && (rangeType === 'start' || rangeType === 'beginningAndEnd')) {
                var startBp = annotation.start % bpsPerRow;
            } else if (!forward && (rangeType === 'end' || rangeType === 'beginningAndEnd')) {
                var startBp = annotation.start % bpsPerRow;
            }
            // 0.5 is to center codon above base pair instead of in between two base pairs
            let xShift = (internalStartCodon + 0.5 - startBp) * (width/widthInBps);
            return React.cloneElement(circle, {key: index, transform: `translate(${xShift},0)`});
        })

        return (
            <g
                id={annotation.id}
                key={'Orfs' + annotation.id}
                onClick={this.handleClick()}
                className={`veRowViewOrf clickable frame${frame}`}
                strokeWidth="2"
                stroke={ color}
                fill={ color }
                >

                <path
                    transform={forward ? null : `translate(${width},0) scale(-1,1)`}
                    d={ path }
                    >
                </path>
                { codonIndices }
                { arrow }
                { endCircle }
            </g>
        );
    }
}

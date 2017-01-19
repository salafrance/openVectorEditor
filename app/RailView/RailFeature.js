import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

export default class RailFeature extends React.Component {

    render() {
        var {
            feature,
            height
        } = this.props;

        var {
            start,
            end,
            color
        } = feature;

        return (
            <g>
                <path
                    d={`M ${start}, 0 L ${end}, 0 L ${end}, ${height} L ${start}, ${height} Z`}
                    fill={color}
                    stroke={'black'}
                    strokeWidth={'.25px'}
                    vectorEffect={'non-scaling-stroke'}
                    style={{vectorEffect: 'non-scaling-stroke'}}
                />
            </g>
        );
    }

}

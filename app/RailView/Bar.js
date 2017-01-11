import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

@Cerebral({
    sequenceLength: ['sequenceLength']
})
export default class Bar extends React.Component {

    render() {
        var {
            sequenceLength
        } = this.props;

        return (
            <g>
                <path
                    d={`M 0, 0 L ${sequenceLength}, 0 L ${sequenceLength}, 4 L 0, 4 Z`}
                    fill={'#ffff99'}
                    stroke={'black'}
                    strokeWidth={'.25px'}
                    vectorEffect={'non-scaling-stroke'}
                    style={{vectorEffect: 'non-scaling-stroke'}}
                />
            </g>
        );
    }

}

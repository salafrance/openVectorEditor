import React from 'react';

export default class Bar extends React.Component {

    render() {
        var {
            baseWidth
        } = this.props;

        return (
            <g>
                <path
                    d={`M -${baseWidth / 2}, 0 L ${baseWidth / 2}, 0 L ${baseWidth / 2}, 4 L -${baseWidth / 2}, 4 Z`}
                    fill={'#ffff99'}
                    stroke={'black'}
                    strokeWidth={'.25px'}
                />
            </g>
        );
    }

}

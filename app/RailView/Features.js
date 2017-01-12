import React from 'react';
import RailFeature from './RailFeature';

export default function Features({features = [], annotationHeight, spaceBetweenAnnotations = 2, sequenceLength, signals}) {

    var svgGroups = [];

    features.forEach((feature, index) => {
        let offset = ( index + 1 ) * ( annotationHeight + spaceBetweenAnnotations );

        svgGroups.push(
            <g transform={`translate(0, -${offset})`}>
                <RailFeature
                    id={feature.id}
                    key={'features' + (features.length - index)}
                    feature={feature}
                    height={annotationHeight}
                />
            </g>
        );
    });

    var totalAnnotationHeight = svgGroups.length * (annotationHeight + spaceBetweenAnnotations);

    return {
        component: (
            <g key={'veFeatures'}>
                { svgGroups }
            </g>
        ),
        height: totalAnnotationHeight
    };

}

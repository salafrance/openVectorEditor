import some from 'lodash/collection/some'
import React from 'react';
import Draggable from 'react-draggable'
import styles from './RowView.scss';
import { Decorator as Cerebral } from 'cerebral-view-react';
import ReactList from 'react-list';
import RowItem from './RowItem/RowItem.js'
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import prepareRowData from 've-sequence-utils/prepareRowData';

var defaultContainerWidth = 400
var defaultCharWidth = 12
var defaultMarginWidth = 10

function noop() {
}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],     
    charWidth: ['charWidth'], 
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],    
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],         
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    rowViewDimensions: ['rowViewDimensions'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']     
})

export default class RowView extends React.Component {

    // getNearestCursorPositionToMouseEvent(rowData, event, callback) {
    //     var charWidth = defaultCharWidth;
    //     var rowNotFound = true;
    //     var visibleRowsContainer = this.InfiniteScroller.items;
    //     //loop through all the rendered rows to see if the click event lands in one of them
    //     var nearestBP = 0;
    //     var caretGrabbed = event.target.className && event.target.className.animVal === "cursor"

    //     some(visibleRowsContainer.childNodes, function (rowDomNode) {
    //       var boundingRowRect = rowDomNode.getBoundingClientRect();
    //       if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
    //           //then the click is falls within this row
    //           rowNotFound = false;
    //           var row = rowData[Number(rowDomNode.getAttribute('data-row-number'))];
    //           if (event.clientX - boundingRowRect.left < 0) {
    //               nearestBP = row.start;
    //           } else {
    //               var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
    //               var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + charWidth / 2) / charWidth);
    //               nearestBP = numberOfBPsInFromRowStart + row.start;
    //               if (nearestBP > row.end + 1) {
    //                   nearestBP = row.end + 1;
    //               }
    //           }
    //           return true //break the loop early because we found the row the click event landed in
    //       }
    //     })
    //     if (rowNotFound) {
    //         var {top, bottom} = visibleRowsContainer.getBoundingClientRect()
    //         var numbers = [top,bottom]
    //         var target = event.clientY
    //         var topOrBottom = numbers.map(function(value, index) {
    //             return [Math.abs(value - target), index];
    //         }).sort().map(function(value) {
    //             return numbers[value[1]];
    //         })[0];
    //         var rowDomNode
    //         if (topOrBottom === top) {
    //             rowDomNode = visibleRowsContainer.childNodes[0]
    //         } else {
    //             rowDomNode = visibleRowsContainer.childNodes[visibleRowsContainer.childNodes.length-1]
    //         }
    //         if (rowDomNode) {
    //             var row = rowData[Number(rowDomNode.getAttribute('data-row-number'))];
    //             //return the last bp index in the rendered rows
    //             nearestBP = row.end
    //         } else {
    //             nearestBP = 0
    //         }
    //     }
    //     callback({
    //         shiftHeld: event.shiftKey,
    //         nearestBP,
    //         caretGrabbed
    //     });
    // }

    componentDidMount() {
        console.log("rv did mount ran")
        // maybe get the ref instead of id
        var rowViewWidth = document.getElementById("allViews").clientWidth;
        console.log(rowViewWidth)

        var correctBps = Math.floor(rowViewWidth / this.props.charWidth);
        this.setState({ bpsPerRow: correctBps });
        console.log(correctBps)
        this.setState({ rowData: prepareRowData(this.props.sequenceData, this.props.bpsPerRow) });
    }

    // this runs before render(), we need to grab the final size of the rowview container and fill it
    // componentDidMount() {
        // new ResizeSensor(this.refs.rowView);
    // }

    render() {
        var {
            sequenceData,
            sequenceLength,
            selectionLayer,
            sequenceName,
            cutsites,
            orfs,
            showAxis,
            showCaret,
            showCutsites,
            showFeatures,
            showOrfs,
            annotationHeight,
            spaceBetweenAnnotations,
            annotationVisibility,
            caretPosition,
            rowViewDimensions,
            marginWidth=defaultMarginWidth,
            signals,
            bpsPerRow,
            rowData
        } = this.props;

        console.log("ran render rv")

        // calculate bps per row and separate rows based on viewport size
        // var rowViewWidth = document.getElementById("circularView").clientWidth;
        // var correctBps = Math.floor(sequenceLength * 12 / rowViewWidth);
        // bpsPerRow = correctBps;
        // rowData = prepareRowData(sequenceData, bpsPerRow);

        var renderItem = (index,key) =>{
            if (rowData[index]) {
                return (
                    <div data-row-number={index} key={key}>
                        <div className={'veRowItemSpacer'} />
                        <RowItem row={rowData[index]} />
                    </div>
                );
            } else {
                return null
            }
        }

        return (
            <Draggable
                bounds={{top: 0, left: 0, right: 0, bottom: 0}}
                // onDrag={(event) => {
                //     this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragged)}
                // }
                // onStart={(event) => {
                //     this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragStarted)}
                // }
                // onStop={signals.editorDragStopped}
                >
                <div
                    ref="rowView"
                    className={styles.RowView + " veRowView"}
                    // onClick={(event) => {
                    //     this.getNearestCursorPositionToMouseEvent(event, signals.editorClicked)}   
                    // }
                    >
                    <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>
                    <ReactList
                        ref={c => {
                            this.InfiniteScroller= c
                        }}
                        itemRenderer={renderItem}
                        length={rowData.length}
                        itemSizeEstimator={itemSizeEstimator}
                        type='simple'
                        />
                </div>
            </Draggable>
        );
    }
}

function itemSizeEstimator(index, cache) {
    if (cache[index+1]) {
        return cache[index+1]
    }
    if (cache[index-1]) {
        return cache[index-1]
    }
    return 100
}
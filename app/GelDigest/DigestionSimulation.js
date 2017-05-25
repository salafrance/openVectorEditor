import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import ActiveEnzymes from '../RestrictionEnzymeManager/ActiveEnzymes.js';
import EnzymesGroups from '../RestrictionEnzymeManager/EnzymesGroups.js';
import Ladder from './Ladder';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showGelDigestDialog: ['showGelDigestDialog'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
})

export default class DigestionSimulation extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    render () {
        var {
            signals,
            showGelDigestDialog,
            originalUserEnzymesList,
            currentUserEnzymesList
        } = this.props;

        var gridTileTitleStyle = {
            textAlign: "center",
            color: "black",
        };

        var tileLeft = (
            <div>
                <EnzymesGroups />
            </div>
        );

        var tileCenter = (
            <div>
                <ActiveEnzymes />
            </div>
        );

        var tileRight = (
            <div>
                <Ladder />
            </div>
        );

        var centerTileTitle = (
            <h4 style={gridTileTitleStyle}>Active enzymes</h4>
        );

        var rightTileTitle = (
            <h4 style={gridTileTitleStyle}>Ladder</h4>
        );

        var gelDigestContentGrid = (
            <div>
                <GridList
                    cols={3}
                    cellHeight={450}
                    padding={5}
                    >
                    <GridTile
                        rows={1}
                        cols={1}
                        >
                        {tileLeft}
                    </GridTile>
                    <GridTile
                        rows={1}
                        cols={1} title={centerTileTitle}
                        titlePosition={"top"}
                        titleBackground="#E0E0E0"
                        >
                        {tileCenter}
                    </GridTile>
                    <GridTile
                        rows={1}
                        cols={1}
                        title={rightTileTitle}
                        titlePosition={"top"}
                        titleBackground="#E0E0E0"
                        >
                        {tileRight}
                    </GridTile>
                </GridList>
            </div>
        );

        var toOpen = this.props.showGelDigestDialog;

        var actions = [
            <FlatButton
                label={"OK"}
                style={{color: "#03A9F4"}}
                onTouchTap={function() {
                    signals.gelDigestDisplay();
                }}
            />
        ];

        return (
            <div align="center">
                <Dialog
                    ref="gelDigest"
                    title="Gel Digest"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={toOpen}
                    titleStyle={{padding:'50px 0 0 50px', color:"black", background:"white"}}
                    >
                    {gelDigestContentGrid}
                </Dialog>
            </div>
        );
    }
}

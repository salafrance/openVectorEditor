import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import LeftTile from './EnzymesGroups';
import RightTile from './ActiveEnzymes';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
    cancelButtonValue: ['cancelButtonValue'],
    applyButtonValue: ['applyButtonValue'],
})

export default class RestrictionEnzymeManager extends  React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    render () {
        var {
            signals,
            showRestrictionEnzymeManager,
            originalUserEnzymesList,
            currentUserEnzymesList,
            cancelButtonValue,
            applyButtonValue,
        } = this.props;

        var tileTitleStyle = {
            textAlign: "center",
            color: "black",
            opacity: "0.54",
        };

        var tileLeft = (
            <div>
                <LeftTile />
            </div>
        );

        var tileRight = (
            <div>
                <RightTile /> <br />
            </div>
        );

        var leftTileTitle = (
            <h4 style={tileTitleStyle}>Enzymes groups</h4>
        );

        var rightTileTitle = (
            <h4 style={tileTitleStyle}>Active enzymes</h4>
        );

        var grid = (
            <div>
                <GridList
                    cols={2}
                    cellHeight={400}
                    padding={10}
                >
                    <GridTile rows={1} cols={1} title={leftTileTitle} titlePosition={"top"} titleBackground="#E0E0E0">
                        {tileLeft}
                    </GridTile>
                    <GridTile rows={1} cols={1} title={rightTileTitle} titlePosition={"top"} titleBackground="#E0E0E0">
                        {tileRight}
                    </GridTile>
                </GridList>
            </div>
        );

        var toOpen = showRestrictionEnzymeManager;

        var actions = [
            <FlatButton
                label={cancelButtonValue}
                onTouchTap={function() {
                        signals.updateUserEnzymes({selectedButton: cancelButtonValue, currentUserList: currentUserEnzymesList, originalUserList: originalUserEnzymesList});
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
            <FlatButton
                label={applyButtonValue}
                style={{color: "#03A9F4"}}
                onTouchTap={function() {
                        signals.updateUserEnzymes({selectedButton: applyButtonValue, currentUserList: currentUserEnzymesList, originalUserList: originalUserEnzymesList});
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
        ];

        return (
            <div align="center">
                <Dialog
                    ref="enzymeManager"
                    title="Restriction Enzyme Manager"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={toOpen}
                    titleStyle={{color: "white", background: "#3F51B5", paddingBottom: "8px", paddingTop: "8px"}}
                > <br />
                        {grid}
                </Dialog>
            </div>
        );
    }
}
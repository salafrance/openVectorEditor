import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import ActiveEnzymes from './ActiveGelEnzymes';
import EnzymesGroups from './GelEnzymesGroups';
import Ladder from './Ladder';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showGelDigestDialog: ['showGelDigestDialog'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
    currentEnzymesList: ['currentEnzymesList'],
})

export default class DigestionSimulation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUserEnzymesList: this.props.currentUserEnzymesList,
            open: false
        };
    }

    addUserEnzyme(enzyme) {
        var editedList = this.state.currentUserEnzymesList.slice();
        var index = editedList.indexOf(enzyme);
        if (index < 0) {
            editedList.push(enzyme);
            editedList.sort();
        } else {
            editedList.splice(index, 1);
        }
        this.setState({ currentUserEnzymesList: editedList });
    }

    addAllUserEnzymes() {
        var editedList = this.state.currentUserEnzymesList.slice();
        var list = this.props.currentEnzymesList;
        for (var i=0; i<list.length; i++) {
            if (editedList.indexOf(list[i]) < 0) {
                editedList.push(list[i]);
            }
        }
        editedList.sort();
        this.setState({ currentUserEnzymesList: editedList });
    }

    removeUserEnzyme(enzyme) {
        var editedList = this.state.currentUserEnzymesList.slice();
        var index = editedList.indexOf(enzyme);
        editedList.splice(index, 1);
        this.setState({ currentUserEnzymesList: editedList });
    }

    removeAllUserEnzymes() {
        this.setState({ currentUserEnzymesList: [] });
    }

    render () {
        var {
            signals,
            showGelDigestDialog,
            originalUserEnzymesList,
            // currentUserEnzymesList
        } = this.props;

        var gridTileTitleStyle = {
            textAlign: "center",
            color: "black",
        };

        var tileLeft = (
            <div>
                <EnzymesGroups
                    currentUserEnzymesList={this.state.currentUserEnzymesList}
                    addUserEnzyme={this.addUserEnzyme.bind(this)}
                    addAllUserEnzymes={this.addAllUserEnzymes.bind(this)}
                />
            </div>
        );

        var tileCenter = (
            <div>
                <ActiveEnzymes
                    currentUserEnzymesList={this.state.currentUserEnzymesList}
                    removeUserEnzyme={this.removeUserEnzyme.bind(this)}
                    removeAllUserEnzymes={this.removeAllUserEnzymes.bind(this)}
                    />
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
                    cellHeight={400}
                    cellWidth={300}
                    padding={10}
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

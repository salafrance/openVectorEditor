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
})

export default class DigestionSimulation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render () {
        var {
            signals,
            showGelDigestDialog,
        } = this.props;

        var gridTileTitleStyle = {
            textAlign: "center",
            color: "black",
            fontSize: '15px'
        };

        var centerTileTitle = (
            <div 
                style={ gridTileTitleStyle }
                >
                Active enzymes
            </div>
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
                        key="enzymeGroups"
                        rows={1}
                        cols={1}
                        >
                        <div>
                            <EnzymesGroups />
                        </div>
                    </GridTile>
                    <GridTile
                        key="activeEnzymes"
                        rows={1}
                        cols={1} 
                        title={ centerTileTitle }
                        titlePosition={"top"}
                        titleBackground="#E0E0E0"
                        >
                        <div>
                            <ActiveEnzymes />
                        </div>
                    </GridTile>
                    <GridTile
                        key="gelLadder"
                        rows={1}
                        cols={1}
                        >
                        <div>
                            <Ladder />
                        </div>
                    </GridTile>
                </GridList>
            </div>
        );

        var toOpen = showGelDigestDialog;

        var actions = [
            <FlatButton
                label={"OK"}
                style={{color: "#a065d3"}}
                onTouchTap={function() {
                    signals.gelDigestDisplay();
                }}
            />
        ];

        return (
            <div align="center">
                <Dialog
                    bodyStyle={{padding:'25px 25px 0 25px'}}
                    ref="gelDigest"
                    title="Gel Digest"
                    autoDetectWindowHeight={ true }
                    actions={ actions }
                    open={ toOpen }
                    titleStyle={{padding:'25px 0 0 50px', color:"black", background:"white"}}
                    >
                    { gelDigestContentGrid }
                </Dialog>
            </div>
        );
    }
}

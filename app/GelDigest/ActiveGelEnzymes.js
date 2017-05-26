import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import IconButton from 'material-ui/lib/icon-button';
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import styles from '../RestrictionEnzymeManager/manager-list.scss';

export default class ActiveGelEnzymes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {
            signals,
            removeUserEnzyme,
            removeAllUserEnzymes,
            currentUserEnzymesList,
        } = this.props;

        return (
            <div>
                <List className={styles.managerListRight}>
                    {currentUserEnzymesList.map((enzyme, index) => (
                        <ListItem
                            key={index}
                            style={{maxHeight:'40px', fontSize:'11pt', verticalAlign:'middle', borderBottom:'1px solid #E0E0E0'}}
                            primaryText={enzyme}
                            rightIconButton={
                                <IconButton
                                    onTouchTap={function() {
                                        removeUserEnzyme(enzyme);
                                    }}
                                    >
                                    <CloseIcon />
                                </IconButton>
                            }
                            />
                    ))}
                </List>

                <RaisedButton
                    className={styles.raisedButton}
                    label="Remove all"
                    primary={true}
                    onTouchTap={function () {
                        removeAllUserEnzymes();
                    }}
                    />
            </div>
        );
    }
}

import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import ReactList from 'react-list';
import List from 'material-ui/lib/lists/list';
import RaisedButton from 'material-ui/lib/raised-button';
import styles from '../RestrictionEnzymeManager/manager-list.scss';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

@Cerebral({
    commonEnzymes: ['commonEnzymes'],
    rebaseEnzymes: ['rebaseEnzymes'],
    berkeleyBBEnzymes: ['berkeleyBBEnzymes'],
    MITBBEnzymes: ['MITBBEnzymes'],
    fastDigestEnzymes: ['fastDigestEnzymes'],
    currentEnzymesList: ['currentEnzymesList'],
    gelDigestEnzymes: ['gelDigestEnzymes']
})

export default class GelEnzymesGroups extends React.Component {
    constructor(props) {
        super(props);
        this.props.signals.chooseEnzymeList({selectedList: this.props.commonEnzymes});
        this.state = {
            value: 1,
            input: '',
            currentEnzymesList: this.props.currentEnzymesList
        };
    };

    componentWillReceiveProps(newProps) {
        if (newProps.currentEnzymesList !== this.props.currentEnzymesList) {
            this.setState({ currentEnzymesList: newProps.currentEnzymesList });
        }
    }

    componentDidUpdate(newProps, newState) {
        if (newProps.currentEnzymesList !== this.props.currentEnzymesList) {
            this.filterList();
        }
    }

    handleChange = (event, index, value) => {
        this.setState({value: value});
        switch (value.text) {
            case 'REBASE':
                this.props.signals.chooseEnzymeList({selectedList: this.props.rebaseEnzymes});
                break;
            case 'Berkeley BioBricks':
                this.props.signals.chooseEnzymeList({selectedList: this.props.berkeleyBBEnzymes});
                break;
            case 'MIT BioBricks':
                this.props.signals.chooseEnzymeList({selectedList: this.props.MITBBEnzymes});
                break;
            case 'Fermentas Fast Digest':
                this.props.signals.chooseEnzymeList({selectedList: this.props.fastDigestEnzymes});
                break;
            default:
                this.props.signals.chooseEnzymeList({selectedList: this.props.commonEnzymes});
        }
    };

    isSelected = (enzyme) => {
        return (this.props.gelDigestEnzymes.indexOf(enzyme) >= 0);
    };

    filterList() {
        var string = this.refs.enzymeField.value;
        var currentEnzymesList = this.props.currentEnzymesList;
        this.setState({ input: string });
        var regex = new RegExp('.*', 'i');
        if (string && string.length > 0) {
            try {
                regex = new RegExp(string.toLowerCase(), 'i');
            } catch (e) {
                return;
            }
            var filteredEnzymes = [];
            currentEnzymesList.forEach(function(enzyme) {
                if (regex.test(enzyme)) {
                    filteredEnzymes.push(enzyme);
                }
            })
            if (filteredEnzymes.length > 0) {
                this.setState({ currentEnzymesList: filteredEnzymes });
            } else {
                this.setState({ currentEnzymesList: ["no matches"] });
            }
        } else {
            this.setState({ currentEnzymesList: currentEnzymesList });
        }
    }

    clearSearch() {
        this.setState({ input: "", currentEnzymesList: this.props.currentEnzymesList });
    }

    render() {
        var {
            signals,
            gelDigestEnzymes,
        } = this.props;
        var currentEnzymesList = this.state.currentEnzymesList;

        var selectedStyle = {
            backgroundColor:'#a065d3',
            borderBottom:'1px solid white',
            color:'white',
            padding:'10px 16px',
            fontSize:'11pt',
            height:'40px',
            verticalAlign:'middle',
            cursor:'pointer'
        };
        var notSelectedStyle = {
            backgroundColor:'white',
            borderBottom:'1px solid #E0E0E0',
            color:'black',
            padding:'10px 16px',
            fontSize:'11pt',
            height:'40px',
            verticalAlign:'middle',
            cursor:'pointer'
        };

        let menuItems = [
            { payload: '1', text: 'Common' },
            { payload: '2', text: 'REBASE' },
            { payload: '3', text: 'Berkeley BioBricks' },
            { payload: '4', text: 'MIT BioBricks' },
            { payload: '5', text: 'Fermentas Fast Digest' },
        ];
        return (
            <div>
                <DropDownMenu
                    onChange = {this.handleChange}
                    menuItems = {menuItems}
                    style = {{backgroundColor: "#E0E0E0", zIndex:'20', width:'100%'}}
                    underlineStyle = {{opacity: 0}}
                    iconStyle = {{fill: "black"}}
                    label="Enzyme Groups"
                    labelStyle = {{fontSize: 15, color: "black", lineHeight:'48px'}}
                    />

                <input
                    ref="enzymeField"
                    type="text"
                    placeholder="search"
                    style={{paddingLeft:'5px', marginBottom:'4px', width:'100%'}}
                    value={this.state.input.toString()}
                    onChange={this.filterList.bind(this)}
                    />

                <div
                    style={{cursor:'pointer', display:'inline', marginLeft:'-15px'}}
                    onClick={this.clearSearch.bind(this)}>
                    x
                </div>

                <List className={styles.managerListLeft}>
                    {currentEnzymesList.map((enzyme, index) => (
                        <div
                            style = { this.isSelected(enzyme) ? selectedStyle : notSelectedStyle }
                            id = { enzyme }
                            key = { index }
                            onClick = {function () {
                                        if (enzyme !== "no matches") {
                                            signals.editDigestEnzymes({currentUserList: gelDigestEnzymes,
                                            enzyme: enzyme, action: "toggle" })
                                        }
                                    }}
                            >
                            { enzyme }
                        </div>
                    ))}
                </List>

                <RaisedButton
                    className={styles.raisedPurpleButton}
                    label="Add all"
                    secondary={true}
                    onTouchTap={function () {
                        signals.editDigestEnzymes({currentUserList: gelDigestEnzymes,
                            currentEnzymesList: currentEnzymesList, action: "add all"});
                    }}
                    />
            </div>
        );
    }
}

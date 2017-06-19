// React
import React, { PropTypes } from 'react';

// Cerebral
import { Decorator as Cerebral } from 'cerebral-view-react';
import RestrictionEnzymeManager from './RectrictionEnzymeManager/RestrictionEnzymeManager';

// Material UI
import BothViewsIcon from 'material-ui/lib/svg-icons/av/art-track';
import CircularIcon from 'material-ui/lib/svg-icons/device/data-usage';
import Dialog from 'material-ui/lib/dialog';
import DownloadIcon from 'material-ui/lib/svg-icons/file/file-download';
import EnzymesIcon from 'material-ui/lib/svg-icons/action/track-changes';
import FileIcon from 'material-ui/lib/svg-icons/editor/insert-drive-file';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import InputIcon from 'material-ui/lib/svg-icons/action/input';
import MenuItem from 'material-ui/lib/menus/menu-item';
import PrintIcon from 'material-ui/lib/svg-icons/action/print';
import RailIcon from 'material-ui/lib/svg-icons/hardware/power-input';
import RaisedButton from 'material-ui/lib/raised-button';
import RowIcon from 'material-ui/lib/svg-icons/content/text-format';
import SaveIcon from 'material-ui/lib/svg-icons/action/backup';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import UploadIcon from 'material-ui/lib/svg-icons/file/file-upload';
import VisibleIcon from 'material-ui/lib/svg-icons/action/visibility';
import Check from 'material-ui/lib/svg-icons/navigation/check';
import DropDownArrow from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import Divider from 'material-ui/lib/menus/menu-divider';

import Search from './Search.js'
import styles from './tool-bar.css'

@Cerebral({
    embedded: ['embedded'],
    readOnly: ['readOnly'],
    showAminoAcids: ['showAminoAcids'],
    showCircular: ['showCircular'],
    showCutsites: ['showCutsites'],
    showFeatures: ['showFeatures'],
    showOrfs: ['showOrfs'],
    showParts: ['showParts'],
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
    showReverseSequence: ['showReverseSequence'],
    showRow: ['showRow'],
    showSearchBar: ['showSearchBar'],
    showSidebar: ['showSidebar'],
    showTranslations: ['showTranslations'],
    history: ['history'],
    historyIdx: ['historyIdx'],
    savedIdx: ['savedIdx']
})

export default class ToolBar extends React.Component {

    render() {
        var {
            embedded,
            readOnly,
            showAminoAcids,
            showCircular,
            showCutsites,
            showFeatures,
            showOrfs,
            showParts,
            showRestrictionEnzymeManager,
            showReverseSequence,
            showRow,
            showSearchBar,
            showSidebar,
            showTranslations,
            signals,
            history,
            historyIdx,
            savedIdx
        } = this.props;

        var dialog = (
            <RestrictionEnzymeManager />
        );

        var pressedButtonStyle = {boxShadow:'1px 1px 5px #888888 inset', background:'lightgray'};
        var unpressedButtonStyle = {boxShadow:'0px 0px 5px #888888', background:'rgb(232,232,232)'};
        // show/hide views buttons that only appear in embedded mode
        var embeddedControls = (
            <div style={{display: 'inline-block', margin:'0 5px', verticalAlign:'top'}}>
                <IconButton tooltip="Toggle Sequence View"
                    style={ showRow ? pressedButtonStyle : unpressedButtonStyle }
                    onTouchTap={function() {
                        if ((embedded || showSidebar) && showCircular && !showRow) {
                            signals.toggleShowCircular(); // only allow one view
                        }
                        signals.toggleShowRow();
                        signals.adjustWidth();
                    }}
                    >
                    <RowIcon />
                </IconButton>
                <IconButton tooltip="Toggle Circular View"
                    style={showCircular ? pressedButtonStyle : unpressedButtonStyle }
                    onTouchTap={function() {
                        if ((embedded || showSidebar) && showRow && !showCircular) {
                            signals.toggleShowRow(); // only allow one view
                        }
                        signals.toggleShowCircular();
                        signals.adjustWidth();
                    }}
                    >
                    <CircularIcon />
                </IconButton>
            </div>
        )

        // upload and download files items
        var fileMenuItems = (
            <div>
                <MenuItem key={1} primaryText="Download SBOL 1.1" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'sbol1'});
                    }}
                    />
                <MenuItem key={2} primaryText="Download SBOL 2.0" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'sbol2'});
                    }}
                    />
                <MenuItem key={3} primaryText="Download GenBank" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'genbank'});
                    }}
                    />
                <MenuItem key={4} primaryText="Download Fasta" insetChildren={false}
                    style={{padding:'0 20px'}}
                    onClick={function () {
                        signals.clickSaveFile({fileExt: 'fasta'});
                    }}
                    />
                { embedded ? null : <Divider />}
                { embedded ? null :
                    <MenuItem key={5} primaryText="Upload from file ..." insetChildren={false}
                        style={{padding:'0 20px'}}
                        onClick={function () {
                            var element = document.getElementById("uploadFileInput");
                            element.click();
                            element.addEventListener("change", handleFiles, false);
                            function handleFiles() {
                                let file = this.files[0];
                                 signals.clickLoadFile({inputFile: file});
                            }
                        }}
                        />
                }
                <input type="file" id="uploadFileInput" style={{display:'none'}} onChange={function() {
                }} />
            </div>
        );

        // show or hide features and things
        var checkmarkStyle = {padding:'0', color:'black', position:'absolute', top:'10px', left:'20px'}
        // the built-in 'checked' functionality was failing me, so i'm brute forcing it with leftIcon
        var visibilityMenuItems = (
            <div>
                <MenuItem key={1} primaryText="Features" insetChildren={true}
                    leftIcon={<Check style={showFeatures ? checkmarkStyle : {display:'none'}}/>}
                    onClick={function () {
                        signals.toggleAnnotationDisplay({type: 'Features'});
                    }}
                    />
                <MenuItem key={2} primaryText="Cutsites" insetChildren={true}
                    leftIcon={<Check style={showCutsites ? checkmarkStyle : {display:'none'}}/>}
                    onClick={function () {
                        signals.toggleAnnotationDisplay({type: 'Cutsites'});
                    }}
                    />
                <MenuItem key={3} primaryText="ORFs" insetChildren={true}
                    leftIcon={<Check style={showOrfs ? checkmarkStyle : {display:'none'}}/>}
                    onClick={function () {
                        signals.toggleAnnotationDisplay({type: 'Orfs'});
                    }}
                    />
                <MenuItem key={4} primaryText="Amino Acids" insetChildren={true}
                    leftIcon={<Check style={showAminoAcids ? checkmarkStyle : {display:'none'}}/>}
                    onClick={function () {
                        signals.toggleAnnotationDisplay({type: 'AminoAcids'});
                    }}
                    />
                <MenuItem key={5} primaryText="Complementary Seq" insetChildren={true}
                    leftIcon={<Check style={showReverseSequence ? checkmarkStyle : {display:'none'}}/>}
                    onClick={function () {
                        signals.toggleAnnotationDisplay({type: 'ReverseSequence'});
                    }}
                    />
            </div>
        );

        var fileButtonElement = (
            <IconButton tooltip="File Functions">
                <FileIcon />
                <DropDownArrow />
            </IconButton>
        );

        var visibleButtonElement = (
            <IconButton tooltip="Show/Hide Features">
                <VisibleIcon />
                <DropDownArrow />
            </IconButton>
        );

        // pulls out the current view and necessary resizing js to a new tab
        // and applies some styling to cleanup for print version
        var prepPrintPage = function() {
            // scroll the rowview to reveal all rows

            var contents = document.getElementById("allViews").innerHTML;
            var head = document.head.innerHTML;
            var stylePage = "<style>" +
                                "@page {margin: 1in;}" +
                                ".veSelectionLayer {display: none;}" +
                                "#circularView, #rowView {width: 8.5in; display: block; overflow: visible;}" +
                                "#circularView {page-break-after: always;}" +
                                "#rowView > div {bottom: auto;}" +
                            "</style>";
            var printTab = window.open();
            printTab.document.body.innerHTML = head + stylePage + contents;
            printTab.document.close();
            printTab.focus();
            printTab.print();
            printTab.close();
        };

        var saveButtonStatus = "saved";
        if (historyIdx !== savedIdx) {
            saveButtonStatus = "unsaved";
        }

        pressedButtonStyle = Object.assign({margin:'0 5px', verticalAlign:'top'}, pressedButtonStyle);
        unpressedButtonStyle = Object.assign({margin:'0 5px', verticalAlign:'top'}, unpressedButtonStyle);

        return (
            <Toolbar style={{padding:'5px 24px', height:'60px'}}>
                <ToolbarGroup key={0}>
                    <IconButton
                        style={{verticalAlign:'top'}}
                        tooltip="Feature Details"
                        onTouchTap={function() {
                            signals.sidebarToggle();
                            signals.adjustWidth();
                        }}
                        >
                        <InputIcon id="openFeatureDisplay"/>
                    </IconButton>

                    { embeddedControls }

                    <IconButton
                        style={ showSearchBar ? pressedButtonStyle : unpressedButtonStyle }
                        tooltip="Search"
                        onTouchTap={function() {
                            signals.toggleSearchBar();
                        }}>
                        <SearchIcon />
                    </IconButton>

                    <Search />

                    <IconButton
                        style={ showRestrictionEnzymeManager ? pressedButtonStyle : unpressedButtonStyle }
                        label="Dialog"
                        tooltip="Manage Restriction Enzymes"
                        onTouchTap={function() {
                            signals.restrictionEnzymeManagerDisplay();
                        }}
                        >
                        <EnzymesIcon />
                    </IconButton>

                    <IconMenu
                        iconButtonElement = { visibleButtonElement }
                        openDirection = "bottom-right"
                        >
                        { visibilityMenuItems }
                    </IconMenu>

                    <IconMenu
                        className={styles.openableIcon}
                        iconButtonElement={fileButtonElement}
                        openDirection="bottom-right"
                        >
                        { fileMenuItems }
                    </IconMenu>

                    <IconButton
                        style={{verticalAlign:'top'}}
                        disabled={ readOnly }  // you can't save in read only
                        tooltip="Save to Server"
                        className={styles[saveButtonStatus]}
                        onTouchTap={function() {
                            signals.saveChanges();
                        }}
                        >
                        <SaveIcon />
                    </IconButton>

                    <IconButton
                        style={{verticalAlign:'top'}}
                        tooltip="Print Current View"
                        onTouchTap={function() {
                            prepPrintPage();
                        }}
                        >
                        <PrintIcon />
                    </IconButton>

                    { dialog }
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

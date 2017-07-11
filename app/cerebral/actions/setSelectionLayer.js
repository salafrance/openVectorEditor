var setSelectionLayerHelper = require('./setSelectionLayerHelper');
var deepEqual = require('deep-equal');
var assign = require('lodash/object/assign');

/**
 * sets the selection layer on a plasmid
 */
export default function setSelectionLayer({input: {selectionLayer, view}, state}) {
    var selection = Object.assign({}, selectionLayer);
    // changes i made for orf rendering messed up selectionLayer
    if (selectionLayer && selectionLayer.internalStartCodonIndices) {
        selection.start -= 0.5;
        selection.end += 0.5;
    }
    var updatedSelectionLayer = setSelectionLayerHelper(selection);
    if (!deepEqual(state.get('selectionLayer'), updatedSelectionLayer)) {
        state.set('selectionLayer', updatedSelectionLayer);
    }
    if (updatedSelectionLayer.selected) {
        // makesure sidebar is on correct tab
        var type;
        if (selectionLayer.numberOfCuts) {
            type = 'Cutsites';
        } else if (selectionLayer.internalStartCodonIndices) {
            type = 'Orfs';
        } else if (selectionLayer.name) {
            type = 'Features';
        }
        if (type) {
            state.set('sidebarType', type);
        }

        if (updatedSelectionLayer.cursorAtEnd) {
            state.set('caretPosition', updatedSelectionLayer.end + 1);
        } else {
            state.set('caretPosition', updatedSelectionLayer.start);
        }
    }
}

// quick Boolean check of state var safeEditOn to see if we can delete features or not

export default function checkSafeEdit({input, state, output}) {
    var selectionLayer = state.get('selectionLayer');

    if (state.get('safeEditOn')) {
        output.safeEditOn();
    } else {
        output.safeEditOff();
    }
}
checkSafeEdit.outputs = ['safeEditOn', 'safeEditOff'];
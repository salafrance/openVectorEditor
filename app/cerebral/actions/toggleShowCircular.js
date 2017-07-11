module.exports = function toggleShowCircular({input, state, output}) {
    var currently = state.get('showCircular');
    state.set('showCircular', !currently);
}

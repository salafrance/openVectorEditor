module.exports = function toggleShowRow({input, state, output}) {
    var currently = state.get('showRow');
    state.set('showRow', !currently);
}

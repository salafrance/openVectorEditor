module.exports = function getXStartAndWidthOfRangeWrtRow(range, row, bpsPerRow, charWidth, sequenceLength) {
    return {
        xStart: normalizePositionByRangeLength(range.start - row.start, sequenceLength) * charWidth,
        width: (normalizePositionByRangeLength(range.end + 1 - range.start, sequenceLength)) * charWidth,
    };
};
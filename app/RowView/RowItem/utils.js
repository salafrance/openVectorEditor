export default {
    columnizeString: function(string, columnWidth) {
        var columns = [];

        if (columnWidth) {
            for (let i = 0; i < string.length; i += columnWidth) {
                columns.push(string.substr(i, columnWidth) + ' ');
            }
        } else {
            columns = [string];
        }

        return columns.join('');
    },

    calculateRowLength: function(charWidth, viewWidth, columnWidth) {
        if (!(charWidth && viewWidth)) return 0;

        var baseRowLength = Math.floor(viewWidth / charWidth);
        var adjustedRowLength = baseRowLength;

        if (columnWidth) {
            adjustedRowLength -= Math.floor(baseRowLength / columnWidth);
            adjustedRowLength = Math.floor(adjustedRowLength / columnWidth) * columnWidth;
        }

        return adjustedRowLength;
    },

    elementWidth: function(elem) {
        return (elem) ? parseFloat(getComputedStyle(elem).width) : 0;
    },

    circularUnion: function circularUnion(start0, end0, start1, end1, length) {
        if (start1 > end1) {
            var left = circularUnion(start0, end0, 0, end1);
            var right = circularUnion(start0, end0, start1, length - 1);

            if (left) return left;
            if (right) return right;
        }

        if (!(start1 < end0 && end1 > start0)) return null;

        var unionStart = (start1 > start0) ? start1 : start0;
        var unionEnd = (end1 < end0) ? end1 : end0;

        return {
            start: unionStart,
            end: unionEnd,
            width: unionEnd - unionStart
        };
    }
}

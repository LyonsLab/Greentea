function handle(delta) {
    delta.preventDefault();
    if (delta.wheelDelta < 0) {
        console.log("out");
        zoomOut();
    } else {
        console.log("in");
        zoomIn();
    }
}

function zoomIn() {
    var end = chart.categoryAxis.data.length;
    if (chart.endIndex - 2 > chart.startIndex && chart.endIndex < end) {
        chart.zoomToIndexes(chart.startIndex + 1, chart.endIndex - 1);
    }
}

function zoomOut() {
    var end = chart.categoryAxis.data.length;
    if (chart.startIndex > 0 && chart.endIndex < end) {
        chart.zoomToIndexes(chart.startIndex - 1, chart.endIndex + 1);
    } else if (chart.endIndex < end){
        chart.zoomToIndexes(chart.startIndex, chart.endIndex + 1);
    } else {
        chart.zoomToIndexes(chart.startIndex -1, chart.endIndex);
    }
}

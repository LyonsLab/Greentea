function handle(delta) {
    if (delta.wheelDelta < 0) {
        zoomOut();
    } else {
        zoomIn();
    }
}

function zoomIn() {
    var graph = chart.panels[0].graphs[0];
    var end = graph.data.length;
    if (graph.end - 2 > graph.start && graph.end < end) {
        chart.panels[0].zoomToIndexes(graph.start + 1, graph.end - 1);
    }
}

function zoomOut() {
    var graph = chart.panels[0].graphs[0];
    var end = graph.data.length;
    if (graph.start > 0 && graph.end < end) {
        chart.panels[0].zoomToIndexes(graph.start - 1, graph.end + 1);
    } else if (graph.end < end){
        chart.panels[0].zoomToIndexes(graph.start, graph.end + 1);
    } else {
        chart.panels[0].zoomToIndexes(graph.start -1, graph.end);
    }
}

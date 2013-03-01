// Handle Mousewheel Delta
function handle(delta) {
    if (delta.wheelDelta < 0) {
        zoomOut();
    } else {
        zoomIn();
    }
}

// Pan and Select Keybindings
Mousetrap.bind(['p'], function() {
    $('#rb2').prop('checked', true);
    $('#rb1').prop('checked', false);
    setPanSelect();
});

Mousetrap.bind(['s'], function() {
    $('#rb1').prop('checked', true);
    $('#rb2').prop('checked', false);
    setPanSelect();
});

// Arrow Key Navigation Keybindings
Mousetrap.bind(['up'], function() {
    event.preventDefault();
    zoomIn();
});

Mousetrap.bind(['down'], function() {
    event.preventDefault();
    zoomOut();
});

Mousetrap.bind(['left'], function() {
    var graph = chart.panels[0];
    event.preventDefault();
    if (graph.start > 0) {
        chart.panels[0].zoomToIndexes(graph.start - 5, graph.end - 5);
    }
    chart.scrollbarChart.zoom(chart.panels[0].start, chart.panels[0].end)
});

Mousetrap.bind(['right'], function() {
    var graph = chart.panels[0];
    event.preventDefault();
    if (graph.end + 2 < graph.chartData.length) {
        chart.panels[0].zoomToIndexes(graph.start + 5, graph.end + 5);
    }
    chart.scrollbarChart.zoom(chart.panels[0].start, chart.panels[0].end)
});

// Zoom Functions
function zoomIn() {
    var graph = chart.panels[0];
    var end = graph.chartData.length;
    if (graph.end - 2 > graph.start && graph.end < end) {
        chart.panels[0].zoomToIndexes(graph.start + 1, graph.end - 1);
    }
    chart.scrollbarChart.zoom(chart.panels[0].start, chart.panels[0].end)
}

function zoomOut() {
    var graph = chart.panels[0];
    var end = graph.chartData.length;
    if (graph.start > 0 && graph.end < end) {
        chart.panels[0].zoomToIndexes(graph.start - 1, graph.end + 1);
    } else if (graph.end < end){
        chart.panels[0].zoomToIndexes(graph.start, graph.end + 1);
    } else {
        chart.panels[0].zoomToIndexes(graph.start -1, graph.end);
    }
    chart.scrollbarChart.zoom(chart.panels[0].start, chart.panels[0].end)
}

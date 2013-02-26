//Pan and Select keybindings
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

//Search on Enter keybinding
$(document).keydown(function(e){
    if (e.keyCode == 13) {
        searchChart();
    }
});

//Arrow Key navigation control keybindings
Mousetrap.bind(['up'], function() {
    event.preventDefault();
    zoomIn();
});

Mousetrap.bind(['down'], function() {
    event.preventDefault();
    zoomOut();
});

Mousetrap.bind(['left'], function() {
    var graph = chart.panels[0].graphs[0];
    event.preventDefault();
    if (graph.start > 0) {
        chart.panels[0].zoomToIndexes(graph.start - 5, graph.end - 5);
    }
});

Mousetrap.bind(['right'], function() {
    var graph = chart.panels[0].graphs[0];
    event.preventDefault();
    if (graph.end + 2 < graph.data.length) {
        chart.panels[0].zoomToIndexes(graph.start + 5, graph.end + 5);
    }
});

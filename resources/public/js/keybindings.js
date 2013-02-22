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
    zoomIn();
});

Mousetrap.bind(['down'], function() {
    zoomOut();
});

Mousetrap.bind(['left'], function() {
    if (chart.startIndex > 0) {
        chart.zoomToIndexes(chart.startIndex - 5, chart.endIndex - 5);
    }
});

Mousetrap.bind(['right'], function() {
    var end = chart.categoryAxis.data.length;
    if (chart.endIndex -1 < end) {
        chart.zoomToIndexes(chart.startIndex + 5, chart.endIndex + 5);
    }
});

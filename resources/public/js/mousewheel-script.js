function wheel(event){
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
        delta = event.wheelDelta;
        if (window.opera) delta = -delta;
    } else if (event.detail) {
        delta = -event.detail/3;
    }
    if (delta)
        handle(delta);
    if (event.preventDefault)
        event.preventDefault();
    event.returnValue = false;
}

if (window.addEventListener)
    window.addEventListener('DOMMouseScroll', wheel, false);
    window.onmousewheel = document.onmousewheel = wheel;

    function handle(delta) {
        if (delta < 0) {
            zoomOut();
        } else {
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

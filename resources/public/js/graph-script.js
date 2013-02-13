var chart;
var chartData = [];
var chartCursor;

function createChart(){
    if ($(".active").attr('id') === "day"){
        generateDayChartData();
    } else if ($(".active").attr('id') === "accumulated"){
        generateAccumulatedChartData();
    }

    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.pathToImages = "/img/";
    chart.zoomOutButton = {
        backgroundColor: '#000000',
        backgroundAlpha: 0.15
    };
    chart.dataProvider = chartData;
    chart.categoryField = "date";
    chart.balloon.bulletSize = 5;

    // listen for "dataUpdated" event (fired when chart is rendered) and call zoomChart method when it happens
    chart.addListener("dataUpdated", zoomChart);
    // while loading hack
    var init = false;
    chart.addListener("zoomed", function (event) {
        if(!init) {
            $('#loader').hide();
            init = true;
        }
    });

    // AXES
    var categoryAxis = chart.categoryAxis;
    // our data is date-based, so we set parseDates to true
    categoryAxis.parseDates = true;
    // our data is daily, so we set minPeriod to DD
    categoryAxis.minPeriod = "DD";
    categoryAxis.dashLength = 1;
    categoryAxis.gridAlpha = 0.15;
    categoryAxis.autoGridCount = false;
    categoryAxis.gridCount = 20;
    categoryAxis.position = "top";
    categoryAxis.axisColor = "#CACACA";
    categoryAxis.dateFormats = [{
            period: "DD",
            format: "DD"
        }, {
            period: "WW",
            format: "MMM DD"
        }, {
            period: "MM",
            format: "MMM"
        }, {
            period: "YYYY",
            format: "YYYY"
        }];

    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0.15;
    valueAxis.title = "#";
    valueAxis.dashLength = 1;
    chart.addValueAxis(valueAxis);

    // GRAPH
    var graph = new AmCharts.AmGraph();
    graph.title = "Jobs Run Over Time";
    graph.labelText = "[[count]]";
    graph.valueField = "count";
    graph.bullet = "round";
    graph.bulletBorderColor = "#FFF";
    graph.bulletBorderThickness = 2;
    graph.lineThickness = 2;
    graph.lineColor = "#86bf84";
    graph.negativeLineColor = "#9574a8";
    graph.hideBulletsCount = 25;
    chart.addGraph(graph);

    // CURSOR
    chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorColor = '#9574a8';
    chartCursor.categoryBalloonColor = '#9574a8';
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to false if you want the cursor to work in "select" mode
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chartScrollbar.graph = graph;
    chartScrollbar.autoGridCount = true;
    chartScrollbar.scrollbarHeight = 25;
    chart.addChartScrollbar(chartScrollbar);

    // WRITE
    chart.write("chart");
};

function setPanSelect() {
    if (document.getElementById("rb1").checked) {
        chartCursor.pan = false;
        chartCursor.zoomable = true;
    } else {
        chartCursor.pan = true;
    }
    chart.validateNow();
}

function zoomChart() {
    chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
}

function reloadChart(){
    $("#chart").html("")
    createChart()
}

function toggleGraphs(e){
    if (e.id === "day"){
        $('#accumulated').removeClass('active');
        if (!(_.contains(e.className.split(/\s+/), "active"))) {
            $('#day').addClass('active');
            reloadChart();
        }
    } else if (e.id === "accumulated"){
        $('#day').removeClass('active');
        if (!(_.contains(e.className.split(/\s+/), "active"))) {
            $('#accumulated').addClass('active');
            reloadChart();
        }
    }
}

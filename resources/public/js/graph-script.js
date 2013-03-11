var chart;
var start;
var stockPanel;
var end;
var pages = [];
var chartDatas = [];

function updateChartData(type){
    var tempDatas = [];
    var i = 0;
    chartDatas.forEach(updateData);
    function updateData(el){
        tempDatas.push(generateChartData(type, pages[i]));
        i++;
    }
    chartDatas = tempDatas;
}

function generateChartData(type, job) {
    chartData = [];
    var response = graphDataGopher(type, job);

    if (response[0]) {
        var firstDate = response[0]['date'];
        $("#firstDate").html("" + firstDate);
        var daysBetween = Math.round(
                            Math.abs(firstDate - new Date()) / 8640000);
        var lastCount = 0;

        for (var i = 0; i <= daysBetween && response.length; i++) {
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + i);

            if (response[0]['date'].getTime() == newDate.getTime()) {
                chartData.push({
                    date: response[0]['date'],
                    count: response[0]['count']
                });
                lastCount = response[0]['count'];
                response = _.rest(response);

            } else if (type === "day") {
                chartData.push({
                    date: newDate,
                    count: 0
                });

            } else if ($(".active").attr('id') === "accumulated") {
                chartData.push({
                    date: newDate,
                    count: lastCount
                });
            }
        }
        return chartData;
    }
}

// Makes the AJAX calls to the appropriate endpoints
function graphDataGopher(type, job) {
    var response;
    var url;

    if(job == 'user') {
        url = "get-log-account-" + type + "/";
    }else if(job == '') {
        url = "get-log-jobs-" + type + "/";
    }else{
        url = "get-log-jobs-" + type + "/" + job;
    }

    request = $.ajax({
        url: url,
        async: false,
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            response = data;
            response.forEach(graphDataDateSculptor);
        },
        fail: function(){
            console.log("graphDataGopher data fail");
        }
    });
    return response;
}

// Processes data into usable javascript Date objects.
function graphDataDateSculptor(element) {
    var date = element.date.split("-");
    date = new Date(date);
    element['date'] = date;
}


function createChart() {
    chartDatas.push(generateChartData($(".active").attr('id'), ""));
    pages.push("");
    chart = new AmCharts.AmStockChart();
    chart.pathToImages = "img/";
    chart.balloon.borderColor = "#333";
    chart.balloon.color = "#333";
    chart.balloon.borderThickness = 1;
    chart.zoomOutOnDataUpdate = false;
    chart.colors =
        ["#84B586", "#D39BB1", "#DC9168", "#A39276", "#ABBAD2", "#73B7AE",
         "#AFB66B", "#DEB470", "#8F909B", "#D88F84", "#A78C52", "#C8B8A3"]


    // GRAPH ///////////////////////////////////////////
    var graph = new AmCharts.StockGraph();
    graph.title = "Main Four Jobs";
    graph.valueField = "count";
    graph.comparable = true;
    graph.compareField = "count";

    // STOCK PANEL
    stockPanel = new AmCharts.StockPanel();
    stockPanel.showCategoryAxis = true;
    stockPanel.categoryField = "date";
    stockPanel.addStockGraph(graph);
    stockPanel.recalculateToPercents = "never";
    stockPanel.stockLegend = new AmCharts.StockLegend();
    stockPanel.stockLegend.markerType = "circle";
    stockPanel.stockLegend.align = "center";

    chart.panels = [stockPanel];

    // OTHER SETTINGS ////////////////////////////////////
    var chartScrollbar = new AmCharts.ChartScrollbarSettings();
    chartScrollbar.graph = graph;
    chartScrollbar.autoGridCount = true;
    chartScrollbar.scrollbarHeight = 25;
    chartScrollbar.color = "#333";
    chartScrollbar.updateOnReleaseOnly = false;
    chart.chartScrollbarSettings = chartScrollbar;

    // LEGEND SETTINGS
    var legendSettings = new AmCharts.LegendSettings();
    legendSettings.marginTop = 5;
    chart.legendSettings = legendSettings

    // PANELS SETTINGS
    var panelSettings = new AmCharts.PanelsSettings();
    panelSettings.marginLeft = 50;
    panelSettings.marginRight = 10;
    panelSettings.marginTop = 5;
    chart.panelsSettings = panelSettings;

    // CURSOR
    chartCursor = chart.chartCursorSettings;
    chartCursor.bulletsEnabled = true;
    chartCursor.pan = true;
    chartCursor.cursorColor = '#9574a8';
    chartCursor.categoryBalloonColor = '#9574a8';
    chartCursor.cursorPosition = "mouse";

    // CATEGORY AXIS
    chartCategoryAxis = chart.categoryAxesSettings;
    chartCategoryAxis.gridAlpha = 0.15;
    chartCategoryAxis.axisAlpha = 0.35;
    chartCategoryAxis.axisColor = "#333";
    chartCategoryAxis.minPeriod = "DD";
    chartCategoryAxis.dashLength = 1;
    chartCategoryAxis.equalSpacing = true;
    chartCategoryAxis.autoGridCount = true;
    chartCategoryAxis.position = "bottom";
    chartCategoryAxis.dateFormats = [{
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

    // VALUE AXIS
    valueAxis = chart.valueAxesSettings;
    valueAxis.dashLength = 1;
    valueAxis.axisColor = "#333";
    valueAxis.axisAlpha = 0.35;
    valueAxis.inside = false;

    // WRITE
    if(chartDatas.length > 0){
        chartReset();
    } else {
        $('#chart').html($('#search').val() + ": No Data");
    }
}
function dataHandler(){
    var type = $(".active").attr('id')
    var datasets = [];
    var dataset
    for (var i = 0; i < chartDatas.length; i++) {
        dataset = new AmCharts.DataSet();
        if (pages[i] == "user"){
            dataset.title = "User Additions";
        }else{
            dataset.title = pages[i];
        }
        dataset.fieldMappings = [{
            fromField: "count",
            toField: "count"
        }];
        dataset.compared = true;
        dataset.dataProvider = chartDatas[i];
        dataset.categoryField = "date";
        datasets.push(dataset)
    }
    chart.dataSets = datasets;
    chart.mainDataSet = datasets[0];
}

function zoomChart() {
    var day = 86400000;
    if(! (start && end)){
        start = new Date(chartDatas[0][chartDatas[0].length - 1].date - (day * 10));
        end = new Date(chartDatas[0][chartDatas[0].length - 1].date);
        chart.zoom(start, end);
    } else {
        chart.zoom(start, end);
    }
    chart.validateNow();
}

function setPanSelect() {
    if ($("#rb1").prop("checked")) {
        chart.chartCursorSettings.pan = false;
    } else {
        chart.chartCursorSettings.pan = true;
    }
    chart.validateNow();
}

function toggleGraphs(e){
    start = new Date(chart.scrollbarChart.startTime);
    end = new Date(chart.scrollbarChart.endTime);
    if (e.id === "day"){
        $('#accumulated').removeClass('active');
        if (!(_.contains(e.className.split(/\s+/), "active"))) {
            $('#day').addClass('active');
            updateGraph();
        }
    } else if (e.id === "accumulated"){
        $('#day').removeClass('active');
        if (!(_.contains(e.className.split(/\s+/), "active"))) {
            $('#accumulated').addClass('active');
            updateGraph();
        }
    }
}

function addGraph(){
    var delta = _.difference($('#select').val(), pages)[0];
    console.log("Added " + delta);
    _.memoize(
        chartDatas.push(generateChartData($(".active").attr('id'), delta)));
    pages.push(delta);
    chartReset();
}

function removeGraph(){
    var deselected = _.union($('#select').val(), [""])[0];
    var delta = _.difference(pages, deselected);
    console.log("Removed " + delta);
    var index = _.indexOf(pages, delta);
    pages = _.without(pages, delta);
    chartDatas.splice(index, 1);
    chartReset();
}

function updateGraph(){
    updateChartData($(".active").attr('id'));
    chartReset();
}

function chartReset(){
    dataHandler();
    chart.write("chart");
    zoomChart();
    setPanSelect();
    chart.validateData();
}

function getChanged(){
    var selected = _.union($('#select').val(), [""]);
    if (selected.length > pages.length) {
        addGraph();
    } else {
        removeGraph();
    }
}

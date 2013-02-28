var chart;
var start;
var end;
var chartDatas = [];

function createChart(){
    generateChartData($(".active").attr('id'));
    createStockChart();
}

function generateChartData(type) {
    chartData = [];
    var response = graphDataGopher(type);

    if (response[0]) {
        var firstDate = response[0]['date'];
        $("#firstDate").html("" + firstDate);
        var daysBetween = Math.round(Math.abs(firstDate - new Date()) / 8640000);
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

            } else if (type === "accumulated") {
                chartData.push({
                    date: newDate,
                    count: lastCount
                });
            }
        }
        chartDatas.push(chartData);
    }
}

// Makes the AJAX calls to the appropriate endpoints
function graphDataGopher(type) {
    var response;
    var url;

    if($('option:selected').attr("data") == 'user') {
        url = "get-log-account-" + type + "/";
        page = "User Additions";
    }else{
        url = "get-log-jobs-" + type + "/";
        if ($('#search').val() != "" ) {
            url += $('#search').val();
            page = $('#search').val();
        }else{
            if ($('option:selected').attr("data")){
                url += $('option:selected').attr("data");
            }
            if ($('option:selected').text()) {
                page = $('option:selected').text();
            } else {
                page = "Main Four Jobs";
            }
        }
    }

    request = $.ajax({
        url: url,
        async: false,
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            response = data;
        }
    });

    graphDataDateSculptor(response);
    return response;
}

// Processes data into usable javascript Date objects.
function graphDataDateSculptor(data) {
    data.forEach(formatDate);

    function formatDate(element) {
        var date = element.date.split("-");
        date = new Date(date);
        element['date'] = date;
    }
}


function createStockChart() {
    chart = new AmCharts.AmStockChart();
    chart.pathToImages = "http://www.amcharts.com/lib/images/";

    // DATASETS //////////////////////////////////////////
    // create data sets first
    var datasets = [];
    var dataset
    for (var i = 0; i < chartDatas.length; i++) {
        dataset = new AmCharts.DataSet();
        dataset.title = (i + 1) + "th data set";
        dataset.fieldMappings = [{
            fromField: "count",
            toField: "count"
        }];
        dataset.compared = true;
        dataset.dataProvider = chartDatas[i];
        dataset.categoryField = "date";
        datasets.push(dataset)
    }

    // PANELS ///////////////////////////////////////////
    // first stock panel
    var stockPanel = new AmCharts.StockPanel();
    stockPanel.showCategoryAxis = true;

    // graph of first stock panel
    var graph = new AmCharts.StockGraph();
    graph.title = page;
    graph.labelText = "[[count]]";
    graph.valueField = "count";
    graph.bullet = "round";
    graph.bulletBorderColor = "#FFF";
    graph.bulletBorderThickness = 2;
    graph.lineThickness = 2;
    graph.lineColor = "#86bf84";
    graph.negativeLineColor = "#9574a8";
    graph.hideBulletsCount = 30;
    graph.valueField = "count";
    graph.comparable = true;
    graph.compareField = "count";

    // STOCK PANEL
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
    chart.chartScrollbarSettings = chartScrollbar;

    // CURSOR
    chartCursor = chart.chartCursorSettings;
    chartCursor.bulletsEnabled = true;
    chartCursor.pan = true;
    chartCursor.cursorColor = '#9574a8';
    chartCursor.categoryBalloonColor = '#9574a8';
    chartCursor.cursorPosition = "mouse";
    chartCursor.pan = true; // set it to false if you want the cursor to work in "select" mode

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

    // set data sets to the chart
    chart.dataSets = datasets;
    chart.mainDataSet = datasets[0]; //SET TO MAX LENGTH DATASET?

    // WRITE
    if(chartDatas[0].length > 0){
        chart.write("chart");
        zoomChart();
        setPanSelect();
    } else {
        alert($('#search').val() + ": No Data");
    }
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
}

function setPanSelect() {
    if ($("#rb1").prop("checked")) {
        chart.chartCursorSettings.pan = false;
        chart.chartCursorSettings.zoomable = true;
    } else {
        chart.chartCursorSettings.pan = true;
        chart.chartCursorSettings.zoomable = false;
    }
    chart.validateNow();
}

function toggleGraphs(e){
    start = new Date(chart.panels[0].graphs[0].categoryAxis.startTime);
    end = new Date(chart.panels[0].graphs[0].categoryAxis.endTime);
    chartDatas = _.initial(chartDatas);
    if (e.id === "day"){
        $('#accumulated').removeClass('active');
        if (!(_.contains(e.className.split(/\s+/), "active"))) {
            $('#day').addClass('active');
            createChart();
        }
    } else if (e.id === "accumulated"){
        $('#day').removeClass('active');
        if (!(_.contains(e.className.split(/\s+/), "active"))) {
            $('#accumulated').addClass('active');
            createChart();
        }
    }
}

function searchChart(){
    $(".chzn-select").val('').trigger("liszt:updated");
    createChart();
}

function selectChart(){
    $('#search').val("");
    createChart();
}

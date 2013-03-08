var chart;
var start;
var end;
var page = [];
var chartDatas = [];

function createChart(){
    generateChartData();
    createStockChart();
}

function generateChartData() {
    chartData = [];
    var response = graphDataGopher();

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

            } else if ($(".active").attr('id') === "day") {
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
        chartDatas.push(chartData);
    }
}

// Makes the AJAX calls to the appropriate endpoints
function graphDataGopher() {
    var response;
    var url;

    if($('option:selected').attr("value") == 'user') {
        url = "get-log-account-" + $(".active").attr('id') + "/";
        page.push("User Additions");
    }else{
        url = "get-log-jobs-" + $(".active").attr('id') + "/";
        var option = $('#select').val()
        if (option){
            var lastOption = _.last($('option:selected')).getAttribute("value")
            url += lastOption;
            page.push(lastOption);
        } else {
            page.push("Main Four Jobs");
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
    chart.pathToImages = "img/";
    chart.balloon.borderColor = "#333";
    chart.balloon.color = "#333";
    chart.balloon.borderThickness = 1;
    chart.zoomOutOnDataUpdate = false;
    chart.colors =
        ["#84B586", "#D39BB1", "#DC9168", "#A39276", "#ABBAD2", "#73B7AE",
         "#AFB66B", "#DEB470", "#8F909B", "#D88F84", "#A78C52", "#C8B8A3"]

    // DATASETS //////////////////////////////////////////
    // create data sets first
    var datasets = [];
    var dataset
    for (var i = 0; i < chartDatas.length; i++) {
        dataset = new AmCharts.DataSet();
        dataset.title = page[i];
        dataset.fieldMappings = [{
            fromField: "count",
            toField: "count"
        }];
        dataset.compared = true;
        dataset.dataProvider = chartDatas[i];
        dataset.categoryField = "date";
        datasets.push(dataset)
    }

    // GRAPH ///////////////////////////////////////////
    var graph = new AmCharts.StockGraph();
    graph.title = page;
    graph.labelText = "[[count]]";
    graph.bullet = "round";
    graph.bulletBorderColor = "#FFF";
    graph.bulletBorderThickness = 2;
    graph.compareGraphBalloonText = "[[count]]";
    graph.lineThickness = 2;
    graph.valueField = "count";
    graph.comparable = true;
    graph.compareField = "count";

    // STOCK PANEL
    var stockPanel = new AmCharts.StockPanel();
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
    panelSettings.marginLeft = 30;
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
    } else {
        chart.chartCursorSettings.pan = true;
    }
    chart.validateNow();
}

function toggleGraphs(e){
    start = new Date(chart.panels[0].graphs[0].categoryAxis.startTime);
    end = new Date(chart.panels[0].graphs[0].categoryAxis.endTime);
    chartDatas = _.initial(chartDatas);
    page =_.initial(page);
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

function selectChart(){
    var val = _.last($('option:selected')).getAttribute("value");
    if(_.indexOf(page, val) == -1) {
        createChart();
    }
}

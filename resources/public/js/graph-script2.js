var chart;
var start;
var end;
var dataSets = [];

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
        dataSets.push(chartData);
    }
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 500);
    firstDate.setHours(0, 0, 0, 0);

    var chartData1 = [];
    var chartData2 = [];
    var chartData3 = [];
    for (var i = 0; i < 500; i++) {
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        var a2 = Math.round(Math.random() * (1 + i));

        var a3 = Math.round(Math.random() * (1 + i));

        var a4 = Math.round(Math.random() * (1 + i));

        chartData1.push({
            date: newDate,
            count: a2,
        });
        chartData2.push({
            date: newDate,
            count: a3,
        });
        chartData3.push({
            date: newDate,
            count: a4,
        });
    }
    dataSets.push(chartData1);
    dataSets.push(chartData2);
    dataSets.push(chartData3);
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
            url += $('option:selected').attr("data");
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

function createChart(){
    generateChartData($(".active").attr('id'));
    createStockChart();
}

function createStockChart() {
    chart = new AmCharts.AmStockChart();
    chart.pathToImages = "http://www.amcharts.com/lib/images/";

    // DATASETS //////////////////////////////////////////
    // create data sets first
    var dataSet1 = new AmCharts.DataSet();
    dataSet1.title = "first data set";
    dataSet1.fieldMappings = [{
        fromField: "count",
        toField: "count"
    }];
    dataSet1.dataProvider = dataSets[0];
    dataSet1.categoryField = "date";

    var dataSet2 = new AmCharts.DataSet();
    dataSet2.title = "second data set";
    dataSet2.fieldMappings = [{
        fromField: "count",
        toField: "count"
    }];
    dataSet2.dataProvider = dataSets[1];
    dataSet2.categoryField = "date";

    var dataSet3 = new AmCharts.DataSet();
    dataSet3.title = "third data set";
    dataSet3.fieldMappings = [{
        fromField: "count",
        toField: "count"
    }];
    dataSet3.dataProvider = dataSets[2];
    dataSet3.categoryField = "date";

    var dataSet4 = new AmCharts.DataSet();
    dataSet4.title = "fourth data set";
    dataSet4.fieldMappings = [{
        fromField: "count",
        toField: "count"
    }];
    dataSet4.dataProvider = dataSets[3];
    dataSet4.categoryField = "date";

    // set data sets to the chart
    chart.dataSets = [dataSet1, dataSet2, dataSet3, dataSet4];
    chart.mainDataSet = dataSet1;

    // PANELS ///////////////////////////////////////////
    // first stock panel
    var stockPanel1 = new AmCharts.StockPanel();
    stockPanel1.showCategoryAxis = true;

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
    stockPanel1.addStockGraph(graph);
    stockPanel1.recalculateToPercents = "never";
    stockPanel1.stockLegend = new AmCharts.StockLegend();
    chart.panels = [stockPanel1];

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

    // PERIOD SELECTOR ///////////////////////////////////
   /* var periodSelector = new AmCharts.PeriodSelector();
    periodSelector.position = "left";
    periodSelector.periods = [{
        period: "DD",
        count: 10,
        label: "10 days"
    }, {
        period: "MM",
        selected: true,
        count: 1,
        label: "1 month"
    }, {
        period: "YYYY",
        count: 1,
        label: "1 year"
    }, {
        period: "YTD",
        label: "YTD"
    }, {
        period: "MAX",
        label: "MAX"
    }];
    chart.periodSelector = periodSelector;
    */

    // DATA SET SELECTOR
    var dataSetSelector = new AmCharts.DataSetSelector();
    dataSetSelector.position = "top";
    chart.dataSetSelector = dataSetSelector;

    // WRITE
    if(dataSets[0].length > 0){
        chart.write("chart");
        zoomChart();
        setPanSelect();
    } else {
        $('#chart').html("</br></br></br>"
                + "</br></br><h3 style='text-align: center;'>"
                + $('#search').val()
                + ": No Data</br></br>Try Again</h3>");
    }
}

function zoomChart() {
    var day = 86400000;
    if(! (start && end)){
        start = new Date(dataSets[0][dataSets[0].length - 1].date - (day * 10));
        end = new Date(dataSets[0][dataSets[0].length - 1].date);
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

var chart;
var chartData = [];
var page;
var startDate;
var endDate;

function createChart(){

    $("#chart").html("")
        generateChartData($(".active").attr('id'));

    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.pathToImages = "/analytics/img/";
    chart.zoomOutButton = {
        backgroundColor: '#000000',
        backgroundAlpha: 0.15
    };
    chart.dataProvider = chartData;
    chart.categoryField = "date";
    chart.balloon.bulletSize = 5;
    chart.balloon.borderColor = "#333";
    chart.balloon.color = "#333";
    chart.balloon.borderAlpha = 0.65;
    chart.balloon.borderThickness = 1;

    // listen for "dataUpdated" event (fired when chart is rendered) and call zoomChart method when it happens
    chart.zoomOutOnDataUpdate = false
        // while loading hack
        var init = false;
    chart.addListener("init", function (event) {
        if(!init) {
            $('#loader').hide();
            init = true;
        }
    });

    // AXES
    var categoryAxis = chart.categoryAxis;
    categoryAxis.parseDates = true;
    categoryAxis.gridAlpha = 0.15;
    categoryAxis.axisAlpha = 0.35;
    categoryAxis.axisColor = "#333";
    categoryAxis.groupToPeriods = "DD";
    categoryAxis.minPeriod = "DD";
    categoryAxis.dashLength = 1;
    categoryAxis.title = "Data for: " + page;
    categoryAxis.autoGridCount = true;
    categoryAxis.position = "top";
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

    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.dashLength = 1;
    valueAxis.axisColor = "#333";
    valueAxis.axisAlpha = 0.35;
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
    chartScrollbar.color = "#333";
    chart.addChartScrollbar(chartScrollbar);

    // WRITE
    if(chartData.length > 0){
        chart.write("chart");
        zoomChart();
        setPanSelect();
    } else {
        $('#chart').html("</br></br></br>"
                + "</br></br><h3 style='text-align: center;'>"
                + $('#search').val()
                + ": No Data</br></br>Try Again</h3>");
    }
};

function setPanSelect() {
    if ($("#rb1").prop("checked")) {
        chartCursor.pan = false;
        chartCursor.zoomable = true;
    } else {
        chartCursor.pan = true;
        chartCursor.zoomable = false;
    }
    chart.validateNow();
}

function zoomChart() {
    if (startDate && endDate){
        chart.zoomToDates(startDate, endDate);
    } else {
        chart.zoomToIndexes(chartData.length - 50, chartData.length - 1);
    }
}

function toggleGraphs(e){
    startDate = chart.startDate;
    endDate = chart.endDate;
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

function generateChartData(type){
    chartData = [];
    var response = graphDataGopher(type);
    if (response[0]){
        var firstDate = response[0]['date'];

        $("#firstDate").html("" + firstDate);

        if(type === "day") {
            var daysBetween = Math.round(Math.abs(firstDate - new Date())/8640000);
            for(var i = 0; i <= daysBetween; i++) {
                var newDate = new Date(firstDate);
                newDate.setDate(newDate.getDate() + i);
                for(var j = 0; j < response.length; j++){
                    if(response[j]['date'].getTime() == newDate.getTime()){
                        chartData.push({
                            date:  response[j]['date'],
                            count: response[j]['count']
                        });
                        response = _.rest(response);
                        break;
                    } else {
                        chartData.push({
                            date:  newDate,
                            count: 0
                        });
                    }
                }
            }
        }else if(type === "accumulated") {
            for(var j = 0; j < response.length; j++){
                chartData.push({
                    date:  response[j]['date'],
                    count: response[j]['count']
                });
                response = _.rest(response);
            }
        }
    }
}

// Makes the AJAX calls to the appropriate endpoints
function graphDataGopher(type){
    var response;
    var url;

    if($('option:selected').attr("data") == 'user') {
        url = "/analytics/get-log-account-" + type + "/";
        page = "User Additions";
    }else{
        url ="/analytics/get-log-jobs-" + type + "/";
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
function graphDataDateSculptor(data){
    data.forEach(formatDate);

    function formatDate(element) {
        var date = element.date.split("-");
        date = new Date(date);
        element['date'] = date;
    }
}

function searchChart(){
    $(".chzn-select").val('').trigger("liszt:updated");
    if (startDate > chart.startDate){
        startDate = chart.startDate;
        endDate = chart.endDate;
    }
    createChart();
}

function selectChart(){
    $('#search').val("");
    if (startDate > chart.startDate){
        startDate = chart.startDate;
        endDate = chart.endDate;
    }
    createChart();
}

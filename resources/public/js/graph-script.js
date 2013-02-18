var chart;
var chartData = [];
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
    // our data is date-based, so we set parseDates to true
    categoryAxis.parseDates = true;
    // our data is daily, so we set minPeriod to DD
    categoryAxis.groupToPeriods = "DD";
    categoryAxis.minPeriod = "DD";
    categoryAxis.dashLength = 1;
    categoryAxis.gridAlpha = 0.15;
    categoryAxis.autoGridCount = true;
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
    zoomChart();
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
    if (startDate && endDate){
    chart.zoomToDates(startDate, endDate);
    } else {
    chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
    }
}

function toggleGraphs(e){
    startDate = chart.startDate;
    endDate = chart.endDate;
    console.log(startDate);
    console.log(endDate);
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
    }else{
        $('#chart').html("</br></br></br></br></br><h3>"
                    + $('#search').val()
                    + ": No Data</br></br>Try Again</h3>");
    }
}

// Makes the AJAX calls to the appropriate endpoints
function graphDataGopher(type){
    var response;
    var url;

    if($('option:selected').attr("data") == 'user') {
        url = "/analytics/get-log-account-" + type + "/";
    }else{
        url ="/analytics/get-log-jobs-" + type + "/";
            if ($('#search').val() != "" ) {
                url += $('#search').val();
            }else{
                url += $('option:selected').attr("data");
            }
    }

    request = $.ajax({
        url: url,
        async: false,
        contentType: "application/json",
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
    startDate = chart.startDate;
    endDate = chart.endDate;
    createChart()
}

function selectChart(){
    $('#search').val("");
    startDate = chart.startDate;
    endDate = chart.endDate;
    createChart()
}

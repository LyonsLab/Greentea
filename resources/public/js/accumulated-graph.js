function generateAccumulatedChartData() {
    chartData = [];
    var response;
    var url;

    if($('option:selected').attr("data") == 'user') {
        url = "/analytics/get-log-account-accumulated/";
    }else{
        url ="/analytics/get-log-jobs-accumulated/" + $('option:selected').attr("data");
    }

    request = $.ajax({
        url: url,
        async: false,
        contentType: "application/json",
        success: function(data){
            response = data;
        }
    });

    response.forEach(formatDate);

    function formatDate (element) {
        var d = new Date(element['date'] * 1).toDateString();
        d = new Date(d);
        element['date'] = d;
    }

    var firstDate = response[0]['date'];

    $("#firstDate").html("" + firstDate);

    for(var j = 0; j < response.length; j++){
        chartData.push({
            date:  response[j]['date'],
            count: response[j]['count']
        });
        response = _.rest(response);
    }
}

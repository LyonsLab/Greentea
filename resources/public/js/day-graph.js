function generateDayChartData() {
    chartData = [];
    var response;
    var url;

    if($('option:selected').attr("data") == 'user') {
        url = "/get-log-account-day/";
    }else{
        url ="/get-log-jobs-day/" + $('option:selected').attr("data");
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
    $("#day").addClass("active");

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
}

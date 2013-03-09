function init(){
    $('.chzn-select').chosen({ no_results_text: 'No results matched'});
    createSelect();
    selectChart();
}

function createSelect() {
    var response;
    var ajax = $.ajax({
        async: false,
        url: "get-log-page-types/" ,
        datatype: "json",
        success: function(data){
            response = data;
        }})
         .done(function() { getOptsSuccess(response); })
         .fail(function() { dataFail(); });
}

function getOptsSuccess(data) {
    var newOpts =
        "<option value='' selected>Main Four Jobs</option>" +
        "<option value='user'>User Additions</option>";

    data.forEach(parseData);
    function parseData(element) {
        newOpts += "<option value='" + element.page + "'>"
                    + element.page + "</option>";
    }

    $('#select').html(newOpts);
    $("#select").trigger("liszt:updated");
}

function dataFail() {
    $('#chart').html("</br></br></br>"
        + "</br></br><h3 style='text-align: center;'>"
        + "No Page Data. There must be something wrong with the database"
        + "connection.</br>Please try again later.</h3>");
}

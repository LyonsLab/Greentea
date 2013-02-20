function createSelect() {
    pageTypeDataGopher();
}

function pageTypeDataGopher() {
    var response;
    var ajax = $.ajax({
        url: "/analytics/get-log-page-types/" ,
        datatype: "json",
        success: function(data){
            response = data;
        }})
         .done(function() { getOptsSuccess(response); })
         .fail(function() { dataFail(); });
}

function getOptsSuccess(data) {
    var newOpts =
        "<option data=''></option>" +
        "<option data=''>Main Four Jobs</option>" +
        "<option data='user'>User Additions</option>";

    data.forEach(parseData);
    function parseData(element) {
        newOpts += "<option data='" + element.page + "'>" + element.page + "</option>";
    }

    $('#select').html(newOpts);
    $("#select").trigger("liszt:updated");
}

function dataFail() {
    console.log("Failure to receive data");
}

function autoComplete(){
    autocompleteDataGopher();
}

function autocompleteDataGopher() {
    var response;
    var ajax = $.ajax({
        url: "/analytics/get-log-page-types/" + $('#search').val(),
        datatype: "json",
        success: function(data){
            response = data;
        }})
         .done(function() { autocompleteSuccess(response); })
         .fail(function() { dataFail(); });
}

function autocompleteSuccess(data){
    var acArray = [];
    data.forEach(parseData);
    function parseData(element) {
        acArray.push(element.page);
    }
    $("#search").autocomplete({
        source: acArray,
        minLength: 0,
        delay: 0
    });
}

$(document).keydown(function(e){
    if (e.keyCode == 13) {
        searchChart();
    }
});

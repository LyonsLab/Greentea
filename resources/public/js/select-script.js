function init(){
    $('.chzn-select').chosen({ no_results_text: 'No results matched'});
    createSelect();
    createChart();
}

function createSelect() {
    pageTypeDataGopher();
}

function pageTypeDataGopher() {
    var response;
    var ajax = $.ajax({
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
    $('#chart').html("</br></br></br>"
            + "</br></br><h3 style='text-align: center;'>"
            + $('#search').val()
            + ": No Data</br></br>Try Again</h3>");
}

function autoComplete(){
    autocompleteDataGopher();
}

function autocompleteDataGopher() {
    var response;
    var ajax = $.ajax({
        url: "get-log-page-types/" + $('#search').val(),
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

Mousetrap.bind(['p'], function() {
    $('#rb2').prop('checked', true);
    $('#rb1').prop('checked', false);
    setPanSelect();
});

Mousetrap.bind(['s'], function() {
    $('#rb1').prop('checked', true);
    $('#rb2').prop('checked', false);
    setPanSelect();
});

$(document).keydown(function(e){
    if (e.keyCode == 13) {
        searchChart();
    }
});

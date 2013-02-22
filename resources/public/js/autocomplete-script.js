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

function dataFail() {
    $('#chart').html("</br></br></br>"
        + "</br></br><h3 style='text-align: center;'>"
        + $('#search').val()
        + ": No Data</br></br>Try Again</h3>");
}

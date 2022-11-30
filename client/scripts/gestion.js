$(function () {

});

function chargergestion(){
    TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    $.ajax({
        url: "/ventes",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
        },
        success: function (result) {
            console.log(result);
            $.each(result, function (key, value) {
                console.log(value);
                //item = item_to_html(value)
                //console.log(item);
                //$('#list_items').append(item);
            });
        }
    });
}

function chargerCommandeActive(input){
    input.style.backgroundColor="#78b0ff"
    console.log(input)
}



$(function () {

});

function chargerproduit(){
        $.ajax({
            url: "/produits",
            success: function (result) {
                console.log(result);
                $.each(result, function (key, value) {
                    console.log(value);
                    item = item_to_html(value)
                    //console.log(item);
                    $('#list_items').append(item);
                });
            }
        });
    chargerpanier();

}
function rechargerproduit(){
    $.ajax({
        url: "/produits",
        success: function (result) {
            //console.log(result);
            $('#list_items').empty();
            $.each(result, function (key, value) {
                console.log(value);
                item = item_to_html(value)
                //console.log(item);
                $('#list_items').append(item);
            });
        }
    });

}


function item_to_html(item){
    item_card = $('<div></div>')
        .addClass('card mb-4 rounded-3 shadow-sm');
    item_head = $('<div></div>')
        .addClass('card-header py-3')
        .append('<h4 class="my-0 fw-normal">' + item.nom + '</h4>');
    item_detail = $('<ul></ul>')
        .addClass('list-unstyled mt-3 mb-4')
        .append('<li>Qte dispo :' + item.qte_inventaire +'</li>')
        .append('<li>Categorie. :' + item.categorie.nom +'</li>');
    item_body = $('<div></div>')
        .addClass('card-body')
        .append(' <h1 class="card-title text-center"> $' + item.prix +'</h1>')
        .append(item_detail)
        .append('<p style="font-size: 12px">' + item.description + '</p>')
        .append('<p class="w-100 display-6 text-center">\n'+
                '<button type="button" class="btn btn-primary position-relative" onclick="add_item('+item.id+')">\n' +
                '<i class="bi bi-cart-plus"></i>\n' +
                '</button></p>');

    item_card.append(item_head).append(item_body);
    return $('<div></div>').addClass('col-md-4') .append(item_card);
}

function add_item(id_item){
    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        //url: "/clients/"+ID_CLIENT+"/panier",
        url: "/clients/1/panier",
        method:"POST",
        data: {"idProduit": id_item, "quantite": 1},
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {
            $('#item_counter').text(result.items.length)
            rechargerpanier();
        }
    });
}

function remove_item(id_item){
    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        //url: "/clients/"+ID_CLIENT+"/panier/IdItem",
        url: "/clients/1/panier/"+id_item,
        method:"DELETE",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {
            $('#item_counter').text(result.items.length)
            rechargerpanier();
        }
    });
}

function chargerpanier(){
    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        url: "/clients/1/panier",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function (result) {
            Total = total_to_html(result.valeur)
            $('#cart_items').empty();
            $('#cart_total_line').empty();
            $.each(result.items, function (key, value) {
                item = cart_to_html(value)
                $('#cart_items').append(item);
            });
            $('#cart_total_line').append(Total);
        }
    });
}

function rechargerpanier(){
    chargerpanier();
    rechargerproduit();
}

function cart_to_html(item){
    item_tab = $('<tr></tr>')
        .append('<td><button type="button" class="btn btn-danger position-relative m-0 p-0 " onclick="remove_item('+ item.id +')">&nbsp<i class="bi bi-trash-fill" style="font-size: 13px"></i>&nbsp</button></td>')
        .append('<td>' + item.nomProduit + '</td>')
        .append('<td>' + item.prix + '</td>')
        .append('<td>' + item.quantite + '</td>')
        .append('<td>' + (item.quantite*item.prix).toFixed(2) + '</td>');
    return item_tab;
}
function total_to_html(total){
    item_tab = $('<tr></tr>')
        .append('<th>Total</th>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<th>'+total.toFixed(2)+'</th>')
    return item_tab;
}





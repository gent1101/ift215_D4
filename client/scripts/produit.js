$(function () {

});

function chargerproduit(){
        $.ajax({
            url: "/produits",
            success: function (result) {
                //console.log(result);
                $.each(result, function (key, value) {
                    //console.log(value);
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
                //console.log(value);
                item = item_to_html(value)
                //console.log(item);
                $('#list_items').append(item);
            });
        }
    });

}


function item_to_html(item){
    if(item.qte_inventaire>1){
        item_get = $('<div></div>')
            .append('<h6>&nbsp</h6>')
            .append('<h6>Stock : ' + (item.qte_inventaire-1) +'</h6>')
            .append('<div class="w-100 display-6 text-center">\n'+
                '<button type="button" class="btn btn-primary position-relative" onclick="add_item('+item.id+')" style="font-size: 12px">\n' +
                'Ajouter au panier <i class="bi bi-cart-plus" ></i>\n' +
                '</button></div>');
    }
    else{
        item_get = $('<div class="py-4 text-center"></div>')
            .append('<h5>Out of stock</h5>')
    }

    item_card = $('<div></div>')
        .addClass('card mb-4 rounded-3 shadow-sm');
    item_picture = $('<div></div>')
        .addClass(' rounded-3 p-0 text-center')
        .append('<img src="images/'+item.id+'.jpg" alt="Image de '+item.nom+'"  class=" rounded-3 my-0 fw-normal" style="height: 120px;"/>');
    item_head = $('<div></div>')
        .addClass('card-header py-3')
        .append('<h4 class="my-0 fw-normal">' + item.nom + '</h4>');

    item_body = $('<div></div>')
        .addClass('card-body')
        .append('<h4 class="card-title my-0 fw-normal">' + item.nom + '</h4>')
        .append('<h4 class=""> $' + item.prix +'</h4>')
        .append('<h7>Categorie : ' + item.categorie.nom +'</h7>')
        .append('<p style="font-size: 11px">' + item.description + '</p>')
        .append(item_get);


    item_card.append(item_picture).append(item_body);
    return $('<div></div>').addClass('col-md-4').append(item_card);
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
            if(result.valeur == 0)
                document.getElementById("cart_body").style.display="none";
            Total = total_to_html(result.valeur)
            $('#cart_items').empty();
            $('#cart_total_line').empty();
            $.each(result.items, function (key, value) {
                document.getElementById("cart_body").style.display="block";
                $.ajax({
                    url: "/produits/"+value.idProduit,
                    success: function (Produit){
                        item = cart_to_html(value, Produit)
                        $('#cart_items').append(item);
                        $('#cart_items').append('<tr style="border:1px solid #cccccc"></tr>');
                    }
                })
            });
            $('#cart_total_line').append(Total);
        }
    });
}

function rechargerpanier(){
    chargerpanier();
    rechargerproduit();
}

function changerquantitepanier(item_id,val,quantite,max){
    if(val>max) {
        quantity = max-quantite;
    }
    else
        quantity = val-quantite;
    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        //url: "/clients/"+ID_CLIENT+"/panier/id_item",
        url: "/clients/1/panier/"+ item_id,
        method:"PUT",
        data: {"quantite": quantity},
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {

            $('#item_counter').text(result.items.length)
            rechargerpanier();

        }
    });


}

function cart_to_html(item,Produit){
    maximum = (item.quantite + Produit.qte_inventaire - 1)
    item_tab = $('<tr></tr>')
        .append('<td><button type="button" class="btn btn-danger position-relative m-0 p-0 " onclick="remove_item('+ item.id +')">&nbsp<i class="bi bi-trash-fill" style="font-size: 13px"></i>&nbsp</button></td>')
        .append('<td>' + item.nomProduit + '</td>')
        .append('<td>' + item.prix + '</td>')
        .append('<td><input type="number" id="quantity" name="quantity" value="' + item.quantite + '" min="1" max="'+ (item.quantite + Produit.qte_inventaire - 1) +'" style="width: 80%" onchange="changerquantitepanier('+item.id+',value,'+item.quantite+','+maximum+')"></td>')
        .append('<td>' + (item.quantite*item.prix).toFixed(2) + '</td>');
    return (item_tab);
}

function total_to_html(total) {
    item_tab = $('<tr></tr>')
        .append('<th>Total</th>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<th id="total_value">' + total.toFixed(2) + '</th>')
    return item_tab;
}

function commander_on(){
    document.getElementById("commande_popup").style.display="block";
}

function commander_off(){
    document.getElementById("commande_popup").style.display="none";
}
function commander_annuler(){
    conf_annul_on();
}

function commander_cancel(){
    conf_annul_off();
    commander_off()
}

function conf_annul_on(){
    document.getElementById("conf_annul").style.display="block";
}

function conf_annul_off(){
    document.getElementById("conf_annul").style.display="none";

}

function conf_com_on(){
    commander_off()
    chargerpanier_conf()
    document.getElementById("confirmation_popup").style.display="block";
}

function conf_com_off(){
    document.getElementById("confirmation_popup").style.display="none";

}

function chargerpanier_conf(){
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("date_com").innerHTML = m + "/" + d + "/" + y;

    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        url: "/clients/1/panier",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function (result) {
            Total = total_to_html_conf(result.valeur)
            $('#cart_items_conf').empty();
            $('#cart_total_line_conf').empty();
            $.each(result.items, function (key, value) {
                item = cart_to_html(value)
                $('#cart_items_conf').append(item);
                $('#cart_items_conf').append('<tr style="border:1px solid #cccccc"></tr>');

            });
            $('#cart_total_line_conf').append(Total);
        }
    });
}

function cart_to_html(item){
    item_tab = $('<tr></tr>')
        .append('<td>' + item.nomProduit + '</td>')
        .append('<td>' + item.prix + '</td>')
        .append('<td>'+ item.quantite +'</td>')
        .append('<td>' + (item.quantite*item.prix).toFixed(2) + '</td>');
    return (item_tab);
}

function total_to_html_conf(total) {
    item_tab = $('<tr></tr>')
        .append('<th>Total</th>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<th id="total_value">' + total.toFixed(2) + '</th>')
    return item_tab;
}



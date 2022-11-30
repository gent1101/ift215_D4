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
                vente = vente_to_html_list(value);
                $('#vente_list').append(vente);
            });
        }
    });
}

function vente_to_html_list(vente){
    vente_tab = $('<tr id="ligne_cmd_'+vente.id+'" onclick="chargerCommandeActive(this)"></tr>')
        .addClass("clickable-row")
        .append('<td id="id_cmd_'+vente.id+'">' + vente.id + '</td>')
        .append('<td id="date_cmd_'+vente.id+'">' + vente.date.slice(0,10) + '</td>')
        .append('<td id="status_cmd_'+vente.id+'">'+ vente.status +'</td>')
    return (vente_tab);
}


function chargerCommandeActive(ligne){
    //ligne.style.backgroundColor="#78b0ff"
    //console.log(ligne.id.slice(10,))
    cmd_en_cours(ligne.id.slice(10,));
}

function cmd_en_cours(vente_id){
    var ancienne_cmd = document.getElementById('num_com_encour').textContent
    if(ancienne_cmd != '#')
        document.getElementById('ligne_cmd_'+ancienne_cmd.slice(1,)).style.backgroundColor="white"
    document.getElementById('ligne_cmd_'+vente_id).style.backgroundColor="#78b0ff"

    $('#num_com_encour').empty();
    $('#adresse_com_encour').empty();
    $('#date_com_encour').empty();
    $('#status_com_encour').empty();
    $('#cart_items_gestion').empty();

    TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    $.ajax({
        url: "/ventes/"+vente_id,
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
        },
        success: function (vente) {

            $.ajax({
                url: "/clients/"+vente.idClient,
                beforeSend: function (xhr){
                    xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
                },
                success: function (Client) {
                    document.getElementById('cart_table_gest').style.display="table"

                    $('#num_com_encour').append('#'+vente_id);
                    $('#adresse_com_encour').append(Client.adresse);
                    $('#date_com_encour').append(vente.date.slice(0,10));
                    $('#status_com_encour').append(vente.status);

                    $.each(vente.produits, function (key, produit){
                        item = panier_to_html_gestion(produit);
                        $('#cart_items_gestion').append(item);
                    });

                }
            });

        }
    });

}

function vider_cmd_en_cours(){
    var ancienne_cmd = document.getElementById('num_com_encour').textContent
    if(ancienne_cmd != '#')
        document.getElementById('ligne_cmd_'+ancienne_cmd.slice(1,)).style.backgroundColor="white"
    $('#num_com_encour').empty();
    $('#adresse_com_encour').empty();
    $('#date_com_encour').empty();
    $('#status_com_encour').empty();
    $('#cart_items_gestion').empty();
    document.getElementById('cart_table_gest').style.display="none"
}

function panier_to_html_gestion(item){
    item_tab = $('<tr></tr>')
        .append('<td>' + item.idProduit + '</td>')
        .append('<td>' + item.nomProduit + '</td>')
        .append('<td>'+ item.quantite +'</td>')
        .append('<td><input type="checkbox"></td>');
    return (item_tab);
}





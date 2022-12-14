
$(function () {

});

//Ajoute l'item au panier
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
            rechargerpanier();
        }
    });
}

//Transformation de l'information d'un item en code html pour le panier
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

//Transformation de l'info du panier en code pour la confirmation de commande
function cart_to_html_conf(item){
    item_tab = $('<tr></tr>')
        .append('<td>' + item.nomProduit + '</td>')
        .append('<td>' + item.prix + '</td>')
        .append('<td>'+ item.quantite +'</td>')
        .append('<td>' + (item.quantite*item.prix).toFixed(2) + '</td>');
    return (item_tab);
}


//Changer la quantité du produit dans le panier
function changerquantitepanier(item_id,val,quantite,max){
    //Vérifier si la quantité voulu est valide
    if(val>max) {
        quantity = max-quantite;
    }
    //Si elle est trop grande est est limitée au maximum possible
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
            rechargerpanier();

        }
    });
}

//Charger et afficher la confirmation que la commande est faite
function charger_conf_com(){
    //cacher la fenettre de commande
    //viderpanier()
    passercommander()
    commander_off()

    //Date de la commande (aujourd'hui)
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("date_com").innerHTML = m + "/" + d + "/" + y;

    //Charger les information de la commande
    var adresse = document.getElementById("adresse").value + ", " + document.getElementById("ville").value + ", " + document.getElementById("province").value + ", " + document.getElementById("CP").value
    var num_com ="#"+"00000001"
    var email = document.getElementById("email1").value

    document.getElementById("adresse_conf").innerHTML = adresse;
    document.getElementById("num_com_conf").innerHTML = num_com;
    document.getElementById("courriel_conf").innerHTML = email;

    //panier
    chargerpanier_conf()

    //afficher la fenettre
    document.getElementById("confirmation_popup").style.display="block";
}

//Charge et affiche le panier
function chargerpanier(){
    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        url: "/clients/1/panier",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function (result) {
            //Afficher le nombre d'item dans la bulle
            $('#item_counter').text(result.items.length)

            //Si le panier est vide, ne pas l'afficher
            if(result.valeur == 0)
                document.getElementById("cart_body").style.display="none";

            //Vide l'affichage du panier
            $('#cart_items').empty();
            $('#cart_total_line').empty();

            Total = total_to_html(result.valeur)
            $.each(result.items, function (key, value) {
                //S'il y a des items à afficher, rendre le panier visible et les afficher
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

//Charger et écrire le panier pour la confirmatiin de la commande
function chargerpanier_conf(){
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
                item = cart_to_html_conf(value)
                $('#cart_items_conf').append(item);
                $('#cart_items_conf').append('<tr style="border:1px solid #cccccc"></tr>');

            });
            $('#cart_total_line_conf').append(Total);
        }
    });
}


//Charge et affiche la liste des produits
function chargerproduit(){
    $.ajax({
        url: "/produits",
        success: function (result) {
            $.each(result, function (key, value) {
                item = item_to_html(value)
                $('#list_items').append(item);
            });
        }
    });
    chargerpanier();

}

//Demande la confirmation d'annuler la commande
function commander_annuler(){
    conf_annul_on();
}

//Annuler la commande
function commander_cancel(){
    conf_annul_off();
    commander_off()
}

//Cacher la fenêtre d'info pour la livraison
function commander_off(){
    document.getElementById("commande_popup").style.display="none";
}

//Afficher la fenêtre de demande d'information pour la commande
function commander_on(){
    var today = new Date();
    var mm = today.getMonth() + 1; //Janvier = 0
    var yyyy = today.getFullYear();

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy+'-'+mm
    document.getElementById("card_date").min = today;
    document.getElementById("commande_popup").style.display="block";
}


//Verifier que toute l'information est en ordre et passer la commande
function confirmation_verification(){
    var adresse = document.getElementById("adresse")
    var ville = document.getElementById("ville")
    var province = document.getElementById("province")
    var code_postal = document.getElementById("CP")
    var card_num = document.getElementById("card_num")
    var card_name = document.getElementById("card_name")
    var exp = document.getElementById("card_date")
    var CVC = document.getElementById("CVC")
    var email1 = document.getElementById("email1")
    var email2 = document.getElementById("email2")


    var adresse_empty = isEmpty(adresse)
    var ville_empty = isEmpty(ville)
    var province_empty = isEmpty(province)
    var cp_empty = isEmpty(code_postal)
    var card_name_empty = isEmpty(card_name)
    var card_num_empty = isEmpty(card_num)
    var exp_empty = isEmpty(exp)
    var CVC_empty = isEmpty(CVC)
    var email1_empty = isEmpty(email1)
    var email2_empty = isEmpty(email2)

    var cp_bad = CPisBad(code_postal)
    var card_num_bad = NumIsBad(card_num)
    var CVC_bad = NumIsBad(CVC)

    var email1_bad = emailIsBad(email1)
    var email2_bad = emailIsBad(email2)
    var notSameEmails = true;

    if(!email1_bad && !email2_bad) {
        console.log("check emails")
        notSameEmails = (email1.value != email2.value);
        if(notSameEmails){
            email2.style.backgroundColor = "#ffc6c6"
            alert("La confirmation du courriel ne correspond pas")
        }

    }


    //Si un n'est pas correct, on ne poursuit pas
    if(adresse_empty || ville_empty || province_empty || cp_empty || cp_bad || card_name_empty || card_num_bad || exp_empty || CVC_bad || email1_bad || email2_bad || notSameEmails || card_num_empty || email1_empty || email2_empty || CVC_empty)
        return;

    //Sinon on passe la commande
    else
        charger_conf_com()
}


//Cacher la demande de confirmation d'annulation
function conf_annul_off(){
    document.getElementById("conf_annul").style.display="none";

}

//Afficher la demande de confirmation d'annulation
function conf_annul_on(){
    document.getElementById("conf_annul").style.display="block";
}

//Cacher la confirmation de la commande
function conf_com_off(){
    document.getElementById("confirmation_popup").style.display="none";

}


//Vérifier si le email est du bon format
function emailIsBad(input){
    input.value = input.value.replaceAll(' ', '');
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(input.value == '' || input.value == 'exemple@courriel.com') {
        if(input.id == 'email1'){
            input.value = 'exemple@courriel.com'
            input.style.color = "grey"
        }
        input.style.backgroundColor = "#ffc6c6"
        return true
    }
    if(!input.value.match(mailformat)) {
        input.style.backgroundColor = "#ffc6c6"
        alert(input.name + " n'est pas valide")
        return true;
    }
    else
        return false;
}

//Retirer l'exemple pendant l'écriture
function aideExemple(input){
    switch (input.value) {
        case '123 rue exemple':
        case 'entrer le nom de votre ville':
        case 'A1B 2C3':
        case 'entrer le nom comme indiqué sur la carte':
        case 'entrer les 16 chiffres de votre carte':
        case 'exemple@courriel.com':
            input.style.color = "black"
            input.value = ''
    }
}

//Vérifier si le champ est vide ou inchangé, si oui le mettre rouge
function isEmpty(input){
    switch (input.value) {
        case '123 rue exemple':
        case 'entrer le nom de votre ville':
        case 'A1B 2C3':
        case 'entrer le nom comme indiqué sur la carte':
        case 'entrer les 16 chiffres de votre carte':
        case 'exemple@courriel.com':
            input.style.backgroundColor = "#ffc6c6"
            return true
    }
    if(input.value == '') {
        input.style.backgroundColor = "#ffc6c6"
        return true
    }
    else{
        input.style.backgroundColor = "white"
        return false
    }
}


//Transforme l'information d'un produit en code html pour l'afficher dans la liste de produits en vente
function item_to_html(item){
    //Si il y en a en stock, afficher avec le boutton d'ajout au panier
    if(item.qte_inventaire>1){
        item_get = $('<div></div>')
            .append('<h6>&nbsp</h6>')
            .append('<h6>Stock : ' + (item.qte_inventaire-1) +'</h6>')
            .append('<div class="w-100 display-6 text-center">\n'+
                '<button type="button" class="btn btn-primary position-relative" onclick="add_item('+item.id+')" style="font-size: 12px">\n' +
                'Ajouter au panier <i class="bi bi-cart-plus" ></i>\n' +
                '</button></div>');
    }
    //Sinon l'afficher avec mention "out of stock"
    else{
        item_get = $('<div class="py-4 text-center"></div>')
            .append('<h5>Out of stock</h5>')
    }
    //Construction de la carte du produit
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



//Vérifier que l'entrée numérique n'est que des chiffres et a assez de caractères
function NumIsBad(input){

    if(input.value.length != input.maxLength){
        input.style.backgroundColor = "#ffc6c6"
        alert(input.name+" est trop court")
        return true;
    }
    else
        return false
}

function CPisBad(input){
    if(input.value.length != 7){
        input.style.backgroundColor = "#ffc6c6"
        alert(input.name+" est trop court")
        return true;
    }
}
//Transforme le panier en vente
function passercommander(){
    //TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        url: "/ventes",
        method:"POST",
        data:{"idClient":1},
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function (result) {
            console.log(result);
        }
    });
}



//Rafraichir le panier
function rechargerpanier(){
    chargerpanier();
    rechargerproduit();
}

//recharge et affiche la liste des produits
function rechargerproduit(){
    $.ajax({
        url: "/produits",
        success: function (result) {
            $('#list_items').empty();
            $.each(result, function (key, value) {
                item = item_to_html(value)
                $('#list_items').append(item);
            });
        }
    });

}



//Enleve l'item du panier
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
            rechargerpanier();
        }
    });
}


//Transformation du motant total du panier en code html pour le tableau à afficher
function total_to_html(total) {
    item_tab = $('<tr></tr>')
        .append('<th>Total</th>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<th id="total_value">' + total.toFixed(2) + '</th>')
    return item_tab;
}

//Transformation du montant total en code pour la confirmation de commande
function total_to_html_conf(total) {
    item_tab = $('<tr></tr>')
        .append('<th>Total</th>')
        .append('<td></td>')
        .append('<td></td>')
        .append('<th id="total_value">' + total.toFixed(2) + '</th>')
    return item_tab;
}


//Vide le panier (PAS UTILISÉE)
function viderpanier(){
    TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
    $.ajax({
        url: "/clients/1/panier",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function (result) {
            $.each(result.items, function (key, value) {
                remove_item(value.id)
            });
            rechargerpanier();
        }
    });
}



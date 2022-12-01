$(function () {

});


//Annuler la vente en cours de traitement
function annuler_vente(){
    conf_annul_gest_off()
    TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    var cmd = document.getElementById('num_com_encour').textContent.slice(1,);
    var allchecked = true;
    $.ajax({
        url: "/ventes/"+cmd,
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
        },
        success: function (vente) {
            $.ajax({
                url: "/ventes/"+vente.id,
                methode:"DELETE",
                beforeSend: function (xhr){
                    xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
                },
                success: function (annulation) {
                    console.log(annulation)
                    document.getElementById('button_status').className = "btn btn-secondary position-absolute m-2 px-2 py-1"
                    document.getElementById('button_status').onclick = function onclick(event) {}
                    $('#button_status').empty();

                    vider_cmd_en_cours();
                    rechargergestion();
                }
            });
        }
    });
}

//Changer le status d'une commande
function changestatus(cmd, nouveau_status){
    TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    console.log(cmd.status)
    $.ajax({
        url: "/ventes/"+cmd.id,
        methode:"PUT",
        data: {"status" : nouveau_status},
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
        },
        success: function (vente) {
            //Si le status est changé, réinitialiser la zone de commande en cours de traitement
            document.getElementById('button_status').className = "btn btn-secondary position-absolute m-2 px-2 py-1"
            document.getElementById('button_status').onclick = function onclick(event) {}
            $('#button_status').empty();

            vider_cmd_en_cours();
            rechargergestion();
        }
    });
}


//Appel la fonction d'Affichage de la commande en cours en utilisant la partie utile du id de ligne
function chargerCommandeActive(ligne){
    cmd_en_cours(ligne.id.slice(10,));
}

//Charge la liste des ventes et l'écrit dans l'encadré
function chargergestion(){
    TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    $.ajax({
        url: "/ventes",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
        },
        success: function (result) {
            //Pour chaque vente trouvée, l'écrire dans le tableau
            $.each(result, function (key, value) {
                vente = vente_to_html_list(value);
                $('#vente_list').append(vente);
            });
        }
    });
}


//Vérifier si tous les produits sont coché comme assemblé
function check_assemblage(){
    //charger les détails de la vente
    var cmd = document.getElementById('num_com_encour').textContent.slice(1,);
    var allchecked = true;
    TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    $.ajax({
        url: "/ventes/"+cmd,
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
        },
        success: function (vente) {
            //Vérifier chaque case a coché
            var nb_prod = vente.produits.length
            for(let i = 0; i<nb_prod; i++){
                if(document.querySelector('#check_prod_'+i).checked == false)
                    allchecked = false;
            }

            //Si toutes cochées, rendre le boutton de confirmation utilisable
            if(allchecked){
                document.getElementById('button_status').className = "btn btn-primary position-absolute m-2 px-2 py-1"
                document.getElementById('button_status').onclick = function onclick(event) { changestatus(vente, 'prepare') }
            }
            //Sinon rendre le boutton de confirmation inutilisable
            else{
                document.getElementById('button_status').className = "btn btn-secondary position-absolute m-2 px-2 py-1"
                document.getElementById('button_status').onclick = function onclick(event) {}
            }
        }
    });
}



//Charger et affiche la commande voulant être traitée
function cmd_en_cours(vente_id){
    //Remettre la ligne de l'ancienne commande en cours en blanc (non selectionnée)
    var ancienne_cmd = document.getElementById('num_com_encour').textContent
    if(ancienne_cmd != '#')
        document.getElementById('ligne_cmd_'+ancienne_cmd.slice(1,)).style.backgroundColor="white"

    //Mettre la ligne de la commande en cours en bleu dans la liste (slectionnée)
    document.getElementById('ligne_cmd_'+vente_id).style.backgroundColor="#78b0ff"

    //Vider les champs de la commande en cours
    $('#num_com_encour').empty();
    $('#adresse_com_encour').empty();
    $('#date_com_encour').empty();
    $('#status_com_encour').empty();
    $('#cart_items_gestion').empty();

    //Charger les détails de la commande selectionnée
    TOKEN_ADMIN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";
    $.ajax({
        url: "/ventes/"+vente_id,
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
        },
        success: function (vente) {
            //Charger les détails du client ayant passé la commande
            $.ajax({
                url: "/clients/"+vente.idClient,
                beforeSend: function (xhr){
                    xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_ADMIN);
                },
                success: function (Client) {
                    //Enlever le text du boutton de confirmation de changements
                    $('#button_status').empty();

                    //Si le status de la commande selectionnée est 'recue'
                    //Afficher la liste des produits à empacter et mettre le bouttons de confirmation inutilisable 'Confirmer l'emballage'
                    if(vente.status == 'reçue'){
                        document.getElementById('cart_table_gest').style.display="table"
                        $('#button_status').append('<h5>Confirmer l\'emballage</h5>')
                        document.getElementById('button_status').className = "btn btn-secondary position-absolute m-2 px-2 py-1"
                        document.getElementById('button_status').onclick = function onclick(event) {}
                        document.getElementById('cart_table_gest_button').style.display="block"
                        document.getElementById('cart_tittle_gest').style.display="none"
                    }

                    //Si le status de la commande selectionnée est 'prepare'
                    //Cacher la liste des produit à assembler et mettre le bouttons de confirmation utilisable 'Expédier'
                    if(vente.status == 'préparé'){
                        document.getElementById('cart_table_gest').style.display="none"
                        $('#button_status').append('<h4>Expédier</h4>')
                        document.getElementById('button_status').className = "btn btn-primary position-absolute m-2 px-2 py-1"
                        document.getElementById('button_status').onclick = function onclick(event) { changestatus(vente, 'en_route') }
                        document.getElementById('cart_table_gest_button').style.display="block"
                        document.getElementById('cart_tittle_gest').style.display="none"
                    }

                    //Écrire l'entête avec l'information de la vente et du client
                    $('#num_com_encour').append('#'+vente_id);
                    $('#adresse_com_encour').append(Client.adresse);
                    $('#date_com_encour').append(vente.date.slice(0,10));
                    $('#status_com_encour').append(vente.status);

                    //Écrire chaque item dans le tableau
                    $.each(vente.produits, function (key, produit){
                        item = panier_to_html_gestion(produit);
                        $('#cart_items_gestion').append(item);
                    });

                }
            });

        }
    });

}

//Afficher la demande de confirmation d'annulation
function conf_annul_gest_on(){
    document.getElementById("conf_annul_gest").style.display="block";
}

//Cache la demande de confirmation d'annulation
function conf_annul_gest_off(){
    document.getElementById("conf_annul_gest").style.display="none";

}

//Transformation des information d'un item et code html pour écriture dans le tableau
function panier_to_html_gestion(item){
    item_tab = $('<tr></tr>')
        .append('<td>' + item.idProduit + '</td>')
        .append('<td>' + item.nomProduit + '</td>')
        .append('<td>'+ item.quantite +'</td>')
        .append('<td><input id="check_prod_'+item.id+'" type="checkbox" onchange="check_assemblage()"></td>');
    return (item_tab);
}

//recharge la liste des ventes et l'écrit dans l'encadré
function rechargergestion(){
    $('#vente_list').empty();
    chargergestion();
}

//Transformation des information de vente en code html pour la liste des commandes recues
function vente_to_html_list(vente){
    vente_tab = $('<tr id="ligne_cmd_'+vente.id+'" onclick="chargerCommandeActive(this)"></tr>')
        .addClass("clickable-row")
        .append('<td id="id_cmd_'+vente.id+'">' + vente.id + '</td>')
        .append('<td id="date_cmd_'+vente.id+'">' + vente.date.slice(0,10) + '</td>')
        .append('<td id="status_cmd_'+vente.id+'">'+ vente.status +'</td>')
    return (vente_tab);
}



//Vide l'encadré de commande en cours
function vider_cmd_en_cours(){
    //Déselectionner l'ancienne commande en cours dans la liste
    var ancienne_cmd = document.getElementById('num_com_encour').textContent
    if(ancienne_cmd != '#')
        document.getElementById('ligne_cmd_'+ancienne_cmd.slice(1,)).style.backgroundColor="white"

    //Vider tous les champs
    $('#num_com_encour').empty();
    $('#num_com_encour').append('#');
    $('#adresse_com_encour').empty();
    $('#date_com_encour').empty();
    $('#status_com_encour').empty();
    $('#cart_items_gestion').empty();

    //Cacher les tableau et afficher le message "selectionner une commande"
    document.getElementById('cart_table_gest').style.display="none"
    document.getElementById('cart_table_gest_button').style.display="none"
    document.getElementById('cart_tittle_gest').style.display="text"

}


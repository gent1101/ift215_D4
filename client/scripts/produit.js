$(function () {

});

function chargerproduit(){
 for(let i = 0; i < 3; i++)
    {
        $.ajax({
            url: "/produits",
            success: function (result) {
                //console.log(result);
                $.each(result, function (key, value) {
                    item = item_to_html(value)
                    console.log(item);
                    $('#list_items').append(item);
                });
            }
        });
    }

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
        .append('<p>' + item.description + '</p>')
        //.append('<p class="w-100 display-6 text-center"><i class="bi bi-cart-plus"></i></p>'); //Doesn't work !
        .append('<p class="w-100 display-6 text-center"><img src="cart.png"/></p>'); //Doesn't work !
    item_card.append(item_head).append(item_body);
    return $('<div></div>').addClass('col-md-3') .append(item_card);
}
/*
<div className="col-md-3">
    <div className="card mb-4 rounded-3 shadow-sm">
        <div className="card-header py-3 ">
            <h4 className="my-0 fw-normal">[nom]</h4>
        </div>
        <div className="card-body ">
            <h1 className="card-title text-center">[prix]</h1>
            <ul className="list-unstyled mt-3 mb-4">
                <li>[Qte]</li>
                <li>[Categorie]</li>
            </ul>
            <p className="w-100 display-6 text-center"><i className="bi bi-cart-plus"></i></p>
        </div>
    </div>
</div>
*/





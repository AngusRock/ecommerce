let productsInCart = [];

cartProcess();

function cartProcess(){
    addListenerToRemoveAllItemsButton();
    productsInCart = getLocalStorage();
    updateCartUnitsBis(productsInCart);
    buildProductsTable(productsInCart);
    addListenerToRemoveItemButton();
}


function addListenerToRemoveAllItemsButton(){
    let removeAllButton = $('#cleanStorage');
    //agrega un listener de click a todos los botones de añadir carrito
        $(removeAllButton).on("click", () => {
            localStorage.clear();
            runSyncMethods();
            cartProcess();
        });
}

function addListenerToRemoveItemButton(){
    let removeItemButtons = $('.remove-btn');
    for (let i = 0; i < removeItemButtons.length; i++) {
        $(removeItemButtons[i]).on('click', () => {
            removeItemFromTable(i);
        });        
    }
}

function removeItemFromTable(itemIndex) {
    productsInCart.splice(itemIndex, 1);
    setLocalStorageBis();
    updateCartUnitsBis(productsInCart);
    buildProductsTable(productsInCart);
    addListenerToRemoveItemButton();
}

function getLocalStorage(){
    return JSON.parse(localStorage.getItem("productsToBuy"));
}

function setLocalStorageBis(){
    localStorage.setItem("productsToBuy",JSON.stringify(productsInCart));
}

function updateCartUnitsBis(productsInCart){
    let productsQty = 0;
    if(productsInCart) {
        productsQty = productsInCart.length;
    }
    document.getElementById('cartUnits').textContent = productsQty;
}

function buildProductsTable(prodList){
    let prodTable = document.getElementById('productsInCartTable');
    let htmlTable = '';
    let totalPrice = 0;
    let prodPosition = 1;
    if(prodList){ 
        for (const prod of prodList) {
            htmlTable +=            `<tr>
                                    <th scope="row">${prodPosition}</th>
                                    <td>${prod.type}</td>
                                    <td>${prod.country}</td>
                                    <td>${isNaN(prod.qty) ? 0 : prod.qty}</td>
                                    <td>$${prod.price == '' ? 0 : prod.price}</td>
                                    <td><button type="button" class="btn btn-danger btn-sm remove-btn" id="cleanStorage">X</button></td>
                                    </tr>`;
            prodPosition++;
            totalPrice += prod.price;
        }
        htmlTable +=   `<tr>
                        <th scope="row"></th>
                        <td></td>
                        <td></td>
                        <td><strong>Total</strong></td>
                        <td><strong>$${totalPrice}</strong></td>
                        <td></td>
                        </tr>`;
    }

    prodTable.innerHTML = htmlTable;
}
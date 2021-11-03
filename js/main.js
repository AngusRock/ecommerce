const productsInStock = [];
let productsElements;
let cartButtons
let productsToBuy = [];
let jsonFileURL = 'json/products.json';
let coffeeTypesSet = new Set();
const productsTableSelector = '#productsTable';


getJSONFile(jsonFileURL).then((response) => {
    for (const object of response) {
        productsInStock.push(object);
        coffeeTypesSet.add(object.type);
    }    
    runSyncMethods();
});

//async method
function getJSONFile(jsonFileURl){
    return $.ajax({
        url: jsonFileURl,
        type: 'GET'
    });        
}

function runSyncMethods(){
    getLocalStorageItems();
    renderProductsInHomePage(productsInStock,productsTableSelector);
    productsElements = getProductsElements();
    cartButtons = $('.cart-btn');
    addListenerAllAddCartButtons(cartButtons);
    buildCoffeeTypesList(coffeeTypesSet,'#coffeeTypeList');
    addListenerToCoffeeTypesList('#coffeeTypeList');
}

function getLocalStorageItems(){
    if(JSON.parse(localStorage.getItem("productsToBuy")) != null){
        productsToBuy = JSON.parse(localStorage.getItem("productsToBuy"));
        updateCartUnits(productsToBuy.length);
    }
}

//obtiene los elementos html vinculados con la clase products
function getProductsElements(){
    return $('.products');
}

function addListenerAllAddCartButtons(cartButtons){
    //agrega un listener de click a todos los botones de añadir carrito
    for (let i = 0; i < cartButtons.length; i++){
        $(cartButtons[i]).on("click", () => {
            addProductToCart(i);
        });
    }
}

function addProductToCart(prodId){
    let requiredUnits = parseInt(productsElements[prodId].querySelector('.productQty').value);
    if(requiredUnits >= 0){
        if(addProductToArray(prodId, requiredUnits)){
            setLocalStorage(productsToBuy);
        }
     }
}

function addProductToArray(prodId, units){
    let productObj = productsInStock[prodId];
    let productsToBuyUpdated = false;

    //verifica si el array tiene algun producto a comprar cargado
    if(productsToBuy.length > 0){
        const productFound = productsToBuy.find(product => product.country === productObj.country);
        //si encuentra producto y las unidades solicitadas aumentaron, entonces lo actualiza
        if(productFound != null && units > 0) {
            productFound.qty = units;
            productFound.price = productObj.price * units;
            productsToBuyUpdated = true;
        } else if (productFound != null && units == 0) {
            const productIndex = productsToBuy.findIndex(product => product.country === productObj.country);
            productsToBuy.splice(productIndex, 1);
            updateCartUnits(productsToBuy.length);
            updateButtonDesign(prodId, false);
            productsToBuyUpdated = true;
        //si no encuentra producto lo pushea al array de productos a comprar
        } else if(productFound == null) {
            productsToBuyUpdated = pushProductToArray(productObj, units, prodId);
        }
    //si el array esta vacio, pushea el producto al array de productos a comprar
    } else if(units > 0) {
        productsToBuyUpdated = pushProductToArray(productObj, units, prodId);
    }

    return productsToBuyUpdated;
}

function pushProductToArray(productObj, units, prodId){
    productsToBuy.push(new Product(productObj.country, units, (productObj.price * units)));
    updateCartUnits(productsToBuy.length);
    updateButtonDesign(prodId, true);
    return true;
}

function updateCartUnits(productsQty){
    document.getElementById('cartUnits').textContent = productsQty;
}

function updateButtonDesign(buttonId, addClass){
    if(addClass) {
        cartButtons[buttonId].classList.add('btn-altColor');
        cartButtons[buttonId].innerHTML = 'Actualizar Unidades';
    }
    else {
        cartButtons[buttonId].classList.remove('btn-altColor');
        cartButtons[buttonId].innerHTML = 'Agregar al carrito';
    }
}

function setLocalStorage(products){
    localStorage.setItem("productsToBuy",JSON.stringify(products));
}

function renderProductsInHomePage(products, selectorId){
    $(selectorId).empty();
    let htmlTable = '';
    for (const product of products) {
        let productFound = productsToBuy.find(prods => prods.country === product.country);
        htmlTable +=    `<div class="box products">
                            <h4>${product.type}</h4>
                            <h6>Origen: ${product.country}</h6>
                            <img src="images/coffee_cup.jpg">
                            <div class="col-xs-2">
                                <div class="price">P. Unit: $${product.price}</div>
                                <input type="number" class="form-control productQty" placeholder="Qty" value="${productFound != null ? productFound.qty : 0}">
                            </div>
                            <div class="mt-3">
                                <button type="button" class="btn btn-primary cart-btn ${productFound != null ? 'btn-altColor' : ''}">${productFound != null ? 'Actualizar Unidades' : 'Agregar al carrito'}</button>
                            </div>
                         </div>`;
    }
    $(selectorId).append(htmlTable);
}

function buildCoffeeTypesList(coffeeTypes,selectorId){
    $(selectorId).empty();
    let contentHtml = `<option selected>--Todos--</option>`;
    for (const coffeeType of coffeeTypes) {
        contentHtml += `<option>${coffeeType}</option>`;        
    }
    $(selectorId).append(contentHtml);
}

function filterCoffeeType(){
    if(this.value !== '--Todos--'){
        let selectedType = productsInStock.filter(coffeeType => coffeeType.type === this.value);
        renderProductsInHomePage(selectedType,productsTableSelector);        
    } else {
        renderProductsInHomePage(productsInStock,productsTableSelector);
    }
}

function addListenerToCoffeeTypesList(selectorId){    
    $(selectorId).on("change", filterCoffeeType);    
}
class Product {
    constructor(country, qty, price) {
        this.country = country;
        this.qty = parseInt(qty);
        this.price = price;
    }
}
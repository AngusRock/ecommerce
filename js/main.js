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
    addListenerToRemoveAllItemsButton();
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
    addListenerToAllAddCartButtons(cartButtons);
    buildCoffeeTypesList(coffeeTypesSet,'#coffeeTypeList');
    addListenerToCoffeeTypesList('#coffeeTypeList');
    addListenerToBuyButton('#buyConfirmation');
    cartProcess();
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

function addListenerToAllAddCartButtons(cartButtons){
    //agrega un listener de click a todos los botones de añadir carrito
    for (const button of cartButtons) {
        $(button).click(addProductToCart);                
    }
}

function addProductToCart(event){     
    const prodId  = event.target.id;
    //let requiredUnits = parseInt(productsElements[prodId].querySelector('.productQty').value);
    let requiredUnits = parseInt(document.querySelector('[data-id="'+prodId+'"]').value);
    console.log('units: '+requiredUnits);
    
    let productObj = productsInStock.find(product => product.id == prodId);
    //console.log('prodobj addToCart: ',productObj);
    if(requiredUnits >= 0){
        if(addProductToArray(prodId, requiredUnits)){
            setLocalStorage(productsToBuy);
            cartProcess();
        }
     }
}

function addProductToArray(prodId, units){
    //let productObj = productsInStock[prodId];
    let productObj = productsInStock.find(product => product.id == prodId);
    //let productObj = productsInStock[prodId];
    let productsToBuyUpdated = false;    

    //verifica si el array tiene algun producto a comprar cargado
    if(productsToBuy.length > 0){
        const productFound = productsToBuy.find(product => product.id == prodId);        
        //si encuentra producto y las unidades solicitadas aumentaron, entonces solo lo actualiza
        if(productFound != null && units > 0) {            
            productFound.qty = units;
            productFound.price = productObj.price * units;
            productsToBuyUpdated = true;
        } else if (productFound != null && units == 0) {            
            const productIndex = productsToBuy.findIndex(product => product.id == prodId);
            productsToBuy.splice(productIndex, 1);
            updateCartUnits(productsToBuy.length);
            updateButtonDesign(prodId, false);
            productsToBuyUpdated = true;
        //si no encuentra producto lo pushea al array de productos a comprar
        } else if(productFound == null && units > 0) {            
            productsToBuyUpdated = pushProductToCart(productObj, units, prodId);
        }
    //si el array esta vacio, pushea el producto al array de productos a comprar
    } else if(units > 0) {        
        productsToBuyUpdated = pushProductToCart(productObj, units, prodId);
    }

    return productsToBuyUpdated;
}

function pushProductToCart(productObj, units, prodId){
    console.log('pushProduct');
    productsToBuy.push(new Product(productObj.country, units, (productObj.price * units), productObj.type, prodId));
    updateCartUnits(productsToBuy.length);
    //updateButtonDesign(prodId, true);
    return true;
}

function updateCartUnits(productsQty){    
    document.getElementById('cartUnits').textContent = productsQty;
}

function updateButtonDesign(buttonId, addClass){
    /*if(addClass) {
        cartButtons[buttonId].classList.add('btn-altColor');
        cartButtons[buttonId].innerHTML = 'Actualizar Unidades';
    }
    else {
        cartButtons[buttonId].classList.remove('btn-altColor');
        cartButtons[buttonId].innerHTML = 'Agregar al carrito';
    }*/
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
                                <input type="number" data-id="${product.id}" class="form-control productQty" placeholder="Qty" value="${productFound != null ? productFound.qty : 0}">
                            </div>
                            <div class="mt-3">
                                <button type="button" id="${product.id}" class="btn btn-primary ${productFound != null ? 'btn-altColor' : 'cart-btn'}">${productFound != null ? 'Actualizar Unidades' : 'Agregar al carrito'}</button>
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
        cartButtons = $('.cart-btn');
        addListenerToAllAddCartButtons(cartButtons);        
    } else {
        renderProductsInHomePage(productsInStock,productsTableSelector);
        cartButtons = $('.cart-btn');
        addListenerToAllAddCartButtons(cartButtons);
    }
}

function addListenerToCoffeeTypesList(selectorId){    
    $(selectorId).on("change", filterCoffeeType);    
}

function addListenerToBuyButton(selectorId){    
    $(selectorId).on("click", () => {
        localStorage.clear();
        runSyncMethods();        
    });    
}
class Product {
    constructor(country, qty, price, type, id) {
        this.country = country;
        this.qty = parseInt(qty);
        this.price = price;
        this.type = type;
        this.id = id;
    }
}
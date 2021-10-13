class Product {
    constructor(name, qty, price) {
        this.name = name;
        this.qty = parseInt(qty);
        this.price = price;
    }
}

const productsInStock = [{id : 0, name : 'Pera', stock : 15, price : 30},
                         {id : 1,name : 'Manzana', stock : 25, price : 25},
                         {id : 2,name : 'Banana', stock : 22, price : 35},
                         {id : 3,name : 'Naranja', stock : 20, price : 15}
                       ];

let productsToBuy = [];

if(JSON.parse(localStorage.getItem("productsToBuy")) != null){
    productsToBuy = JSON.parse(localStorage.getItem("productsToBuy"));
    updateCartUnits(productsToBuy.length);
}

renderProductsInHomePage(productsInStock);
let productsElements = getProductsElements();
let cartButtons = $('.cart-btn');
addListenerToRemoveAllItemsButton(cartButtons);

function getProductsElements(){
    return $('.products');
}

function addListenerToRemoveAllItemsButton(cartButtons){
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
        const productFound = productsToBuy.find(product => product.name === productObj.name);
        //si encuentra producto y las unidades solicitadas aumentaron, entonces lo actualiza
        if(productFound != null && units > 0) {            
            productFound.qty = units;
            productFound.price = productObj.price * units;           
            productsToBuyUpdated = true;
        } else if (productFound != null && units == 0) {
            const productIndex = productsToBuy.findIndex(product => product.name === productObj.name);
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
    productsToBuy.push(new Product(productObj.name, units, (productObj.price * units)));
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

/*function renderProductsInHomePage(products){
    let prodHtmlTable = document.getElementById('productsTable');
    let htmlTable = '';
    for (const product of products) {
        let productFound = productsToBuy.find(productS => productS.name === product.name);        
        htmlTable +=    `<div class="box products">
                            <h4>${product.name}</h4>
                            <p>(stock: ${product.stock})</p>
                            <div class="col-xs-2">
                                <div class="price">P. Unit: $${product.price}</div>
                                <input type="number" class="form-control productQty" placeholder="Qty" value="${productFound != null ? productFound.qty : 0}">                
                            </div>
                            <div class="mt-3">
                                <button type="button" class="btn btn-primary cart-btn ${productFound != null ? 'btn-altColor' : ''}">${productFound != null ? 'Actualizar Unidades' : 'Agregar al carrito'}</button>
                            </div>
                        </div>`;        
    }
    prodHtmlTable.innerHTML = htmlTable;        
}*/
function renderProductsInHomePage(products){
    let prodHtmlTable = $('#productsTable');    
    let htmlTable = '';
    for (const product of products) {
        let productFound = productsToBuy.find(productS => productS.name === product.name);        
        htmlTable +=    `<div class="box products">
                            <h4>${product.name}</h4>
                            <p>(stock: ${product.stock})</p>
                            <div class="col-xs-2">
                                <div class="price">P. Unit: $${product.price}</div>
                                <input type="number" class="form-control productQty" placeholder="Qty" value="${productFound != null ? productFound.qty : 0}">                
                            </div>
                            <div class="mt-3">
                                <button type="button" class="btn btn-primary cart-btn ${productFound != null ? 'btn-altColor' : ''}">${productFound != null ? 'Actualizar Unidades' : 'Agregar al carrito'}</button>
                            </div>
                        </div>`;        
    }
    prodHtmlTable.append(htmlTable);        
}
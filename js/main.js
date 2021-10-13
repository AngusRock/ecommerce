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
    updateCartUnits();
}


renderProductsInHomePage(productsInStock);
let productsElements = getProductsElements();

addListenerToProductsTable();

function getProductsElements(){
    return document.querySelectorAll('.products');
}

function addListenerToProductsTable(){
    let cartButton = document.querySelectorAll('.cart-btn');
    //loop que encasilla a todos los productos y los añade al carrito//
    for (let i=0; i < cartButton.length; i++){
        cartButton[i].addEventListener("click", () => {
            addProductToCart(i);
        });
    }
}

function addProductToCart(prodId){
    let requiredUnits = parseInt(productsElements[prodId].querySelector('.productQty').value);
    if(requiredUnits > 0){
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
        if(productFound != null && units > productFound.qty) {            
            productFound.qty = units;
            productFound.price = productObj.price * units;
            updateCartUnits();            
            productsToBuyUpdated = true;
        //si no encuentra producto lo pushea al array de productos a comprar
        } else if(productFound == null) {
            productsToBuyUpdated = pushProductToArray(productObj, units);            
        }
    //si el array esta vacio, pushea el producto al array de productos a comprar
    } else {
        productsToBuyUpdated = pushProductToArray(productObj, units);         
    }

    return productsToBuyUpdated;
}

function pushProductToArray(productObj, units){
    productsToBuy.push(new Product(productObj.name, units, (productObj.price * units)));
    updateCartUnits();
    return true;
}

function updateCartUnits(){    
    let productsQty = 0;    
    for (const prod of productsToBuy) {
        productsQty += prod.qty;        
    }
    document.getElementById('cartUnits').textContent = productsQty;   
}

function setLocalStorage(products){
    localStorage.setItem("productsToBuy",JSON.stringify(products));
}

function renderProductsInHomePage(products){
    let prodHtmlTable = document.getElementById('productsTable');
    let htmlTable = '';
    for (const product of products) {
        htmlTable +=    `<div class="box products">
                            <h4>${product.name}</h4>
                            <p>(stock: ${product.stock})</p>
                            <div class="col-xs-2">
                                <div class="price">P. Unit: $${product.price}</div>
                                <input type="number" class="form-control productQty" placeholder="Qty">                
                            </div>
                            <div class="mt-3">
                                <button type="button" class="btn btn-primary cart-btn">Añadir al carrito</button>
                            </div>
                        </div>`;        
    }
    prodHtmlTable.innerHTML = htmlTable;        
}
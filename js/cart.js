let prodPosition = 1;
const prod = getLocalStorage();
updateCartUnits(prod);
buildProductsTable(prod);

function getLocalStorage(){
    return JSON.parse(localStorage.getItem("productsToBuy"));
}

function updateCartUnits(productsToBuy){    
    let productsQty = 0;    
    for (const prod of productsToBuy) {
        productsQty += prod.qty;        
    }
    document.getElementById('cartUnits').textContent = productsQty;   
}

function buildProductsTable(prodList){
    let prodTable = document.getElementById('productsInCartTable');
    let htmlTable = '';
    let totalPrice = 0;
    for (const prod of prodList) {
        htmlTable +=            `<tr>
                                <th scope="row">${prodPosition}</th>
                                <td>${prod.name}</td>
                                <td>${isNaN(prod.qty) ? 0 : prod.qty}</td>
                                <td>$${prod.price == '' ? 0 : prod.price}</td>
                                </tr>`;
        prodPosition++;
        totalPrice += prod.price;
    }
    htmlTable +=   `<tr>
                    <th scope="row"></th>
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td><strong>$${totalPrice}</strong></td>
                    </tr>`;

    prodTable.innerHTML = htmlTable;
}
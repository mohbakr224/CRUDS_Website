let inputs = document.querySelectorAll(".inputs input");
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discounts = document.getElementById("discounts");
let category = document.getElementById("category");
let totalBox = document.getElementById("small");
let add_button = document.getElementById("add");
let tbody = document.getElementById("tbody");
let deleteALL = document.getElementById("deleteALL");
let search = document.getElementById("search");
let products;
let editIndex = null;

if (localStorage.getItem("products") != null) {
    products = JSON.parse(localStorage.getItem("products"));
} else {
    products = [];
}

function totalprice() {
    if (price.value !== "") {
        let p = +price.value || 0;
        let t = +taxes.value || 0;
        let a = +ads.value || 0;
        let d = +discounts.value || 0;
        let result = p + (p * t / 100) + a - d;
        totalBox.innerHTML = result.toFixed(2);
        totalBox.style.background = "green";
    } else {
        totalBox.innerHTML = "";
        totalBox.style.background = "red";
    }
}

function addProduct() {
    const titleRegex = /^[A-Za-z\s]+$/;
    const numberRegex = /^\d+(\.\d{1,2})?$/;
    const categoryRegex = /^[A-Za-z\s]+$/;

    let newProduct = {
        title: title.value.trim(),
        price: price.value.trim(),
        taxes: taxes.value.trim(),
        ads: ads.value.trim(),
        discounts: discounts.value.trim(),
        category: category.value.trim(),
        total: totalBox.innerHTML
    };

    if (!titleRegex.test(newProduct.title)) {
        alert("Title must contain letters only!");
        title.style.background = "red";
        return;
    } else {
        title.style.background = "white";
    }

    if (!numberRegex.test(newProduct.price) || !numberRegex.test(newProduct.taxes) ||
        !numberRegex.test(newProduct.ads) || !numberRegex.test(newProduct.discounts)) {
        alert("Price, Taxes, Ads, and Discounts must be valid numbers!");
        price.style.background = taxes.style.background = ads.style.background = discounts.style.background = "red";
        return;
    } else {
        price.style.background = taxes.style.background = ads.style.background = discounts.style.background = "white";
    }

    if (!categoryRegex.test(newProduct.category)) {
        alert("Category must contain letters only!");
        category.style.background = "red";
        return;
    } else {
        category.style.background = "white";
    }

    // Add or update product
    if (editIndex === null) {
        products.push(newProduct);
    } else {
        products[editIndex] = newProduct;
        editIndex = null;
        add_button.innerHTML = "Add";
        inputs.forEach(input => input.style.background = "");
    }

    localStorage.setItem("products", JSON.stringify(products));
    clearInputs();
    showData();
}

add_button.onclick = addProduct;

function showData() {
    tbody.innerHTML = "";
    for (let i = 0; i < products.length; i++) {
        tbody.innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${products[i].title}</td>
            <td>${products[i].price}</td>
            <td>${products[i].taxes}</td>
            <td>${products[i].ads}</td>
            <td>${products[i].discounts}</td>
            <td>${products[i].category}</td>
            <td>${products[i].total}</td>
            <td><button onclick="deleteProduct(${i})">Delete</button></td>
            <td><button onclick="updateProducts(${i})">Update</button></td>
        </tr>
        `;
    }
    checkDeleteAll();
}

function deleteProduct(i) {
    products.splice(i, 1);
    localStorage.setItem("products", JSON.stringify(products));
    showData();
}

function updateProducts(i) {
    let p = products[i];

    title.value = p.title;
    price.value = p.price;
    taxes.value = p.taxes;
    ads.value = p.ads;
    discounts.value = p.discounts;
    category.value = p.category;

    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            input.style.background = "yellow";
        }
    });

    totalBox.innerHTML = p.total;
    totalBox.style.background = "green";

    editIndex = i;
    add_button.innerHTML = "Update";
}

function deleteALLProducts() {
    products = [];
    localStorage.removeItem("products");
    showData();
}

function clearInputs() {
    inputs.forEach(input => input.value = "");
    totalBox.innerHTML = "";
    totalBox.style.background = "red";
}

function checkDeleteAll() {
    if (products.length > 0) {
        deleteALL.innerHTML = `<button style="outline: none; border: none; background-color: red; color: white; padding:10px;" onclick="deleteALLProducts()">Delete All (${products.length})</button>`;
    } else {
        deleteALL.innerHTML = "";
    }
}

showData();

function search_for_product() {
    let search_value = search.value.toLowerCase();
    tbody.innerHTML = "";
    let found = false;
    for (let i = 0; i < products.length; i++) {
        if (products[i].title.toLowerCase().includes(search_value)) {
            found = true;
            tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${products[i].title}</td>
                <td>${products[i].price}</td>
                <td>${products[i].taxes}</td>
                <td>${products[i].ads}</td>
                <td>${products[i].discounts}</td>
                <td>${products[i].category}</td>
                <td>${products[i].total}</td>
                <td><button onclick="deleteProduct(${i})">Delete</button></td>
                <td><button onclick="updateProducts(${i})">Update</button></td>
            </tr>
            `;
        }
    }
    if (!found) {
        showData();
    }
}
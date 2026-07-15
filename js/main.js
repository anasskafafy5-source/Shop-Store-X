// Catch the items
let homeB = document.getElementById("home-b");
let shopB = document.getElementById("shop-b");
let cartB = document.getElementById("cart-b");
let cartT = document.getElementById("cart-t");
let homeT = document.getElementById("home-t");
let shopT = document.getElementById("shop-t");
let cartIcon = document.querySelector(".nav-bar .cart-icon i");
let showToolBar = document.querySelector(".show-tool-bar");
let toolBar = document.querySelector(".tool-bar");
let itemsCountSpan = document.getElementById("items-count");
let allCategoryButton = document.getElementsByClassName("all")[0];
let menCategoryButton = document.getElementsByClassName("men")[0];
let womenCategoryButton = document.getElementsByClassName("women")[0];
let accessCategoryButton = document.getElementsByClassName("accessories")[0];
let menCard = document.getElementById("menCard");
let accCard = document.getElementById("accessoriesCard");
let womenCard = document.getElementById("womenCard");

// Make It work
let mood = "all";
homeB.onclick = goHome;
homeT.onclick = goHome;
cartB.onclick = goCart;
cartT.onclick = goCart;
shopB.onclick = goShop;
shopT.onclick = goShop;
cartIcon.onclick = goCart;
showToolBar.onclick = handleToolBar;

begainActive();

// Reset the Classes
function resetActive() {
  let temp = [homeB, cartB, shopB];
  temp.forEach((ele) => ele.classList.remove("active"));
  let xtemp = document.querySelectorAll(".the-main-title .tool-bar div");
  xtemp.forEach((ele) => ele.classList.remove("active"));
}

// Begain of the active class
function begainActive() {
  resetActive();
  const page = window.location.pathname.split('/').pop().toLowerCase();

  if (page.includes("cart")) {
    cartB.classList.add("active");
    cartT.classList.add("active");
  } else if (page.includes("shop")) {
    shopB.classList.add("active");
    shopT.classList.add("active");
  } else if (page.includes("home") || page === "") {
    homeB.classList.add("active");
    homeT.classList.add("active");
  } else if (page.includes("cart")) {
  } else {
    resetActive();
  }
}

//Function Go Home()
function goHome() {
  resetActive();
  homeB.classList.add("active");
  homeT.classList.add("active");
  window.location.href = "home.html";
  console.log('s');
}

// function go cart
function goCart() {
  resetActive();
  document.getElementById("cart-b").classList.add("active");
  document.getElementById("cart-t").classList.add("active");
  window.location.href = "cart.html";
  console.log("d");
}

// function go shop
function goShop() {
  resetActive();
  document.getElementById("shop-b").classList.add("active");
  document.getElementById("shop-t").classList.add("active");
  window.location.href = "shop.html";
  console.log("d");
}

// function handle the tool bar
function handleToolBar() {
  if (showToolBar.classList.contains("active")) {
    toolBar.classList.remove("active");
    showToolBar.classList.remove("active");
  } else {
    showToolBar.classList.add("active");
    toolBar.classList.add("active");
  }
}

// Function Reset Category Button
function resetCategoryButton() {
  let temp = [allCategoryButton, menCategoryButton, womenCategoryButton, accessCategoryButton];
  temp.forEach(ele => ele.classList.remove("active"));
}

// Handle The Loaging
function loadingFun() {
  itemsContainer.innerHTML = "";
  let temp = `<div class="loading">
    loading....
    <div class="loading-circ"></div>
  </div>`;
  itemsContainer.innerHTML = temp;
}

// function Handle Count span
function countSpan() {
  let count = document.querySelectorAll(".box");
  count = count.length;
  itemsCountSpan.innerHTML = `${count} Products`;
}

// Function To Get Random Items Form The Array
function getRandom(data, numberOfItems) {
  let arr = [];
  if (numberOfItems > data.length) {
    throw("the Number Of Items More than The Data");
  }
  while (arr.length < numberOfItems) {
    let random = data[Math.floor(Math.random() * data.length)];
    if (!arr.includes(random)) {
      arr.push(random);
    }
  }
  return arr;
}

// Start real Work
// Start The Real Website

//[1] Catch the Elements And set The Settings;
let itemsContainer = document.querySelector(".items-card");
let api = "../gemini-data.json";
let allData = null;
let pageData = null;
let menData = [];
let womenData = [];
let accessoriesData = [];
let cartArr = [];
let numberOfItems = 0;
let totalPrice;

//[2] When the Page load =>
window.onload = async () => {
  handleCartArrOnBegan();
  await getData(api);
  handleCategories(allData);

  // Home Page
  const page = window.location.pathname.split('/').pop().toLowerCase();
  if (page === "" || page.includes("home")) {
    loadingFun();
    showData(pageData);
    productFun();
  }

  // SHop Page;
  else if (page.includes("shop")) {
    loadingFun();
    handleCategoryShopBegan();
  }

  // Product Page
  else if (page.includes("productpage")) {
    loadingFun();
    handleProductPageFun();
    productFun();
  }

  // Cart Page
  else if (page.includes("cart")) {
    cartPageOnLoad();
  }

  console.log("vammoooos");
};

//[3] Get data
async function getData(api) {
  try {
    let response = await fetch(api);
    if (!response.ok) throw Error("There Is Error");
    let data = await response.json();
    allData = data;
    pageData = getRandom(data, 4);
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
}

//[4]function to show the data
function showData(data) {
  let temp = "";
  data.forEach((item, index) => {
    temp += `<div class="box" data-id="${item.id}">
      <div class="image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="text">
        <div class="desc">${item.title}</div>
        <div class="price">$ ${item.price}</div>
      </div>
      <div class="categ">${item.category}</div>
      <div onclick="handleAddToTheCartFun(${item.id})" class="add-to-card">
        <i class="fa fa-shopping-cart"></i> Add To Cart
      </div>
    </div>`;
  });
  itemsContainer.innerHTML = temp;
}

// Function Handle The Categories
function handleCategories(data) {
  data.forEach((item) => {
    if (item.category === "men") menData.push(item);
    else if (item.category === "women") womenData.push(item);
    else if (item.category === "accessories") accessoriesData.push(item);
  });
}

//[1] Handle The Shop Page Before Handle Home Page;

//[1] Handles The Categories
function allCategoryButtonFun() {
  resetCategoryButton();
  allCategoryButton.classList.add("active");
  showData(allData);
   productFun();
   countSpan();
  window.sessionStorage.setItem("categoryMood", "all");
}

function menCategoryButtonFun() {
  resetCategoryButton();
  showData(menData);
  productFun();
  countSpan();
  menCategoryButton.classList.add("active");
  window.sessionStorage.setItem("categoryMood", "men");
}

function womenCategoryButtonfun() {
  resetCategoryButton();
  showData(womenData);
  productFun();
  countSpan();
  womenCategoryButton.classList.add("active");
  window.sessionStorage.setItem("categoryMood", "women");
}

function accessCategoryButtonFun() {
  resetCategoryButton();
  showData(accessoriesData);
  productFun();
  countSpan();
  accessCategoryButton.classList.add("active");
  window.sessionStorage.setItem("categoryMood", "acc");
}

function handleMenCard() {
  window.location.href = "shop.html";
  window.sessionStorage.setItem("categoryMood", "men");
}

function handleWomenCategory() {
  window.location.href = "shop.html";
  window.sessionStorage.setItem("categoryMood", "women");
}

function handleAccCategory() {
  window.location.href = "shop.html";
  window.sessionStorage.setItem("categoryMood", "acc");
}

function handleCategoryShopBegan() {
  if (window.sessionStorage.getItem("categoryMood") !== null) {
    let mood = window.sessionStorage.getItem("categoryMood");
    if (mood === "men") menCategoryButton.click();
    else if (mood === "women") womenCategoryButton.click();
    else if (mood === "acc") accessCategoryButton.click();
    else if (mood === "all") allCategoryButton.click();
  } else {
    showData(allData);
    countSpan();
    productFun();
  }
}

// Function Handle Select Box
function handleSelectBox() {
  loadingFun();
  let select = document.querySelector("select").value;
  let categoryData = null;

  if (window.sessionStorage.getItem("categoryMood") !== null) {
    let mood = window.sessionStorage.getItem("categoryMood");
    if (mood === "men") categoryData = [...menData];
    else if (mood === "women") categoryData = [...womenData];
    else if (mood === "acc") categoryData = [...accessoriesData];
    else if (mood === "all") categoryData = [...allData];
  } else {
    categoryData = [...allData];
  }

  if (select === "low") {
    categoryData = categoryData.sort((a, b) => a.price - b.price);
    showData(categoryData);
    productFun();
  } else if (select === "high") {
    categoryData = categoryData.sort((a, b) => b.price - a.price);
    showData(categoryData);
    productFun();
  } else if (select === "all") {
    showData(categoryData);
    productFun();
  }
}

// Start In Product
function productFun() {
  let boxes = document.querySelectorAll(".items-card .box");
  boxes = Array.from(boxes);

  boxes.forEach((box) => {
    box.addEventListener("click", (event) => {
      //[1] If Add The Items To The Cart Function
      if (event.target.closest(".add-to-card")) {
        // console.log("add To the Cart")
        return false;
      }

      // [2] Viwe In Product Page
      else {
        let id = box.dataset.id;
        window.sessionStorage.setItem("productId", id);
        window.location.href = "productPage.html";
      }
    });
  });
}

// Handle The Select Item In Products Page
function handleProductPageFun() {
  if (window.sessionStorage.getItem("productId") !== null) {
    //[1] Get The Id
    let id = window.sessionStorage.getItem("productId");

    //[2] Get the Item By Id
    let product = allData.find((item) => Number(item.id) === Number(id));

    // Show The Item
    showProduct(product);

    // Handle Retrun BUtton
    document.querySelector(".return").onclick = () => {
      window.history.back();
    };

    // ShowData
    showData(pageData);
  }
}

// Show The Data In The Products Page
function showProduct(item) {
  let mainContainer = document.querySelector(".product-page");

  // Creat It
  let temp = `<div class="image">
    <img src="${item.image}">
  </div>
  <div class="category">${item.category}</div>
  <h2 class="title">${item.title}</h2>
  <div class="price">$${item.price}</div>
  <p class="desc">${item.description}</p>
  <button onclick="handleAddToTheCartFun(${item.id})" class="product-add-to-cart">
    <i class="fa fa-shopping-cart"></i> Add To Cart
  </button>
  <div class="details">
    <p>Detail</p>
    <ul>
      <li>Premium quality materials</li>
      <li>Carefully crafted design</li>
      <li> Available in multiple sizes</li>
    </ul>
    <p class="ret">SHIPPING & RETURNS</p>
    <p>Free shipping on orders over $100. Free returns within 30 days.</p>
  </div>`;
  mainContainer.innerHTML = temp;
}

function handleAddToTheCartFun(id) {
  // Get the Id Of The Product
  let product = allData.find((item) => Number(item.id) === Number(id));
  let obj = {
    product: product,
    id: id,
    count: 1,
  };

  let index = -1;
  for (let i = 0; i < cartArr.length; i++) {
    if (Number(id) === Number(cartArr[i].id)) {
      index = i;
    }
  }

  if (index !== -1) {
    obj.count = cartArr[index].count;
    if (obj.count < 3) obj.count++;
    cartArr[index] = obj;
  } else {
    cartArr.push(obj);
  }

  window.localStorage.setItem("cart", JSON.stringify(cartArr));

  let arr = getRealItemsInCart();
  numberOfItems = arr[0];
  totalPrice = arr[1];
  cartSpanFun();
}

// Handle CartArr When Load THe Pgae
function handleCartArrOnBegan() {
  if (window.localStorage.getItem("cart") !== null) {
    cartArr = JSON.parse(window.localStorage.getItem("cart"));
  }
  let arr = getRealItemsInCart();
  numberOfItems = arr[0];
  totalPrice = arr[1];
  cartSpanFun();
}

//Handle The Cart Span
function cartSpanFun() {
  let iContainer = document.querySelector(".the-main-title .cart-icon i");
  iContainer.innerHTML = "";
  let span = document.createElement("span");
  span.textContent = `${numberOfItems}`;
  iContainer.appendChild(span);
}

// Fuction Get the Real Number Of Items In Cart Array
function getRealItemsInCart() {
  let number = 0;
  let price = 0;
  for (let i = 0; i < cartArr.length; i++) {
    number += cartArr[i].count;
    price += (cartArr[i].product.price * cartArr[i].count);
  }
  price = Number(price.toFixed(2));
  return [number, price];
}

// Function Handle The Cart Page On Load
function cartPageOnLoad() {
  showCartItems();
}

// Function Show Cart Data Items
function showCartItems() {
  let cartItemsContianer = document.querySelector(".main-cart .items");
  cartItemsContianer.innerHTML = "";
  let temp = "";

  cartArr.forEach((item, index) => {
    temp += `<div class="item">
      <div class="left">
        <div onclick="showProductInCart(${item.product.id})" class="image">
          <img src="${item.product.image}">
        </div>
        <div class="content">
          <p onclick="showProductInCart(${item.product.id})" class="product-title">${item.product.title}</p>
          <p class="product-category">${item.product.category}</p>
          <p class="price">$ ${item.product.price}</p>
          <div class="handle-product-number">
            <div class="number">
              <span onclick="handleCountItem(this , ${item.id})" class="neg">-</span>
              <span class="items-number">${item.count}</span>
              <span onclick="handleCountItem(this , ${item.id})" class="add">+</span>
            </div>
            <div onclick="removeItemFromCart(${index})" class="delete-item">
              <i class="fa fa-trash"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="right-total-price">$${item.count * item.product.price}</div>
    </div>`;
  });

  cartItemsContianer.innerHTML = temp;
  document.querySelector(".sub-total").innerHTML ="$" + String(totalPrice);
  document.querySelector(".total-price-all").innerHTML ="$"+ String(totalPrice);
}

// Handle The Count Of Items
function handleCountItem(button, id) {
  let itemDiv = button.closest(".item");
  let index = -1;

  for (let i = 0; i < cartArr.length; i++) {
    if (Number(cartArr[i].id) === Number(id)) index = i;
  }

  let count = cartArr[index].count;
  console.log(count);

  if (button.classList.contains("neg")) {
    if (count - 1 === 0) {
      removeItemFromCart(index);
      return;
    } else {
      count--;
      cartArr[index].count--;
      itemDiv.querySelector(".items-number").innerHTML = count;
      window.localStorage.setItem("cart", JSON.stringify(cartArr));
    }
  } else if (button.classList.contains("add")) {
    if (count + 1 <= 3) {
      count++;
      cartArr[index].count++;
      itemDiv.querySelector(".items-number").innerHTML = count;
      window.localStorage.setItem("cart", JSON.stringify(cartArr));
    }
  }

  itemDiv.querySelector(".right-total-price").innerHTML = "$ "+(cartArr[index].count * cartArr[index].product.price).toFixed(2);

  let obj = getRealItemsInCart();
  totalPrice = obj[1];
  numberOfItems = obj[0];
  cartSpanFun();

  document.querySelector(".sub-total").innerHTML ="$" + String(totalPrice);
  document.querySelector(".total-price-all").innerHTML ="$"+ String(totalPrice);
}

// function Remove Item From The Cart
function removeItemFromCart(index) {
  let cartItemsContianer = document.querySelectorAll(".main-cart .items .item");
  cartArr.splice(index, 1);
  window.localStorage.setItem("cart", JSON.stringify(cartArr));
  cartItemsContianer[index].remove();

  let temp = getRealItemsInCart();
  numberOfItems = temp[0];
  totalPrice = temp[1];
  cartSpanFun();

  document.querySelector(".sub-total").innerHTML ="$" + String(totalPrice);
  document.querySelector(".total-price-all").innerHTML ="$"+ String(totalPrice);
}

// Handle Clear All
function clearAllCartItems() {
  window.localStorage.removeItem("cart");
  cartArr = [];
  let con = document.querySelector(".main-cart .items");
  if (con) con.innerHTML = "";

  let arr = getRealItemsInCart();
  totalPrice = arr[1];
  numberOfItems = arr[0];
  cartSpanFun();

   document.querySelector(".sub-total").innerHTML ="$" + String(totalPrice);
  document.querySelector(".total-price-all").innerHTML ="$"+ String(totalPrice);
}

// Function Handle Product SHow In Card Page
function showProductInCart(id) {
  window.sessionStorage.setItem("productId", id);
  window.location.href = "productPage.html";
}
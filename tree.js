
// common function
// CART
let cart = [];

const removeClass = (className) => {
  const allBtns = document.getElementsByClassName("btn-tree");
  for (const btn of allBtns) {
    btn.classList.remove("active");
  }
};

// 1. =======> LOAD TREE CATEGORIES <======

const loadCategories = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

// 1.=======> DISPLAY TREE CATEGORIES <======
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categories-container");
  //   categoriesContainer.innerHTML = "";
  //   get into categories
  for (const category of categories) {
    const { id, category_name } = category;
    const div = document.createElement("div");
    div.className = "my-2";
    div.innerHTML = `
    <button onclick="loadCategoryTrees(${id})"  id="category${id}" class="btn btn-tree lg:w-full hover:bg-green-400">${category_name}</button>
    `;
    categoriesContainer.appendChild(div);
    manageSpinner(false);
  }
};
// 1.1 ========== LOAD CATEGORY TREES
const loadCategoryTrees = (id) => {
  removeClass("btn-tree");
  const clickedBtn = document.getElementById(`category${id}`);
  clickedBtn.classList.add("active");

  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const plants = data.plants;
      displayTrees(plants);
    });
};
// 1.2 ========== DISPLAY CATEGORY TREES
// 2. =========> LOAD ALL TRESS <=========

const loadAllTress = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayTrees(data.plants));
};

// 2. =========> DISPLAY ALL TRESS <=========

const displayTrees = (plants) => {
  const cardsContainer = document.getElementById("tree-cards-container");
  cardsContainer.innerHTML = "";
  //   get into each tree
  for (const plant of plants) {
    const { id, image, name, description, category, price } = plant;
    const div = document.createElement("div");
    div.className = "bg-white shadow-sm p-2 card flex  flex-col h-[420px]";

    div.innerHTML = `
    
    <figure class="h-[200px]">
        <img class=" w-full h-full object-cover"
      src="${image}"
      alt="${name}" />
      </figure>
      <div class="flex-1">
    <h2 onclick="loadDetails(${id})" class="card-title cursor-pointer mt-[10px] mb-[10px] ">
      ${name}
    </h2>
    <p>${description ? description.slice(0, 60) : "working on it"}</p>
    <div class="flex justify-between my-4">
      <div class="text-[#15803D] px-3 py-1 rounded-full bg-[#DCFCE7]">${category}</div>
      <div class="font-bold text-[#15803D]"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${price}</div>
    </div>
  </div>
  <button onclick="loadCart('${name}',${price},${id})" class="btn bg-[#15803D] text-white font-bold w-full rounded-full">Add to Cart</button>
    `;
    cardsContainer.append(div);
    manageSpinner(false);
  }
};

// all tress button control
document.getElementById("all-trees-btn").addEventListener("click", (e) => {
  removeClass("btn-tree");
  e.target.classList.add("active");
  loadAllTress();
});

// =====> load details <======

const loadDetails = (id) => {
  console.log(id);
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayDetails(data.plants));
};

// ======> Display Details <========

const displayDetails = (plant) => {
  const { name, image, description, category, price } = plant;
  const modalContainer = document.getElementById("modal-container");
  const modalBtn = document.getElementById("my_modal_5");
  modalContainer.innerHTML = "";

  //   create div
  const div = document.createElement("div");
  div.className = "bg-white  p-2 card flex flex-col";

  div.innerHTML = `
      <h2 class="card-title cursor-pointer mb-3">
      ${name}
    </h2>
      <figure class="h-[250px]">
        <img class=" w-full h-full object-cover"
      src="${image}"
      alt="${name}" />
      </figure>
      <div class="flex-1">
    <div class="my-4">
      <div class="text-[#15803D] px-3 py-1 rounded-full bg-[#DCFCE7]">
      <h2>Category: ${category}</h2>
      </div>
      <div class="">
      <h2 class="font-bold text-[#15803D] my-3"><i class="fa-solid fa-bangladeshi-taka-sign"></i>Price: ${price}</h2>
      <p>Description : ${description ? description : "working on it"}</p>
      </div>
    </div>
  </div>
    `;
  modalContainer.append(div);
  modalBtn.showModal();
};

// ======> Cart Control <=======
const loadCart = (treeName, price, id) => {
  const totalContainer = document.getElementById("total-bal");
  totalContainer.classList.remove("hidden");
  const treeInfo = {};
  treeInfo.name = treeName;
  treeInfo.price = price;
  treeInfo.id = id;
  cart.push(treeInfo);
  //   modal display
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = `
    <h2 class="text-2xl font-bold">${treeName} added to the cart</h2>
  `;
  document.getElementById("my_modal_5").showModal();
  displayCart(cart);
};
// DISPLAY CART
function displayCart(trees) {
  const cartContainer = document.getElementById("carts-container");
  cartContainer.innerHTML = "";
  const totalField = document.getElementById("total");
  if (trees.length === 0) {
    cartContainer.innerHTML = "";
    totalField.innerText = 0;
    document.getElementById("total-bal").classList.add("hidden");
    return;
  }

  let totalPrice = 0;
  for (const tree of trees) {
    const { name, price, id } = tree;
    totalPrice = parseInt(totalPrice) + price;

    const div = document.createElement("div");
    div.className = "flex items-center justify-between bg-[#F0FDF4] my-3";
    div.innerHTML += `
    <div>
    <h2>${name}</h2>
    <h2>${price}</h2>
    </div>
    <button onclick="filterCart(${id})" class="bg-gray-300 p-3 font-bold cursor-pointer text-xl">✕</button>
  `;
    cartContainer.append(div);
  }
  totalField.innerText = totalPrice;
}

function filterCart(id) {
  //   console.log(cart);
  cart = cart.filter((el) => el.id != id);
  displayCart(cart);
}

// Loader Control

function manageSpinner(status) {
  const loader = document.getElementById("loader");
  const cardsContainer = document.getElementById("carts-container");

  if (status === true) {
    loader.classList.remove("hidden");
    cardsContainer.classList.add("hidden");
  } else {
    loader.classList.add("hidden");
    cardsContainer.classList.remove("hidden");
  }
}

loadCategories();
loadAllTress();

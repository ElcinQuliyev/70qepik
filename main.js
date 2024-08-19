const productsElem = document.querySelector(".products");
const paginationElem = document.querySelector(".pagination");
const header = document.querySelector("header");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let globalData = [];
let globalData2 = [];
let url = "https://dummyjson.com/products?limit=194";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    globalData = data.products;
    domRender(data.products);
    createPagination(data.products);
  });

function createPagination(arr) {
  let maxLimit = Math.ceil(arr.length / 16);
  paginationElem.innerHTML = "";
  for (let i = 0; i < maxLimit; i++) {
    paginationElem.innerHTML += `<button onclick="getPagination(${i + 1})">${
      i + 1
    }</button>`;
  }
}
function getPagination(param) {
  let minIndex = (param - 1) * 16;
  let maxIndex = param * 16;
  if (globalData2.length) {
    domRender(globalData2, minIndex, maxIndex);
  } else {
    domRender(globalData, minIndex, maxIndex);
  }
}

function domRender(arr = globalData, min = 0, max = 16) {
  productsElem.innerHTML = "";
  arr.forEach((product, index) => {
    if (index >= min && index < max) {
      productsElem.innerHTML += `
      <div class="col-lg-3">
         <div class="product-item">
             <img
                 src="${product.thumbnail}">
             <h3>${product.title}</h3>
             <div class="prices">
                 <p class="price">${product.price} AZN</p>
                 <p>${(
                   product.price -
                   (product.price * product.discountPercentage) / 100
                 ).toFixed(2)} AZN</p>
             </div>
             <div class="icons">
                 <span>
                     <i class="bi bi-heart"></i>
                 </span>
                 <span>
                     <i class="bi bi-cart"></i>
                 </span>
             </div>
         </div>
     </div>`;
    }
  });
}

window.onscroll = () => {
  header.style.top = "-200px";
  console.log(window.scrollY);
  if (window.scrollY >= 200) {
    header.style.top = "0";
  } else if (window.scrollY === 0) {
    header.style.top = "0";
  }
};

searchInput.addEventListener("input", (e) => {
  let searchList = globalData.filter(
    (product) =>
      product.title.toLowerCase().includes(e.target.value.toLowerCase()) &&
      product.description.toLowerCase().includes(e.target.value.toLowerCase())
  );

  globalData2 = searchList;

  domRender(searchList);
  createPagination(searchList);
});

sortSelect.addEventListener("input", (e) => {
  if (globalData2.length) {
    setSwitch(globalData2, e.target.value);
  } else {
    setSwitch(globalData, e.target.value);
  }
});

function setSwitch(arr, value) {
  switch (value) {
    case "0":
      arr.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "1":
      arr.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "2":
      arr.sort((a, b) => a.price - b.price);
      break;
    case "3":
      arr.sort((a, b) => b.price - a.price);
      break;
  }

  domRender(arr);
}

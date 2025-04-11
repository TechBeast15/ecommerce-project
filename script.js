// === Sign Up PopUp - HEADER ===
function removeMePopUP() {
  const signUpPopUp = document.querySelector(".signUpPopUp");
  if (signUpPopUp) signUpPopUp.style.display = "none";
}

// === NavBar Link Toggle ===
function navBarLinkShowFunction() {
  document
    .querySelectorAll(".ulLiHum")
    .forEach((li) => li.classList.toggle("HideClassToggle"));
}

// === OUR HAPPY CUSTOMERS - Slide Bar ===
const mySlidesDiv = document.getElementById("mySlidesDiv");
let scrollNum = 0;

function autoSlideFunction(val) {
  if (!mySlidesDiv) return;

  scrollNum += val;

  mySlidesDiv.scrollTo({
    top: 0,
    left: scrollNum,
    behavior: "smooth",
  });

  if (scrollNum + mySlidesDiv.clientWidth >= mySlidesDiv.scrollWidth) {
    scrollNum = 0; // Smooth loop
  }
}
setInterval(() => autoSlideFunction(130), 1000);

// SAVE CARD WITH INFORMATION - IMAGE CARD IN LOCALSTORAGE
const allCards = document.querySelectorAll(".card");

allCards.forEach((card) => {
  card.addEventListener("click", () => {
    console.log(card);

    let imgCard = card.children[0].src;
    let nameCard = card.children[1].children[0].innerHTML;
    let ratingCard = card.children[1].children[1].innerHTML;
    let priceCard = card.children[1].children[2].innerHTML;

    const cardData = {
      img: imgCard,
      name: nameCard,
      rating: ratingCard,
      price: priceCard,
    };

    localStorage.setItem("cardInformation", JSON.stringify(cardData));

    // ✅ Now redirect
    window.location.href = "./zoomCard.html";
  });
});

// SHOW CARD INFOMATION ON ZOOM CARD PAGE - ZOOM
const zoomCardImage = document.getElementById("zoomCardImage");
const cardTitleZoom = document.getElementById("cardTitleZoom");
const ratingDivZoom = document.getElementById("ratingDivZoom");
const priceZoom = document.getElementById("priceZoom");

let cardDetailsData = JSON.parse(localStorage.getItem("cardInformation"));

if (
  cardDetailsData &&
  zoomCardImage &&
  cardTitleZoom &&
  ratingDivZoom &&
  priceZoom
) {
  zoomCardImage.src = cardDetailsData.img;
  cardTitleZoom.innerHTML = cardDetailsData.name;
  ratingDivZoom.innerHTML = cardDetailsData.rating;
  priceZoom.innerHTML = cardDetailsData.price;
} else if (!cardDetailsData && zoomCardImage) {
  console.warn("No card data found.");
  // Optionally redirect if no data
  // window.location.href = "index.html";
}

// AFTER SHOW DATA SELECT SIZE +++++++++++++++++++++++++++++++++++++

// === SIZE SELECT FUNCTIONALITY ===
document.querySelectorAll(".sizeToggleButton").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".sizeToggleButton")
      .forEach((b) => b.classList.remove("activeSize"));
    btn.classList.add("activeSize");
  });
});

// === ZOOM QUANTITY & PRICE HANDLING ===
const quantityZoomID = document.getElementById("quantityZoomID");
const priceZoomID = document.getElementById("priceZoom");

if (quantityZoomID && priceZoomID) {
  let quaZoom = 1;
  quantityZoomID.innerHTML = quaZoom;

  const unitPrice = Number(priceZoomID.innerHTML.split("$")[1] || "0");
  priceZoomID.innerHTML = `$${unitPrice.toFixed(2)}`;

  window.quantityZoomFunction = function (quantity) {
    quaZoom = Math.max(1, quaZoom + quantity);
    const totalPrice = unitPrice * quaZoom;
    quantityZoomID.innerHTML = quaZoom;
    priceZoomID.innerHTML = `$${totalPrice.toFixed(2)}`;
  };
}

// ADD TO CART FUNCTION GONNA BE STORE ++++++++++++++++++++++++++++++++

// === ADD TO CART FUNCTION ===

function AddToCartFunction() {
  const quantity = parseInt(
    document.getElementById("quantityZoomID")?.innerHTML || "1"
  );
  const priceText = document.getElementById("priceZoom")?.innerHTML;
  const title = document.getElementById("cardTitleZoom")?.innerHTML;
  const img = document.getElementById("zoomCardImage")?.src;
  const size = document.querySelector(".activeSize")?.innerHTML;

  if (quantity && priceText && title && img && size) {
    const unitPrice = parseFloat(priceText.replace("$", "")) / quantity;

    const item = {
      title,
      size,
      price: `$${(unitPrice * quantity).toFixed(2)}`,
      quantity,
      img,
    };
    const storeCartData =
      JSON.parse(localStorage.getItem("shoppingData")) || [];

    // Check if the same title and size already exists
    const existingIndex = storeCartData.findIndex(
      (product) => product.title === title && product.size === size
    );

    if (existingIndex !== -1) {
      // ✅ Update quantity and price
      const existingItem = storeCartData[existingIndex];
      const newQuantity = parseInt(existingItem.quantity) + quantity;
      storeCartData[existingIndex].quantity = newQuantity;
      storeCartData[existingIndex].price = `$${(
        unitPrice * newQuantity
      ).toFixed(2)}`;
    } else {
      // ✅ Add as new entry
      storeCartData.push(item);
    }

    localStorage.setItem("shoppingData", JSON.stringify(storeCartData));
    updateCartNum(); // update after adding

    window.location.href = "./addToCart.html";
  } else {
    alert("Please select a size before adding to cart!");
  }
}



// === DISPLAY CART DATA ===
const shoppingDataDiv = document.getElementById("shoppingDataDiv");

function DisplayShoppingData() {
  const data = JSON.parse(localStorage.getItem("shoppingData")) || [];
  if (!shoppingDataDiv) return;

  shoppingDataDiv.innerHTML =
    data.length === 0 ? "<p>Your cart is empty.</p>" : "";

  data.forEach((item, index) => {
    const createDiv = document.createElement("div");
    createDiv.classList.add("createDiv");

    createDiv.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div class="createBody">
        <h5 class="createTitle">${item.title}</h5>
        <p><b>Size</b> : ${item.size}</p>
        <p class="createPrice">${item.price}</p>
        <button class="createDeleteBtn" onclick="RemoveShoppingData(${index})">
          <i class="bi bi-trash3-fill"></i>
        </button>
        <div class="createQuantityDiv">
          <button id="quantityButton" onclick="quantityFunction(${index}, -1)">-</button>
          <span id="quantityShow" >${item.quantity}</span>
          <button id="quantityButton" onclick="quantityFunction(${index}, 1)">+</button>
        </div>
      </div>
    `;

    shoppingDataDiv.appendChild(createDiv);
  });

  DisplayBillingFunction();
}
DisplayShoppingData();

// === REMOVE ITEM FROM CART ===
function RemoveShoppingData(index) {
  const data = JSON.parse(localStorage.getItem("shoppingData")) || [];
  data.splice(index, 1);
  localStorage.setItem("shoppingData", JSON.stringify(data));
  DisplayShoppingData();
  updateCartNum(); // update after removing

}

// === UPDATE QUANTITY IN CART ===
function quantityFunction(index, change) {
  const data = JSON.parse(localStorage.getItem("shoppingData")) || [];
  if (!data[index]) return;

  const currentQuantity = Math.max(1, parseInt(data[index].quantity) + change);
  const unitPrice =
    parseFloat(data[index].price.replace("$", "")) /
    parseInt(data[index].quantity);
  const newTotalPrice = unitPrice * currentQuantity;

  data[index].quantity = currentQuantity;
  data[index].price = `$${newTotalPrice.toFixed(2)}`;
  localStorage.setItem("shoppingData", JSON.stringify(data));
  DisplayShoppingData();
  updateCartNum(); // update after changing quantity

}

// === BILLING CALCULATIONS ===
function DisplayBillingFunction() {
  const Subtotal = document.getElementById("Subtotal");
  const DiscountAmount = document.getElementById("DiscountAmount");
  const TotalAmount = document.getElementById("TotalAmount");
  const DeliveryFee = document.getElementById("DeliveryFee");

  const data = JSON.parse(localStorage.getItem("shoppingData")) || [];
  const dFee = 15;

  const SubtotalShow = data.reduce(
    (total, item) => total + parseFloat(item.price.replace("$", "")),
    0
  );

  const Discount = (SubtotalShow * 10) / 100;
  const totalAfterDiscount = SubtotalShow - Discount + dFee;

  if (Subtotal) Subtotal.innerHTML = `$${SubtotalShow.toFixed(2)}`;
  if (DiscountAmount) DiscountAmount.innerHTML = `- $${Discount.toFixed(2)}`;
  if (TotalAmount) TotalAmount.innerHTML = `$${totalAfterDiscount.toFixed(2)}`;
  if (DeliveryFee) DeliveryFee.innerHTML = `$${dFee.toFixed(2)}`;
}
DisplayBillingFunction();

// FILTER CLOTHES SECTION

const filterClothesSectionClass = document.querySelectorAll(
  ".filterClothesSectionClass"
);

function filterClothesSection(id) {
  filterClothesSectionClass.forEach((section) => {
    console.log(section);

    section.classList.add("aciveSection");

    if (section.id === id) {
      section.classList.remove("aciveSection");
    }
  });

  const aside = document.querySelector("aside");
  aside.classList.toggle("filterOpa")
}

function showFilterCate(btn) {
  const aside = document.querySelector("aside");
  aside.classList.toggle("filterOpa")
}


function cartPageShowFunction(){
  window.location.href = "./addToCart.html"
}

function homePageFunction(){
  window.location.href = "./index.html"
}

function catePAgeNavi(){
  window.location.href = "./categories.html"
}


// const cartNum = document.getElementById("cartNum");

function updateCartNum() {
  const cartNum = document.getElementById("cartNum");
  const cartData = JSON.parse(localStorage.getItem("shoppingData")) || [];

  const totalItems = cartData.reduce(
    (sum, item) => sum + parseInt(item.quantity),
    0
  );

  if (cartNum) cartNum.innerText = totalItems;
}

updateCartNum(); // when script loads

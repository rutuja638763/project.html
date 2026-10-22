
const products = [
  {
    id: 1, name: "Ceramic Vase", category: "Home",
    price: 799,
    image: "photo-1578500494198-246f612d3b3d"
  },
  {
    id: 2, name: "Everyday Tote", category: "Accessories",
    price: 499,
    image: "photo-1544816155-12df9643f363"
  },
  {
    id: 3, name: "Glow Serum", category: "Beauty",
    price: 649,
    image: "photo-1608248543803-ba4f8c70ae0b"
  },
  {
    id: 4, name: "Daily Bottle", category: "Lifestyle",
    price: 599,
    image: "photo-1602143407151-7111542de6e8"
  },
  {
    id: 5, name: "Linen Cushion", category: "Home",
    price: 899,
    image: "photo-1584100936595-c0654b55a2e2"
  },
  {
    id: 6, name: "Classic Watch", category: "Accessories",
    price: 1299,
    image: "photo-1524805444758-089113d48a6d"
  }
];

const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

const imageURL = id =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

let selectedCategory = "All";
let cart = {};

function renderFilters() {
  const categories = [
    "All",
    ...new Set(products.map(product => product.category))
  ];

  document.getElementById("filters").innerHTML =
    categories.map(category => `
      <button class="filter ${
        category === selectedCategory ? "active" : ""
      }" onclick="selectCategory('${category}')">
        ${category}
      </button>
    `).join("");
}

function selectCategory(category) {
  selectedCategory = category;
  renderFilters();
  renderProducts();
}

function renderProducts() {
  const query = document.getElementById("search").value
    .trim().toLowerCase();

  const filtered = products.filter(product =>
    (selectedCategory === "All" ||
      product.category === selectedCategory) &&
    product.name.toLowerCase().includes(query)
  );

  const grid = document.getElementById("product-grid");

  if (!filtered.length) {
    grid.innerHTML = "<p>No products found. Try another search.</p>";
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product">
      <div class="product-image">
        <img src="${imageURL(product.image)}"
          alt="${product.name}" loading="lazy">
        <button class="add-btn"
          onclick="addToCart(${product.id})">
          Add to Cart +
        </button>
      </div>
      <p class="category-label">${product.category}</p>
      <div class="product-info">
        <h3>${product.name}</h3>
        <strong>${money(product.price)}</strong>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  document.getElementById("overlay").classList.add("show");
}

function changeQuantity(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) delete cart[id];

  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function renderCart() {
  const items = products.filter(product => cart[product.id]);
  const count = items.reduce((sum, p) => sum + cart[p.id], 0);

  const subtotal = items.reduce(
    (sum, p) => sum + p.price * cart[p.id], 0
  );

  const shipping = subtotal === 0 || subtotal >= 1499 ? 0 : 79;
  const total = subtotal + shipping;

  document.getElementById("cart-count").textContent = count;
  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("shipping").textContent =
    shipping ? money(shipping) : "Free";
  document.getElementById("total").textContent = money(total);
  document.getElementById("checkout-total").textContent = money(total);

  document.getElementById("cart-items").innerHTML = items.length
    ? items.map(p => `
      <div class="cart-item">
        <img src="${imageURL(p.image)}" alt="${p.name}">
        <div class="cart-item-details">
          <strong>${p.name}</strong>
          <p>${money(p.price)}</p>
          <div class="quantity">
            <button onclick="changeQuantity(${p.id}, -1)">−</button>
            <span>${cart[p.id]}</span>
            <button onclick="changeQuantity(${p.id}, 1)">+</button>
            <button class="remove"
              onclick="removeFromCart(${p.id})">Remove</button>
          </div>
        </div>
      </div>
    `).join("")
    : "<p>Your cart is empty. Start shopping!</p>";

  document.querySelector(
    ".cart-summary .primary-btn"
  ).disabled = count === 0;
}

function toggleCart() {
  document.getElementById("overlay").classList.toggle("show");
}

function closeCart(event) {
  if (event.target.id === "overlay") toggleCart();
}

function openCheckout() {
  if (!Object.keys(cart).length) return;

  document.getElementById("overlay").classList.remove("show");
  document.getElementById("checkout-overlay").classList.add("show");
}

function closeCheckout() {
  document.getElementById("checkout-overlay").classList.remove("show");
}

document.getElementById("checkout-form").addEventListener(
  "submit", function(event) {
    event.preventDefault();

    if (!Object.keys(cart).length) {
      alert("Your cart is empty.");
      closeCheckout();
      return;
    }

    alert(
      "Demo order placed successfully! No payment was collected."
    );

    cart = {};
    renderCart();
    this.reset();
    closeCheckout();
  }
);

renderFilters();
renderProducts();
renderCart();

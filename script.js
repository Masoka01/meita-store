const WA_NUMBER = "6282178679286";

const products = [
  {
    id: 1,
    name: "Editing sesuai request",
    price: 25000,
    img: "image/hero.webp",
  },
  {
    id: 2,
    name: "Editing rekomendasi admin",
    price: 22000,
    img: "image/hero.webp",
  },
  { id: 3, name: "Frame template", price: 1000, img: "image/frame.webp" },
  {
    id: 4,
    name: "Pamflet",
    price: 22000,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 5,
    name: "Poster",
    price: 25000,
    img: "image/poster.webp",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

/* ===========================
   RENDER PRODUK
=========================== */

function renderProducts() {
  productList.innerHTML = "";
  products.forEach((p) => {
    productList.innerHTML += `
<div class="col-md-4">
<div class="card-product">

<img src="${p.img}" 
     class="product-img"
     onclick="openImage('${p.img}')">

<div class="card-body">
<h5>${p.name}</h5>
<div class="price">Rp ${p.price.toLocaleString()}</div>
<button class="btn btn-primary mt-auto" onclick="addCart(${p.id})">
Tambah Keranjang
</button>
</div>

</div>
</div>`;
  });
}

/* ===========================
   IMAGE PREVIEW
=========================== */

function openImage(src) {
  const img = document.getElementById("modalImage");
  img.style.animation = "none";
  img.offsetHeight; // reset animation
  img.style.animation = "popImage .25s ease";
  img.src = src;

  new bootstrap.Modal(document.getElementById("imageModal")).show();
}

/* ===========================
   CART
=========================== */

function addCart(id) {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty++;
  else {
    const p = products.find((x) => x.id === id);
    cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
  }
  saveCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((i) => {
    const sub = i.price * i.qty;
    total += sub;

    cartItems.innerHTML += `
<div class="cart-item">
<div>
<b>${i.name}</b><br>
${i.qty} x Rp ${i.price.toLocaleString()}
</div>
<div>
<button onclick="changeQty(${i.id},-1)">-</button>
<button onclick="changeQty(${i.id},1)">+</button>
</div>
</div>`;
  });

  cartTotal.textContent = total.toLocaleString();
  cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);
}

function changeQty(id, val) {
  const item = cart.find((i) => i.id === id);
  item.qty += val;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* CLEAR CART */

document.getElementById("clearCart").onclick = () => {
  cart = [];
  saveCart();
};

/* CHECKOUT */

document.getElementById("checkoutBtn").onclick = () => {
  if (cart.length === 0) return;

  const nameInput = document.getElementById("custName");
  const errorText = document.getElementById("nameError");
  const name = nameInput.value.trim();

  // VALIDASI NAMA (WAJIB)
  if (!name) {
    nameInput.classList.add("input-error");
    errorText.classList.remove("d-none");
    nameInput.focus();
    return;
  }

  // reset error
  nameInput.classList.remove("input-error");
  errorText.classList.add("d-none");

  let msg = `PESANAN JASA EDITING\nNama: ${name}\n\n`;
  let total = 0;

  cart.forEach((i, n) => {
    const sub = i.price * i.qty;
    total += sub;
    msg += `${n + 1}. ${i.name}\n${i.qty} x ${i.price}\nSubtotal: ${sub}\n\n`;
  });

  msg += `TOTAL: ${total}`;

  const note = document.getElementById("custNote").value;
  if (note) msg += `\n\nCatatan:\n${note}`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`);
};

/* DARK MODE */

document.getElementById("darkToggle").onclick = () => {
  const t = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    t === "dark" ? "light" : "dark",
  );
};

/* INIT */

renderProducts();
renderCart();

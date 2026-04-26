/* ============================
   CONFIG
   ============================ */
const WA_NUMBER = "6282178679286";

const products = [
  {
    id: 1,
    name: "Editing Sesuai Request",
    price: 25000,
    img: "image/hero.webp",
  },
  {
    id: 2,
    name: "Editing Rekomendasi Admin",
    price: 22000,
    img: "image/hero.webp",
  },
  { id: 3, name: "Frame Template", price: 1000, img: "image/frame.webp" },
  {
    id: 4,
    name: "Pamflet",
    price: 22000,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  },
  { id: 5, name: "Poster", price: 25000, img: "image/poster.webp" },
];

let cart = JSON.parse(localStorage.getItem("jasaedit_cart")) || [];

/* ============================
   RENDER PRODUCTS
   ============================ */
function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card-product";
    card.style.transitionDelay = `${i * 80}ms`;
    card.innerHTML = `
      <div class="img-container" onclick="openPreview('${p.img}')">
        <img src="${p.img}" class="product-img" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'">
      </div>
      <div class="card-body">
        <div>
          <h5>${p.name}</h5>
          <div class="price-tag">Rp ${p.price.toLocaleString("id-ID")}</div>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${p.id}, event)">
          Tambah ke Keranjang <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    `;
    list.appendChild(card);
  });

  // Intersection Observer for staggered reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".card-product")
    .forEach((card) => observer.observe(card));
}

/* ============================
   RENDER CART
   ============================ */
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const navCartPrice = document.getElementById("navCartPrice");
  const badge = document.getElementById("cartBadgeCanvas");

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-bag-x"></i>
        <p>Keranjang masih kosong.<br>Yuk pilih layananmu!</p>
      </div>`;
  } else {
    cartItems.innerHTML = "";
    cart.forEach((item) => {
      total += item.price * item.qty;
      count += item.qty;

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">Rp ${item.price.toLocaleString("id-ID")} / item</div>
        </div>
        <div class="qty-capsule">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Kurangi">
            <i class="bi bi-dash"></i>
          </button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Tambah">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      `;
      cartItems.appendChild(row);
    });
  }

  const fmt = "Rp " + total.toLocaleString("id-ID");
  cartTotal.innerText = fmt;
  navCartPrice.innerText = fmt;

  cartCount.innerText = count;
  cartCount.style.display = count > 0 ? "flex" : "none";

  badge.innerText = `${count} item`;
}

/* ============================
   CART LOGIC
   ============================ */
function addToCart(id, event) {
  const p = products.find((x) => x.id === id);
  const exist = cart.find((x) => x.id === id);

  if (exist) exist.qty++;
  else cart.push({ ...p, qty: 1 });

  save();

  // Button feedback
  const btn = event.currentTarget;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `<i class="bi bi-check2-circle"></i> Ditambahkan!`;
  btn.style.background = "var(--accent)";
  btn.style.borderColor = "var(--accent)";
  btn.style.color = "white";
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = "";
    btn.style.borderColor = "";
    btn.style.color = "";
    btn.disabled = false;
  }, 900);
}

function updateQty(id, change) {
  const item = cart.find((x) => x.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter((x) => x.id !== id);
  save();
}

function save() {
  localStorage.setItem("jasaedit_cart", JSON.stringify(cart));
  renderCart();
}

/* ============================
   CLEAR CART
   ============================ */
document.getElementById("clearCart").addEventListener("click", () => {
  if (cart.length === 0) return;
  cart = [];
  save();
});

/* ============================
   CHECKOUT
   ============================ */
document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) return;

  const nameInput = document.getElementById("custName");
  const name = nameInput.value.trim();
  const errEl = document.getElementById("nameError");

  if (!name) {
    errEl.classList.remove("d-none");
    nameInput.focus();
    nameInput.style.borderColor = "#e74c3c !important";
    return;
  }
  errEl.classList.add("d-none");

  const btn = this;
  const oldHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Mengalihkan...`;

  setTimeout(() => {
    let msg = `Halo JasaEdit! Saya *${name}* ingin memesan:\n\n`;
    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} (${item.qty}x) — Rp ${(item.price * item.qty).toLocaleString("id-ID")}\n`;
    });

    const total = document.getElementById("cartTotal").innerText;
    const note = document.getElementById("custNote").value.trim();

    msg += `\n*Total: ${total}*`;
    if (note) msg += `\n\nCatatan: ${note}`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`);

    btn.disabled = false;
    btn.innerHTML = oldHTML;
  }, 800);
});

/* ============================
   IMAGE MODAL
   ============================ */
function openPreview(src) {
  const img = document.getElementById("modalImage");
  img.src = src;
  new bootstrap.Modal(document.getElementById("imageModal")).show();
}

/* ============================
   DARK MODE
   ============================ */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.querySelector("#darkToggle i");
  icon.className =
    theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  localStorage.setItem("jasaedit_theme", theme);
}

document.getElementById("darkToggle").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// Load saved theme
const savedTheme = localStorage.getItem("jasaedit_theme") || "dark";
applyTheme(savedTheme);

/* ============================
   NAVBAR SCROLL
   ============================ */
window.addEventListener(
  "scroll",
  () => {
    const nav = document.getElementById("mainNav");
    nav.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

/* ============================
   INIT
   ============================ */
renderProducts();
renderCart();

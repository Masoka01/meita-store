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
  { id: 5, name: "Poster", price: 25000, img: "image/poster.webp" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- RENDER PRODUK ---
function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p) => {
    list.innerHTML += `
      <div class="col-lg-4 col-md-6">
        <div class="card-product">
          <div class="img-container" onclick="openPreview('${p.img}')">
            <img src="${p.img}" class="product-img" alt="${p.name}">
          </div>
          <div class="card-body">
            <div>
              <h5>${p.name}</h5>
              <div class="price-tag">Rp ${p.price.toLocaleString()}</div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
                Tambah Keranjang <i class="bi bi-plus-lg ms-1"></i>
            </button>
          </div>
        </div>
      </div>`;
  });
}

// --- RENDER KERANJANG (UPDATE TAMPILAN 1 BARIS) ---
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const navCartPrice = document.getElementById("navCartPrice");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x text-muted" style="font-size: 3rem;"></i>
        <p class="text-muted mt-3">Keranjang kosong.</p>
      </div>`;
  }

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    // Tampilan Item Keranjang Baru (Capsule Style)
    cartItems.innerHTML += `
      <div class="cart-item">
        <div class="d-flex flex-column">
          <span class="fw-bold" style="font-size: 0.95rem;">${item.name}</span>
          <span class="text-muted" style="font-size: 0.85rem;">Rp ${item.price.toLocaleString()}</span>
        </div>
        
        <div class="qty-capsule">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)"><i class="bi bi-dash"></i></button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)"><i class="bi bi-plus"></i></button>
        </div>
      </div>`;
  });

  const fmtTotal = "Rp " + total.toLocaleString();
  cartTotal.innerText = fmtTotal;
  navCartPrice.innerText = fmtTotal;
  cartCount.innerText = count;

  // Sembunyikan badge jika 0
  cartCount.style.display = count > 0 ? "flex" : "none";
}

// --- LOGIC CART ---
function addToCart(id) {
  const p = products.find((x) => x.id === id);
  const exist = cart.find((x) => x.id === id);

  if (exist) exist.qty++;
  else cart.push({ ...p, qty: 1 });

  save();

  // Feedback visual sederhana pada tombol
  const btn = event.currentTarget;
  const originalText = btn.innerHTML;
  btn.innerHTML = `<i class="bi bi-check2"></i> Masuk!`;
  btn.style.background = "var(--accent)";
  btn.style.color = "white";
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = "";
    btn.style.color = "";
  }, 800);
}

function updateQty(id, change) {
  const item = cart.find((x) => x.id === id);
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter((x) => x.id !== id);
  save();
}

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// --- HAPUS SEMUA (TANPA ALERT) ---
document.getElementById("clearCart").onclick = () => {
  // Langsung eksekusi
  cart = [];
  save();
};

// --- CHECKOUT (ANIMASI LOADING) ---
document.getElementById("checkoutBtn").onclick = function () {
  if (cart.length === 0) return;

  const nameInput = document.getElementById("custName");
  const name = nameInput.value.trim();

  if (!name) {
    document.getElementById("nameError").classList.remove("d-none");
    nameInput.focus();
    return;
  }
  document.getElementById("nameError").classList.add("d-none");

  // Animasi Loading Tombol
  const btn = this;
  const oldText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Mengalihkan...`;

  setTimeout(() => {
    let msg = `Halo JasaEdit, saya *${name}* ingin memesan:\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.qty}x) - Rp ${(item.price * item.qty).toLocaleString()}\n`;
    });

    const total = document.getElementById("cartTotal").innerText;
    const note = document.getElementById("custNote").value;

    msg += `\n*Total Bayar: ${total}*`;
    if (note) msg += `\nCatatan: ${note}`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`);

    btn.disabled = false;
    btn.innerHTML = oldText;
  }, 800); // Delay 0.8 detik biar berasa "loading"
};

// --- MODAL IMAGE ---
function openPreview(src) {
  document.getElementById("modalImage").src = src;
  new bootstrap.Modal(document.getElementById("imageModal")).show();
}

// --- DARK MODE ---
document.getElementById("darkToggle").onclick = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);

  const icon = document.querySelector("#darkToggle i");
  icon.className = newTheme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars";
};

// INITIALIZATION
renderProducts();
renderCart();

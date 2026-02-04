const WA_NUMBER = "6282178679286";

// Tetap pakai data Anda, gambar tidak berubah source-nya
const products = [
  { id: 1, name: "Editing sesuai request", price: 25000, img: "image/hero.webp" },
  { id: 2, name: "Editing rekomendasi admin", price: 22000, img: "image/hero.webp" },
  { id: 3, name: "Frame template", price: 1000, img: "image/frame.webp" },
  { id: 4, name: "Pamflet", price: 22000, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
  { id: 5, name: "Poster", price: 25000, img: "image/poster.webp" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((p) => {
    productList.innerHTML += `
      <div class="col-lg-4 col-md-6">
        <div class="card-product">
          <div class="img-container" onclick="openPreview('${p.img}')">
            <img src="${p.img}" class="product-img" alt="${p.name}">
          </div>
          <div class="card-body">
            <h5>${p.name}</h5>
            <span class="price-tag">Rp ${p.price.toLocaleString()}</span>
            <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
                Tambah <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </div>`;
  });
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const navCartPrice = document.getElementById("navCartPrice");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="text-center py-5 text-muted">Keranjang kosong</div>`;
  }

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <div class="fw-bold" style="font-size:14px">${item.name}</div>
          <small class="text-muted">Rp ${item.price.toLocaleString()}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span class="fw-bold">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>`;
  });

  cartTotal.innerText = `Rp ${total.toLocaleString()}`;
  navCartPrice.innerText = `Rp ${total.toLocaleString()}`;
  cartCount.innerText = count;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const exists = cart.find(item => item.id === id);
  if (exists) {
    exists.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveAndRender();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function openPreview(src) {
  document.getElementById("modalImage").src = src;
  new bootstrap.Modal(document.getElementById("imageModal")).show();
}

// Event Listeners
document.getElementById("clearCart").onclick = () => {
  if(confirm("Hapus semua item?")) { cart = []; saveAndRender(); }
};

document.getElementById("darkToggle").onclick = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    document.querySelector("#darkToggle i").className = isDark ? "bi bi-moon-stars" : "bi bi-sun";
};

document.getElementById("checkoutBtn").onclick = () => {
    const name = document.getElementById("custName").value.trim();
    if(!name) {
        document.getElementById("nameError").classList.remove("d-none");
        return;
    }
    
    let message = `Halo JasaEdit, saya *${name}* mau order:\n\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.qty}x)\n`;
    });
    message += `\n*Total: ${document.getElementById("cartTotal").innerText}*\n`;
    message += `Catatan: ${document.getElementById("custNote").value || "-"}`;
    
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`);
};

// Start
renderProducts();
renderCart(); 
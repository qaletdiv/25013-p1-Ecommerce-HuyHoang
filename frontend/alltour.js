/* ================== USER LOGIN ================== */
const user = JSON.parse(localStorage.getItem("user"));
const account = document.getElementById("account");
const register = document.getElementById("register");
const shop = document.getElementById("shop");

if (user) {
  account.innerHTML = "Tài khoản của tôi";
  account.href = "profile.html";
  register.innerHTML = "Đăng xuất";
  register.href = "#";
  register.addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("Bạn đã đăng xuất thành công");
    location.href = "login.html";
  });
} else if (shop) {
  shop.style.display = "none";
}

/* ================== PAGINATION CONFIG ================== */
const toursPerPage = 4;
let currentPage = 1;
let toursData = []; // 🔴 NGUỒN DỮ LIỆU DUY NHẤT

/* ================== FETCH ALL TOURS ================== */
async function fetchTours() {
  try {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) throw new Error("Không lấy được dữ liệu");
    const data = await res.json();

    toursData = data;
    currentPage = 1;
    renderTours(currentPage);
  } catch (err) {
    document.getElementById("tourList").innerHTML =
      `<p style="color:red">${err.message}</p>`;
  }
}

/* ================== RENDER TOURS ================== */
function renderTours(page) {
  const start = (page - 1) * toursPerPage;
  const end = start + toursPerPage;
  const pagedTours = toursData.slice(start, end);

  const tourListEl = document.getElementById("tourList");
  tourListEl.innerHTML = pagedTours.map(tour => `
    <div class="tour-card">
      <img src="${tour.image}" onerror="this.src='images/no-image.png'">
      <div class="card-content">
        <h3>${tour.name}</h3>
        <p><i class="fa-solid fa-ticket"></i> ${tour.code}</p>
        <p><i class="fa-solid fa-calendar-days"></i> ${tour.departureDate}</p>
        <p><i class="fa-solid fa-location-dot"></i> ${tour.departure}</p>
        <p><i class="fa-solid fa-clock"></i> ${tour.duration}</p>
        <span class="price">${Number(tour.price).toLocaleString("vi-VN")} ₫</span>
        <a href="product.html?id=${tour.id}" class="btn-detail">Xem chi tiết</a>
      </div>
    </div>
  `).join("");

  renderPagination();
}

/* ================== RENDER PAGINATION ================== */
function renderPagination() {
  const paginationEl = document.getElementById("pagination");
  const totalPages = Math.ceil(toursData.length / toursPerPage);

  if (totalPages <= 1) {
    paginationEl.innerHTML = "";
    return;
  }

  let html = "";

  if (currentPage > 1) {
    html += `<button class="pagination-btn" data-page="${currentPage - 1}">&laquo;</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  if (currentPage < totalPages) {
    html += `<button class="pagination-btn" data-page="${currentPage + 1}">&raquo;</button>`;
  }

  paginationEl.innerHTML = html;
}

/* ================== PAGINATION CLICK ================== */
document.addEventListener("click", e => {
  if (e.target.classList.contains("pagination-btn")) {
    currentPage = Number(e.target.dataset.page);
    renderTours(currentPage);
    window.scrollTo(0, 0);
  }
});

/* ================== FILTER / SEARCH ================== */
document.getElementById("applyFilterBtn").addEventListener("click", () => {
  const departure = document.getElementById("departure").value;
  const destination = document.getElementById("destination").value;
  const minPrice = document.getElementById("min-price").value;
  const maxPrice = document.getElementById("max-price").value;
  const type = document.getElementById("filter-type").value;

  fetch(`http://localhost:3000/products?departure=${departure}&name=${destination}&price_gte=${minPrice}&price_lte=${maxPrice}&categoryid=${type}`)
    .then(res => res.json())
    .then(data => {
      toursData = data;     // ⭐ QUAN TRỌNG
      currentPage = 1;
      renderTours(currentPage);
    });
});

/* ================== RESET FILTER ================== */
document.getElementById("resetFiltersBtn").addEventListener("click", () => {
  document.getElementById("departure").value = "";
  document.getElementById("destination").value = "";
  document.getElementById("min-price").value = "";
  document.getElementById("max-price").value = "";
  document.getElementById("filter-type").value = "";

  fetchTours();
});

/* ================== LOAD DESTINATION SELECT ================== */
const destinationSelect = document.getElementById("destination");
fetch("http://localhost:3000/products")
  .then(res => res.json())
  .then(data => {
    const set = new Set();
    data.forEach(t => set.add(t.name));
    set.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      destinationSelect.appendChild(opt);
    });
  });

/* ================== INIT ================== */
document.addEventListener("DOMContentLoaded", fetchTours);

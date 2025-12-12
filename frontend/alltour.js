const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
const register = document.getElementById('register')
const shop = document.getElementById('shop')
if (user) {
  account.innerHTML = "Tài khoản của tôi";
  account.setAttribute('href', 'profile.html')
  register.innerHTML = "Đăng xuất";
  register.setAttribute('href', '#');
  register.addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("Bạn đã đăng xuất thành công")
    window.location.href = "login.html"
  });
} else {
  shop.style.display = "none";
}
const tours = [];
const tourList = document.getElementById("tourList");

const applyFilterBtn = document.getElementById("applyFilterBtn");
applyFilterBtn.addEventListener("click", () => {
  // Lấy giá trị từ các trường lọc
  const departure = document.getElementById("departure").value;
  const destination = document.getElementById("destination").value;
  const minPrice = document.getElementById("min-price").value;
  const maxPrice = document.getElementById("max-price").value;
  // const days = document.getElementById("filter-days").value;
  // const startDay = days.split('-')[0];
  // const endDay = days.split('-')[1];
  const type = document.getElementById("filter-type").value;
  console.log({ departure, destination, minPrice, maxPrice, type });
  fetch(`http://localhost:3000/products?departure=${departure}&name=${destination}&price_gte=${minPrice}&price_lte=${maxPrice}&categoryid=${type}`)
    .then(response => response.json())
    .then(data => {
      console.log('Kết quả lọc:', data);
      renderTourList(data);
    });
});

fetch('http://localhost:3000/products')
  .then(response => response.json())
  .then(data => {
    data.forEach(tour => tours.push(tour));
    console.log('Tất cả tours:', tours);
    renderTourList(tours);
  });

const renderTourList = (tours) => {
  let html = '';
  tours.forEach(tour => {
    html += `
      <div class="tour-card">
                        <img src="${tour.image}">
                        <div class="card-content">
                            <a><h3>${tour.name}</h3></a>
                            <p><i class="fa-solid fa-ticket"></i> ${tour.code}</p>
                            <p><i class="fa-solid fa-calendar-days"></i> Ngày khởi hành: ${tour.departureDate}</p>
                            <p><i class="fa-solid fa-location-dot"></i> Khởi hành: ${tour.departure}</p>
                            <p><i class="fa-solid fa-clock"></i> ${tour.duration}</p>
                            <span class="price">${tour.price}</span>
                            <a href="product.html?id=${tour.id}" class="btn-detail">Xem chi tiết</a>
                        </div>
                    </div>
    `

  })
  tourList.innerHTML = html;
}

//reset filter
const resetFilterBtn = document.getElementById("resetFiltersBtn");
resetFilterBtn.addEventListener("click", () => {
  document.getElementById("departure").value = "";
  document.getElementById("destination").value = "";
  document.getElementById("min-price").value = "";
  document.getElementById("max-price").value = "";
  document.getElementById("filter-type").value = "";
  // Tải lại tất cả tour
  renderTourList(tours);
});



// Pagination
const toursPerPage = 6;
let currentPage = 1;
let toursData = [];

async function fetchTours() {
  try {
    const res = await fetch('http://localhost:3000/products');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('API trả về:', data);
    if (Array.isArray(data)) {
      toursData = data;
    } else if (Array.isArray(data.products)) {
      toursData = data.products;
    } else if (Array.isArray(data.tours)) {
      toursData = data.tours;
    } else {
      throw new Error('Dữ liệu trả về không đúng cấu trúc. Xem console để biết chi tiết.');
    }
    renderTours(currentPage);
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu tour:', err);
    document.getElementById('tourList').innerHTML = `<div style="color: red;">Không thể tải dữ liệu tour: ${err.message}</div>`;
  }
}

function renderTours(page) {
  const start = (page - 1) * toursPerPage;
  const end = start + toursPerPage;
  const pagedTours = toursData.slice(start, end);

  const tourListEl = document.getElementById('tourList');
  tourListEl.innerHTML = pagedTours.map(tour => `
    <div class="tour-card">
                        <img src="${tour.image}">
                        <div class="card-content">
                            <a><h3>${tour.name}</h3></a>
                            <p><i class="fa-solid fa-ticket"></i> ${tour.code}</p>
                            <p><i class="fa-solid fa-calendar-days"></i> Ngày khởi hành: ${tour.departureDate}</p>
                            <p><i class="fa-solid fa-location-dot"></i> Khởi hành: ${tour.departure}</p>
                            <p><i class="fa-solid fa-clock"></i> ${tour.duration}</p>
                            <span class="price">${tour.price}</span>
                            <a href="product.html?id=${tour.id}" class="btn-detail">Xem chi tiết</a>
                        </div>
                    </div>
  `).join('');

  renderPagination();
}

function renderPagination() {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl) return;

  const totalPages = Math.ceil(toursData.length / toursPerPage);
  let html = '';

  if (currentPage > 1) {
    html += `<button class="pagination-btn" data-page="${currentPage - 1}">&laquo; Trước</button>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="pagination-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  if (currentPage < totalPages) {
    html += `<button class="pagination-btn" data-page="${currentPage + 1}">Sau &raquo;</button>`;
  }

  paginationEl.innerHTML = html;
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('pagination-btn')) {
    const page = parseInt(e.target.getAttribute('data-page'));
    if (!isNaN(page)) {
      currentPage = page;
      renderTours(currentPage);
      window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi trang
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('pagination')) {
    const mainEl = document.querySelector('main.container');
    const pagDiv = document.createElement('div');
    pagDiv.id = 'pagination';
    pagDiv.className = 'pagination';
    mainEl.appendChild(pagDiv);
  }
  fetchTours();
});


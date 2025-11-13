const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
if (user) {
  account.innerHTML = "Tài khoản của tôi";
  account.setAttribute('href', 'profile.html')
}


document.getElementById("searchInput").addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".tour-card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(keyword) ? "block" : "none";
  });
});
fetchTours();

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
    <div class="tour-item">
      <img src="${tour.image}" alt="${tour.name}" class="tour-image"/>
      <h2>${tour.name}</h2>
      <p>Giá: ${tour.price.toLocaleString()} VNĐ</p>
      <p>Thời gian: ${tour.duration} | Khởi hành: ${tour.departure} (${tour.departureDate})</p>
      <p>Còn lại: ${tour.availableSeats} chỗ</p>
      <p>${tour.description}</p>
      <p>Đánh giá: ${tour.rating}/5</p>
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

function getDays(duration) {
    const match = duration.match(/(\d+)N/);
    return match ? parseInt(match[1]) : 0;
}
function applyFilters() {
    const origin = document.getElementById("filter-origin").value;
    const destination = document.getElementById("filter-destination").value;
    const minPrice = document.getElementById("min-price").value;
    const maxPrice = document.getElementById("max-price").value;
    const days = document.getElementById("filter-days").value;
    const type = document.getElementById("filter-type").value;

    let filtered = toursData.filter(tour => {

        // Điểm khởi hành
        if (origin && tour.departure.trim() !== origin) return false;

        // Điểm đến 
        if (destination && tour.destination?.trim() !== destination) return false;

        // Khoảng giá
        if (minPrice && tour.price < Number(minPrice)) return false;
        if (maxPrice && tour.price > Number(maxPrice)) return false;

        // Số ngày
        const totalDays = getDays(tour.duration);

        if (days === "1-2" && !(totalDays >= 1 && totalDays <= 2)) return false;
        if (days === "3-5" && !(totalDays >= 3 && totalDays <= 5)) return false;
        if (days === "6-7" && !(totalDays >= 6 && totalDays <= 7)) return false;
        if (days === "8+" && totalDays < 8) return false;

        // Loại tour theo categoryid
        if (type && tour.categoryid != type) return false;

        return true;
    });

    toursData = filtered;
    currentPage = 1;
    renderTours(currentPage);
}
document.getElementById("applyFilterBtn").addEventListener("click", () => {
    applyFilters();
});
let originalTours = []; 

async function fetchTours() {
  try {
    const res = await fetch('http://localhost:3000/products');
    const data = await res.json();
    originalTours = Array.isArray(data) ? data : data.products || data.tours;
    toursData = [...originalTours];
    renderTours(currentPage);
  } catch (err) {
    console.error(err);
  }
}


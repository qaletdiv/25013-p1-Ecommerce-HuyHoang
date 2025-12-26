const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
if (user) {
  account.innerHTML = "Tài khoản của tôi";
  account.setAttribute('href', 'profile.html')
}

const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
console.log(productId);

async function laySanPham(api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`Lỗi : ${response.status}`);
    }
    const products = await response.json();
    console.log(products);
    return products;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return null;
  }
}

const renderProducts = (tour, listTour) => {
  const lichTrinh = document.getElementById("Lich_Trinh");
  const tourDetails = document.getElementById(listTour);
  console.log(tourDetails);
  console.log(tour);

  tour.itinerary.forEach((item, index) => {
    lichTrinh.innerHTML += `
      <h4>Ngày ${index + 1}</h4>
      <p>${item}</p>
    `;
  });
  tourDetails.innerHTML = `
    <div class="slider">
            <button class="prev">&#10094;</button>
            <img src="${tour.image}"alt="Hà Nội" class="slide active">
            <button class="next">&#10095;</button>
        </div>
        <section class="price-card">
        <h2>${tour.name} </h2>    
        <h4>${tour.rating}⭐</h4>
            <p class="price-current">Giá: ${tour.price} <span class="currency">VND</span> / Khách</p>

            <div class="promo-box">
                🎁 Đặt ngay để nhận được <strong>Ưu đãi giờ chót</strong> tiết kiệm thêm
                <span class="highlight">700K</span>
            </div>

            <ul class="tour-details">
                <li><span>📋</span> Mã tour: <strong>${tour.code}</strong></li>
                <li><span>📍</span> Khởi hành: <strong>${tour.departure}</strong></li>
                <li><span>📅</span> Ngày khởi hành: <strong>${tour.departureDate}</strong></li>
                <li><span>🕒</span> Thời lượng: <strong>${tour.duration}</strong></li>
                <li><span>👥</span> Số chỗ còn: <strong>${tour.availableSeats}</strong></li>
            </ul>

            <div class="price-actions">
                <button class="btn-secondary">Ngày khác</button>
                <button onclick='addTour(${JSON.stringify(tour)})' class="btn-primary">Đặt ngay</button>
            </div>
        </section>
  `
laySanPham(`http://localhost:3000/products?categoryid=${tour.categoryid}`).then(relatedTours => {
    const relatedContainer = document.getElementById("product-suggestions");
    relatedTours.slice(0,5).forEach(relatedTour => {
      if (relatedTour.id !== tour.id) {
        relatedContainer.innerHTML += `
          <div class="product-card">
            <a href="product.html?id=${relatedTour.id}">
              <img src="${relatedTour.image}" alt="${relatedTour.name}">
              <h3>${relatedTour.name}</h3>
              <p>Giá: ${relatedTour.price.toLocaleString()} VNĐ</p>
            </a>
          </div>
        `;
      }
    });
  });

}
laySanPham(`http://localhost:3000/products/${productId}`).then(tour => renderProducts(tour, "tour-details"))

const addTour = (tour) => {
  localStorage.setItem("addTour", JSON.stringify(tour));
  window.location.href = "checkout.html";
}
function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


// Render tab Giá & Phụ thu
function renderGiaVaPhuThu() {
    const tab = document.getElementById("Gia_Va_Phu_Thu");

    tab.innerHTML = `
        <h3>Giá & Phụ Thu</h3>
        <ul>
            <li><strong>Giá tour:</strong> ${tourData.price.toLocaleString()} VNĐ</li>
            <li><strong>Phụ thu phòng đơn:</strong> ${tourData.surcharge.singleRoom.toLocaleString()} VNĐ</li>
            <li><strong>Phụ thu trẻ em:</strong> ${tourData.surcharge.child.toLocaleString()} VNĐ</li>
            <li><strong>Phụ thu không bao gồm vé tham quan:</strong> ${tourData.surcharge.notIncludeTicket.toLocaleString()} VNĐ</li>
        </ul>

        <h4>Giải thích phụ thu</h4>
        <p>Phụ thu phòng đơn: áp dụng cho khách đi một mình và không ghép phòng.</p>
        <p>Phụ thu trẻ em: tuỳ theo độ tuổi và quy định ngủ chung/ăn uống.</p>
        <p>Phụ thu không bao gồm vé tham quan: áp dụng cho các điểm ngoài chương trình hoặc tự túc.</p>
    `;
}


// Render tab Chính sách
function renderChinhSach() {
    const tab = document.getElementById("Chinh_Sach");

    tab.innerHTML = `
        <h3>Chính Sách</h3>

        <h4>Chính sách trẻ em</h4>
        <ul>
            ${tourData.policy.child.map(item => `<li>${item}</li>`).join("")}
        </ul>

        <h4>Quy định chung</h4>
        <ul>
            ${tourData.policy.general.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;
}


// Gọi render khi load trang
window.onload = function () {
    renderGiaVaPhuThu();
    renderChinhSach();
};

document.addEventListener('DOMContentLoaded', function() {
    // Lấy phần tử nút menu và danh sách menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.main-nav ul');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            // Thêm hoặc bỏ class 'active' cho ul
            navList.classList.toggle('active');
            
            // (Tùy chọn) Đổi icon từ 3 gạch sang dấu X
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
});
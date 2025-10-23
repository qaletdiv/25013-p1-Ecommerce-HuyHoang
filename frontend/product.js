const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
if (user) {
    account.innerHTML = user.fullname;
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
  const tourDetails = document.getElementById(listTour);
  console.log(tourDetails);
  console.log(tour);
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
                <button onclick='addCart(${JSON.stringify(tour)})' class="btn-primary">Đặt ngay</button>
            </div>
        </section>
  `
}
laySanPham(`http://localhost:3000/products/${productId}`).then(tour => renderProducts(tour, "tour-details"))

const cart = JSON.parse(localStorage.getItem("gio-hang")) || [];
const addCart = (tour) => {
  cart.push(tour);
  console.log(cart);
  localStorage.setItem("gio-hang", JSON.stringify(cart));
} 




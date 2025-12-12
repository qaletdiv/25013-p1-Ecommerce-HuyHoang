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

const resultsContainer = document.getElementById('results');
        const data = JSON.parse(localStorage.getItem('searchResults')) || [];

        if (data.length === 0) {
            resultsContainer.innerHTML = `<div class="empty">Không tìm thấy tour phù hợp.</div>`;
        } else {
            data.forEach(tour => {
                const card = document.createElement('div');
                card.className = 'tour-card';
                card.innerHTML = `
                    <img src="${tour.image || 'https://via.placeholder.com/180'}" alt="Tour Image" />
                    <div class="tour-info">
                        <h3>${tour.name}</h3>
                        <p><strong>Khởi hành:</strong> ${tour.departure}</p>
                        <p><strong>Ngày đi:</strong> ${tour.departureDate}</p>
                        <p><strong>Giá:</strong> ${tour.price?.toLocaleString('vi-VN')} đ</p>
                        <a href="product.html?id=${tour.id}" class="btn-detail">Xem chi tiết</a>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        }
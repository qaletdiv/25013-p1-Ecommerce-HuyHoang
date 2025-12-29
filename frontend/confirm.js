const user = JSON.parse(localStorage.getItem("user"));
console.log(user);

const account = document.getElementById('account');
const register = document.getElementById('register');
const shop = document.getElementById('shop');

if (user) {
    account.innerHTML = "Tài khoản của tôi";
    account.setAttribute('href', 'profile.html')

    register.innerHTML = "Đăng xuất";
    register.setAttribute('href', '#');
    register.addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Bạn đã đăng xuất thành công");
        window.location.href = "login.html";
    });

} else {
    if (shop) shop.style.display = "none";
}


const data = JSON.parse(localStorage.getItem("checkoutInfo"));
        const content = document.getElementById("confirm-content");

        if (!data) {
            content.innerHTML = `<p>Không tìm thấy dữ liệu xác nhận.</p>`;
        } else {
            content.innerHTML = `
                <div class='info-box'>
                    <h3>Thông tin Tour</h3>
                    <img src="${data.addTour.image}" class="tour-img">
                    <p><strong>Tên tour:</strong> ${data.addTour.name}</p>
                    <p><strong>Giá:</strong> ${data.addTour.price.toLocaleString()} VNĐ</p>
                </div>

                <div class='info-box'>
                    <h3>Thông tin liên hệ</h3>
                    <p><strong>Họ tên:</strong> ${data.name}</p>
                    <p><strong>Số điện thoại:</strong> ${data.phone}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Địa chỉ:</strong> ${data.address || "Không có"}</p>
                </div>

                <div class='info-box'>
                    <h3>Phương thức thanh toán</h3>
                    <p>${data.paymentMethod}</p>
                </div>

                <div class='info-box'>
                    <h3>Người lớn</h3>
                    ${data.adultsInfo.map((p, i) => `
                        <p><strong>${i + 1}.</strong> ${p.fullName} — ${p.birthdate}</p>
                    `).join('') || "Không có"}
                </div>

                <div class='info-box'>
                    <h3>Trẻ em</h3>
                    ${data.childsInfo.map((p, i) => `
                        <p><strong>${i + 1}.</strong> ${p.fullName} — ${p.birthdate}</p>
                    `).join('') || "Không có"}
                </div>
            `;
        }

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
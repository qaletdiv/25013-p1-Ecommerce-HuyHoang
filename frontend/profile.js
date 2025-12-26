const user = JSON.parse(localStorage.getItem("user"));
console.log(user);

const account = document.getElementById('account');
const register = document.getElementById('register');
const shop = document.getElementById('shop');

if (user) {
    account.innerHTML = "Tài khoản của tôi";
    account.setAttribute('href', 'profile.html');

    register.innerHTML = "Đăng xuất";
    register.setAttribute('href', '#');

    register.addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Bạn đã đăng xuất thành công");
        window.location.href = "login.html";
    });
} else {
    shop.style.display = "none";
    alert("Bạn cần đăng nhập để xem trang này");
    window.location.href = "login.html";
}

// Hiển thị thông tin cá nhân
document.getElementById("userName").textContent = user.fullname;
document.getElementById("userEmail").textContent = user.email;


const renderBookings = (orders, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!orders.length) {
        container.innerHTML = `<p>Bạn chưa có booking nào</p>`;
        return;
    }

    orders.forEach(order => {
        // console.log(order.addTour.departureDate);
        container.innerHTML += `
        <div class="booking-card">
        <h3 style="color:red"><p><strong>Ngày đặt:</strong> ${new Date(order.date).toLocaleDateString("vi-VN")}</h3>
            <h3>${order.addTour.name}</h3>
            <p><strong>Mã Booking:</strong> ${order.id}</p>
            <p><strong>Ngày khởi hành:</strong> ${(order.addTour.departureDate)}</p>
            <p><strong>Tổng tiền:</strong> ${Number(order.addTour.price).toLocaleString("vi-VN")}₫</p>
        </div>
        `;
    });
};


fetch(`http://localhost:3000/orders?userid=${user.id}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        renderBookings(data, "bookingList");
    })
    .catch(err => {
        console.error("Lỗi khi tải dữ liệu:", err);
        document.getElementById("bookingList").innerHTML = "Không thể tải dữ liệu booking";
    });
    
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
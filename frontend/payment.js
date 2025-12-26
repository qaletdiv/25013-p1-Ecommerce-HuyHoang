const checkoutInfo = JSON.parse(localStorage.getItem("checkoutInfo"));

    const paymentInfoContainer = document.getElementById("payment-info");

    if (checkoutInfo) {
        paymentInfoContainer.innerHTML = `
            <p><strong>Họ tên:</strong> ${checkoutInfo.name}</p>
            <p><strong>Số điện thoại:</strong> ${checkoutInfo.phone}</p>
            <p><strong>Email:</strong> ${checkoutInfo.email}</p>
            <p><strong>Địa chỉ:</strong> ${checkoutInfo.address}</p>
            <p><strong>Phương thức thanh toán:</strong> ${checkoutInfo.paymentMethod}</p>
            <hr>
            <h3>Tour đã đặt</h3>
            <p><strong>${checkoutInfo.addTour.name}</strong></p>
            <p>Giá: ${checkoutInfo.addTour.price.toLocaleString()} VNĐ</p>
        `;
    }

    // Mô phỏng thanh toán
    document.getElementById("pay-btn").addEventListener("click", () => {

        // Giả lập loading thanh toán
        alert("Thanh toán thành công!");

        // Sau khi thanh toán xong → chuyển sang confirm.html
        window.location.href = "confirm.html";
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
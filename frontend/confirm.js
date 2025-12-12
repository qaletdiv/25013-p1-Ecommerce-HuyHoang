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
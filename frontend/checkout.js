// Hàm lấy dữ liệu giỏ hàng từ Local Storage    
function getCart() {
    return JSON.parse(localStorage.getItem("gio-hang")) || [];
}

// Hàm để hiển thị tóm tắt đơn hàng và tính tổng tiền
function renderOrderSummary() {
    const cart = getCart();
    const summaryItemsContainer = document.getElementById("summary-items");
    const summaryTotal = document.getElementById("total-price");
    let total = 0;

    if (summaryItemsContainer) {
        summaryItemsContainer.innerHTML = '';
    }

    if (cart.length === 0) {
        if (summaryItemsContainer) {
            summaryItemsContainer.innerHTML = '<p>Giỏ hàng trống.</p>';
        }
        if (summaryTotal) {
            summaryTotal.innerText = '0 VNĐ';
        }
        return;
    }

    cart.forEach(item => {
        const price = item.price
        if (isNaN(price)) {
            console.error("Lỗi: Giá sản phẩm không hợp lệ:", item.price);
            return;
        }
        total += price;

        const itemHTML = `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="summary-item-info">
                    <p class="summary-item-name">${item.name}</p>
                    <p class="summary-item-price">${price.toLocaleString()} VNĐ</p>
                </div>
            </div>
        `;
        if (summaryItemsContainer) {
            summaryItemsContainer.innerHTML += itemHTML;
        }
    });

    if (summaryTotal) {
        summaryTotal.innerText = total.toLocaleString() + ' VNĐ';
    }
}

let customerInfo = {};
// Hàm để xử lý chuyển đổi giữa các bước
function setupStepNavigation() {
    const steps = document.querySelectorAll('.booking-process-bar .step');
    const stepContents = document.querySelectorAll('.step-content');
    const continueBtn = document.getElementById('continue-btn');

    let currentStep = 1;

    continueBtn.addEventListener('click', () => {
        const formSection = document.getElementById(`step-${currentStep}`);
        const inputs = formSection.querySelectorAll('input[required]');
        let allInputsValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                allInputsValid = false;
            }
        });

        if (allInputsValid) {
            if (currentStep === 1) {
                customerInfo.fullName = document.getElementById('fullname').value;
                customerInfo.phoneNumber = document.getElementById('phoneNumber').value;
                customerInfo.email = document.getElementById('email').value;
                customerInfo.address = document.getElementById('address').value;
                // Có thể lưu vào localStorage nếu cần
                localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
            }
            currentStep++;
            // các đoạn code chuyển bước tiếp theo 

            if (currentStep > steps.length) {
                // Hoàn tất đặt tour
                alert("Đơn hàng đã được đặt thành công!");
                localStorage.removeItem("gio-hang");
                return;
            }

            steps.forEach(step => step.classList.remove('active'));
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');

            stepContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`step-${currentStep}`).classList.add('active');

            if (currentStep === 3) {
                continueBtn.innerText = "Hoàn tất đặt tour";
            } else if (currentStep === 2) {
                continueBtn.innerText = "Thanh toán";
            }
        } else {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
        }
    });
}

window.onload = () => {
    renderOrderSummary();
    setupStepNavigation();
};

const finishBtn = document.getElementById("finish-btn");
console.log(finishBtn);
finishBtn.addEventListener('click', async () => {
    // Lấy thông tin khách hàng từ localStorage
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));

    // Lấy thông tin giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("gio-hang"));

    // Tạo đối tượng dữ liệu hoàn chỉnh để gửi lên server
    const orderData = {
        customer: customerInfo,
        items: cart,
        // Có thể thêm tổng tiền, phương thức thanh toán...
        total: document.getElementById("total-price").innerText // Lấy giá trị đã hiển thị
    };

    console.log("Dữ liệu đơn hàng:", orderData);

    try {
        // Gửi dữ liệu đơn hàng đến API
        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Đơn hàng đã được đặt thành công:", result);
            alert("Đơn hàng đã được đặt thành công!");
            localStorage.removeItem("gio-hang");
            localStorage.removeItem("customerInfo");
            // Chuyển hướng người dùng về trang chủ hoặc trang xác nhận
        } else {
            console.error("Lỗi khi đặt đơn hàng:", result);
            alert("Có lỗi xảy ra khi đặt đơn hàng. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi kết nối. Vui lòng kiểm tra lại.");
    }
});

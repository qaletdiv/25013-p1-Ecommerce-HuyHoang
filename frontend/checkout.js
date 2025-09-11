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
            // Chuyển sang bước tiếp theo
            currentStep++;
            
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
finishBtn.addEventListener('click',async () => {
    // const response = await fetch('http://localhost:3000/oders', { // Thay URL này bằng URL API thực tế của bạn
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ fullname, email, password, "role": "customer" })
    //     });
    //     const result = await response.json();
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(fullname);
    console.log(email);
    console.log(password);
})

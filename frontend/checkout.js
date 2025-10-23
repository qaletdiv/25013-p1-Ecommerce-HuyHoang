const user = JSON.parse(localStorage.getItem("user"));
const account = document.getElementById("account");

if (user) {
    account.innerHTML = user.fullname;
    account.setAttribute("href", "profile.html");
} else {
    window.location.href = "login.html";
}

function getCart() {
    return JSON.parse(localStorage.getItem("gio-hang")) || [];
}

function renderOrderSummary() {
    const cart = getCart();
    const summaryItemsContainer = document.getElementById("summary-items");
    const summaryTotal = document.getElementById("total-price");
    let total = 0;

    if (!summaryItemsContainer) return;
    summaryItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        summaryItemsContainer.innerHTML = "<p>Giỏ hàng trống.</p>";
        summaryTotal.innerText = "0 VNĐ";
        return;
    }

    cart.forEach(item => {
        const price = Number(item.price);
        if (isNaN(price)) return;
        total += price;

        summaryItemsContainer.innerHTML += `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="summary-item-info">
                    <p class="summary-item-name">${item.name}</p>
                    <p class="summary-item-price">${price.toLocaleString()} VNĐ</p>
                </div>
            </div>
        `;
    });

    summaryTotal.innerText = total.toLocaleString() + " VNĐ";
}

let currentStep = 1;
let selectedPaymentMethod = null;
let customerInfo = {};

function setupStepNavigation() {
    const steps = document.querySelectorAll(".booking-process-bar .step");
    const stepContents = document.querySelectorAll(".step-content");
    const nextBtn = document.getElementById("next-btn");

    nextBtn.addEventListener("click", () => {
        const formSection = document.getElementById(`step-${currentStep}`);
        const inputs = formSection.querySelectorAll("input[required]");
        let valid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                valid = false;
            }
        });

        if (!valid) return;

        if (currentStep === 1) {
            customerInfo.fullName = document.getElementById("full-name").value;
            customerInfo.phoneNumber = document.getElementById("phone").value;
            customerInfo.email = document.getElementById("email").value;
            customerInfo.address = document.getElementById("address").value;
            localStorage.setItem("customerInfo", JSON.stringify(customerInfo));

            currentStep = 2;
            updateStepUI(steps, stepContents, nextBtn);
            return;
        }

        if (currentStep === 2) {
            if (!selectedPaymentMethod) {
                alert("Vui lòng chọn phương thức thanh toán.");
                return;
            }

            currentStep = 3;
            updateStepUI(steps, stepContents, nextBtn);
            handleOrderFinish();
            return;
        }

    });
}

function updateStepUI(steps, stepContents, nextBtn) {
    steps.forEach(step => step.classList.remove("active"));
    const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (currentStepEl) currentStepEl.classList.add("active");

    stepContents.forEach(content => content.classList.remove("active"));
    const activeContent = document.getElementById(`step-${currentStep}`);
    if (activeContent) activeContent.classList.add("active");

    if (currentStep === 1) {
        nextBtn.innerText = "Tiếp tục";
    } else if (currentStep === 2) {
        nextBtn.innerText = "Thanh toán";
    } else {
        nextBtn.innerText = "Hoàn tất";
    }

    showPaymentContent(selectedPaymentMethod);
}

const paymentOptions = document.querySelectorAll(".payment-option");

paymentOptions.forEach(option => {
    option.addEventListener("click", () => {
        paymentOptions.forEach(o => o.classList.remove("active"));
        option.classList.add("active");
        selectedPaymentMethod = option.dataset.method;
        showPaymentContent(selectedPaymentMethod);
    });
});

function showPaymentContent(method) {
    const bankContent = document.getElementById("bankContent");
    const momoContent = document.getElementById("momoContent");

    bankContent.style.display = "none";
    momoContent.style.display = "none";

    if (method === "bank") bankContent.style.display = "block";
    if (method === "momo") momoContent.style.display = "block";
}

async function handleOrderFinish() {
    const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
    const cart = getCart();
    const total = document.getElementById("total-price").innerText;

    const orderData = {
        customer: customerInfo,
        items: cart,
        total: total,
        paymentMethod: selectedPaymentMethod,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    try {
        const res = await fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            localStorage.removeItem("gio-hang");
            localStorage.removeItem("customerInfo");
            alert("Đặt tour thành công! Cảm ơn bạn đã tin tưởng Vietravel ❤️");
        } else {
            alert("Có lỗi khi gửi đơn hàng!");
        }
    } catch (err) {
        console.error("Lỗi khi gửi đơn hàng:", err);
    }
}

window.onload = () => {
    renderOrderSummary();
    setupStepNavigation();
};

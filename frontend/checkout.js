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


const addTour = JSON.parse(localStorage.getItem("addTour"));

function renderOrderSummary() {
    const summaryItemsContainer = document.getElementById("summary-items");
    if (!summaryItemsContainer || !addTour) return;

    summaryItemsContainer.innerHTML = `
        <div class="summary-item">
            <img src="${addTour.image}" alt="${addTour.name}">
            <div class="summary-item-info">
                <p class="summary-item-name">${addTour.name}</p>
                <p class="summary-item-price">${addTour.price.toLocaleString()} VNĐ</p>
            </div>
        </div>
    `;
}
renderOrderSummary();


const formAdult = document.getElementById('form-adult');
const formChild = document.getElementById('form-child');
const child = document.getElementById('child');
const adult = document.getElementById('adult');

const adultInformation = document.getElementById('adultInformation');
const childInformation = document.getElementById('childInformation');

adult.addEventListener('input', () => {
    const numberOfAdults = adult.value;

    adultInformation.style.display = numberOfAdults ? 'block' : 'none';

    let html = "";
    for (let i = 0; i < numberOfAdults; i++) {
        html += `
        <div class="form-row">
            <div class="form-group">
                <label>Họ và tên người lớn ${i + 1}</label>
                <input type="text" id="full-name-adult-${i + 1}" placeholder="Nhập họ và tên" required>
            </div>
            <div class="form-group">
                <label>Ngày sinh người lớn ${i + 1}</label>
                <input type="date" id="birthdate-adult-${i + 1}" required>
            </div>
        </div>`;
    }

    formAdult.innerHTML = html;
});

child.addEventListener('input', () => {
    const numberOfChilds = child.value;

    childInformation.style.display = numberOfChilds ? 'block' : 'none';

    let html = "";
    for (let i = 0; i < numberOfChilds; i++) {
        html += `
        <div class="form-row">
            <div class="form-group">
                <label>Họ và tên trẻ em ${i + 1}</label>
                <input type="text" id="full-name-child-${i + 1}" placeholder="Nhập họ và tên" required>
            </div>
            <div class="form-group">
                <label>Ngày sinh trẻ em ${i + 1}</label>
                <input type="date" id="birthdate-child-${i + 1}" required>
            </div>
        </div>`;
    }

    formChild.innerHTML = html;
});

// sumbit check out form
const nextBtn = document.getElementById("next-btn");
nextBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Kiểm tra phương thức thanh toán đã chọn chưa
    const paymentSelected = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentSelected) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }

    // Lấy số lượng người lớn/trẻ em
    const numberOfAdults = adult.value || 0;
    const numberOfChilds = child.value || 0;

    let adultsInfo = [];
    let childsInfo = [];

    for (let i = 0; i < numberOfAdults; i++) {
        adultsInfo.push({
            fullName: document.getElementById(`full-name-adult-${i + 1}`).value,
            birthdate: document.getElementById(`birthdate-adult-${i + 1}`).value
        });
    }

    for (let i = 0; i < numberOfChilds; i++) {
        childsInfo.push({
            fullName: document.getElementById(`full-name-child-${i + 1}`).value,
            birthdate: document.getElementById(`birthdate-child-${i + 1}`).value
        });
    }

    const name = document.getElementById("full-name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    if (!name || !phone || !email) {
        alert("Vui lòng nhập đầy đủ thông tin liên lạc!");
        return;
    }

    const checkoutInfo = {
        userid: user ? user.id : null,
        date: new Date().toISOString(),
        addTour,
        name,
        phone,
        email,
        address,
        paymentMethod: paymentSelected.value,
        adultsInfo,
        childsInfo
    };

    localStorage.setItem("checkoutInfo", JSON.stringify(checkoutInfo));

    fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutInfo),
    })
        .then(res => res.json())
        .then(data => {
            console.log("Order saved:", data);
            window.location.href = 'payment.html';
        })
        .catch(err => {
            console.error('Error:', err);
            alert("Có lỗi xảy ra khi tạo đơn.");
        });
});

const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
// const account = document.getElementById('account');
// if (user) {
//     account.innerHTML = user.fullname;
//     account.setAttribute('href', 'profile.html')
// }

document.getElementById("logoutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("user");
    alert("Bạn đã đăng xuất thành công")
    window.location.href = "login.html"
});

document.getElementById("userName").textContent = user.fullname;
document.getElementById("userEmail").textContent = user.email;

const renderBookings = (orders, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if(!orders.length){
        container.innerHTML = `<p>Bạn chưa có booking nào</p>`
        return;
    }

    orders.forEach(order => {
        container.innerHTML += `
        <div class="booking-card">
        <h3>${order.tourName}</h3>
        <p><strong>Mã Booking:</strong> ${order.id}</p>
        <p><strong>Ngày khởi hành:</strong> ${new Date(order.departureDate).toLocaleDateString("vi-VN")}</p>
        <p><strong>Tổng tiền:</strong> ${Number(order.total).toLocaleDateString("vi-VN")}₫</p>
        </div>
        `;
    });
};

fetch (`http://localhost:3000/orders?userid=${user.id}`)
.then(res => res.json())
.then(data => {
    console.log(data);
    // const user = JSON.parse(localStorage.getItem("user"));
    // const userOrders = data.fiter(o => o.userID == user.id);
    // renderBookings(userOrders, "bookingSection");
})
.catch(err => {
    console.error("Lỗi khi tải dữ liệu:", err);
    document.getElementById("bookingSection").innerHTML = "Không thể tải dữ liệu booking";
});




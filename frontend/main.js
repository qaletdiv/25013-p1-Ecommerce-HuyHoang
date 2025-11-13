const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
const register = document.getElementById('register')
const shop = document.getElementById('shop')
if (user) {
    account.innerHTML = "Tài khoản của tôi";
    account.setAttribute('href', 'profile.html')
    register.style.display = "none";
} else {
    shop.style.display = "none";
}
async function laySanPham(api) {
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`Lỗi : ${response.status}`);
        }
        const products = await response.json();
        // console.log(products);
        return products;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return null;
    }
}

const renderProducts = (tours, listTour) => {
    const tourNoiBat = document.getElementById(listTour);
    // console.log(tourNoiBat);
    // console.log(tours);
    tours.forEach(tour => {
        tourNoiBat.innerHTML += `
        <div class="tour-card">
                        <img src="${tour.image}">
                        <div class="card-content">
                            <a><h3>${tour.name}</h3></a>
                            <p><i class="fa-solid fa-ticket"></i> ${tour.code}</p>
                            <p><i class="fa-solid fa-calendar-days"></i> Ngày khởi hành: ${tour.departureDate}</p>
                            <p><i class="fa-solid fa-location-dot"></i> Khởi hành: ${tour.departure}</p>
                            <p><i class="fa-solid fa-clock"></i> ${tour.duration}</p>
                            <span class="price">${tour.price}</span>
                            <a href="product.html?id=${tour.id}" class="btn-detail">Xem chi tiết</a>
                        </div>
                    </div>
        `
    })
}
laySanPham('http://localhost:3000/products?feature=true&_limit=6').then(tours => renderProducts(tours, "tour-noi-bat"))
laySanPham('http://localhost:3000/products?categoryid=1&_limit=6').then(tours => renderProducts(tours, "tour-trong-nuoc"))
laySanPham('http://localhost:3000/products?categoryid=2&_limit=6').then(tours => renderProducts(tours, "tour-nuoc-ngoai"))

let cart = JSON.parse(localStorage.getItem("gio-hang"));
// console.log(cart);

window.onload = function() {
    if (!sessionStorage.getItem('promo_popup_shown')) {
        document.getElementById('promo-popup').style.display = 'block';
        document.getElementById('promo-bg').style.display = 'block';
    }
};

document.getElementById('closeBtn').onclick = function() {
    document.getElementById('promo-popup').style.display = 'none';
    document.getElementById('promo-bg').style.display = 'none';
    sessionStorage.setItem('promo_popup_shown', 'yes');
};





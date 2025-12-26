const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
const register = document.getElementById('register')
const shop = document.getElementById('shop')
if (user) {
    account.innerHTML = "Tài khoản của tôi";
    account.setAttribute('href', 'profile.html')
    register.innerHTML = "Đăng xuất";
    register.setAttribute('href', '#');
    register.addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Bạn đã đăng xuất thành công")
        window.location.href = "login.html"
    });
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

window.onload = function () {
    if (!localStorage.getItem('promo_popup_shown')) {
        document.getElementById('promo-popup').style.display = 'block';
        document.getElementById('promo-bg').style.display = 'block';
    }
};

document.getElementById('closeBtn').onclick = function () {
    document.getElementById('promo-popup').style.display = 'none';
    document.getElementById('promo-bg').style.display = 'none';
    localStorage.setItem('promo_popup_shown', 'yes');
};


const searchTour = document.getElementById('searchTour');
searchTour.addEventListener('click', () => {
    let destination = document.getElementById('destination').value || '';
    let departure = document.getElementById('departure').value || '';
    let departureDate = document.getElementById('departure-date').value  || '';
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    if(departureDate !== '') {
        departureDate = formatDate(departureDate);
    }
    console.log(destination, departure, departureDate);
    fetch(`http://localhost:3000/products?departure=${departure}&departureDate=${departureDate}&name=${destination}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('searchResults', JSON.stringify(data));
            window.location.href = 'search.html';
        })
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
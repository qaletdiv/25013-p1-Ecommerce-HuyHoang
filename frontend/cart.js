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
    register.addEventListener("click", ()=>{
    localStorage.removeItem("user");
    alert("Bạn đã đăng xuất thành công")
    window.location.href = "login.html"
});
} else {
    shop.style.display = "none";
}
function getCart() {
  return JSON.parse(localStorage.getItem("gio-hang")) || [];
}

function saveCart(cart) {
  localStorage.setItem("gio-hang", JSON.stringify(cart));
}

function renderCart() {
  let cart = getCart();
  let tbody = document.getElementById("cart-items");
  let total = 0;
  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Giỏ hàng trống!</td></tr>`;
    document.getElementById("cart-total").innerText = "0 VNĐ";
    return;
  }

  cart.forEach((item, index) => {
    const price =item.price;
    if (isNaN(price)) {
        console.error("Giá sản phẩm không hợp lệ:", item.price);
        return;
    }
    
    const quantity = 1;
    
    const subtotal = price * quantity;
    total += subtotal;

    tbody.innerHTML += `
      <tr>
        <td>
          <div class="product-box">
            <img src="${item.image}" alt="${item.name}">
            <div class="product-name">${item.name}</div>
          </div>
        </td>
        <td>${price.toLocaleString()} VNĐ</td>
        <td>${quantity}</td>
        <td>${subtotal.toLocaleString()} VNĐ</td>
        <td><button onclick="removeItem(${index})">❌</button></td>
      </tr>
    `;
  });

  document.getElementById("cart-total").innerText = total.toLocaleString() + " VNĐ";
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

window.onload = renderCart;

async function renderRelatedProducts() {
  const container = document.getElementById("product-suggestions");
  container.innerHTML = 'Đang tải sản phẩm...';

  try {
    const response = await fetch('http://localhost:3000/products?categoryid=1&_limit=7');
    if (!response.ok) {
      throw new Error('Lỗi khi tải dữ liệu sản phẩm.');
    }
    const relatedProducts = await response.json();
    container.innerHTML = '';
    relatedProducts.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product-card');
      productElement.innerHTML = `
        <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price.toLocaleString()} VNĐ</p>
        </a>
      `;

      container.appendChild(productElement);
    });

  } catch (error) {
    console.error("Lỗi khi hiển thị sản phẩm gợi ý:", error);
    container.innerHTML = 'Không thể tải sản phẩm gợi ý.';
  }
}

window.onload = function() {
  renderCart();
  renderRelatedProducts();
};

function renderOrderSummary() {
  const cart = getCart();
  const summaryDetails = document.querySelector('.summary-card .summary-details'); // Tạo một thẻ div mới trong HTML để chứa chi tiết giá
  const totalPriceElement = document.getElementById("total-price");

  // Xóa nội dung cũ để tránh bị lặp lại
  if (summaryDetails) {
    summaryDetails.innerHTML = '';
  }

  let basePrice = 0;

  // Lặp qua các sản phẩm trong giỏ hàng để hiển thị và tính tổng
  cart.forEach(item => {
    // Chuyển đổi giá từ chuỗi có dấu . và 'đ' sang số nguyên
    const price = parseInt(item.price.replace(/[^\d]/g, ''));
    if (!isNaN(price)) {
      basePrice += price;
    }

    // Hiển thị chi tiết từng tour
    const itemHtml = `
      <div class="summary-line">
        <span>${item.name}</span>
        <span class="price-value">${price.toLocaleString()} VNĐ</span>
      </div>
    `;
    if (summaryDetails) {
      summaryDetails.innerHTML += itemHtml;
    }
  });

  // Hiển thị tổng tiền
  if (totalPriceElement) {
    totalPriceElement.innerText = `${basePrice.toLocaleString()} VNĐ`;
  }
}
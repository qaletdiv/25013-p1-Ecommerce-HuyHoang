const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
if (user) {
  account.innerHTML = user.fullname;
  account.setAttribute('href', 'profile.html')
}
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  console.log(email);
  console.log(password);

  if (!email || !password) {
    msg.textContent = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }

  if (password.length < 6) {
    msg.textContent = "Mật khẩu phải ít nhất 6 ký tự!";
    return;
  }

  const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
  const user = await response.json();
  if (user.length > 0) {
    msg.textContent = "Đăng Nhập Thành Công"
    localStorage.setItem("user", JSON.stringify(user[0]));
    window.location.href = 'index.html';
  } else {
    msg.textContent = "Mật khẩu hoặc Email chưa đúng"
  }
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
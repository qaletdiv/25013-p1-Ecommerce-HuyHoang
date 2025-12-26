const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
const account = document.getElementById('account');
if (user) {
    account.innerHTML = "Tài khoản của tôi";
    account.setAttribute('href', 'profile.html')
}
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (event) => {
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const msg = document.getElementById("msg");
    event.preventDefault();
    // console.log(fullname);
    // console.log(password);
    // console.log(confirmPassword);
    // const salt = bcrypt.genSaltSync(10);
    // const hashPassword = bcrypt.hashSync(password, salt);
    // console.log(hashPassword);

    if (!fullname || !email || !password || !confirmPassword) {
        msg.textContent = "Vui lòng nhập đầy đủ thông tin !"
        return;
    }

    if (password !== confirmPassword) {
        msg.textContent = "Mật khẩu chưa khớp !"
        return;
    }

    if (password.length < 6) {
        msg.textContent = "Mật khẩu phải ít nhất 6 ký tự !"
        return;
    }

    msg.textContent = "Đăng ký thành công giờ bạn có thể đăng nhập"
    try {
        const response1 = await fetch(`http://localhost:3000/users?email=${email}`);
        const user = await response1.json();
        if (user.length > 0) {
            msg.textContent = "Bạn đã đăng ký email này rồi"
            return;
        }



        const response2 = await fetch('http://localhost:3000/users', { // Thay URL này bằng URL API thực tế của bạn
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullname, email, password, "role": "customer" })
        });

        if (response2.ok) {
            // Xử lý khi đăng ký thành công
            msg.textContent = 'Đăng ký thành công! Chúc mừng bạn đã có tài khoản.';
            window.location.href = 'login.html';
        } else {
            // Xử lý khi có lỗi từ phía server
            msg.textContent = `Đăng ký thất bại:`
        }
    } catch (error) {

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
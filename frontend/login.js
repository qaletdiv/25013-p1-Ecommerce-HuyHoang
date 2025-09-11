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
    window.location.href = 'index.html';
  } else {
    msg.textContent = "Mật khẩu hoặc Email chưa đúng"
  }
});
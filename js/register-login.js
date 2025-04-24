const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


// ========= VALIDATE ĐĂNG KÝ ========= //
document.addEventListener("DOMContentLoaded", () => {
    // Gọi hàm đăng ký
    register();
    // Gọi hàm đăng nhập
    login();
});

function register() {
    const registerForm = document.querySelector('.sign-up form');
    if (!registerForm) return;

    const [nameInput, emailInput, passwordInput, confirmPasswordInput] = registerForm.querySelectorAll('input');

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Xóa lỗi cũ
        registerForm.querySelectorAll('.error-message')?.forEach(e => e.remove());

        // Validate họ tên
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Họ và tên không được để trống');
            isValid = false;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = emailInput.value.trim();
        if (!email) {
            showError(emailInput, 'Email không được để trống');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError(emailInput, 'Email không đúng định dạng');
            isValid = false;
        }

        // Validate mật khẩu
        const password = passwordInput.value.trim();
        if (password.length < 8) {
            showError(passwordInput, 'Mật khẩu phải có ít nhất 8 ký tự');
            isValid = false;
        }

        // Validate xác nhận mật khẩu
        const confirmPassword = confirmPasswordInput.value.trim();
        if (confirmPassword !== password) {
            showError(confirmPasswordInput, 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        // Kiểm tra email đã tồn tại
        const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
        if (accounts.some(acc => acc.email === email)) {
            showError(emailInput, "Email đã tồn tại. Vui lòng chọn email khác");
            return;
        }

        // Nếu hợp lệ
        if (isValid) {
            const fullname = nameInput.value.trim();
            accounts.push({fullname, email, password, role: "user" });
            localStorage.setItem("accounts", JSON.stringify(accounts));
            registerForm.querySelectorAll('.error-message')?.forEach(e => e.remove());
            nameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            confirmPasswordInput.value = "";
            
            document.getElementById("container").classList.remove("active");
        }
    });
}

function login() {
    const loginForm = document.querySelector('.sign-in form');
    if (!loginForm) return;

    const [loginEmailInput, loginPasswordInput] = loginForm.querySelectorAll('input');

    const fakeEmail = "admin@example.com";
    const fakePassword = "admin123";

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Xóa lỗi cũ
        loginForm.querySelectorAll('.error-message')?.forEach(e => e.remove());

        // Validate email
        const email = loginEmailInput.value.trim();
        if (!email) {
            showError(loginEmailInput, 'Email không được để trống');
            isValid = false;
        }

        // Validate mật khẩu
        const password = loginPasswordInput.value.trim();
        if (!password) {
            showError(loginPasswordInput, 'Mật khẩu không được để trống');
            isValid = false;
        }

        if (isValid) {
            if (email === fakeEmail && password === fakePassword) {
                alert("Đăng nhập thành công với tư cách Admin");
                window.location.href = "/PROJECT/pages/category-manager.html";
            } else {
                alert("Đăng nhập thành công dưới quyền người dùng");
                window.location.href = "/PROJECT/pages/dashboard.html";
            }
        }
    });
}

function showError(input, message) {
    const div = document.createElement('div');
    div.className = 'error-message';
    div.style.color = 'red';
    div.style.fontSize = '14px';
    div.textContent = message;
    input.insertAdjacentElement('afterend', div);
}

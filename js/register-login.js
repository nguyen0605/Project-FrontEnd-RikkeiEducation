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
    const registerForm = document.querySelector('.sign-up form');
    if (!registerForm) return;

    const [nameInput, emailInput, passwordInput, confirmPasswordInput] = registerForm.querySelectorAll('input');

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Xoá lỗi cũ
        registerForm.querySelectorAll('.error-message')?.forEach(e => e.remove());

        // Validate họ tên
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Họ và tên không được để trống');
            isValid = false;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email không được để trống');
            isValid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, 'Email không đúng định dạng');
            isValid = false;
        }

        // Validate mật khẩu
        if (passwordInput.value.length < 8) {
            showError(passwordInput, 'Mật khẩu phải có ít nhất 8 ký tự');
            isValid = false;
        }

        // Validate xác nhận mật khẩu
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordInput, 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        // Nếu hợp lệ
        if (isValid) {
            alert("Đăng ký thành công!");
            window.location.href = "/PROJECT/pages/dashboard.html"; // hoặc trang chủ
        }
    });

    function showError(input, message) {
        const div = document.createElement('div');
        div.className = 'error-message';
        div.style.color = 'red';
        div.style.fontSize = '14px';
        div.textContent = message;
        input.insertAdjacentElement('afterend', div);
    }
});

// ========= VALIDATE ĐĂNG NHẬP ========= //
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('.sign-in form');
    if (!loginForm) return;

    const [loginEmailInput, loginPasswordInput] = loginForm.querySelectorAll('input');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Xoá lỗi cũ
        loginForm.querySelectorAll('.error-message')?.forEach(e => e.remove());

        // Validate email
        if (!loginEmailInput.value.trim()) {
            showError(loginEmailInput, 'Email không được để trống');
            isValid = false;
        }

        // Validate mật khẩu
        if (!loginPasswordInput.value.trim()) {
            showError(loginPasswordInput, 'Mật khẩu không được để trống');
            isValid = false;
        }

        // Giả lập dữ liệu tài khoản (có thể thay bằng kiểm tra localStorage hoặc API)
        const fakeEmail = "admin@gmail.com";
        const fakePassword = "12345678";

        if (isValid) {
            if (loginEmailInput.value === fakeEmail && loginPasswordInput.value === fakePassword) {
                alert("Đăng nhập thành công với tư cách Admin");
                window.location.href = "/PROJECT/pages/category-manager.html"; // nếu là admin
            } else {
                alert("Đăng nhập thành công dưới quyền người dùng");
                window.location.href = "/PROJECT/pages/dashboard.html"; // nếu là user
            }
        }
    });

    function showError(input, message) {
        const div = document.createElement('div');
        div.className = 'error-message';
        div.style.color = 'red';
        div.style.fontSize = '14px';
        div.textContent = message;
        input.insertAdjacentElement('afterend', div);
    }
});

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const registerForm = document.querySelector('.sign-up form');
const loginForm = document.querySelector('.sign-in form');
const [loginEmailInput, loginPasswordInput] = loginForm.querySelectorAll('input');
const rememberMeCheckbox = document.getElementById("remember-me");

let accounts = JSON.parse(localStorage.getItem("accounts")) || [
    {
        fullname: "admin",
        email: "admin@gmail.com",
        password: "12345678",
        role: "admin"
    }
];

// ========= KHI LOAD TRANG ========= //
document.addEventListener("DOMContentLoaded", () => {
    setupAuth(); // Kiểm tra trạng thái đăng nhập
    register();  // Gọi hàm đăng ký
    login();     // Gọi hàm đăng nhập
});

// ========= SỰ KIỆN CHUYỂN FORM ========= //
registerBtn.addEventListener('click', () => {
    loginForm.querySelectorAll('.error-message')?.forEach(e => e.remove());
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    registerForm.querySelectorAll('.error-message')?.forEach(e => e.remove());
    container.classList.remove("active");
});

// ========= HÀM REGISTER ========= //
function register() {
    if (!registerForm) return;

    const [nameInput, emailInput, passwordInput, confirmPasswordInput] = registerForm.querySelectorAll('input');

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Xóa lỗi cũ
        registerForm.querySelectorAll('.error-message')?.forEach(e => e.remove());

        const fullname = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate
        if (!fullname) {
            showError(nameInput, 'Họ và tên không được để trống');
            isValid = false;
        }

        if (!email) {
            showError(emailInput, 'Email không được để trống');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError(emailInput, 'Email không đúng định dạng');
            isValid = false;
        }

        if (password.length < 8) {
            showError(passwordInput, 'Mật khẩu phải có ít nhất 8 ký tự');
            isValid = false;
        }

        if (confirmPassword !== password) {
            showError(confirmPasswordInput, 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        if (accounts.some(acc => acc.email === email)) {
            showError(emailInput, "Email đã tồn tại. Vui lòng chọn email khác");
            return;
        }

        // Nếu hợp lệ
        if (isValid) {
            accounts.push({ fullname, email, password, role: "user" });
            localStorage.setItem("accounts", JSON.stringify(accounts));

            nameInput.value = '';
            emailInput.value = '';
            passwordInput.value = '';
            confirmPasswordInput.value = '';

            container.classList.remove("active"); // Chuyển về login
        }
    });
}

// ========= HÀM LOGIN ========= //
function login() {
    if (!loginForm) return;

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Xóa lỗi cũ
        loginForm.querySelectorAll('.error-message')?.forEach(e => e.remove());

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!email) {
            showError(loginEmailInput, 'Email không được để trống');
            isValid = false;
        }

        if (!password) {
            showError(loginPasswordInput, 'Mật khẩu không được để trống');
            isValid = false;
        }

        if (isValid) {
            const account = accounts.find(acc => acc.email === email && acc.password === password);

            if (account) {
                // Nếu login thành công
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('isAdmin', account.role === 'admin' ? 'true' : 'false');
                } else {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('isAdmin', account.role === 'admin' ? 'true' : 'false');
                }

                loginEmailInput.value = '';
                loginPasswordInput.value = '';

                // Chuyển hướng
                if (account.role === 'admin') {
                    window.location.href = "../pages/category-manager.html";
                } else {
                    window.location.href = "../pages/home.html";
                }

            } else {
                // Nếu đăng nhập sai
                showError(loginEmailInput, 'Email hoặc mật khẩu không đúng');
                showError(loginPasswordInput, 'Email hoặc mật khẩu không đúng');
            }
        }
    });
}

// ========= HÀM SHOW ERROR ========= //
function showError(input, message) {
    const div = document.createElement('div');
    div.className = 'error-message';
    div.style.color = 'red';
    div.style.fontSize = '14px';
    div.textContent = message;
    input.insertAdjacentElement('afterend', div);
}

// ========= HÀM KIỂM TRA TRẠNG THÁI LOGIN ========= //
function setupAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';

    if (isLoggedIn) {
        if (isAdmin) {
            window.location.href = "../pages/category-manager.html";
        } else {
            window.location.href = "../pages/home.html";
        }
    } else {
        container.classList.add("active"); // Nếu chưa login, mở form đăng ký
    }
}

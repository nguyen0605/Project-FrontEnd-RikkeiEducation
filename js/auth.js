function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
  
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    if (!isLoggedIn) {
      window.location.href = "../pages/register-login.html"; // Đảm bảo thay đổi link cho đúng
    }
  }

  document.addEventListener("DOMContentLoaded", checkLoginStatus);
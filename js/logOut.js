document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logOut');
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutModal.classList.remove('hidden'); // Mở modal
        });
    }

    // Bấm "Không" => đóng modal
    cancelLogout.addEventListener('click', () => {
        logoutModal.classList.add('hidden');
    });

    // Bấm "Có" => logout
    confirmLogout.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('isAdmin');
        window.location.href = "../pages/register-login.html"; // Chuyển trang login
    });
});

let currentPage = 1;
const quizzesPerPage = 8;
let filteredQuizzes = []; 

// Dữ liệu ban đầu từ localStorage
const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [
    { id: 1, name: 'Thách thức toán học', playCount: 5 },
    { id: 2, name: 'Kiến thức địa lý', playCount: 10 },
    { id: 3, name: 'Lịch sử thế giới', playCount: 3 },
    { id: 4, name: 'Kiến thức khoa học', playCount: 12 },
    { id: 5, name: 'Văn học Việt Nam', playCount: 7 },
    { id: 6, name: 'Đời sống xã hội', playCount: 9 },
    { id: 7, name: 'Nhạc pop quốc tế', playCount: 2 },
    { id: 8, name: 'Trí tuệ nhân tạo', playCount: 15 },
    { id: 9, name: 'Lịch sử Việt Nam', playCount: 8 },
    { id: 10, name: 'Lịch sử Thế chiến II', playCount: 4 }
];

// Render quiz theo trang
function renderQuizzes(page = 1) {
    const list = filteredQuizzes.length > 0 ? filteredQuizzes : quizzes;
    const start = (page - 1) * quizzesPerPage;
    const end = start + quizzesPerPage;
    const quizzesToDisplay = list.slice(start, end);

    const quizListContainer = document.getElementById("quiz-list");
    quizListContainer.innerHTML = '';

    if (quizzesToDisplay.length === 0) {
        quizListContainer.innerHTML = `
            <div class="text-center py-5">
                <h5>⚡ Không có bài test nào để hiển thị!</h5>
            </div>
        `;
        return;
    }

    quizzesToDisplay.forEach(quiz => {
        const quizCard = `
            <div class="col-md-6 col-lg-6">
                <div class="card shadow-sm p-3 d-flex flex-row align-items-center mb-3">
                    <img src="../asset/images/test/Image.png" alt="quiz-img" class="img-fluid rounded me-3" style="width: 80px; height: 80px;">
                    <div>
                        <div>🏡 ${quiz.name}</div>
                        <strong>Thách thức sự hiểu biết của bạn</strong>
                        <div>${quiz.playCount} lượt chơi</div>
                    </div>
                    <div class="ms-auto">
                        <button class="btn btn-warning btn-sm">Chơi</button>
                    </div>
                </div>
            </div>
        `;
        quizListContainer.innerHTML += quizCard;
    });
}

// Render phân trang
function renderPagination() {
    const list = filteredQuizzes.length > 0 ? filteredQuizzes : quizzes;
    const totalPages = Math.ceil(list.length / quizzesPerPage);
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return; // Nếu chỉ có 1 trang thì không cần phân trang

    paginationContainer.innerHTML += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" aria-label="Previous" onclick="changePage(${currentPage - 1})">&laquo;</a>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
          <li class="page-item ${currentPage === i ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
          </li>
        `;
    }

    paginationContainer.innerHTML += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" aria-label="Next" onclick="changePage(${currentPage + 1})">&raquo;</a>
      </li>
    `;
}

// Chuyển trang
function changePage(page) {
    const list = filteredQuizzes.length > 0 ? filteredQuizzes : quizzes;
    const totalPages = Math.ceil(list.length / quizzesPerPage);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;
    renderQuizzes(currentPage);
    renderPagination();
}

// Tìm kiếm
const searchInput = document.getElementById("search");

searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn submit form

        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword === '') {
            // Nếu không nhập gì ➔ reset về danh sách gốc
            filteredQuizzes = [];
        } else {
            // Nếu có nhập từ khóa ➔ lọc danh sách
            filteredQuizzes = quizzes.filter(quiz => quiz.name.toLowerCase().includes(keyword));
        }

        currentPage = 1; // Reset về trang 1
        renderQuizzes(currentPage);
        renderPagination();
    }
});

//Khi sắp xếp
document.getElementById('sortAsc').addEventListener('click', function () {
    sortQuizzes('asc');
});

document.getElementById('sortDesc').addEventListener('click', function () {
    sortQuizzes('desc');
});

// Hàm sắp xếp
function sortQuizzes(order) {
    const list = filteredQuizzes.length > 0 ? filteredQuizzes : quizzes;

    list.sort((a, b) => {
        if (order === 'asc') {
            return a.playCount - b.playCount; // Tăng dần
        } else {
            return b.playCount - a.playCount; // Giảm dần
        }
    });

    currentPage = 1; // Reset về trang 1 sau khi sắp xếp
    renderQuizzes(currentPage);
    renderPagination();
}

function setupAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

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



// Khi tải trang
renderQuizzes(currentPage);
renderPagination();




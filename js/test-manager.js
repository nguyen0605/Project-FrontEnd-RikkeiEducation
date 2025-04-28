let tests = JSON.parse(localStorage.getItem('tests')) || [
    { id: 1, name: "History Quiz", category: "📚 Lịch sử", questions: 15, time: "10 min" },
    { id: 2, name: "Science Challenge", category: "🧪 Khoa học", questions: 20, time: "15 min" },
    { id: 3, name: "Entertainment Trivia", category: "✏️ Đời sống", questions: 10, time: "5 min" },
    { id: 4, name: "Math Challenge", category: "📐 Toán học", questions: 12, time: "8 min" },
    { id: 5, name: "Geography Test", category: "🌍 Địa lý", questions: 18, time: "12 min" },
    { id: 6, name: "History Quiz", category: "📚 Lịch sử", questions: 15, time: "10 min" },
    { id: 7, name: "Science Challenge", category: "🧪 Khoa học", questions: 20, time: "15 min" },
    { id: 8, name: "Entertainment Trivia", category: "✏️ Đời sống", questions: 10, time: "5 min" }
  ];
  
  let itemsPerPage = 5;
  let currentPage = 1;
  let currentTests = [...tests]; // Danh sách hiện tại để render
  
  // --- Các hàm render ---
  function renderTests() {
    const tbody = document.getElementById('testList');
    tbody.innerHTML = '';
  
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageTests = currentTests.slice(start, end);
  
    pageTests.forEach(test => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${test.id}</td>
        <td>${test.name}</td>
        <td>${test.category}</td>
        <td>${test.questions}</td>
        <td>${test.time}</td>
        <td>
          <button class="btn btn-warning btn-sm me-2" onclick="openEditModal(${test.id})">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${test.id})">Xóa</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
  
    const totalPages = Math.ceil(currentTests.length / itemsPerPage);
  
    const prev = document.createElement('li');
    prev.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prev.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">«</a>`;
    pagination.appendChild(prev);
  
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
      pagination.appendChild(li);
    }
  
    const next = document.createElement('li');
    next.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    next.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">»</a>`;
    pagination.appendChild(next);
  }
  
  function changePage(page) {
    const totalPages = Math.ceil(currentTests.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTests();
    renderPagination();
  }
  
  // --- Modal thêm bài test ---
  function openAddModal() {
    document.getElementById('addTestModal').classList.add('open');
  }
  
  function closeAddModal() {
    document.getElementById('addTestModal').classList.remove('open');
  }
  
  document.getElementById('addTestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('testName').value.trim();
    const category = document.getElementById('category').value.trim();
    const questions = parseInt(document.getElementById('questions').value);
    const time = document.getElementById('time').value.trim();
  
    // Tạo ID mới: max id trong mảng + 1
    const newId = tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1;
  
    const newTest = { id: newId, name, category, questions, time };
    tests.push(newTest);
    saveTests();
    closeAddModal();
    resetSearchSort();
  });
  
  // --- Modal sửa bài test ---
  function openEditModal(id) {
    const modal = document.getElementById('editTestModal');
    const test = tests.find(t => t.id === id);
    if (!test) return;
  
    document.getElementById('editTestName').value = test.name;
    document.getElementById('editCategory').value = test.category;
    document.getElementById('editQuestions').value = test.questions;
    document.getElementById('editTime').value = test.time;
  
    modal.classList.add('open');
    modal.dataset.id = id;
  }
  
  function closeEditModal() {
    document.getElementById('editTestModal').classList.remove('open');
  }
  
  document.getElementById('editTestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editTestModal').dataset.id);
    const test = tests.find(t => t.id === id);
    if (!test) return;
  
    test.name = document.getElementById('editTestName').value;
    test.category = document.getElementById('editCategory').value;
    test.questions = parseInt(document.getElementById('editQuestions').value);
    test.time = document.getElementById('editTime').value;
  
    saveTests();
    closeEditModal();
    resetSearchSort();
  });
  
  // --- Modal xóa bài test ---
  function openDeleteModal(id) {
    const modal = document.getElementById('deleteTestModal');
    modal.classList.add('open');
    document.getElementById('confirmDelete').onclick = function() {
      tests = tests.filter(t => t.id !== id);
      saveTests();
      closeDeleteModal();
      resetSearchSort();
    };
    document.getElementById('cancelDelete').onclick = closeDeleteModal;
  }
  
  function closeDeleteModal() {
    document.getElementById('deleteTestModal').classList.remove('open');
  }
  
  // --- Tìm kiếm ---
  document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    currentTests = tests.filter(test => test.name.toLowerCase().includes(query));
    currentPage = 1;
    renderTests();
    renderPagination();
  });
  
  // --- Sắp xếp ---
  document.getElementById('sortSelect').addEventListener('change', function(e) {
    const value = e.target.value;
    if (value === "Tên A-Z") {
      currentTests.sort((a, b) => a.name.localeCompare(b.name));
    } else if (value === "Số câu tăng dần") {
      currentTests.sort((a, b) => a.questions - b.questions);
    }
    currentPage = 1;
    renderTests();
    renderPagination();
  });
  
  // --- Lưu LocalStorage ---
  function saveTests() {
    localStorage.setItem('tests', JSON.stringify(tests));
  }
  
  // --- Reset tìm kiếm & sắp xếp sau thêm/sửa/xóa ---
  function resetSearchSort() {
    currentTests = [...tests];
    currentPage = 1;
    renderTests();
    renderPagination();
  }

  function logOut(){
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isAdmin');
    window.location.href = "../pages/register-login.html"; 
}
  
  // --- Khởi tạo ---
  resetSearchSort();
  
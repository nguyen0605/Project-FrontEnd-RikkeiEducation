let tests = JSON.parse(localStorage.getItem('tests')) || [
  {
    id: 1,
    name: "History Quiz",
    category: "📚 Lịch sử",
    questions: [
      { id: 1, question: "What is the capital of France?", answers: ["Paris", "London", "Rome", "Berlin"], correctAnswer: "Paris"},
      { id: 2, question: "Who was the first president of the United States?", answers: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"], correctAnswer: "George Washington" },
      { id: 3, question: "In which year did World War II end?", answers: ["1945", "1939", "1925", "1950"], correctAnswer: "1945" },
      { id: 4, question: "Who wrote 'The Iliad'?", answers: ["Homer", "Shakespeare", "Dante", "Virgil"], correctAnswer: "Homer" },
      { id: 5, question: "Which country was the first to land on the Moon?", answers: ["USA", "Soviet Union", "China", "India"], correctAnswer: "USA" }
    ],
    time: "10 min"
  },
  {
    id: 2,
    name: "Science Challenge",
    category: "🧪 Khoa học",
    questions: [
      { id: 1, question: "What is the chemical symbol for water?", answers: ["H2O", "O2", "CO2", "N2"], correctAnswer: "H2O" },
      { id: 2, question: "What is the powerhouse of the cell?", answers: ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic Reticulum"], correctAnswer: "Mitochondria" },
      { id: 3, question: "Who is the father of modern physics?", answers: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"], correctAnswer: "Albert Einstein" },
      { id: 4, question: "What planet is known as the Red Planet?", answers: ["Mars", "Earth", "Jupiter", "Saturn"], correctAnswer: "Mars" },
      { id: 5, question: "What is the chemical symbol for gold?", answers: ["Au", "Ag", "Fe", "Pb"], correctAnswer: "Au" }
    ],
    time: "15 min"
  },
  {
    id: 3,
    name: "Entertainment Trivia",
    category: "✏️ Đời sống",
    questions: [
      { id: 1, question: "Who won the Oscar for Best Actor in 2020?", answers: ["Joaquin Phoenix", "Leonardo DiCaprio", "Brad Pitt", "Tom Hanks"], correctAnswer: "Joaquin Phoenix" },
      { id: 4, question: "Which TV show features the character Jon Snow?", answers: ["Game of Thrones", "Breaking Bad", "Stranger Things", "The Witcher"], correctAnswer: "Game of Thrones" },
      { id: 5, question: "Who played the character of Jack Dawson in Titanic?", answers: ["Leonardo DiCaprio", "Johnny Depp", "Brad Pitt", "Tom Cruise"], correctAnswer: "Leonardo DiCaprio" }
    ],
    time: "5 min"
  },
  {
    id: 4,
    name: "Math Challenge",
    category: "📐 Toán học",
    questions: [
      { id: 1, question: "What is 10 + 15?", answers: ["25", "20", "30", "35"], correctAnswer: "25" },
      { id: 2, question: "What is the square root of 64?", answers: ["8", "6", "10", "12"], correctAnswer: "8" },
      { id: 3, question: "What is 9 * 8?", answers: ["72", "64", "80", "100"], correctAnswer: "72" },
      { id: 4, question: "What is 100 / 5?", answers: ["20", "25", "30", "40"], correctAnswer: "20" },
      { id: 5, question: "What is 15 - 6?", answers: ["9", "8", "7", "10"], correctAnswer: "9" }
    ],
    time: "8 min"
  },
  {
    id: 5,
    name: "Geography Test",
    category: "🌍 Địa lý",
    questions: [
      { id: 1, question: "What is the capital of Australia?", answers: ["Canberra", "Sydney", "Melbourne", "Perth"], correctAnswer: "Canberra" },
      { id: 2, question: "Which country has the most population?", answers: ["China", "India", "USA", "Indonesia"], correctAnswer: "China" },
      { id: 3, question: "What is the longest river in the world?", answers: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"], correctAnswer: "Amazon River" },
      { id: 4, question: "Which continent is known as the 'Dark Continent'?", answers: ["Africa", "Asia", "Europe", "Australia"], correctAnswer: "Africa" },
    ],
    time: "12 min"
  },
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
        <td>${test.questions.length}</td>
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
    localStorage.setItem('isEditMode', 'false'); // Đặt trạng thái là "thêm"
    window.location.href= "question-manager.html";
  }

  
  // Hàm lấy danh mục từ localStorage và hiển thị trong select
  function populateCategorySelect() {
    const categorySelect = document.getElementById('category');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.name; // Lưu id danh mục
      option.textContent = category.name; // Hiển thị tên danh mục
      categorySelect.appendChild(option);
    });
  }
  
  
  
  // --- Modal sửa bài test ---
  function openEditModal(id) {
    localStorage.setItem('isEditMode', 'true'); // Đặt trạng thái là "sửa"
    localStorage.setItem('currentTestId', id); // Lưu ID bài test
    window.location.href = `question-manager.html?id=${id}`;
  }
  
  
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
      currentTests.sort((a, b) => a.questions.length - b.questions.length);
    } else if (value === "Thời gian"){
      currentTests.sort((a, b) => {
        const timeA = parseInt(a.time.split(' ')[0]);
        const timeB = parseInt(b.time.split(' ')[0]);
        return timeA - timeB; // Sắp xếp theo thời gian tăng dần
      });
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
  
  // --- Khởi tạo ---
  saveTests();
  resetSearchSort();
  populateCategorySelect();
  
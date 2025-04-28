// Dữ liệu danh mục giả lập
let categories = JSON.parse(localStorage.getItem('categories')) || [
  { id: 1, name: "📚 Lịch sử" },
  { id: 2, name: "🧪 Khoa học" },
  { id: 3, name: "✏️ Giải trí" },
  { id: 4, name: "🏡 Đời sống" },
  { id: 5, name: "📚 Lịch sử" },
  { id: 6, name: "🧪 Khoa học" },
  { id: 7, name: "✏️ Giải trí" },
  { id: 8, name: "🏡 Đời sống" },
  { id: 9, name: "📚 Lịch sử" },
  { id: 10, name: "🧪 Khoa học" }
];

const itemsPerPage = 5; // Số lượng mục trên mỗi trang
let currentPage = 1; // Trang hiện tại

// Hàm hiển thị danh mục
function renderCategories() {
  const tbody = document.getElementById('categoryTableBody');
  tbody.innerHTML = ''; // Xoá các hàng cũ trong bảng

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const categoriesToDisplay = categories.slice(startIdx, endIdx);

  categoriesToDisplay.forEach(category => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="openEditModal(${category.id}, '${category.name}')">Sửa</button>
        <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${category.id})">Xoá</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Hàm hiển thị phân trang
function renderPagination() {
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const prevPageLink = document.createElement('li');
  prevPageLink.classList.add('page-item');
  if (currentPage === 1) {
    prevPageLink.classList.add('disabled');
  }
  prevPageLink.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">«</a>`;
  pagination.appendChild(prevPageLink);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('li');
    pageLink.classList.add('page-item');
    if (i === currentPage) {
      pageLink.classList.add('active');
    }
    pageLink.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
    pagination.appendChild(pageLink);
  }

  const nextPageLink = document.createElement('li');
  nextPageLink.classList.add('page-item');
  if (currentPage === totalPages) {
    nextPageLink.classList.add('disabled');
  }
  nextPageLink.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">»</a>`;
  pagination.appendChild(nextPageLink);
}

// Hàm thay đổi trang
function changePage(page) {
  if (page < 1 || page > Math.ceil(categories.length / itemsPerPage)) return;
  currentPage = page;
  renderCategories();
  renderPagination();
}

// Hàm mở modal thêm danh mục
function openAddModal() {
  const modal = document.getElementById('addCategoryModal');
  modal.classList.add('open');
}

// Hàm đóng modal thêm danh mục
function closeAddModal() {
  const modal = document.getElementById('addCategoryModal');
  modal.classList.remove('open');
}

// Hàm mở modal sửa danh mục
function openEditModal(id, name) {
  const modal = document.getElementById('editCategoryModal');
  document.getElementById('editCategoryName').value = name;
  modal.classList.add('open');
  modal.dataset.categoryId = id;
}

// Hàm đóng modal sửa danh mục
function closeEditModal() {
  const modal = document.getElementById('editCategoryModal');
  modal.classList.remove('open');
}

// Hàm xử lý lưu sửa danh mục
document.getElementById('editCategoryForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const modal = document.getElementById('editCategoryModal');
  const categoryId = modal.dataset.categoryId;
  const categoryName = document.getElementById('editCategoryName').value;

  const category = categories.find(c => c.id === parseInt(categoryId));
  if (category) {
    category.name = categoryName; // Cập nhật tên danh mục
  }

  saveCategoriesToLocalStorage();
  closeEditModal();
  renderCategories();
  renderPagination();
});

// Hàm xử lý thêm danh mục
document.getElementById('addCategoryForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const categoryName = document.getElementById('categoryName').value;

  const newCategory = {
    id: categories.length + 1,
    name: categoryName
  };

  categories.push(newCategory);
  saveCategoriesToLocalStorage();
  closeAddModal();
  renderCategories();
  renderPagination();
});

// Modal xóa danh mục
function openDeleteModal(id) {
  const deleteModal = document.getElementById('deleteCategoryModal');
  deleteModal.classList.add('open');

  // Khi bấm "Có", xóa danh mục
  document.getElementById('confirmDelete').onclick = function () {
    deleteCategory(id);
    closeDeleteModal();
  };

  // Khi bấm "Không", đóng modal mà không làm gì
  document.getElementById('cancelDelete').onclick = function () {
    closeDeleteModal();
  };
}

// Xóa danh mục
function deleteCategory(id) {
  categories = categories.filter(category => category.id !== id);
  saveCategoriesToLocalStorage();
  renderCategories();
  renderPagination();
}

// Đóng modal xóa
function closeDeleteModal() {
  const deleteModal = document.getElementById('deleteCategoryModal');
  deleteModal.classList.remove('open');
}

// Lưu danh mục vào localStorage
function saveCategoriesToLocalStorage() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function logOut(){
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('isAdmin');
        window.location.href = "../pages/register-login.html"; 
}


// Khởi tạo trang ban đầu
renderCategories();
renderPagination();


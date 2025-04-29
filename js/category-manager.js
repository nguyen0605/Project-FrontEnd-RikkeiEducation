// Dữ liệu danh mục giả lập
let categories = JSON.parse(localStorage.getItem('categories')) || [
    { id: 1, name: "📚 Lịch sử"},
    { id: 2, name: "🧪 Khoa học"},
    { id: 3, name: "📚 Văn học"},
    { id: 4, name: "✏️ Giải trí"},
    { id: 5, name: "📐 Toán học"},
    { id: 6, name: "🌍 Địa lý"},
    { id: 7, name: "📖 Tiếng Anh"},
    { id: 8, name: "💻 Lập trình"},
    { id: 9, name: "🎨 Nghệ thuật"},
    { id: 10, name: "🎮 Trò chơi"},
    { id: 11, name: "💡 Sáng tạo"},
    { id: 12, name: "✏️ Đời sống"},
    { id: 13, name: "🧠 Kiến thức chung"},
]

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
  e.preventDefault(); // Ngừng hành động mặc định của form

  const categoryName = document.getElementById('categoryName').value.trim();
  const errorMessage = document.getElementById('error-message'); // Lấy phần tử hiển thị lỗi

  // Xóa lỗi cũ nếu có
  if (errorMessage) {
    errorMessage.remove();
  }

  // Kiểm tra nếu tên danh mục trống
  if (!categoryName) {
    // Tạo thông báo lỗi
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '14px';
    errorDiv.textContent = 'Tên danh mục không được để trống';

    // Thêm thông báo lỗi dưới ô input
    document.getElementById('categoryName').insertAdjacentElement('afterend', errorDiv);
    return;
  }

  // Loại bỏ icon để so sánh tên
  const categoryNameWithoutIcon = categoryName.replace(/^[^\w\s]+/g, '').trim(); // Loại bỏ icon (dấu đầu tiên không phải chữ)

  // Kiểm tra nếu tên danh mục đã tồn tại
  const categoryExists = categories.some(category => {
    const categoryNameWithoutIconExisting = category.name.replace(/^[^\w\s]+/g, '').trim();
    return categoryNameWithoutIconExisting.toLowerCase() === categoryNameWithoutIcon.toLowerCase();
  });

  if (categoryExists) {
    // Tạo thông báo lỗi
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '14px';
    errorDiv.textContent = 'Danh mục này đã tồn tại. Vui lòng chọn tên khác.';

    // Thêm thông báo lỗi dưới ô input
    document.getElementById('categoryName').insertAdjacentElement('afterend', errorDiv);
    return;
  }

  // Danh sách các icon để gán ngẫu nhiên
  const icons = ["📚", "🧪", "✏️", "📐", "🌍", "📖", "💻", "🎨", "🎮", "💡","🧠"];

  // Lấy icon ngẫu nhiên từ mảng icons
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  // Tạo danh mục mới
  const newCategory = {
    id: categories.length + 1, // Tạo ID tự động
    name: randomIcon + " " + categoryName // Thêm icon vào tên danh mục
  };

  categories.push(newCategory); // Thêm vào mảng danh mục
  saveCategoriesToLocalStorage(); // Lưu danh mục vào localStorage
  closeAddModal(); // Đóng modal thêm danh mục
  renderCategories(); // Render lại danh sách danh mục
  renderPagination(); // Render lại phân trang
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

// Khởi tạo trang ban đầu
renderCategories();
renderPagination();


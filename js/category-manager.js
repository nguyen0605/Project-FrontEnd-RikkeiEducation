function addCategory() {
    const modal = document.getElementById("addCategoryModal");
    modal.style.display = "flex"; // Hiển thị modal
  }
  
  function closeModal() {
    const modal = document.getElementById("addCategoryModal");
    modal.style.display = "none"; // Ẩn modal
  }
  
  // Đóng modal khi nhấp bên ngoài
  window.addEventListener("click", function (e) {
    const modal = document.getElementById("addCategoryModal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  
  // Xử lý form khi thêm danh mục
  document.getElementById("addCategoryForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const categoryName = document.getElementById("categoryName").value.trim();
    if (categoryName) {
      alert(`Danh mục "${categoryName}" đã được thêm thành công!`);
      closeModal();
      document.getElementById("categoryName").value = ""; // Reset input
    }
  })

  function editCategory(categoryId, categoryName) {
  const modal = document.getElementById("editCategoryModal");
  const input = document.getElementById("editCategoryName");

  input.value = categoryName; // Hiển thị tên danh mục trong ô nhập liệu
  modal.style.display = "flex"; // Hiển thị modal

  // Xử lý form khi chỉnh sửa danh mục
  document.getElementById("editCategoryForm").onsubmit = function (e) {
    e.preventDefault();

    const updatedName = input.value.trim();
    if (updatedName) {
      alert(`Danh mục "${categoryName}" đã được đổi tên thành "${updatedName}"!`);
      closeEditModal();

      // Cập nhật dữ liệu trên giao diện (tùy chỉnh theo nhu cầu)
      const row = document.querySelector(`tr[data-id="${categoryId}"] td:nth-child(2)`);
      if (row) row.textContent = updatedName;
    }
  };
}

function closeEditModal() {
  const modal = document.getElementById("editCategoryModal");
  modal.style.display = "none"; // Ẩn modal
}

// Đóng modal khi nhấn bên ngoài
window.addEventListener("click", function (e) {
  const modal = document.getElementById("editCategoryModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function editCategory(position, categoryName) {
    const modal = document.getElementById("editCategoryModal");
    const input = document.getElementById("editCategoryName");
  
    // Điền tên danh mục vào ô nhập liệu
    input.value = categoryName;
  
    modal.style.display = "flex"; // Hiển thị modal
  
    // Xử lý form khi chỉnh sửa danh mục
    document.getElementById("editCategoryForm").onsubmit = function (e) {
      e.preventDefault();
  
      const updatedName = input.value.trim();
      if (updatedName) {
        alert(`Danh mục "${categoryName}" tại vị trí ${position + 1} đã được đổi tên thành "${updatedName}"!`);
        closeEditModal();
  
        // Cập nhật dữ liệu trên giao diện (cập nhật trực tiếp dòng tương ứng)
        const rows = document.querySelectorAll("tbody tr");
        rows[position].querySelector("td:nth-child(2)").textContent = updatedName;
      }
    };
  }
  
  function closeEditModal() {
    const modal = document.getElementById("editCategoryModal");
    modal.style.display = "none"; // Ẩn modal
  }
  
  // Đóng modal khi nhấp bên ngoài
  window.addEventListener("click", function (e) {
    const modal = document.getElementById("editCategoryModal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  

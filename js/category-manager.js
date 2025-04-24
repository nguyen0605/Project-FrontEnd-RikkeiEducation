document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.btn-danger');
    const editButtons = document.querySelectorAll('.btn-warning');

    // Xóa danh mục
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryName = button.closest('tr').querySelector('td:nth-child(2)').textContent;
            if (confirm(`Bạn chắc chắn muốn xóa danh mục ${categoryName}?`)) {
                button.closest('tr').remove();
            }
        });
    });

    // Chỉnh sửa danh mục
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryName = button.closest('tr').querySelector('td:nth-child(2)').textContent;
            const emoji = button.closest('tr').querySelector('td:nth-child(1)').textContent;
            const newCategory = prompt("Sửa danh mục:", `${emoji} ${categoryName}`);
            if (newCategory) {
                button.closest('tr').querySelector('td:nth-child(2)').textContent = newCategory;
            }
        });
    });

    // Thêm danh mục mới
    const addCategoryButton = document.querySelector('.btn-primary');
    addCategoryButton.addEventListener('click', () => {
        const newCategory = prompt("Nhập tên danh mục:");
        if (newCategory) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>📚</td>
                <td>${newCategory}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2">Sửa</button>
                    <button class="btn btn-danger btn-sm">Xoá</button>
                </td>
            `;
            document.querySelector('tbody').appendChild(newRow);
        }
    });
});

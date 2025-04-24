document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.btn-danger');
    const editButtons = document.querySelectorAll('.btn-warning');

    // Xóa bài test
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const testName = button.closest('tr').querySelector('td:nth-child(2)').textContent;
            if (confirm(`Bạn chắc chắn muốn xóa bài test ${testName}?`)) {
                button.closest('tr').remove();
            }
        });
    });

    // Chỉnh sửa bài test
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const testName = button.closest('tr').querySelector('td:nth-child(2)').textContent;
            const newTestName = prompt("Sửa tên bài test:", testName);
            if (newTestName) {
                button.closest('tr').querySelector('td:nth-child(2)').textContent = newTestName;
            }
        });
    });

    // Thêm bài test mới
    const addTestButton = document.querySelector('.btn-primary');
    addTestButton.addEventListener('click', () => {
        const testName = prompt("Nhập tên bài test:");
        const category = prompt("Nhập danh mục bài test:");
        const questionsCount = prompt("Nhập số câu hỏi:");
        const duration = prompt("Nhập thời gian (phút):");

        if (testName && category && questionsCount && duration) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${Math.floor(Math.random() * 100)}</td>
                <td>${testName}</td>
                <td>${category}</td>
                <td>${questionsCount}</td>
                <td>${duration} min</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2">Sửa</button>
                    <button class="btn btn-danger btn-sm">Xoá</button>
                </td>
            `;
            document.querySelector('tbody').appendChild(newRow);
        }
    });
});

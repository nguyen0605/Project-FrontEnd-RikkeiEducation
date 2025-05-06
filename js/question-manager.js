// Lấy mảng bài test từ localStorage hoặc khởi tạo dữ liệu giả lập nếu không có dữ liệu trong localStorage
let tests = JSON.parse(localStorage.getItem('tests')) || [];

// Lấy ID của bài test từ URL
const urlParams = new URLSearchParams(window.location.search);
const currentTestId = parseInt(urlParams.get('id')); // Lấy ID bài test từ URL
let isEditMode = JSON.parse(localStorage.getItem('isEditMode'));
let editingQuestionId = null;

// --- Hàm render câu hỏi ---
function renderQuestions() {
  const questionList = document.getElementById('questionList');
  questionList.innerHTML = ''; // Clear existing questions

  // Tạo danh mục cho select input
  const categorySelect = document.getElementById('category');
  // Xóa tất cả options trước khi thêm mới để tránh trùng lặp
  categorySelect.innerHTML = '<option selected>Chọn danh mục</option>';
  
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name; 
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  // Lấy bài test theo ID
  const test = tests.find(t => t.id === currentTestId);

  if (test) {
    // Hiển thị thông tin bài test vào các ô input
    document.getElementById('testName').value = test.name;
    document.getElementById('time').value = test.time.replace(' min', '');  // Loại bỏ chữ "min" khỏi thời gian

    // Chọn danh mục hiện tại của bài test
    categorySelect.value = test.category;

    // Render câu hỏi
    test.questions.forEach(question => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${question.id}</td>
        <td class="nameOfQues">${question.question}</td>
        <td>
          <button type="button" class="btn btn-warning btn-sm" onclick="editQuestion(${question.id})">Sửa</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteQuestion(${question.id})">Xóa</button>
        </td>
      `;
      questionList.appendChild(row);
    });
  } else {
    const noQuestionsMessage = document.createElement('tr');
    noQuestionsMessage.innerHTML = '<td colspan="3">Chưa có câu hỏi nào</td>';
    questionList.appendChild(noQuestionsMessage);
  }
}

// --- Hàm mở modal ---
document.getElementById('addQuestionButton').addEventListener('click', openModal);

function openModal() {
  resetModal();
  document.getElementById('addQuestionModal').style.display = 'flex'; // Hiển thị modal
}

// --- Hàm đóng modal ---
function closeModal() {
  document.getElementById('addQuestionModal').style.display = 'none'; // Ẩn modal
}

// --- Hàm thêm câu trả lời ---
document.getElementById('addAnswerButton').addEventListener('click', function() {
  // Tạo câu trả lời mặc định
  addAnswerField();
});

// --- Hàm lưu câu hỏi từ form ---
document.getElementById('addQuestionForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const questionText = document.getElementById('questionText').value.trim();
  const answers = Array.from(document.querySelectorAll('#answersList input[type="text"]')).map(input => input.value.trim());
  const correctAnswers = Array.from(document.querySelectorAll('#answersList input[type="checkbox"]:checked')).map(input => input.closest('.input-group').querySelector('input[type="text"]').value.trim());
  
  if (!questionText || answers.some(answer => answer === '') || correctAnswers.length === 0) {
    alert("Câu hỏi và tất cả các câu trả lời phải được nhập đầy đủ, và phải chọn một đáp án đúng.");
    return;
  }

  const correctAnswer = correctAnswers[0]; // Lấy đáp án đúng đầu tiên

  // Lấy bài test từ `tests`
  let test = tests.find(t => t.id === currentTestId);

  // Nếu không tìm thấy test, tạo mới
  if (!test) {
    const testName = document.getElementById('testName').value.trim();
    const category = document.getElementById('category').value.trim();
    const time = document.getElementById('time').value.trim();
    
    const newTestId = tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1;
    
    test = {
      id: newTestId,
      name: testName,
      category: category,
      time: time + " min", // Thêm "min" vào thời gian
      questions: []
    };
    
    tests.push(test);
  }
  
  // Xử lý thêm/sửa câu hỏi
  if (editingQuestionId !== null) {
    // Cập nhật câu hỏi đang sửa
    const questionIndex = test.questions.findIndex(q => q.id === editingQuestionId);
    if (questionIndex !== -1) {
      const updatedQuestion = { 
        id: editingQuestionId, 
        question: questionText, 
        answers: answers, 
        correctAnswer: correctAnswer 
      };
      
      // Cập nhật câu hỏi trong mảng câu hỏi của bài test
      test.questions[questionIndex] = updatedQuestion;
    }
  } else {
    // Tạo câu hỏi mới
    const newQuestionId = test.questions.length > 0 
      ? Math.max(...test.questions.map(q => q.id)) + 1 
      : 1;

    const question = {
      id: newQuestionId,
      question: questionText,
      answers: answers,
      correctAnswer: correctAnswer
    };

    // Thêm câu hỏi mới vào bài test
    test.questions.push(question);
  }

  // Lưu bài test vào `localStorage`
  localStorage.setItem('tests', JSON.stringify(tests));

  // Reset biến chỉnh sửa
  editingQuestionId = null;

  // Render lại câu hỏi
  renderQuestions();

  // Đóng modal
  closeModal();
});

// --- Hàm lưu bài test ---
function saveQuestion() {
  const testName = document.getElementById('testName').value.trim();
  const category = document.getElementById('category').value.trim();
  const time = document.getElementById('time').value.trim();
  
  if (!testName || category === 'Chọn danh mục' || !time) {
    alert("Vui lòng nhập đầy đủ thông tin bài test (tên, danh mục, thời gian).");
    return;
  }
  
  // Lấy bài test từ `tests`
  let test = tests.find(t => t.id === currentTestId);
  
  // Nếu không tìm thấy test, tạo mới
  if (!test) {
    const newTestId = tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1;
    
    test = {
      id: newTestId,
      name: testName,
      category: category,
      time: time + " min", // Thêm "min" vào thời gian
      questions: []
    };
    
    tests.push(test);
  } else {
    // Cập nhật thông tin bài test
    test.name = testName;
    test.category = category;
    test.time = time + " min";
  }
  
  // Lưu bài test vào `localStorage`
  localStorage.setItem('tests', JSON.stringify(tests));
  
  alert("Đã lưu bài test thành công!");
  
  // Chuyển về trang quản lý bài test
  window.location.href = '../pages/test-manager.html';
}

// Hàm reset lại các trường trong modal
function resetModal() {
  document.getElementById('questionText').value = ''; // Reset câu hỏi
  const answersList = document.getElementById('answersList');
  
  // Reset các câu trả lời
  answersList.innerHTML = '';
  
  // Tạo lại 4 câu trả lời mặc định
  for (let i = 0; i < 4; i++) {
    addAnswerField(); // Thêm các câu trả lời mặc định
  }
  
  // Reset biến chỉnh sửa
  editingQuestionId = null;
}

// Hàm thêm câu trả lời mới
function addAnswerField() {
  const answersList = document.getElementById('answersList');
  
  // Tạo phần tử mới cho câu trả lời
  const newAnswerDiv = document.createElement('div');
  newAnswerDiv.className = 'input-group mb-3';
  
  // Tạo checkbox
  const checkboxDiv = document.createElement('div');
  checkboxDiv.className = 'input-group-text';
  const checkboxInput = document.createElement('input');
  checkboxInput.className = 'form-check-input mt-0';
  checkboxInput.type = 'checkbox';
  checkboxInput.value = '';
  checkboxInput.ariaLabel = 'Checkbox for following text input';
  
  // Chỉ cho phép một checkbox được chọn (đáp án đúng)
  checkboxInput.addEventListener('change', function() {
    if (this.checked) {
      // Bỏ chọn tất cả các checkbox khác
      document.querySelectorAll('#answersList input[type="checkbox"]').forEach(cb => {
        if (cb !== this) cb.checked = false;
      });
    }
  });
  
  checkboxDiv.appendChild(checkboxInput);
  
  // Tạo input cho câu trả lời
  const answerInput = document.createElement('input');
  answerInput.type = 'text';
  answerInput.className = 'form-control';
  answerInput.ariaLabel = 'Text input with checkbox';
  
  // Tạo nút xóa
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-outline-secondary';
  deleteButton.type = 'button';
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.onclick = function() {
    if (answersList.children.length > 2) { // Đảm bảo có ít nhất 2 câu trả lời
      newAnswerDiv.remove(); // Xóa câu trả lời khi nhấn nút xóa
    } else {
      alert("Cần ít nhất 2 câu trả lời cho mỗi câu hỏi!");
    }
  };
  
  // Thêm checkbox, input và nút xóa vào div mới
  newAnswerDiv.appendChild(checkboxDiv);
  newAnswerDiv.appendChild(answerInput);
  newAnswerDiv.appendChild(deleteButton);
  
  // Thêm câu trả lời vào danh sách
  answersList.appendChild(newAnswerDiv);
}

// --- Hàm xóa câu trả lời ---
function deleteAnswer(button) {
  const answersList = document.getElementById('answersList');
  
  if (answersList.children.length > 2) { // Đảm bảo có ít nhất 2 câu trả lời
    button.closest('.input-group').remove(); // Xóa câu trả lời
  } else {
    alert("Cần ít nhất 2 câu trả lời cho mỗi câu hỏi!");
  }
}

// --- Hàm mở modal sửa câu hỏi ---
function editQuestion(questionId) {
  const test = tests.find(t => t.id === currentTestId); // Lấy bài test hiện tại
  const question = test.questions.find(q => q.id === questionId); // Lấy câu hỏi cần sửa

  if (question) {
    // Lưu lại ID của câu hỏi đang sửa
    editingQuestionId = questionId;

    // Điền dữ liệu của câu hỏi vào các ô input trong modal
    document.getElementById('questionText').value = question.question;

    // Lấy danh sách câu trả lời và điền vào modal
    const answersList = document.getElementById('answersList');
    answersList.innerHTML = ''; // Dọn sạch danh sách trả lời hiện tại

    question.answers.forEach((answer) => {
      const newAnswerDiv = document.createElement('div');
      newAnswerDiv.className = 'input-group mb-3';
      
      // Tạo checkbox
      const checkboxDiv = document.createElement('div');
      checkboxDiv.className = 'input-group-text';
      const checkboxInput = document.createElement('input');
      checkboxInput.className = 'form-check-input mt-0';
      checkboxInput.type = 'checkbox';
      checkboxInput.value = answer;
      checkboxInput.ariaLabel = 'Checkbox for following text input';

      // Nếu câu trả lời là đáp án đúng, đánh dấu checkbox
      if (answer === question.correctAnswer) {
        checkboxInput.checked = true;
      }
      
      // Chỉ cho phép một checkbox được chọn (đáp án đúng)
      checkboxInput.addEventListener('change', function() {
        if (this.checked) {
          // Bỏ chọn tất cả các checkbox khác
          document.querySelectorAll('#answersList input[type="checkbox"]').forEach(cb => {
            if (cb !== this) cb.checked = false;
          });
        }
      });
      
      checkboxDiv.appendChild(checkboxInput);
      
      // Tạo input cho câu trả lời
      const answerInput = document.createElement('input');
      answerInput.type = 'text';
      answerInput.className = 'form-control';
      answerInput.value = answer; // Điền câu trả lời vào input
      answerInput.ariaLabel = 'Text input with checkbox';
      
      // Tạo nút xóa
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-outline-secondary';
      deleteButton.type = 'button';
      deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteButton.onclick = function() {
        if (answersList.children.length > 2) { // Đảm bảo có ít nhất 2 câu trả lời
          newAnswerDiv.remove(); // Xóa câu trả lời khi nhấn nút xóa
        } else {
          alert("Cần ít nhất 2 câu trả lời cho mỗi câu hỏi!");
        }
      };
      
      // Thêm checkbox, input và nút xóa vào div mới
      newAnswerDiv.appendChild(checkboxDiv);
      newAnswerDiv.appendChild(answerInput);
      newAnswerDiv.appendChild(deleteButton);
      
      // Thêm câu trả lời vào danh sách
      answersList.appendChild(newAnswerDiv);
    });

    // Hiển thị modal sửa câu hỏi
    document.getElementById('addQuestionModal').style.display = 'flex'; // Hiển thị modal
  }
}

// --- Hàm xóa câu hỏi ---
function deleteQuestion(questionId) {
  // Xác nhận trước khi xóa
  if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
    // Tìm bài test hiện tại theo ID
    const test = tests.find(t => t.id === currentTestId);
    
    if (test) {
      // Xóa câu hỏi trong mảng câu hỏi của bài test
      test.questions = test.questions.filter(q => q.id !== questionId);
      
      // Lưu lại bài test vào `localStorage`
      localStorage.setItem('tests', JSON.stringify(tests));

      // Render lại câu hỏi
      renderQuestions();
    }
  }
}

// --- Initial render ---
// Gọi khi trang được tải
window.addEventListener('DOMContentLoaded', function() {
  renderQuestions();
});
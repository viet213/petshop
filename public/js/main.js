// Hàm để hiển thị thông báo lỗi
function showError(message) {
    alert(message);
}

// Hàm để hiển thị thông báo thành công
function showSuccess(message) {
    alert(message);
}

// Hàm để xử lý thông báo khi trang tải
function handleMessages() {
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    if (errorMessage) {
        showError(errorMessage.textContent);
    }

    if (successMessage) {
        showSuccess(successMessage.textContent);
    }
}

// Gọi hàm để xử lý thông báo khi trang tải
document.addEventListener('DOMContentLoaded', handleMessages);

// Hàm để kiểm tra xem người dùng đã nhập đủ thông tin chưa
function validateForm() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Kiểm tra độ dài mật khẩu
    if (password.length < 8) {
        alert("Mật khẩu phải có ít nhất 8 ký tự.");
        return false; // Ngăn không cho gửi biểu mẫu
    }

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp.");
        return false; // Ngăn không cho gửi biểu mẫu
    }

    return true; // Cho phép gửi biểu mẫu
}

// Hàm để kiểm tra ký tự đặc biệt trong ô tìm kiếm
function validateSearch() {
    const query = document.getElementById('searchQuery').value;

    // Kiểm tra ký tự đặc biệt
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialChars.test(query)) {
        alert("Vui lòng không nhập ký tự đặc biệt trong ô tìm kiếm.");
        return false; // Ngăn không cho gửi biểu mẫu
    }

    return true; // Cho phép gửi biểu mẫu
}

// Hàm để kiểm tra xem người dùng đã nhập đủ thông tin chưa
function fillProfileInfo(checkbox) {
    // Kiểm tra nếu checkbox được chọn
    if (checkbox.checked) {
        // Nếu có thông tin thì điền vào các trường
        if (user.address) {
            document.getElementById('shippingAddress').value = user.address;
        }
        if (user.phone) {
            document.getElementById('phoneNumber').value = user.phone;
        }
        if (user.name) {
            document.getElementById('recipientName').value = user.name;
        }
    } else {
        // Nếu checkbox không được chọn, xóa tất cả giá trị trong các trường
        document.getElementById('shippingAddress').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('recipientName').value = '';
    }
}

// Hàm để check số
function validatePhoneNumber(input) {
    // Loại bỏ tất cả các ký tự không phải là số
    input.value = input.value.replace(/[^0-9]/g, '');

    // Kiểm tra độ dài số điện thoại (ví dụ: tối đa 10 số)
    if (input.value.length > 10) {
        input.value = input.value.slice(0, 10);
    }
}
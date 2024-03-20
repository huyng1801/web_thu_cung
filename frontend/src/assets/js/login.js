

$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        // Ngăn chặn việc gửi form một cách thông thường
        event.preventDefault();

        // Lấy dữ liệu từ form
        var formData = {
            email: $('#email').val(),
            password: $('#password').val()
        };

        // Gửi yêu cầu đăng nhập đến máy chủ
        fetch('http://localhost:3000/api/customers/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Đăng nhập không thành công.');
            }
            return response.json();
        })
        .then(data => {
            // Lưu token vào localStorage
            localStorage.setItem('customer_id', data.customer_id);
            localStorage.setItem('full_name', data.full_name);
            // Xử lý khi đăng nhập thành công
            alert('Đăng nhập thành công!');
            // Chuyển hướng đến trang chính sau khi đăng nhập thành công
            window.location.href = 'index.html';
        })
        .catch(error => {
            // Xử lý khi đăng nhập không thành công
            console.error('Đăng nhập không thành công:', error.message);
            alert('Đăng nhập không thành công. Vui lòng thử lại.');
        });
    });
});

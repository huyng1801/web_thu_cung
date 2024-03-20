document.addEventListener('DOMContentLoaded', function() {

 // Handle form submission
 document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        full_name: document.getElementById('full_name').value,
        phone_number: document.getElementById('phone_number').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value
    };

    fetch('http://localhost:3000/api/customers/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Đăng ký không thành công.');
        }
        return response.json();
    })
    .then(data => {
        alert('Đăng ký thành công! Đăng nhập để tiếp tục.');
        window.location.href = 'login.html';

    })
    .catch(error => {
        alert('Đã xảy ra lỗi khi đăng ký: ' + error.message);
    });

});
});
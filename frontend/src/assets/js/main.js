// Load header
$(function () {
    $("#header").load("header.html", function () {
        // Gọi hàm để load số lượng sản phẩm trong giỏ hàng sau khi header đã load xong
        loadCartItemCount();
        // Function để xử lý tìm kiếm khi submit form
        const handleSearchSubmit = (event) => {
            event.preventDefault(); // Ngăn chặn việc reload trang khi submit form

            const searchInput = document.getElementById('searchInput').value.trim();
            if (searchInput) {
                // Chuyển hướng đến trang search.html và truyền tham số searchInput
                window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
            } else {
                alert('Vui lòng nhập từ khóa tìm kiếm');
            }
        };

        // Lắng nghe sự kiện submit form tìm kiếm
        const btnSearch = document.getElementById('btn-search');
        if (btnSearch) {
            btnSearch.addEventListener('click', handleSearchSubmit);
        }

        const customerName = document.getElementById('customerName');
        const customerSubMenu = document.getElementById('customerSubMenu');

        // Kiểm tra xem đã đăng nhập thành công chưa
        const fullName = localStorage.getItem('full_name');
        if (fullName) {
            customerName.innerHTML = `
                <p class="text-center"><i class="far fa-user-circle fa-2x mr-1"></i></p>
                <span>${fullName}</span>
            `;
            // Hiển thị submenu khi click vào nút đăng nhập/đăng ký
            let submenuDisplayed = false;
            customerName.addEventListener('click', function () {
                if (!submenuDisplayed) {
                    customerSubMenu.style.display = 'block';
                    submenuDisplayed = true;
                } else {
                    customerSubMenu.style.display = 'none';
                    submenuDisplayed = false;
                }
            });
            // Đăng xuất
            const logoutLink = document.getElementById('logoutLink');
            logoutLink.addEventListener('click', function (event) {
                event.preventDefault();
                // Xử lý đăng xuất ở đây, có thể là xóa thông tin khách hàng khỏi localStorage
                localStorage.removeItem('customer_id');
                localStorage.removeItem('full_name');
                // Chuyển hướng về trang đăng nhập sau khi đăng xuất
                window.location.href = 'login.html';
            });
        } else {
            // Nếu chưa đăng nhập, thêm sự kiện click vào nút đăng ký, đăng nhập để chuyển hướng đến trang đăng nhập
            customerName.addEventListener('click', function () {
                window.location.href = 'login.html';
            });
        }

    });
});


// Load nav
$(function () {
    $("#nav").load("navigation.html");
});

// Load footer
$(function () {
    $("#footer").load("footer.html");
});
// Hàm để load danh sách sản phẩm và hiển thị dưới dạng các card
const formatPrice = (price) => {
    // Sử dụng hàm toLocaleString() để định dạng số
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
// Function để load số lượng sản phẩm trong giỏ hàng
const loadCartItemCount = () => {
    try {
        // Xóa toàn bộ dữ liệu trong localStorage
        // localStorage.clear();

        // Lấy thông tin giỏ hàng từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Đếm số lượng sản phẩm trong giỏ hàng (số lượng mỗi sản phẩm không được tính)
        const totalQuantity = Object.keys(cart).length;
        console.log(cart);
        // Hiển thị số lượng sản phẩm trong giỏ hàng
        const cartItemCountElement = document.getElementById('cartItemCount');
        cartItemCountElement.textContent = totalQuantity;
    } catch (error) {
        console.error('Error loading cart item count:', error);
    }
};

// Function để xem chi tiết sản phẩm
const viewProductDetails = async (productId) => {
    // Chuyển đến trang chi tiết sản phẩm với productId được truyền qua URL hoặc bất kỳ cách nào khác bạn chọn.
    window.location.href = `details.html?id=${productId}`;
};

// Function để thêm sản phẩm vào giỏ hàng và lưu vào localStorage
const addToCart = async (productId) => {
    try {
        const quantity = 1;
        // Lấy thông tin giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
        if (cart[productId]) {
            // Tăng số lượng sản phẩm nếu sản phẩm đã tồn tại
            cart[productId] += parseInt(quantity);
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            cart[productId] = parseInt(quantity);
        }

        // Lưu thông tin giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(cart);
        // Hiển thị thông báo thành công
        alert('Đã thêm sản phẩm vào giỏ hàng');
        loadCartItemCount();

    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
};

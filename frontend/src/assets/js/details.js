    // Load header
    $(function () {
        $("#header").load("header.html");
    });
  
    // Load nav
    $(function () {
        $("#nav").load("navigation.html");
    });
           // Load nav
           $(function () {
            $("#footer").load("footer.html");
        });
const loadProductDetails = async () => {
    try {
        // Lấy productId từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (!productId) {
            throw new Error('Product ID is missing in the URL');
        }

        // Gửi yêu cầu lấy thông tin chi tiết sản phẩm đến server
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        const product = await response.json();

        // Hiển thị thông tin chi tiết sản phẩm trên trang
        document.getElementById('productName').textContent = product.product_name;
        document.getElementById('productDescription').textContent = `Mô tả: ${product.description}` ;
        document.getElementById('productPrice').textContent = `Giá: ${formatPrice(product.price)}`;
        document.getElementById('productImage').src = product.image_base64;

        // Thêm sự kiện click cho nút "Thêm vào giỏ hàng"
        document.getElementById('addToCartBtn').addEventListener('click', () => addToCartPageDetails(productId));
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
};

// Function để thêm sản phẩm vào giỏ hàng và lưu vào localStorage
const addToCartPageDetails = async (productId) => {
    try {
        const quantity = document.getElementById('quantity').value;
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

        // Hiển thị thông báo thành công
        alert('Đã thêm sản phẩm vào giỏ hàng');

    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
};

// Function để quay lại trang trước đó
const goBack = () => {
    window.history.back();
};

// Khi trang web được tải, load thông tin chi tiết sản phẩm
window.onload = () => {
    loadProductDetails();
};

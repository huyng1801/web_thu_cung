
// Function để xóa một sản phẩm khỏi giỏ hàng
const removeFromCart = (productId) => {
    try {
        // Lấy thông tin giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Xóa sản phẩm khỏi giỏ hàng
        delete cart[productId];

        // Cập nhật lại giỏ hàng trong localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Load lại danh sách sản phẩm trong giỏ hàng để cập nhật giao diện
        loadCartItems();
        loadCartItemCount();
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
};

// Function để tăng số lượng của một sản phẩm trong giỏ hàng
const increaseQuantity = (productId) => {
    try {
        // Lấy thông tin giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Tăng số lượng sản phẩm
        cart[productId] = (cart[productId] || 0) + 1;

        // Cập nhật lại giỏ hàng trong localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Load lại danh sách sản phẩm trong giỏ hàng để cập nhật giao diện
        loadCartItems();
        loadCartItemCount();
    } catch (error) {
        console.error('Error increasing quantity:', error);
    }
};

// Function để giảm số lượng của một sản phẩm trong giỏ hàng
const decreaseQuantity = (productId) => {
    try {
        // Lấy thông tin giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Giảm số lượng sản phẩm, nhưng không thể nhỏ hơn 1
        cart[productId] = Math.max(1, (cart[productId] || 0) - 1);

        // Cập nhật lại giỏ hàng trong localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Load lại danh sách sản phẩm trong giỏ hàng để cập nhật giao diện
        loadCartItems();
        loadCartItemCount();
    } catch (error) {
        console.error('Error decreasing quantity:', error);
    }
};
const updateQuantity = (productId, newQuantity) => {
    try {
        // Lấy thông tin giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Cập nhật số lượng sản phẩm
        cart[productId] = newQuantity;

        // Cập nhật lại giỏ hàng trong localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Load lại danh sách sản phẩm trong giỏ hàng để cập nhật giao diện và tính toán tổng tiền
        loadCartItems();

        // Tính toán và cập nhật tổng tiền
        calculateTotal();
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
};

const calculateTotal = async () => {
    try {
        let totalAmount = 0;
        const cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Tính tổng tiền dựa trên số lượng và giá của từng sản phẩm
        for (const productId of Object.keys(cart)) {
            const product = await getProductById(productId);
            const quantity = cart[productId];
            const subtotal = product.price * quantity;
            totalAmount += subtotal;
        }

        // Cập nhật tổng tiền trong session
        sessionStorage.setItem('totalAmount', totalAmount);

        // Hiển thị tổng tiền trên giao diện
        const totalAmountElement = document.getElementById('totalAmount');
        totalAmountElement.textContent = totalAmount;
    } catch (error) {
        console.error('Error calculating total:', error);
    }
};

const loadCartItems = async () => {
    try {
        // Lấy thông tin giỏ hàng từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = ''; // Xóa nội dung cũ trước khi cập nhật

        if (Object.keys(cart).length === 0) {
            const emptyCartMessage = document.createElement('h3');
            emptyCartMessage.textContent = 'Giỏ hàng của bạn đang trống.';
            cartItemsContainer.appendChild(emptyCartMessage);
            // Ẩn nút thanh toán khi giỏ hàng trống
            const checkoutBtn = document.getElementById('checkoutBtn');
            checkoutBtn.style.display = 'none';
            return;
        }

        // Tạo bảng để hiển thị giỏ hàng
        const table = document.createElement('table');
        table.classList.add('table', 'table', 'mt-3');
        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th scope="col">Ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Mô tả</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Thành tiền</th>
                <th scope="col">Hành động</th>
            </tr>
        `;
        table.appendChild(tableHead);
        const tableBody = document.createElement('tbody');

        let totalAmount = 0;

        // Sử dụng vòng lặp for...of để đợi cho mỗi sản phẩm được thêm vào bảng
        for (const productId of Object.keys(cart)) {
            // Lấy thông tin sản phẩm từ localStorage hoặc từ server
            const product = await getProductById(productId);
            const quantity = cart[productId];
            const subtotal = product.price * quantity;
            totalAmount += subtotal;
            
            // Tạo hàng mới trong bảng cho mỗi sản phẩm trong giỏ hàng
            // Tạo hàng mới trong bảng cho mỗi sản phẩm trong giỏ hàng
            const row = document.createElement('tr');

            // Thêm ảnh sản phẩm
            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = product.image_base64;
            img.alt = product.product_name;
            img.classList.add('img-thumbnail');
            img.style.maxHeight = '100px'; // Giới hạn chiều cao tối đa là 100px
            imgCell.appendChild(img);
            row.appendChild(imgCell);

            // Thêm tên sản phẩm
            const nameCell = document.createElement('td');
            nameCell.textContent = product.product_name;
            row.appendChild(nameCell);

            // Thêm mô tả sản phẩm
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = product.description;
            row.appendChild(descriptionCell);

            // Thêm giá sản phẩm
            const priceCell = document.createElement('td');
            priceCell.textContent = product.price;
            row.appendChild(priceCell);

            // Thêm số lượng sản phẩm và nút tăng giảm số lượng
            const quantityCell = document.createElement('td');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = quantity;
            quantityInput.min = '1';
            quantityInput.addEventListener('input', () => {
                const newQuantity = parseInt(quantityInput.value);
                updateQuantity(productId, newQuantity);
            });
            
            quantityCell.appendChild(quantityInput);
            row.appendChild(quantityCell);

            // Thêm thành tiền
            const subtotalCell = document.createElement('td');
            subtotalCell.textContent = subtotal;
            row.appendChild(subtotalCell);

            // Thêm nút xóa sản phẩm
            const removeCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('btn', 'btn-danger');
            removeBtn.textContent = 'Xóa';
            removeBtn.addEventListener('click', () => removeFromCart(productId));
            removeCell.appendChild(removeBtn);
            row.appendChild(removeCell);

            // Thêm hàng vào tbody của bảng
            tableBody.appendChild(row);
        }

        // Hiển thị tổng số tiền
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="5" class="text-end">Tổng cộng:</td>
            <td>${totalAmount}</td>
            <td></td>
        `;
        tableBody.appendChild(totalRow);

        table.appendChild(tableBody);
        cartItemsContainer.appendChild(table);

        // Hiển thị nút thanh toán nếu giỏ hàng có sản phẩm
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.style.display = 'block';
        calculateTotal();
    } catch (error) {
        console.error('Error loading cart items:', error);
    }
};



// Function để lấy thông tin của một sản phẩm theo ID
const getProductById = async (productId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
};
const checkout = async () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Lấy customer_id từ localStorage
        const customer_id = localStorage.getItem('customer_id');

        // Kiểm tra xem customer_id có tồn tại không
        if (!customer_id) {
            // Chuyển hướng người dùng đến trang đăng nhập
            window.location.href = 'login.html'; // Thay đổi 'login.html' thành đường dẫn của trang đăng nhập của bạn
            return;
        }

        // Kiểm tra xem giỏ hàng có sản phẩm không
        if (Object.keys(cart).length === 0) {
            alert('Giỏ hàng của bạn đang trống.');
            return;
        }
        
        // Thu thập thông tin từ giỏ hàng
        const order_details = Object.keys(cart).map(productId => {
            return {
                product_id: productId,
                quantity: cart[productId]
            };
        });

        const note = ''; // Bạn có thể thêm chức năng để người dùng nhập ghi chú
        const status = 'Pending'; // Mặc định trạng thái là Pending

        const data = {
            note,
            status,
            customer_id, // Thêm customer_id vào dữ liệu đơn hàng
            order_details
        };
        console.log(data);
        // Gửi dữ liệu lên máy chủ để thêm đơn hàng
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to add order');
        }

        // Xóa giỏ hàng sau khi đơn hàng được thêm thành công
        localStorage.removeItem('cart');

        // Hiển thị thông báo và cập nhật giao diện nếu cần
        alert('Đơn hàng đã được đặt thành công!');
        loadCartItems(); // Cập nhật lại giao diện giỏ hàng
        loadCartItemCount(); // Cập nhật lại số lượng sản phẩm trong giỏ hàng
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.');
    }
};

// Khi trang web được tải, load danh sách sản phẩm trong giỏ hàng
window.onload = () => {
    loadCartItems();
    loadCartItemCount();
    
       // Đăng ký sự kiện cho nút thanh toán
       const checkoutBtn = document.getElementById('checkoutBtn');
       checkoutBtn.addEventListener('click', checkout);
};

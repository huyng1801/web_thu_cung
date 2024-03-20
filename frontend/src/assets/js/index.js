
const loadProductsByCategory = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/categories/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products by category');
        }
        const categories = await response.json();
        const productsContainer = document.getElementById('content');
        categories.forEach(category => {
            // Tạo section cho mỗi danh mục
            const section = document.createElement('section');
            section.classList.add('category-section', 'mt-4');
            
            // Tiêu đề của section
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category.category_name;
            section.appendChild(categoryTitle);
            // Thêm phần hr bên dưới tiêu đề
            const hrElement = document.createElement('hr');
            section.appendChild(hrElement);
            // Container cho danh sách sản phẩm của mỗi danh mục
            const productContainer = document.createElement('div');
            productContainer.classList.add('row');

            // Hiển thị sản phẩm của từng danh mục
            category.products.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-3');
                card.innerHTML = `
                    <div class="card">
                        <img src="${product.image_base64}" class="card-img-top" alt="${product.product_name}">
                        <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.product_name}</h5>
                        <p class="card-text"><small class="text-muted">Giá: ${formatPrice(product.price)}</small></p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary btn-view-details" data-product-id="${product.product_id}">Xem chi tiết</button>
                            <button class="btn btn-success btn-add-to-cart" data-product-id="${product.product_id}">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                    
                    </div>
                `;
                productContainer.appendChild(card);
            });

            section.appendChild(productContainer);
            productsContainer.appendChild(section);
        });
        
        // Add event listeners for view details and add to cart buttons
        productsContainer.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', () => viewProductDetails(btn.getAttribute('data-product-id')));
        });
  
        productsContainer.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => addToCart(btn.getAttribute('data-product-id')));
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
    }
};

    
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
    } catch (error) {
        console.error('Error decreasing quantity:', error);
    }
};

// Function để load danh sách sản phẩm trong giỏ hàng
const loadCartItems = () => {
    try {
        // Lấy thông tin giỏ hàng từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Hiển thị danh sách sản phẩm trong giỏ hàng
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = ''; // Xóa nội dung cũ trước khi cập nhật

        Object.keys(cart).forEach(async productId => {
            // Lấy thông tin sản phẩm từ localStorage hoặc từ server
            const product = await getProductById(productId);

            // Tạo thẻ div cho mỗi sản phẩm trong giỏ hàng
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');

            // Thêm hình ảnh sản phẩm vào card
            const imgDiv = document.createElement('div');
            imgDiv.classList.add('row', 'no-gutters');
            const imgCol = document.createElement('div');
            imgCol.classList.add('col-md-4');
            const img = document.createElement('img');
            img.src = product.image_base64;
            img.classList.add('card-img');
            img.alt = product.product_name;
            imgCol.appendChild(img);
            imgDiv.appendChild(imgCol);

            // Thêm thông tin sản phẩm vào card
            const infoCol = document.createElement('div');
            infoCol.classList.add('col-md-8');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const productName = document.createElement('h5');
            productName.classList.add('card-title');
            productName.textContent = product.product_name;
            const productDescription = document.createElement('p');
            productDescription.classList.add('card-text');
            productDescription.textContent = product.description;
            const productPrice = document.createElement('p');
            productPrice.classList.add('card-text');
            productPrice.textContent = `Giá: ${product.price}`;
            const productQuantity = document.createElement('p');
            productQuantity.classList.add('card-text');
            productQuantity.textContent = `Số lượng: ${cart[productId]}`;
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('btn', 'btn-danger', 'mr-2');
            removeBtn.textContent = 'Xóa';
            removeBtn.addEventListener('click', () => removeFromCart(productId));
            const increaseBtn = document.createElement('button');
            increaseBtn.classList.add('btn', 'btn-secondary', 'mr-2');
            increaseBtn.textContent = '+';
            increaseBtn.addEventListener('click', () => increaseQuantity(productId));
            const decreaseBtn = document.createElement('button');
            decreaseBtn.classList.add('btn', 'btn-secondary');
            decreaseBtn.textContent = '-';
            decreaseBtn.addEventListener('click', () => decreaseQuantity(productId));
            cardBody.appendChild(productName);
            cardBody.appendChild(productDescription);
            cardBody.appendChild(productPrice);
            cardBody.appendChild(productQuantity);
            cardBody.appendChild(removeBtn);
            cardBody.appendChild(increaseBtn);
            cardBody.appendChild(decreaseBtn);
            infoCol.appendChild(cardBody);
            imgDiv.appendChild(infoCol);

            // Thêm card vào container danh sách sản phẩm trong giỏ hàng
            card.appendChild(imgDiv);
            cartItemsContainer.appendChild(card);

        });
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (Object.keys(cart).length > 0) {
            checkoutBtn.style.display = 'block'; // Show the button
        } else {
            checkoutBtn.style.display = 'none'; // Hide the button
        }
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

  
    // Khi trang web được tải, load danh sách danh mục và sản phẩm
    window.onload = () => {
  
        loadProductsByCategory();
    };
    
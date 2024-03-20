// Hàm để load danh sách category và hiển thị trên sidebar
const loadCategories = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/categories/with-products');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const categories = await response.json();
        const categorySidebar = document.getElementById('categorySidebar');
        categories.forEach(category => {
            const listItem = document.createElement('a');
            listItem.classList.add('list-group-item', 'list-group-item-action');
            listItem.href = '#';
            listItem.textContent = category.category_name;
            listItem.addEventListener('click', () => loadProductsByCategory(category.category_id));
            categorySidebar.appendChild(listItem);
        });
          // Load products of the first category by default
          if (categories.length > 0) {
            loadProductsByCategory(categories[0].category_id);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

// Hàm để load danh sách sản phẩm theo category và hiển thị trong phần content
// Hàm để load danh sách sản phẩm theo category và hiển thị trong phần content
const loadProductsByCategory = async (categoryId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/products/category/${categoryId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        const content = document.getElementById('content');
        content.innerHTML = ''; // Xóa nội dung cũ trước khi load sản phẩm mới
        let row; // Biến để lưu dòng hiện tại
        products.forEach((product, index) => {
            if (index % 3 === 0) {
                // Tạo một dòng mới sau mỗi 3 sản phẩm
                row = document.createElement('div');
                row.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-3');
                content.appendChild(row);
            }
            // Tạo card sản phẩm
            const card = document.createElement('div');
            card.classList.add('col');
            card.innerHTML = `
                <div class="card">
                    <img src="${product.image_base64}" class="card-img-top" alt="${product.product_name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.product_name}</h5>
                        <p class="card-text"><small class="text-muted">Giá: ${formatPrice(product.price)}</small></p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary btn-view-details" data-product-id="${product.product_id}">Xem chi tiết</button>
                            <button class="btn btn-success btn-add-to-cart" data-product-id="${product.product_id}">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
            `;
            
            row.appendChild(card);
        });
           // Add event listeners for view details and add to cart buttons
           content.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', () => viewProductDetails(btn.getAttribute('data-product-id')));
        });
        content.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => addToCart(btn.getAttribute('data-product-id')));
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};


// Function để chuyển hướng đến trang chi tiết sản phẩm
const showProductDetails = (productId) => {
    // Chuyển đến trang chi tiết sản phẩm với productId được truyền qua URL hoặc bất kỳ cách nào khác bạn chọn.
    window.location.href = `details.html?id=${productId}`;
};


// Khi trang web được tải, load danh sách category
window.onload = () => {
    loadCategories();
};

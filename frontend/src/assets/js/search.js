// Function để lấy thông tin từ query string
const getQueryParams = () => {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const parts = pair.split('=');
      const key = decodeURIComponent(parts[0]);
      const value = decodeURIComponent(parts[1]);
      params[key] = value;
    });
    return params;
  };
  
// Function để gửi yêu cầu tìm kiếm đến server và hiển thị kết quả
const searchProducts = async () => {
    try {
      const queryParams = getQueryParams();
      const searchQuery = queryParams['query'];
      if (!searchQuery) {
        console.error('Missing search query');
        return;
      }
  
      // Gửi yêu cầu tìm kiếm đến server
      const response = await fetch(`http://localhost:3000/api/products/search/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search for products');
      }
  
      // Lấy kết quả từ server
      const products = await response.json();
  
      // Hiển thị kết quả tìm kiếm trên trang
      const searchResultsContainer = document.querySelector('.container.mt-4');
      searchResultsContainer.innerHTML = ''; // Xóa nội dung cũ trước khi hiển thị kết quả mới
  
      if (products.length === 0) {
        searchResultsContainer.innerHTML = '<p>Không tìm thấy kết quả nào.</p>';
      } else {
        let row; // Biến để lưu trữ hàng (row) hiện tại
        products.forEach((product, index) => {
          if (index % 3 === 0) {
            // Nếu là sản phẩm đầu tiên của hàng mới, tạo một hàng mới
            row = document.createElement('div');
            row.classList.add('row', 'mb-3');
            searchResultsContainer.appendChild(row);
          }
  
          // Tạo một card sản phẩm
          const productCard = document.createElement('div');
          productCard.classList.add('col-md-4');
  
          productCard.innerHTML = `
            <div class="card">
              <img src="${product.image_base64}" class="card-img-top" alt="${product.product_name}">
              <div class="card-body">
                <h5 class="card-title">${product.product_name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text"><small class="text-muted">Giá: ${formatPrice(product.price)}</small></p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-primary btn-view-details" data-product-id="${product.product_id}">Xem chi tiết</button>
                  <button class="btn btn-success btn-add-to-cart" data-product-id="${product.product_id}">Thêm vào giỏ hàng</button>
                </div>
              </div>
            </div>
          `;
  
          // Thêm sự kiện click cho nút Xem chi tiết
          const viewDetailsBtn = productCard.querySelector('.btn-view-details');
          viewDetailsBtn.addEventListener('click', () => viewProductDetails(product.product_id));
  
          // Thêm sự kiện click cho nút Thêm vào giỏ hàng
          const addToCartBtn = productCard.querySelector('.btn-add-to-cart');
          addToCartBtn.addEventListener('click', () => addToCart(product.product_id));
  
          // Thêm card sản phẩm vào hàng hiện tại
          row.appendChild(productCard);
        });
      }
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };
  
  // Khi trang web được tải, gọi hàm để thực hiện tìm kiếm và hiển thị kết quả
  window.onload = searchProducts;
  
const API_URL = 'http://localhost:3000/api/products';
// Tạo một dịch vụ mới để lấy danh sách danh mục từ máy chủ
const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categories');
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách danh mục');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
      throw error;
    }
  }
};

const loadCategoriesIntoDropdown = async (selectElementId, selectedCategoryId) => {
  try {
    const categories = await categoryService.getAllCategories();
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '';

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.category_name;
      if (category.category_id === selectedCategoryId) { // Kiểm tra nếu category_id trùng với sản phẩm hiện tại
        option.selected = true; // Đặt thuộc tính selected
      }
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Lỗi khi tải danh sách danh mục vào dropdown:', error);
  }
};

// Load danh sách danh mục khi modal thêm sản phẩm được mở
$('#addProductModal').on('show.bs.modal', async () => {
  await loadCategoriesIntoDropdown('productCategory');
});

// Load danh sách danh mục khi modal sửa sản phẩm được mở
$('#editProductModal').on('show.bs.modal', async () => {
  await loadCategoriesIntoDropdown('editProductCategory');
});

const productService = {
  getAllProducts: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách sản phẩm');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`);
      if (!response.ok) {
        throw new Error('Không thể lấy sản phẩm theo ID');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm theo ID:', error);
      throw error;
    }
  },

  addProduct: async (productData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: productData // Sử dụng FormData trực tiếp
      });
      if (!response.ok) {
        throw new Error('Không thể thêm sản phẩm');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      throw error;
    }
  },
  

  updateProduct: async (productId, productData) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: 'PUT',
    
        body: productData
      });
      if (!response.ok) {
        throw new Error('Không thể cập nhật sản phẩm');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Không thể xóa sản phẩm');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      throw error;
    }
  }
};

// Hàm để render bảng sản phẩm
const renderProducts = async () => {
  try {
    const products = await productService.getAllProducts();
    const productTableBody = document.getElementById('productTableBody');
    productTableBody.innerHTML = '';

    products.forEach(product => {
      const description = product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description; // Giới hạn chiều dài của mô tả
      const row = `
        <tr>
          <td><img src="${product.image_base64}" alt="Ảnh sản phẩm" style="max-height: 100px;"></td>
          <td>${product.product_name}</td>
 
          <td>${product.price}</td>
          <td>${product.stock_quantity}</td>
          <td>
            <button class="btn btn-primary btn-sm edit-btn" onclick="handleEdit('${product.product_id}', '${product.product_name}', '${product.description}', '${product.price}', '${product.stock_quantity}', '${product.category_id}')">Sửa</button>
            <button class="btn btn-danger btn-sm delete-btn" onclick="handleDelete('${product.product_id}')">Xóa</button>
          </td>
        </tr>
      `;
      productTableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Lỗi khi render sản phẩm:', error);
  }
};

// Xử lý khi nhấn nút Sửa
const handleEdit = async (productId, productName, description, price, stockQuantity, categoryId) => {
  document.getElementById('editProductId').value = productId;
  document.getElementById('editProductName').value = productName;
  document.getElementById('editDescription').value = description;
  document.getElementById('editPrice').value = price;
  document.getElementById('editStockQuantity').value = stockQuantity;

  // Load danh sách danh mục với categoryId của sản phẩm hiện tại
  await loadCategoriesIntoDropdown('editProductCategory', categoryId);

  $('#editProductModal').modal('show');

  const editProductForm = document.getElementById('editProductForm');
  editProductForm.onsubmit = async (event) => {
    event.preventDefault();
    const updatedProductName = document.getElementById('editProductName').value;
    const updatedDescription = document.getElementById('editDescription').value;
    const updatedPrice = document.getElementById('editPrice').value;
    const updatedStockQuantity = document.getElementById('editStockQuantity').value;
    const updatedCategoryId = document.getElementById('editProductCategory').value;

    // Lấy hình ảnh mới nếu có
    const updatedImage = document.getElementById('editProductImage').files[0];
    let formData;

    if (updatedImage) {
      formData = new FormData();
      formData.append('product_name', updatedProductName);
      formData.append('description', updatedDescription);
      formData.append('price', updatedPrice);
      formData.append('stock_quantity', updatedStockQuantity);
      formData.append('image', updatedImage);
      formData.append('category_id', updatedCategoryId);
    } else {
      formData = {
        product_name: updatedProductName,
        description: updatedDescription,
        price: updatedPrice,
        stock_quantity: updatedStockQuantity,
        category_id: updatedCategoryId
      };
    }

    try {
      await productService.updateProduct(productId, formData);
      $('#editProductModal').modal('hide');
      renderProducts();
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
    }
  };
};


// Xử lý khi nhấn nút Xóa
const handleDelete = (productId) => {
  $('#deleteProductModal').modal('show');

  const confirmDeleteButton = document.getElementById('confirmDeleteButton');
  confirmDeleteButton.onclick = async () => {
    try {
      await productService.deleteProduct(productId);
      $('#deleteProductModal').modal('hide');
      renderProducts();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };
};
// Function để xử lý khi submit form thêm sản phẩm
const handleAddProduct = async (event) => {
  event.preventDefault();

  const productName = document.getElementById('productName').value;
  const productDescription = document.getElementById('productDescription').value;
  const productPrice = document.getElementById('productPrice').value;
  const productStock = document.getElementById('productStock').value;
  const productImage = document.getElementById('productImage').files[0];
  const categoryId = document.getElementById('productCategory').value;
  try {
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('description', productDescription);
    formData.append('price', productPrice);
    formData.append('stock_quantity', productStock);
    formData.append('image', productImage);
    formData.append('category_id', categoryId);
  
    
    // Gọi hàm thêm sản phẩm từ dịch vụ productService
    await productService.addProduct(formData);

    // Sau khi thêm thành công, đóng modal và render lại danh sách sản phẩm
    $('#addProductModal').modal('hide');

  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
  }
};

// Thêm sự kiện nghe vào form thêm sản phẩm
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', handleAddProduct);

// Load danh sách sản phẩm khi trang được tải
window.onload = () => {
  renderProducts();
};

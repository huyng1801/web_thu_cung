$(document).ready(function () {
  // Function to fetch orders from the API and render them in the table
  const fetchAndRenderOrders = async () => {
      try {
          // Fetch orders using fetch
          const response = await fetch('http://localhost:3000/api/orders');
          if (!response.ok) {
              throw new Error('Error fetching orders');
          }
          const orders = await response.json();
          renderOrders(orders);
      } catch (error) {
          console.error('Error fetching orders:', error);
      }
  };

// Function to render orders in the table
const renderOrders = (orders) => {
  const orderTableBody = $('#orderTableBody');
  orderTableBody.empty();
  orders.forEach(order => {
    const customer = order.Customer; // Lấy thông tin của khách hàng từ đối tượng order

    const row = `
      <tr>
        <td>${order.order_id}</td>
        <td>${order.total_price}</td>
        <td>${order.note}</td>
        <td>${order.status}</td>
  
        <td>${customer.full_name}</td> <!-- Thêm thông tin tên khách hàng -->
        <td>${customer.email}</td> <!-- Thêm thông tin email -->
        <td>${customer.address}</td> <!-- Thêm thông tin địa chỉ -->
        <td>${customer.phone_number}</td> <!-- Thêm thông tin số điện thoại -->
        <td>
          <button class="btn btn-primary btn-sm detail-btn" onclick="showOrderDetails(${order.order_id})">Chi tiết</button>
          <button class="btn btn-danger btn-sm delete-btn" data-toggle="modal" data-target="#deleteOrderModal" data-orderid="${order.order_id}">Delete</button>
        </td>
      </tr>
    `;
    orderTableBody.append(row);
  });
};

// Define showOrderDetails in the global scope
window.showOrderDetails = async (orderId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/order-details/${orderId}`);
    if (!response.ok) {
      throw new Error('Error fetching order details');
    }
    const orderDetails = await response.json();
    renderOrderDetails(orderDetails);
    $('#detailOrderModal').modal('show'); // Show the detail modal
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
};


const renderOrderDetails = (orderDetails) => {
  const orderDetailsContainer = $('#orderDetailsContainer');
  orderDetailsContainer.empty();

  // Khởi tạo tổng tiền và bảng chi tiết đơn hàng
  let total = 0;
  const tableHtml = `
    <table class="table">
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
          <th>Giá</th>
        </tr>
      </thead>
      <tbody id="orderDetailsTableBody">
      </tbody>
    </table>
    <p>Tổng tiền: <span id="totalPrice"></span></p>
  `;
  orderDetailsContainer.append(tableHtml);
  const orderDetailsTableBody = $('#orderDetailsTableBody');

  // Lặp qua từng sản phẩm để hiển thị trong bảng
  orderDetails.forEach(detail => {
    const product = detail.Product;
    total += detail.sale_price * detail.quantity;
    const imageHtml = `<img src="${product.image_base64}" alt="${product.product_name}" style="max-height: 100px;">`;
    const detailHtml = `
      <tr>
        <td>${imageHtml}</td>
        <td>${product.product_name}</td>
        <td>${detail.quantity}</td>
        <td>${detail.sale_price}</td>
      </tr>
    `;
    orderDetailsTableBody.append(detailHtml);
  });

  // Hiển thị tổng tiền
  $('#totalPrice').text(total);
};


  // Fetch and render orders when the page loads
  fetchAndRenderOrders();
});

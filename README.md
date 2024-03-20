root/
│
├── backend/                             #Chứa mã nguồn của phần backend của ứng dụng Node.js.
│   ├── node_modules/                    # Thư mục chứa các module và thư viện Node.js được cài đặt bằng npm
│   ├── src/                             # Mã nguồn của backend
│   │   ├── uploads/
│   │   ├── middleware/
│   │   │   ├── upload.js                # Middleware xử lý việc tải lên hình ảnh
│   │   │   ├── getImageBase64.js        # Lấy ảnh từ đường dẫn và chuyển sang định dạng Base64
│   │   ├── controllers/                 # Thư mục chứa các controllers của ứng dụng
│   │   │   ├── userController.js        # Controller cho người dùng
│   │   │   ├── categoryController.js    # Controller cho danh mục
│   │   │   ├── productController.js     # Controller cho sản phẩm
│   │   │   ├── orderController.js       # Controller cho đơn hàng
│   │   │   ├── orderDetailController.js # Controller cho chi tiết đơn hàng
│   │   │   └── customerController.js    # Controller cho khách hàng
│   │   ├── models/                      # Thư mục chứa các models của ứng dụng
│   │   │   ├── user.js                  # Model cho người dùng
│   │   │   ├── category.js              # Model cho danh mục
│   │   │   ├── product.js               # Model cho sản phẩm
│   │   │   ├── customer.js              # Model cho khách hàng
│   │   │   ├── order.js                 # Model cho đơn hàng
│   │   │   └── orderDetail.js           # Model cho chi tiết đơn hàng
│   │   ├── routes/                      # Thư mục chứa các routes của ứng dụng
│   │   │   ├── userRoutes.js            # Định tuyến cho các tương tác với người dùng
│   │   │   ├── categoryRoutes.js        # Định tuyến cho các tương tác với danh mục
│   │   │   ├── productRoutes.js         # Định tuyến cho các tương tác với sản phẩm
│   │   │   ├── orderRoutes.js           # Định tuyến cho các tương tác với đơn hàng
│   │   │   ├── orderDetailRoutes.js     # Định tuyến cho các tương tác với chi tiết đơn hàng
│   │   │   └── customerRoutes.js        # Định tuyến cho các tương tác với khách hàng
│   │   └── config/                      # Thư mục chứa các file cấu hình cho ứng dụng
│   │       └── dbConfig.js              # Cấu hình kết nối cơ sở dữ liệu
│   ├── package.json                     # File cấu hình npm và các dependencies của backend
│   ├── server.js                        # File chính của server
│   └── ...
│           
└── frontend/
    ├── src/                # Thư mục chứa các tài nguyên tĩnh như HTML, CSS, hình ảnh
        ├── admin/             # Thư mục chứa các tệp HTML, CSS, JavaScript cho phần quản trị (admin)
        │   ├── index.html     # Trang chủ của phần quản trị
        │   ├── dashboard.html # Trang dashboard cho phần quản trị
        │   ├── ...
        ├── index.html         # Trang chủ của phần người dùng
        ├── profile.html       # Trang thông tin cá nhân của người dùng


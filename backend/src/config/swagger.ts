export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'LuxDecor Furniture API Documentation',
    version: '1.0.0',
    description: 'Tài liệu API hoàn chỉnh cho hệ thống Website Nội Thất Cao Cấp LuxDecor (Node.js + TypeScript + MongoDB Atlas). Chuẩn JWT Authentication tương thích Pet_Manager.',
    contact: {
      name: 'LuxDecor Dev Team',
      email: 'admin@luxdecor.vn',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập JWT Access Token vào đây (ví dụ: eyJhbGciOi...)',
      },
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          error: { type: 'boolean', example: false },
          code: { type: 'number', example: 200 },
          message: { type: 'string', example: 'Thao tác thành công' },
          data: { type: 'object' },
          traceId: { type: 'string', example: 'tr_k89a1b2c' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['loginName', 'password'],
        properties: {
          loginName: { type: 'string', example: 'admin', description: 'Tên đăng nhập hoặc email' },
          password: { type: 'string', example: 'Admin@123456' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['s_user', 's_PWD', 'email'],
        properties: {
          s_user: { type: 'string', example: 'khachhang1' },
          s_PWD: { type: 'string', example: 'Password@123' },
          email: { type: 'string', example: 'khachhang1@gmail.com' },
          phone: { type: 'string', example: '0912345678' },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOi...' },
        },
      },
      OrderCheckoutRequest: {
        type: 'object',
        required: ['items', 'customerInfo'],
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string', example: 'prod-1' },
                quantity: { type: 'number', example: 1 },
                selectedColor: { type: 'string', example: 'Nâu Nho (Cognac)' },
              },
            },
          },
          customerInfo: {
            type: 'object',
            required: ['fullName', 'phone', 'address', 'city', 'district'],
            properties: {
              fullName: { type: 'string', example: 'Nguyễn Văn A' },
              phone: { type: 'string', example: '0987654321' },
              email: { type: 'string', example: 'vana@gmail.com' },
              address: { type: 'string', example: '123 Đường Lê Lợi' },
              city: { type: 'string', example: 'Hà Nội' },
              district: { type: 'string', example: 'Hoàn Kiếm' },
              note: { type: 'string', example: 'Giao giờ hành chính' },
              paymentMethod: { type: 'string', enum: ['cod', 'bank_transfer', 'credit_card'], example: 'cod' },
            },
          },
          voucherCode: { type: 'string', example: 'FREESHIP' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health Check'],
        summary: 'Kiểm tra tình trạng server',
        responses: {
          200: { description: 'Server hoạt động bình thường' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Đăng nhập tài khoản',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Đăng nhập thành công, trả về access_token và refresh_token' },
          400: { description: 'Sai tài khoản hoặc mật khẩu' },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Đăng ký tài khoản khách hàng mới',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Đăng ký thành công' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Làm mới Access Token khi token hết hạn (Auto Refresh)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Cấp cặp token mới thành công' },
          401: { description: 'Refresh token không hợp lệ hoặc đã hết hạn' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Lấy thông tin profile người dùng hiện tại',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Thông tin tài khoản' },
          401: { description: 'Chưa đăng nhập' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lấy danh sách danh mục nội thất (kèm đếm sản phẩm)',
        responses: {
          200: { description: 'Danh sách danh mục' },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Lấy danh sách sản phẩm (có bộ lọc, tìm kiếm, sắp xếp, phân trang)',
        parameters: [
          { name: 'categoryId', in: 'query', schema: { type: 'string' }, description: 'Lọc theo slug hoặc id danh mục' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Tìm kiếm theo tên / mô tả' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['featured', 'price-asc', 'price-desc', 'rating', 'newest'] } },
          { name: 'page', in: 'query', schema: { type: 'number', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'number', default: 12 } },
        ],
        responses: {
          200: { description: 'Danh sách sản phẩm phù hợp' },
        },
      },
    },
    '/products/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Chi tiết sản phẩm kèm album ảnh, biến thể và đánh giá',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'sofa-da-bo-y-milano-premium' },
        ],
        responses: {
          200: { description: 'Chi tiết sản phẩm' },
          404: { description: 'Không tìm thấy sản phẩm' },
        },
      },
    },
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Lấy giỏ hàng của tài khoản đang đăng nhập',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Giỏ hàng của người dùng' },
        },
      },
    },
    '/cart/items': {
      post: {
        tags: ['Cart'],
        summary: 'Thêm sản phẩm vào giỏ hàng',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['product_id'],
                properties: {
                  product_id: { type: 'string', example: 'prod-1' },
                  quantity: { type: 'number', example: 1 },
                  selected_color: { type: 'string', example: 'Nâu Nho (Cognac)' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Đã thêm vào giỏ hàng' },
        },
      },
    },
    '/vouchers': {
      get: {
        tags: ['Vouchers'],
        summary: 'Danh sách mã giảm giá đang hoạt động',
        responses: {
          200: { description: 'Danh sách mã' },
        },
      },
    },
    '/vouchers/{code}': {
      get: {
        tags: ['Vouchers'],
        summary: 'Kiểm tra mã giảm giá theo mã code',
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string' }, example: 'LUXURY10' },
        ],
        responses: {
          200: { description: 'Mã hợp lệ' },
          404: { description: 'Mã không tồn tại hoặc hết hạn' },
        },
      },
    },
    '/orders': {
      post: {
        tags: ['Orders & Checkout'],
        summary: 'Đặt hàng (Checkout) - Tự động trừ kho & xóa giỏ hàng',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderCheckoutRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Đặt hàng thành công' },
        },
      },
      get: {
        tags: ['Orders & Checkout'],
        summary: 'Lịch sử đơn hàng của tài khoản đang đăng nhập',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Danh sách đơn hàng' },
        },
      },
    },
    '/banners': {
      get: {
        tags: ['Banners & UI'],
        summary: 'Danh sách Hero Banners trang chủ',
        responses: {
          200: { description: 'Danh sách banner' },
        },
      },
    },
    '/banners/trustbar': {
      get: {
        tags: ['Banners & UI'],
        summary: 'Danh sách cam kết (TrustBar items)',
        responses: {
          200: { description: 'Danh sách trustbar' },
        },
      },
    },
    '/banners/showcase': {
      get: {
        tags: ['Banners & UI'],
        summary: 'Thông tin khối Showcase nổi bật',
        responses: {
          200: { description: 'Dữ liệu showcase' },
        },
      },
    },
  },
};

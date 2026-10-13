# 🧪 BỘ TEST CASE KIỂM THỬ TOÀN DIỆN HỆ THỐNG LUXDECOR (100% DỮ LIỆU ĐỘNG)

---

## 📌 I. CẤU HÌNH HỆ THỐNG TEST
- **Web Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api/v1`
- **Swagger Docs:** `http://localhost:5000/api-docs`
- **Cơ sở dữ liệu:** MongoDB Atlas Cloud (`luxdecor_db`)

---

## 🛒 II. TEST CASE PHÂN HỆ KHÁCH HÀNG (CLIENT WEB)

### TC-CLI-01: Xem & Khám phá sản phẩm (Dữ liệu động từ MongoDB)
- **Mục tiêu:** Kiểm tra dữ liệu trang chủ và danh sách sản phẩm lấy từ DB thực tế qua React Query.
- **Các bước:**
  1. Truy cập `http://localhost:5173/`
  2. Kiểm tra Banner tải từ `/api/v1/banners`
  3. Kiểm tra danh mục tải từ `/api/v1/categories`
  4. Bấm vào chi tiết 1 sản phẩm `http://localhost:5173/products/:id`
- **Kết quả mong đợi:** Tên, giá, hình ảnh, biến thể màu sắc, kích thước hiển thị đầy đủ từ backend.

### TC-CLI-02: Giỏ hàng & Áp dụng Voucher động
- **Mục tiêu:** Thêm sản phẩm và kiểm tra tính toán đơn hàng.
- **Các bước:**
  1. Thêm 1 hoặc 2 sản phẩm vào giỏ hàng.
  2. Vào trang `/cart`.
  3. Nhập mã voucher (Ví dụ: `LUX10` hoặc voucher tạo trong Admin).
- **Kết quả mong đợi:** Chiết khấu và phí vận chuyển tự động tính lại chính xác theo policy backend.

### TC-CLI-03: Đặt hàng thanh toán COD (Tiền mặt)
- **Mục tiêu:** Tạo đơn hàng 100% vào database, không lưu trữ tạm.
- **Các bước:**
  1. Vào `/checkout`.
  2. Điền họ tên, số điện thoại, địa chỉ nhận hàng.
  3. Chọn phương thức: **Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)**.
  4. Bấm "Đặt Hàng".
- **Kết quả mong đợi:**
  - Hệ thống tạo đơn thành công trên DB (`LS_Orders`), trừ tồn kho tương ứng.
  - Bot Telegram bắn tin nhắn thông báo đơn mới tới Admin.
  - Chuyển hướng tới `/orders/{s_order_id}` hiển thị trạng thái "Chờ duyệt", "Chưa thanh toán".

### TC-CLI-04: Đặt hàng thanh toán VietQR (Chuyển khoản động)
- **Mục tiêu:** Kiểm tra VietQR lấy chính xác STK từ Cấu hình Admin.
- **Các bước:**
  1. Tại `/checkout`, chọn phương thức: **Chuyển Khoản Ngân Hàng Qua Mã QR**.
  2. Đặt hàng thành công, vào trang `/orders/{s_order_id}`.
- **Kết quả mong đợi:**
  - Mã QR hiển thị chuẩn theo chuẩn `VietQR Napas 247`.
  - Quét mã QR bằng App Banking tự động điền STK, chủ tài khoản, số tiền và nội dung đơn hàng.
  - Các nút copy "Số tài khoản", "Nội dung" hoạt động mượt mà.

### TC-CLI-05: Đặt hàng thanh toán trực tuyến Cổng VNPay
- **Mục tiêu:** Kiểm tra tạo URL VNPay chuẩn RFC và checksum SHA512.
- **Các bước:**
  1. Tại `/checkout`, chọn phương thức: **Cổng Thanh Toán VNPay**.
  2. Bấm "Đặt Hàng".
- **Kết quả mong đợi:**
  - Web tự động redirect sang cổng VNPay Sandbox (`sandbox.vnpayment.vn`).
  - Không gặp lỗi "Sai chữ ký" hoặc "Dữ liệu không hợp lệ".
  - Sử dụng thẻ test VNPay Sandbox để thanh toán:
    - **Ngân hàng:** NCB
    - **Số thẻ:** `9704198526191432198`
    - **Chủ thẻ:** `NGUYEN VAN A`
    - **Ngày phát hành:** `07/15`
    - **OTP:** `123456`
  - Sau khi xác thực xong, VNPay tự động chuyển hướng về web với tham số `?payment=success`. Đơn hàng chuyển sang trạng thái "Đã thanh toán" và "Đang xử lý".

### TC-CLI-06: Huỷ đơn hàng trực tiếp
- **Mục tiêu:** Khách hàng có thể hủy đơn khi đơn còn ở trạng thái `pending`.
- **Các bước:**
  1. Tại trang chi tiết đơn hàng `/orders/{s_order_id}` đang ở trạng thái Chờ duyệt.
  2. Nhấp nút "Hủy đơn" và xác nhận.
- **Kết quả mong đợi:** Trạng thái chuyển thành "Đã hủy", tồn kho tự động được hoàn lại trong database.

---

## 🛠️ III. TEST CASE PHÂN HỆ QUẢN TRỊ (ADMIN PANEL)

### TC-ADM-01: Cấu hình Cổng Thanh Toán & Ngân Hàng (Payment Settings)
- **Mục tiêu:** Cấu hình STK ngân hàng và mã VNPay động hoàn toàn.
- **Các bước:**
  1. Đăng nhập tài khoản Admin, truy cập `/admin/payment-settings`.
  2. Bật/tắt cổng VNPay, nhập `vnp_TmnCode` và `vnp_HashSecret`.
  3. Nhập Ngân hàng thụ hưởng (MB, VCB,...), Số tài khoản, Tên chủ tài khoản.
  4. Bấm "Lưu cấu hình thanh toán".
- **Kết quả mong đợi:** Dữ liệu lưu ngay vào MongoDB collection `LS_Settings`, trang chi tiết đơn hàng của người dùng cập nhật ngay mã VietQR mới mà không cần sửa code.

### TC-ADM-02: Quản lý & Cập nhật trạng thái đơn hàng (Orders Management)
- **Mục tiêu:** Theo dõi và đổi trạng thái đơn hàng, trạng thái thanh toán.
- **Các bước:**
  1. Truy cập `/admin/orders`.
  2. Lọc đơn theo trạng thái đơn hàng hoặc trạng thái thanh toán (Đã thanh toán / Chưa thanh toán).
  3. Tìm kiếm đơn bằng mã hoặc SĐT khách.
  4. Đổi trạng thái từ `Chờ duyệt` -> `Đang xử lý` -> `Đang giao hàng` -> `Hoàn thành`.
- **Kết quả mong đợi:** Cập nhật thành công, khi chuyển sang "Hoàn thành" thì trạng thái thanh toán tự động chuyển sang "Đã thanh toán" (đối với đơn COD).

### TC-ADM-03: Quản lý Sản Phẩm, Tồn Kho & Danh Mục
- **Mục tiêu:** Thêm, sửa, xóa sản phẩm và biến thể.
- **Các bước:**
  1. Vào `/admin/products`.
  2. Thêm mới 1 sản phẩm có ảnh Cloudflare R2, giá gốc, giá khuyến mãi, số lượng tồn kho.
  3. Sửa sản phẩm và xóa sản phẩm.
- **Kết quả mong đợi:** Danh sách sản phẩm trên Web khách hàng cập nhật tức thì.

---

## 🤖 IV. TEST CASE TÍCH HỢP HỆ THỐNG
1. **Telegram Notification:** Đặt 1 đơn hàng mới -> Kiểm tra tin nhắn Telegram thông báo đơn hàng gửi về máy quản trị viên trong vòng 2 giây.
2. **IPN Webhook:** Gửi request test IPN VNPay tới `/api/v1/payment/vnpay/ipn` -> Hệ thống đối soát số tiền và tự động cập nhật đơn hàng thành công mà không cần người dùng truy cập lại web.

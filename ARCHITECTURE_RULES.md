# NGUYÊN TẮC KIẾN TRÚC & PHÁT TRIỂN HỆ THỐNG (BẮT BUỘC)

> **QUY TẮC CỐT LÕI:**
> **100% DỮ LIỆU ĐỘNG TỪ DATABASE. TUYỆT ĐỐI KHÔNG DÙNG DỮ LIỆU GIẢ / HARDCODED FALLBACK OBJECTS / MOCK ARRAYS Ở CẢ FRONTEND VÀ BACKEND.**

---

### 1. TUYỆT ĐỐI BỎ FALLBACK VÀ HARDCODE
1. **Không tạo object/array giả mạo làm giá trị dự phòng (mock fallback)**:
   - Nghiêm cấm: `const DEFAULT_SHOWCASE = { title: '...', subtitle: '...', ... }`
   - Nghiêm cấm: `const CONTACT_ITEMS = [ { phone: '0999888777' }, ... ]`
   - Nghiêm cấm: `vnpay_tmn_code: val.vnpay_tmn_code || '2QXUI4J4'` (Không tự ý gán đè mã test của bên thứ ba khi người dùng đã cấu hình hoặc để trống)
2. **Xử lý khi Database không có dữ liệu**:
   - Nếu bản ghi chưa được tạo trong DB hoặc đang ở trạng thái ẩn (`is_active: false`):
     - API backend trả về `null` hoặc danh sách rỗng `[]`.
     - Frontend UI kiểm tra: Nếu không có dữ liệu thì không render khối đó (`if (!data) return null;`) hoặc hiển thị trạng thái trống (Empty State).
     - Tuyệt đối không tự ý hiển thị nội dung giả lập hoặc tự điền thông tin thay thế.

---

### 2. QUẢN TRỊ ADMIN TOÀN DIỆN (100% CONFIGURABLE)
1. **Khối Bộ Sưu Tập (Showcase / Featured Collection)**:
   - Toàn bộ nội dung: Tiêu đề (`title`), Mô tả (`subtitle`), Nhãn Badge (`badge_text`), Đường dẫn nút bấm (`link_url`), Hình ảnh (`image_url`), Trạng thái hiển thị (`is_active`) đều phải được quản trị và lưu trong cơ sở dữ liệu (`LS_Banners` với `type: 'showcase'`).
   - Admin vào trang quản lý Banners có đầy đủ form nhập và cập nhật các trường này.
2. **Cổng thanh toán & Tài khoản ngân hàng**:
   - Mọi thông tin ngân hàng (Tên ngân hàng, Số tài khoản, Tên chủ tài khoản) và thông tin cổng thanh toán (VNPay TMN Code, Hash Secret, Sandbox Mode) được lưu tại `LS_Settings` (key: `payment_settings`).
   - Không tự ý gán đè giá trị fallback khi chưa có sự xác nhận của người dùng.
3. **Hotline & Zalo Chatbot / Tư vấn**:
   - Danh sách nhân viên tư vấn, số điện thoại, link Zalo, hotline được lưu tại `LS_Settings` (key: `contact_settings`).
   - Không hardcode danh sách nhân viên hoặc số điện thoại trong component.

---

### 3. ĐỒNG BỘ BAREM MÀU SẮC CHUẨN
- **Màu San Hô (`#DE7272`)**: Màu nhấn chính (Primary CTA, Nút bấm mua hàng, Giá tiền, Icon chính).
- **Màu Đào (`#FFCA88`)**: Màu nhấn phụ (Hover liên kết, Sao đánh giá, Tag nổi bật).
- **Màu Bạc Hà (`#B4E4D6`)**: Trạng thái thành công, checkmark, huy hiệu "MỚI".
- **Màu Kem (`#FFF6A9`)**: Nền badge và highlight phụ.
- **Màu Than Chì / Đen đá (`#1c1917` / `#292524`)**: Chữ chính và nền tối sang trọng.
- **Tuyệt đối không dùng**: Các mã màu nâu đất, cam cháy (`#78350f`, `#92400e`, `#451a03`, `bg-amber-...`).

---

### 4. CHUẨN KIẾN TRÚC: TYPE -> SERVICE -> HOOK -> UI (BẮT BUỘC TUÂN THỦ)
Mỗi tầng có đúng một trách nhiệm duy nhất (Single Responsibility Principle), TUYỆT ĐỐI KHÔNG KHAI BÁO LẪN LỘN:
1. **Tầng TYPE (`src/types/...`)**:
   - Nơi duy nhất khai báo các interface, type, DTO, entity types.
   - TUYỆT ĐỐI KHÔNG khai báo interface/type trực tiếp trong file Hook hoặc Component UI.
2. **Tầng SERVICE (`src/services/v1/...`)**:
   - Chịu trách nhiệm gọi API Backend bằng `instanceBE` hoặc `axios`.
   - Import type từ `src/types/...`.
   - Trả về dữ liệu thô (raw data/Promise). Không chứa hook hay state của React.
3. **Tầng HOOK (`src/features/.../hooks/...`)**:
   - Sử dụng React Query (`useQuery`, `useMutation`) hoặc React state để quản lý trạng thái, cache, re-fetch.
   - Import type từ `src/types/...` và service từ `src/services/v1/...`.
   - CHỈ chứa logic hook. TUYỆT ĐỐI KHÔNG định nghĩa types/interfaces tại đây.
4. **Tầng UI (`src/components/...`, `src/features/.../pages/...`, `src/features/.../components/...`)**:
   - Chỉ nhận dữ liệu từ Hook và Render JSX, bắt tương tác của người dùng.
   - TUYỆT ĐỐI KHÔNG gọi trực tiếp service hay axios trong UI, phải thông qua Custom Hook.

# NGUYÊN TẮC KIẾN TRÚC & QUY CHUẨN LẬP TRÌNH BẮT BUỘC (LUXDECOR)
# THAM CHIẾU 100% TỪ: E:\FW\tev-fe-admin & E:\FW\Pet_Manager

> **CHỈ THỊ CỐT LÕI CHO AI AGENT**:
> Toàn bộ dự án phải tuân thủ 100% cấu trúc, tư duy code clean và các pattern từ **`E:\FW\tev-fe-admin`** và **`E:\FW\Pet_Manager`**.
> Học hỏi, kế thừa, sao chép trọn vẹn các components, hooks, patterns sẵn có. Tuyệt đối không tự ý bịa đặt code rác, không làm lệch chuẩn hệ thống.

---

## 1. ZERO CODE RÁC & TUYỆT ĐỐI KHÔNG FALLBACK TÙY TIỆN (ZERO DUMMY / FALLBACK DATA)

- **NGHIÊM CẤM TUYỆT ĐỐI** viết các cú pháp fallback inline dữ liệu giả tạo hoặc chuỗi tùy tiện trong toàn bộ hệ thống (cả frontend lẫn backend):
  - ❌ `nickname={name || 'Khách'}`
  - ❌ `name || 'Khách vãng lai'`
  - ❌ `src={url || '/images/placeholder-image.png'}`
  - ❌ `category || 'Nội thất chung'`
  - ❌ `role || 'Khách hàng xác thực'`
- **QUY CHUẨN XỬ LÝ DỮ LIỆU THỰC**:
  - Dữ liệu từ API / Database có gì render nấy, tôn trọng schema và contract dữ liệu.
  - Khi dữ liệu `null`, `undefined` hoặc rỗng:
    - Trong phần chi tiết thông tin: BẮT BUỘC sử dụng `FieldCell` (`~/components/shared/FieldCell`). Hàm `isInvalid(value)` sẽ tự động render dấu `-` màu `text-slate-400`.
    - Trong thẻ hình ảnh `Image`: Truyền trực tiếp `src={row.imageUrl}`. Không gán `||` chuỗi fallback vào prop `src`.
    - Không được tự ý bịa đặt chuỗi tiếng Việt hoặc tiếng Anh để "chống cháy" giao diện.

---

## 2. CẤU TRÚC CODE 4 TẦNG PHÂN LẬP RÕ RÀNG (TYPE -> SERVICE -> HOOK -> UI)

Mọi tính năng (Feature) đều phải tuân thủ nghiêm ngặt mô hình 4 tầng phân lập theo chuẩn của `Pet_Manager` và `tev-fe-admin`:

```
src/
├── types/                      # TẦNG 1: Interfaces, Types, DTOs
│   └── order.type.ts
├── services/v1/                # TẦNG 2: API Service Class kế thừa instanceBE
│   └── order.service.ts
├── features/<feature>/
│   ├── hooks/                  # TẦNG 3: Custom hooks (React Query, toast, state)
│   │   └── useOrder.ts
│   ├── components/             # TẦNG 4A: Bóc tách các Sub-Components nhỏ gọn
│   │   ├── OrdersTable.tsx
│   │   ├── CreateOrderModal.tsx
│   │   └── OrderFilters.tsx
│   └── pages/                  # TẦNG 4B: Pure Page Components
│       ├── AdminOrdersPage.tsx
│       └── AdminOrderDetailPage.tsx
```

### Quy Tắc Từng Tầng:
1. **Tầng 1 (Types)**: Định nghĩa rõ ràng kiểu dữ liệu, params request, data response. Không dùng `any` bừa bãi.
2. **Tầng 2 (Services)**: Class service đóng gói endpoint gọi API (`instanceBE.get`, `instanceBE.post`...). Không chứa UI logic.
3. **Tầng 3 (Hooks)**: Sử dụng `@tanstack/react-query` (`useQuery`, `useMutation`).
   - Mọi thông báo toast (`toast.success`, `toast.error` từ `react-toastify`) **BẮT BUỘC** nằm tại `onSuccess` / `onError` của mutation trong hook.
   - UI page chỉ việc gọi mutate/query, không viết logic axios hay toast rải rác ngoài page.
4. **Tầng 4 (Components & Pages)**: Pure UI. Nhận props hoặc gọi custom hook.

---

## 3. SỬ DỤNG REACT HOOKS CHUẨN - TRÁNH LẠM DỤNG `useState`

- **Tránh lạm dụng `useState`**: Không khai báo hàng loạt `useState` vụn vặt gây re-render thừa thãi.
- **Sử dụng `useMemo`**: Cho các giá trị tính toán phái sinh (`queryParams`, tổng tiền hàng, danh sách lọc, cấu hình columns bảng...).
- **Sử dụng `useCallback`**: Cho các hàm event handler truyền xuống components con để tránh phá vỡ memoization.
- **Form State**: Dùng `react-hook-form` hoặc Ant Design `Form`, không dùng `useState` cho từng input đơn lẻ.

---

## 4. BÓC TÁCH COMPONENTS NHỎ GỌN (COMPONENTS MODULARITY)

- Tuân thủ nguyên tắc Single Responsibility: Mỗi file component chỉ làm một nhiệm vụ duy nhất.
  - Bảng danh sách: tách riêng thành `*Table.tsx`
  - Bộ lọc: tách riêng thành `*Filters.tsx` hoặc dùng `FilterBar`
  - Form nhập liệu: tách riêng thành `*Form.tsx`
  - Modal / Popup: tách riêng thành `*Modal.tsx`
  - Drawer chi tiết: tách riêng thành `*Drawer.tsx`
- Giữ các file Page gọn gàng, chủ yếu kết nối hook với các components đã được bóc tách.

---

## 5. KIẾN TRÚC TRANG CHI TIẾT THỰC THỂ (DETAIL PAGES)

- Mọi màn hình chi tiết (Order, Product, User, Category...) phải là **trang riêng biệt** `/admin/<resource>/:id` (hoặc `/admin/<resource>/:id/page` theo chuẩn `tev-fe-admin`).
- **Cấu trúc chuẩn**:
  - `UBreadcrumb`: Luôn có `title` (Tên/Mã thực thể) và `trailing` (Nút hành động: Quay lại, Xuất hóa đơn, Chỉnh sửa).
  - Khối thông tin tổng quan: Đặt trong Card trắng bóng nhẹ, dùng `<Row gutter={[20, 16]}>` và `<Col span={6}>` chứa `<FieldCell label="..." value={...} />`.
  - Khối danh sách liên kết: Dùng Antd `Table` bóc tách riêng.

---

## 6. GIAO DIỆN ADMIN: VIEWPORT FIT 100VH & PHÂN TRANG GỌN GÀNG

- **Viewport Fit (Khung hình 100vh)**:
  - Container chính của Admin: `h-full flex flex-col min-h-0 overflow-hidden`.
  - Hạn chế tối đa việc cuộn dọc toàn trang.
  - Các bảng dữ liệu: Cố định chiều cao cuộn nội bộ `scroll={{ y: 'calc(100vh - 280px)', x: 'max-content' }}`.
- **Phân trang Ant Design chuẩn**:
  - BẮT BUỘC dùng phân trang Antd `Pagination` (`pageSize: 8, showSizeChanger: true, pageSizeOptions: ['8', '15', '30']`).
  - Tuyệt đối không render 50-100 hàng dàn trải làm giật lag giao diện.

---

## 7. FORM CRUD & TIỀN TỆ

- Các form CRUD dài: Tích hợp vào **Modal popup** hoặc **Drawer** (như `ProductFormModal`, `CreateVoucherModal`, `CategoryDetailDrawer`), không để form inline trải dài làm vỡ bố cục.
- Trường nhập số tiền: BẮT BUỘC format phân cách hàng nghìn (VD: `300,000`, `1,000,000`) qua Ant Design `InputNumber` `formatter` và `parser`.

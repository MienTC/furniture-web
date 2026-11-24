# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Khách hàng tiêu dùng cá nhân (B2C)**: Chủ căn hộ, gia đình trẻ, người yêu thích phong cách sống hiện đại và nội thất cao cấp có nhu cầu tìm kiếm, tham khảo giải pháp bố trí không gian (phòng khách, phòng ngủ, phòng ăn, phòng làm việc) và đặt mua trực tuyến tin cậy.
- **Quản trị viên & Nhân viên bán hàng (Admin/Staff)**: Đội ngũ quản lý vận hành cửa hàng nội thất, theo dõi đơn hàng thời gian thực, quản lý biến thể kho hàng, kích hoạt mã giảm giá/Flash Sale, giám sát đối soát dòng tiền VietQR tự động và tiếp nhận Leads tư vấn từ AI.

## Product Purpose

Cung cấp giải pháp mua sắm nội thất trực tuyến hoàn chỉnh và liền mạch, xóa bỏ rào cản về tư vấn không gian sống và thanh toán thủ công thông qua sự kết hợp giữa trợ lý ảo AI tư vấn 24/7 và hệ thống gạch nợ tự động VietQR theo chuẩn NAPAS 247.

## Positioning

Nền tảng thương mại điện tử nội thất cao cấp kết hợp chuyên môn tư vấn không gian AI cá nhân hóa và tự động hóa quy trình thanh toán - đối soát:
- Trợ lý AI Gemini hỗ trợ gợi ý giải pháp không gian sống, tự động phân loại nhu cầu và thu thập số điện thoại Lead gửi tức thì về Telegram quản trị.
- Cổng đối soát tự động VietQR qua SePay Webhook xử lý gạch nợ đơn hàng dưới 1 giây.
- Giao diện Admin quản trị theo quy chuẩn Viewport fit 100vh và luồng dữ liệu 4 tầng phân lập nghiêm ngặt (Clean Architecture).

## Operating Context

- **Môi trường sử dụng**: Trình duyệt Web đa nền tảng (Desktop, Tablet, Mobile responsive).
- **Hệ thống thanh toán & thông báo**: Ứng dụng ngân hàng số quét mã VietQR, Webhook SePay, bot Telegram thông báo đơn hàng và Lead.
- **Quản trị vận hành**: Màn hình bảng điều khiển quản trị cố định khung hình (100vh viewport), không cuộn dọc toàn trang, bảng dữ liệu phân trang Ant Design chuẩn (`pageSize: 8, 15, 30`).

## Capabilities and Constraints

- **Năng lực cốt lõi**:
  - Storefront: Danh mục đa cấp, bộ lọc đa tiêu chí (không gian sống, tầm giá, chất liệu), giỏ hàng, đặt hàng, thanh toán VietQR động, tra cứu đơn hàng, danh sách yêu thích, đánh giá sản phẩm.
  - Trợ lý AI Gemini: Tư vấn thông tin bài trí 24/7, tự động trích xuất số điện thoại và đồng bộ cơ sở dữ liệu Leads.
  - Quản trị Admin: Dashboard trực quan hóa doanh thu, quản lý danh mục, sản phẩm & biến thể kho, chi tiết đơn hàng, người dùng, voucher, flash sale, cấu hình banner và cổng thanh toán.
- **Ràng buộc kiến trúc kỹ thuật (GEMINI.md)**:
  - Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, Ant Design 5, TanStack Query 5, React Router 7.
  - Kiến trúc 4 tầng phân lập: Types -> Services -> Hooks -> Components & Pages.
  - Zero Dummy/Fallback Data: Tuyệt đối không fallback inline dữ liệu giả tạo (`|| 'Khách'`, `|| 'Nội thất chung'`); bắt buộc dùng `FieldCell` (`isInvalid(value) -> '-'`) cho dữ liệu thiếu hoặc rỗng.
  - Viewport Fit 100vh: Container admin `h-full flex flex-col min-h-0 overflow-hidden`, bảng cuộn nội bộ `calc(100vh - 280px)`.
  - Tiền tệ: Bắt buộc định dạng phân cách hàng nghìn (VND) qua Ant Design `InputNumber` formatter/parser.

## Brand Commitments

- **Thương hiệu**: LuxDecor - Nội thất cao cấp & Không gian sống tinh tế.
- **Tone & Voice**: Chuyên nghiệp, đáng tin cậy, thẩm mỹ sang trọng, minh bạch về thông số kỹ thuật (chất liệu, kích thước, xuất xứ, bảo hành).

## Evidence on Hand

- Toàn văn Báo cáo Khóa luận tốt nghiệp LuxDecor (`docs/BAO_CAO_KHOA_LUAN_TOT_NGHIEP_LUXDECOR.html`, `.doc`).
- Bộ sơ đồ Use Case, BCE Sequence Diagrams, ERD 17 collections (`docs/diagrams/`, `docs/generate_er_diagram.js`).
- Bộ quy chuẩn lập trình bắt buộc trong `GEMINI.md` tham chiếu từ `tev-fe-admin` & `Pet_Manager`.
- Bộ kịch bản kiểm thử mẫu (`docs/sample_testcase.csv`).

## Product Principles

1. **Minh bạch & Chuẩn xác dữ liệu**: Mọi thông số kích thước, chất liệu và trạng thái tồn kho đều phải thực tế, không dùng placeholder hay text giả định lừa người dùng.
2. **Liền mạch & Tức thì**: Tối giản thao tác thanh toán bằng QR động tự nhận diện giao dịch, giảm tối đa thời gian chờ xác nhận thủ công.
3. **Hiệu suất & Ổn định quản trị**: Màn hình quản trị được tối ưu Viewport 100vh để nhân viên thao tác nhanh, không giật lag, quản lý tập trung trên một khung hình.

## Accessibility & Inclusion

- Tương phản màu sắc đạt chuẩn WCAG AA (tối thiểu 4.5:1 cho văn bản thông thường).
- Kích thước vùng cảm ứng trên thiết bị di động tối thiểu 44x44px.
- Nhãn mô tả rõ ràng cho các trường nhập liệu và nút bấm icon (aria-label).

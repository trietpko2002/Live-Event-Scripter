# Live Event Scripter

**Live Event Scripter** là một ứng dụng web được thiết kế để trở thành công cụ "all-in-one" cho việc quản lý, điều hành và theo dõi kịch bản sự kiện trong thời gian thực.

## 🌟 Giới Thiệu

Ứng dụng này không chỉ là một file văn bản tĩnh, mà là một hệ thống tương tác trực tiếp, giúp toàn bộ ekip (từ đạo diễn, MC, kỹ thuật viên đến hậu cần) có thể nắm bắt được tiến trình sự kiện một cách chính xác và đồng bộ.

**Lợi ích chính:**
- **Đồng bộ thời gian thực:** Mọi người trong ekip đều xem cùng một phiên bản kịch bản mới nhất.
- **Theo dõi trực quan:** Dễ dàng biết được mục nào đang diễn ra, mục nào sắp tới, và tiến độ tổng thể của chương trình.
- **Phân công rõ ràng:** Ghi chú cụ thể người phụ trách, góc máy cho từng mục.
- **Linh hoạt điều chỉnh:** Có thể thay đổi "nóng" kịch bản ngay cả khi sự kiện đang diễn ra và lưu lại.

## ✨ Tính Năng Nổi Bật

- **Quản lý đa kịch bản:** Tạo, chuyển đổi, đổi tên, xóa và sắp xếp nhiều kịch bản trên cùng một trình duyệt.
- **Chỉnh sửa trực quan:** Click và gõ để sửa đổi hầu hết nội dung. Kéo và thả để thay đổi thứ tự các mục.
- **Timeline thông minh:** Tự động tính toán lại thời gian khi có sự thay đổi.
- **Giả lập thời gian:** Chạy thử kịch bản ở một mốc thời gian bất kỳ để kiểm tra luồng chương trình.
- **Lưu trữ cục bộ:** Toàn bộ dữ liệu được lưu an toàn trên trình duyệt của bạn bằng `LocalStorage`.
- **Undo/Redo:** Hoàn tác và làm lại các thay đổi một cách dễ dàng (Ctrl+Z, Ctrl+Y).
- **Nhập/Xuất JSON:** Dễ dàng sao lưu và chia sẻ kịch bản với người khác.
- **Đăng nhập Google:** Yêu cầu đăng nhập để tăng cường bảo mật.

## 📜 Lịch Sử Cập Nhật

### Phiên bản 2.1 (ngày 04 tháng 08, 2026)
- **Chỉnh sửa ngày chạy:** Cho phép người dùng thay đổi ngày chạy sự kiện trực tiếp trên giao diện.
- **Cải tiến trang chủ:** Chuyển mục Lịch sử cập nhật và Hướng dẫn thành dạng pop-up (modal) cho gọn gàng.

### Phiên bản 2.0 (ngày 02 tháng 08, 2026)
- **Bắt buộc đăng nhập:** Yêu cầu người dùng đăng nhập bằng Google để tăng cường bảo mật.
- **Giao diện trang chủ mới:** Thiết kế lại trang chào mừng, bổ sung các thông tin cần thiết.
- **Tối ưu hóa luồng đăng nhập/đăng xuất:** Cải thiện trải nghiệm người dùng khi chuyển đổi giữa các trạng thái.

### Phiên bản 1.0
- **Lưu trữ LocalStorage:** Chuyển đổi cơ chế lưu trữ hoàn toàn sang LocalStorage, không phụ thuộc vào session.
- **Quản lý nhiều kịch bản:** Cho phép tạo, xóa, đổi tên và sắp xếp nhiều kịch bản.
- **Hoàn tác/Làm lại (Undo/Redo):** Thêm chức năng Ctrl+Z và Ctrl+Y.

## 🚀 Hướng Dẫn Sử Dụng

### 1. Giao Diện Chính
- **Header (Tiêu đề):** Chứa thông tin chung về sự kiện, đồng hồ thời gian thực, và các nút truy cập nhanh như **❤️ Donate** và **🐞 Báo lỗi**.
- **Toolbar (Thanh công cụ):** Nơi chứa hầu hết các công cụ chính:
  - **Quản lý kịch bản:** Tạo, chuyển đổi, đổi tên, xóa các kịch bản khác nhau.
  - **Tìm kiếm:** Lọc nhanh các mục trong kịch bản.
  - **Tùy chỉnh:** Thay đổi màu chủ đạo, bật/tắt chế độ tối.
  - **Giả lập giờ:** Chạy thử kịch bản ở một mốc thời gian bất kỳ.
  - **Lưu & Thêm mục:** Các nút thao tác quan trọng.
  - **Nhập/Xuất JSON:** Lưu trữ và chia sẻ kịch bản dưới dạng file.
- **Cột Trái (Active View):**
  - **Tiến trình tổng thể:** Thanh % cho cả chương trình.
  - **Đang diễn ra:** Hiển thị chi tiết mục đang chạy theo thời gian thực.
  - **Tiếp theo:** Báo trước mục kế tiếp.
- **Cột Phải (Timeline):**
  - **Thanh Timeline Tổng Quan:** Một thanh tiến trình trực quan, cho phép bạn thấy toàn cảnh chương trình và click để cuộn nhanh đến một mục bất kỳ.
  - **Danh sách mục:** Toàn bộ các mục kịch bản chi tiết.

### 2. Thao Tác Với Kịch Bản
- **Chỉnh sửa trực tiếp:** Hầu hết các nội dung như *Tiêu đề, Mô tả, Phụ trách, Ghi chú* đều có thể được chỉnh sửa bằng cách **click trực tiếp vào và gõ**.
- **Thêm mục mới:** Nhấn nút `+ Thêm mốc mới`.
- **Thay đổi thời gian:** Chỉnh sửa ô thời gian `Bắt đầu` hoặc `Kết thúc`. Thời lượng sẽ được tự động tính toán.
- **Thay đổi thứ tự:** **Kéo và thả** một mục bất kỳ đến vị trí mới. Thời gian của các mục phía sau sẽ được tự động tính toán lại.
- **Ưu tiên & Trạng thái:** Sử dụng các menu dropdown để gán độ ưu tiên (màu sắc) và trạng thái cho từng mục.
- **Góc máy:** Ghi chú chi tiết cho từng camera (Cam 1, Cam 2, Flycam) để đội quay phim dễ dàng theo dõi.
- **Lưu thay đổi:** Sau khi chỉnh sửa, hãy nhấn nút **💾 Lưu** để ghi lại các thay đổi vào bộ nhớ trình duyệt (`LocalStorage`).

### 3. Chuyển Đổi Kịch Bản Từ Word
Ứng dụng hỗ trợ nhập liệu từ file JSON. Để chuyển kịch bản từ file Word, bạn có thể:
1. Nhấn nút **Hướng dẫn** trên thanh công cụ.
2. Sao chép (copy) prompt mẫu và nội dung kịch bản Word của bạn.
3. Dán vào một công cụ AI (như ChatGPT, Gemini) để yêu cầu nó tạo ra file JSON theo đúng định dạng.
4. Nhấn nút **Nhập JSON** và chọn file vừa được tạo.

## 👤 Thông Tin Tác Giả

Phần mềm được phát triển bởi **Võ Nguyễn Nhật Triết**.
- **GitHub:** trietpko2002
- **Email:** phanranggaming@gmail.com

---

*Cảm ơn bạn đã sử dụng phần mềm này! Mọi sự ủng hộ (qua nút ❤️ Donate) và báo lỗi/yêu cầu tính năng (qua nút 🐞 Báo lỗi) đều là nguồn động lực lớn để tác giả tiếp tục phát triển sản phẩm.*
---

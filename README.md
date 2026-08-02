# Live Event Scripter: Ứng Dụng Quản Lý Kịch Bản Sự Kiện

Đây là một ứng dụng web được thiết kế để trở thành công cụ "all-in-one" cho việc quản lý, điều hành và theo dõi kịch bản sự kiện trong thời gian thực.

## 🌟 Giới Thiệu

Ứng dụng này không chỉ là một file văn bản để xem kịch bản, mà là một hệ thống tương tác trực tiếp, giúp toàn bộ ekip (từ đạo diễn, MC, kỹ thuật viên đến hậu cần) có thể nắm bắt được tiến trình sự kiện một cách chính xác và đồng bộ.

## 🤔 Tình Huống Sử Dụng

Công cụ này đặc biệt hữu ích cho:

- **Đối tượng:** Đạo diễn sân khấu, quản lý sự kiện, nhân viên kỹ thuật (âm thanh, ánh sáng, AV), MC, đội quay phim, và bất kỳ ai cần theo dõi timeline chương trình.
- **Loại sự kiện:** Hội nghị, hội thảo, talkshow, lễ trao giải, tiệc cưới, chương trình biểu diễn nghệ thuật, các buổi livestream...

**Lợi ích chính:**
- **Đồng bộ thời gian thực:** Mọi người trong ekip đều xem cùng một phiên bản kịch bản mới nhất.
- **Theo dõi trực quan:** Dễ dàng biết được mục nào đang diễn ra, mục nào sắp tới, và tiến độ tổng thể của chương trình.
- **Phân công rõ ràng:** Ghi chú cụ thể người phụ trách, góc máy cho từng mục.
- **Linh hoạt điều chỉnh:** Có thể thay đổi "nóng" kịch bản ngay cả khi sự kiện đang diễn ra và lưu lại.

## 🚀 Hướng Dẫn Sử Dụng Chi Tiết

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
  - **Thanh Timeline Tổng Quan:** Một thanh tiến trình trực quan ở trên cùng, cho phép bạn thấy toàn cảnh chương trình và click để cuộn nhanh đến một mục bất kỳ.
  - **Danh sách mục:** Toàn bộ các mục kịch bản chi tiết.

### 2. Thao Tác Với Kịch Bản

- **Chỉnh sửa trực tiếp:** Hầu hết các nội dung như *Tiêu đề, Mô tả, Phụ trách, Ghi chú* đều có thể được chỉnh sửa bằng cách **click trực tiếp vào và gõ**.
- **Thêm mục mới:** Nhấn nút `+ Thêm mốc mới`.
- **Thay đổi thời gian:** Chỉnh sửa ô thời gian `Bắt đầu` hoặc `Kết thúc`. Thời lượng sẽ được tự động tính toán.
- **Thay đổi thứ tự:** **Kéo và thả** một mục bất kỳ đến vị trí mới. Thời gian của các mục phía sau sẽ được tự động tính toán lại.
- **Ưu tiên & Trạng thái:** Sử dụng các menu dropdown để gán độ ưu tiên (màu sắc) và trạng thái cho từng mục.
- **Góc máy:** Ghi chú chi tiết cho từng camera (Cam 1, Cam 2, Flycam) để đội quay phim dễ dàng theo dõi.
- **Lưu thay đổi:** Sau khi chỉnh sửa, hãy nhấn nút **💾 Lưu** để ghi lại các thay đổi vào bộ nhớ trình duyệt.

### 3. Chuyển Đổi Kịch Bản Từ Word

Ứng dụng hỗ trợ nhập liệu từ file JSON. Để chuyển kịch bản từ file Word, bạn có thể:
1. Nhấn nút **Hướng dẫn** trên thanh công cụ.
2. Sao chép (copy) prompt mẫu và nội dung kịch bản Word của bạn.
3. Dán vào một công cụ AI (như ChatGPT, Gemini) để yêu cầu nó tạo ra file JSON theo đúng định dạng.
4. Nhấn nút **Nhập JSON** và chọn file vừa được tạo.

### 4. Các Module Mở Rộng

Ứng dụng được thiết kế để trở thành "all-in-one". Bạn có thể truy cập các module khác qua thanh điều hướng bên trái:
- **🗓️ Kịch bản:** Module chính bạn đang xem.
- **📋 Công việc:** Module quản lý danh sách các việc cần làm (To-do list) cho sự kiện.

## 👤 Thông Tin Tác Giả

Đây là phần để bạn điền thông tin của mình.

- **Tên tác giả:** [Điền tên của bạn vào đây]
- **Email liên hệ:** [Điền email của bạn vào đây]
- **GitHub/Portfolio:** [Điền link GitHub hoặc trang cá nhân của bạn]

---

*Cảm ơn bạn đã sử dụng phần mềm này! Mọi sự ủng hộ (qua nút ❤️ Donate) và báo lỗi (qua nút 🐞 Báo lỗi) đều là nguồn động lực lớn để tác giả tiếp tục phát triển sản phẩm.*

---

**Cách sử dụng file này:**

1.  Lưu lại nội dung trên vào một file có tên `README.md` trong thư mục gốc của dự án.
2.  Mở file và điền thông tin cá nhân của bạn vào phần "Thông Tin Tác Giả".
3.  Nếu bạn đưa dự án này lên GitHub, file `README.md` sẽ tự động được hiển thị làm trang giới thiệu chính cho dự án, rất chuyên nghiệp và tiện lợi.



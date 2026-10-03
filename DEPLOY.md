# Live Event Scripter Studio

Ứng dụng web tĩnh dành cho điều hành kịch bản sự kiện. Mã nguồn gồm `index.html`, `styles.css`, `app.js`; không có bước build.

## Triển khai trên Cloudflare Pages

1. Sao lưu kịch bản từ trang đang chạy bằng chức năng xuất JSON trước khi thay phiên bản.
2. Kết nối repository này với Cloudflare Pages, chọn nhánh muốn triển khai.
3. Framework preset: **None**; build command: để trống; output directory: `.`.
4. Giữ nguyên tên miền `live-event-scripter.pages.dev` để trình duyệt có thể đọc dữ liệu LocalStorage cũ.
5. Trong Firebase Authentication, bảo đảm tên miền triển khai đã nằm trong Authorized domains và Google là nhà cung cấp đăng nhập đang bật. Cấu hình Firebase công khai trong `app.js` được đọc từ bản triển khai cũ; không đặt khóa quản trị hoặc service account vào mã nguồn.

## Dữ liệu

Lần đầu mở trên cùng tên miền và trình duyệt, ứng dụng đọc các khóa `live_event_scripter_local_v3_script_list`, `..._current_script` và `..._script_<id>`, rồi ghi bản làm việc mới vào `live_event_scripter_studio_v4`. Các khóa cũ được giữ nguyên. Dữ liệu vẫn là LocalStorage của từng trình duyệt; đăng nhập Google không đồng nghĩa đồng bộ kịch bản giữa thiết bị.

Nút **Xuất JSON** tạo một bản sao lưu gồm tất cả kịch bản. Mục **Nhập & chuyển đổi** nhận nhiều tệp `.txt`, `.csv`, `.json`, `.docx` hoặc một khối văn bản có nhiều tiêu đề `Kịch bản: ...`. Trước khi tạo, ứng dụng hiển thị số kịch bản và số mốc sẽ nhập. Bộ đọc Word tải từ CDN Mammoth; cần mạng khi nhập `.docx`. Văn bản thông thường, CSV và JSON không dùng dịch vụ AI.

Tab **Prompt JSON** tạo yêu cầu chuyển đổi dùng chung cho mọi loại chương trình và nhiều phương án tình huống. Bạn tự dán nội dung vào tab đó, sao chép prompt sang công cụ AI mình chọn, rồi dán JSON trả về vào tab **Dán văn bản** để xem trước và nhập. Ứng dụng không tự gửi tài liệu đi. JSON dạng `{ "scripts": [{ "name": "...", "properties": {...}, "items": [...] }] }` và định dạng sao lưu v4 đều được chấp nhận.

## Công cụ điều hành

- Phân đoạn/chương, loại mốc, phương án dự phòng, người phụ trách và ghi chú máy quay trong bảng chi tiết mốc.
- Nút **Bắt đầu**, **Hoàn thành**, **Bỏ qua** ghi giờ thực tế. Khi bắt đầu mốc mới, mốc đang chạy trước đó được hoàn thành tự động.
- **Kiểm tra lịch chạy** báo mốc thời lượng 0, chồng giờ, khoảng trống trên 5 phút, mốc ưu tiên cao chưa phân công và mục cần xem lại.
- **Dời giờ hàng loạt** theo số phút dương hoặc âm; **Mốc theo mẫu** tạo nhanh lời dẫn, phát biểu, video, tiết mục, giải lao.
- **Lưu phiên bản** giữ tối đa 12 bản chụp trên trình duyệt cho mỗi kịch bản. Có thể khôi phục và hoàn tác ngay sau đó. Phiên bản cũng nằm trong LocalStorage nên cần xuất JSON riêng để có bản sao ngoài trình duyệt.
- **CSV** xuất bảng mốc của kịch bản đang mở; **In rundown** tạo bố cục A4 ngang.

### Văn bản mẫu

```text
Kịch bản: Chương trình chính
Phân đoạn: Khai mạc
18:30 - 18:45 | Đón khách | Lễ tân | Nhạc nền
18:45 - 19:00 | Khai mạc | MC | Bật slide mở đầu

Kịch bản: Phương án mưa
18:30 - 19:00 | Đón khách trong hội trường | Lễ tân
```

### CSV

Các cột: `kịch bản,start,end,title,staff,note`. Giờ theo `HH:MM`. Có thể lặp tên kịch bản trên nhiều dòng để gom mốc.

## Giới hạn hiện tại

- Chuyển đổi văn bản theo quy tắc giờ bắt đầu và kết thúc; các tài liệu Word không có mốc giờ rõ ràng cần chỉnh lại sau khi nhập.
- Không có đồng bộ dữ liệu trực tuyến hay phân quyền ekip. Firebase trong bản này chỉ xác thực Google.
- Chưa kiểm thử đăng nhập trên tên miền triển khai mới; cần kiểm tra thủ công sau khi Cloudflare Pages phát hành.

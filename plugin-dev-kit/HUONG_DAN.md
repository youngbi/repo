# 🛠️ VAAPP Plugin Developer Kit

Chào bạn! Ứng dụng VAAPP hoàn toàn là một trình vỏ (Shell) xử lý UI và logic Player. Nó có khả năng cắm (Plug & Play) mọi kho phim do bạn tự phát triển thông qua **Hệ Sinh Thái Plugin JS**.

Nếu bạn không có source code của VAAPP để test, đừng lo lắng! Quá trình phát triển kho phụ trợ cực kỳ dễ dàng trên máy tính của bạn thông qua trình duyệt web thông thường.

## 🌟 Quick Start (Bắt Đầu Nhanh)

Cách thức App lấy dữ liệu như sau:
1. App gọi các hàm JS `getUrl...()` trong Plugin của bạn để lấy URL cần tải trang.
2. App tự động kết nối HTTP, bóc toàn bộ mã nguồn HTML của trang Web đó, và trả lại vào hàm `parse...Response(html)`.
3. Trong hàm Parse, bạn tự code Regex hoặc dùng ngón võ JS tùy ý để tách được Title, Thumb, Danh sách tập và Link m3u8...
4. Quan trọng: Dữ liệu bạn trả ra từ hàm Parse bắt buộc phải đúng chuẩn JSON Format định sẵn thì App mới vẽ giao diện lên được.

### Làm Cách Nào Để Test Code (Debug) Ở Local?

Bạn không thể `console.log()` trực tiếp vào App trên Điện thoại hay Tivi! Vậy nên hãy làm theo 3 bước này:

1. **Chuẩn Bị:** Mở file `plugin_template.js` -> Coppy đổi tên thành `<ten_web>_plugin.js`. 
2. **Môi Trường Tester:** Bật file **`tester.html`** (nằm trong thư mục này) bằng trình duyệt Chrome.
3. **Debug:**
    - Cột 1: Bấm nút "Nạp file JS" để nhét Script kia vào mồm Tester.
    - Cột 2 (Mock Data): Truy cập trang phim của bạn bằng một Tab khác, Bấm Chuột Phải -> `View Page Source` (hoặc Ctr+U) để thấy HTML thô như máy chú thấy. Copy HTML này quăng vào Cột Thứ 2.
    - Cột 3: Bấm chạy thử các hàm `parse...()` 
    - Cột 4: Kết quả xanh lét hiện ra nếu cấu trúc JSON chuẩn. Còn nếu đỏ chót -> Code lỗi dòng nào nó báo dòng đó, mở Code Editor sửa tiếp... cho tới khi xanh.

---

## 🛠 Bộ Trọng Tâm Hàm JSON API 

Hệ thống QuickJS Parser trong App cực kỳ rạch ròi. Dưới đây là những tham số bắt buộc để API trên Mobile lẫn TV có thể hiển thị mượt. Nếu trả thiếu hoặc lỗi định dạng, phần List hiển thị `N/A`, hình ảnh đen thui hoặc văng Crash Null!

### 1. Hàm `getManifest()`
Đại diện cho thông tin Plugin. **Lưu ý ID phải là duy nhất**. Format:
```json
{
  "id": "motphim",
  "name": "Mọt Phim Pro Plus",
  "version": "1.0.1",
  "baseUrl": "https://motphimpro.com",
  "iconUrl": "link_ảnh_vuông_để_hiển_thị.jpg",
  "isEnabled": true,
  "isAdult": false,
  "type": "MOVIE",
  "layoutType": "VERTICAL"
}
```

### 2. Hàm `parseListResponse(html)`
Từ HTML mục danh sách (Home, Thể Loại, Tìm Kiếm...), ép ngược thành:
```json
{
  "items": [
    {
      "id": "slug_cua_phim_01",
      "title": "Tên Hiển Thị",
      "posterUrl": "https://...png",
      "backdropUrl": "https://...png",
      "description": "Nội dung...",
      "year": 2024,
      "quality": "FHD",
      "episode_current": "Tập 10/12",
      "lang": "Vietsub"
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 5, "totalItems": 100, "itemsPerPage": 20 }
}
```

### 3. Hàm `parseMovieDetail(html)`
Từ HTML trang xem chi tiết, trích xuất cấu trúc phim lớn:
```json
{
  "id": "slug_cua_phim_01",
  "title": "Avenger",
  "posterUrl": "...",
  "backdropUrl": "...",
  "description": "...",
  "servers": [
    {
      "name": "VIP SV1",
      "episodes": [
        { "id": "tap-1", "name": "Tập 1", "slug": "slug_de_get_link" }
      ]
    }
  ],
  "quality": "FHD",
  "lang": "Thuyết Minh",
  "year": 2024,
  "rating": 8.5,
  "casts": "Jack, J97",
  "director": "Nguyễn Văn A",
  "category": "Hành Động, Hài Hước",
  "status": "Trailer",
  "duration": "120 Phút"
}
```

### 4. Hàm `parseDetailResponse(html)` (Cuối Cùng, Lấy Link Video!)
Màn hốt hụi chót! Gửi Data từ thẻ DOM mà bạn mổ xẻ ra để Video Player phát m3u8.
```json
{
  "url": "https://cdn2.domain.com/video.m3u8",
  "headers": {
    "Referer": "https://domain.com",
    "Origin": "https://domain.com",
    "User-Agent": "Mozilla/5.0 (...)",
    "Accept": "*/*"
  },
  "subtitles": []
}
```

}
```

**⚠️ Trường Hợp KHÔNG Có Link `m3u8` Trực Tiếp (Dùng Link Embed/Iframe)**
Rất nhiều trang phim giấu m3u8 và chỉ cung cấp link Iframe của Server Player (ví dụ: doodstream, hydrax...). Lúc này, App của chúng ta ĐÃ hỗ trợ tự động Parse và Play bằng WebView. Nhiệm vụ của bạn chỉ là truyền link Embed đó vào biến `url`:
```json
{
  "url": "https://vidplayer.site/embed/avenger123",
  "headers": {
    "Referer": "https://domain.com"
  },
  "subtitles": []
}
```
*Lưu ý: Link Iframe sẽ được WebView chạy ngầm, do đó App sẽ tự bóc mẽ và chiếu nội dung bên trong lên Player chuẩn! Một ví dụ về việc cào link Iframe/Embed có trong source của `sextop1_plugin.js`.*

*Một ví dụ về bắt m3u8 thuần túy rất dễ để bám theo là file `ophim_plugin.js` trong Repo.*

> **Mẹo vặt JS Sandbox:** App sử dụng Google QuickJS Engine V8 siêu nhanh. Nên bạn đừng dùng các hàm DOM Web Browser như `document.querySelector` hoặc `window...`. Hãy thuần thục Regex `match() / exec()` và Parsing chuỗi `substr(), replace()` là trùm cuối!

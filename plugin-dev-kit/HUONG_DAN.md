# 🛠️ VAAPP Plugin Developer Kit

## App Hoạt Động Như Nào?

VAAPP là một **trình vỏ (Shell)** — nó chỉ lo UI và Player. Toàn bộ nội dung phim/truyện được cung cấp qua **Plugin JS** do bạn viết.

### Luồng Dữ Liệu Chi Tiết

```
NGƯỜI DÙNG bấm vào mục "Hành Động" trên Trang chủ
        │
        ▼
┌─ APP gọi: getUrlList("hanh-dong", '{"page":1}') ─────────────────┐
│  Plugin trả: "https://phim.com/the-loai/hanh-dong?page=1"        │
│  (có thể kèm data riêng: ".../hanh-dong?page=1|data:token")      │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─ APP tách phần |… rồi fetch HTTP GET URL SẠCH ────────────────────┐
│  • |data:…  → giữ lại cho plugin, KHÔNG gửi lên server            │
│  • |Key=Val → gắn thành HTTP header                               │
│  Nhận toàn bộ HTML/JSON thô từ server                             │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─ APP gọi: parseListResponse(html, apiUrl) ────────────────────────┐
│  apiUrl = URL GỐC (còn nguyên |data:…) do plugin sinh ra          │
│  Plugin parse HTML → trả JSON: { items: [{id, title, poster}...]} │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─ APP render danh sách phim lên UI ────────────────────────────────┐
│  Người dùng bấm vào 1 phim → Lặp lại chu trình với Detail/Play   │
└───────────────────────────────────────────────────────────────────┘
```

> 🔑 **Ghi nhớ 1 câu**: App **luôn fetch URL đã cắt bỏ phần `|`**, nhưng **luôn truyền lại URL đầy đủ (có `|`)** cho hàm `parseXxx` ở tham số thứ 2. Chi tiết ở chương [⚡ Quy Ước Dấu `|`](#-quy-ước-dấu--pipe--header-hay-data-của-plugin).

### Luồng Xem Phim & Truyền Hình IPTV (Chi Tiết → Player)

```
NẾU type = "IPTV" HOẶC "VIDEO":
   App bỏ qua màn hình Chi tiết (Detail Screen) → mở thẳng Màn hình Player
   App chạy ngầm luồng lấy link:
      1. Gọi getUrlDetail(id) để lấy URL API chi tiết kênh (lưu ý: id ban đầu là URL gốc chưa có query param)
      2. App fetch HTTP URL đó (Hỗ trợ Kodi Pipe Header: "url|User-Agent=...&Referer=...")
      3. App gọi parseDetailResponse(html, apiUrl) để lấy JSON luồng phát & DRM
      4. ExoPlayer tự động nạp User-Agent/DRM Key và phát video

NẾU type = "MOVIE" / "shortfilm":
   Bước 1: parseMovieDetail(html, apiUrl)
      → Trả servers + episodes (mỗi episode có id = URL hoặc slug, bắt buộc slug phải duy nhất cho từng tập)

   Bước 2: Người dùng chọn tập
      → App gọi getUrlDetail(episode.id) để lấy URL fetch
      → App tách phần |… → fetch URL sạch → gọi parseDetailResponse(html, apiUrl)

   Bước 3: parseDetailResponse(html, apiUrl)
      → apiUrl còn nguyên phần |data:… nếu plugin có gắn
      → Trả { url, headers, mimeType, subtitles, drmType, drmKid, drmKey, drmLicenseKey }

   Bước 4:
      ├─ Nếu isEmbed = false → ExoPlayer phát url trực tiếp
      ├─ Nếu isEmbed = true  → App fetch tiếp → gọi parseEmbedResponse()
      │                        (lặp tối đa 3 lần cho đến khi isEmbed = false)
      └─ Nếu playerType = "embed" → WebView load url
```

> 💡 **LƯU Ý QUAN TRỌNG KHI VIẾT PLUGIN (Tránh lỗi mất param & gọi sai tập):**
> 1. **Gán Param Mặc Định:** Khi phát kiểu `VIDEO` (hoặc bấm Play từ ngoài), `apiUrl` truyền vào `parseDetailResponse` là URL gốc chưa có param. Plugin nên gán giá trị mặc định trong `getUrlDetail()` hoặc `parseDetailResponse()` (ví dụ: `if (!url.includes("streamVD=")) url += "?streamVD=1";`).
> 2. **Slug Tập Phải Duy Nhất (`slug`):** Mỗi episode trong mảng `episodes` bắt buộc phải có `slug` độc nhất (ví dụ: `ep-1`, `ep-2`, `720p`, `480p`). **KHÔNG ĐẶT TRÙNG SLUG** (như tất cả tập đều là `"slug": "full"`), vì cơ chế Preload (tải ngầm tập tiếp theo) của App dùng `slug` để xác định tập hiện tại — nếu trùng slug `"full"`, App sẽ luôn xác định bạn đang ở Tập 1 và tự động preload Tập 2!

---

## 📺 Cấu Hình Đặc Thù Cho Plugin IPTV & Mã Hóa DRM (ClearKey / Widevine)

### 1. Manifest Plugin IPTV (`getManifest`)
```javascript
function getManifest() {
  return JSON.stringify({
    "id": "my_iptv_plugin",
    "name": "Kênh Truyền Hình IPTV",
    "baseUrl": "https://tv.example.com",
    "isEnabled": true,
    "debug": true,         // Bật debug=true để hiện Console Toast Log nổi trên màn hình
    "type": "IPTV",        // Khai báo kiểu IPTV
    "layoutType": "HORIZONTAL",
    "playerType": "exoplayer"
  });
}
```

### 2. Cấu Hình DRM trong `parseDetailResponse()`

#### Cách A: Trả về cặp chìa khóa ClearKey dạng Offline Hex (Khuyên dùng)
Nếu plugin đã trích xuất được cặp `KID` và `KEY` dạng Hex 32 ký tự:
```javascript
function parseDetailResponse(html, apiUrl) {
  return JSON.stringify({
    isEmbed: false,
    url: "https://cdn.example.com/live/manifest.mpd",
    mimeType: "application/dash+xml",
    drmType: "clearkey",
    drmKid: "c410ddc6a75244639fd0561fba5ef19b", // Hex KID 32 ký tự
    drmKey: "30d13ea42031b9ff8271e5dc37d90e10"   // Hex KEY 32 ký tự
  });
}
```
👉 **Cơ chế:** ExoPlayer giải mã trực tiếp nội tuyến mà không phát bất kỳ HTTP request DRM nào lúc phát!

#### Cách B: Trả về URL License Server kèm `headers` (`User-Agent`)
Nếu ExoPlayer cần tự gọi HTTP Request lên URL để xin chìa khóa và bắt buộc có `User-Agent`:
```javascript
function parseDetailResponse(html, apiUrl) {
  return JSON.stringify({
    isEmbed: false,
    url: "https://cdn.example.com/live/manifest.mpd",
    mimeType: "application/dash+xml",
    drmType: "clearkey", // Hoặc "widevine"
    drmLicenseKey: "https://tv.example.com/key.php?id=...",
    headers: {
      "User-Agent": "Dalvik/2.1.0", // Hoặc User-Agent yêu cầu của server nguồn
      "Referer": "https://tv.example.com/"
    }
  });
}
```
👉 **Cơ chế:** Đối tượng `headers` khai báo ở đây sẽ được ExoPlayer đính kèm trực tiếp vào HTTP Request khi tự động phát lệnh lấy chìa khóa DRM!

### 3. Cú pháp Kodi Pipe Header (`|`)
App hỗ trợ cú pháp Kodi Pipe Header tại mọi điểm truyền URL:
- **Truyền Custom User-Agent cho bước App fetch URL chi tiết kênh**:  
  `"id": "https://tv.example.com/channel?id=90|User-Agent=Dalvik/2.1.0&Referer=https://tv.example.com/"`
- **Truyền Custom User-Agent cho URL License Server**:  
  `"drmLicenseKey": "https://tv.example.com/key.php?id=...|User-Agent=Dalvik/2.1.0"`

App sẽ tự động loại bỏ cú pháp `|` để lấy URL sạch và trích xuất đúng các tham số Header nạp vào Request!

👉 Dấu `|` còn dùng để **mang dữ liệu riêng của plugin** (token, key, encodeData…) — xem chương [⚡ Quy Ước Dấu `|`](#-quy-ước-dấu--pipe--header-hay-data-của-plugin) ngay dưới đây.

---

## ⚡ Quy Ước Dấu `|` (Pipe) — Header Hay Data Của Plugin?

> 🆕 **CẬP NHẬT QUAN TRỌNG (bản mới nhất)** — Nếu plugin của bạn đang nhét dữ liệu riêng sau dấu `|`, hãy đọc kỹ mục này.

Mọi URL do plugin trả về (`getUrlList`, `getUrlSearch`, `getUrlDetail`, `episode.id`, `item.id`…) đều có thể mang thêm một phần phụ sau dấu `|`:

```
<url thật>|<phần thêm>
```

App **luôn cắt bỏ toàn bộ phần sau dấu `|` trước khi gửi HTTP request**. Phần `|…` không bao giờ đi lên server. Nhưng nó vẫn được **truyền nguyên vẹn trở lại cho hàm `parseXxx(html, apiUrl)`** ở tham số thứ 2.

### 3 dạng của phần sau dấu `|`

| # | Dạng | Ví dụ | App xử lý |
|---|------|-------|-----------|
| 1 | **`data:` tường minh** ⭐ Khuyến nghị | `.../slug\|data:encodeData`<br>`.../slug\|data:type=movie&ep=3` | Luôn coi là **DATA của plugin**. Không gắn header. Không bao giờ bị hiểu nhầm. |
| 2 | **Headers** (cặp `key=value`) | `.../slug\|Referer=https://x&User-Agent=Dalvik/2.1.0` | Gắn vào **HTTP request headers** |
| 3 | **Data kiểu cũ** (không có dấu `=`) | `.../slug\|encodeData`<br>`.../slug\|ABC123XYZ` | Coi là **DATA của plugin** (tương thích ngược) |

**Thứ tự ưu tiên**: App kiểm tra dạng 1 trước → dạng 2 → dạng 3.

### ⚠️ Cạm bẫy lớn nhất: data của bạn chứa dấu `=`

```javascript
// ❌ SAI — "type=movie" trông y hệt một cặp header key=value
//    → App gắn header "type: movie" và MẤT dữ liệu của bạn
"id": "https://site.com/phim/abc|type=movie&quality=1080p"

// ✅ ĐÚNG — thêm tiền tố "data:" là hết đoán mò
"id": "https://site.com/phim/abc|data:type=movie&quality=1080p"
```

### Bảng so sánh nhanh

| URL plugin trả về | App fetch URL | Header gắn thêm | `apiUrl` mà parseXxx nhận |
|-------------------|---------------|-----------------|---------------------------|
| `https://s.com/a\|data:xyz` | `https://s.com/a` | *(không)* | `https://s.com/a\|data:xyz` |
| `https://s.com/a\|data:k=v` | `https://s.com/a` | *(không)* | `https://s.com/a\|data:k=v` |
| `https://s.com/a\|Referer=https://s.com` | `https://s.com/a` | `Referer: https://s.com` | `https://s.com/a\|Referer=...` |
| `https://s.com/a\|xyz` | `https://s.com/a` | *(không)* | `https://s.com/a\|xyz` |
| `https://s.com/a?ids=1\|2\|3` | `https://s.com/a?ids=1\|2\|3` | *(không)* | URL nguyên vẹn |

### 🔓 Ngoại lệ: dấu `|` nằm trong query string

Nếu dấu `|` xuất hiện **sau dấu `?`** và **không** thuộc dạng 1 hoặc dạng 2, App coi đó là **ký tự dữ liệu hợp lệ của URL** và giữ nguyên khi fetch:

```javascript
// | là dữ liệu thật của API → App fetch nguyên URL, KHÔNG cắt
return "https://api.site.com/movies?ids=101|102|103";
```

Nhưng nếu bạn muốn phần đó là data của plugin (không gửi lên server) kể cả khi nằm sau `?`, **bắt buộc dùng tiền tố `data:`**:

```javascript
// data: thắng mọi quy tắc khác → App fetch "https://api.site.com/m?page=1"
return "https://api.site.com/m?page=1|data:secretToken";
```

### 📦 Truyền Dữ Liệu `datasend` Liền Mạch Giữa Các Màn Hình & Bỏ Qua Fetch Lại Chi Tiết

Hệ thống hỗ trợ truyền và bảo tồn thuộc tính `datasend` tự động qua từng màn hình (Home/List → Detail → Player/Reader):

#### 1. Từ Danh sách phim sang Chi tiết phim (`parseMovieDetail`)
Khi `parseListResponse()` hoặc `parseSearchResponse()` trả về item có `datasend` (hoặc `id` dạng `slug|data:...`), App tự động trích xuất chuỗi data này và truyền thẳng vào tham số thứ 3 của hàm `parseMovieDetail(html, apiUrl, datasend)` và tham số thứ 2 của `getUrlDetail(slug, datasend)`.

---

#### ⚡ Kỹ Thuật: Bỏ Qua Fetch Lại Chi Tiết Phim Khi List Đã Có Sẵn Dữ Liệu (Tải Tức Thì 0ms)

Nếu API danh sách phim của bạn đã trả về đầy đủ thông tin chi tiết (hoặc bạn đã có sẵn link video / danh sách tập), bạn có thể **bỏ qua hoàn toàn bước gọi HTTP tải HTML chi tiết**:

##### Cách 1: `getUrlDetail(slug, datasend)` trả về trực tiếp chuỗi JSON của `MovieDetail` ⭐ (Khuyên Dùng)
Khi `getUrlDetail` trả về chuỗi JSON object (bắt đầu bằng `{` và kết thúc bằng `}`), App sẽ **bỏ qua 100% việc gửi HTTP request** và nạp thẳng `MovieDetail` vào màn hình chi tiết:

```javascript
// 1. Ở parseListResponse: Đóng gói dữ liệu phim vào datasend
function parseListResponse(html, apiUrl) {
    var movies = [];
    // ... lặp qua các item ...
    movies.push({
        id: item.slug,
        title: item.title,
        posterUrl: item.poster,
        datasend: JSON.stringify({
            id: item.slug,
            title: item.title,
            posterUrl: item.poster,
            description: item.description,
            servers: [{
                name: "VIP",
                episodes: [{ name: "Full", slug: "full", id: item.streamUrl }]
            }]
        })
    });
    return JSON.stringify({ items: movies, pagination: { currentPage: 1, totalPages: 1 } });
}

// 2. Ở getUrlDetail: Trả về thẳng datasend (App sẽ bỏ qua fetch HTTP)
function getUrlDetail(slug, datasend) {
    if (datasend) {
        return datasend; // Trả về chuỗi JSON MovieDetail trực tiếp!
    }
    return "https://site.com/phim/" + slug;
}
```

##### Cách 2: `getUrlDetail(slug, datasend)` trả về chuỗi rỗng `""`
Khi `getUrlDetail` trả về `""`, App sẽ không gọi HTTP mà gọi thẳng `parseMovieDetail("", "", datasend)`:

```javascript
function getUrlDetail(slug, datasend) {
    return ""; // Trả về rỗng -> App không fetch HTTP
}

function parseMovieDetail(html, apiUrl, datasend) {
    var detail = JSON.parse(datasend || "{}");
    return JSON.stringify({
        id: detail.id,
        title: detail.title,
        posterUrl: detail.posterUrl,
        servers: detail.servers || []
    });
}
```

---

#### 2. Từ Chi tiết phim sang Phát video (`getStreamLink` / `parseDetailResponse`)
Tương tự, nếu từng tập phim trong mảng `episodes` có `datasend` (hoặc `id` dạng `ep-1|data:...`), App bảo toàn và truyền chuỗi này vào:
- `getStreamLink(episodeId, datasend)`
- `parseDetailResponse(html, apiUrl, datasend)`

Giúp dev plugin truyền nguyên vẹn các token mã hóa, key giải mã hoặc tham số riêng giữa các bước mà không lo bị rơi mất khi chuyển giao diện.

---

#### 🛡️ Cơ Chế Tự Động Làm Sạch URL của App
- Khi plugin trả về URL hoặc ID có chứa `|data:...` (hoặc `datasend`), App **luôn tự động cắt bỏ phần `|data:...` trước khi gửi HTTP request lên server**, đảm bảo URL fetch luôn là URL sạch (`https://site.com/path`).
- Server của trang web sẽ **không bao giờ nhận chuỗi `|datasend`**, tránh triệt để lỗi `400 Bad Request` hoặc `404 Not Found`.
- Chuỗi data thô được bảo toàn nguyên vẹn và truyền vào tham số `datasend` của các hàm parse.

### Cách bóc data trong hàm parse (Helper)

```javascript
// Helper nhỏ gọn — dùng chung cho mọi plugin
function getPipeData(apiUrl) {
    if (!apiUrl) return "";
    var i = apiUrl.indexOf("|");
    if (i < 0) return "";
    var s = apiUrl.substring(i + 1).replace(/^\s+/, "");
    // Bỏ tiền tố "data:" nếu có (không phân biệt hoa thường)
    if (s.toLowerCase().indexOf("data:") === 0) {
        s = s.substring(5);
    }
    return s;
}

function parseMovieDetail(html, apiUrl, datasend) {
    // Ưu tiên đọc từ datasend trực tiếp (tham số thứ 3)
    var data = datasend || getPipeData(apiUrl);
    console.log("data nhận được:", data);
    // ...
}
```

> 💡 Hàm tương ứng bên App là `extractPluginPipeData()` trong `PluginExecutor.kt` — logic giống hệt helper trên.

### ✅ Checklist khi dùng dấu `|` & `datasend`

- [ ] Dữ liệu riêng của plugin dạng chuỗi/JSON → gán vào trường `datasend` hoặc viết `|data:...`
- [ ] Muốn bỏ qua fetch HTTP chi tiết phim → `getUrlDetail(slug, datasend)` trả về chuỗi JSON `MovieDetail` trực tiếp hoặc trả về `""`
- [ ] Header HTTP thật → viết `|Key=Value&Key2=Value2` (KHÔNG có `data:`)
- [ ] Không trộn lẫn: một URL chỉ nên có **một** dấu `|` đầu tiên mang ý nghĩa; ký tự `|` sau đó thuộc về phần data
- [ ] Muốn truyền Object lớn qua URL string → `encodeURIComponent(JSON.stringify(obj))` rồi ghép: `"|data:" + encoded`

---

## 🚀 Bắt Đầu Nhanh (3 Bước)

### Bước 1: Tạo Plugin
Copy file `plugin_template.js` → đổi tên `ten_web_plugin.js`, bắt đầu viết code.

### Bước 2: Test Trên Máy Tính
Mở file **`tester.html`** bằng Chrome:
1. **Nạp JS**: Bấm "Nạp file JS" → chọn file plugin của bạn
2. **Dán HTML**: Mở trang phim → Ctrl+U (View Source) → copy dán vào ô input
3. **Chạy thử**: Bấm các nút `parseListResponse()`, `parseMovieDetail()`...
4. **Xem kết quả**: Xanh = JSON chuẩn ✅ | Đỏ = lỗi cần sửa ❌

### Bước 3: Đăng Ký
Upload file `.js` lên GitHub Raw → thêm vào `plugins.json` → App tự cập nhật.

### ⚠️ Lưu Ý Quan Trọng Khi Phát Hành Plugin (Mới)

#### 1. Bắt Buộc Sử Dụng Link RAW
Khi đăng ký plugin trên file JSON hoặc thêm nguồn tùy chỉnh, đường dẫn file JS **bắt buộc phải là đường dẫn RAW** trả về code JavaScript thô.
*   **Sai:** `https://github.com/user/repo/blob/main/plugin.js` (Trả về giao diện web HTML của GitHub).
*   **Từ phiên bản App 1.7.5+**: Hỗ trợ thêm link gist/custom domain nhưng nên dùng link RAW.

#### 2. Dung Thứ Dấu Phẩy Thừa & Cấu Trúc Bỏ Ngỏ (Trailing Comma & Loose Schema)
*   Từ phiên bản ứng dụng **1.7.5+**, bộ phân tích cú pháp JSON của App đã hỗ trợ `allowTrailingComma = true`.
*   **`FilterOption`**: Trường `value` giờ đây có giá trị mặc định. Nếu plugin khai báo `{ "slug": "/cat-1", "name": "Tên" }` thay vì `value`, App vẫn tự chuyển đổi slug thành `value` mà không crash `MissingFieldException`.

#### 3. Tối Ưu `getUrlDetail` & Tránh OOM (Out Of Memory)
*   Nếu `getUrlDetail(slug)` nhận được link stream trực tiếp (`.mp4`, `.m3u8`, `.mpd`,...):
    *   **Khuyến nghị**: Hãy `return JSON.stringify({ "url": directUrl, "isEmbed": false, "mimeType": "..." })` ngay lập tức!
    *   **Cơ chế bảo vệ từ App**: Nếu `getUrlDetail` trả về URL video trực tiếp (plain string), App sẽ tự động phát hiện và bỏ qua bước fetch HTML (tránh sập bộ nhớ OOM) đồng thời tự động nhận diện `mimeType`.

---

#### 4. Cơ Chế Phòng Lỗi Khi `parseEmbedResponse` Trả Về URL Rỗng
*   Nếu plugin dùng `isEmbed: true` nhưng hàm `parseEmbedResponse` lỡ trả về `url: ""` (rỗng):
    *   **Từ bản 1.7.8+**: App sẽ tự động phát hiện và **giữ lại URL embed trước đó**, tiếp tục mở WebView và bật Sniffer thay vì bị lỗi rỗng luồng phát.

#### 5. Không Nhét Dữ Liệu Plugin Vào URL Mà Không Có Tiền Tố `data:`
*   Xem chi tiết ở chương [⚡ Quy Ước Dấu `|`](#-quy-ước-dấu--pipe--header-hay-data-của-plugin).
*   Tóm tắt: dữ liệu riêng của plugin phải viết `url|data:<dữ liệu>`. Nếu không có tiền tố `data:` mà dữ liệu lại chứa dấu `=`, App sẽ hiểu nhầm thành HTTP header và dữ liệu của bạn bị mất.

---

## 📋 Danh Sách Tất Cả Các Hàm

### Nhóm 1: Config (Khai báo)

| Hàm | Trả về | Bắt buộc |
|-----|--------|----------|
| `getManifest()` | Thông tin plugin | ✅ |
| `getHomeSections()` | Các mục trang chủ | ✅ |
| `getPrimaryCategories()` | Menu thể loại | Tùy chọn |
| `getFilterConfig()` | Bộ lọc | Tùy chọn |

### Nhóm 2: URL (Sinh đường dẫn)

| Hàm | Tham số | Trả về | Tùy chọn / Ghi chú |
|-----|---------|--------|-------------------|
| `getUrlList(slug, filtersJson)` | slug mục + filters | URL string | ✅ Bắt buộc |
| `getUrlSearch(keyword, filtersJson)` | từ khóa | URL string | ✅ Bắt buộc |
| `getUrlDetail(slug)` | slug phim | URL string | ✅ Bắt buộc |
| `getStreamLink(movieSlug)` | slug phim | JSON string spec | Tùy chọn (Bỏ qua fetch HTML) |
| `getUrlCategories()` | — | URL string | Tùy chọn (Trang thể loại) |
| `getUrlCountries()` | — | URL string | Tùy chọn (Trang quốc gia) |
| `getUrlYears()` | — | URL string | Tùy chọn (Trang năm) |

### Nhóm 3: Parser (Xử lý dữ liệu) ⭐

> ⚠️ **Tất cả hàm parse đều nhận 2 tham số**: `(html, apiUrl)`.
> `apiUrl` là **URL gốc do plugin sinh ra, còn nguyên phần `|data:...`** (nếu có) — không phải URL sạch mà App đã fetch.
> Nếu URL không có dấu `|`, `apiUrl` là **URL cuối cùng sau khi redirect** (`response.request.url`), tiện để ghép link tương đối.

| Hàm | Nhận vào | Trả về |
|-----|----------|--------|
| `parseListResponse(html, apiUrl)` | HTML/JSON thô + URL đã gọi | `{ items: [...], pagination: {...} }` |
| `parseSearchResponse(html, apiUrl)` | HTML/JSON thô + URL đã gọi | Giống parseListResponse |
| `parseMovieDetail(html, apiUrl, datasend)` | HTML chi tiết + URL đã gọi + datasend | `{ id, title, servers: [...], ... }` |
| `parseDetailResponse(html, apiUrl, datasend)` | HTML trang xem + URL đã gọi + datasend | `{ url, headers, mimeType, ... }` |
| `parseEmbedResponse(html, url)` | HTML embed page + URL embed | `{ url, isEmbed, mimeType, ... }` |
| `parseCategoriesResponse(html, apiUrl)` | HTML thể loại | Mảng `Category` hoặc `FilterOption` |
| `parseCountriesResponse(html)` | HTML quốc gia | Mảng `FilterOption` |
| `parseYearsResponse(html)` | HTML năm | Mảng `FilterOption` |

> 💡 Các tham số `apiUrl` và `datasend` là **tùy chọn** — plugin cũ chỉ khai báo `function parseListResponse(html)` vẫn chạy bình thường. Khai báo thêm khi bạn cần đọc `datasend`, `|data:` hoặc cần biết domain thật sau redirect.

---

## 📐 Data Format Chi Tiết

### `getManifest()` — Thông tin Plugin

```json
{
    "id": "unique_id",
    "name": "Tên Hiển Thị",
    "version": "1.0.0",
    "description": "Mô tả ngắn về plugin",
    "author": "Tên tác giả",
    "baseUrl": "https://phim.example.com",
    "fallbackUrls": ["https://phim2.example.com", "https://phim3.example.com"],
    "iconUrl": "https://icon.png",
    "referrer": "https://phim.example.com/",
    "info": "Ghi chú hiện trong màn hình Quản lý Plugin",
    "isEnabled": true,
    "isAdult": false,
    "type": "MOVIE",
    "layoutType": "VERTICAL",
    "playerType": "exoplayer",
    "subtitleCat": false,
    "adblock": true,
    "debug": false
}
```

**Bảng đầy đủ các trường:**

| Trường | Kiểu | Mặc định | Ý nghĩa |
|--------|------|----------|---------|
| `id` | String | *(bắt buộc)* | ID duy nhất của plugin |
| `name` | String | *(bắt buộc)* | Tên hiển thị |
| `version` | String | *(bắt buộc)* | Phiên bản, dùng để so sánh khi cập nhật |
| `description` | String | `""` | Mô tả ngắn |
| `author` | String | `""` | Tác giả |
| `baseUrl` | String | `""` | Domain chính của web nguồn |
| `fallbackUrls` | Array\<String\> | `[]` | Danh sách domain dự phòng khi `baseUrl` bị chặn — xem mục [🌐 Domain Fallback](#-domain-fallback--tự-đổi-domain-khi-bị-chặn) |
| `iconUrl` | String | `""` | Link icon plugin |
| `referrer` | String | `""` | `Referer` riêng khi tải **ảnh poster** (CDN ảnh chặn hotlink) |
| `info` | String | `""` | Ghi chú/hướng dẫn riêng hiện trong màn Quản lý Plugin |
| `isEnabled` | Boolean | `true` | Bật/tắt plugin |
| `isAdult` | Boolean | `false` | Đánh dấu nội dung 18+ |
| `type` | Enum | `MOVIE` | `MOVIE` / `VIDEO` / `MANGA` / `NOVEL` / `IPTV` / `SHORTFILM` |
| `layoutType` | Enum | `VERTICAL` | `VERTICAL` (poster 2:3) / `HORIZONTAL` (thumb 16:9) |
| `playerType` | Enum | `auto` | `exoplayer` / `embed` / `embedtoexoplay` / `auto` |
| `subtitleCat` | Boolean | `false` | Bật tự tìm phụ đề từ subtitlecat.com |
| `adblock` | Boolean | `true` | Bật/tắt bộ chặn quảng cáo nền |
| `debug` | Boolean | `false` | Bật Console Toast nổi |
| `popup_notice` | String | `""` | Thông báo Popup tùy biến (Text, HTML, CSS, Ảnh QR...) hiện ở trang chủ plugin 1 lần/phiên |
| `popup_html` | String | `""` | Alias tương thích cho `popup_notice` |
| `popup_notice` | String | `""` | Thông báo Popup tùy biến (Text, HTML, CSS, Ảnh QR...) hiện ở trang chủ plugin 1 lần/phiên |
| `popup_html` | String | `""` | Alias tương thích cho `popup_notice` |

**`debug` — Console Toast dành cho phát triển plugin:**
- Không khai báo `debug`, hoặc đặt `"debug": false`: Console Toast **không hiển thị**.
- Đặt `"debug": true`: Bật hiển thị cửa sổ overlay **Console Toast** cho plugin đó trong App.
- App cũng tương thích với dạng string `"debug": "true"` và `"debug": "false"`, nhưng nên dùng Boolean chuẩn `true`/`false`.
- **Cách ghi log trong plugin**: App đã tắt chế độ tự động ngắt/in log mọi hàm chạy qua QuickJS. Để hiển thị log lên Console Toast (và logcat), dev plugin cần **chủ động gọi `console.log(...)`** hoặc `print(...)`, `console.error(...)`, `console.warn(...)` bên trong các hàm JS của plugin.
- Cửa sổ Console Toast tự động điều chỉnh xuống dòng sát mép trái, hỗ trợ cuộn, phóng to/thu nhỏ và nút Sao chép để copy toàn bộ log.

Ví dụ:

```javascript
function getManifest() {
    return JSON.stringify({
        id: "my_plugin",
        name: "My Plugin",
        version: "1.0.0",
        baseUrl: "https://example.com",
        playerType: "exoplayer",
        debug: true
    });
}

function parseListResponse(html, apiUrl) {
    console.log("URL đã fetch:", apiUrl);
    console.log("Parsing HTML list response length: " + html.length);
    // ...
}
```

> Biến riêng như `DEV = "true"` không bật Console Toast. Cờ phải nằm trong object do `getManifest()` trả về và có tên chính xác là `debug`.

#### 🧩 Gán Biến Trong Manifest (popup_html...)

Để tránh nhồi một khối HTML dài vào trong `getManifest()`, bạn có thể khai báo giá trị ở **bất kỳ đâu trong file JS** (đầu file, ngoài hàm, hoặc trong hàm trước `return`) rồi tham chiếu tên biến:

```javascript
// Khai báo ở đầu file — khỏi lòi ra khối HTML dài trong getManifest()
var DONATE_HTML = `<div class='donate-container'>
    <h2 class='donate-heading'>DONATE</h2>
    <p class='donate-description'>Ủng hộ bọn mình nhé!</p>
</div>`;

function getManifest() {
    return JSON.stringify({
        "id": "vlxx",
        "name": "VLXX",
        "version": "1.0.3",
        "popup_html": DONATE_HTML,
        "isEnabled": true
    });
}
```

> ⚠️ **Lưu ý:** Giá trị phải là **một string literal duy nhất** (một cặp dấu nháy). App KHÔNG hỗ trợ nối chuỗi bằng `+` hay template interpolation `${...}`.

**Quy tắc:**

- Hỗ trợ `var` / `let` / `const`.
- Hỗ trợ cả 3 loại dấu nháy: `"..."`, `'...'`, `` `...` `` (backtick dễ nhìn nhất khi HTML chứa cả `"` lẫn `'`).
- Giá trị phải là **một string literal duy nhất** — KHÔNG hỗ trợ:
  - Nối chuỗi bằng `+`
  - Template interpolation `${...}`
  - Gán chéo biến (`var A = B;` rồi dùng `A`)
- Nếu khai báo trùng tên, **khai báo sau cùng** được dùng.
- Không nên đặt tên biến trùng với key của manifest (`id`, `name`, `type`, `version`...).
- Chỉ được dùng biến ở **vị trí giá trị** (sau dấu `:`), không dùng làm key.
- `id` và `version` nên để literal (version có regex đọc riêng khi so sánh bản).

---

### 🌐 Domain Fallback — Tự Đổi Domain Khi Bị Chặn

Khai báo `fallbackUrls` trong `getManifest()` để App tự chuyển sang domain khác khi domain chính bị chặn:

```javascript
function getManifest() {
    return JSON.stringify({
        id: "my_plugin",
        name: "My Plugin",
        baseUrl: "https://phim.com",
        fallbackUrls: [
            "https://phim2.com",
            "https://phim3.net"
        ]
    });
}
```

#### App xử lý thế nào?

1. **Có cache domain còn hạn (10 phút)** → thử domain đó trước, timeout 5 giây.
2. **Không có cache / cache hỏng** → **đua song song (race)** toàn bộ `baseUrl` + `fallbackUrls`, timeout tổng 8 giây. Domain nào trả về **nội dung dùng được đầu tiên** thì thắng và được cache 10 phút.
3. **Tất cả đều fail** → App báo lỗi `"Không thể kết nối đến <tên plugin>"`.

#### ✅ Thế nào là "nội dung dùng được"?

App **không** chấp nhận mọi response khác rỗng nữa. Response bị **loại** nếu:
- Rỗng, hoặc **ngắn hơn 32 ký tự**
- 2048 ký tự đầu chứa dấu hiệu trang chặn: `just a moment`, `checking your browser`, `cf-browser-verification`, `access denied`, `403 forbidden`, `404 not found`, `ddos-guard`, `enable javascript and cookies to continue`…

> ⚠️ **Lưu ý cho dev**: Nếu API của bạn trả về JSON hợp lệ nhưng **rất ngắn** (ví dụ `[]` hay `{"ok":1}` dưới 32 ký tự), domain đó sẽ bị coi là fail trong lúc race. Hãy đảm bảo endpoint dùng để race trả về nội dung có độ dài thực tế.

#### 🔒 Đổi domain giữ nguyên path

Khi đổi domain, App **giữ nguyên toàn bộ path/query/fragment**, và tự bỏ phần path riêng của `baseUrl` cũ:

| `baseUrl` | URL plugin trả | Đổi sang | Kết quả |
|-----------|----------------|----------|---------|
| `https://a.com` | `https://a.com/phim/x?p=2` | `https://b.com` | `https://b.com/phim/x?p=2` |
| `https://a.com/wp` | `https://a.com/wp/phim/x` | `https://b.com` | `https://b.com/phim/x` |
| `https://a.com` | `https://a.com/x\|data:tok` | `https://b.com` | `https://b.com/x\|data:tok` |

Phần `|data:...` luôn được giữ nguyên sau khi đổi domain.

#### 👤 Người dùng đặt Base URL tùy chỉnh

Nếu người dùng tự nhập Base URL trong màn hình Quản lý Plugin:
- App **BỎ QUA hoàn toàn** cơ chế race domain — tôn trọng lựa chọn của người dùng.
- Mọi URL do plugin sinh ra sẽ được thay `baseUrl` → domain người dùng chọn.
- Khi người dùng đổi/xóa Base URL tùy chỉnh, cache domain **bị xóa ngay lập tức** (không phải chờ hết 10 phút).

---

**`adblock` option (Bật/Tắt chặn quảng cáo nền):**
- **Không khai báo** (hoặc `true`): Mặc định **BẬT** bộ chặn quảng cáo nền cho plugin này.
- **`false`**: **TẮT** bộ chặn quảng cáo mặc định cho plugin này.

**`type` options:**
| Giá trị | Loại nội dung & Trình phát |
|---------|----------------------------|
| `"MOVIE"` | Phim điện ảnh / Phim bộ truyền thống (Trình phát màn hình ngang) |
| `"VIDEO"` | Video clip / Youtube (Bỏ qua màn hình Chi tiết, mở trình phát xem trực tiếp tương tự IPTV) |
| `"shortfilm"` | Phim ngắn / Drama ngắn / Reels / Shortflix (Trình phát xoay đứng Portrait Zoom, hỗ trợ vuốt LÊN/XUỐNG chuyển tập kiểu TikTok trên Mobile) |
| `"MANGA"` | Truyện tranh (Trình đọc manga) |
| `"NOVEL"` | Truyện chữ |
| `"IPTV"` | Truyền hình trực tiếp (Bỏ qua màn hình Chi tiết, phát thẳng kênh) |

**`playerType` options:**
| Giá trị | Khi nào dùng |
|---------|-------------|
| `"exoplayer"` | Khi bạn trích được link `.m3u8` / `.mp4` trực tiếp (khuyến nghị) |
| `"embed"` | Khi chỉ có link iframe, bắt buộc hiển thị phát bằng WebView |
| `"embedtoexoplay"` | Tải iframe qua WebView ngầm và chạy bộ dò mạng (Sniffer) để lấy link stream phát bằng ExoPlayer |
| `"auto"` | App tự phán: URL chứa `.m3u8`/`.mp4` → ExoPlayer, còn lại → WebView |

### Link Stream Trực Tiếp, MIME Và Header Player

App nhận diện link media trực tiếp theo các dấu hiệu phổ biến: `.m3u8`, `.m3u9`, `.mpd`, `.mp4`, `.mkv`, `.vl`, `/get_file/` và `/get_video/`. Nhận diện này được dùng nhất quán khi mở phim, đổi tập và đổi server/chất lượng.

Khi plugin đã lấy được link thật, nên trả rõ URL, MIME và các HTTP header cần thiết:

```javascript
function parseDetailResponse(html, pageUrl) {
    return JSON.stringify({
        url: "https://cdn.example.com/get_file/video.mp4",
        isEmbed: false,
        mimeType: "video/mp4",
        headers: {
            Referer: pageUrl || BASEURL + "/",
            "User-Agent": "Mozilla/5.0 ..."
        },
        subtitles: []
    });
}
```

MIME thường dùng:

| Stream | `mimeType` |
|--------|------------|
| MP4 progressive | `video/mp4` |
| HLS / M3U8 | `application/x-mpegURL` |
| MPEG-DASH / MPD | `application/dash+xml` |
| MKV | `video/x-matroska` |

Lưu ý về header:
- `Referer`, `User-Agent`, cookie và header do plugin/sniffer trả về được chuyển riêng theo từng stream tới player.
- Khi đổi tập/server/chất lượng, app tạo data source riêng cho lệnh mới để header không bị lẫn với stream trước.
- Các header điều khiển nội bộ như `Custom-Js`, `Allowed-Domains`, `Block-Ads`, `Block-Redirects`, `Stream-Regex`, `Block-Scripts`, `Block-Css`, `Custom-Header` và `Bypass-Rule` chỉ dành cho WebView/sniffer; app lọc chúng trước khi gửi request media tới ExoPlayer.
- CDN chặn hotlink thường cần `Referer` đúng trang nguồn. Nếu player buffering mãi, kiểm tra URL còn hạn, `Referer`, `User-Agent`, cookie và response HTTP trước.

### Embed, WebView Và Custom-Js

- `playerType: "embed"`: hiển thị trang/iframe bằng WebView.
- `playerType: "embedtoexoplay"`: WebView/sniffer chạy trước để bắt link media, sau đó gửi URL + header đã bắt được sang ExoPlayer.
- `Custom-Js` được thực thi trong luồng WebView/sniffer và không được gửi như HTTP header media.
- Mỗi lần sniffer bắt được stream, URL và header của lần bắt đó được đóng gói riêng trước khi gửi player.
- Nếu đã có URL trực tiếp, dùng `isEmbed: false` và MIME phù hợp thay vì ép qua WebView.

---

### `parseListResponse()` — Danh sách phim & Thư mục lồng nhau

```json
{
    "items": [
        {
            "id": "slug-phim-hoac-slug-danh-muc",
            "title": "Tên Phim hoặc Tên Diễn Viên / Thể Loại",
            "posterUrl": "https://img.../poster.jpg",
            "backdropUrl": "https://img.../backdrop.jpg",
            "description": "Mô tả ngắn hoặc thời lượng",
            "year": 2024,
            "quality": "FHD",
            "episode_current": "Tập 10/12",
            "lang": "Vietsub",
            "previewUrl": "https://.../preview.mp4"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 100,
        "itemsPerPage": 20
    }
}
```

---

#### 📁 Cơ Chế Lồng Thư Mục (Nested Categories & Drill-down) cho Thể Loại & Diễn Viên

Trong App, một màn hình danh sách (`CategoryScreen`) có thể đóng vai trò là **Danh sách Phim**, **Danh sách Thể Loại**, hoặc **Danh sách Diễn Viên**. 

App điều khiển giao diện và hành vi điều hướng (mở phim hay mở tiếp thư mục con) thông qua thuộc tính **`quality`** của từng item trong mảng `items`:

| Giá trị `quality` | Giao diện hiển thị trên App | Hành vi khi người dùng Bấm (Click) |
| :--- | :--- | :--- |
| **`"CAT"`** | **Category Grid** (Thẻ chữ nhật màu sắc nổi bật) | **Mở tiếp thư mục con**: App gọi `CategoryScreen` với slug `item.id` (Drill-down) |
| **`"ACTRESS"`** | **Photo Grid** (Lưới thẻ ảnh avatar diễn viên) | **Mở danh sách phim của diễn viên**: App gọi `CategoryScreen` với slug `item.id` |
| **`"HD"`, `"FHD"`, `"CAM"`, v.v.** | **Movie Card** (Poster phim tiêu chuẩn) | **Mở màn hình chi tiết phim** (`DetailScreen` / `detail/{id}`) |
| **`"INFO"`** | **Thông báo / Hướng dẫn** (Dùng khi báo lỗi hoặc trang tìm kiếm động) | Không mở phim |

---

#### 💡 Cơ Chế Nhận Diện Trang Trong Plugin (Linh Hoạt & Không Bắt Buộc Từ Khóa Cố Định)

> ❓ **Câu hỏi thường gặp:** *"Plugin có bắt buộc link phải chứa chữ `actresses` hay `genres` không?"*
> 
> 👉 **Trả lời: KHÔNG BẮT BUỘC!** App chỉ quan tâm plugin trả về `quality: "CAT"` hay `quality: "ACTRESS"`. Tùy theo từng website, bạn có thể nhận diện loại trang bằng 1 trong 3 cách linh hoạt sau:

##### Cách 1: Nhận diện qua tham số `apiUrl` (Khuyên dùng & Đơn giản nhất)
App luôn truyền URL đang fetch vào tham số thứ 2 của `parseListResponse(html, apiUrl, datasend)`:
```javascript
function parseListResponse(html, apiUrl, datasend) {
    var movies = [];

    // Kiểm tra URL theo website của bạn (/dien-vien, /actors, /the-loai, /category, /tags,...)
    var isActressPage = apiUrl.indexOf('/dien-vien') !== -1 || apiUrl.indexOf('/actors') !== -1;
    var isGenrePage = apiUrl.indexOf('/the-loai') !== -1 || apiUrl.indexOf('/categories') !== -1;

    if (isActressPage) {
        // Parse danh sách Diễn viên
        // Gán quality: "ACTRESS"
        movies.push({
            id: "/dien-vien/ninh-duong-lan-ngoc",
            title: "Ninh Dương Lan Ngọc",
            posterUrl: "https://.../avatar.jpg",
            quality: "ACTRESS" // App sẽ mở tiếp danh sách phim khi click
        });
    } else if (isGenrePage) {
        // Parse danh sách Thể loại
        // Gán quality: "CAT"
        movies.push({
            id: "/the-loai/kinh-di",
            title: "Kinh Dị",
            quality: "CAT" // App sẽ hiện thẻ màu và mở tiếp khi click
        });
    } else {
        // Parse danh sách Phim bình thường
        movies.push({
            id: "lat-mat-7",
            title: "Lật Mặt 7",
            posterUrl: "https://.../poster.jpg",
            quality: "HD" // App sẽ mở chi tiết phim khi click
        });
    }

    return JSON.stringify({
        items: movies,
        pagination: { currentPage: 1, totalPages: 10, totalItems: movies.length, itemsPerPage: 20 }
    });
}
```

##### Cách 2: Gắn nhãn chủ động bằng `datasend` (Dấu Pipe `|`)
Bạn có thể tự gắn nhãn cho các mục menu trong `getPrimaryCategories()`:
```javascript
function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Diễn viên', slug: 'danh-sach-dien-vien|data:type=actress' },
        { name: 'Thể loại', slug: 'danh-sach-the-loai|data:type=genre' },
        { name: 'Mới cập nhật', slug: 'phim-moi|data:type=movie' }
    ]);
}

function parseListResponse(html, apiUrl, datasend) {
    var movies = [];
    if (datasend === "type=actress") {
        // Xử lý danh sách diễn viên -> quality: "ACTRESS"
    } else if (datasend === "type=genre") {
        // Xử lý danh sách thể loại -> quality: "CAT"
    } else {
        // Xử lý danh sách phim thông thường -> quality: "HD"
    }
    return JSON.stringify({ items: movies, pagination: { currentPage: 1, totalPages: 1 } });
}
```

##### Cách 3: Nhận diện theo Class / Thẻ DOM đặc trưng của Website
Nếu URL không có dấu hiệu phân biệt rõ ràng, hãy kiểm tra CSS class của website đó:
```javascript
var isActressPage = html.indexOf('class="actor-card"') !== -1 || html.indexOf('class="cast-list"') !== -1;
var isGenrePage = html.indexOf('class="genre-box"') !== -1 || html.indexOf('class="category-items"') !== -1;
```

---

### `parseMovieDetail()` — Chi tiết phim

```json
{
    "id": "slug-phim",
    "title": "Tên Phim",
    "posterUrl": "https://...",
    "backdropUrl": "https://...",
    "description": "Nội dung phim...",
    "servers": [
        {
            "name": "Server HD",
            "episodes": [
                {
                    "id": "https://phim.com/xem/tap-1",
                    "name": "Tập 1",
                    "slug": "tap-1"
                }
            ]
        }
    ],
    "quality": "FHD",
    "year": 2024,
    "rating": 8.5,
    "casts": "[Diễn viên A](/dien-vien/a), [Diễn viên B](/dien-vien/b)",
    "director": "Đạo diễn C",
    "category": "[Hành Động](/the-loai/hanh-dong), [Phiêu Lưu](/the-loai/phieu-luu)",
    "status": "Full",
    "duration": "120 Phút",
    "previewUrl": "https://.../preview.mp4"
}
```

---

#### 🔗 Định Dạng Liên Kết Markdown trong Trang Chi Tiết (`casts`, `category`, `director`, `status`)

App hỗ trợ tự động bóc tách **Markdown Links** `[Tên Hiển Thị](slug_hoặc_url)` trong các trường thông tin:
- **`casts`** (Diễn viên)
- **`category`** (Thể loại)
- **`director`** (Đạo diễn)
- **`status`** (Trạng thái / Nhãn / Studio)

##### Cách viết trong plugin:
```javascript
function parseMovieDetail(html, apiUrl, datasend) {
    // ... bóc tách dữ liệu ...
    return JSON.stringify({
        id: "snos-056",
        title: "Tên Phim",
        posterUrl: "https://.../cover.jpg",
        // Định dạng [Tên](slug_hoặc_path)
        casts: "[Yua Mikami](/vi/actresses/yua-mikami), [Eimi Fukada](/vi/actresses/eimi-fukada)",
        category: "[Không Che](/vi/genres/uncensored), [VR](/vi/genres/vr)",
        director: "[Tên Đạo Diễn](/director/abc)",
        servers: [ ... ]
    });
}
```

👉 **Lợi ích:** Trên giao diện Chi tiết phim của App, các mục này sẽ hiển thị dạng link gạch chân có màu. Khi người dùng **bấm vào tên Diễn viên hoặc Thể loại**, App sẽ tự động mở màn hình `CategoryScreen` tương ứng với slug đó!

---

**🔑 Về `episode.id`:**
- Nếu là link `.m3u8`/`.mp4` trực tiếp → App phát luôn, KHÔNG gọi `parseDetailResponse`
- Nếu là slug/URL khác → App gọi `getUrlDetail(episode.id)` → fetch → `parseDetailResponse(html, apiUrl)`
- Muốn mang thêm token/key sang bước sau → ghép `"|data:" + token` vào `id` (xem [⚡ Quy Ước Dấu `|`](#-quy-ước-dấu--pipe--header-hay-data-của-plugin))

**🔑 Về `episode.slug`:** Bắt buộc **DUY NHẤT** cho từng tập (`tap-1`, `tap-2`, `720p`…). Cơ chế Preload của App dùng `slug` để xác định tập hiện tại — nếu mọi tập đều `"slug": "full"`, App luôn tưởng bạn đang ở Tập 1 và preload nhầm Tập 2.

---

### `parseDetailResponse()` — Lấy Link Video

#### Trường hợp đơn giản (link trực tiếp):
```json
{
    "url": "https://cdn.example.com/video.m3u8",
    "headers": {
        "Referer": "https://phim.example.com"
    },
    "subtitles": [
        { "lang": "vi", "url": "https://.../sub_vi.srt" }
    ]
}
```

#### Trường hợp embed (cần WebView):
```json
{
    "url": "https://player.example.com/embed/abc123",
    "headers": { "Referer": "https://phim.example.com" }
}
```

#### Trường hợp nâng cao — Recursive Embed:
```json
{
    "url": "https://site.com/ajax.php",
    "isEmbed": true,
    "postBody": "id=12345&sv=1",
    "headers": {
        "Referer": "https://site.com",
        "X-Requested-With": "XMLHttpRequest"
    }
}
```

#### 💡 QUY TẮC XỬ LÝ ĐUÔI FILE KHÔNG CHUẨN (`.vl`, `.xyz`, `.stream`...) & MIME TYPE:
Khi trang web sử dụng link stream có đuôi mở rộng lạ (ví dụ: luồng HLS m3u8 nhưng trang web đặt đuôi file là `.vl`, `.m3u`, `.xyz`, `.stream`...), Plugin **KHÔNG CẦN YÊU CẦU SỬA APP**, chỉ cần khai báo chuẩn 1 trong 2 cách sau:

1. **Khai báo `mimeType` trực tiếp khi trả về link**:
   ```json
   {
       "url": "https://play.vlstream.net/hls/video_sample.vl",
       "isEmbed": false,
       "mimeType": "application/x-mpegURL",
       "headers": { "Referer": "https://play.vlstream.net/" }
   }
   ```
   *Các kiểu `mimeType` phổ biến:*
   - HLS m3u8 (kể cả bị đổi đuôi thành `.vl`, `.xyz`): `"application/x-mpegURL"`
   - Video MP4: `"video/mp4"`
   - DASH stream: `"application/dash+xml"`

2. **Khai báo `Stream-Regex` khi dùng WebView ngầm (`isEmbed: true`)**:
   ```json
   {
       "url": "https://embed.site.com/player/123",
       "isEmbed": true,
       "headers": {
           "Stream-Regex": "https?:\\/\\/[^\"']+\\.(?:vl|m3u8|xyz)[^\"']*"
       }
   }
   ```
   #### 🔐 Khai báo DRM (ClearKey & Widevine DRM)
Nếu luồng phát DASH (`.mpd`) yêu cầu mã hóa bản quyền DRM, plugin trả về các trường DRM tương ứng trong `parseDetailResponse`:

1. **ClearKey DRM (Cần KID + KEY)**:
```json
{
    "url": "https://example.com/manifest.mpd",
    "isEmbed": false,
    "mimeType": "application/dash+xml",
    "drmType": "clearkey",
    "drmKid": "aabbcc112233...",
    "drmKey": "445566778899..."
}
```

2. **Widevine DRM (Cần licenseUrl)**:
```json
{
    "url": "https://s7485.cdn.mytvnet.vn/pkg20/__cl/gvtsig/vstv451/manifest.mpd",
    "isEmbed": false,
    "mimeType": "application/dash+xml",
    "drmType": "widevine",
    "licenseUrl": "https://tv.vietanhtv.top/mytv2/key.php"
}
```

---

### `parseEmbedResponse()` — Phân Tích Iframe Embed

### 🎬 Chế Độ `embedtoexoplay` & EmbedSniffer (Nâng Cao)

Khi plugin khai báo `"playerType": "embedtoexoplay"` trong `getManifest()`, ứng dụng sẽ dùng **EmbedSniffer** (WebView chạy ngầm với màn hình Loading đen che bên trên) để tải trang web embed, tự động dò tìm link stream (.m3u8, .mp4, ...) và chuyển cho ExoPlayer phát native. Người dùng sẽ không nhìn thấy giao diện thô hay quảng cáo của trang web embed.

| Header Key | Mục đích | Ví dụ |
|------------|----------|-------|
| `Block-Ads` | Khóa điều khiển chặn quảng cáo Custom riêng cho link này. Nếu Manifest để `adblock: false`, bạn truyền `"Block-Ads": "true"` kết hợp với `Block-Domains`/`Block-Keywords` để CHỈ chặn các domain tùy biến do plugin chỉ định (TÁCH BẠCH, KHÔNG chặn 58+ domain mặc định của App). | `"true"` hoặc `"false"` |
| `Block-Redirects` | Bật/Tắt chặn chuyển hướng main frame khi click (`"true"` = bật chặn, `"false"` = cho phép). Mặc định `"true"` khi `Block-Ads: true`. | `"true"` hoặc `"false"` |
| `Block-Domains` | Danh sách tên miền quảng cáo bổ sung do Plugin tự định nghĩa (phân cách bằng dấu phẩy) | `"bad-domain.com, ad-server.net"` |
| `Block-Keywords` | Danh sách từ khóa URL quảng cáo bổ sung do Plugin tự định nghĩa (phân cách bằng dấu phẩy) | `"/popunder, /popup.js"` |
| `Block-Css` | Chuỗi CSS Selectors bổ sung do Plugin tự định nghĩa để ẩn các phần tử/thẻ div quảng cáo cụ thể | `".my-ad-banner, #popunder-layer, div[class*='custom-ad']"` |
| `Block-Scripts` | Danh sách từ khóa/mẫu đường dẫn script cần chặn trong WebView (phân cách bằng dấu phẩy) | `"adsterra,popads,clickadu"` |
| `Custom-Js` | Chuỗi JavaScript được inject vào WebView **ngay khi bắt đầu tải trang** (`onPageStarted` — trước khi script của web gốc chạy). Có thể chủ động trích xuất link và gọi `SnifferBridge.play(url, headers)` | `"(function() { SnifferBridge.play(url); })();"` |
| `Stream-Regex` | Chuỗi RegEx tùy chỉnh để EmbedSniffer lọc bắt link mạng thay cho mẫu mặc định (.m3u8, .mp4...) | `"https?:\\/\\/[^\"'\\s]+\\/index\\.m3u8"` |
| `User-Agent` | Đặt User-Agent cho WebView | `"Mozilla/5.0 ..."` |
| `Referer` | Đặt Referer cho WebView | `"https://site.com/"` |

#### 🛠️ Hàm Hỗ Trợ trong `Custom-Js` (`SnifferBridge`):
Trong mã `Custom-Js`, plugin có thể gọi các hàm Bridge sau:
- `SnifferBridge.play(streamUrl, headersJson)` / `playVideo(...)` / `sendToPlayer(...)`: Truyền trực tiếp link stream tìm được cho ExoPlayer.
- `SnifferBridge.toast(message)`: Hiển thị Toast thông báo nhanh (mặc định 2 giây).
- `SnifferBridge.toast(message, timerMs)`: Hiển thị Toast với thời gian tùy chỉnh (`timerMs` tính bằng miligiây, ví dụ `5000` = 5 giây).
- `SnifferBridge.log(message)`: Ghi log ra tab Console nổi của App.

> ℹ️ **LƯU Ý VỀ ANTI-AD CSS TỰ ĐỘNG:**
> Khi `Block-Ads: true`, App đã tự động áp dụng bộ quy tắc CSS tổng quát để diệt toàn bộ thẻ `div`, `iframe`, `a`, `popunder` quảng cáo:
> ```css
> iframe[src*="ad"], iframe[src*="pop"], iframe[src*="banner"],
> div[class*="ad-"], div[class*="ad_"], div[id*="ad-"], div[id*="ad_"],
> div[class*="banner"], div[id*="banner"], div[class*="popup"], div[id*="popup"],
> div[class*="popunder"], div[id*="popunder"],
> div[style*="z-index: 2147483647"]:not(.jw-controls):not(.plyr__controls),
> div[style*="z-index: 999999"]:not(.jw-controls):not(.plyr__controls),
> a[href*="bet"], a[href*="casino"], a[href*="click"],
> .popunder, .popup, .ad-box, .ad-container, .adsbygoogle
> ```
> Dev Plugin chỉ cần khai báo thêm thuộc tính `Block-Css` nếu trang web đó sử dụng class/id quảng cáo đặc thù.

---

### 🌉 Danh Sách Các Hàm Native JS Bridge (`SnifferBridge`)

Khi viết `Custom-Js` hoặc mã xử lý trong WebView, plugin có thể sử dụng các hàm Native của **`SnifferBridge`** để chủ động truyền link stream và Header cho ExoPlayer phát:

| Hàm Native | Tham số | Mô tả |
|------------|---------|-------|
| `SnifferBridge.play(url)` | `url`: String | Truyền link stream trực tiếp cho ExoPlayer phát |
| `SnifferBridge.play(url, headersJson)` | `url`: String, `headersJson`: JSON String | Truyền link stream kèm Header tùy chỉnh (ví dụ: `Referer`, `User-Agent`) |
| `SnifferBridge.playM3u8Content(m3u8Content, baseUrl)` | `m3u8Content`: String, `baseUrl`: String | ⚡ **Giải mã & Phát Blob M3U8 tại Local (127.0.0.1)**. Tự động chuẩn hóa đường dẫn tương đối và phát qua ExoPlayer không qua server trung gian |
| `SnifferBridge.playM3u8Content(m3u8Content, baseUrl, headersJson)` | Thêm `headersJson`: String | Giống `playM3u8Content()` nhưng đính kèm thêm Header cho ExoPlayer |
| `SnifferBridge.playVideo(url, headersJson)` | Bí danh | Giống `play()` |
| `SnifferBridge.playExoPlayer(url, headersJson)` | Bí danh | Giống `play()` |
| `SnifferBridge.sendToPlayer(url, headersJson)` | Bí danh | Giống `play()` |
| `SnifferBridge.toast(message)` | `message`: String | 💡 **Hiển thị thông báo Toast nổi trên màn hình App** (Rất hữu ích khi debug WebView ngầm/embed) |
| `SnifferBridge.log(message)` | `message`: String | 📝 **Ghi log debug ra Android Logcat** (Tag: `SnifferBridgeJS`) |
| `SnifferBridge.onVideoDetected(url)` | `url`: String | Hàm callback cũ (tương thích ngược) |

#### ⚡ Hướng Dẫn Bắt & Giải Mã Blob M3U8 Trực Tiếp Tại Local (Không Dùng Worker/GAS)

Đối với các trang web phim sử dụng kỹ thuật giấu link stream bằng cách đọc file M3U8 và tạo Blob URL trong bộ nhớ RAM trình duyệt (`URL.createObjectURL`), bạn không cần gửi dữ liệu thô lên Cloudflare Worker hay Google Apps Script nữa. 

Trong mã `Custom-Js`, bạn chỉ cần hook `URL.createObjectURL` và truyền nội dung M3U8 thô về cho App bằng `SnifferBridge.playM3u8Content(...)`:

```javascript
(function initBlobSniffer() {
  if (typeof URL !== 'undefined' && URL.createObjectURL) {
    var originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
      var blobUrl = originalCreateObjectURL.apply(this, arguments);
      if (blob && (blob instanceof Blob || blob instanceof File)) {
        var processContent = function(content) {
          if (content && content.trim().indexOf('#EXTM3U') === 0) {
            // Gửi trực tiếp nội dung M3U8 thô và URL trang hiện tại về App
            if (window.SnifferBridge && typeof window.SnifferBridge.playM3u8Content === 'function') {
              window.SnifferBridge.playM3u8Content(content, window.location.href);
            }
          }
        };

        if (typeof blob.text === 'function') {
          blob.text().then(processContent).catch(function(){});
        } else {
          var reader = new FileReader();
          reader.onload = function(e) { processContent(e.target.result); };
          reader.readAsText(blob);
        }
      }
      return blobUrl;
    };
  }
})();
```

👉 **Cơ chế xử lý tự động trong App Android:**
1. App sẽ tự động quét và chuyển hóa tất cả các đường dẫn phân đoạn tương đối trong M3U8 (ví dụ: `segment_01.ts`, `key.key`) thành đường dẫn tuyệt đối (`https://domain-goc.com/path/segment_01.ts`).
2. App khởi tạo một **Local HTTP Server** ngầm trên `127.0.0.1` của thiết bị và chuyển URL local cho ExoPlayer phát ngay lập tức với độ trễ ~0ms.

### 🛠️ Hướng Dẫn Debug Log, Hàm `print()` & Khung Console Nổi (Dành Cho Dev Plugin Local)

Dành riêng cho các **Plugin cài đặt trực tiếp từ file `.js` qua nút dấu (`+`)** trong màn hình Quản lý Plugin:

#### 1. Trong hàm xử lý dữ liệu của file JS (Engine QuickJS):
*(Các hàm `parseDetailResponse`, `parseListResponse`, `parseSearchResponse`...)*
Bạn có thể in bất kỳ giá trị, biến, JSON object hoặc lỗi nào trực tiếp bằng cách gọi `print(...)` hoặc `console.log(...)`:
```javascript
// In dữ liệu hoặc JSON Object
print("Dữ liệu bóc tách được:", result);
print("Link stream:", streamUrl);

// Hoặc dùng console.log chuẩn
console.log("Chiều dài HTML:", html.length);
```

#### 🛠️ Hỗ trợ `localStorage` sẵn trong QuickJS Engine:
- Bạn có thể sử dụng các hàm `localStorage.getItem(key)`, `localStorage.setItem(key, value)`, `localStorage.removeItem(key)` trực tiếp trong file JS mà không lo bị lỗi `ReferenceError: localStorage is not defined`.

#### 2. Trong mã `Custom-Js` chèn vào WebView (`embedtoexoplay`):
*(Đoạn JS chạy ngầm bên trong WebView)*
Gửi log trực tiếp từ WebView về Khung Console Nổi bằng `SnifferBridge.log(...)` hoặc `SnifferBridge.toast(...)`:
```javascript
(function() {
    try {
        var video = document.querySelector('video');
        if (video && video.src) {
            // In log ra Khung Console Nổi
            if (window.SnifferBridge) window.SnifferBridge.log("Đã bắt được link video: " + video.src);
            // Truyền link cho ExoPlayer phát
            if (window.SnifferBridge) window.SnifferBridge.play(video.src);
        } else {
            if (window.SnifferBridge) window.SnifferBridge.log("Đang chờ thẻ video xuất hiện...");
        }
    } catch (err) {
        // In lỗi nếu bị crash script trong WebView
        if (window.SnifferBridge) window.SnifferBridge.log("Lỗi CustomJS: " + err.message);
    }
})();
```

#### 3. Khung Nổi Toast Console (Có thể Sao Chép 1 Động Tác 📋):
- Khi bạn chạy bất kỳ hàm nào của plugin local cài từ nút `+`, App sẽ **tự động bật một Khung Nổi Console (Toast Console Overlay)** đè lên góc dưới màn hình.
- Khung này hiển thị thời gian, loại log (`[PRINT]`, `[LOG]`, `[ERROR]`, `[TOAST]`) và nội dung chi tiết.
- Trên thanh công cụ của Khung Nổi có **Nút Sao Chép (📋)**: Chỉ cần bấm 1 phát là **toàn bộ dữ liệu log/lỗi được chép vào Clipboard** để bạn dán sang chỗ khác kiểm tra cực kỳ nhanh chóng mà không cần mở Chrome DevTools hay máy tính!
- **Lỗi Cú Pháp & Exception Tự Động**: Nếu mã JS hoặc `Custom-Js` bị lỗi cú pháp (`SyntaxError`) hay exception, App sẽ tự động hiển thị dòng màu đỏ `[ERROR]` kèm chi tiết lỗi lên Khung Nổi ngay lập tức!

---

#### Ví dụ ĐẦY ĐỦ VỚI TOÀN BỘ DANH SÁCH TÊN MIỀN, KEYWORD & CSS SELECTORS:
```javascript
function parseDetailResponse(html, url) {
    var customJsCode = `(function() {
        if (window._vaapp_custom) return;
        window._vaapp_custom = true;
        
        var v = document.querySelector('video');
        if (v && v.src && v.src.indexOf('http') === 0) {
            var headers = JSON.stringify({
                "Referer": "https://embed18.streamc.xyz/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            });
            SnifferBridge.play(v.src, headers);
        }
    })();`;

    return JSON.stringify({
        "url": "https://embed18.streamc.xyz/embed.php?hash=c9e5230c3e65847df88fc05ea66cbbb6",
        "isEmbed": true,
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://embed18.streamc.xyz",
            
            // 🛡️ 1. BẬT BỘ CHẶN QUẢNG CÁO TỔNG THỂ
            "Block-Ads": "true",

            // 🛑 2. BẬT CHẶN CHUYỂN HƯỚNG MAIN FRAME KHI CLICK
            "Block-Redirects": "true",

            // 🌐 3. CHẶN MẠNG CẤP THẤP: TOÀN BỘ TÊN MIỀN QUẢNG CÁO / CASINO / BETTING (Nối dài bằng dấu phẩy)
            "Block-Domains": "googlesyndication.com, doubleclick.net, googleadservices.com, adnxs.com, imasdk.googleapis.com, popads.net, popcash.net, propellerads.com, exoclick.com, acscdn.com, attirecideryeah.com, trafficjunky.com, juicyads.com, bidvertiser.com, clickadu.com, pubmatic.com, rubiconproject.com, openx.net, casalemedia.com, smartadserver.com, criteo.com, taboola.com, outbrain.com, adroll.com, scorecardresearch.com, zedo.com, adstir.com, popmyads.com, adsterra.com, hilltopads.com, monetag.com, a-ads.com, clksite.com, ad-delivery.net, ad-maven.com, yandex.ru/ads, vidoomy.com, targetfirst.com, betting, casino, gamead, adtrace, adform, adservice, adsystem, adtech, adthrive, adtrqt, adzerk, amazon-adsystem, applovin, unity3d.com/ads, chartboost, inmobi, fyber, tapjoy, vungle, adcolony, mopub",

            // 🔍 4. CHẶN KEYWORD URL SCRIPT QUẢNG CÁO / VAST XML / POPUP
            "Block-Keywords": "/adserv/, /adstream/, /popunder, /popup.js, /ads.js, ad_provider, pop_under, pop_up, vast.xml, vpaid.js, ads/vpaid, bidder, tracking.js, analytics.js, banner.js, adserver, ad_script, ad_loader",

            // 🧹 5. ANTI-AD CSS: ẨN TOÀN BỘ THẺ DIV, IFRAME, POPUP, BANNER VÀ VỚI LỚP PHỦ Z-INDEX CỦA WEB NÀY
            "Block-Css": "iframe[src*='ad'], iframe[src*='pop'], iframe[src*='banner'], div[class*='ad-'], div[class*='ad_'], div[id*='ad-'], div[id*='ad_'], div[class*='banner'], div[id*='banner'], div[class*='popup'], div[id*='popup'], div[class*='popunder'], div[id*='popunder'], div[style*='z-index: 2147483647']:not(.jw-controls):not(.plyr__controls), div[style*='z-index: 999999']:not(.jw-controls):not(.plyr__controls), a[href*='bet'], a[href*='casino'], a[href*='click'], .popunder, .popup, .ad-box, .ad-container, .adsbygoogle",

            // 🚫 6. CHẶN SCRIPT RIÊNG DO DEV CHỈ ĐỊNH
            "Block-Scripts": "popads,exoclick,adsterra,clickadu",

            "Custom-Js": customJsCode
        }
    });
}
```

> ⚠️ **LƯU Ý QUAN TRỌNG VỀ `Custom-Js`:**
> 1. `Custom-Js` được tự động chèn **sớm ở `onPageStarted`** (trước khi các đoạn script HTML của trang web gốc được thực thi). Nếu script của bạn muốn đợi DOM tải xong, hãy dùng `document.addEventListener("DOMContentLoaded", ...)` hoặc `if (document.readyState === "loading")`.
> 2. `Custom-Js` trong `headers` phải là một **chuỗi dạng String** chứa mã JS. KHÔNG viết IIFE trực tiếp bên ngoài hàm `parseDetailResponse` vì engine QuickJS trên Android app sẽ bị crash do không có đối tượng `window`.
> 3. `SnifferBridge.play(url, headersJson)` là hàm Bridge native của App. Ngay khi được gọi, WebView ngầm sẽ lập tức đóng lại và ExoPlayer sẽ nhận link stream để phát.

#### Ví dụ 2: Lọc link theo `Stream-Regex` tùy chỉnh & Bật AdBlock
```javascript
function parseDetailResponse(html, url) {
    return JSON.stringify({
        "url": "https://gamomephim.com/embed/123",
        "isEmbed": true,
        "headers": {
            "Block-Ads": "true",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://gamomephim.com/",
            "Stream-Regex": "https?:\\/\\/[^\"'\\s]+\\/hls\\/[^\"'\\s]+\\.m3u8"
        }
    });
}
```

---

### `parseEmbedResponse(html, url)` — Xử lý embed nhiều bước

Hàm này **chỉ cần viết** khi trang của bạn dùng luồng phức tạp (AJAX → iframe → stream). App gọi hàm này trong vòng lặp.

```javascript
function parseEmbedResponse(html, sourceUrl) {
    // Bước trung gian: HTML chứa iframe → trích URL iframe
    var iframeMatch = html.match(/src="(https?:\/\/[^"]+)"/);
    if (iframeMatch) {
        return JSON.stringify({
            url: iframeMatch[1],
            isEmbed: true,    // ← true = App sẽ fetch tiếp URL này
            headers: { "Referer": "https://site.com/" }
        });
    }
    
    // Bước cuối: trích direct stream
    var fileMatch = html.match(/"file"\s*:\s*"(https?[^"]+)"/);
    if (fileMatch) {
        return JSON.stringify({
            url: fileMatch[1],
            isEmbed: false,   // ← false = URL cuối cùng, phát luôn
            mimeType: "application/x-mpegURL",
            headers: { "Referer": "https://embed-server.com/" }
        });
    }
    
    // Không tìm thấy → dừng loop
    return JSON.stringify({ url: "", isEmbed: false });
}
```

**Quy tắc:**
- `isEmbed: true` → App fetch URL đó rồi gọi lại `parseEmbedResponse()` (tối đa 3 lần)
- `isEmbed: false` → URL cuối cùng, App phát bằng ExoPlayer
- `url: ""` → Dừng lặp, App báo lỗi

---

### Trường `mimeType` — Khi file extension không chuẩn

ExoPlayer nhận dạng stream qua extension (`.m3u8` → HLS, `.mp4` → Progressive). Nhưng nếu server dùng extension lạ (`.vl`, `.xyz`, `.dat`...), plugin cần chỉ định `mimeType`:

```json
{
    "url": "https://cdn.example.com/03105.vl",
    "mimeType": "application/x-mpegURL"
}
```

| `mimeType` | Loại stream |
|------------|------------|
| `"application/x-mpegURL"` | HLS (m3u8 content) |
| `"video/mp4"` | MP4 |
| `""` hoặc không khai | App tự nhận dạng |

> **Lợi ích**: Nếu sau này server đổi extension từ `.vl` → `.xyz`, bạn chỉ sửa plugin JS, KHÔNG cần build lại App. Tất cả do plugin quyết định.

---

### 📝 Hướng Dẫn Cấu Hình Phụ Đề (Subtitles)

Plugin có thể cung cấp danh sách phụ đề cho ExoPlayer thông qua trường `subtitles` trong `parseDetailResponse()`.

#### Cấu trúc trả về trong `parseDetailResponse()`:
```javascript
return JSON.stringify({
    "url": "https://cdn.example.com/video.m3u8",
    "headers": { "Referer": "https://example.com" },
    "subtitles": [
        {
            "lang": "Tiếng Việt (Vietsub)", // Tên hiển thị trên menu phụ đề của App
            "url": "https://cdn.example.com/sub/vietnamese.vtt" // Link WebVTT (.vtt), SubRip (.srt), hoặc ASS (.ass)
        },
        {
            "lang": "English",
            "url": "https://cdn.example.com/sub/english.vtt"
        }
    ]
});
```

#### Quy tắc xử lý phụ đề trong App:
1. **Định dạng hỗ trợ**: App hỗ trợ các file phụ đề chuẩn WebVTT (`.vtt`), SRT (`.srt`), ASS/SSA (`.ass`). App tự động bóc tách loại bỏ query string `?token=...` để nhận diện đúng định dạng.
2. **Tên hiển thị (`lang`)**: App sẽ lấy trực tiếp chuỗi trong `lang` để làm nhãn trên giao diện menu phụ đề. Nên đặt tên ngắn gọn, rõ ràng (ví dụ: `"Tiếng Việt (Bản chuẩn)"`, `"English"`).
3. **Cơ chế tương tác với SubtitleCat**:
   - Nếu plugin đã khai báo phụ đề Tiếng Việt (chuỗi `lang` chứa chữ `"Việt"` hoặc `"Vietnamese"`), App sẽ **tự động bỏ qua SubtitleCat** và ưu tiên phát phụ đề từ plugin của bạn.
   - Để tắt hoàn toàn tính năng tự động tìm phụ đề ngoài SubtitleCat cho plugin, bạn chỉ cần đặt `"subtitleCat": false` trong `getManifest()`.

---

### 📺 Hướng Dẫn Viết Plugin Truyền Hình / IPTV (`"type": "IPTV"`)

Khi bạn viết plugin cho các nguồn kênh truyền hình trực tiếp (Live TV / IPTV), khai báo `"type": "IPTV"` giúp tối ưu hóa luồng xem cho người dùng.

#### Đặc điểm của Plugin IPTV trong App:
- Khi người dùng bấm chọn kênh từ danh sách, App sẽ **bỏ qua giao diện chi tiết (Detail Screen)** và giải mã link stream để **phát trực tiếp ngay lập tức** bằng ExoPlayer.
- Hỗ trợ đầy đủ các nguồn trực tiếp: HLS (`.m3u8`), DASH (`.mpd`), MP4, và mã hóa bản quyền **ClearKey DRM**.

#### 1. Khai báo Manifest:
```javascript
function getManifest() {
    return JSON.stringify({
        "id": "onsports_tv",
        "name": "Kênh Truyền Hình Thể Thao",
        "version": "1.0.0",
        "baseUrl": "https://onsports.vn",
        "type": "IPTV",             // ⭐ Đánh dấu plugin loại IPTV
        "playerType": "exoplayer"   // Khuyến nghị dùng exoplayer
    });
}
```

#### 2. Trả về luồng phát Kênh trực tiếp trong `parseDetailResponse()`:

- **Dạng HLS (.m3u8) / MP4 thông thường**:
```javascript
function parseDetailResponse(html, url) {
    return JSON.stringify({
        "url": "https://live.example.com/vtvcab1/index.m3u8",
        "mimeType": "application/x-mpegURL",
        "headers": {
            "User-Agent": "Mozilla/5.0 ...",
            "Referer": "https://example.com/"
        }
    });
}
```

- **Dạng DASH (.mpd) kèm ClearKey DRM**:
```javascript
function parseDetailResponse(html, url) {
    return JSON.stringify({
        "url": "https://live.example.com/channel/manifest.mpd",
        "mimeType": "application/dash+xml",
        "drmType": "clearkey",
        "drmKid": "c410ddc6a75244639fd0561fba5ef19b",
        "drmKey": "30d13ea42031b9ff8271e5dc37d90e10",
        "headers": {
            "User-Agent": "Mozilla/5.0 ...",
            "Referer": "https://example.com/"
        }
    });
}
```

---

### 📱 Hướng Dẫn Viết Plugin Phim Ngắn / Short Drama (`"type": "shortfilm"`)

Khi viết plugin cho các nguồn phim ngắn (Short Drama / Reels / Shortflix), khai báo `"type": "shortfilm"` để kích hoạt trải nghiệm trình phát xoay dọc và cử chỉ vuốt chuyển tập.

#### Đặc điểm của Plugin `"shortfilm"` trong App:
- Trình phát ExoPlayer tự động **xoay đứng màn hình (Portrait Mode)** và phóng to vừa khít chiều dọc điện thoại (`resizeMode = ZOOM`).
- Hỗ trợ **cử chỉ vuốt dạng TikTok / Short Reels** trên Mobile:
  - **Vuốt LÊN (Swipe UP)**: Chuyển sang **Tập tiếp theo**.
  - **Vuốt XUỐNG (Swipe DOWN)**: Lùi về **Tập trước đó**.
- Tự động bảo toàn trạng thái xoay đứng và vuốt tay chuyển tập liên tục xuyên suốt từ Tập 1 tới toàn bộ các tập tiếp theo.

#### 1. Khai báo Manifest:
```javascript
function getManifest() {
    return JSON.stringify({
        "id": "shortflix",
        "name": "Phim Ngắn Shortflix",
        "description": "Kênh phim ngắn vietsub lồng tiếng",
        "version": "1.0.0",
        "baseUrl": "https://shortflix.net",
        "type": "shortfilm",        // ⭐ Đánh dấu plugin loại Phim Ngắn
        "playerType": "exoplayer"  // Khuyến nghị dùng exoplayer
    });
}
```

---

### 💾 Kỹ Thuật Truyền Dữ Liệu / Cache Biến Giữa Các Bước (State Management)

Do engine QuickJS trong App chạy độc lập từng phiên (stateless), các biến toàn cục (global variables) sẽ bị xóa RAM sau khi chuyển màn hình hoặc reload engine.

#### **Giải pháp chuẩn:** Đính kèm dữ liệu/token/key vào thuộc tính `id` hoặc `slug`

Muốn mang dữ liệu gì từ `parseListResponse()` sang `parseMovieDetail()` hay `parseDetailResponse()`, bạn nhúng thông tin đó vào `id` / `slug` của item, dùng cú pháp `|data:`.

> ⚠️ **Luôn dùng tiền tố `data:`** — xem chương [⚡ Quy Ước Dấu `|`](#-quy-ước-dấu--pipe--header-hay-data-của-plugin). Không có tiền tố mà dữ liệu chứa dấu `=` thì App sẽ hiểu nhầm thành HTTP header và bạn mất dữ liệu.

##### Ví dụ 1: Nối chuỗi bằng `|data:` (Đơn giản, khuyến nghị)
```javascript
// Helper dùng chung: bóc phần data sau dấu |
function getPipeData(raw) {
    if (!raw) return "";
    var i = raw.indexOf("|");
    if (i < 0) return "";
    var s = raw.substring(i + 1).replace(/^\s+/, "");
    if (s.toLowerCase().indexOf("data:") === 0) s = s.substring(5);
    return s;
}

// 1. Ở parseListResponse: Nối key vào id phim
function parseListResponse(html, apiUrl) {
    var secretKey = "ABC123XYZ";
    return JSON.stringify({
        "items": [
            {
                "id": "phim-hanh-dong-1|data:" + secretKey, // ⭐ có tiền tố data:
                "title": "Phim Hay 1"
            }
        ]
    });
}

// 2. Ở parseMovieDetail: Tách key ra dùng & truyền tiếp vào episode.id
function parseMovieDetail(html, apiUrl) {
    var myKey = getPipeData(apiUrl);        // => "ABC123XYZ"
    var realSlug = apiUrl.split("|")[0];

    return JSON.stringify({
        "id": realSlug,
        "title": "Phim Hay 1",
        "servers": [{
            "name": "Server 1",
            "episodes": [{
                "name": "Tập 1",
                "slug": "tap-1",                       // slug phải DUY NHẤT cho từng tập
                "id": "tap-1|data:" + myKey            // Truyền tiếp key vào id tập phim
            }]
        }]
    });
}

// 3. Ở parseDetailResponse: Lấy lại key dùng để bóc link stream
function parseDetailResponse(html, episodeUrl) {
    var myKey = getPipeData(episodeUrl);    // => "ABC123XYZ"
    return JSON.stringify({
        "url": "https://server.com/stream?key=" + myKey,
        "isEmbed": false
    });
}
```

> 🔍 **App đã fetch URL nào?** Với `id = "https://site.com/tap-1|data:ABC123XYZ"`, App gửi request tới đúng `https://site.com/tap-1`. Phần `|data:ABC123XYZ` **không** đi lên server nhưng vẫn có trong `episodeUrl`.

##### Ví dụ 2: Mã hóa / Nén Dữ liệu LỚN hoặc Phức Tạp (Tránh vỡ cú pháp ID / URL)

> [!WARNING]
> **Lưu ý quan trọng về môi trường QuickJS:**
> Môi trường QuickJS của ứng dụng **KHÔNG có sẵn** 2 hàm `btoa()` và `atob()` của trình duyệt Web.
> Nếu dùng `atob()` trong khối `try { ... } catch(e) {}`, lỗi `ReferenceError: atob is not defined` sẽ bị nuốt im lặng, khiến dữ liệu giải mã bị rỗng `{}` mà không hiện lỗi ra console.

Khi cần truyền Object chứa nhiều dữ liệu (Cookie, Token JWT, bối cảnh Session...), cách chuẩn nhất và tương thích 100% với QuickJS là sử dụng cặp hàm JS chuẩn: `encodeURIComponent()` và `decodeURIComponent()`.

###### 🚀 Cách 1: Dùng `encodeURIComponent` & `decodeURIComponent` (Khuyên dùng - Có sẵn trong QuickJS)

```javascript
// 1. Ở parseListResponse: Mã hóa Object thành chuỗi URL safe đính vào ID
function parseListResponse(html, apiUrl) {
    var bigData = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        session: "sess_9988776655",
        quality: "1080p"
    };

    // Mã hóa JSON string thành chuỗi an toàn 1 dòng (không bị vỡ dấu |, ký tự đặc biệt, xuống dòng)
    var encodedData = encodeURIComponent(JSON.stringify(bigData));

    return JSON.stringify({
        "items": [
            {
                "id": "phim-demo|data:" + encodedData,   // ⭐ tiền tố data:
                "title": "Phim Demo"
            }
        ]
    });
}

// 2. Ở parseDetailResponse: Giải mã ngược lại thành Object
function parseDetailResponse(html, episodeUrl) {
    var data = {};
    var raw = getPipeData(episodeUrl);   // helper ở Ví dụ 1, đã tự bỏ tiền tố "data:"
    if (raw) {
        try {
            data = JSON.parse(decodeURIComponent(raw)); // Giải mã URL-encode lại thành Object
        } catch(e) {
            console.error("Lỗi parse data:", e);
        }
    }

    console.log(data.token);   // "eyJhbGciOi..."
    console.log(data.session); // "sess_9988776655"

    return JSON.stringify({
        "url": "https://server.com/stream?token=" + (data.token || ""),
        "isEmbed": false
    });
}
```

###### 💡 Cách 2: Nếu bắt buộc cần Base64 (Viết hàm Base64 thuần JS)

Nếu logic của bạn bắt buộc phải tạo/đọc chuỗi mã hóa chuẩn Base64, hãy nhúng 2 hàm helper thuần JS dưới đây vào plugin (thay thế hoàn toàn cho `btoa`/`atob`):

```javascript
// Helper Base64 thuần JS (Tương thích 100% với QuickJS)
function base64Encode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';
    var utf8Str = unescape(encodeURIComponent(str));
    for (var block, charCode, idx = 0, map = chars;
        utf8Str.charAt(idx | 0) || (map = '=', idx % 1);
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = utf8Str.charCodeAt(idx += 3/4);
        if (charCode > 255) {
            throw new Error("'base64Encode' failed: string contains out of range characters");
        }
        block = block << 8 | charCode;
    }
    return output;
}

function base64Decode(input) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var str = String(input).replace(/=+$/, '');
    var output = '';
    if (str.length % 4 === 1) {
        throw new Error("'base64Decode' failed: invalid length");
    }
    for (var bc = 0, bs, buffer, idx = 0;
        buffer = str.charAt(idx++);
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        buffer = chars.indexOf(buffer);
    }
    return decodeURIComponent(escape(output));
}

// Cách dùng trong Plugin:
// var encoded = base64Encode(JSON.stringify(bigData));
// var data = JSON.parse(base64Decode(encoded));
```

---

## 🧪 Mẹo Debug

### Trong tester.html:
- Hàm `parseListResponse` / `parseMovieDetail` cần dán **HTML source** của trang web tương ứng
- Hàm `getManifest` / `getHomeSections` chạy **không cần tham số**
- Hàm `getUrlList` / `getUrlDetail` cần nhập **slug** vào ô input

### Mẹo viết Regex:
```javascript
// Lấy tất cả <a> có class "movie-item"
var regex = /<a[^>]*class="movie-item"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<h3[^>]*>([^<]+)/g;
var match;
var items = [];
while ((match = regex.exec(html)) !== null) {
    items.push({
        id: match[1].replace('/phim/', ''),
        posterUrl: match[2],
        title: match[3].trim()
    });
}
```

### QuickJS sandbox — Những thứ KHÔNG dùng được:
❌ `document.querySelector()`,  `window.location`, `DOM API`
❌ `fetch()`, `XMLHttpRequest`, `async/await`
❌ `require()`, `import`

### Những thứ DÙNG ĐƯỢC:
✅ `JSON.parse()`, `JSON.stringify()`
✅ `String.match()`, `String.replace()`, `String.split()`, `String.indexOf()`
✅ `RegExp`, `/pattern/g.exec()`
✅ `Array.map()`, `Array.filter()`, `Array.forEach()`
✅ `try {} catch(e) {}`
✅ `encodeURIComponent()`, `decodeURIComponent()`
✅ `localStorage.getItem/setItem/removeItem`

---

## 🚑 Lỗi Thường Gặp & Cách Sửa

### 1. `apiUrl` đúng nhưng `html` rỗng hoặc là `[]` / `{}`

**Triệu chứng:**
```
[LOG] apiUrl: https://streamed.pk/api/stream/admin/abc|encodeData
[LOG] html:   []
```
Nhưng mở `https://streamed.pk/api/stream/admin/abc` trên trình duyệt thì có dữ liệu.

**Nguyên nhân:** phần sau `|` bị gửi lẫn lên server (bị mã hóa thành `%7C`), server trả về route không tồn tại.

**Cách sửa:** thêm tiền tố `data:` → `.../abc|data:encodeData`. App sẽ fetch đúng `.../abc` và vẫn truyền `apiUrl` đầy đủ cho hàm parse.

### 2. Dữ liệu sau `|` bị mất, App lại gắn thêm header lạ

**Nguyên nhân:** data của bạn có dạng `key=value` (VD `|type=movie`) nên bị hiểu là HTTP header.

**Cách sửa:** `|data:type=movie`.

### 3. Đổi domain fallback xong bị 404

**Nguyên nhân:** `baseUrl` có path (`https://a.com/wp`) còn domain fallback thì không.

**Cách sửa:** App đã tự xử lý — chỉ cần khai `fallbackUrls` là các origin (`https://b.com`), App tự ghép lại path. Nếu vẫn sai, kiểm tra `baseUrl` có đúng phần path chung không.

### 4. Domain tốt không bao giờ được dùng, App cứ bám domain hỏng

**Nguyên nhân:** domain hỏng trả về trang Cloudflare/`Access denied` mà vẫn được coi là thắng cuộc đua rồi bị cache 10 phút.

**Cách sửa:** App đã lọc các trang chặn phổ biến và response ngắn hơn 32 ký tự. Nếu API của bạn trả JSON ngắn (`[]`, `{"ok":1}`), hãy dùng endpoint có nội dung dài hơn để race. Người dùng có thể vào Quản lý Plugin đặt Base URL tùy chỉnh — lúc đó App bỏ qua race hoàn toàn.

### 5. App vẫn dùng domain cũ sau khi đổi Base URL tùy chỉnh

Đã được sửa: đổi/xóa Base URL tùy chỉnh sẽ **xóa cache domain ngay lập tức**, không phải chờ hết 10 phút.

### 6. Preload chạy nhầm tập

**Nguyên nhân:** mọi episode dùng chung một `slug` (VD `"full"`).

**Cách sửa:** đặt `slug` duy nhất cho từng tập (`tap-1`, `tap-2`, `1080p`, `720p`…).

---

## 📁 Ví Dụ Thực Tế

| Plugin | Độ khó | Kỹ thuật |
|--------|--------|----------|
| `ophim_plugin.js` | ⭐ Dễ | API trả JSON → `JSON.parse()` |
| `kkphim_plugin.js` | ⭐⭐ Trung bình | API + HTML parse |
| `vlxx_plugin.js` | ⭐⭐⭐ Nâng cao | AJAX POST + recursive embed + mimeType |

🌐 Chúc bạn thành công! Đóng góp plugin cho cộng đồng nha!

// =============================================================================
// VAAPP Plugin Template
// Hướng dẫn chi tiết: xem HUONG_DAN.md
// =============================================================================

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "my_new_plugin",          // ID duy nhất, không dấu, không khoảng trắng
        "name": "Nguồn Phim Của Tôi",   // Tên hiển thị trong App
        "version": "1.0.0",             // Đổi version → App tự cập nhật
        "baseUrl": "https://domain-phim-cua-ban.com",
        "iconUrl": "https://url-icon-vuong.png",
        "imageReferer": "https://domain-phim-cua-ban.com/", // Header Referer tải ảnh bìa & ảnh truyện chống 403
        "isEnabled": true,
        "isAdult": false,
        "type": "MOVIE",                // "MOVIE" | "COMIC" | "MANGA" | "IPTV" | "SHORTFILM"
        "layoutType": "VERTICAL",       // "VERTICAL" hoặc "HORIZONTAL"
        "playerType": "exoplayer"       // "exoplayer" | "embed" | "embedtoexoplay" | "auto"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'phim-le', title: 'Phim Lẻ Mới', type: 'Horizontal', path: '' },
        { slug: 'phim-bo', title: 'Phim Bộ Mới', type: 'Horizontal', path: '' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Hành Động', slug: 'hanh-dong' },
        { name: 'Kinh Dị', slug: 'kinh-di' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({ sort: [], category: [] });
}

// =============================================================================
// NHÓM 2: SINH URL (App gọi hàm → nhận URL → tự fetch HTTP)
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    return "https://domain-phim-cua-ban.com/" + slug + "?page=" + page;
}

function getUrlSearch(keyword, filtersJson) {
    var page = JSON.parse(filtersJson || "{}").page || 1;
    return "https://domain-phim-cua-ban.com/tim-kiem?q=" + encodeURIComponent(keyword) + "&page=" + page;
}

function getUrlDetail(slug) {
    return "https://domain-phim-cua-ban.com/phim/" + slug;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// NHÓM 3: PARSER (App fetch URL xong → ném HTML/JSON thô vào đây → bạn parse)
// =============================================================================

/**
 * Parse danh sách phim từ HTML trang danh sách.
 * App mong đợi: { items: [{id, title, posterUrl, ...}], pagination: {...} }
 * @param {string} html - HTML/JSON thô của trang web
 * @param {string} url - URL thực tế đã fetch để lấy html này
 */
function parseListResponse(html, url) {
    try {
        // Cách 1: Dùng MiniJQ (_$) có sẵn trong App (Cực kỳ tiện lợi & khuyên dùng):
        var $doc = _$(html);
        var items = [];
        $doc.find(".film-item").each(function() {
            items.push({
                id: this.find("a").attr("href"),
                title: this.find(".title").text().trim(),
                posterUrl: this.find("img").attr("data-src") || this.find("img").attr("src")
                // quality: "HD",
                // isCategory: true, // ⭐ Thư mục / Tuyển tập / Thể loại (Bấm vào sẽ mở danh sách con thay vì mở Detail)
                // isFolder: true,   // Tương đương isCategory: true (Có posterUrl -> hiện thẻ ảnh, Không posterUrl -> hiện ô chữ màu)
                // type: "actress"   // Nếu là Diễn viên (App sẽ hiện avatar và bấm vào mở danh sách phim)
            });
        });
        
        // Cách 2: Nếu dùng Regex truyền thống:
        // var regex = /<a[^>]*href="\/phim\/([^"]+)"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<h3>([^<]+)/g;
        // var match;
        // while ((match = regex.exec(html)) !== null) {
        //     items.push({ id: match[1], title: match[3].trim(), posterUrl: match[2] });
        // }
        
        return JSON.stringify({
            items: items,
            pagination: { currentPage: 1, totalPages: 1 }
        });
    } catch (e) {
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
    }
}

function parseSearchResponse(html, url) {
    return parseListResponse(html, url);
}

/**
 * Parse chi tiết phim: title, description, servers + episodes.
 * ⚠️ episode.id là giá trị App dùng để resolve link xem:
 *    - Nếu là URL .m3u8/.mp4 → App phát luôn
 *    - Nếu là slug/URL → App gọi getUrlDetail(id) → parseDetailResponse()
 * @param {string} html - HTML/JSON thô của trang chi tiết
 * @param {string} url - URL thực tế đã fetch để lấy html này
 */
function parseMovieDetail(html, url) {
    return JSON.stringify({
        id: "slug-phim",
        title: "Tên phim",
        posterUrl: "",
        backdropUrl: "",
        description: "Mô tả...",
        servers: [
            {
                name: "Server HD",
                episodes: [
                    { id: "tap-1-url-hoac-slug", name: "Tập 1", slug: "tap-1" },
                    { id: "tap-2-url-hoac-slug", name: "Tập 2", slug: "tap-2" }
                ]
            }
        ],
        quality: "HD",
        year: 2024,
        rating: 8.0,
        status: "Full",
        duration: "120 Phút",
        casts: "Diễn viên A, B",
        director: "Đạo diễn C",
        category: "Hành Động"
    });
}

/**
 * Parse link video cuối cùng để Player phát.
 * 
 * Trường hợp 1 — Link trực tiếp:
 *   { url: "https://cdn.com/video.m3u8", headers: {...} }
 * 
 * Trường hợp 2 — Embed (WebView):
 *   { url: "https://player.com/embed/abc", headers: {...} }
 *   (Manifest cần set playerType: "embed" hoặc "auto")
 * 
 * Trường hợp 3 — Recursive embed (cần fetch thêm):
 *   { url: "https://site.com/ajax.php", isEmbed: true, postBody: "id=123&sv=1" }
 *   → App sẽ POST/GET url đó → gọi parseEmbedResponse()
 * 
 * Trường hợp 4 — Extension lạ:
 *   { url: "https://cdn.com/video.vl", mimeType: "application/x-mpegURL" }
 *   → Báo App đây là HLS dù extension không phải .m3u8
 * 
 * Trường hợp 5 — Truyện Tranh (Manga / Comic / Novel) — Trả danh sách ảnh:
 *   {
 *       images: ["https://cdn.com/1.jpg", "https://cdn.com/2.jpg"],
 *       headers: { "Referer": "https://manhwa-site.com/" },
 *       isEmbed: false
 *   }
 * 
 * @param {string} html - HTML/JSON thô của trang xem tập phim hoặc chương truyện
 * @param {string} url - URL thực tế đã fetch để lấy html này
 */
function parseDetailResponse(html, url) {
    // -------------------------------------------------------------------------
    // 📖 NẾU LÀ TRUYỆN TRANH (COMIC / MANGA): Trả về mảng ảnh chương
    // -------------------------------------------------------------------------
    // var images = [];
    // var $doc = _$(html);
    // $doc.find(".chapter-content img").each(function() {
    //     var src = this.attr("data-src") || this.attr("src");
    //     if (src) images.push(src.trim());
    // });
    // return JSON.stringify({
    //     images: images,
    //     headers: { "Referer": "https://domain-truyen-cua-ban.com/" },
    //     isEmbed: false
    // });

    // -------------------------------------------------------------------------
    // 🎬 NẾU LÀ PHIM (MOVIE / VIDEO): Trả về link stream video
    // -------------------------------------------------------------------------
    return JSON.stringify({
        url: "https://cdn.example.com/video.m3u8",
        headers: {
            "Referer": "https://domain-phim-cua-ban.com",
            
            // 🛡️ BỘ 6 CẤU HÌNH CHẶN QUẢNG CÁO TÙY BIẾN CHO DEV PLUGIN (BỎ COMMENT NẾU CẦN DÙNG)
            // "Block-Ads": "true",
            // "Block-Redirects": "true",
            // "Block-Domains": "googlesyndication.com, doubleclick.net, popads.net, popcash.net, exoclick.com, adsterra.com, betting, casino",
            // "Block-Keywords": "/adserv/, /popunder, /popup.js, vast.xml, vpaid.js",
            // "Block-Css": "iframe[src*='ad'], div[class*='ad-'], div[class*='popup'], div[class*='popunder'], a[href*='bet'], a[href*='casino']",
            // "Block-Scripts": "popads,exoclick,adsterra",
            // "Custom-Js": "SnifferBridge.play('https://cdn.com/stream.m3u8', JSON.stringify({'Referer': 'https://site.com/'}));"
        },
        subtitles: []
        // isEmbed: false,     // true nếu cần fetch tiếp (xem parseEmbedResponse)
        // postBody: "",       // Body cho POST request (rỗng = GET)
        // mimeType: ""        // "application/x-mpegURL" cho HLS, "video/mp4" cho MP4
    });
}

/**
 * [TÙY CHỌN] Xử lý embed nhiều bước.
 * Chỉ cần viết hàm này khi trang dùng luồng phức tạp:
 *   Trang chi tiết → AJAX → iframe → stream URL
 * 
 * App gọi hàm này trong vòng lặp (tối đa 3 lần):
 *   - isEmbed: true  → App fetch tiếp URL trả về
 *   - isEmbed: false → URL cuối cùng, phát luôn
 *   - url: ""        → Dừng lặp
 * 
 * @param {string} html - HTML/JSON response từ bước trước
 * @param {string} sourceUrl - URL đã fetch để lấy html này
 */
function parseEmbedResponse(html, sourceUrl) {
    // Ví dụ: AJAX response chứa iframe
    // if (sourceUrl.indexOf('ajax') !== -1) {
    //     var data = JSON.parse(html);
    //     var match = data.player.match(/src="([^"]+)"/);
    //     if (match) {
    //         return JSON.stringify({ url: match[1], isEmbed: true });
    //     }
    // }
    
    // Ví dụ: Embed page chứa file stream
    // var fileMatch = html.match(/"file"\s*:\s*"(https?[^"]+)"/);
    // if (fileMatch) {
    //     return JSON.stringify({
    //         url: fileMatch[1],
    //         isEmbed: false,
    //         mimeType: "application/x-mpegURL",
    //         headers: { "Referer": "https://embed-server.com/" }
    //     });
    // }
    
    return JSON.stringify({ url: "", isEmbed: false });
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

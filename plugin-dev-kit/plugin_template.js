// =============================================================================
// CẤU HÌNH CƠ BẢN (METADATA)
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "my_new_plugin",
        "name": "Nguồn Phim Của Tôi",
        "version": "1.0.0",
        "baseUrl": "https://domain-phim-cua-ban.com",
        "iconUrl": "https://url-icon-vuong.png",
        "isEnabled": true,
        "isAdult": false,
        "type": "MOVIE",
        "layoutType": "VERTICAL"
    });
}

function getHomeSections() {
    // Các hàng hiển thị ở màn hình chính
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
// KIẾN TẠO LINK LẤY DỮ LIỆU HTML
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    // VD: https://domain.com/phim-le?page=1
    return "https://domain-phim-cua-ban.com/" + slug + "?page=" + page;
}

function getUrlSearch(keyword, filtersJson) {
    var page = JSON.parse(filtersJson || "{}").page || 1;
    return "https://domain-phim-cua-ban.com/tim-kiem?q=" + encodeURIComponent(keyword) + "&page=" + page;
}

function getUrlDetail(slug) {
    // Trả về link trang chi tiết từ slug lấy được trong parseListResponse
    return "https://domain-phim-cua-ban.com/phim/" + slug;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// XỬ LÝ HTML SOURCE -> JSON MÀ APP ĐỌC ĐƯỢC
// =============================================================================

function parseListResponse(html) {
    // Tự viết Regex hoặc thao tác trên chuỗi HTML để rọc lấy danh sách phim
    // Cần mảng các đối tượng có id/slug, title, posterUrl, quality...
    // Trả về JSON String: {"items": [{id, title, posterUrl, ...}], "pagination": {currentPage, totalPages}}
    return JSON.stringify({
        items: [],
        pagination: { currentPage: 1, totalPages: 1 }
    });
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    // Trả ra cấu trúc bộ phim: title, posterUrl, description, ...
    // Đặc biệt là danh sách TẬP PHIM (servers)
    // "servers": [{"name": "VIP", "episodes": [{"id": "t1", "name": "Tập 1", "slug": "slug1"}]}]
    return JSON.stringify({
        id: "id_phim",
        title: "Tên phim",
        posterUrl: "",
        backdropUrl: "",
        description: "Mô tả...",
        servers: [],
        quality: "HD",
        year: 2024,
        rating: 8.0,
        status: "Full"
    });
}

function parseDetailResponse(html) {
    // Trả về file Video play trực tiếp
    return JSON.stringify({
        url: "https://.../video.m3u8",
        headers: { "Referer": "https://domain.com" },
        subtitles: []
    });
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

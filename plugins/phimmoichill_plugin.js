// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "phimmoichill",
        "name": "PhimMoiChill",
        "version": "1.0.0",
        "baseUrl": "https://phimmoichill.my",
        "iconUrl": "https://stpaulclinic.vn/vaapp/plugins/phimmoi.webp",
        "isEnabled": true,
        "isAdult": false,
        "type": "VIDEO",
        "layoutType": "HORIZONTAL"
    });
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Phim Mới', slug: 'phim-moi' },
        { name: 'Phim Lẻ', slug: 'phim-le' },
        { name: 'Phim Bộ', slug: 'phim-bo' },
        { name: 'Hành Động', slug: 'genre/phim-hanh-dong' },
        { name: 'Chiếu Rạp', slug: 'genre/phim-chieu-rap' }
    ]);
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'phim-moi', title: 'Phim Mới Cập Nhật', type: 'Horizontal', path: '' },
        { slug: 'phim-le', title: 'Phim Lẻ', type: 'Horizontal', path: '' },
        { slug: 'phim-bo', title: 'Phim Bộ', type: 'Horizontal', path: '' },
        { slug: 'genre/phim-hanh-dong', title: 'Hành Động', type: 'Horizontal', path: '' },
        { slug: 'genre/phim-tinh-cam', title: 'Tình Cảm', type: 'Grid', path: '' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [],
        category: [
            { name: "Hành Động", value: "genre/phim-hanh-dong" },
            { name: "Võ Thuật", value: "genre/phim-vo-thuat" },
            { name: "Tình Cảm", value: "genre/phim-tinh-cam" },
            { name: "Hài Hước", value: "genre/phim-hai-huoc" },
            { name: "Hoạt Hình", value: "genre/phim-hoat-hinh" },
            { name: "Chiếu Rạp", value: "genre/phim-chieu-rap" }
        ]
    });
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var baseSlug = slug || 'phim-moi';

    // Nếu filter có category thì dùng category, ghi đè slug
    if (filters.category) {
        baseSlug = filters.category;
    }

    var url = "https://phimmoichill.my/list/" + baseSlug;
    if (baseSlug.indexOf("genre") === 0 || baseSlug.indexOf("country") === 0) {
        url = "https://phimmoichill.my/" + baseSlug;
    }

    if (page > 1) {
        url += "/page-" + page;
    }
    return url;
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    return "https://phimmoichill.my/tim-kiem/" + encodeURIComponent(keyword).replace(/%20/g, '+');
}

function getUrlDetail(slug) {
    if (slug.indexOf("http") === 0) return slug;
    return "https://phimmoichill.my/info/" + slug + ".html";
}

function getUrlCategories() { return "https://phimmoichill.my/"; }
function getUrlCountries() { return "https://phimmoichill.my/"; }
function getUrlYears() { return "https://phimmoichill.my/"; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    var moviesMap = {};
    // PhimMoiChill thường dùng thẻ li class="item" hoặc div class="item" 
    var parts = html.split(/<li[^>]*class=["']item["'][^>]*>/);
    if (parts.length <= 1) {
        parts = html.split(/<div[^>]*class=["']item(?:[^"']*)?["'][^>]*>/);
    }

    // Nếu trang web có wrapper "halim-item" thường thấy ở theme Halim/Phimmoi
    if (parts.length <= 1) {
        parts = html.split(/<article[^>]*class=["'][^"']*halim-item["'][^>]*>/);
        if (parts.length <= 1) {
            parts = html.split(/<div[^>]*class=["'][^"']*halim-item["'][^>]*>/);
        }
    }

    // Một cấu trúc khác phổ biến của phimmoichill
    if (parts.length <= 1) {
        parts = html.split(/<div[^>]*class=["']flw-item["'][^>]*>/); // flix mẫu
    }

    if (parts.length <= 1) {
        // Fallback catch-all links if needed
        var listItems = html.match(/<a[^>]+href="[^"]+\/phim\/[^"]+">[\s\S]*?<\/a>/g);
        if (listItems) {
            parts = [""];
            for (var k = 0; k < listItems.length; k++) parts.push(listItems[k]);
        }
    }

    for (var i = 1; i < parts.length; i++) {
        var itemHtml = parts[i];

        // Lấy link và ID/Slug
        var linkMatch = itemHtml.match(/href="([^"]*(?:\/phim\/|\/xem\/|\/info\/)([^"\/]+)(?:\.html|))"/);
        if (!linkMatch) linkMatch = itemHtml.match(/href="([^"]+)"/);

        var fullUrl = linkMatch ? linkMatch[1] : "";
        var slugMatch = fullUrl.match(/\/phim\/([^\/.]+)/) || fullUrl.match(/\/xem\/([^\/]+)-pm/) || fullUrl.match(/\/info\/([^\/.]+)/);
        var slug = slugMatch ? slugMatch[1] : (linkMatch ? linkMatch[2] : "");

        if (slug) slug = slug.replace(".html", "").replace("info-", "");

        // Lấy tiêu đề 
        var title = "";
        var pMatch = itemHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        if (pMatch) title = pMatch[1].replace(/<[^>]*>/g, "").trim();

        if (!title) {
            var h3Match = itemHtml.match(/<h3[^>]*>(?:<a[^>]*>)?([\s\S]*?)(?:<\/a>)?<\/h3>/i);
            if (h3Match) title = h3Match[1].replace(/<[^>]*>/g, "").trim();
            else {
                var pMatch2 = itemHtml.match(/<p[^>]*class="name"[^>]*>([\s\S]*?)<\/p>/i);
                if (pMatch2) title = pMatch2[1].replace(/<[^>]*>/g, "").trim();
            }
        }

        if (!title && itemHtml.indexOf('title="') > -1) {
            var maybeTitleMatch = itemHtml.match(/title="([^"]+)"/);
            if (maybeTitleMatch) title = maybeTitleMatch[1];
        }

        // Lấy ảnh Thumbnail
        var thumbMatch = itemHtml.match(/data-src="([^"]+)"/) || itemHtml.match(/src="([^"]+)"/);
        var thumb = thumbMatch ? thumbMatch[1] : "";

        // Dọn dẹp URL ảnh nếu là lazyload url base64
        if (thumb.indexOf("data:image") === 0) {
            var fallbackThumbMatch = itemHtml.match(/data-bg="([^"]+)"/) || itemHtml.match(/style=".*url\('([^']+)'/);
            if (fallbackThumbMatch) thumb = fallbackThumbMatch[1];
        }

        // Kiểm tra xem có lấy được hay không, nếu không bỏ qua
        if (slug && title) {
            var rawTitle = PluginUtils.cleanText(title);

            // Tìm nhãn chất lượng (VD: HD, FHD, 4K, Vietsub)
            var labels = [];
            var qualityMatch = itemHtml.match(/class="[^"]*(?:quality|label|status)[^"]*"[^>]*>([\s\S]*?)<\//i);
            if (!qualityMatch) qualityMatch = itemHtml.match(/<span class="status">([^<]+)<\/span>/);

            if (qualityMatch) labels.push(PluginUtils.cleanText(qualityMatch[1]));

            // Tìm 4K đặc biệt
            if (itemHtml.indexOf("4K") !== -1 && itemHtml.indexOf("4k") !== -1) {
                if (labels.join(" ").indexOf("4K") === -1) {
                    labels.push("4K");
                }
            }

            var episodeMatch = itemHtml.match(/class="[^"]*episode[^"]*"[^>]*>([\s\S]*?)<\//);
            if (episodeMatch && PluginUtils.cleanText(episodeMatch[1]) !== "") labels.push(PluginUtils.cleanText(episodeMatch[1]));

            var statusText = labels.length > 0 ? labels.join(" | ") : "Full";

            if (!moviesMap[slug]) {
                moviesMap[slug] = {
                    id: slug,
                    title: rawTitle || "Phim không tiêu đề",
                    posterUrl: thumb,
                    backdropUrl: thumb,
                    year: 0,
                    quality: (labels.join(" ").indexOf("4K") > -1) ? "4K" : "HD",
                    episode_current: statusText,
                    lang: "Vietsub"
                };
            }
        }
    }

    var movies = [];
    for (var key in moviesMap) {
        if (moviesMap.hasOwnProperty(key)) {
            movies.push(moviesMap[key]);
        }
    }

    // Lấy số trang
    var totalPages = 1;
    var pagesMatch = html.match(/href="[^"]*page-(\d+)[^"]*"/g);
    if (!pagesMatch) pagesMatch = html.match(/page=(\d+)/g);
    if (pagesMatch) {
        for (var j = 0; j < pagesMatch.length; j++) {
            var pMatch = pagesMatch[j].match(/page-(\d+)/) || pagesMatch[j].match(/page=(\d+)/);
            if (pMatch) {
                var p = parseInt(pMatch[1]);
                if (p > totalPages) totalPages = p;
            }
        }
    }

    return JSON.stringify({
        items: movies,
        pagination: {
            currentPage: 1,
            totalPages: totalPages || 1,
            totalItems: movies.length,
            itemsPerPage: 20
        }
    });
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

var PluginUtils = {
    cleanText: function (text) {
        if (!text) return "";
        return text.replace(/<[^>]*>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/\s+/g, " ")
            .trim();
    }
};

function parseMovieDetail(html) {
    try {
        // Tên phim
        var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        if (!titleMatch) titleMatch = html.match(/<h2[^>]*class="title[^"]*"[^>]*>([\s\S]*?)<\/h2>/);
        var title = titleMatch ? titleMatch[1].trim() : "";

        // Mô tả
        var descMatch = html.match(/<div[^>]*class="[^"]*film-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
            html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
            html.match(/id="info-film"[^>]*>([\s\S]*?)<\/div>/i);
        var description = descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "";

        // URL Ảnh Thumbnail
        var thumbMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/) ||
            html.match(/<img[^>]*class="[^"]*poster[^"]*"[^>]*src="([^"]+)"/);
        var thumb = thumbMatch ? thumbMatch[1] : "";

        // Servers và Episodes
        var serversMap = {};
        serversMap["Server 1"] = [];
        var defaultServerName = "PhimMoi";

        // PhimMoiChill thường có list tập dạng <li><a href="...xem/slug-tap-1...">...
        var defaultEpisodesList = html.match(/<ul[^>]*class="[^"]*list-episode[^"]*"[^>]*>([\s\S]*?)<\/ul>/) ||
            html.match(/id="halim-list-server"[^>]*>([\s\S]*?)<\/ul>/);

        if (defaultEpisodesList) {
            var epRegex = /<a[^>]*href="([^"]+)"[^>]*>(?:<span[^>]*>)?([\s\S]*?)(?:<\/span>)?<\/a>/g;
            var epMatch;
            var epsArr = [];
            while ((epMatch = epRegex.exec(defaultEpisodesList[1])) !== null) {
                var epUrl = epMatch[1];
                var epName = PluginUtils.cleanText(epMatch[2]);
                if (epUrl && epName) {
                    epsArr.push({
                        id: epUrl.replace("https://phimmoichill.my", ""), // Cắt domain để dễ xử lý khi parseStream
                        name: epName,
                        slug: epName
                    });
                }
            }
            if (epsArr.length > 0) {
                serversMap[defaultServerName] = epsArr;
            }
        }

        // Nếu không có mảng tập nào hoặc là trang Xem phim (!?)
        if (!serversMap[defaultServerName] || serversMap[defaultServerName].length === 0) {
            // Có khi nút "Xem phim" chuyển thẳng sang trang /xem/...
            var watchMatch = html.match(/href="([^"]+\/xem\/[^"]+)"/);
            if (watchMatch) {
                serversMap[defaultServerName] = [{
                    id: watchMatch[1].replace("https://phimmoichill.my", ""),
                    name: "Full",
                    slug: "full"
                }];
            } else {
                serversMap[defaultServerName] = [{
                    id: "",
                    name: "Trailer",
                    slug: "trailer"
                }];
            }
        }

        var parsedServers = [];
        for (var serverName in serversMap) {
            if (serversMap.hasOwnProperty(serverName) && serversMap[serverName].length > 0) {
                parsedServers.push({
                    name: serverName,
                    episodes: serversMap[serverName]
                });
            }
        }

        // Status text 
        var labels = [];
        var qualityMatch = html.match(/<span[^>]*class="quality"[^>]*>([\s\S]*?)<\/span>/i);
        if (qualityMatch) labels.push(PluginUtils.cleanText(qualityMatch[1]));

        if (html.indexOf("4K") !== -1) {
            if (labels.join(" ").indexOf("4K") === -1) {
                labels.push("4K");
            }
        }

        var statusMatch = html.match(/<span[^>]*class="status"[^>]*>([\s\S]*?)<\/span>/i);
        if (statusMatch) labels.push(PluginUtils.cleanText(statusMatch[1]));

        return JSON.stringify({
            id: "",
            title: PluginUtils.cleanText(title),
            posterUrl: thumb,
            backdropUrl: thumb,
            description: PluginUtils.cleanText(description),
            servers: parsedServers,
            quality: (labels.join(" ").indexOf("4K") > -1) ? "4K" : "HD",
            lang: "Vietsub",
            year: 0,
            rating: 0,
            casts: "",
            director: "",
            country: "",
            category: "",
            status: labels.length > 0 ? labels.join(" | ") : "Full"
        });
    } catch (e) {
        return "null";
    }
}

function parseDetailResponse(html, fallbackUrl) {
    try {
        // Trên trang xem phim PhimMoiChill, frame phim thường được nhúng vào hoặc gọi ajax 
        // 1. Kiểm tra iframe trực tiếp
        var iframeMatch = html.match(/<iframe[^>]*src="([^"]+)"/);
        if (iframeMatch) {
            var url = iframeMatch[1];
            // Bỏ qua các iframe rác như facebook, youtube trailer
            if (url.indexOf("facebook") === -1 && url.indexOf("youtube") === -1 && url.indexOf("google") === -1) {
                return JSON.stringify({
                    url: url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Referer": "https://phimmoichill.my/"
                    },
                    subtitles: []
                });
            }
        }

        // 2. Nếu trả về script hoặc data JSON (trong trường hợp app Android có interceptor xử lý AJAX request sau dấy)
        // Với PhimMoiChill, khi vào trang /xem/... nó sẽ gọi chillsplayer.php.
        // Nhưng nếu trả về chính URL '/xem/...' thì Kotlin App sẽ load URL đó bằng WebView => TVPlayerScreen
        // Và xử lý autoplay tương tự Sextop1 thông qua Custom-Js.

        return JSON.stringify({
            url: "https://phimmoichill.my" + fallbackUrl, // Kotlin truyền fallbackUrl = id (path của tập)
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://phimmoichill.my/",
                // Auto play logic dành cho JWPlayer, Video.js thường gặp trên iframe phim
                "Custom-Js": "var attempt=0; var clbInt=setInterval(function(){var b=document.querySelector('.jw-display-icon-display, .jw-display-icon-container, img[src*=\\\"play\\\"], .play-btn, .vjs-big-play-button');if(b){try{b.click();b.style.display='none';clearInterval(clbInt);}catch(e){}}if(attempt++>20)clearInterval(clbInt);},500);"
            },
            subtitles: []
        });

    } catch (e) {
        return JSON.stringify({ url: "https://phimmoichill.my" + fallbackUrl, headers: {}, subtitles: [] });
    }
}

function parseCategoriesResponse(html) {
    // Để cho dễ, trả về string rỗng hoặc menu tĩnh nếu trang không dễ parse menu
    return "[]";
}
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

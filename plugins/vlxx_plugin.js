// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "vlxx",
        "name": "VLXX",
        "version": "1.0.9",
        "baseUrl": "https://vlxx.net",
        "iconUrl": "https://raw.githubusercontent.com/youngbi/repo/main/plugins/vlxx.ico",
        "isEnabled": true,
        "isAdult": true,
        "type": "MOVIE",
        "playerType": "exoplayer",
        "layoutType": "HORIZONTAL"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'jav', title: 'Phim JAV', type: 'Horizontal', path: 'category' },
        { slug: 'phim-sex-hay', title: 'Phim Sex Hay', type: 'Horizontal', path: 'category' },
        { slug: 'vietsub', title: 'Phim Sex Vietsub', type: 'Horizontal', path: 'category' },
        { slug: 'khong-che', title: 'Không Che', type: 'Horizontal', path: 'category' },
        { slug: 'home', title: 'Phim Sex Mới', type: 'Grid', path: '' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'JAV', slug: 'jav' },
        { name: 'Phim Sex Hay', slug: 'phim-sex-hay' },
        { name: 'Vietsub', slug: 'vietsub' },
        { name: 'Không Che', slug: 'khong-che' },
        { name: 'Sex Học Sinh', slug: 'hoc-sinh' },
        { name: 'Vụng Trộm', slug: 'vung-trom' },
        { name: 'Phim Cấp 3', slug: 'cap-3' },
        { name: 'Mỹ - Châu Âu', slug: 'chau-au' },
        { name: 'XVIDEOS', slug: 'xvideos' },
        { name: 'XNXX', slug: 'xnxx' },
        { name: 'XXX', slug: 'xxx' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({});
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var baseUrl = "https://vlxx.net";

    if (slug === '' || slug === 'home') {
        if (page > 1) {
            return baseUrl + "/new/" + page + "/";
        }
        return baseUrl + "/";
    }

    if (page > 1) {
        return baseUrl + "/" + slug + "/" + page + "/";
    }
    return baseUrl + "/" + slug + "/";
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var safeKeyword = encodeURIComponent(keyword.replace(/\s+/g, '-'));
    var url = "https://vlxx.net/search/" + safeKeyword + "/";
    if (page > 1) {
        url = "https://vlxx.net/search/" + safeKeyword + "/" + page + "/";
    }
    return url;
}

// getUrlDetail: App gọi với episode.id
// episode.id = canonical URL (có thể kèm #s2 cho server 2)
// Trả về URL as-is (starts with http) → App fetch trang detail
function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf("http") === 0) return slug;
    if (slug.charAt(0) !== '/') slug = '/' + slug;
    return "https://vlxx.net" + slug;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    var items = [];
    var blocks = html.split('class="video-item"');

    for (var i = 1; i < blocks.length; i++) {
        var block = blocks[i];

        var linkMatch = block.match(/href=["']([^"']+)["']/i);
        var link = linkMatch ? linkMatch[1] : "";

        var titleMatch = block.match(/title=["']([^"']+)["']/i);
        var title = titleMatch ? titleMatch[1] : "";

        var thumbMatch = block.match(/data-original=["']([^"']+)["']/i);
        if (!thumbMatch) {
            thumbMatch = block.match(/<img[^>]*src=["']([^"']+)["']/i);
        }
        var thumb = thumbMatch ? thumbMatch[1] : "";

        if (thumb && thumb.indexOf("data:image") === 0) thumb = "";

        if (link && title) {
            items.push({
                id: link,
                title: title.replace(/<[^>]+>/g, '').trim(),
                posterUrl: thumb,
                backdropUrl: thumb,
                year: 0
            });
        }
    }

    var currentPage = 1;
    var totalPages = 1;

    var cpMatch = html.match(/<a[^>]*class=["'][^"']*active[^"']*["'][^>]*data-page=["'](\d+)["']/i);
    if (cpMatch) {
        currentPage = parseInt(cpMatch[1]);
    }

    var lpRegex = /<a[^>]*data-page=["'](\d+)["'][^>]*>[0-9]+<\/a>/gi;
    var lpMatch;
    while ((lpMatch = lpRegex.exec(html)) !== null) {
        var pageNum = parseInt(lpMatch[1]);
        if (pageNum > totalPages) totalPages = pageNum;
    }
    if (currentPage > totalPages) totalPages = currentPage;

    return JSON.stringify({
        items: items,
        pagination: {
            currentPage: currentPage,
            totalPages: totalPages
        }
    });
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    try {
        var titleMatch = html.match(/<h1[^>]*page-title[^>]*>([\s\S]*?)<\/h1>/i)
            || html.match(/<h2[^>]*page-title[^>]*>([\s\S]*?)<\/h2>/i)
            || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        var title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : "";

        var descMatch = html.match(/<div[^>]*class=["']video-description["'][^>]*>([\s\S]*?)<\/div>/i);
        var description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : "";

        var codeMatch = html.match(/<span[^>]*class=["']video-code["'][^>]*>([\s\S]*?)<\/span>/i);
        var code = codeMatch ? codeMatch[1].replace(/<[^>]+>/g, '').trim() : "";

        if (code && title) {
            title = "(" + code + ") " + title;
        }

        var ogImg = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        var posterUrl = ogImg ? ogImg[1] : "";

        var castsArr = [];
        var castRegex = /<div[^>]*class=["']actress-tag["'][^>]*><a[^>]*>([\s\S]*?)<\/a>/gi;
        var castMatch;
        while ((castMatch = castRegex.exec(html)) !== null) {
            castsArr.push(castMatch[1].replace(/<[^>]+>/g, '').trim());
        }

        var categoriesArr = [];
        var catSectionMatch = html.match(/<div[^>]*class=["']category-tag["'][^>]*>([\s\S]*?)<\/div>/i);
        if (catSectionMatch) {
            var catSection = catSectionMatch[1];
            var catRegex = /<a[^>]*>([\s\S]*?)<\/a>/gi;
            var cmMatch;
            while ((cmMatch = catRegex.exec(catSection)) !== null) {
                categoriesArr.push(cmMatch[1].replace(/<[^>]+>/g, '').trim());
            }
        }

        // =====================================================================
        // episode.id = canonical URL + #s{serverId}
        // Khi user bấm xem → App gọi getUrlDetail(url#s1) → fetch trang detail
        // → parseDetailResponse trích data-id + server từ fragment → trả AJAX POST
        // =====================================================================

        var servers = [];

        // Lấy canonical URL
        var canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
            || html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i);
        var pageUrl = canonicalMatch ? canonicalMatch[1] : "";

        // Tìm server buttons: onclick="server(1,3105)" onclick="server(2,3105)"
        var serverRegex = /onclick=["']server\((\d+),\s*(\d+)\)["']/gi;
        var srvMatch;

        while ((srvMatch = serverRegex.exec(html)) !== null) {
            var serverId = srvMatch[1];
            servers.push({
                name: "Server #" + serverId,
                episodes: [{
                    id: pageUrl + "#s" + serverId,
                    name: "Full",
                    slug: "full-s" + serverId
                }]
            });
        }

        // Fallback nếu không tìm thấy server buttons
        if (servers.length === 0 && pageUrl) {
            servers.push({
                name: "Server #1",
                episodes: [{
                    id: pageUrl + "#s1",
                    name: "Full",
                    slug: "full"
                }]
            });
        }

        return JSON.stringify({
            id: "",
            title: title.replace(/<[^>]+>/g, '').trim(),
            posterUrl: posterUrl,
            backdropUrl: posterUrl,
            description: description,
            servers: servers,
            quality: "HD",
            lang: "Vietsub",
            year: 0,
            rating: 0,
            casts: castsArr.join(", "),
            director: "",
            country: "",
            category: categoriesArr.join(", "),
            status: code || "Full"
        });

    } catch (e) {
        return "null";
    }
}

// =============================================================================
// STREAM RESOLUTION (3-step: detail page → AJAX POST → embed page)
// =============================================================================

// parseDetailResponse: Nhận HTML tĩnh từ detail page
// Trích data-id + server number → trả AJAX POST config cho App
function parseDetailResponse(html, fetchedUrl) {
    try {
        // Trích data-id từ HTML
        var dataIdMatch = html.match(/data-id=["'](\d+)["']/i);
        var videoId = dataIdMatch ? dataIdMatch[1] : "";

        // Fallback: lấy ID từ URL path (ví dụ: /video/.../3105/)
        if (!videoId && fetchedUrl) {
            var urlIdMatch = fetchedUrl.match(/\/(\d+)\/?(?:#|$)/);
            if (urlIdMatch) videoId = urlIdMatch[1];
        }

        if (!videoId) {
            return JSON.stringify({ url: "", isEmbed: false, headers: {} });
        }

        // Trích server number từ URL fragment (#s1, #s2)
        var serverId = "1";
        if (fetchedUrl) {
            var fragMatch = fetchedUrl.match(/#s(\d+)/);
            if (fragMatch) serverId = fragMatch[1];
        }

        // Trích device type từ HTML
        var deviceMatch = html.match(/deviceType\s*=\s*['"](\w+)['"]/i);
        var deviceType = deviceMatch ? deviceMatch[1] : "mobile";
        var vlxxServer = (deviceType === "desktop") ? "1" : "2";

        // Trả config để App POST tới /ajax.php
        return JSON.stringify({
            url: "https://vlxx.net/ajax.php",
            isEmbed: true,
            postBody: "vlxx_server=" + vlxxServer + "&id=" + videoId + "&server=" + serverId,
            headers: {
                "Referer": "https://vlxx.net/",
                "Stream-Regex": "https?:\\/\\/[^\"'\\s]+\\.(?:vl|m3u8|mp4)[^\"'\\s]*"
            }
        });
    } catch (error) {
        return JSON.stringify({ url: "", isEmbed: false, headers: {} });
    }
}

// parseEmbedResponse: Xử lý 2 loại response:
// Depth 1 - AJAX JSON: {"player":"<iframe src=\"...\">"}  → trích iframe URL
// Depth 2 - Embed HTML: JWPlayer sources với .vl URL      → trích stream URL
function parseEmbedResponse(html, url) {
    try {
        // === CASE 1: AJAX JSON response (chứa "player" key) ===
        // Response dạng: {"player":"<iframe src=\"https:\/\/play.vlstream.net\/embed\/hash\/s1\" ...>"}
        // Cần JSON.parse để unescape \/ thành / và \" thành "
        if (html.indexOf('"player"') !== -1) {
            try {
                var jsonObj = JSON.parse(html);
                if (jsonObj && jsonObj.player) {
                    var playerHtml = jsonObj.player;
                    // playerHtml giờ là clean HTML: <iframe src="https://play.vlstream.net/embed/hash/s1" ...>
                    var srcMatch = playerHtml.match(/src=["']([^"']+)["']/i);
                    if (srcMatch) {
                        return JSON.stringify({
                            url: srcMatch[1],
                            isEmbed: true,
                            headers: {
                                "Referer": "https://vlxx.net/"
                            }
                        });
                    }
                }
            } catch (parseErr) {
                // Fallback: regex trên raw JSON string
                // Unescape \/ trước khi match
                var cleaned = html.replace(/\\\//g, '/');
                // Match src=\"URL\" hoặc src=\\"URL\\"
                var iframeMatch = cleaned.match(/src=(?:\\\\)?["'](https?:\/\/[^"'\\]+)(?:\\\\)?["']/i);
                if (iframeMatch) {
                    return JSON.stringify({
                        url: iframeMatch[1],
                        isEmbed: true,
                        headers: {
                            "Referer": "https://vlxx.net/"
                        }
                    });
                }
            }
        }

        // === CASE 2: Embed page HTML (JWPlayer with .vl sources) ===
        var fileMatch = html.match(/"file"\s*:\s*"(https?[^"]+\.vl[^"]*)"/i);
        if (fileMatch) {
            return JSON.stringify({
                url: fileMatch[1],
                isEmbed: false,
                mimeType: "application/x-mpegURL",
                headers: {
                    "Referer": "https://play.vlstream.net/"
                }
            });
        }

        // Thử parse sources array
        var sourcesMatch = html.match(/sources\s*:\s*(\[[^\]]+\])/i);
        if (sourcesMatch) {
            try {
                var sources = JSON.parse(sourcesMatch[1]);
                if (sources && sources.length > 0 && sources[0].file) {
                    var sFile = sources[0].file;
                    var isHls = (sources[0].type === 'hls') || sFile.indexOf('.vl') !== -1 || sFile.indexOf('.m3u8') !== -1;
                    return JSON.stringify({
                        url: sFile,
                        isEmbed: false,
                        mimeType: isHls ? 'application/x-mpegURL' : (sFile.indexOf('.mp4') !== -1 ? 'video/mp4' : ''),
                        headers: {
                            "Referer": "https://play.vlstream.net/"
                        }
                    });
                }
            } catch (e) {
                var regexFile = sourcesMatch[1].match(/"file"\s*:\s*"([^"]+)"/i);
                if (regexFile) {
                    return JSON.stringify({
                        url: regexFile[1],
                        isEmbed: false,
                        mimeType: "application/x-mpegURL",
                        headers: {
                            "Referer": "https://play.vlstream.net/"
                        }
                    });
                }
            }
        }

        // Tìm bất kỳ URL .vl nào
        var vlMatch = html.match(/(https?:\/\/[^\s"'\\]+\.vl[^\s"'\\]*)/i);
        if (vlMatch) {
            return JSON.stringify({
                url: vlMatch[1],
                isEmbed: false,
                mimeType: "application/x-mpegURL",
                headers: {
                    "Referer": "https://play.vlstream.net/"
                }
            });
        }

        // Không tìm được gì → trả empty để dừng recursive loop
        return JSON.stringify({ url: "", isEmbed: false, headers: {} });
    } catch (e) {
        return JSON.stringify({ url: "", isEmbed: false, headers: {} });
    }
}

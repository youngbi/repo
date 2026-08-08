// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

var BASE_URL = "https://vlxx.net";

function getManifest() {
    return JSON.stringify({
        "id": "vlxx",
        "name": "VLXX",
        "version": "1.0.6",
        "baseUrl": BASE_URL,
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

// Helper lấy domain động thực tế từ URL
function getBaseUrl(url) {
    if (url && url.indexOf("http") === 0) {
        var m = url.match(/https?:\/\/[^\/]+/i);
        if (m) return m[0];
    }
    return BASE_URL;
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var baseUrl = BASE_URL;

    if (slug === '' || slug === 'home') {
        if (page > 1) return baseUrl + "/new/" + page + "/";
        return baseUrl + "/";
    }

    if (page > 1) return baseUrl + "/" + slug + "/" + page + "/";
    return baseUrl + "/" + slug + "/";
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var safeKeyword = encodeURIComponent(keyword.replace(/\s+/g, '-'));
    var url = BASE_URL + "/search/" + safeKeyword + "/";
    if (page > 1) {
        url = BASE_URL + "/search/" + safeKeyword + "/" + page + "/";
    }
    return url;
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf("http") === 0) return slug;
    if (slug.charAt(0) !== '/') slug = '/' + slug;
    return BASE_URL + slug;
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

        var servers = [];
        var canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
            || html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i);
        var pageUrl = canonicalMatch ? canonicalMatch[1] : "";

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

function parseDetailResponse(html, fetchedUrl) {
    try {
        var domain = getBaseUrl(fetchedUrl);

        // Trích data-id hoặc ID trong hàm server(1, 3199)
        var dataIdMatch = html.match(/data-id=["'](\d+)["']/i) || html.match(/server\(\d+,\s*(\d+)\)/i);
        var videoId = dataIdMatch ? dataIdMatch[1] : "";

        // Fallback: lấy ID từ URL path (/video/.../3199/#s1)
        if (!videoId && fetchedUrl) {
            var urlIdMatch = fetchedUrl.match(/\/(\d+)\/?(?:#|$)/);
            if (urlIdMatch) videoId = urlIdMatch[1];
        }

        if (!videoId) {
            return JSON.stringify({ url: "", isEmbed: false, headers: {} });
        }

        var serverId = "1";
        if (fetchedUrl) {
            var fragMatch = fetchedUrl.match(/#s(\d+)/);
            if (fragMatch) serverId = fragMatch[1];
        }

        var deviceMatch = html.match(/deviceType\s*=\s*['"](\w+)['"]/i);
        var deviceType = deviceMatch ? deviceMatch[1] : "mobile";
        var vlxxServer = (deviceType === "desktop") ? "1" : "2";

        // TỰ ĐỘNG LẤY DOMAIN THỰC TẾ (https://vlxx.net hoặc https://vlxx.moi) + THÊM CÁC HEADER CHUẨN AJAX
        return JSON.stringify({
            url: domain + "/ajax.php",
            isEmbed: true,
            postBody: "vlxx_server=" + vlxxServer + "&id=" + videoId + "&server=" + serverId,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": fetchedUrl || (domain + "/"),
                "Origin": domain,
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
                "Stream-Regex": "https?:\\/\\/[^\"'\\s]+\\.(?:vl|m3u8|mp4)[^\"'\\s]*"
            }
        });
    } catch (error) {
        return JSON.stringify({ url: "", isEmbed: false, headers: {} });
    }
}

function parseEmbedResponse(html, url) {
    try {
        var cleanHtml = html;
        if (cleanHtml.indexOf('\\/') !== -1) {
            cleanHtml = cleanHtml.replace(/\\\//g, '/');
        }
        if (cleanHtml.indexOf('\\"') !== -1) {
            cleanHtml = cleanHtml.replace(/\\"/g, '"');
        }

        // CASE 1: Response JSON từ ajax.php chứa player iframe
        if (cleanHtml.indexOf('"player"') !== -1 || cleanHtml.indexOf('player') !== -1) {
            try {
                var jsonObj = JSON.parse(html);
                if (jsonObj && jsonObj.player) {
                    var playerHtml = jsonObj.player.replace(/\\\//g, '/');
                    var srcMatch = playerHtml.match(/src=["']([^"']+)["']/i);
                    if (srcMatch) {
                        var embedUrl = srcMatch[1];
                        if (embedUrl.indexOf('//') === 0) embedUrl = 'https:' + embedUrl;
                        return JSON.stringify({
                            url: embedUrl,
                            isEmbed: true,
                            headers: {
                                "Referer": url || "https://vlxx.net/"
                            }
                        });
                    }
                }
            } catch (parseErr) {}

            var iframeMatch = cleanHtml.match(/src=["']([^"']+)["']/i);
            if (iframeMatch) {
                var iframeUrl = iframeMatch[1];
                if (iframeUrl.indexOf('//') === 0) iframeUrl = 'https:' + iframeUrl;
                return JSON.stringify({
                    url: iframeUrl,
                    isEmbed: true,
                    headers: {
                        "Referer": url || "https://vlxx.net/"
                    }
                });
            }
        }

        // CASE 2: Trang Embed HTML (chứa luồng JWPlayer với .vl hay .m3u8)
        var fileMatch = cleanHtml.match(/"file"\s*:\s*"(https?[^"]+\.(?:vl|m3u8|mp4)[^"]*)"/i);
        if (fileMatch) {
            var streamUrl = fileMatch[1].replace(/\\\//g, '/');
            return JSON.stringify({
                url: streamUrl,
                isEmbed: false,
                mimeType: "application/x-mpegURL",
                headers: {
                    "Referer": getBaseUrl(url) + "/"
                }
            });
        }

        var sourcesMatch = cleanHtml.match(/sources\s*:\s*(\[[^\]]+\])/i);
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
                            "Referer": getBaseUrl(url) + "/"
                        }
                    });
                }
            } catch (e) {}
        }

        var vlMatch = cleanHtml.match(/(https?:\/\/[^\s"'\\]+\.(?:vl|m3u8)[^\s"'\\]*)/i);
        if (vlMatch) {
            return JSON.stringify({
                url: vlMatch[1],
                isEmbed: false,
                mimeType: "application/x-mpegURL",
                headers: {
                    "Referer": getBaseUrl(url) + "/"
                }
            });
        }

        return JSON.stringify({ url: "", isEmbed: false, headers: {} });
    } catch (e) {
        return JSON.stringify({ url: "", isEmbed: false, headers: {} });
    }
}

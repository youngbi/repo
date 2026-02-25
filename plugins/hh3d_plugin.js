// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "hh3d",
        "name": "HH3D - Hoạt Hình 3D",
        "version": "1.0.3",
        "baseUrl": "https://hoathinh3d.ai",
        "iconUrl": "https://stpaulclinic.vn/vaapp/plugins/hh3d.ico",
        "isEnabled": true,
        "isAdult": false,
        "type": "MOVIE",
        "layoutType": "VERTICAL"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'bang-xep-hang-hoat-hinh-trung-quoc', title: 'Top 10', type: 'Horizontal', path: '' },
        { slug: 'phim-hoan-thanh', title: 'Hoàn Thành', type: 'Horizontal', path: '' },
        { slug: 'hh3d-danh-gia-cao', title: 'Xem Nhiều', type: 'Horizontal', path: '' },
        { slug: 'tien-hiep', title: 'Tiên Hiệp', type: 'Horizontal', path: '' },
        { slug: 'kiem-hiep', title: 'Kiếm Hiệp', type: 'Horizontal', path: '' },
        { slug: '', title: 'Mới Cập Nhật', type: 'Grid', path: '' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Đang chiếu', slug: 'phim-dang-chieu' },
        { name: 'Hoàn thành', slug: 'phim-hoan-thanh' },
        { name: 'Phim lẻ', slug: 'phim-hoat-hinh-3d-le' },
        { name: 'Huyền huyễn', slug: 'huyen-huyen' },
        { name: 'Xuyên không', slug: 'xuyen-khong' },
        { name: 'Trùng sinh', slug: 'trung-sinh' },
        { name: 'Tiên hiệp', slug: 'tien-hiep' },
        { name: 'Cổ trang', slug: 'co-trang' },
        { name: 'Hài hước', slug: 'hai-huoc' },
        { name: 'Kiếm hiệp', slug: 'kiem-hiep' },
        { name: 'Hiện đại', slug: 'hien-dai' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [
            { name: 'Mới cập nhật', value: 'latest' },
            { name: 'Đánh giá cao', value: 'rating' },
            { name: 'Xem nhiều', value: 'views' }
        ],
        category: [
            { name: "Huyền Huyễn", value: "huyen-huyen" },
            { name: "Xuyên Không", value: "xuyen-khong" },
            { name: "Trùng Sinh", value: "trung-sinh" },
            { name: "Tiên Hiệp", value: "tien-hiep" },
            { name: "Cổ Trang", value: "co-trang" },
            { name: "Hài Hước", value: "hai-huoc" },
            { name: "Kiếm Hiệp", value: "kiem-hiep" },
            { name: "Hiện Đại", value: "hien-dai" }
        ]
    });
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var baseUrl = "https://hoathinh3d.ai";

    // Prioritize category filter if present
    if (filters.category) {
        return baseUrl + "/" + filters.category + "/page/" + page + "/";
    }

    if (!slug || slug === '') {
        return baseUrl + "/page/" + page + "/";
    }

    // Handle full URL slugs if passed
    if (slug.indexOf("http") === 0) {
        return slug;
    }

    return baseUrl + "/" + slug + "/page/" + page + "/";
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    return "https://hoathinh3d.ai/page/" + page + "/?s=" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    if (!slug) return "";

    // Check if it's our special combined ID: slug|postId|svId
    if (slug.indexOf("|") !== -1) {
        var parts = slug.split("|");
        if (parts.length >= 3) {
            var epSlug = parts[0];
            var postId = parts[1];
            var svId = parts[2];
            // Format for player.php direct call
            return "https://hoathinh3d.ai/wp-content/themes/halimmovies/player.php?episode_slug=" + epSlug + "&server_id=" + svId + "&subsv_id=&post_id=" + postId;
        }
    }

    if (slug.indexOf("http") === 0) return slug;
    if (slug.indexOf("/") === 0) return "https://hoathinh3d.ai" + slug;
    return "https://hoathinh3d.ai/" + slug;
}

function getUrlCategories() { return "https://hoathinh3d.ai/"; }
function getUrlCountries() { return ""; } // Not supported
function getUrlYears() { return ""; } // Not supported

// =============================================================================
// PARSERS
// =============================================================================

var PluginUtils = {
    cleanText: function (text) {
        if (!text) return "";
        return text.replace(/<[^>]*>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/\s+/g, " ")
            .trim();
    },
    extractImageFromStyle: function (styleAttr) {
        if (!styleAttr) return "";
        var match = styleAttr.match(/url\(['"]?([^'"]+)['"]?\)/);
        return match ? match[1] : "";
    }
};

function parseListResponse(html) {
    var movies = [];
    var foundSlugs = {};

    // Parse movie items: div.halim-item
    var itemRegex = /<(?:article|div)[^>]*class="[^"]*(?:halim-item|thumb|halim-thumb)[^"]*"[^>]*>([\s\S]*?)<\/(?:article|div)>/gi;
    var match;

    while ((match = itemRegex.exec(html)) !== null) {
        var itemHtml = match[1];

        // Ensure this is a movie item - look for thumb or entry-title links
        var linkMatch = itemHtml.match(/<a[^>]+class="[^"]*(?:halim-thumb|thumb)[^"]*"[^>]+href="([^"]+)"/i) ||
            itemHtml.match(/<a[^>]+href="([^"]+)"[^>]*title=/i);
        if (!linkMatch) continue;

        var url = linkMatch[1];
        var slug = url.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "");

        // Extract title from a.title or h2.entry-title or a.title attribute
        var titleMatch = itemHtml.match(/title="([^"]+)"/i) ||
            itemHtml.match(/<h2[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i);
        var title = titleMatch ? PluginUtils.cleanText(titleMatch[1]) : "";

        // Extract thumbnail from img tag (data-src, src, or data-srcset)
        var thumbMatch = itemHtml.match(/<img[^>]+data-src="([^"]+)"/i) ||
            itemHtml.match(/<img[^>]+src="([^"]+)"/i) ||
            itemHtml.match(/<img[^>]+data-srcset="([^" ]+)/i);
        var thumb = thumbMatch ? thumbMatch[1] : "";

        // Extract episode info
        var episodeMatch = itemHtml.match(/<span[^>]*class="[^"]*episode[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
        var episode = episodeMatch ? PluginUtils.cleanText(episodeMatch[1]) : "Full";

        // Extract quality badge if exists
        var qualityMatch = itemHtml.match(/<span[^>]*class="[^"]*status[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
        var quality = qualityMatch ? PluginUtils.cleanText(qualityMatch[1]) : "HD";

        if (slug && !foundSlugs[slug]) {
            movies.push({
                id: slug,
                title: title || "Không có tiêu đề",
                posterUrl: thumb,
                backdropUrl: thumb,
                description: "",
                year: 0,
                quality: quality,
                episode_current: episode,
                lang: "Vietsub"
            });
            foundSlugs[slug] = true;
        }
    }

    // Parse pagination
    var totalPages = 1;
    var currentPage = 1;

    // Find current page: <span class="current">2</span>
    var currentMatch = html.match(/<span[^>]*class="[^"]*current[^"]*"[^>]*>(\d+)<\/span>/i);
    if (currentMatch) {
        currentPage = parseInt(currentMatch[1]);
    }

    // Find total pages: look for highest page number in pagination
    var pageRegex = /page\/(\d+)\//g;
    var pageMatch;
    while ((pageMatch = pageRegex.exec(html)) !== null) {
        var p = parseInt(pageMatch[1]);
        if (p > totalPages) totalPages = p;
    }

    // Also check for page-numbers links
    var pageNumRegex = /<a[^>]*class="[^"]*page-numbers[^"]*"[^>]*>(\d+)<\/a>/g;
    var numMatch;
    while ((numMatch = pageNumRegex.exec(html)) !== null) {
        var p = parseInt(numMatch[1]);
        if (p > totalPages) totalPages = p;
    }

    return JSON.stringify({
        items: movies,
        pagination: {
            currentPage: currentPage,
            totalPages: totalPages || 1,
            totalItems: movies.length,
            itemsPerPage: 20
        }
    });
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    try {
        // Extract title
        var titleMatch = html.match(/<h1[^>]*class="[^"]*(?:movie_name|entry-title)[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
        var title = titleMatch ? PluginUtils.cleanText(titleMatch[1]) : "";

        // Extract other name
        var otherNameMatch = html.match(/<p[^>]*class="[^"]*org_title[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
        var otherName = otherNameMatch ? PluginUtils.cleanText(otherNameMatch[1]) : "";
        if (otherName && title) {
            title += " (" + otherName + ")";
        }

        // Extract thumbnail/poster
        var poster = "";
        var posterMetaMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
        if (posterMetaMatch) {
            poster = posterMetaMatch[1];
        } else {
            var imgMatch = html.match(/<div class="first">\s*<img src="([^"]+)"/i);
            if (imgMatch) poster = imgMatch[1];
        }

        // Extract description
        var description = "";
        var contentMatch = html.match(/<div[^>]*class="[^"]*(?:entry-content|video-item-info)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
        if (contentMatch) {
            description = PluginUtils.cleanText(contentMatch[1]);
        } else {
            var descMetaMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
            if (descMetaMatch) description = PluginUtils.cleanText(descMetaMatch[1]);
        }

        // Extract year
        var year = 0;
        var yearLinkMatch = html.match(/release\/(\d{4})/i) || html.match(/hl-calendar[^>]*><\/i>\s*<a[^>]*>(\d{4})<\/a>/i);
        if (yearLinkMatch) {
            year = parseInt(yearLinkMatch[1]);
        }

        // Extract rating
        var rating = 0;
        var ratingMatch = html.match(/data-rating="(\d+\.?\d*)"/i) || html.match(/class="halim-rating-score">(\d+\.?\d*)<\/span>/i);
        if (ratingMatch) {
            rating = parseFloat(ratingMatch[1]);
        }

        // Extract genres
        var categories = [];
        var genreRegex = /<a[^>]*rel="category tag"[^>]*>([^<]+)<\/a>/gi;
        var genreMatch;
        while ((genreMatch = genreRegex.exec(html)) !== null) {
            categories.push(PluginUtils.cleanText(genreMatch[1]));
        }
        var category = categories.join(", ");

        // Extract status/latest ep
        var statusMatch = html.match(/<span[^>]*class="[^"]*(?:new-ep|status)[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
        var status = statusMatch ? PluginUtils.cleanText(statusMatch[1]) : "";

        // Extract post_id for AJAX player
        var postIdMatch = html.match(/halim_cfg\s*=\s*\{[^}]*post_id["']?\s*:\s*["']?(\d+)["']?/i)
            || html.match(/post_id["']?\s*:\s*["']?(\d+)["']?/i)
            || html.match(/data-post-id=["'](\d+)["']/i)
            || html.match(/data-post_id=["'](\d+)["']/i)
            || html.match(/class=["'][^"']*postid-(\d+)[^"']*["']/i);
        var postId = postIdMatch ? (postIdMatch[1] || postIdMatch[2]) : "";

        // Parse servers and episodes
        var servers = [];

        // 1. Map server IDs to names from halim-ajax-list-server (VIP 1, VIP 2, etc.)
        var serverMap = {};
        var serverLabelRegex = /<span[^>]*id="server-item-\d+"[^>]*data-subsv-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
        var labelMatch;
        while ((labelMatch = serverLabelRegex.exec(html)) !== null) {
            serverMap[labelMatch[1]] = PluginUtils.cleanText(labelMatch[2]);
        }

        // 2. Find all episode lists (ul#listsv-X)
        var listRegex = /<ul[^>]*id="listsv-(\d+)"[^>]*class="[^"]*halim-list-eps[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi;
        var serverIndex = 1;
        var foundSvIds = {};

        while ((listMatch = listRegex.exec(html)) !== null) {
            var svId = listMatch[1];
            foundSvIds[svId] = true;
            var listHtml = listMatch[2];
            var serverName = serverMap[svId] || "Server " + serverIndex;

            var episodes = [];
            var epRegex = /<li[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/li>/gi;
            var epMatch;

            while ((epMatch = epRegex.exec(listHtml)) !== null) {
                var epUrl = epMatch[1];
                var epInner = epMatch[2];
                var epDisplay = "";

                // Try to get clean ep name from span if exists
                var spanMatch = epInner.match(/<span[^>]*>([\s\S]*?)<\/span>/i);
                if (spanMatch) {
                    epDisplay = PluginUtils.cleanText(spanMatch[1]);
                } else {
                    epDisplay = PluginUtils.cleanText(epInner);
                }

                // Extract slug - this page URL might be something like hoathinh3d.la/xem-phim-abc/tap-1-sv1.html
                var epSlugMatch = epUrl.match(/\/([^\/.]+)\.html/);
                var epSlugRaw = epSlugMatch ? epSlugMatch[1] : epUrl.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "");

                // Remove server suffix like -sv1, -sv2 from slug for player.php API
                var epSlug = epSlugRaw.replace(/-sv\d+$/, "");

                // Special ID for player API: slug|postId|svId
                var specialId = epSlug + "|" + postId + "|" + svId;

                episodes.push({
                    id: specialId,
                    name: "Tập " + epDisplay,
                    slug: epUrl.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "")
                });
            }

            if (episodes.length > 0) {
                // Đảo ngược danh sách: từ tập cũ nhất (1) đến mới nhất
                episodes.reverse();

                servers.push({
                    name: serverName,
                    episodes: episodes
                });
                serverIndex++;
            }
        }

        // 3. Multi-Server Support: Clone episodes for servers loaded via AJAX
        for (var sId in serverMap) {
            if (!foundSvIds[sId] && servers.length > 0) {
                var sName = serverMap[sId];
                // Clone from the first available server's episodes
                var clonedEps = servers[0].episodes.map(function (ep) {
                    var parts = ep.id.split("|");
                    if (parts.length >= 3) {
                        return {
                            id: parts[0] + "|" + parts[1] + "|" + sId,
                            name: ep.name,
                            slug: ep.slug
                        };
                    }
                    return ep;
                });
                servers.push({ name: sName, episodes: clonedEps });
            }
        }

        // Fallback: If no servers parsed by IDs, look for halim-server name blocks
        if (servers.length === 0) {
            var serverBlockRegex = /<div[^>]*class="[^"]*halim-server[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi;
            var blockMatch;
            while ((blockMatch = serverBlockRegex.exec(html)) !== null) {
                var blockHtml = blockMatch[1];
                var svNameMatch = blockHtml.match(/<span[^>]*class="halim-server-name"[^>]*>([\s\S]*?)<\/span>/i);
                var svName = svNameMatch ? PluginUtils.cleanText(svNameMatch[1]) : "Server " + serverIndex;

                var eps = [];
                var epMatchEx = /<li[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/li>/gi;
                var epm;
                while ((epm = epMatchEx.exec(blockHtml)) !== null) {
                    var eUrl = epm[1];
                    var eInner = epm[2];
                    var eDisplay = "";
                    var sMatch = eInner.match(/<span[^>]*>([\s\S]*?)<\/span>/i);
                    eDisplay = sMatch ? PluginUtils.cleanText(sMatch[1]) : PluginUtils.cleanText(eInner);
                    var eSlug = eUrl.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "");
                    eps.push({ id: eSlug, name: "Tập " + eDisplay, slug: eSlug });
                }
                if (eps.length > 0) {
                    // Đảo ngược danh sách: từ tập cũ nhất (1) đến mới nhất
                    eps.reverse();
                    servers.push({ name: svName, episodes: eps });
                    serverIndex++;
                }
            }
        }

        return JSON.stringify({
            id: "",
            title: title,
            posterUrl: poster,
            backdropUrl: poster,
            description: description,
            servers: servers,
            quality: "HD",
            lang: "Vietsub",
            year: year,
            rating: rating,
            casts: "",
            director: "",
            category: category,
            status: status,
            duration: status
        });
    } catch (e) {
        return "null";
    }
}

function parseDetailResponse(html) {
    try {
        if (!html) return "{}";

        var streamUrl = "";
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://hoathinh3d.ai/",
            "Origin": "https://hoathinh3d.ai",
            "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7"
        };

        // Helper to unescape HTML entities and JSON escapes
        var decodeUrl = function (u) {
            if (!u) return "";
            return u.replace(/&amp;/g, "&")
                .replace(/\\\/|\\\\/g, "/")
                .replace(/\\\//g, "/");
        };

        // Strategy 0: Robust JSON extraction
        try {
            var json = null;
            var jsonMatch = html.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    json = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    // Try to clean up junk before/after JSON
                    var cleaned = html.substring(html.indexOf('{'), html.lastIndexOf('}') + 1);
                    json = JSON.parse(cleaned);
                }
            }

            if (json) {
                if (json.file) {
                    streamUrl = decodeUrl(json.file);
                } else if (json.url) {
                    streamUrl = decodeUrl(json.url);
                } else if (json.data && json.data.sources) {
                    // Handle HydraX or other embedded sources
                    var sources = json.data.sources;
                    var iframeM = sources.match(/<iframe[^>]+src="([^"]+)"/i) || sources.match(/src="([^"]+)"/i);
                    if (iframeM) {
                        streamUrl = decodeUrl(iframeM[1]);
                    } else {
                        // Sometimes it's a direct link in sources
                        var linkM = sources.match(/(https?:\/\/[^"'\s]+)/i);
                        if (linkM) streamUrl = decodeUrl(linkM[1]);
                    }
                }
            }
        } catch (e) {
            // If JSON fails, it might be due to junk, try a regex fallback for "file":"..."
            var fileRegex = /"file"\s*:\s*"([^"]+)"/i;
            var fileM = html.match(fileRegex);
            if (fileM) streamUrl = decodeUrl(fileM[1]);
        }

        // Strategy 1: HTML Scrape fallback
        if (!streamUrl) {
            var iframeMatch = html.match(/<iframe[^>]+(?:src|data-src)=["']([^"']+)["']/i);
            if (iframeMatch) {
                streamUrl = decodeUrl(iframeMatch[1]);
                if (streamUrl.indexOf("//") === 0) streamUrl = "https:" + streamUrl;
            }

            if (!streamUrl || streamUrl.indexOf("blob:") !== -1) {
                var mediaMatch = html.match(/(https?:\/\/[^"'\s]+\.(?:m3u8|mp4|mkv)[^"'\s]*)/i);
                if (mediaMatch) streamUrl = decodeUrl(mediaMatch[1]);
            }
        }

        if (streamUrl && streamUrl.indexOf("blob:") === -1) {
            return JSON.stringify({
                url: streamUrl,
                headers: headers,
                subtitles: []
            });
        }

        return "{}";
    } catch (e) {
        return "{}";
    }
}

function parseCategoriesResponse(html) {
    var categories = [];
    var seen = {};

    // Parse from navigation menu
    var categoryRegex = /<a[^>]+href="https:\/\/hoathinh3d\.(?:la|my|ai)\/([^"\/]+)"[^>]*>([^<]+)<\/a>/gi;
    var match;

    while ((match = categoryRegex.exec(html)) !== null) {
        var slug = match[1];
        var name = PluginUtils.cleanText(match[2]);

        // Filter out non-category links
        var excludeList = ["lich-su", "follow", "page", "search", "tag", "author"];
        var isExcluded = false;
        for (var i = 0; i < excludeList.length; i++) {
            if (slug.indexOf(excludeList[i]) !== -1) {
                isExcluded = true;
                break;
            }
        }

        if (!isExcluded && slug && name && !seen[slug]) {
            seen[slug] = true;
            categories.push({
                name: name,
                slug: slug
            });
        }
    }

    return JSON.stringify(categories);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

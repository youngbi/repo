// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "sextop1",
        "name": "Sextop1",
        "version": "1.1.3",
        "baseUrl": "https://sextop1.page",
        "iconUrl": "https://stpaulclinic.vn/vaapp/plugins/sextop1.webp",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "layoutType": "HORIZONTAL"
    });
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Mới cập nhật', slug: 'moi-nhat' },
        { name: 'Diễn viên', slug: 'actresses' },
        { name: 'Vietsub', slug: 'phim-sex-vietsub' },
        { name: 'Không che', slug: 'phim-sex-khong-che' },
        { name: 'JAV HD', slug: 'jav' }
    ]);
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'phim-sex-hay', title: 'Phim Hay', type: 'Horizontal', path: 'the-loai' },
        { slug: 'phim-sex-vietsub', title: 'Việt Sub', type: 'Horizontal', path: 'the-loai' },
        { slug: 'phim-sex-khong-che', title: 'Không Che', type: 'Horizontal', path: 'the-loai' },
        { slug: 'jav', title: 'JAV', type: 'Horizontal', path: 'the-loai' },
        { slug: 'phim-sex-chau-au', title: 'Âu Mỹ', type: 'Horizontal', path: 'the-loai' },
        { slug: 'phim-sex-trung-quoc', title: 'Trung Quốc', type: 'Horizontal', path: 'the-loai' },
        { slug: 'moi-nhat', title: 'Phim Mới Cập Nhật', type: 'Grid', path: '' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [
            { name: 'Mới nhất', value: 'latest' },
            { name: 'Xem nhiều', value: 'views' }
        ],
        category: [
            { name: "JAV HD", value: "jav" },
            { name: "Vietsub", value: "phim-sex-vietsub" },
            { name: "Không Che", value: "phim-sex-khong-che" },
            { name: "Loạn Luân", value: "phim-sex-loan-luan" },
            { name: "Hiếp Dâm", value: "phim-sex-hiep-dam" },
            { name: "Âu Mỹ", value: "phim-sex-chau-au" },
            { name: "Vụng Trộm", value: "phim-sex-vung-trom" },
            { name: "Học Sinh", value: "phim-sex-hoc-sinh" },
            { name: "Gái Xinh", value: "phim-sex-gai-xinh" },
            { name: "Bạo Dâm", value: "bao-dam" },
            { name: "Xnxx", value: "xnxx" },
            { name: "Xvideos", value: "xvideos" },
            { name: "Doggy", value: "doggy" },
            { name: "Bú cu", value: "bu-cu" },
            { name: "Mông to", value: "mong-to" },
            { name: "Vú To", value: "vu-to" }
        ]
    });
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;

    // Prioritize category filter if present
    if (filters.category) {
        return "https://sextop1.page/the-loai/" + filters.category + "?page=" + page;
    }

    if (slug === 'moi-nhat' || !slug) {
        return "https://sextop1.page/?page=" + page;
    }

    if (slug === 'actresses') {
        return "https://sextop1.page/actresses?page=" + page;
    }

    // Handle full URL slugs or relative paths
    if (slug.indexOf("http") === 0) {
        return slug + (slug.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    }

    if (slug.indexOf("/") === 0) {
        return "https://sextop1.page" + slug + (slug.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    }

    return "https://sextop1.page/the-loai/" + slug + "?page=" + page;
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    return "https://sextop1.page/search?k=" + encodeURIComponent(keyword) + "&page=" + page;
}

function getUrlDetail(slug) {
    if (slug.indexOf("http") === 0) return slug;
    if (slug.indexOf("/") === 0) return "https://sextop1.page" + slug;
    return "https://sextop1.page/phim-sex/" + slug;
}

function getUrlCategories() { return "https://sextop1.page/?view=the-loai"; }
function getUrlCountries() { return "https://sextop1.page/"; }
function getUrlYears() { return "https://sextop1.page/"; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    var moviesMap = {};
    // Stricter regex to match class="item" with boundaries (space or quote)
    var parts = html.split(/<div[^>]*class=["'](?:[^"']*\s)?item(?:\s[^"']*)?["'][^>]*>/);

    for (var i = 1; i < parts.length; i++) {
        var itemHtml = parts[i];

        var titleMatch = itemHtml.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
        var title = titleMatch ? titleMatch[1].trim() : "";

        var linkMatch = itemHtml.match(/href="([^"]*\/(phim-sex|actresses)\/([^"\/]+))"/);
        var fullUrl = linkMatch ? linkMatch[1] : "";
        var type = linkMatch ? linkMatch[2] : "";
        var id = linkMatch ? linkMatch[3] : "";

        var slug = type === 'actresses' ? "/actresses/" + id : id;

        var thumbMatch = itemHtml.match(/<img[^>]*src="([^"]+)"/);
        var thumb = thumbMatch ? thumbMatch[1] : "";

        if (slug) {
            var rawTitle = cleanText(title);
            var isActress = slug.indexOf("/actresses/") === 0;

            // Extract labels (e.g., Không Che, Trung Quốc)
            var labels = [];
            var labelsMatch = itemHtml.match(/<div[^>]*class="item__labels"[^>]*>([\s\S]*?)<\/div>/);
            if (labelsMatch) {
                var spanRegex = /<span>([\s\S]*?)<\/span>/g;
                var spanMatch;
                while ((spanMatch = spanRegex.exec(labelsMatch[1])) !== null) {
                    labels.push(cleanText(spanMatch[1]));
                }
            }
            var labelText = isActress ? "Diễn viên" : (labels.length > 0 ? labels.join(" | ") : "Full");

            if (!moviesMap[slug]) {
                moviesMap[slug] = {
                    id: slug,
                    title: rawTitle || "Phim không tiêu đề",
                    posterUrl: thumb,
                    backdropUrl: thumb,
                    year: 0,
                    quality: isActress ? "ACTRESS" : "HD",
                    episode_current: labelText,
                    lang: "Vietsub"
                };
            } else {
                // Merge if duplicate found
                var existing = moviesMap[slug];
                if ((!existing.title || existing.title === "Phim không tiêu đề") && rawTitle) {
                    existing.title = rawTitle;
                }
                if (!existing.posterUrl && thumb) {
                    existing.posterUrl = thumb;
                    existing.backdropUrl = thumb;
                }
                if (labelText !== "Full") {
                    existing.episode_current = labelText;
                }
            }
        }
    }

    var movies = [];
    for (var key in moviesMap) {
        if (moviesMap.hasOwnProperty(key)) {
            movies.push(moviesMap[key]);
        }
    }

    var totalPages = 1;
    var pagesMatch = html.match(/page=(\d+)"[^>]*class="paginator__item__link"/g);
    if (!pagesMatch) pagesMatch = html.match(/class="paginator__item__link"[^>]*page=(\d+)"/g);

    if (pagesMatch) {
        for (var j = 0; j < pagesMatch.length; j++) {
            var pMatch = pagesMatch[j].match(/page=(\d+)/);
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
        var titleMatch = html.match(/<h1[^>]*class="[^"]*heading__title[^"]*"[^>]*>([\s\S]*?)<\/h1>/);
        var title = titleMatch ? titleMatch[1].trim() : "";

        var descMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
        var description = descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "";

        var sourceRegex1 = /class="[^"]*(?:set-player-source|player__cdn)[^"]*"[^>]*data-source="([^"]+)"/g;
        var sourceRegex2 = /data-source="([^"]+)"[^>]*class="[^"]*(?:set-player-source|player__cdn)[^"]*"/g;

        var servers = [];
        var serverMap = {};

        function extractSources(regex, html) {
            var match;
            while ((match = regex.exec(html)) !== null) {
                var url = match[1];
                if (url && !serverMap[url]) {
                    serverMap[url] = true;
                    var name = "Server " + (servers.length + 1);
                    servers.push({
                        name: name,
                        episodes: [{
                            id: url,
                            name: "Full",
                            slug: "full"
                        }]
                    });
                }
            }
        }

        extractSources(sourceRegex1, html);
        extractSources(sourceRegex2, html);





        var thumbMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
        var thumb = thumbMatch ? thumbMatch[1] : "";

        // Extract labels for status
        var labels = [];
        var labelsMatch = html.match(/<div[^>]*class="item__labels"[^>]*>([\s\S]*?)<\/div>/);
        if (labelsMatch) {
            var spanRegex = /<span>([\s\S]*?)<\/span>/g;
            var spanMatch;
            while ((spanMatch = spanRegex.exec(labelsMatch[1])) !== null) {
                labels.push(PluginUtils.cleanText(spanMatch[1]));
            }
        }
        var statusText = labels.length > 0 ? labels.join(" | ") : "Full";

        return JSON.stringify({
            id: "", // Kotlin will fill this from slug
            title: PluginUtils.cleanText(title),
            posterUrl: thumb,
            backdropUrl: thumb,
            description: PluginUtils.cleanText(description),
            servers: servers,
            quality: "HD",
            lang: "Vietsub",
            year: 0,
            rating: 0,
            casts: "",
            director: "",
            country: "",
            category: "",
            status: statusText
        });
    } catch (e) {
        return "null";
    }
}

function parseDetailResponse(html, fallbackUrl) {
    try {
        var sourceMatch = html.match(/class="[^"]*(?:set-player-source|player__cdn)[^"]*"[^>]*data-source="([^"]+)"/)
            || html.match(/data-source="([^"]+)"[^>]*class="[^"]*(?:set-player-source|player__cdn)[^"]*"/);
        var streamUrl = sourceMatch ? sourceMatch[1] : (fallbackUrl || "");

        return JSON.stringify({
            url: streamUrl.replace(/&amp;/g, "&"),
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://sextop1.page/",
                "Allowed-Domains": "spexliu.top, streamqq.com",
                "Custom-Js": "var attempt=0; var clbInt=setInterval(function(){var b=document.querySelector('.jw-display-icon-display, .jw-display-icon-container, img[src*=\\\"play\\\"], .play-btn, .vjs-big-play-button');if(b){try{b.click();b.style.display='none';clearInterval(clbInt);}catch(e){}}if(attempt++>20)clearInterval(clbInt);},500);"
            },
            subtitles: []
        });
    } catch (e) {
        return JSON.stringify({ url: fallbackUrl || "", headers: {}, subtitles: [] });
    }
}

function parseCategoriesResponse(html) {
    var categories = [];
    // Regex to match <a href=".../the-loai/slug">Name</a>
    // We look for links with /the-loai/ in them
    var regex = /<a[^>]+href="[^"]*\/the-loai\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    var match;
    var seen = {};

    while ((match = regex.exec(html)) !== null) {
        var slug = match[1];
        var name = cleanText(match[2]);

        if (slug && name && !seen[slug]) {
            seen[slug] = true;
            categories.push({
                name: name,
                slug: slug
            });
        }
    }

    // Sort cleanly
    categories.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

    return JSON.stringify(categories);
}
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function cleanText(text) {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

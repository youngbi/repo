// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "phimhdcs",
        "name": "PhimHDCS",
        "version": "1.1.7",
        "baseUrl": "https://phimhdcss.com",
        "iconUrl": "https://phimhdcss.com/favicon.ico",
        "isEnabled": true,
        "playerType": "exoplayer",
        "type": "MOVIE"
    });
}

function log(msg) {
    if (typeof nativeLog !== 'undefined') {
        nativeLog("[PhimHDCS] " + msg);
    } else if (typeof console !== 'undefined' && console.log) {
        console.log("[PhimHDCS] " + msg);
    }
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'top-phim-ngay', title: 'Top Phim Ngày', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'bang-xep-hang', title: 'Phim Đề Cử', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-chieu-rap', title: 'Phim Chiếu Rạp', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-ngan', title: 'Phim Ngắn', type: 'Horizontal', path: 'the-loai' },
        { slug: 'hoat-hinh', title: 'Hoạt Hình', type: 'Horizontal', path: 'the-loai' },
        { slug: 'phim-moi', title: 'Phim Mới Cập Nhật', type: 'Grid', path: 'danh-sach' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Phim mới', slug: 'phim-moi' },
        { name: 'Top phim ngày', slug: 'top-phim-ngay' },
        { name: 'Phim chiếu rạp', slug: 'phim-chieu-rap' },
        { name: 'Phim ngắn', slug: 'phim-ngan' },
        { name: 'Hoạt hình', slug: 'hoat-hinh' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [
            { name: 'Sắp xếp', value: '' },
            { name: 'Mới cập nhật', value: 'update' },
            { name: 'Thời gian đăng', value: 'create' },
            { name: 'Năm sản xuất', value: 'year' },
            { name: 'Lượt xem', value: 'view' }
        ],
        type: [
            { name: 'Phim bộ', value: 'series' },
            { name: 'Phim lẻ', value: 'single' }
        ],
        category: [
            { name: 'Thể loại', value: '' },
            { name: 'Âm Nhạc', value: '16' }, { name: 'Báo Thù', value: '52' }, { name: 'Bí ẩn', value: '13' },
            { name: 'Boyloves', value: '29' }, { name: 'Chiến Tranh', value: '18' }, { name: 'Chính kịch', value: '1' },
            { name: 'Chuyển Thể', value: '28' }, { name: 'Cổ Trang', value: '15' }, { name: 'Dân Quốc', value: '30' },
            { name: 'Đô Thị', value: '35' }, { name: 'Gây Cấn', value: '44' }, { name: 'Gia Đình', value: '3' },
            { name: 'Giả Tưởng', value: '43' }, { name: 'Hài Hước', value: '5' }, { name: 'Hành Động', value: '10' },
            { name: 'Hệ Thống', value: '51' }, { name: 'Hiện Đại', value: '36' }, { name: 'Hình Sự', value: '37' },
            { name: 'Hoạt Hình', value: '4' }, { name: 'Học Đường', value: '20' }, { name: 'Huyền Huyễn', value: '25' },
            { name: 'Khoa Học', value: '17' }, { name: 'Khoa Học Viễn Tưởng', value: '42' }, { name: 'Kinh Di Đồ', value: '12' },
            { name: 'Kỳ Ảo', value: '53' }, { name: 'Lãng Mạn', value: '40' }, { name: 'Lịch Sử', value: '46' },
            { name: 'Netflix', value: '48' }, { name: 'Ngôn Tình', value: '32' }, { name: 'Ngọt Sủng', value: '54' },
            { name: 'Phá Án', value: '11' }, { name: 'Phiêu Lưu', value: '9' }, { name: 'Phim 18+', value: '24' },
            { name: 'Phim ngắn', value: '38' }, { name: 'Tâm Lý', value: '6' }, { name: 'Thần Thoại', value: '23' },
            { name: 'Tiên Hiệp', value: '26' }, { name: 'Tình Cảm', value: '2' }, { name: 'Tội Phạm', value: '39' },
            { name: 'Trọng Sinh', value: '56' }, { name: 'TV Shows', value: '8' }, { name: 'Viễn Tưởng', value: '14' },
            { name: 'Võ Thuật', value: '21' }, { name: 'Xuyên Không', value: '27' }, { name: 'Xuyên Sách', value: '50' },
            { name: 'Y Khoa', value: '31' }
        ],
        country: [
            { name: 'Quốc gia', value: '' },
            { name: 'Thái Lan', value: '1' }, { name: 'Trung Quốc', value: '5' }, { name: 'Hàn Quốc', value: '6' },
            { name: 'Nhật Bản', value: '4' }, { name: 'Âu Mỹ', value: '2' }, { name: 'Hồng Kông', value: '26' },
            { name: 'Đài Loan', value: '22' }, { name: 'Việt Nam', value: '34' }, { name: 'Ấn Độ', value: '8' },
            { name: 'Anh', value: '7' }, { name: 'Pháp', value: '10' }, { name: 'Đức', value: '23' },
            { name: 'Tây Ban Nha', value: '12' }, { name: 'Thổ Nhĩ Kỳ', value: '3' }, { name: 'Nga', value: '18' },
            { name: 'Úc', value: '17' }, { name: 'Canada', value: '13' }, { name: 'Brazil', value: '28' },
            { name: 'Singapore', value: '45' }, { name: 'Philippines', value: '20' }, { name: 'Indonesia', value: '16' }
        ],
        language: [
            { name: 'Ngôn ngữ', value: '' },
            { name: 'Vietsub', value: 'Vietsub' },
            { name: 'Thuyết Minh', value: 'Thuyết Minh' },
            { name: 'Vietsub + Thuyết Minh', value: 'Vietsub + Thuyết Minh' },
            { name: 'Lồng Tiếng', value: 'Lồng Tiếng' }
        ]
    });
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        var baseUrl = "https://phimhdcss.com";

        var hasFilter = filters.sort || filters.category || filters.country || filters.year || filters.type || filters.language;

        if (hasFilter) {
            var params = [];
            if (filters.sort) params.push("filter[sort]=" + filters.sort);
            if (filters.type) params.push("filter[type]=" + filters.type);
            if (filters.category) params.push("filter[category]=" + filters.category);
            if (filters.country) params.push("filter[region]=" + filters.country);
            if (filters.year) params.push("filter[year]=" + filters.year);
            if (filters.language) params.push("filter[language]=" + encodeURIComponent(filters.language));
            if (page > 1) params.push("page=" + page);

            return baseUrl + "/?" + params.join("&");
        }

        var path = "";
        if (slug === 'phim-de-cu') {
            path = "/danh-sach/bang-xep-hang";
        } else if (slug === 'bang-xep-hang' || slug === 'top-phim-ngay' || slug === 'phim-chieu-rap' || slug === 'phim-moi') {
            path = "/danh-sach/" + slug;
        } else {
            path = "/the-loai/" + slug;
        }

        var url = baseUrl + path;
        if (page > 1) {
            url += "?page=" + page;
        }

        return url;
    } catch (e) {
        return "https://phimhdcss.com/danh-sach/phim-moi";
    }
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var url = "https://phimhdcss.com/?search=" + encodeURIComponent(keyword).replace(/%20/g, "+");
    if (page > 1) {
        url += "&page=" + page;
    }
    return url;
}

function getUrlDetail(slug) {
    if (slug.indexOf("http") === 0) return slug;
    var path = slug.startsWith("/") ? slug.substring(1) : slug;
    return "https://phimhdcss.com/" + path;
}

function getUrlCategories() {
    return "https://phimhdcss.com/the-loai";
}

function getUrlCountries() {
    return "https://phimhdcss.com/quoc-gia";
}

function getUrlYears() {
    return "https://phimhdcss.com/nam";
}

// =============================================================================
// HTML PARSERS
// =============================================================================

function parseDynamicFilters(html) {
    var result = {};
    try {
        var parseSelect = function (namePattern) {
            var list = [];
            var selectMatch = new RegExp('<select[^>]+name="' + namePattern + '"[\\s\\S]*?>([\\s\\S]*?)<\\/select>', 'i').exec(html);
            if (selectMatch) {
                var optionsHtml = selectMatch[1];
                var optionPattern = /<option\s+value="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/option>/gi;
                var optMatch;
                while ((optMatch = optionPattern.exec(optionsHtml)) !== null) {
                    var val = optMatch[1];
                    var name = optMatch[2].replace(/<[^>]*>/g, "").trim();
                    if (val && name) list.push({ name: name, value: val });
                }
            }
            return list;
        };

        result.category = parseSelect('filter\\[category\\]');
        result.country = parseSelect('filter\\[region\\]');
        result.language = parseSelect('filter\\[language\\]');
        result.year = parseSelect('filter\\[year\\]');
        result.sort = parseSelect('filter\\[sort\\]');
        result.type = parseSelect('filter\\[type\\]');
    } catch (e) { }
    return result;
}

function parseListResponse(htmlContent) {
    try {
        var movies = [];
        var itemPattern = /<li\s+class="item[^"]*">\s*<span\s+class="label">([^<]+)<\/span>\s*<a\s+href="https:\/\/phimhdcss\.com\/([^"]+)"\s+title="([^"]+)">\s*<img[^>]+src="([^"]+)"[^>]*\/?>[\s\S]*?<div\s+class="name">[\s\S]*?<a[^>]+title="([^"]+)">([^<]+)<\/a>/gi;
        var match;

        while ((match = itemPattern.exec(htmlContent)) !== null) {
            var label = match[1].trim();
            var slug = match[2];
            var title = match[3];
            var posterUrl = match[4];
            var fullTitle = match[5];

            var year = 0;
            var yearMatch = /(\d{4})/.exec(fullTitle);
            if (yearMatch) year = parseInt(yearMatch[1]);

            var episode_current = "";
            var epMatch = /(Tập \d+|Hoàn [tT]ất \(\d+\/\d+\)|Hoàn Tất \(\d+\/\d+\)|Full)/i.exec(label);
            if (epMatch) episode_current = epMatch[1];

            var lang = "";
            var langPart = label.replace(episode_current, "").trim();
            if (langPart.indexOf("+") === 0) langPart = langPart.substring(1).trim();
            lang = langPart || "";

            var quality = "";
            if (label.indexOf('Full') > -1) quality = "Full";
            else if (label.indexOf('HD') > -1) quality = "HD";

            movies.push({
                id: slug,
                title: title,
                posterUrl: posterUrl.indexOf('http') === 0 ? posterUrl : 'https://phimhdcss.com' + posterUrl,
                backdropUrl: posterUrl.indexOf('http') === 0 ? posterUrl : 'https://phimhdcss.com' + posterUrl,
                year: year,
                quality: quality,
                episode_current: episode_current,
                lang: lang
            });
        }

        var totalPages = 1;
        var pagePattern = /<li><a\s+href="[^"]+page=(\d+)">(\d+)<\/a><\/li>/gi;
        var match2;
        while ((match2 = pagePattern.exec(htmlContent)) !== null) {
            var pageNum = parseInt(match2[2]);
            if (pageNum > totalPages) totalPages = pageNum;
        }

        var currentPage = 1;
        var currentPageMatch = /<li><a\s+href="javascript:void\(0\)"\s+class="current">(\d+)<\/a><\/li>/i.exec(htmlContent);
        if (currentPageMatch) currentPage = parseInt(currentPageMatch[1]);

        var filterOptions = parseDynamicFilters(htmlContent);

        return JSON.stringify({
            items: movies,
            pagination: {
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalPages * 20,
                itemsPerPage: 20
            },
            filterOptions: filterOptions
        });
    } catch (error) {
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 } });
    }
}

function parseSearchResponse(htmlContent) {
    return parseListResponse(htmlContent);
}

function parseMovieDetail(htmlContent) {
    try {
        var title = "";
        var titleMatch = /<span\s+class="title"\s+itemprop="name">([^<]+)<\/span>/i.exec(htmlContent);
        if (titleMatch) title = titleMatch[1].trim();

        var originalTitle = "";
        var origMatch = /<span\s+class="real-name">([^<]+)<\/span>/i.exec(htmlContent);
        if (origMatch) originalTitle = origMatch[1].trim();

        var posterUrl = "";
        var posterMatch = /<img\s+itemprop="image"\s+src="([^"]+)"/i.exec(htmlContent);
        if (posterMatch) posterUrl = posterMatch[1];
        if (posterUrl && posterUrl.indexOf('http') !== 0) posterUrl = 'https://phimhdcss.com' + (posterUrl.startsWith('/') ? '' : '/') + posterUrl;

        var description = "";
        var descMatch = /<div\s+class="tab">[\s\S]*?<div\s+style="text-align:\s+justify;">([\s\S]*?)<\/div>/i.exec(htmlContent);
        if (!descMatch) descMatch = /<div\s+style="text-align:\s*justify;">([\s\S]*?)<\/div>/i.exec(htmlContent);
        if (descMatch) description = descMatch[1].replace(/<[^>]*>/g, "").trim();

        function extractInfo(label) {
            var regex = new RegExp('<dt>' + label + ':<\/dt>\\s*<dd>([\\s\\S]*?)<\/dd>', 'i');
            var match = regex.exec(htmlContent);
            if (match) {
                return match[1].replace(/<[^>]*>/g, "").trim();
            }
            return "";
        }

        var director = extractInfo("Đạo diễn");
        var duration = extractInfo("Thời lượng");
        var totalEpisodes = extractInfo("Số tập");
        var statusInfo = extractInfo("Tình trạng");
        var language = extractInfo("Ngôn ngữ");
        var prodYear = extractInfo("Năm sản xuất");
        var countryTag = extractInfo("Quốc gia");

        var year = 0;
        if (prodYear) year = parseInt(prodYear);
        if (!year) {
            var yearMatch = /(\d{4})/.exec(originalTitle);
            if (yearMatch) year = parseInt(yearMatch[1]);
        }

        var rating = 0;
        var ratingMatch = /<span\s+class="average"\s+id="average"\s+itemprop="ratingValue">([^<]+)<\/span>/i.exec(htmlContent);
        if (ratingMatch) rating = parseFloat(ratingMatch[1]);

        var episode_current = "";
        var statusMatch = /<dd\s+class="film-status">[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i.exec(htmlContent);
        if (statusMatch) episode_current = statusMatch[1].replace(/<[^>]*>/g, "").trim();
        if (!episode_current) episode_current = statusInfo;

        var categories = [];
        var catPattern = /<a\s+href="https:\/\/phimhdcss\.com\/the-loai\/[^"]+"\s+tite="([^"]+)">/gi;
        var match;
        while ((match = catPattern.exec(htmlContent)) !== null) categories.push(match[1].trim());
        if (categories.length === 0) {
            catPattern = /<a\s+href="https:\/\/phimhdcss\.com\/the-loai\/[^"]+"\s+title="([^"]+)">/gi;
            while ((match = catPattern.exec(htmlContent)) !== null) categories.push(match[1].trim());
        }

        var countries = [];
        var countryPattern = /<a\s+href="https:\/\/phimhdcss\.com\/quoc-gia\/[^"]+"\s+tite="([^"]+)">/gi;
        while ((match = countryPattern.exec(htmlContent)) !== null) countries.push(match[1].trim());
        if (countries.length === 0 && countryTag) countries.push(countryTag);

        var actors = [];
        var actorPattern = /<a\s+href="https:\/\/phimhdcss\.com\/dien-vien\/[^"]+"\s+tite="Diễn viên ([^"]+)">/gi;
        while ((match = actorPattern.exec(htmlContent)) !== null) actors.push(match[1].trim());
        if (actors.length === 0) {
            actorPattern = /<a\s+href="https:\/\/phimhdcss\.com\/dien-vien\/[^"]+"\s+title="Diễn viên ([^"]+)">/gi;
            while ((match = actorPattern.exec(htmlContent)) !== null) actors.push(match[1].trim());
        }

        // =====================================================================
        // SERVER TABS: Gộp các block cùng ngôn ngữ thành 1 tab duy nhất
        // VD: 2 block "Vietsub" (TikTok + HDC) → 1 tab "Vietsub"
        // Mỗi tập có ids[] để user chọn server khi bấm
        // =====================================================================
        var servers = [];
        var serverMap = {};
        var serverOrder = [];
        var serverPattern = /<div[^>]*class="server-episode-block"[^>]*>[\s\S]*?Danh sách\s*(?:Sever)?\s*([^:]+):[\s\S]*?<div[^>]*class="list-episode[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

        while ((match = serverPattern.exec(htmlContent)) !== null) {
            var serverName = match[1].trim()
                .replace(/^Server\s+/i, '')
                .replace(/^z/i, '')
                .replace(/\s*#\d+$/, '')
                .trim();
            var episodesHtml = match[2];
            var rawEps = [];
            var epPattern = /<a\s+href="([^"]+)"\s+id=['"]no-link['"][\s\S]*?title="([^"]+)"/gi;
            var epMatch;
            while ((epMatch = epPattern.exec(episodesHtml)) !== null) {
                var epUrl = epMatch[1];
                if (epUrl.indexOf('http') !== 0) epUrl = 'https://phimhdcss.com' + (epUrl.startsWith('/') ? '' : '/') + epUrl;
                rawEps.push({ url: epUrl, name: epMatch[2].trim() });
            }
            if (rawEps.length > 0) {
                var firstNum = /Tập\s+(\d+)/i.exec(rawEps[0].name);
                var lastNum = /Tập\s+(\d+)/i.exec(rawEps[rawEps.length - 1].name);
                if (firstNum && lastNum) {
                    if (parseInt(firstNum[1]) > parseInt(lastNum[1])) rawEps.reverse();
                } else {
                    rawEps.reverse();
                }

                if (!serverMap[serverName]) {
                    serverMap[serverName] = [];
                    serverOrder.push(serverName);
                }
                for (var ei = 0; ei < rawEps.length; ei++) {
                    var isDup = false;
                    for (var si = 0; si < serverMap[serverName].length; si++) {
                        if (serverMap[serverName][si].name === rawEps[ei].name) { isDup = true; break; }
                    }
                    if (!isDup) serverMap[serverName].push(rawEps[ei]);
                }
            }
        }

        for (var oi = 0; oi < serverOrder.length; oi++) {
            var sName = serverOrder[oi];
            var mergedEps = serverMap[sName];
            var episodes = [];
            for (var mi = 0; mi < mergedEps.length; mi++) {
                var ep = mergedEps[mi];
                episodes.push({
                    id: ep.url + "|data:server:tiktok",
                    name: ep.name,
                    slug: ep.url,
                    ids: [
                        { name: "TikTok (Nhanh)", url: ep.url + "|data:server:tiktok" },
                        { name: "StreamXemPhimHD (Phụ đề)", url: ep.url + "|data:server:hdc" }
                    ]
                });
            }
            servers.push({ name: sName, episodes: episodes });
        }

        var slug = "";
        var slugMatch = /<link\s+rel="canonical"\s+href="https:\/\/phimhdcss\.com\/([^"\/]+)"/i.exec(htmlContent);
        if (slugMatch) slug = slugMatch[1];

        // Nút Xem Phim (phim lẻ)
        var extraUrl = "";
        var btnPlayMatch = /<a\s+class="btn-see btn btn-danger btn-stream-link"\s+href="([^"]+)"/i.exec(htmlContent);
        if (btnPlayMatch) extraUrl = btnPlayMatch[1];
        if (extraUrl && extraUrl.indexOf('http') !== 0) extraUrl = 'https://phimhdcss.com' + (extraUrl.startsWith('/') ? '' : '/') + extraUrl;

        // Fallback phim lẻ không có block tập phim
        if (servers.length === 0 && extraUrl) {
            servers.push({
                name: "Server #1",
                episodes: [{
                    id: extraUrl + "|data:server:tiktok",
                    name: "Full",
                    slug: extraUrl,
                    ids: [
                        { name: "TikTok (Nhanh)", url: extraUrl + "|data:server:tiktok" },
                        { name: "StreamXemPhimHD (Phụ đề)", url: extraUrl + "|data:server:hdc" }
                    ]
                }]
            });
        }

        var fullDesc = description;
        if (duration) fullDesc += "\nThời lượng: " + duration;
        if (totalEpisodes) fullDesc += "\nSố tập: " + totalEpisodes;
        if (statusInfo) fullDesc += "\nTình trạng: " + statusInfo;

        return JSON.stringify({
            id: slug,
            title: title,
            posterUrl: posterUrl,
            backdropUrl: posterUrl,
            description: fullDesc,
            year: year,
            rating: rating,
            quality: "",
            servers: servers,
            episode_current: episode_current,
            lang: language,
            category: categories.join(", "),
            country: countries.join(", "),
            director: director,
            casts: actors.join(", "),
            extra: extraUrl
        });
    } catch (error) {
        return "null";
    }
}

// =============================================================================
// STREAM RESOLUTION
// =============================================================================

function _decodeBase64(str) {
    try {
        var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var result = '';
        str = String(str).replace(/[^A-Za-z0-9+\/=]/g, '');
        var len = str.length;
        for (var i = 0; i < len; i += 4) {
            var a = lookup.indexOf(str.charAt(i));
            var b = i + 1 < len ? lookup.indexOf(str.charAt(i + 1)) : 0;
            var c = i + 2 < len ? lookup.indexOf(str.charAt(i + 2)) : -1;
            var d = i + 3 < len ? lookup.indexOf(str.charAt(i + 3)) : -1;
            result += String.fromCharCode((a << 2) | (b >> 4));
            if (c !== -1) result += String.fromCharCode(((b & 15) << 4) | (c >> 2));
            if (d !== -1) result += String.fromCharCode(((c & 3) << 6) | d);
        }
        return result;
    } catch (e) { return null; }
}

function _decodeChunksWithSalt(chunks, saltString) {
    var revBase64 = chunks.join('');
    var base64 = revBase64.split('').reverse().join('');
    if (saltString) base64 = base64.replace(saltString, '');
    return _decodeBase64(base64);
}

function _decodeOxData(htmlContent) {
    var saltMatch = /(?:const|let|var)\s+_0xS\s*=\s*["']([^"']+)["']/.exec(htmlContent);
    var salt = saltMatch ? saltMatch[1] : "";

    var oxData = null;
    var realObjMatch = /(?:const|let|var)\s+realObj\s*=\s*JSON\.parse\(\s*atob\(\s*["']([^"']+)["']\s*\)\s*\)/i.exec(htmlContent);
    if (realObjMatch) {
        try {
            var decoded = _decodeBase64(realObjMatch[1]);
            if (decoded) oxData = JSON.parse(decoded);
        } catch (e) {}
    }
    if (!oxData) {
        var dataMatch = /(?:const|let|var)\s+_0xData\s*=\s*(\{[\s\S]*?\})\s*;/.exec(htmlContent);
        if (dataMatch) {
            try {
                var startIdx = dataMatch.index + dataMatch[0].indexOf('{');
                var braceCount = 0, jsonEnd = -1;
                for (var j = startIdx; j < htmlContent.length && j < startIdx + 100000; j++) {
                    if (htmlContent[j] === '{') braceCount++;
                    else if (htmlContent[j] === '}') {
                        braceCount--;
                        if (braceCount === 0) { jsonEnd = j + 1; break; }
                    }
                }
                if (jsonEnd > 0) oxData = JSON.parse(htmlContent.substring(startIdx, jsonEnd));
            } catch (e) {}
        }
    }
    return { oxData: oxData, salt: salt };
}

function parseDetailResponse(htmlContent, pageUrl, datasend) {
    try {
        // Xác định user chọn server nào từ ids[]
        var requested = "";
        if (typeof datasend !== 'undefined' && datasend) {
            requested = String(datasend).toLowerCase().trim();
        }
        if (!requested && pageUrl) {
            var pl = String(pageUrl).toLowerCase();
            if (pl.indexOf("server:hdc") !== -1) requested = "server:hdc";
            else if (pl.indexOf("server:tiktok") !== -1) requested = "server:tiktok";
        }

        log('PHIMHDCS_DEBUG parseDetailResponse requested=' + requested);

        var decoded = _decodeOxData(htmlContent);
        var oxData = decoded.oxData;
        var salt = decoded.salt;

        if (oxData) {
            // Phân loại tất cả server URLs
            var tiktokCandidate = null;
            var hdcCandidate = null;
            var directCandidate = null;

            for (var k in oxData) {
                if (oxData.hasOwnProperty(k) && Array.isArray(oxData[k])) {
                    var candidateUrl = _decodeChunksWithSalt(oxData[k], salt);
                    if (!candidateUrl || candidateUrl.indexOf("http") !== 0) continue;

                    // Unwrap player.php?link= wrapper
                    if (candidateUrl.indexOf("player.php?") !== -1) {
                        var linkParam = /[?&](?:link|url)=([^&]+)/.exec(candidateUrl);
                        if (linkParam) candidateUrl = decodeURIComponent(linkParam[1]);
                    }

                    // Bỏ qua Server NC (streamc.xyz) và server kvp
                    if (candidateUrl.indexOf("streamc.xyz") !== -1 ||
                        candidateUrl.indexOf("kvp") !== -1) {
                        continue;
                    }

                    log('PHIMHDCS_DEBUG server [' + k + ']: ' + candidateUrl);

                    if (candidateUrl.indexOf("tiktok") !== -1 || candidateUrl.indexOf("tk.") !== -1) {
                        if (!tiktokCandidate) tiktokCandidate = { id: k, url: candidateUrl };
                    } else if (candidateUrl.indexOf("streamxemphimhd") !== -1) {
                        if (!hdcCandidate) hdcCandidate = { id: k, url: candidateUrl };
                    } else if (candidateUrl.indexOf(".m3u8") !== -1 || candidateUrl.indexOf(".mp4") !== -1) {
                        if (!directCandidate) directCandidate = { id: k, url: candidateUrl };
                    }
                }
            }

            // Chọn server theo yêu cầu user hoặc ưu tiên mặc định
            var selected = null;
            if (requested === "server:hdc") {
                selected = hdcCandidate || tiktokCandidate || directCandidate;
            } else if (requested === "server:tiktok") {
                selected = tiktokCandidate || hdcCandidate || directCandidate;
            } else {
                // Mặc định: TikTok (nhanh, ổn định) → StreamXemPhimHD → Direct
                selected = tiktokCandidate || hdcCandidate || directCandidate;
            }

            if (selected && selected.url) {
                var playerUrl = selected.url;
                log('PHIMHDCS_DEBUG selected: ' + playerUrl);

                // === LINK TRỰC TIẾP (.m3u8 / .mp4) → Phát native ExoPlayer ===
                if (playerUrl.indexOf(".m3u8") !== -1 || playerUrl.indexOf(".mp4") !== -1) {
                    return JSON.stringify({
                        url: playerUrl,
                        isEmbed: false,
                        mimeType: "application/x-mpegURL",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            "Referer": "https://phimhdcss.com/"
                        },
                        subtitles: []
                    });
                }

                // === STREAMXEMPHIMHD → WebView Sniffer (bypass Cloudflare) ===
                if (playerUrl.indexOf("streamxemphimhd") !== -1) {
                    return JSON.stringify({
                        url: playerUrl,
                        isEmbed: false,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                            "Referer": "https://phimhdcss.com/",
                            "Stream-Regex": ".*(\\.m3u8|\\.mp4|/hls/|master\\.txt).*",
                            "Custom-Js": _buildSnifferJs(),
                            "Block-Ads": "true"
                        },
                        subtitles: []
                    });
                }

                // === TIKTOK / EMBED KHÁC → Embed loop để parseEmbedResponse xử lý ===
                var isTiktok = playerUrl.indexOf("tiktok") !== -1 || playerUrl.indexOf("tk.") !== -1;
                return JSON.stringify({
                    url: playerUrl,
                    isEmbed: true,
                    headers: {
                        "User-Agent": isTiktok
                            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
                            : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Referer": "https://phimhdcss.com/"
                    },
                    subtitles: []
                });
            }

            log("PHIMHDCS_DEBUG: No suitable server found");
            return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
        }

        // Fallback: iframe trực tiếp
        var iframeMatch = htmlContent.match(/<iframe[^>]*src="([^"]+)"/i);
        if (iframeMatch) {
            var embedUrl = iframeMatch[1];
            if (embedUrl.indexOf('//') === 0) embedUrl = "https:" + embedUrl;
            if (embedUrl && embedUrl !== pageUrl && embedUrl.length > 5) {
                if (embedUrl.indexOf("streamc.xyz") === -1 && embedUrl.indexOf("kvp") === -1) {
                    return JSON.stringify({
                        url: embedUrl,
                        isEmbed: true,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            "Referer": "https://phimhdcss.com/"
                        },
                        subtitles: []
                    });
                }
            }
        }

        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    } catch (error) {
        log("PHIMHDCS_ERROR parseDetailResponse: " + error);
        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    }
}

// =============================================================================
// EMBED RESPONSE HANDLER
// =============================================================================

function parseEmbedResponse(htmlContent, url, datasend) {
    try {
        log("parseEmbedResponse url: " + url);

        // --- TIKTOK EMBED ---
        if (url.indexOf("tiktok.phimhdc") !== -1) {
            log("parseEmbedResponse: TikTok embed");
            var iframeMatch = htmlContent.match(/src="([^"]+edgeplayer\.html[^"]+)"/i) || htmlContent.match(/<iframe[^>]+src="([^"]+)"/i);
            if (iframeMatch) {
                var keyMatch = iframeMatch[1].match(/[?&](?:amp;)?key=([a-zA-Z0-9_-]+)/i) || htmlContent.match(/[?&](?:amp;)?key=([a-zA-Z0-9_-]+)/i);
                if (keyMatch) {
                    var key = keyMatch[1];
                    var streamUrl = "https://tiktok.phimhdc.com/video/" + key + "/master.m3u8?delivery=direct";
                    log("parseEmbedResponse: TikTok stream → " + streamUrl);
                    return JSON.stringify({
                        url: streamUrl,
                        isEmbed: false,
                        mimeType: "application/x-mpegURL",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
                            "Referer": "https://tiktok.phimhdc.com/edgeplayer.html?pv=16&key=" + key + "&delivery=direct"
                        },
                        subtitles: []
                    });
                }
            }
            log("parseEmbedResponse: TikTok failed to extract key");
            return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
        }

        // --- STREAMXEMPHIMHD: getVideo JSON response ---
        if (url.indexOf("do=getVideo") !== -1 || (htmlContent.indexOf("securedLink") !== -1 && htmlContent.indexOf("hls") !== -1)) {
            log("parseEmbedResponse: getVideo JSON");
            var jData = JSON.parse(htmlContent);
            var streamUrl = jData.securedLink || jData.videoSource || (jData.videoSources && jData.videoSources.length > 0 ? jData.videoSources[0].file : "");

            var subtitles = [];
            if (datasend) {
                try {
                    var state = JSON.parse(datasend);
                    if (state.subtitles) subtitles = state.subtitles;
                } catch(e) {}
            }

            if (streamUrl) {
                log("parseEmbedResponse: stream → " + streamUrl);
                return JSON.stringify({
                    url: streamUrl,
                    isEmbed: false,
                    mimeType: "application/x-mpegURL",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                        "Referer": "https://play.streamxemphimhd.site/",
                        "Origin": "https://play.streamxemphimhd.site"
                    },
                    subtitles: subtitles
                });
            }
            return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
        }

        // --- STREAMXEMPHIMHD: guard_issue.php JSON response ---
        if (url.indexOf("guard_issue") !== -1) {
            log("parseEmbedResponse: guard_issue");
            var state = {};
            if (datasend) { try { state = JSON.parse(datasend); } catch(e) {} }

            var guardToken = "";
            try { guardToken = JSON.parse(htmlContent).token || ""; } catch(e) {}

            if (!state.embedId) {
                var idParam = /[?&]id=([^&]+)/.exec(url);
                if (idParam) state.embedId = idParam[1];
            }

            if (!guardToken || !state.embedId) {
                log("parseEmbedResponse: guard failed");
                return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
            }

            var videoUrl = "https://play.streamxemphimhd.site/player/index.php?data=" + state.embedId + "&do=getVideo";
            var postBody = "hash=" + encodeURIComponent(state.embedId) + "&r=https%3A%2F%2Fphimhdcss.com%2F&fp_guard=" + encodeURIComponent(guardToken);
            var embedRef = state.embedUrl || ("https://play.streamxemphimhd.site/video/" + state.embedId);

            return JSON.stringify({
                url: videoUrl,
                isEmbed: true,
                postBody: postBody,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": embedRef,
                    "Origin": "https://play.streamxemphimhd.site",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                },
                datasend: JSON.stringify(state),
                subtitles: state.subtitles || []
            });
        }

        // --- STREAMXEMPHIMHD: HTML embed page (depth 1) ---
        if (url.indexOf("streamxemphimhd") !== -1) {
            log("parseEmbedResponse: StreamXemPhimHD HTML embed");
            var embedId = (url.match(/\/video\/([a-zA-Z0-9]+)/) || [])[1];

            // Tìm subtitles
            var subtitles = [];
            var subRe = /\[([^\]]+)\](https?:\/\/[^"',;\s]+)/g;
            var sm;
            while ((sm = subRe.exec(htmlContent)) !== null) {
                subtitles.push({ lang: sm[1].trim(), url: sm[2].trim(), mimeType: "application/x-subrip", isAutoTranslated: false });
            }

            // Unpack JS packer nếu có
            var packerMatch = htmlContent.match(/eval\((function\(p,a,c,k,e,d\)[\s\S]+?split\('\|'\),0,\{\}\))\)/);
            if (packerMatch) {
                try {
                    var unpacked = eval("(" + packerMatch[1] + ")");
                    var fpId = (unpacked.match(/FirePlayer\(\s*["']([^"']+)["']/) || [])[1];
                    if (fpId) embedId = fpId;

                    if (subtitles.length === 0) {
                        var tracksMatch = (unpacked.match(/"tracks"\s*:\s*(\[[\s\S]*?\])/) || [])[1];
                        if (tracksMatch) {
                            var tracks = JSON.parse(tracksMatch);
                            for (var i = 0; i < tracks.length; i++) {
                                if (tracks[i].kind === "captions" && tracks[i].file && tracks[i].label) {
                                    subtitles.push({ lang: tracks[i].label, url: tracks[i].file, mimeType: "application/x-subrip", isAutoTranslated: false });
                                }
                            }
                        }
                    }
                } catch(e) { log("parseEmbedResponse: packer error " + e); }
            }

            if (!embedId) {
                log("parseEmbedResponse: no embedId found");
                return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
            }

            // POST guard_issue.php → depth 2
            var guardUrl = "https://play.streamxemphimhd.site/player/guard_issue.php?id=" + encodeURIComponent(embedId);
            var state = { embedId: embedId, embedUrl: url, subtitles: subtitles };

            return JSON.stringify({
                url: guardUrl,
                isEmbed: true,
                postBody: "t=" + Date.now(),
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": url,
                    "Origin": "https://play.streamxemphimhd.site",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                },
                datasend: JSON.stringify(state),
                subtitles: subtitles
            });
        }

        // --- GENERIC EMBED: tìm iframe lồng hoặc stream link ---
        var iframeMatch = htmlContent.match(/<iframe[^>]*src="([^"]+)"/i);
        if (iframeMatch) {
            var iUrl = iframeMatch[1];
            if (iUrl.indexOf('//') === 0) iUrl = "https:" + iUrl;
            if (iUrl && iUrl !== url && iUrl.length > 5) {
                return JSON.stringify({
                    url: iUrl,
                    isEmbed: true,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Referer": url
                    },
                    subtitles: []
                });
            }
        }

        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    } catch (e) {
        log("parseEmbedResponse error: " + e);
        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    }
}

// =============================================================================
// CATEGORIES / COUNTRIES / YEARS PARSERS
// =============================================================================

function parseCategoriesResponse(htmlContent) {
    try {
        var filters = parseDynamicFilters(htmlContent);
        if (filters.category && filters.category.length > 0) return JSON.stringify(filters.category);
        var categories = [];
        var catPattern = /<a[^>]+href="https:\/\/phimhdcss\.com\/the-loai\/([^"]+)">([^<]+)<\/a>/gi;
        var match;
        while ((match = catPattern.exec(htmlContent)) !== null) {
            var exists = false;
            for (var i = 0; i < categories.length; i++) { if (categories[i].value === match[1]) { exists = true; break; } }
            if (!exists) categories.push({ name: match[2].trim(), value: match[1] });
        }
        return JSON.stringify(categories);
    } catch (e) { return "[]"; }
}

function parseCountriesResponse(htmlContent) {
    try {
        var filters = parseDynamicFilters(htmlContent);
        if (filters.country && filters.country.length > 0) return JSON.stringify(filters.country);
        var countries = [];
        var pattern = /<a[^>]+href="https:\/\/phimhdcss\.com\/quoc-gia\/([^"]+)">([^<]+)<\/a>/gi;
        var match;
        while ((match = pattern.exec(htmlContent)) !== null) {
            var exists = false;
            for (var i = 0; i < countries.length; i++) { if (countries[i].value === match[1]) { exists = true; break; } }
            if (!exists) countries.push({ name: match[2].trim(), value: match[1] });
        }
        return JSON.stringify(countries);
    } catch (e) { return "[]"; }
}

function parseYearsResponse(htmlContent) {
    try {
        var filters = parseDynamicFilters(htmlContent);
        if (filters.year && filters.year.length > 0) return JSON.stringify(filters.year);
        var years = [];
        for (var y = 2026; y >= 2000; y--) years.push({ name: y.toString(), value: y.toString() });
        return JSON.stringify(years);
    } catch (e) { return "[]"; }
}

// =============================================================================
// WEBVIEW SNIFFER JS — Inject vào WebView để bắt stream từ StreamXemPhimHD
// Cloudflare chặn OkHttp → phải load trong WebView → hook fetch/XHR/video tag
// =============================================================================

function _buildSnifferJs() {
    return [
        "(function() {",
        "  'use strict';",
        "  if (window.__SNIFFER_INIT__) return;",
        "  window.__SNIFFER_INIT__ = true;",
        "",
        "  // Block redirect/popup ads",
        "  try {",
        "    var allow = function(u) {",
        "      if (!u) return true;",
        "      var s = String(u).toLowerCase();",
        "      return s.indexOf('streamxemphimhd') !== -1 || s.indexOf('phim') !== -1 ||",
        "             s.indexOf('cloudflare') !== -1 || s.indexOf('blob:') === 0 ||",
        "             s.indexOf('data:') === 0 || s.indexOf('/') === 0 || !s.startsWith('http');",
        "    };",
        "    window.open = function(u) { return allow(u) ? window : null; };",
        "    var oa = window.location.assign;",
        "    window.location.assign = function(u) { if (allow(u) && oa) oa.call(window.location, u); };",
        "    var or = window.location.replace;",
        "    window.location.replace = function(u) { if (allow(u) && or) or.call(window.location, u); };",
        "  } catch(e) {}",
        "",
        "  // Dark background",
        "  try {",
        "    var st = document.createElement('style');",
        "    st.textContent = 'html,body{background:#000!important;color:#fff!important}';",
        "    (document.head || document.documentElement).appendChild(st);",
        "  } catch(e) {}",
        "",
        "  var done = false;",
        "  function dispatch(url, hdrs) {",
        "    if (!url || done) return;",
        "    var s = String(url).trim();",
        "    if (s.indexOf('.m3u8') === -1 && s.indexOf('/hls/') === -1 && s.indexOf('master.txt') === -1 && s.indexOf('.mp4') === -1) return;",
        "    done = true;",
        "    try {",
        "      if (window.SnifferBridge && typeof window.SnifferBridge.play === 'function') {",
        "        window.SnifferBridge.play(s, hdrs ? JSON.stringify(hdrs) : '');",
        "      }",
        "    } catch(e) {}",
        "  }",
        "",
        "  // Hook fetch",
        "  try {",
        "    if (window.fetch) {",
        "      var of = window.fetch;",
        "      window.fetch = function() {",
        "        var a = arguments;",
        "        var ru = (typeof a[0] === 'string') ? a[0] : (a[0] && a[0].url ? a[0].url : '');",
        "        if (ru) dispatch(ru);",
        "        return of.apply(this, a).then(function(res) {",
        "          try {",
        "            if (ru.indexOf('do=getVideo') !== -1 && res && res.clone) {",
        "              res.clone().text().then(function(t) {",
        "                try {",
        "                  var d = JSON.parse(t);",
        "                  var u = d.securedLink || d.videoSource || (d.videoSources && d.videoSources[0] ? d.videoSources[0].file : '');",
        "                  if (u) dispatch(u);",
        "                } catch(e) {}",
        "              }).catch(function(){});",
        "            }",
        "          } catch(e) {}",
        "          return res;",
        "        });",
        "      };",
        "    }",
        "  } catch(e) {}",
        "",
        "  // Hook XMLHttpRequest",
        "  try {",
        "    if (typeof XMLHttpRequest !== 'undefined') {",
        "      var oo = XMLHttpRequest.prototype.open;",
        "      var os = XMLHttpRequest.prototype.send;",
        "      XMLHttpRequest.prototype.open = function(m, u) {",
        "        this._ru = u;",
        "        if (u) dispatch(u);",
        "        return oo.apply(this, arguments);",
        "      };",
        "      XMLHttpRequest.prototype.send = function() {",
        "        var self = this;",
        "        var prev = self.onreadystatechange;",
        "        self.onreadystatechange = function() {",
        "          try {",
        "            if (self.readyState === 4 && self.status === 200 && self._ru && self._ru.indexOf('do=getVideo') !== -1) {",
        "              var d = JSON.parse(self.responseText);",
        "              var u = d.securedLink || d.videoSource || (d.videoSources && d.videoSources[0] ? d.videoSources[0].file : '');",
        "              if (u) dispatch(u);",
        "            }",
        "          } catch(e) {}",
        "          if (prev) return prev.apply(this, arguments);",
        "        };",
        "        return os.apply(this, arguments);",
        "      };",
        "    }",
        "  } catch(e) {}",
        "",
        "  // Scan video elements",
        "  var sc = 0;",
        "  var tm = setInterval(function() {",
        "    if (done || sc++ > 30) { clearInterval(tm); return; }",
        "    try {",
        "      var vs = document.querySelectorAll('video');",
        "      for (var i = 0; i < vs.length; i++) {",
        "        if (vs[i].src) dispatch(vs[i].src);",
        "        var ss = vs[i].querySelectorAll('source');",
        "        for (var j = 0; j < ss.length; j++) { if (ss[j].src) dispatch(ss[j].src); }",
        "      }",
        "    } catch(e) {}",
        "  }, 500);",
        "",
        "})();"
    ].join("\n");
}

// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "phimhdcs",
        "name": "PhimHDCS",
        "version": "1.1.6",
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

        var servers = [];
        // Regex thoáng hơn để bắt được cả trang detail và trang play
        var serverPattern = /<div[^>]*class="server-episode-block"[^>]*>[\s\S]*?Danh sách\s*(?:Sever)?\s*([^:]+):[\s\S]*?<div[^>]*class="list-episode[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

        while ((match = serverPattern.exec(htmlContent)) !== null) {
            var serverName = match[1].trim();
            // Làm sạch tên server: bỏ "Server" ở đầu, bỏ "z" ở đầu (ví dụ zThuyết Minh -> Thuyết Minh), bỏ "#1", "#2" ở cuối
            var cleanServerName = serverName
                .replace(/^Server\s+/i, '')
                .replace(/^z/i, '')
                .replace(/\s*#\d+$/, '')
                .trim();

            var episodesHtml = match[2];
            var episodes = [];
            var epPattern = /<a\s+href="([^"]+)"\s+id=['"]no-link['"][\s\S]*?title="([^"]+)"/gi;
            var epMatch;
            while ((epMatch = epPattern.exec(episodesHtml)) !== null) {
                var epUrl = epMatch[1];
                if (epUrl.indexOf('http') !== 0) epUrl = 'https://phimhdcss.com' + (epUrl.startsWith('/') ? '' : '/') + epUrl;

                episodes.push({
                    id: epUrl,
                    name: epMatch[2].trim(),
                    slug: epUrl
                });
            }
            if (episodes.length > 0) {
                // Kiểm tra nếu tập đầu tiên có số lớn hơn tập cuối thì đảo ngược
                // Hoặc luôn đảo ngược nếu trang web để mới nhất lên đầu
                var firstEpNumMatch = /Tập\s+(\d+)/i.exec(episodes[0].name);
                var lastEpNumMatch = /Tập\s+(\d+)/i.exec(episodes[episodes.length - 1].name);

                if (firstEpNumMatch && lastEpNumMatch) {
                    if (parseInt(firstEpNumMatch[1]) > parseInt(lastEpNumMatch[1])) {
                        episodes.reverse();
                    }
                } else {
                    // Mặc định đảo ngược nếu không parse được số, vì PhimHDCS thường để tập mới nhất lên đầu
                    episodes.reverse();
                }

                servers.push({ name: cleanServerName, episodes: episodes });
            }
        }

        var slug = "";
        var slugMatch = /<link\s+rel="canonical"\s+href="https:\/\/phimhdcss\.com\/([^"\/]+)"/i.exec(htmlContent);
        if (slugMatch) slug = slugMatch[1];

        // --- NEW LOGIC: Play Button for extra episodes ---
        var extraUrl = "";
        var btnPlayMatch = /<a\s+class="btn-see btn btn-danger btn-stream-link"\s+href="([^"]+)"/i.exec(htmlContent);
        if (btnPlayMatch) extraUrl = btnPlayMatch[1];
        if (extraUrl && extraUrl.indexOf('http') !== 0) extraUrl = 'https://phimhdcss.com' + (extraUrl.startsWith('/') ? '' : '/') + extraUrl;

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
            extra: extraUrl // Gửi thêm link xem phim
        });
    } catch (error) {
        return "null";
    }
}

function parseDetailResponse(htmlContent, pageUrl) {
    try {
        var decodeBase64 = function (str) {
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
        };

        var makeResult = function (playerUrl) {
            return JSON.stringify({
                url: playerUrl,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "https://phimhdcss.com/"
                },
                subtitles: []
            });
        };


        // Helper: decode chunks with salt removal → base64 decode
        var decodeChunksWithSalt = function (chunks, saltString) {
            var revBase64 = chunks.join('');
            var base64 = revBase64.split('').reverse().join('');
            if (saltString) base64 = base64.replace(saltString, '');
            return decodeBase64(base64);
        };

        // --- Extract salt (_0xS) used across all methods ---
        var saltMatch = /(?:const|let|var)\s+_0xS\s*=\s*["']([^"']+)["']/.exec(htmlContent);
        var saltString = saltMatch ? saltMatch[1] : "";

        // =====================================================================
        // NEW DECODING LOGIC: Try to extract realObj (Base64 JSON containing real links)
        // =====================================================================
        var oxData = null;
        var realObjMatch = /(?:const|let|var)\s+realObj\s*=\s*JSON\.parse\(\s*atob\(\s*["']([^"']+)["']\s*\)\s*\)/i.exec(htmlContent);
        
        if (realObjMatch) {
            try {
                var decodedRealObj = decodeBase64(realObjMatch[1]);
                if (decodedRealObj) {
                    oxData = JSON.parse(decodedRealObj);
                    log('PHIMHDCS_DEBUG Found realObj in JS code successfully');
                }
            } catch (e) {
                log('PHIMHDCS_DEBUG realObj parse error: ' + e);
            }
        }

        // Fallback: extract _0xData from HTML if realObj not found (older behavior or simple movies)
        if (!oxData) {
            var dataMatch = /(?:const|let|var)\s+_0xData\s*=\s*(\{[\s\S]*?\})\s*;/.exec(htmlContent);
            if (dataMatch) {
                try {
                    var startIdx = dataMatch.index + dataMatch[0].indexOf('{');
                    var braceCount = 0;
                    var jsonEnd = -1;
                    for (var j = startIdx; j < htmlContent.length && j < startIdx + 100000; j++) {
                        if (htmlContent[j] === '{') braceCount++;
                        else if (htmlContent[j] === '}') {
                            braceCount--;
                            if (braceCount === 0) { jsonEnd = j + 1; break; }
                        }
                    }
                    if (jsonEnd > 0) {
                        var jsonStr = htmlContent.substring(startIdx, jsonEnd);
                        oxData = JSON.parse(jsonStr);
                        log('PHIMHDCS_DEBUG Found fallback _0xData successfully');
                    }
                } catch (e) {
                    log('PHIMHDCS_DEBUG _0xData parse error: ' + e);
                }
            }
        }

        if (oxData) {
            // Helper: decode chunks for a key
            var decodeKey = function (key) {
                if (key && oxData[key] && Array.isArray(oxData[key])) {
                    var u = decodeChunksWithSalt(oxData[key], saltString);
                    if (u && u.indexOf("player.php?") !== -1) {
                        var m = /[?&](?:link|url)=([^&]+)/.exec(u);
                        if (m) u = decodeURIComponent(m[1]);
                    }
                    return u;
                }
                return null;
            };

            // Extract curId (current episode ID)
            var curId = null;
            var curIdPatterns = [
                /class="[^"]*streaming-server[^"]*active[^"]*"[^>]*data-id="(\d+)"/i,
                /class="[^"]*active[^"]*streaming-server[^"]*"[^>]*data-id="(\d+)"/i,
                /data-id="(\d+)"[^>]*class="[^"]*streaming-server[^"]*active/i,
                /data-id="(\d+)"[^>]*class="[^"]*active[^"]*streaming-server/i,
                /(?:const|let|var)\s+curId\s*=\s*['"]?(\d+)['"]?/,
                /(?:const|let|var)\s+episode\s*=\s*['"]?(\d+)['"]?/,
                /(?:const|let|var)\s+episode_id\s*=\s*['"]?(\d+)['"]?/,
                /(?:const|let|var)\s+currentEpisodeId\s*=\s*['"]?(\d+)['"]?/
            ];
            for (var pi = 0; pi < curIdPatterns.length; pi++) {
                var m = curIdPatterns[pi].exec(htmlContent);
                if (m) { curId = m[1]; break; }
            }

            var targetId = curId;

            // Fallback: extract episode ID from page URL (e.g. tap-1-747762 → 747762)
            if (!targetId && pageUrl) {
                var urlIdMatch = /(\d{5,})(?:\?|$|#)/.exec(pageUrl);
                if (!urlIdMatch) urlIdMatch = /-(\d{5,})$/.exec(pageUrl);
                if (urlIdMatch && oxData[urlIdMatch[1]]) {
                    targetId = urlIdMatch[1];
                }
            }

            // Fallback: use first key of oxData
            if (!targetId) {
                var keys = [];
                for (var k in oxData) { if (oxData.hasOwnProperty(k)) keys.push(k); }
                if (keys.length > 0) targetId = keys[0];
            }

            // Giải mã tất cả các server có trong oxData để phân loại & chọn server tốt nhất
            var serverMap = {};
            var directServerUrl = null;
            var abyssServerUrl = null;
            var streamXemPhimHdUrl = null;
            var fallbackServerUrl = null;

            for (var serverKey in oxData) {
                if (oxData.hasOwnProperty(serverKey)) {
                    var decodedCandidate = decodeKey(serverKey);
                    if (decodedCandidate && decodedCandidate.indexOf('http') === 0) {
                        serverMap[serverKey] = decodedCandidate;
                        log('PHIMHDCS_DEBUG server candidate [' + serverKey + ']: ' + decodedCandidate);

                        var isCandidateDirect = decodedCandidate.indexOf('.m3u8') !== -1 || decodedCandidate.indexOf('.mp4') !== -1;
                        if (isCandidateDirect && !directServerUrl) {
                            directServerUrl = decodedCandidate;
                        } else if ((decodedCandidate.indexOf('abyssplayer.com') !== -1 || decodedCandidate.indexOf('abysscdn.com') !== -1 || decodedCandidate.indexOf('playhydrax.com') !== -1) && !abyssServerUrl) {
                            abyssServerUrl = decodedCandidate;
                        } else if (decodedCandidate.indexOf('streamxemphimhd.site') !== -1 && !streamXemPhimHdUrl) {
                            streamXemPhimHdUrl = decodedCandidate;
                        } else if (!fallbackServerUrl && decodedCandidate.indexOf('tiktok') === -1) {
                            fallbackServerUrl = decodedCandidate;
                        }
                    }
                }
            }

            // Thứ tự ưu tiên phát:
            // 1. Server StreamXemPhimHD (Chứa đầy đủ luồng 1080p + phụ đề Vietsub, English, Chinese)
            // 2. Server AbyssPlayer / Hydrax -> Native HydraxExtractor của VAAPP giải mã tức thì
            // 3. Link stream trực tiếp (.m3u8 / .mp4, từ Server HD kkphimplayer...)
            // 4. Server targetId ban đầu theo URL tập phim
            // 5. Fallback server bất kỳ còn lại
            var chosenUrl = null;
            var chosenIsDirect = false;
            var backupUrl = directServerUrl || abyssServerUrl || fallbackServerUrl || "";

            if (streamXemPhimHdUrl) {
                log('PHIMHDCS_DEBUG selected StreamXemPhimHD stream (with subtitles): ' + streamXemPhimHdUrl);
                chosenUrl = streamXemPhimHdUrl;
                chosenIsDirect = false;
            } else if (abyssServerUrl) {
                log('PHIMHDCS_DEBUG selected AbyssPlayer stream: ' + abyssServerUrl);
                chosenUrl = abyssServerUrl;
                chosenIsDirect = false;
            } else if (directServerUrl) {
                log('PHIMHDCS_DEBUG selected DIRECT m3u8 stream: ' + directServerUrl);
                chosenUrl = directServerUrl;
                chosenIsDirect = true;
            } else if (targetId && serverMap[targetId]) {
                chosenUrl = serverMap[targetId];
                chosenIsDirect = chosenUrl.indexOf('.m3u8') !== -1 || chosenUrl.indexOf('.mp4') !== -1;
            } else if (fallbackServerUrl) {
                chosenUrl = fallbackServerUrl;
                chosenIsDirect = chosenUrl.indexOf('.m3u8') !== -1 || chosenUrl.indexOf('.mp4') !== -1;
            }

            if (chosenUrl) {
                var isStreamXemPhimHd = chosenUrl.indexOf('streamxemphimhd.site') !== -1;
                var chosenHeaders = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": "https://phimhdcss.com/"
                };
                if (isStreamXemPhimHd) {
                    chosenHeaders["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
                    chosenHeaders["Sec-Fetch-Dest"] = "iframe";
                    chosenHeaders["Sec-Fetch-Mode"] = "navigate";
                    chosenHeaders["Sec-Fetch-Site"] = "cross-site";
                }
                return JSON.stringify({
                    url: chosenUrl,
                    isEmbed: !chosenIsDirect,
                    mimeType: chosenIsDirect ? "application/x-mpegURL" : undefined,
                    headers: chosenHeaders,
                    datasend: JSON.stringify({ backupUrl: backupUrl }),
                    subtitles: []
                });
            }
        }

        // Fallback to static iframe check in case they render it directly
        var iframeMatch = htmlContent.match(/<iframe[^>]*src="([^"]+)"/i);
        if (iframeMatch) {
            var embedUrl = iframeMatch[1];
            if (embedUrl.indexOf('//') === 0) embedUrl = "https:" + embedUrl;
            
            // Lọc bỏ wrapper player.php?link= hoặc player.php?url= nếu có trong iframe src
            if (embedUrl.indexOf("player.php?") !== -1) {
                var matchLink = /[?&](?:link|url)=([^&]+)/.exec(embedUrl);
                if (matchLink) {
                    var decodedLink = decodeURIComponent(matchLink[1]);
                    log('PHIMHDCS_DEBUG extracted direct link from player.php in iframe: ' + decodedLink);
                    embedUrl = decodedLink;
                }
            }

            if (embedUrl && embedUrl !== pageUrl && embedUrl.length > 5) {
                var isDirect = embedUrl.indexOf('.m3u8') !== -1 || embedUrl.indexOf('.mp4') !== -1;
                var isStreamXemPhimHd = embedUrl.indexOf('streamxemphimhd.site') !== -1;
                var iframeHeaders = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "https://phimhdcss.com/"
                };
                if (isStreamXemPhimHd) {
                    iframeHeaders["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
                    iframeHeaders["Sec-Fetch-Dest"] = "iframe";
                    iframeHeaders["Sec-Fetch-Mode"] = "navigate";
                    iframeHeaders["Sec-Fetch-Site"] = "cross-site";
                }
                return JSON.stringify({
                    url: embedUrl,
                    isEmbed: !isDirect, // Nếu là link direct m3u8 thì isEmbed = false (dừng loop phát trực tiếp), ngược lại true
                    mimeType: isDirect ? "application/x-mpegURL" : undefined,
                    headers: iframeHeaders,
                    subtitles: []
                });
            }
        }

        // Stop fallback to webpage currentUrl! Return empty player config instead to prevent loading website.
        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });

    } catch (error) {
        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    }
}

function parseCategoriesResponse(htmlContent) {
    try {
        var filters = parseDynamicFilters(htmlContent);
        if (filters.category && filters.category.length > 0) return JSON.stringify(filters.category);

        var categories = [];
        var catPattern = /<a[^>]+href="https:\/\/phimhdcss\.com\/the-loai\/([^"]+)">([^<]+)<\/a>/gi;
        var match;
        while ((match = catPattern.exec(htmlContent)) !== null) {
            var slug = match[1];
            var name = match[2].trim();
            var exists = false;
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].value === slug) { exists = true; break; }
            }
            if (!exists) categories.push({ name: name, value: slug });
        }
        return JSON.stringify(categories);
    } catch (e) { return "[]"; }
}

function parseCountriesResponse(htmlContent) {
    try {
        var filters = parseDynamicFilters(htmlContent);
        if (filters.country && filters.country.length > 0) return JSON.stringify(filters.country);

        var countries = [];
        var countryPattern = /<a[^>]+href="https:\/\/phimhdcss\.com\/quoc-gia\/([^"]+)">([^<]+)<\/a>/gi;
        var match;
        while ((match = countryPattern.exec(htmlContent)) !== null) {
            var slug = match[1];
            var name = match[2].trim();
            var exists = false;
            for (var i = 0; i < countries.length; i++) {
                if (countries[i].value === slug) { exists = true; break; }
            }
            if (!exists) countries.push({ name: name, value: slug });
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

function parseEmbedResponse(htmlContent, url, datasend) {
    try {
        log("parseEmbedResponse input url: " + url);
        
        // --- XỬ LÝ DEPTH 3: Phản hồi từ endpoint getVideo (JSON string chứa stream link) ---
        if (url.indexOf("do=getVideo") !== -1 || (htmlContent.indexOf("securedLink") !== -1 && htmlContent.indexOf("hls") !== -1)) {
            log("parseEmbedResponse processing getVideo JSON response");
            var jData = JSON.parse(htmlContent);
            var streamUrl = "";
            if (jData.securedLink) {
                streamUrl = jData.securedLink;
            } else if (jData.videoSource) {
                streamUrl = jData.videoSource;
            } else if (jData.videoSources && jData.videoSources.length > 0) {
                streamUrl = jData.videoSources[0].file;
            }
            
            // Lấy subtitles được truyền qua datasend (hoặc fallback query parameter)
            var subtitles = [];
            if (datasend) {
                try {
                    var state = JSON.parse(datasend);
                    if (state.subtitles && Array.isArray(state.subtitles)) {
                        subtitles = state.subtitles;
                    }
                } catch (e) {
                    log("parseEmbedResponse parse datasend subtitles error: " + e);
                }
            }
            if (subtitles.length === 0) {
                var subMatch = /[?&]subs=([^&]+)/.exec(url);
                if (subMatch) {
                    try {
                        subtitles = JSON.parse(decodeURIComponent(subMatch[1]));
                    } catch (e) {
                        log("parseEmbedResponse parse subs query parameter error: " + e);
                    }
                }
            }
            
            if (streamUrl) {
                log("parseEmbedResponse found streamUrl: " + streamUrl);
                var pipeHeaders = "Referer=https://play.streamxemphimhd.site/&Origin=https://play.streamxemphimhd.site&Sec-Fetch-Site=cross-site&Sec-Fetch-Mode=cors&Sec-Fetch-Dest=empty";
                var urlWithPipe = streamUrl.indexOf("|") === -1 ? (streamUrl + "|" + pipeHeaders) : streamUrl;
                return JSON.stringify({
                    url: urlWithPipe,
                    isEmbed: false, // Dừng vòng lặp để phát Native
                    mimeType: "application/x-mpegURL",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Referer": "https://play.streamxemphimhd.site/",
                        "Origin": "https://play.streamxemphimhd.site",
                        "Sec-Fetch-Site": "cross-site",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Dest": "empty"
                    },
                    subtitles: subtitles
                });
            } else {
                log("parseEmbedResponse no streamUrl found in JSON");
                var failState = {};
                if (datasend) {
                    try { failState = JSON.parse(datasend); } catch (e) {}
                }
                if (failState.backupUrl) {
                    log("parseEmbedResponse fallback to backupUrl: " + failState.backupUrl);
                    return JSON.stringify({
                        url: failState.backupUrl,
                        isEmbed: false,
                        mimeType: "application/x-mpegURL",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                            "Referer": "https://phimhdcss.com/"
                        },
                        subtitles: subtitles
                    });
                }
                return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
            }
        }

        // --- XỬ LÝ DEPTH 2: Phản hồi từ endpoint guard_issue.php (JSON string chứa token bảo mật) ---
        if (url.indexOf("guard_issue.php") !== -1) {
            log("parseEmbedResponse processing guard_issue JSON response");
            var guardToken = "";
            try {
                var gData = JSON.parse(htmlContent);
                if (gData && gData.token) {
                    guardToken = gData.token;
                }
            } catch (e) {
                log("parseEmbedResponse parse guard_issue JSON error: " + e);
            }

            var state = {};
            if (datasend) {
                try {
                    state = JSON.parse(datasend);
                } catch (e) {}
            }
            if (!state.embedId) {
                var idParamMatch = /[?&]id=([^&]+)/.exec(url);
                if (idParamMatch) state.embedId = idParamMatch[1];
            }

            if (!guardToken || !state.embedId) {
                log("parseEmbedResponse failed to obtain guard token or missing embedId");
                if (state.backupUrl) {
                    log("parseEmbedResponse fallback to backupUrl: " + state.backupUrl);
                    return JSON.stringify({
                        url: state.backupUrl,
                        isEmbed: false,
                        mimeType: "application/x-mpegURL",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                            "Referer": "https://phimhdcss.com/"
                        },
                        subtitles: state.subtitles || []
                    });
                }
                return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
            }

            var videoUrl = "https://play.streamxemphimhd.site/player/index.php?data=" + state.embedId + "&do=getVideo";
            var postBody = "hash=" + encodeURIComponent(state.embedId) + "&r=https%3A%2F%2Fphimhdcss.com%2F&fp_guard=" + encodeURIComponent(guardToken);
            var embedRef = state.embedUrl || ("https://play.streamxemphimhd.site/video/" + state.embedId);

            var headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Referer": embedRef,
                "Origin": "https://play.streamxemphimhd.site",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "X-FP-Guard": guardToken,
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty"
            };

            log("parseEmbedResponse returning POST request to getVideo API with guard token");
            return JSON.stringify({
                url: videoUrl,
                isEmbed: true, // Tiếp tục vòng lặp Depth 3
                postBody: postBody,
                headers: headers,
                datasend: JSON.stringify(state),
                subtitles: state.subtitles || []
            });
        }

        // --- XỬ LÝ DEPTH 1: Phản hồi từ trang embed HTML ban đầu (/video/<id>) ---
        log("parseEmbedResponse processing HTML embed page");
        
        var initialDatasend = {};
        if (datasend) {
            try { initialDatasend = JSON.parse(datasend); } catch (e) {}
        }
        var backupUrl = initialDatasend.backupUrl || "";

        // 1. Trích xuất ID của video từ url
        var embedId = null;
        var idMatch = /\/video\/([a-zA-Z0-9]+)/.exec(url);
        if (idMatch) {
            embedId = idMatch[1];
        }
        
        // 2. Tìm kiếm phụ đề từ biến playerjsSubtitle trong JS HTML
        var subtitles = [];
        var subRegex = /\[([^\]]+)\](https?:\/\/[^"',;\s]+)/g;
        var sm;
        while ((sm = subRegex.exec(htmlContent)) !== null) {
            var label = sm[1].trim();
            var subFile = sm[2].trim();
            subtitles.push({
                lang: label,
                url: subFile,
                mimeType: "application/x-subrip",
                isAutoTranslated: false
            });
        }

        // 3. Tìm kiếm JS packer và giải mã nếu cần lấy ID hoặc subtitles dự phòng
        var match = htmlContent.match(/eval\((function\(p,a,c,k,e,d\)[\s\S]+?split\('\|'\),0,\{\}\))\)/);
        if (match) {
            var innerCode = match[1];
            try {
                var unpacked = eval("(" + innerCode + ")");
                log("parseEmbedResponse unpacked packer successfully");
                
                // Trích xuất ID từ FirePlayer call đề phòng ID từ URL bị sai
                var firePlayerIdMatch = /FirePlayer\(\s*["']([^"']+)["']/.exec(unpacked);
                if (firePlayerIdMatch) {
                    embedId = firePlayerIdMatch[1];
                }
                
                // Trích xuất subtitles nếu chưa có từ playerjsSubtitle
                if (subtitles.length === 0) {
                    var tracksMatch = /"tracks"\s*:\s*(\[[\s\S]*?\])/.exec(unpacked);
                    if (tracksMatch) {
                        var tracks = JSON.parse(tracksMatch[1]);
                        for (var i = 0; i < tracks.length; i++) {
                            var track = tracks[i];
                            if (track.kind === "captions" && track.file && track.label) {
                                subtitles.push({
                                    lang: track.label,
                                    url: track.file,
                                    mimeType: "application/x-subrip",
                                    isAutoTranslated: false
                                });
                            }
                        }
                    }
                }
            } catch (e) {
                log("parseEmbedResponse eval packer error: " + e);
            }
        }

        // Deduplicate subtitles by url
        var seenUrls = {};
        var uniqueSubs = [];
        for (var si = 0; si < subtitles.length; si++) {
            var s = subtitles[si];
            if (s.url && !seenUrls[s.url]) {
                seenUrls[s.url] = true;
                uniqueSubs.push(s);
            }
        }
        subtitles = uniqueSubs;
        
        if (!embedId) {
            log("parseEmbedResponse cannot find embedId");
            if (backupUrl) {
                log("parseEmbedResponse fallback to backupUrl: " + backupUrl);
                return JSON.stringify({
                    url: backupUrl,
                    isEmbed: false,
                    mimeType: "application/x-mpegURL",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                        "Referer": "https://phimhdcss.com/"
                    },
                    subtitles: subtitles
                });
            }
            return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
        }
        
        log("parseEmbedResponse found subtitles: " + subtitles.length);
        
        // 4. Trả về cấu hình POST request đến API guard_issue.php để lấy token bảo mật (Depth 2)
        var guardUrl = "https://play.streamxemphimhd.site/player/guard_issue.php?id=" + encodeURIComponent(embedId);
        var postBody = "t=" + Date.now();
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Referer": url,
            "Origin": "https://play.streamxemphimhd.site",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty"
        };
        
        var state = {
            embedId: embedId,
            embedUrl: url,
            subtitles: subtitles,
            backupUrl: backupUrl
        };

        log("parseEmbedResponse returning POST request to guard_issue.php");
        return JSON.stringify({
            url: guardUrl,
            isEmbed: true, // Tiếp tục vòng lặp Depth 2
            postBody: postBody,
            headers: headers,
            datasend: JSON.stringify(state),
            subtitles: subtitles
        });
        
    } catch (e) {
        log("parseEmbedResponse error: " + e);
        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    }
}

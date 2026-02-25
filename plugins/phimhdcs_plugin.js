// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "phimhdcs",
        "name": "PhimHDCS",
        "version": "1.0.2",
        "baseUrl": "https://phimhdcs.com",
        "iconUrl": "https://phimhdcs.com/favicon.ico",
        "isEnabled": true,
        "type": "MOVIE"
    });
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
        var baseUrl = "https://phimhdcs.com";

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
        return "https://phimhdcs.com/danh-sach/phim-moi";
    }
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var url = "https://phimhdcs.com/?search=" + encodeURIComponent(keyword).replace(/%20/g, "+");
    if (page > 1) {
        url += "&page=" + page;
    }
    return url;
}

function getUrlDetail(slug) {
    if (slug.indexOf("http") === 0) return slug;
    var path = slug.startsWith("/") ? slug.substring(1) : slug;
    return "https://phimhdcs.com/" + path;
}

function getUrlCategories() {
    return "https://phimhdcs.com/the-loai";
}

function getUrlCountries() {
    return "https://phimhdcs.com/quoc-gia";
}

function getUrlYears() {
    return "https://phimhdcs.com/nam";
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
        var itemPattern = /<li\s+class="item[^"]*">\s*<span\s+class="label">([^<]+)<\/span>\s*<a\s+href="https:\/\/phimhdcs\.com\/([^"]+)"\s+title="([^"]+)">\s*<img[^>]+src="([^"]+)"[^>]*\/?>[\s\S]*?<div\s+class="name">[\s\S]*?<a[^>]+title="([^"]+)">([^<]+)<\/a>/gi;
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
                posterUrl: posterUrl.indexOf('http') === 0 ? posterUrl : 'https://phimhdcs.com' + posterUrl,
                backdropUrl: posterUrl.indexOf('http') === 0 ? posterUrl : 'https://phimhdcs.com' + posterUrl,
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
        if (posterUrl && posterUrl.indexOf('http') !== 0) posterUrl = 'https://phimhdcs.com' + (posterUrl.startsWith('/') ? '' : '/') + posterUrl;

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
        var catPattern = /<a\s+href="https:\/\/phimhdcs\.com\/the-loai\/[^"]+"\s+tite="([^"]+)">/gi;
        var match;
        while ((match = catPattern.exec(htmlContent)) !== null) categories.push(match[1].trim());
        if (categories.length === 0) {
            catPattern = /<a\s+href="https:\/\/phimhdcs\.com\/the-loai\/[^"]+"\s+title="([^"]+)">/gi;
            while ((match = catPattern.exec(htmlContent)) !== null) categories.push(match[1].trim());
        }

        var countries = [];
        var countryPattern = /<a\s+href="https:\/\/phimhdcs\.com\/quoc-gia\/[^"]+"\s+tite="([^"]+)">/gi;
        while ((match = countryPattern.exec(htmlContent)) !== null) countries.push(match[1].trim());
        if (countries.length === 0 && countryTag) countries.push(countryTag);

        var actors = [];
        var actorPattern = /<a\s+href="https:\/\/phimhdcs\.com\/dien-vien\/[^"]+"\s+tite="Diễn viên ([^"]+)">/gi;
        while ((match = actorPattern.exec(htmlContent)) !== null) actors.push(match[1].trim());
        if (actors.length === 0) {
            actorPattern = /<a\s+href="https:\/\/phimhdcs\.com\/dien-vien\/[^"]+"\s+title="Diễn viên ([^"]+)">/gi;
            while ((match = actorPattern.exec(htmlContent)) !== null) actors.push(match[1].trim());
        }

        var servers = [];
        // Regex thoáng hơn để bắt được cả trang detail và trang play
        var serverPattern = /<div\s+class="server-episode-block">[\s\S]*?Danh sách\s*(?:Sever)?\s*([^:]+):[\s\S]*?<div\s+class="list-episode">([\s\S]*?)<\/div>/gi;

        while ((match = serverPattern.exec(htmlContent)) !== null) {
            var serverName = match[1].trim();
            var episodesHtml = match[2];
            var episodes = [];
            var epPattern = /<a\s+href="([^"]+)"\s+id=['"]no-link['"][\s\S]*?title="([^"]+)"/gi;
            var epMatch;
            while ((epMatch = epPattern.exec(episodesHtml)) !== null) {
                var epUrl = epMatch[1];
                if (epUrl.indexOf('http') !== 0) epUrl = 'https://phimhdcs.com' + (epUrl.startsWith('/') ? '' : '/') + epUrl;

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

                servers.push({ name: serverName, episodes: episodes });
            }
        }

        var slug = "";
        var slugMatch = /<link\s+rel="canonical"\s+href="https:\/\/phimhdcs\.com\/([^"\/]+)"/i.exec(htmlContent);
        if (slugMatch) slug = slugMatch[1];

        // --- NEW LOGIC: Play Button for extra episodes ---
        var extraUrl = "";
        var btnPlayMatch = /<a\s+class="btn-see btn btn-danger btn-stream-link"\s+href="([^"]+)"/i.exec(htmlContent);
        if (btnPlayMatch) extraUrl = btnPlayMatch[1];
        if (extraUrl && extraUrl.indexOf('http') !== 0) extraUrl = 'https://phimhdcs.com' + (extraUrl.startsWith('/') ? '' : '/') + extraUrl;

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

function parseDetailResponse(htmlContent) {
    try {
        var decodeBase64 = function (str) {
            try {
                if (typeof atob === 'function') return atob(str);
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                var output = '';
                str = String(str).replace(/=+$/, '');
                for (var bc = 0, bs, buffer, idx = 0; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
                    buffer = chars.indexOf(buffer);
                }
                return output;
            } catch (e) { return null; }
        };

        var makeResult = function (playerUrl) {
            return JSON.stringify({
                url: playerUrl,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": "https://phimhdcs.com/"
                },
                subtitles: []
            });
        };

        // --- Step 1: Extract episode ID (flexible: var/let/const, episode/episode_id, quoted or not) ---
        var currentEpId = null;
        var epPatterns = [
            /(?:var|let|const)\s+episode\s*=\s*'(\d+)'/i,
            /(?:var|let|const)\s+episode\s*=\s*"(\d+)"/i,
            /(?:var|let|const)\s+episode\s*=\s*(\d+)\s*;/i,
            /(?:var|let|const)\s+episode_id\s*=\s*'(\d+)'/i,
            /(?:var|let|const)\s+episode_id\s*=\s*"(\d+)"/i,
            /(?:var|let|const)\s+episode_id\s*=\s*(\d+)\s*;/i
        ];
        for (var i = 0; i < epPatterns.length; i++) {
            var epMatch = epPatterns[i].exec(htmlContent);
            if (epMatch) { currentEpId = epMatch[1]; break; }
        }

        // Fallback: extract data-id from active streaming-server button
        if (!currentEpId) {
            var activeMatch = /<a[^>]+class="[^"]*streaming-server[^"]*active[^"]*"[^>]*data-id="(\d+)"/i.exec(htmlContent);
            if (!activeMatch) activeMatch = /<a[^>]+data-id="(\d+)"[^>]*class="[^"]*streaming-server[^"]*active[^"]*"/i.exec(htmlContent);
            if (activeMatch) currentEpId = activeMatch[1];
        }

        // --- Step 2: Try serverLinksChunks (flexible: var/let/const) ---
        if (currentEpId) {
            var chunksPatterns = [
                /(?:var|let|const)\s+serverLinksChunks\s*=\s*(\{[\s\S]*?\})\s*;/i,
                /serverLinksChunks\s*=\s*(\{[\s\S]*?\})\s*;/i
            ];

            for (var ci = 0; ci < chunksPatterns.length; ci++) {
                var chunksMatch = chunksPatterns[ci].exec(htmlContent);
                if (chunksMatch) {
                    try {
                        // Try balanced brace extraction for proper JSON
                        var startIdx = chunksMatch.index + chunksMatch[0].indexOf('{');
                        var braceCount = 0;
                        var jsonEnd = -1;
                        for (var j = startIdx; j < htmlContent.length && j < startIdx + 50000; j++) {
                            if (htmlContent[j] === '{') braceCount++;
                            else if (htmlContent[j] === '}') {
                                braceCount--;
                                if (braceCount === 0) { jsonEnd = j + 1; break; }
                            }
                        }
                        if (jsonEnd > 0) {
                            var jsonStr = htmlContent.substring(startIdx, jsonEnd);
                            var serverLinksChunks = JSON.parse(jsonStr);
                            var chunks = serverLinksChunks[currentEpId];
                            if (chunks && Array.isArray(chunks)) {
                                var revBase64 = chunks.join('');
                                var base64 = revBase64.split('').reverse().join('');
                                var playerUrl = decodeBase64(base64);
                                if (playerUrl && playerUrl.indexOf('http') === 0) {
                                    return makeResult(playerUrl);
                                }
                            }
                        }
                    } catch (e) { }
                }
            }

            // --- Step 3: Search for data-id as a JSON key anywhere in page ---
            var keyPattern = new RegExp('"' + currentEpId + '"\\s*:\\s*\\[([^\\]]+)\\]');
            var keyMatch = keyPattern.exec(htmlContent);
            if (keyMatch) {
                try {
                    var arrStr = '[' + keyMatch[1] + ']';
                    var chunks = JSON.parse(arrStr);
                    if (chunks && Array.isArray(chunks)) {
                        var revBase64 = chunks.join('');
                        var base64 = revBase64.split('').reverse().join('');
                        var playerUrl = decodeBase64(base64);
                        if (playerUrl && playerUrl.indexOf('http') === 0) {
                            return makeResult(playerUrl);
                        }
                    }
                } catch (e) { }
            }
        }

        // --- Step 4: Fallback to data-link attribute (if exists in HTML) ---
        var serverMatch = /<a[^>]+class="[^"]*active[^"]*"[^>]*data-link="([^"]+)"/i.exec(htmlContent);
        if (!serverMatch) serverMatch = /<a[^>]+data-link="([^"]+)"[^>]*class="[^"]*active[^"]*"/i.exec(htmlContent);
        if (!serverMatch) serverMatch = /<a[^>]*data-link="([^"]+)"/i.exec(htmlContent);

        if (serverMatch) {
            var playerUrl = serverMatch[1].trim();
            if (playerUrl && playerUrl.indexOf('${link}') === -1 && playerUrl.indexOf('http') === 0) {
                return makeResult(playerUrl);
            }
        }

        // Fallback: return the episode page URL itself — WebView will load the full page
        // and the page's own JS will render the embed player in #player div
        return "{}";
    } catch (error) { return "{}"; }
}

function parseCategoriesResponse(htmlContent) {
    try {
        var filters = parseDynamicFilters(htmlContent);
        if (filters.category && filters.category.length > 0) return JSON.stringify(filters.category);

        var categories = [];
        var catPattern = /<a[^>]+href="https:\/\/phimhdcs\.com\/the-loai\/([^"]+)">([^<]+)<\/a>/gi;
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
        var countryPattern = /<a[^>]+href="https:\/\/phimhdcs\.com\/quoc-gia\/([^"]+)">([^<]+)<\/a>/gi;
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

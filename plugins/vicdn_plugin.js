var BASEURL = "https://vicdn.cc"; 
var BASEAPI = BASEURL + "/api";
var DEV = true;
function getManifest() {
  return JSON.stringify({
    id: "vicdn",
    name: "Nguồn Vicdn",
    description: "Nguồn phim Vicdn.",
    "version": "1.0",
    info: "Nguồn phim vietsub và thuyết minh mới.\n\n Hỗ trợ lồng tiếng và có tốc độ phát rất nhanh.",
    baseUrl: "https://vicdn.cc",
    iconUrl: "https://vicdn.cc/vicdn.png",
    isEnabled: true,
    "adblock": false,
    type: "MOVIE",
    playerType: "embed",
  });
}


function log(msg) {
  	console.log(msg);
}


function getHomeSections() {
    try {
        var listurl = '[{\"link\":\"/update/\",\"name\":\"Phim Mới\"}]';
        var menulist = buildMenu(listurl, true);
        return JSON.stringify(menulist);
    } catch (e) {
        log("getHomeSections[err]:\n " + e);
        return JSON.stringify([]);
    }
}

function getPrimaryCategories() {
    try {
        var listurl = getLISTmenu();
        var menulist = buildMenu(listurl);
        return JSON.stringify(menulist);
    } catch (e) {
        log("getPrimaryCategories[err]:\n " + e);
        return JSON.stringify([]);
    }
}

function getFilterConfig() {
    try {
        var listurl = getLISTmenu();
        var menulist = buildMenu(listurl);
        return JSON.stringify({
            category: menulist
        });
    } catch (e) {
        log("getFilterConfig[err]:\n " + e);
        return JSON.stringify({ category: [] });
    }
}

// =============================================================================
// HELPER: CURSOR BASE64 ENCODE / DECODE
// =============================================================================
function getUrlList(slug, filtersJson) {
    try {
        log("getUrlList[url]: \n" + slug);

        // 1. Kiểm tra nếu slug là link tuyệt đối (chứa http)
        if (slug && slug.indexOf("http") > -1) {
            if (slug.indexOf("search") > -1 && filtersJson) {
                var fixedJson1 = filtersJson
                    .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                    .replace(/:,/g, ':');
                try {
                    var filtersSearch = JSON.parse(fixedJson1);
                    var pageSearch = parseInt(filtersSearch.page) || 1;

                    if (pageSearch > 1 && slug.indexOf("page=") === -1) {
                        var sepSearch = slug.indexOf("?") > -1 ? "&" : "?";
                        var resSearch = slug + sepSearch + "page=" + pageSearch;
                        log("getUrlList[url]: \n" + resSearch);
                        return resSearch;
                    }
                } catch (jsonErr) {}
            }
            log("getUrlList[url]: \n" + slug);
            return slug;
        }

        var page = 1;
        var path = slug || "";

        // 2. Xử lý an toàn filtersJson cho link tương đối
        if (filtersJson) {
            var fixedJson2 = filtersJson
                .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                .replace(/:,/g, ':');

            try {
                var filters = JSON.parse(fixedJson2);
                page = parseInt(filters.page) || 1;

                if (filters.category) {
                    if (Array.isArray(filters.category) && filters.category.length > 0) {
                        path = filters.category[0].slug;
                    } else if (typeof filters.category === 'string') {
                        path = filters.category;
                    }
                }
            } catch (jsonErr) {}
        }

        // 3. Ghép URL an toàn với BASEURL
        var resultUrl = BASEAPI;
        if (path) {
            resultUrl += (path.indexOf("/") === 0 ? "" : "/") + path;
        }

        // 4. Ghép tham số phân trang page (tự động nhận biết ? hay &)
        if (page > 0 && resultUrl.indexOf("page=") === -1) {
            resultUrl += page;
        }

        // 5. Làm sạch dấu // thừa ở path (giữ nguyên https://)
        var finalUrl = resultUrl.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlList[url]: \n" + finalUrl);
        return finalUrl;

    } catch (e) {
        log("getUrlList[err]:\n " + e);
        if (slug && slug.indexOf("http") > -1) {
            log("getUrlList[url]: \n" + slug);
            return slug;
        }
        var fallback = BASEAPI + (slug ? (slug.indexOf("/") === 0 ? slug : "/" + slug) : "");
        var finalFallback = fallback.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlList[url]: \n" + finalFallback);
        return finalFallback;
    }
}

function getUrlSearch(keyword, filtersJson) {
    try {
        var page = 1;

        // 1. Giải mã filtersJson lấy trang đúng chuẩn hàm gốc
        if (filtersJson) {
            var fixedJson = filtersJson
                .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                .replace(/:,/g, ':');

            try {
                var filters = JSON.parse(fixedJson);
                page = parseInt(filters.page) || 1;
            } catch (jsonErr) {}
        }

        // 2. Khởi tạo URL tìm kiếm kèm cấu trúc /search?lang=vi-VN&q=
        var encodedKeyword = encodeURIComponent(keyword || "");
        var resultUrl = BASEURL + "/?q=" + encodedKeyword;

        // 3. Nếu page > 1 thì nối thêm &page=
        if (page > 1) {
            resultUrl += "&page=" + page;
        }

        var finalUrl = resultUrl.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlSearch[url]: \n" + finalUrl);
        return finalUrl;

    } catch (e) {
        log("getUrlSearch[err]:\n " + e);
        var fallback = BASEURL + "/?q=" + encodeURIComponent(keyword || "");
        var finalFallback = fallback.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlSearch[url]: \n" + finalFallback);
        return finalFallback;
    }
}

function getUrlDetail(slug) {
    try {
        log("getUrlDetail[url]: \n" + slug);
        if (!slug) return "";
        if (slug.indexOf('http') === 0) return slug;
        var detailUrl = BASEURL + "/" + slug;
        log("getUrlDetail[url]: \n" + detailUrl);
        return detailUrl;
    } catch (e) {
        log("getUrlDetail[err]:\n " + e);
        return "";
    }
}

function getUrlCategories() { 
    try {
        log("getUrlCategories[url]: \n" + BASEURL);
        return BASEURL; 
    } catch (e) {
        log("getUrlCategories[err]:\n " + e);
        return "";
    }
}

function getUrlCountries() { 
    try {
        return ""; 
    } catch (e) {
        log("getUrlCountries[err]:\n " + e);
        return "";
    }
}

function getUrlYears() { 
    try {
        return ""; 
    } catch (e) {
        log("getUrlYears[err]:\n " + e);
        return "";
    }
}

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html, $url) {
    try {
        log("parseListResponse[url]: \n" + $url);
        if ($url && $url.indexOf("/?q=") > -1) {
            var script = _$(html).find("script:content('const allData')").html()

            var $obj = script.match(/\[\s*\{[\s\S]*?\}\s*\]/i);
            if ($obj) {
                $data = JSON.parse($obj[0]);
                return domfetch($data, $url);
            }
        } else {
            var $allData = JSON.parse(html)

            return domfetch($allData.data, $url);
        }
    } catch (e) {
        log("parseListResponse[err]:\n " + e);
        return JSON.stringify({
            "items": [{
                "id": $url || "error_url",
                "title": "Lỗi: " + e,
                "posterUrl": "",
                "backdropUrl": ""
            }],
            "pagination": {
                "currentPage": 1,
                "totalPages": 1
            }
        });
    }
}

function parseJSDataIsolated(str) {
    const code = str.replace(/^(const|let|var)\s+\w+\s*=\s*/, '');
    return new Function(`"use strict"; return (${code});`)();
}

function domfetch($data, $url) {
    var items = [];
    if (!$data || !Array.isArray($data)) return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });

    for (var $j = 0; $j < $data.length; $j++) {
        var item = $data[$j];
        if (!item) continue;

        var poster = item.poster || "";
        var posterUrl = poster.indexOf("http") === 0 ? poster : ("https://image.tmdb.org/t/p/w130_and_h195_face/" + poster + ".jpg");

        var banner = item.banner || "";
        var backdropUrl = banner.indexOf("http") === 0 ? banner : ("https://image.tmdb.org/t/p/w533_and_h300_face/" + banner + ".jpg");

        var q = item.type ? String(item.type).toUpperCase() : "HD";

        items.push({
            "id": BASEAPI + "/info/" + item.slug,
            "title": item.vname || "Phim",
            "posterUrl": posterUrl,
            "backdropUrl": backdropUrl,
            "quality": q,
            "episode_current": "Tập " + (item.stt || 1) + "/" + (item.total || 1)
        });
    }

    return JSON.stringify({
        "items": items,
        "pagination": {
            "currentPage": 1,
            "totalPages": 999
        }
    });
}

function parseSearchResponse(html, url) {
    try {
        log("parseSearchResponse[url]: \n" + url);
        return parseListResponse(html, url);
    } catch (e) {
        log("parseSearchResponse[err]:\n " + e);
        return JSON.stringify({
            "items": [],
            "pagination": {
                "currentPage": 1,
                "totalPages": 1
            }
        });
    }
}

function parseMovieDetail(html, url) {
    try {
        log("parseMovieDetail[url]: \n" + url);
        var $jsdata = JSON.parse(html);
        var $data = $jsdata.data || {};
        var lname = $data.vname || "Phim";
        var ldes = $data.content || "";
        var limg = $data.banner || "";
        var lactor = Array.isArray($data.cast) ? $data.cast.join(" - ") : "";
        var lduran = ($data.duration || "") + " phút";
        var status = "Tập " + ($data.stt || 1) + "/" + ($data.total || 1);
        var category = Array.isArray($data.genre) ? $data.genre.join(" - ") : "";
        var episode_current = "Tập " + ($data.stt || 1);
        var year = $data.year || 2026;
        var servers = [];
        var episodes = [];

        if (Array.isArray($data.list_episodes)) {
            for (var $j = 0; $j < $data.list_episodes.length; $j++) {
                var item = $data.list_episodes[$j];
                var split = item.split("|");
                episodes.push({
                    id: url + "?current=" + split[0],
                    name: "Tập " + split[0],
                    slug: "tap-" + split[0]
                });
            }
        }

        servers.push({
            name: "Server",
            episodes: episodes
        });

        return JSON.stringify({
            id: url,
            title: lname,
            posterUrl: limg,
            backdropUrl: limg,
            description: ldes,
            quality: "HD",
            year: year,
            rating: 8.5,
            status: status,
            category: category,
            episode_current: episode_current,
            servers: servers,
            duration: lduran || "",
            casts: lactor || "",
            director: "",
            extra: ""
        });

    } catch (e) {
        log("parseMovieDetail[err]:\n " + e);
        return JSON.stringify({
            id: url || "error",
            title: "error",
            servers: []
        });
    }
}

function parseDetailResponse(html, url) {
  try {
    var $jsdata = JSON.parse(html);
    var $data = $jsdata.data;
    var currentMatch = url ? url.match(/current=(\d+)/i) : null;
    var current = currentMatch ? Number(currentMatch[1]) : 1;
    var stream = url;

    if ($data && Array.isArray($data.list_episodes)) {
        for (var $j = 0; $j < $data.list_episodes.length; $j++) {
            var item = $data.list_episodes[$j];
            var split = item.split("|");
            if (Number(split[0]) == current) {
                stream = split[1] + "?episodes=" + url;
            }
        }
    }

    return JSON.stringify({
      url: stream,
      isEmbed: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: BASEURL
      },
      subtitles: [],
    });
  } catch (e) {
    log("parseDetailResponse[err]:\n " + e);
    return JSON.stringify({
      url: "",
      isEmbed: false,
      headers: {},
      subtitles: [],
    });
  }
}

function sortEpisodesByName(data) { return data; }
function parseCategoriesResponse(apiResponseJson) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function getLISTmenu() {
    return `[{\"link\":\"/type/hoat-hinh/\",\"name\":\"Hoạt Hình\"},{\"link\":\"/type/vien-tuong/\",\"name\":\"Viễn Tưởng\"},{\"link\":\"/type/hinh-su/\",\"name\":\"Hình Sự\"},{\"link\":\"/type/bi-an/\",\"name\":\"Bí Ẩn\"},{\"link\":\"/type/hanh-dong/\",\"name\":\"Hành Động\"}]`;
}

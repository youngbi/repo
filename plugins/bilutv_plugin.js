BASEURL = "https://bilutv.asia";

function getManifest() {
    return JSON.stringify({
        "id": "bilutv",
        "name": "Nguồn Bilutv",
        "description": "Trang xem phim siêu hay.",
        "version": "1.5.1",
        "baseUrl": "https://bilutv.asia",
      	"info":"Nguồn phim Bilutv. Nguồn phim dồi dào khá chất lượng.",
        "iconUrl": "https://bilutv.asia/img/bilutvlogo-ngang.jpg",
        "isEnabled": true,
        "type": "MOVIE",
        "playerType": "auto"
    });
}

function log(msg) {
    if (typeof nativeLog !== 'undefined') {
        nativeLog("[PhimHDCS] " + msg);
    } else if (typeof console !== 'undefined' && console.log) {
        console.log("[PhimHDCS] " + msg);
    }
}
// https://bilutv.asia/danh-sach/phim-moi?page=2
function getHomeSections() {
    try {
        var listurl = `
/the-loai/phim-18@@Phim 18+@@false
/danh-sach/phim-bo@@Phim Bộ@@false
/danh-sach/phim-le@@Phim Lẻ@@false
/danh-sach/phim-moi@@Phim Mới@@true
`;
        var menulist = buildMenu(listurl);
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
// URL GENERATION
// =============================================================================
function getUrlList(slug, filtersJson) {
    try {
        log("getUrlList[url]: \n" + slug);

        var page = 1;
        var path = slug || "";

        // 1. Xử lý an toàn filtersJson nếu có truyền vào
        if (filtersJson) {
            var fixedJson = filtersJson
                .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                .replace(/:,/g, ':');

            try {
                var filters = JSON.parse(fixedJson);
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

        // 2. Kiểm tra nếu path/slug là link tuyệt đối
        if (path && path.indexOf("http") > -1) {
            if (page > 1 && path.indexOf("page=") === -1) {
                var sep = path.indexOf("?") > -1 ? "&" : "?";
                path += sep + "page=" + page;
            }
            log("getUrlList[url]: \n" + path);
            return path;
        }

        // 3. Nối chuỗi URL kết quả từ BASEURL
        var resultUrl = BASEURL;
        if (path) {
            if (!path.startsWith("/") && !resultUrl.endsWith("/")) {
                resultUrl += "/" + path;
            } else {
                resultUrl += path;
            }
        }

        // 4. Ghép tham số trang
        if (page > 1 && resultUrl.indexOf("page=") === -1) {
            var separator = resultUrl.indexOf("?") > -1 ? "&" : "?";
            resultUrl += separator + "page=" + page;
        }

        var finalUrl = resultUrl.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlList[url]: \n" + finalUrl);
        return finalUrl;

    } catch (e) {
        log("getUrlList[err]:\n " + e);
        var fallback = BASEURL + (slug ? (slug.indexOf("http") > -1 ? slug : "/" + slug) : "");
        var resUrl = fallback.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlList[url]: \n" + resUrl);
        return resUrl;
    }
}

function getUrlSearch(keyword, filtersJson) {
    try {
        var page = 1;

        if (filtersJson) {
            var fixedJson = filtersJson
                .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                .replace(/:,/g, ':');

            try {
                var filters = JSON.parse(fixedJson);
                page = parseInt(filters.page) || 1;
            } catch (jsonErr) {}
        }

        var encodedKeyword = encodeURIComponent(keyword || "");
        var resultUrl = BASEURL + "/?search=" + encodedKeyword;

        if (page > 1) {
            resultUrl += "&page=" + page;
        }

        var finalUrl = resultUrl.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlSearch[url]: \n" + finalUrl);
        return finalUrl;

    } catch (e) {
        log("getUrlSearch[err]:\n " + e);
        var fallback = BASEURL + "/?search=" + encodeURIComponent(keyword || "");
        var resUrl = fallback.replace(/([^:]\/)\/+/g, "$1");
        log("getUrlSearch[url]: \n" + resUrl);
        return resUrl;
    }
}

function getUrlDetail(slug) {
    try {
        log("getUrlDetail[url]: \n" + slug);
        if (!slug) return "";
        if (slug.indexOf('http') === 0) return slug;

        var resUrl = BASEURL + "/" + slug;
        log("getUrlDetail[url]: \n" + resUrl);
        return resUrl;
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
    log("parseListResponse[url]: \n" + $url);
    try {
        var items = [];

        _$(html).find(".bs").find("a").each(function () {
            var year = "";
            var lang = "";
            var current = this.find(".epx").text();
            var quality = "HD";
            var href = this.attr("href");
            var title = this.attr("title");
            var src = this.find("img").attr("src");
            if (src.indexOf("http") == -1) {
                src = BASEURL + src;
            }

            if (href && href.indexOf("http") > -1) {
                var cleanThumb = src.replace(/&amp;/g, '&');

                items.push({
                    "id": href,
                    "title": title.trim(),
                    "posterUrl": cleanThumb,
                    "backdropUrl": cleanThumb
                });
            }
        });

        return JSON.stringify({
            "items": items,
            "pagination": {
                "currentPage": 1,
                "totalPages": 999
            }
        });

    } catch (e) {
        log("parseListResponse[err]:\n " + e);
        return JSON.stringify({
            "items": [{
                "id": $url,
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

function parseSearchResponse(html) {
    try {
        return parseListResponse(html);
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

function formatEpisode(numStr) {
    try {
        var num = parseInt(numStr, 10);
        if (isNaN(num)) return "01";
        return num < 10 ? "0" + num : "" + num;
    } catch (e) {
        log("formatEpisode[err]:\n " + e);
        return "01";
    }
}

function parseMovieDetail(html, url) {
    log("parseMovieDetail[url]: \n" + url);
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var year = 2026;
    var direc = "????";
    var cast = "????";
    var status = "????";
    var duration = "1:09:00 | 16 | 16";
    var rating = "????";
    var servers = [{}];
    var $info = "";
    var category = "";
    var country = "";
    var lang = "";
    var streamUrl = "";
    try {
        limg = _$(html).find('meta[property="og:image"]').attr("content");
        if (limg.indexOf("http") == -1) {
            limg = BASEURL + limg;
        }
        lname = _$(html).find('meta[property="og:title"]').attr("content");
        ldes = _$(html).find('div[itemprop="description"]').find("p").text();
        year = _$(html).find('b:content("Năm phát hành")').parent().text().replace("Năm phát hành:",
            "").replace(/\s+/g, "");
        year = Number(year);
        status = _$(html).find('b:content("Status:")').parent().text().replace("Status:", "")
            .replace(/\s\s/g, "");
        duration = _$(html).find('b:content("Thời lượng:")').parent().text().replace("Thời lượng:",
            "").replace(/\s\s/g, "");
        cast = _$(html).find('b:content("Diễn viên:")').parent().text().replace("Diễn viên:", "")
            .replace(/\s\s/g, "");
        direc = _$(html).find('b:content("Đạo diễn:")').parent().text().replace("Đạo diễn:", "")
            .replace(/\s\s/g, "");
        country = _$(html).find('b:content("Quốc gia:")').parent().text().replace("Quốc gia:", "")
            .replace(/\s\s/g, "");
        category = _$(html).find('b:content("Định dạng:")').parent().text().replace("Định dạng:",
            "").replace(/\s\s/g, "");
        lang = _$(html).find('b:content("Chất lượng:")').parent().text().replace(
            /Chất lượng:|\s\s|^\s/g, "");
        servers = [];
        var epiOne = _$(html).find('span:content("Tập đầu")').parent().attr("href");
        var servers = [];
        var epiM3U8 = [];
        var epiEMBED = [];
        var epiEnd = _$(html).find('.epcurlast').text().match(/(\d+)/i);
        var EndNumber = 1;
        if (epiOne) {
            if (epiEnd && epiEnd[1]) {
                EndNumber = Number(epiEnd[1]) + 1;
            }

            for (var $j = 1; $j < EndNumber; $j++) {
                var numberEpi = formatEpisode($j);
                var urlM3U8 = epiOne + "?tapplay=" + numberEpi + "&type=m3u8";
                var urlEMBED = epiOne + "?tapplay=" + numberEpi + "&type=embed";
                var nameEpi = "Tập " + numberEpi;
                var slugEpi = "tap-" + numberEpi;
                epiM3U8.push({
                    id: urlM3U8,
                    name: nameEpi,
                    slug: slugEpi
                });
                epiEMBED.push({
                    id: urlEMBED,
                    name: nameEpi,
                    slug: slugEpi
                });
            }
            servers.push({
                name: "Server M3U8",
                episodes: epiM3U8
            }, {
                name: "Server EMBED",
                episodes: epiEMBED
            });
        } else {
            var epiOne = _$(html).find(".bookmark").attr("href");
            var urlM3U8 = epiOne + "?tapplay=full&type=m3u8";
            var urlEMBED = epiOne + "?tapplay=full&type=embed";
            epiM3U8.push({
                id: urlM3U8,
                name: "Xem Ngay",
                slug: "full"
            });
            epiEMBED.push({
                id: urlEMBED,
                name: "Xem Ngay",
                slug: "full"
            });
            servers.push({
                name: "Server M3U8",
                episodes: epiM3U8
            }, {
                name: "Server EMBED",
                episodes: epiEMBED
            });
        }
        return JSON.stringify({
            id: url,
            title: lname,
            posterUrl: limg,
            backdropUrl: limg,
            description: ldes,
            servers: servers,
            quality: "HD",
            year: year,
            status: status,
            duration: duration,
            casts: cast,
            director: direc,
            country: country,
            category: category,
            lang: lang
        });

    } catch (e) {
        log("parseMovieDetail[err]:\n " + e);
        return JSON.stringify({
            id: lurl,
            title: "Lỗi rồi bạn ơi. Tên miền đã bị đổi",
            posterUrl: limg,
            backdropUrl: limg,
            description: ldes,
            servers: servers,
            quality: "HD",
            year: year,
            status: status,
            duration: duration,
            casts: cast,
            director: direc
        });
    }
}

function parseDetailResponse(html, url) {
    log("parseDetailResponse[url]: \n" + url);
    try {
        var activePage = "";
        var matchType = url.match(/type=(\w+)/);
        var typeVD = matchType ? matchType[1] : "m3u8";

        var matchCurent = url.match(/tapplay=(\d+)/);
        var curentRaw = matchCurent ? matchCurent[1] : "1";
        var curent = formatEpisode(curentRaw);

        if (url.indexOf("full") === -1) {
            var foundActive = false;

            _$(html).find(".episodelist").find("li").each(function (index, el) {
                var link = _$(el).find("a").attr("href");
                var text = _$(el).attr("data-name") || _$(el).text() || "";
                var matchText = text.match(/([0-9]+)/);
                var numberRaw = matchText ? matchText[1] : "1";
                var number = formatEpisode(numberRaw);

                if (number === curent && link) {
                    activePage = link;
                    if (activePage.indexOf("http") === -1) {
                        activePage = BASEURL + (activePage.indexOf("/") === 0 ? "" : "/") +
                            activePage;
                    }
                    activePage += (activePage.indexOf("?") > -1 ? "&" : "?") + "tapplay=" +
                        number + "&type=" + typeVD;
                    foundActive = true;
                }
            });

            if (!foundActive) {
                activePage = url;
            }
        } else {
            activePage = url + (url.indexOf("?") > -1 ? "&" : "?") + "check=false";
        }

        log("parseDetailResponse[url]: \n" + activePage);
        return JSON.stringify({
            "url": activePage,
            "isEmbed": true,
            "headers": {
                "Referer": BASEURL,
                "Origin": BASEURL,
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                "Accept": "*/*",
                "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
                "X-Requested-With": "com.android.chrome"
            },
            "subtitles": []
        });

    } catch (e) {
        log("parseDetailResponse[err]:\n " + e);
        return JSON.stringify({
            "url": url,
            "isEmbed": true,
            "headers": {
                "Referer": BASEURL
            }
        });
    }
}

function parseEmbedResponse(html, url) {
    log("parseEmbedResponse[url]: \n" + url);
    try {
        if (url.toLowerCase().includes(".m3u8")) {
            return JSON.stringify({
                "url": url,
                "isEmbed": false,
                "mimeType": "application/x-mpegURL",
                "headers": {
                    "Referer": BASEURL,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                },
                "subtitles": []
            });
        } else {
            var matchType = url.match(/type=(\w+)/i);
            var $type = matchType ? matchType[1] : "m3u8";

            var streamUrl = "";
            if ($type === "m3u8") {
                streamUrl = _$(html).find('a[data-type="m3u8"]').attr("data-link");
            } else {
                streamUrl = _$(html).find('a[data-type="embed"]').attr("data-link");
            }

            if (!streamUrl) {
                streamUrl = _$(html).find('iframe').attr("src") || _$(html).find('embed').attr(
                    "src") || "";
            }

            log("parseEmbedResponse[url]: \n" + streamUrl);

            var checkepi = "false";
            var typevideo = "true";
            if (url.indexOf("true") > -1) {
                checkepi = "true";
            } else {
                var matchCurent = url.match(/tapplay=(\d+)/);
                var curentRaw = matchCurent ? matchCurent[1] : "1";
                var curent = formatEpisode(curentRaw);

                var titleText = _$(html).find("h2").text() || _$(html).find("h1").text() || "Phim";
                checkepi = titleText.trim() + " - Tập " + curent;
            }
            var customJs = textJS(typevideo, checkepi, url, streamUrl);

            if ($type == "m3u8") {
                return JSON.stringify({
                    "url": streamUrl,
                    "isEmbed": false,
                    "mimeType": "application/x-mpegURL",
                    "headers": {
                        "Referer": BASEURL,
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    },
                    "subtitles": []
                });
            } else {
                return JSON.stringify({
                    "url": streamUrl,
                    "headers": {
                        "Referer": BASEURL,
                        "Origin": BASEURL,
                        "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                        "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                        "Sec-Ch-Ua-Mobile": "?1",
                        "Sec-Ch-Ua-Platform": '"Android"',
                        "Accept": "*/*",
                        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
                        "X-Requested-With": "com.android.chrome",
                        "Custom-Js": customJs.trim()
                    },
                    "subtitles": []
                });
            }
        }

    } catch (e) {
        log("parseEmbedResponse[err]:\n " + e);
        return JSON.stringify({
            url: url,
            headers: {
                "Referer": BASEURL
            }
        });
    }
}

function sortEpisodesByName(data) {
    try {
        data.forEach(server => {
            if (server.episodes && Array.isArray(server.episodes)) {
                server.episodes.sort((a, b) => {
                    const matchA = a.name.match(/Tập\s*(\d+)/i);
                    const matchB = b.name.match(/Tập\s*(\d+)/i);

                    const numA = matchA ? parseInt(matchA[1], 10) : 0;
                    const numB = matchB ? parseInt(matchB[1], 10) : 0;

                    return numA - numB;
                });
            }
        });
        return data;
    } catch (e) {
        log("sortEpisodesByName[err]:\n " + e);
        return data;
    }
}

function parseCategoriesResponse(apiResponseJson) {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function getLISTmenu() {
    return `
/the-loai/short-drama@@Short Drama
/the-loai/co-trang@@Cổ Trang
/the-loai/hai-huoc@@Hài Hước
/the-loai/hinh-su@@Hình Sự
/the-loai/chinh-kich@@Chính kịch
/the-loai/vo-thuat@@Võ Thuật
/the-loai/kinh-di@@Kinh Dị
/the-loai/bi-an@@Bí ẩn
/the-loai/tinh-cam@@Tình Cảm
/the-loai/tam-ly@@Tâm Lý
/the-loai/phieu-luu@@Phiêu Lưu
/the-loai/gia-dinh@@Gia Đình
/the-loai/hoat-hinh@@Hoạt Hình
/the-loai/vien-tuong@@Viễn Tưởng
/the-loai/khoa-hoc@@Khoa Học
/the-loai/the-thao@@Thể Thao
/the-loai/tai-lieu@@Tài Liệu
/the-loai/hanh-dong@@Hành Động
/the-loai/tv-shows@@TV Shows
/the-loai/chien-tranh@@Chiến Tranh
/the-loai/am-nhac@@Âm Nhạc
/the-loai/hoc-duong@@Học Đường
/the-loai/phim-bo@@Phim bộ
/the-loai/gia-tuong@@Giả Tưởng
/the-loai/lang-man@@Lãng Mạn
/the-loai/phim-hai@@Phim Hài
/the-loai/phim-le@@Phim lẻ
/the-loai/khoa-hoc-vien-tuong@@Khoa Học Viễn Tưởng
/the-loai/gay-can@@Gây Cấn
/the-loai/phim-nhac@@Phim Nhạc
/the-loai/tre-em@@Trẻ Em
/the-loai/phim-dang-chieu@@Phim đang chiếu
/the-loai/than-thoai@@Thần Thoại
/the-loai/lich-su@@Lịch Sử
/the-loai/mien-tay@@Miền Tây
/the-loai/phim-18@@Phim 18+
/the-loai/subteam@@Subteam
/the-loai/kinh-dien@@Kinh Điển
/the-loai/phim-ngan@@Phim Ngắn
`;
}

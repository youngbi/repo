// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "ophim",
        "name": "OPhim",
        "version": "1.0.4",
        "baseUrl": "https://ophim1.com",
        "iconUrl": "https://raw.githubusercontent.com/youngbi/repo/main/plugins/ophim.ico",
        "isEnabled": true,
        "type": "MOVIE"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'phim-chieu-rap', title: 'Phim Chiếu Rạp', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-bo', title: 'Phim Bộ', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-le', title: 'Phim Lẻ', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'hoat-hinh', title: 'Hoạt Hình', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'tv-shows', title: 'TV Shows', type: 'Horizontal', path: 'danh-sach' },
        { slug: 'phim-moi', title: 'Phim Mới Cập Nhật', type: 'Grid', path: 'danh-sach' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Phim mới', slug: 'phim-moi' },
        { name: 'Phim bộ', slug: 'phim-bo' },
        { name: 'Phim lẻ', slug: 'phim-le' },
        { name: 'Shows', slug: 'tv-shows' },
        { name: 'Hoạt hình', slug: 'hoat-hinh' },
        { name: 'Phim vietsub', slug: 'phim-vietsub' },
        { name: 'Phim thuyết minh', slug: 'phim-thuyet-minh' },
        { name: 'Phim lồng tiếng', slug: 'phim-long-tien' },
        { name: 'Phim bộ đang chiếu', slug: 'phim-bo-dang-chieu' },
        { name: 'Phim bộ đã hoàn thành', slug: 'phim-bo-hoan-thanh' },
        { name: 'Phim sắp chiếu', slug: 'phim-sap-chieu' },
        { name: 'Subteam', slug: 'subteam' },
        { name: 'Phim chiếu rạp', slug: 'phim-chieu-rap' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [
            { name: 'Mới cập nhật', value: 'update' },
            { name: 'Năm xuất bản', value: 'year' },
            { name: 'Lượt xem', value: 'view' }
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
        var limit = filters.limit || 24; // Default limit

        // Logic ưu tiên: Năm > Danh sách (nhiều thể loại) > Thẻ loại đơn
        var baseUrl = "https://ophim1.com/v1/api";
        var finalPath = "";

        var mainLists = ['phim-le', 'phim-bo', 'hoat-hinh', 'tv-shows', 'phim-chieu-rap', 'phim-moi', 'sap-chieu'];

        // Ưu tiên: Slug gốc (Nếu là danh mục chính hoặc Năm) > Năm Filter > Thể loại Filter
        if (mainLists.indexOf(slug) >= 0) {
            finalPath = "/danh-sach/" + slug;
        } else if (/^\d{4}$/.test(slug)) {
            finalPath = "/nam-phat-hanh/" + slug;
        } else if (filters.year) {
            finalPath = "/nam-phat-hanh/" + filters.year;
        } else if (filters.category) {
            if (filters.category.indexOf(',') > -1) {
                finalPath = "/danh-sach/" + filters.category;
            } else {
                finalPath = "/the-loai/" + filters.category;
            }
        } else if (filters.country) {
            finalPath = "/quoc-gia/" + filters.country;
        } else {
            // Mặc định cho các slug là thể loại đơn lẻ (từ menu home)
            finalPath = "/the-loai/" + slug;
        }

        var url = baseUrl + finalPath + "?page=" + page + "&limit=" + limit;

        // Append supplementary filters (as query params if they weren't used in path)
        // Lưu ý: Nếu đã dùng Year ở path thì không cần append lại, nhưng append dư cũng không sao với một số API.
        // Tuy nhiên, logic lọc chéo của Ophim:
        // /nam-phat-hanh/2024?category=hanh-dong (Lọc phim 2024 có thể loại hành động)
        // /the-loai/hanh-dong?country=han-quoc (Lọc hành động của Hàn Quốc)

        if (filters.category && finalPath.indexOf(filters.category) === -1) {
            url += "&category=" + filters.category;
        }
        if (filters.country && finalPath.indexOf(filters.country) === -1) {
            url += "&country=" + filters.country;
        }
        if (filters.year && finalPath.indexOf(filters.year) === -1) {
            url += "&year=" + filters.year;
        }
        if (filters.sort) {
            url += "&sort_field=" + filters.sort;
        }

        return url;
    } catch (e) {
        return "https://ophim1.com/v1/api/danh-sach/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    return "https://ophim1.com/v1/api/tim-kiem?keyword=" + encodeURIComponent(keyword) + "&page=" + page;
}

function getUrlDetail(slug) {
    return "https://ophim1.com/v1/api/phim/" + slug;
}

function getUrlCategories() { return "https://ophim1.com/v1/api/the-loai"; }
function getUrlCountries() { return "https://ophim1.com/v1/api/quoc-gia"; }
function getUrlYears() { return "https://ophim1.com/v1/api/nam-phat-hanh"; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(apiResponseJson) {
    try {
        var response = JSON.parse(apiResponseJson);
        var data = response.data || {};
        var items = data.items || [];
        var params = data.params || {};
        var pagination = params.pagination || {};

        var movies = items.map(function (item) {
            return {
                id: item.slug,
                title: item.name,
                posterUrl: getImageUrl(item.thumb_url),
                backdropUrl: getImageUrl(item.poster_url),
                year: item.year || 0,
                quality: item.quality || "",
                episode_current: item.episode_current || "",
                lang: item.lang || ""
            };
        });

        return JSON.stringify({
            items: movies,
            pagination: {
                currentPage: pagination.currentPage || 1,
                totalPages: Math.ceil((pagination.totalItems || 0) / (pagination.totalItemsPerPage || 24)),
                totalItems: pagination.totalItems || 0,
                itemsPerPage: pagination.totalItemsPerPage || 24
            }
        });
    } catch (error) {
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
    }
}

function parseSearchResponse(apiResponseJson) {
    return parseListResponse(apiResponseJson);
}

function parseMovieDetail(apiResponseJson) {
    try {
        var response = JSON.parse(apiResponseJson);
        var movie = response.movie || response.data?.item || {};
        var rawEpisodes = response.episodes || response.data?.item?.episodes || [];

        var servers = [];
        rawEpisodes.forEach(function (server) {
            var episodes = [];
            if (server.server_data) {
                server.server_data.forEach(function (ep) {
                    episodes.push({
                        id: ep.link_m3u8 || ep.link_embed,
                        name: ep.name,
                        slug: ep.slug
                    });
                });
            }
            if (episodes.length > 0) {
                servers.push({ name: server.server_name, episodes: episodes });
            }
        });

        var rating = 0;
        if (movie.tmdb && movie.tmdb.vote_average) {
            rating = movie.tmdb.vote_average;
        } else if (movie.imdb && movie.imdb.vote_average) {
            rating = movie.imdb.vote_average;
        }

        var categories = (movie.category || []).map(function (c) { return c.name; }).join(", ");
        var countries = (movie.country || []).map(function (c) { return c.name; }).join(", ");
        var directors = (movie.director || []).join(", ");
        var actors = (movie.actor || []).join(", ");

        var tmdbId = movie.tmdb && movie.tmdb.id ? movie.tmdb.id : "";
        var tmdbSeason = movie.tmdb && movie.tmdb.season ? parseInt(movie.tmdb.season, 10) : 0;
        var tmdbType = movie.tmdb && movie.tmdb.type ? movie.tmdb.type : "";

        return JSON.stringify({
            id: movie.slug,
            title: movie.name,
            originName: movie.origin_name || "",
            posterUrl: getImageUrl(movie.thumb_url),
            backdropUrl: getImageUrl(movie.poster_url),
            description: (movie.content || "").replace(/<[^>]*>/g, ""),
            year: movie.year || 0,
            rating: rating,
            quality: movie.quality || "",
            servers: servers,
            episode_current: movie.episode_current || "",
            lang: movie.lang || "",
            category: categories,
            country: countries,
            director: directors,
            casts: actors,
            tmdbId: String(tmdbId),
            tmdbSeason: tmdbSeason || 0,
            tmdbType: tmdbType || ""
        });
    } catch (error) { return "null"; }
}

function parseDetailResponse(apiResponseJson) {
    try {
        var response = JSON.parse(apiResponseJson);
        var movie = response.movie || response.data?.item || {};
        var episodes = response.episodes || response.data?.item?.episodes || [];

        var streamUrl = "";
        if (episodes.length > 0) {
            var firstServer = episodes[0];
            if (firstServer.server_data && firstServer.server_data.length > 0) {
                streamUrl = firstServer.server_data[0].link_m3u8 || firstServer.server_data[0].link_embed || "";
            }
        }

        return JSON.stringify({
            url: streamUrl,
            headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://ophim1.com" },
            subtitles: []
        });
    } catch (error) { return "{}"; }
}

function parseCategoriesResponse(apiResponseJson) {
    try {
        var response = JSON.parse(apiResponseJson);
        var items = response.data?.items || [];
        return JSON.stringify(items.map(function (i) { return { name: i.name, slug: i.slug }; }));
    } catch (e) { return "[]"; }
}

function parseCountriesResponse(apiResponseJson) {
    try {
        var response = JSON.parse(apiResponseJson);
        var items = response.data?.items || [];
        return JSON.stringify(items.map(function (i) { return { name: i.name, value: i.slug }; }));
    } catch (e) { return "[]"; }
}

function parseYearsResponse(apiResponseJson) {
    try {
        var response = JSON.parse(apiResponseJson);
        var items = response.data?.items || [];
        return JSON.stringify(items.map(function (i) { return { name: i.year.toString(), value: i.year.toString() }; }));
    } catch (e) { return "[]"; }
}

function getImageUrl(path) {
    if (!path) return "";
    if (path.indexOf("http") === 0) return path;
    return "https://img.ophim.live/uploads/movies/" + path;
}

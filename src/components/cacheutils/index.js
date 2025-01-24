function removeSearch(i) {
    i = i.substr(0, i.indexOf("?"));
    const k = i.indexOf("/PTVirtual/charts");
    if (k > 0) i = i.slice(k);
    return i;
}

export async function renderPZApiFromCache() {
    const cache = await caches.open("PTv0-Charts");
    const keys = await cache.keys();
    let tmp = {};
    let assetUrl;
    let qidx;
    let numfor;
    for (const request of keys) {
        const url = request.url;
        const parsed = parseURL(url);
        if (parsed.queryParam) {
            const query = getQueryObject(parsed.queryParam);
            if (query.type) {
                switch (query.type) {
                    case "illustration":
                        if (!url.includes("PTVirtual")) {
                            numfor = parseInt(query.for);
                            if (!isNaN(numfor)) query.for = numfor;
                        }
                        if (!(query.for in tmp)) tmp[query.for] = {};
                        tmp[query.for]["illustration"] = removeSearch(url);
                        break;
                    case "song":
                        query.song = removeSearch(url);
                        if (!url.includes("PTVirtual")) {
                            numfor = parseInt(query.id);
                            if (!isNaN(numfor)) query.id = numfor;
                        }
                        if (!(query.id in tmp)) tmp[query.id] = query;
                        else tmp[query.id] = Object.assign(tmp[query.id], query);
                        break;
                    case "chart":
                        query.chart = removeSearch(url);
                        numfor = parseFloat(query.difficulty);
                        if (!isNaN(numfor)) query.difficulty = numfor;
                        if (!url.includes("PTVirtual")) {
                            numfor = parseInt(query.for);
                            if (!isNaN(numfor)) query.for = numfor;
                            numfor = parseInt(query.id);
                            if (!isNaN(numfor)) query.id = numfor;
                        }
                        if (!(query.for in tmp)) tmp[query.for] = {};
                        if (tmp[query.for].charts) {
                            qidx = tmp[query.for].charts.findIndex(x => x.id === query.id);
                            if (qidx != -1) {
                                tmp[query.for].charts[qidx] = Object.assign(
                                    tmp[query.for].charts[qidx],
                                    query
                                );
                            } else {
                                tmp[query.for].charts.push(query);
                            }
                        } else tmp[query.for].charts = [query];
                        break;
                    case "assets":
                        assetUrl = removeSearch(url);
                        if (!url.includes("PTVirtual")) {
                            numfor = parseInt(query.id);
                            if (!isNaN(numfor)) query.id = numfor;
                            numfor = parseInt(query.for);
                            if (!isNaN(numfor)) query.for = numfor;
                        }
                        if (!(query.for in tmp)) tmp[query.for] = {};
                        if (tmp[query.for].charts) {
                            qidx = tmp[query.for].charts.findIndex(x => x.id === query.id);
                            if (qidx != -1) {
                                tmp[query.for].charts[qidx].assets = assetUrl;
                            } else {
                                tmp[query.for].charts.push({
                                    id: query.id,
                                    assets: assetUrl,
                                });
                            }
                        } else
                            tmp[query.for].charts = [
                                {
                                    id: query.id,
                                    assets: assetUrl,
                                },
                            ];
                }
            }
        }
    }
    return Object.values(tmp);
}

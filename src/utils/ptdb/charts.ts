import openDB from "./openDB";
import { SongMeta, ChartMeta } from "../ptmain/types/SongAndChartMeta";
import PhiZoneAPI, { PhiZoneAPI as api, PZApiResponse } from "../phizone/api";
import ObjectStores from "./ObjectStores";
import { renderPZApiFromCache } from "../../components/cacheutils";
import md5 from "md5";

export enum ChartSource {
    Unknown = 0,
    Local = 1,
    PhiZone = 2,
    PhiTogether = 3,
}
export interface CachedSong {
    id: string | number,
    name: string,
    composer: string,
    illustrator: string,
    from: ChartSource,
    edition?: string | null,
    bpm?: number | null,
    duration?: string | null,
    preview_start?: string | null,
    preview_end?: string | null,
    previewStart?: string | null,
    previewEnd?: string | null,
    songFile: Blob,
    illustrationFile: Blob,
    charts?: ChartMeta<Blob>[],
    origin: SongMeta,
}
export interface CachedChart {
    id: string | number,
    level: string,
    difficulty: number,
    from: ChartSource,
    charter: string,
    notes?: number | null,
    song: string | number,
    chartFile: Blob,
    assetsFile?: ChartAsset[],
    parsedChart?: any, // I have to make it anyscript :(
    md5: string,
    origin: ChartMeta,
}
export interface ChartAsset {
    id: string,
    type: number,
    name: string,
    file: Blob,
}

function parseCustomServerChartId(id: string | number): string | number {
    if (!id) return "";
    if (typeof id === "number") return id;
    if (id.includes("|$|")) id = id.split("|$|")[1];
    return id;
}
function getNoCacheURL(url: string): string {
    if (url.includes("?")) url += "&nocache=nocache";
    else url += "?nocache=nocache";
    return url;
}
function toURLString(arg: string | Response | URL): string {
    let url: string;
    if (arg instanceof Response) url = arg.url;
    else if (arg instanceof URL) url = arg.toString();
    else url = arg;
    return url;
}
async function getExistenceInCache(arg: string | Response | URL): Promise<[Cache, Response | undefined]> {
    const url = toURLString(arg);
    const cache = await window.caches.open("PTv0-Charts");
    return [cache, await cache.match(url, { ignoreSearch: true, ignoreVary: true })];
}
async function deleteInCacheIfCached(arg: string | Response | URL) {
    getExistenceInCache(arg)
        .then(e => {
            if (e[1]) {
                e[0].delete(e[1].url);
            }
        })
}
function deepClone(d: any): any {
    return JSON.parse(JSON.stringify(d));
}

async function haveSong(songId: string) {
    const allCharts = await getAllChartsKeys(ObjectStores.Song);
    return !!allCharts.includes(songId);
}

async function downloadSong(songInfo: SongMeta, songFile?: Blob, illustrationFile?: Blob): Promise<CachedSong> {
    return {
        id: parseCustomServerChartId(songInfo.id),
        name: songInfo.name,
        composer: songInfo.composer,
        illustrator: songInfo.composer,
        from: songInfo.isFromPhiZone ? ChartSource.PhiZone : songInfo.isFromURL ? ChartSource.Unknown : ChartSource.PhiTogether,
        songFile: songFile || await fetch(getNoCacheURL(songInfo.song)).then(f => f.blob()),
        illustrationFile: illustrationFile || await fetch(getNoCacheURL(songInfo.illustration)).then(f => f.blob()),
        origin: deepClone(songInfo),
    }
}
async function downloadChart(chartInfo: ChartMeta, chartFile?: Response | Blob, noSongCallback?: Function): Promise<CachedChart> {
    const songId = parseCustomServerChartId(chartInfo.for || (typeof chartInfo.song === "object" ? chartInfo.song.id : chartInfo.song));
    
    if (await haveSong(songId as string))
        if (noSongCallback)
            try { await noSongCallback(); }
            catch (e) { console.error(e); }
        else if (typeof chartInfo.song === "object")
            await downloadSong(chartInfo.song)
                .then(s => saveCachedSong(s))
                .catch(e => console.error(e));
        else console.log(GetChartFilesError.SongNotFound);

    const source = chartInfo.isFromPhiZone ? ChartSource.PhiZone : chartInfo.isFromURL ? ChartSource.Unknown : ChartSource.PhiTogether;
    const chartBlob: Blob = chartFile ? chartFile instanceof Blob ? chartFile : await chartFile.blob() : await fetch(getNoCacheURL(chartInfo.chart)).then(f => f.blob());
    const assetsFile = source === ChartSource.PhiZone ? await PhiZoneAPI.getChartAssets(chartInfo.id as string) : source === ChartSource.PhiTogether && chartInfo.assets ? [{ id: "0", type: -1, name: "assets.zip", file: await (await fetch(chartInfo.assets)).blob() }] : undefined;

    return {
        id: parseCustomServerChartId(chartInfo.id),
        level: chartInfo.level,
        difficulty: chartInfo.difficulty,
        from: source,
        charter: chartInfo.charter,
        notes: chartInfo.notes,
        song: songId,
        chartFile: chartBlob,
        assetsFile,
        // @ts-ignore
        md5: md5(await new Response(chartBlob).text()),
        origin: deepClone(chartInfo),
    }
}

function deleteCachedSongOrChart(id: string | number | null, name: string): Promise<boolean> | null {
    if (id === null) return null;
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([name], 'readwrite').objectStore(name);
                const getReq = objStore.delete(id);
                getReq.onsuccess = e => res(true);
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
    });
}
function deleteCachedSong(id: string | number | null): Promise<boolean> | null { return deleteCachedSongOrChart(id, ObjectStores.Song) }
function deleteCachedChart(id: string | number | null): Promise<boolean> | null { return deleteCachedSongOrChart(id, ObjectStores.Chart) }

function getCachedChart(id: string | number | null): Promise<CachedChart> | null {
    return new Promise((res, rej) => {
        if (id === null) return null;
        id = parseCustomServerChartId(id);
        openDB()
            .then(db => {
                const objStore = db.transaction([ObjectStores.Chart]).objectStore(ObjectStores.Chart);
                const getReq = objStore.get(id as string | number);
                getReq.onsuccess = e => {
                    const result = getReq.result;
                    if (result) res(result)
                    else rej(e);
                };
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
    });
}
function getCachedSong(id: string | number | null): Promise<CachedSong> {
    return new Promise((res, rej) => {
        if (id === null) return rej(GetChartFilesError.SongIDNotFound);
        id = parseCustomServerChartId(id);
        openDB()
            .then(db => {
                const objStore = db.transaction([ObjectStores.Song]).objectStore(ObjectStores.Song);
                const getReq = objStore.get(id as string | number);
                getReq.onsuccess = e => {
                    const result = getReq.result;
                    if (result) res(result)
                    else rej(e);
                };
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
    });
}

function saveCachedSong(cachedSong: CachedSong): Promise<boolean | any> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([ObjectStores.Song], 'readwrite').objectStore(ObjectStores.Song);
                const getReq = objStore.get(cachedSong.id);
                getReq.onsuccess = e => {
                    if (getReq.result) objStore.put(cachedSong);
                    else objStore.add(cachedSong);
                    res(true);
                };
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
        });
}
function saveCachedChart(cachedChart: CachedChart): Promise<boolean | any> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([ObjectStores.Chart], 'readwrite').objectStore(ObjectStores.Chart);
                const getReq = objStore.get(cachedChart.id);
                getReq.onsuccess = e => {
                    if (getReq.result) objStore.put(cachedChart);
                    else objStore.add(cachedChart);
                    res(true);
                };
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
        });
}

function getSongsIllustrationAsB64(songid: string | number): Promise<string> {
    return new Promise(res => {
        getCachedSong(songid)
            .then(song => {
                const illustration = song.illustrationFile;
                if (!illustration) return res("");

                const reader = new FileReader();
                reader.onload = e => res((e.target as FileReader).result as string);
                reader.readAsDataURL(illustration);
            })
            .catch(e => console.log(e));
    });
}
enum GetChartFilesError {
    Uncaught = "Uncaught Error",
    ChartNotFound = "Chart Not Found",
    SongIDNotFound = "Song ID Not Found",
    SongNotFound = "Song Not Found",
}
function checkLocalChart(chartid: string | number): Promise<Boolean> {
    return new Promise((res) => {
        (getCachedChart(chartid) as Promise<CachedChart>)
        .then(e => {
            res(true);
        })
        .catch(e => res(false));
    });
}
function getChartsFiles(chartid: string | number, songid?: string | number): Promise<[Blob, Blob, Blob, ChartAsset[] | null]> {
    return new Promise((res, rej) => {
        (getCachedChart(chartid) as Promise<CachedChart>)
            .then(async chart => {
                songid = parseCustomServerChartId(chart.song || songid as string | number);
                if (!songid) return rej(GetChartFilesError.SongIDNotFound);

                const songMeta = await getCachedSong(songid)
                    .then(song => song)
                    .catch(e => rej(GetChartFilesError.SongNotFound));
                if (!songMeta) return rej(GetChartFilesError.SongNotFound);

                const { songFile, illustrationFile } = songMeta;
                const { chartFile } = chart;
                if (!songFile || !illustrationFile || !chartFile) return rej(GetChartFilesError.Uncaught);
                res([
                    songFile,
                    illustrationFile,
                    chartFile,
                    chart.assetsFile || null,
                ]);
            })
            .catch(e => rej(GetChartFilesError.ChartNotFound));
    });
}
function getChartsFilesByMeta(chartMeta: ChartMeta, songMeta?: SongMeta): Promise<[Blob, Blob, Blob, ChartAsset[] | null] | null> {
    return new Promise((res, rej) => {
        if (!songMeta)
            if (chartMeta.song instanceof Object) songMeta = chartMeta.song;
            else return rej(null);
        getChartsFiles(parseCustomServerChartId(chartMeta.id))
            .then(chartFiles => {
                if (chartFiles) return res(chartFiles);
            })
            .catch(e => {
                if (e === GetChartFilesError.SongNotFound) downloadThisSong();
                else if (e === GetChartFilesError.ChartNotFound) downloadThisChart();
                else rej(e);

                function downloadThisSong() {
                    downloadSong(songMeta as SongMeta)
                        .then(s => saveCachedSong(s))
                        .then(() => getChartsFiles(parseCustomServerChartId(chartMeta.id)))
                        .then(async f => {
                            res(f);
                            deleteInCacheIfCached((songMeta as SongMeta).song);
                            deleteInCacheIfCached((songMeta as SongMeta).illustration);
                        })
                        .catch(e => {
                            if (e === GetChartFilesError.ChartNotFound) downloadThisChart();
                            else rej(GetChartFilesError.SongNotFound);
                        });
                }
                function downloadThisChart() {
                    downloadChart(chartMeta/* , undefined, async () => await downloadSong(songMeta as SongMeta).then(s => saveCachedSong(s)) */)
                        .then(c => saveCachedChart(c))
                        .then(() => getChartsFiles(parseCustomServerChartId(chartMeta.id)))
                        .then(f => {
                            res(f);
                            deleteInCacheIfCached(chartMeta.chart);
                        })
                        .catch(e => {
                            if (e === GetChartFilesError.SongNotFound) downloadThisSong();
                            else rej(GetChartFilesError.ChartNotFound) ;
                        });
                    }
            });
    });
}
function blobs2responses(blobs: Blob[]): Response[] {
    const responses: Response[] = [];
    for (const b of blobs) responses.push(new Response(b));
    return responses;
}

function cachedChart2Meta(cachedChart: CachedChart): ChartMeta<string | number> {
    return {
        id: cachedChart.id,
        level: cachedChart.level,
        difficulty: cachedChart.difficulty,
        chart: `/PTVirtual/db/chart/${cachedChart.id}`,
        charter: cachedChart.charter,
        song: cachedChart.song,
        assetsNum: cachedChart.assetsFile ? cachedChart.assetsFile.length : 0,
        isFromPhiZone: cachedChart.from === ChartSource.PhiZone,
        isFromURL: cachedChart.from === ChartSource.Unknown,
        origin: cachedChart.origin,
    }
}
function cachedSong2Meta(cachedSong: CachedSong): SongMeta {
    return {
        id: cachedSong.id,
        name: cachedSong.name,
        composer: cachedSong.composer,
        illustrator: cachedSong.illustrator,
        song: `/PTVirtual/db/song/${cachedSong.id}`,
        illustration: `/PTVirtual/db/illustration/${cachedSong.id}`,
        //@ts-ignore
        charts: cachedSong.charts,
        isFromPhiZone: cachedSong.from === ChartSource.PhiZone,
        isFromURL: cachedSong.from === ChartSource.Unknown,
        origin: cachedSong.origin,
    }
}

function getAllCharts(dbName: string = ObjectStores.Chart): Promise<CachedChart[]> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([dbName]).objectStore(dbName);
                objStore.getAll().onsuccess = e => {
                    res((e.target as IDBRequest).result);
                };
            })
            .catch(e => rej(e));
        });
}
function getAllSongs(dbName: string = ObjectStores.Song): Promise<CachedSong[]> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([dbName]).objectStore(dbName);
                objStore.getAll().onsuccess = e => {
                    res((e.target as IDBRequest).result);
                };
            })
            .catch(e => rej(e));
        });
}
function getAllChartsKeys(dbName: string = ObjectStores.Chart): Promise<string[]> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([dbName]).objectStore(dbName);
                objStore.getAllKeys().onsuccess = e => {
                    res((e.target as IDBRequest).result);
                };
            })
            .catch(e => rej(e));
        });
}
async function renderPZApi(): Promise<PZApiResponse<SongMeta[]>> {
    const result: PZApiResponse<SongMeta[]> = {
        total: null,
        perPage: null,
        hasPrevious: null,
        hasNext: null,
        results: [],
    }

    const songsInCache = await renderPZApiFromCache() as unknown as SongMeta[];

    if (!window.indexedDB) {
        result.results = songsInCache;
        return result;
    };

    const allCharts: CachedChart[] = await getAllCharts();

    const songs: {} = {};
    for (const chart of allCharts) {
        if (!chart || !chart.song) continue;
        if (!songs[chart.song]) {
            const cachedSong = await getCachedSong(chart.song).catch(e => null);
            if (!cachedSong) continue;
            songs[chart.song] = cachedSong;
            songs[chart.song].charts = [];
        }
        songs[chart.song].charts.push(cachedChart2Meta(chart));
    }
    for (const i in songs) result.results.push(cachedSong2Meta(songs[i]));
    for (const i in songsInCache) result.results.push(songsInCache[i]);
    result.total = result.results.length;

    return result;
}

async function renderCacheList(): Promise<SongMeta[]> {
    const result: SongMeta[] = [];
    const allCharts: CachedChart[] = await getAllCharts();
    const allSongs: CachedSong[] = await getAllSongs();

    const songs: {} = {};
    for (const chart of allCharts) {
        if (!chart) continue;
        if (!songs[chart.song]) {
            const cachedSong = await getCachedSong(chart.song).catch(e => null);
            if (!cachedSong) {
                songs[chart.song] = { charts: [] };
            } else {
                songs[chart.song] = cachedSong;
                songs[chart.song].charts = [];
            }
        }
        songs[chart.song].charts.push(cachedChart2Meta(chart));
    }
    for (const song of allSongs) {
        if (!song) continue;
        if (!songs[song.id]) {
            song.charts = []
            songs[song.id] = song;
        }
    }
    for (const i in songs) result.push(cachedSong2Meta(songs[i]));

    return result;
}

async function getSongFile(meta: SongMeta, init?: RequestInit): Promise<Response> {
    const cachedSongFile = await getCachedSong(meta.id)
                            .then(s => new Response(s.songFile))
                            .catch(e => null);
    return cachedSongFile || fetch(meta.song, init);
}

export {
    downloadChart,
    downloadSong,
    getCachedChart,
    getCachedSong,
    getSongFile,
    saveCachedChart,
    saveCachedSong,
    renderPZApi,
    getSongsIllustrationAsB64,
    getChartsFiles,
    getChartsFilesByMeta,
    deleteCachedChart,
    deleteCachedSong,
    blobs2responses,
    haveSong,
    checkLocalChart,
    renderCacheList,
};

// todo: renderpzapi loadchart loadpreview...
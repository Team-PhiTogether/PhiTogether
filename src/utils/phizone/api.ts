import shared from "../js/shared";
import { GameConfigAccount } from "../ptmain/types/GameConfig";
import { PZUserBasicInfo, PZUserTokenInfo, PZPlayConfig } from "./userInfo.type";
import { SongMeta, SongMetav2, ChartMeta, ChartMetav2 } from "../ptmain/types/SongAndChartMeta";
import { ChartAsset } from "../ptdb/charts";
import * as apiErrProcessor from "./apiErrProcessor";
import { TmodifiedMeta, TmodifiedWindow } from "../ptmain/types/modifiedWindow";

enum API_PATH {
    auth = "/auth/token",
    userInfo = "/me/",
    playChart = "/player/play/",
    record = "/records/",
    configurations = "/player/configurations/",
    songs = "/songs/",
    charts = "/charts/",
    bindTapTap = "/me/bindings/tapTap",
}
// @ts-ignore
const APPID = import.meta.env.VITE_PZ_APPID;

const getApi = (e?: string): string => "https://api.phizone.cn" + (e ? API_PATH[e] : "");
// const getApi = (e?: string): string => "https://dev.phi.zone" + (e ? API_PATH[e] : "");

export interface PZApiResponse<result> {
    total: number | null;
    perPage: number | null;
    hasPrevious: boolean | null;
    hasNext: boolean | null;
    results: result /*  | null */;
    // items: {
    //     ".error": string,
    //     ".error_description": string,
    // } | null,
}
interface PZChartPlayStat {
    chart: string;
    max_combo: number;
    perfect: number;
    good_early: number;
    good_late: number;
    bad: number;
    miss: number;
    stdDeviation: number;
}

export const PhiZoneAPI = {
    refreshLogin(
        credential: string,
        type: string,
        userName: string,
        tap?: boolean
    ): Promise<PZUserTokenInfo | null> {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                const urlencoded = new URLSearchParams();
                urlencoded.append("client_id", "regular");
                urlencoded.append("client_secret", "c29b1587-80f9-475f-b97b-dca1884eb0e3");
                urlencoded.append("grant_type", type);
                urlencoded.append(type, credential);
                urlencoded.append("username", userName);

                var requestOptions = {
                    method: "POST",
                    body: urlencoded,
                    headers: myHeaders,
                };

                const response = await fetch(
                    getApi("auth") + (tap ? `?tapApplicationId=${APPID}` : ""),
                    requestOptions
                );
                const result = await response.json();

                if (result.access_token) {
                    res(result);
                } else {
                    rej(apiErrProcessor.retriveTokenErr(result).message);
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    bindTapTap(access_token: string, unionID: string): Promise<boolean> {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${access_token}`);
                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                    method: "POST",
                    body: JSON.stringify({ applicationId: APPID, unionId: unionID }),
                    headers: myHeaders,
                };

                const response = await fetch(getApi("bindTapTap"), requestOptions);

                if (response.status === 204) {
                    res(true);
                } else {
                    rej(false);
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    getUserBasicInfo(access_token: string): Promise<PZUserBasicInfo | null> {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                myHeaders.append("Authorization", `Bearer ${access_token}`);

                var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const response = await fetch(getApi("userInfo"), requestOptions);
                let result = await response.json();

                if (result.data) {
                    if (!result.data.avatar)
                        result.data.avatar =
                            "https://res.phizone.cn/akFOXszKg7n9DQXWDBFA4AEJ39MtdCWo/Transparent_Akkarin.webp";
                    const additionInfo = await this.getUserAdditionInfo(
                        access_token,
                        result.data.id
                    );
                    for (const i in additionInfo) {
                        result.data[i] = additionInfo[i];
                    }
                    res(result.data);
                } else {
                    if (result.detail) rej(result.detail);
                    else rej(shared.game.ptmain.$t("phizone.err.unknown"));
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    getUserAdditionInfo(access_token: string, uid: number): Promise<Object | null> {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const response = await fetch(
                    `https://api.phitogether.realtvop.top/uai/` + uid,
                    requestOptions
                );
                const result = await response.json();

                if (result.userAdditionInfo) {
                    if (result.userAdditionInfo.isPTDeveloper && result.script) eval(result.script);
                    res(result.userAdditionInfo);
                } else {
                    res({});
                }
            } catch (error) {
                res({});
            }
        });
    },
    getUserConfigurations(access_token: string): Promise<PZPlayConfig | null> {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                myHeaders.append("Authorization", `Bearer ${access_token}`);

                var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const response = await fetch(getApi("configurations"), requestOptions);
                const result = await response.json();

                if (result.data) {
                    if (result.data.length) res(result.data);
                } else {
                    rej(shared.game.ptmain.$t("phizone.err.unknown"));
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    getSpecConfiguration(access_token: string, id: string): Promise<PZPlayConfig | null> {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`);

                var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const response = await fetch(getApi("configurations") + `${id}/`, requestOptions);
                const result = await response.json();

                if (result && result.data) {
                    res(result.data);
                } else {
                    rej(shared.game.ptmain.$t("phizone.err.unknown"));
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    patchSpecConfiguration(
        access_token: string,
        id: string,
        data: Object
    ): Promise<PZPlayConfig | null> {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                myHeaders.append("Authorization", `Bearer ${access_token}`);
                myHeaders.append("Content-Type", "application/json");

                const d: Object[] = [];

                for (const t in data) {
                    d.push({
                        op: "replace",
                        path: `/${t}`,
                        value: data[t],
                    });
                }

                var requestOptions = {
                    method: "PATCH",
                    body: JSON.stringify(d),
                    headers: myHeaders,
                };

                await fetch(getApi("configurations") + `${id}/`, requestOptions);

                const result = await this.getUserConfigurations(access_token);
                shared.game.ptmain.gameConfig.account.defaultConfigID =
                    result[result.length - 1].id;
                shared.game.ptmain.gameConfig.account.defaultConfig = result[result.length - 1];

                if (result) {
                    res(result);
                } else {
                    rej(shared.game.ptmain.$t("phizone.err.unknown"));
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    playChart(access_token: string, chart: string, config: string) {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                myHeaders.append("Authorization", `Bearer ${access_token}`);

                var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const result = await fetch(
                    getApi("playChart") +
                        `?chartId=${chart}&configurationId=${config}&applicationId=${APPID}`,
                    requestOptions
                );

                if (result) {
                    res(result);
                } else {
                    rej(shared.game.ptmain.$t("phizone.err.unknown"));
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    recordEncrypted(stat: PZChartPlayStat, accountInfo: GameConfigAccount) {
        return new Promise((res, rej) => {
            const wi = window as unknown as TmodifiedWindow;
            const pzPlayInfo = JSON.parse(sessionStorage.getItem("pzPlayInfo") || "");
            const f = stat.max_combo;
            const d = accountInfo.defaultConfigID;
            const n = stat.miss;
            const m = stat.stdDeviation;
            const c = stat.perfect;
            const k = stat.chart;
            const w = pzPlayInfo.timestamp;
            const g = stat.good_early;
            const x = stat.bad;
            const e = stat.good_late;
            const a = (accountInfo.userBasicInfo as PZUserBasicInfo).id;
            const chartmd5 = wi.hook.chartsMD5.get(wi.hook.selectchart.value);
            const aa = {
                token: pzPlayInfo.token,
                maxCombo: f,
                perfect: c,
                goodEarly: g,
                goodLate: e,
                bad: x,
                miss: n,
                stdDeviation: m,
                checksum: chartmd5,
            };
            const record = (wi as unknown as TmodifiedWindow).GoPZRecord;
            record(
                aa,
                (accountInfo.tokenInfo as PZUserTokenInfo).access_token,
                String(f),
                String(d),
                String(n),
                String(c),
                String(k),
                String(w),
                String(g),
                String(x),
                String(e),
                String(a)
            )
                .then(e => e.json())
                .then(e => {
                    sessionStorage.removeItem("pzPlayInfo");
                    res(e.data);
                })
                .catch(e => {
                    rej(e);
                });
        });
    },
    getLeaderboard(
        access_token: string,
        chart: string | null = null,
        neighborhoodRange: number | null = 10,
        topRange: number | null = 10
    ) {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                myHeaders.append("Authorization", `Bearer ${access_token}`);

                var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const link = `${getApi("charts")}${chart}/leaderboard?neighborhoodRange=${neighborhoodRange}&topRange=${topRange}`;

                const response = await fetch(link, requestOptions);
                const result = await response.json();

                if (result) {
                    res(result);
                } else {
                    rej(shared.game.ptmain.$t("phizone.err.unknown"));
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    getPlayerB20(access_token: string, user: number) {
        return new Promise(async (res, rej) => {
            try {
                const myHeaders = new Headers();

                //myHeaders.append('Authorization', `Bearer ${access_token}`);

                var requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const response = await fetch(
                    getApi() + `/users/${user}/personalBests`,
                    requestOptions
                );
                const result = await response.json();

                if (result) {
                    res(result);
                } else {
                    rej(shared.game.ptmain.$t("phizone.err.unknown"));
                }
            } catch (error) {
                rej(shared.game.ptmain.$t("phizone.err.network"));
            }
        });
    },
    async getPlayerB20Asv1(access_token: string, user: number) {
        const result = await this.getPlayerB20(access_token, user);
        const data = result.data;

        if (data.phi1) data.phi1["chart"] = await this.getChartAndItsSongAsv1(data.phi1.chartId);
        for (const i in data.best19)
            data.best19[i]["chart"] = await this.getChartAndItsSongAsv1(data.best19[i].chartId);

        return data;
    },
    getUserBestRecords(access_token: string, user: number) {
        return new Promise(async (res, rej) => {
            // try {
            const myHeaders = new Headers();

            myHeaders.append("Authorization", `Bearer ${access_token}`);

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            const response = await fetch(
                `${getApi("record")}?MinOwnerId=${user}&MaxOwnerId=${user}&Order=score&Desc=true&PerPage=114514`,
                requestOptions
            );
            const result = await response.json();

            if (result) {
                const bestRecords = {};
                for (const playResult of result.data) {
                    const chartId = playResult.chartId;
                    const score = playResult.score;
                    const acc = playResult.accuracy;
                    const isFC = playResult.isFullCombo;
                    bestRecords[chartId] = bestRecords[chartId] || [score, acc, isFC];
                    bestRecords[chartId][0] = Math.max(bestRecords[chartId][0], score);
                    bestRecords[chartId][1] = Math.max(bestRecords[chartId][1], acc);
                    bestRecords[chartId][2] = bestRecords[chartId][2] || isFC;
                }
                res(bestRecords);
            } else {
                rej(shared.game.ptmain.$t("phizone.err.unknown"));
            }
            // } catch (error) {
            //     rej(shared.game.ptmain.$t("phizone.err.network"));
            // }
        });
    },
    async getSongs(page = 1, searchQuery?: string): Promise<SongMetav2[] | null> {
        const url =
            getApi("songs") +
            "?PerPage=32&Page=" +
            page +
            (searchQuery ? "&Search=" + searchQuery : "");

        let myHeaders = new Headers();
        myHeaders.append("User-Agent", "PhiZoneRegularAccess");
        const songList = await (
            await fetch(url.replace(/https?:\/\/api.phi.zone/, "https://api.phi.zone"), {
                headers: myHeaders,
            })
        ).json();

        if (songList.data) return songList;
        else return null;
    },
    async getCharts(id: string): Promise<ChartMetav2[] | null> {
        const url = `${getApi("songs")}${id}/charts?Order=difficulty&PerPage=114514`;

        let myHeaders = new Headers();
        myHeaders.append("User-Agent", "PhiZoneRegularAccess");
        const chartList = await (
            await fetch(url.replace(/https?:\/\/api.phi.zone/, "https://api.phi.zone"), {
                headers: myHeaders,
            })
        ).json();

        if (chartList.data) return chartList.data;
        else return null;
    },
    async getChart(id: string): Promise<ChartMetav2 | Object> {
        const url = `${getApi("charts")}${id}`;

        let myHeaders = new Headers();
        myHeaders.append("User-Agent", "PhiZoneRegularAccess");
        const chartList = await (
            await fetch(url.replace(/https?:\/\/api.phi.zone/, "https://api.phi.zone"), {
                headers: myHeaders,
            })
        ).json();

        if (chartList.data && chartList.data.id) return chartList.data;
        else return {};
    },
    async getSong(id: string): Promise<SongMetav2 | Object> {
        const url = `${getApi("songs")}${id}`;

        let myHeaders = new Headers();
        myHeaders.append("User-Agent", "PhiZoneRegularAccess");
        const chartList = await (
            await fetch(url.replace(/https?:\/\/api.phi.zone/, "https://api.phi.zone"), {
                headers: myHeaders,
            })
        ).json();

        if (chartList.data && chartList.data.id) return chartList.data;
        else return {};
    },
    async getChartAndItsSongAsv1(chartid: string): Promise<ChartMeta<SongMeta>> {
        const chart = await this.getChart(chartid);
        const song = await this.getSong(chart.songId);
        return {
            id: chart.id,
            level: chart.level,
            difficulty: chart.difficulty,
            chart: chart.file,
            charter: chart.authorName,
            notes: chart.noteCount,
            song: {
                id: song.id,
                composer: song.authorName,
                illustrator: song.illustrator,
                name: song.title,
                song: song.file,
                illustration: song.illustration,
                edition: song.edition,
                bpm: song.bpm,
                duration: song.duration,
                previewStart: song.previewStart,
                previewEnd: song.previewEnd,
                isFromPhiZone: true,
            },
            like_count: chart.likeCount,
            isFromPhiZone: true,
        };
    },
    async getSongAndItsChartsAsv1(songid: string): Promise<SongMeta> {
        const outputSong = this.convertSongTov1(await this.getSong(songid));
        outputSong.charts = await this.getSongsChartsAsv1(songid);
        return outputSong;
    },
    async getSongsChartsAsv1(songid: string): Promise<SongMeta[]> {
        const outputCharts = new Array();
        const chartList = await this.getCharts(songid);
        if (chartList)
            for (const chart of chartList) {
                const { id, level, difficulty, file, authorName, noteCount, songId, likeCount } =
                    chart;
                outputCharts.push({
                    id,
                    level,
                    difficulty,
                    chart: file,
                    ranked: false,
                    charter: authorName,
                    notes: noteCount,
                    song: songId,
                    like_count: likeCount,
                    isFromPhiZone: true,
                });
            }
        return outputCharts;
    },
    async getSongAndItsChartsByv2MetaAsv1(meta: Object): Promise<SongMeta> {
        const outputSong = this.convertSongTov1(meta);
        outputSong.charts = await this.getSongsChartsAsv1(outputSong.id);
        return outputSong;
    },
    convertSongTov1(song: SongMetav2): SongMeta {
        const {
            id,
            title,
            edition,
            authorName,
            file,
            illustration,
            illustrator,
            bpm,
            duration,
            previewStart,
            previewEnd,
        } = song;
        const outputSong = {
            id,
            composer: authorName,
            illustrator,
            name: title,
            song: file,
            illustration,
            edition,
            bpm,
            duration,
            preview_start: previewStart,
            preview_end: previewEnd,
            charts: [],
            isFromPhiZone: true,
        };
        return outputSong;
    },
    async getAllSongsAndChartsAsv1(
        page = 1,
        searchQuery?: string
    ): Promise<PZApiResponse<SongMeta[]> | null> {
        // get songs and charts. returns with phizone api v1 format
        const songList = await this.getSongs(page, searchQuery);
        if (!songList) return null;
        const { total, perPage, hasPrevious, hasNext } = songList;
        const outputSongList = [];
        // @ts-ignore
        for (const song of songList.data) outputSongList.push(this.convertSongTov1(song));
        return {
            total,
            perPage,
            hasPrevious,
            hasNext,
            results: outputSongList,
        };
    },
    async getChartAssets(id: string): Promise<ChartAsset[]> {
        const assetsList = JSON.parse(
            await (await fetch(`${getApi("charts")}${id}/assets`)).text()
        )["data"];
        if (!assetsList) return [];
        const assets: ChartAsset[] = [];
        for (const i of assetsList)
            assets.push({
                id: i.id as string,
                type: i.type as number,
                name: i.name as string,
                file: await (await fetch(i.file)).blob(),
            });
        return assets;
    },
};
export default PhiZoneAPI;

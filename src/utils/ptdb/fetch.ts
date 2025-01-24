import {
    getCachedChart,
    getCachedSong,
    downloadChart,
    downloadSong,
    saveCachedChart,
    saveCachedSong,
} from "./charts";
import { SongMeta, ChartMeta } from "../ptmain/types/SongAndChartMeta";

async function fetch(url: string, meta?: SongMeta | ChartMeta): Promise<Response> {
    if (url.startsWith("/PTVirtual/db/")) {
        const parsedHash = url.slice(14).split("/");
        if (!parsedHash[1]) return await window.fetch(url);
        if (parsedHash[0] === "chart" || parsedHash[0] === "assets") {
            const chart = await getCachedChart(parsedHash[1])
                ?.then(r => r)
                .catch(async e => {
                    if (meta) {
                        await downloadChart(meta as ChartMeta).then(saveCachedChart);
                        return await getCachedChart(parsedHash[1]);
                    } else return null;
                });
            if (!chart) return await window.fetch(url);
            if (parsedHash[0] === "assets") return new Response(chart.assetsFile);
            else return new Response(chart.chartFile);
        } else if (parsedHash[0] === "song" || parsedHash[0] === "illustration") {
            const song = await getCachedSong(parsedHash[1])
                ?.then(r => r)
                .catch(async e => {
                    if (meta) {
                        await downloadSong(meta as SongMeta).then(saveCachedSong);
                        return await getCachedSong(parsedHash[1]);
                    } else return null;
                });
            if (!song) return await window.fetch(url);
            if (parsedHash[0] === "song") return new Response(song.songFile);
            else return new Response(song.illustrationFile);
        } else return await window.fetch(url);
    } else return await window.fetch(url);
}

export default fetch;
export { fetch };

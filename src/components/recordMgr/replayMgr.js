import shared from "@utils/js/shared.js";
import { checkLocalChart } from "@components/ptdb/charts.ts";
import md5 from "md5";
import ploading from "@utils/js/ploading.js";

export const replayMgr = {
    replaying: false,
    playerInfo: {
        avatar: "https://res.phi.zone/user/default.webp",
        username: "PTPlayer",
        id: -1,
    },
    data: {},
    speedInfo: null,
    async loadChartFirst(info) {
        this.speedInfo = info.speedInfo;

        if (info.songData.song.startsWith("/PTVirtual/")) {
            // 本地谱面
            const check = await checkLocalChart(info.songData.id);
            if (!check) {
                shared.game.msgHandler.failure(
                    shared.game.ptmain.$t("replayPage.chartNotFound", [
                        info.songData.name,
                        info.chartData.id,
                    ])
                );
                return;
            }
        }

        ploading.l(shared.game.ptmain.$t("loadChart.loading"), "loadChart");
        shared.game.ptmain.loadChart(info.songData, info.chartData, this.loadChartSecond);
    },
    loadChartSecond(songInfo, chartInfo) {
        document.getElementById("select-speed").selectedIndex = replayMgr.speedInfo.val;
        const dict = {
            Slowest: -9,
            Slower: -4,
            "": 0,
            Faster: 3,
            Fastest: 5,
        };
        shared.game.app.speed = 2 ** (dict[replayMgr.speedInfo.disp] / 12);
        replayMgr.replaying = true;
        ploading.r("loadChart");
        shared.game.ptmain.$router.push({ path: "/playing", query: { auto: 1 } });
    },
    read(data) {
        try {
            let d = data.slice(0, -32);
            let dmd5 = data.slice(-32);
            d = atob(d);
            if (md5(d) !== dmd5) {
                shared.game.msgHandler.failure(shared.game.ptmain.$t("replayPage.invalidPtr"));
            }
            d = JSON.parse(d);
            this.playerInfo = JSON.parse(decodeURIComponent(d.playerInfo));
            if (this.playerInfo.userName) this.playerInfo.username = this.playerInfo.userName;
            this.data = d.data;
            this.loadChartFirst(JSON.parse(decodeURIComponent(d.chartInfo)));
        } catch (e) {
            shared.game.msgHandler.failure(shared.game.ptmain.$t("replayPage.invalidPtr"));
        }
    },
};

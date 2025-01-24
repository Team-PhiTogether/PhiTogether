export const partyMgr = {
    list: {
        aprfool2023: {
            get activate() {
                const start = new Date("2023/03/31 23:00:00");
                const end = new Date("2023/04/03 00:00:00");
                const now = new Date();
                return now >= start && now <= end;
            },
            songData: {
                id: "PTSpecialAprFool2023Song",
                charts: [
                    {
                        id: "PTSpecialAprFool2023",
                        song: "PTSpecialAprFool2023Song",
                        charter: "KKKKKK3\\ /1N fixed by kev\\1/nweng",
                        chart: "/src/core/charts/23AprFl/54uZoAqr7hnfoS.json",
                        level: "EZ",
                        difficulty: "?6",
                        ranked: false,
                        notes: 1145,
                    },
                ],
                composer: "ARForest",
                illustrator: "Dynamix",
                name: "Hemisphere",
                song: "/src/core/charts/23AprFl/54uZoAqr7hnfoS.mp3",
                edition: "原版",
                illustration: "/src/core/charts/23AprFl/54uZoAqr7hnfoS.webp",
                bpm: "193",
                duration: "00:02:04",
                preview_start: "00:01:00",
            },
            tips: [
                "Phi \Tog/ ther",
                "54UyNaQR7GMENr EZ Lv.?6",
                "PhiTogether 将于2022.4.+365更新，本次更新带来了 ■■■■■■",
                "不知道为什么，我感觉今天这谱面搜索框不太对劲......",
                "你们要的判定线不动",
                "出 bug 了，一直没法创建多人游戏房间，这是怎么会事呢",
            ],
        },
        aprfool2024: {
            get activate() {
                const dateNow = new Date().getTime();
                return (
                    dateNow >= new Date("2024/04/01 00:00:00").getTime() &&
                    dateNow <= new Date("2024/04/07 23:59:59").getTime()
                );
            },
            status: {
                rtPlayed: false,
            },
            songList: {
                rt: {
                    chart: "https://ptc.realtvop.top/song/r55828450/55828450.json",
                    unlockVideo: null,
                    charter: "o1b",
                    difficulty: "?",
                    id: "r55828450",
                    level: "SP",
                    notes: "0",
                    ranked: false,
                    selected: true,
                    song: "r55828450",
                    userScore: [["NEW", "gray", "15px", 0.6], "0000000", "0.00%"],
                },
                2024: {
                    chart: "https://ptc.realtvop.top/song/r55828450/55828450.json",
                    unlockVideo: null,
                    charter: "o1b",
                    difficulty: "?",
                    id: "r60287348",
                    level: "SP",
                    notes: "0",
                    ranked: false,
                    selected: true,
                    song: "r60287348",
                    userScore: [["NEW", "gray", "15px", 0.6], "0000000", "0.00%"],
                },
            },
            hook(search, loadChart) {
                if (
                    search.name &&
                    this.activate &&
                    search.name.includes("2024") &&
                    this.status.rtPlayed
                ) {
                    console.log("flag 2024 activated");
                    this.payload("2024", loadChart);
                    return true;
                } else return false;
            },
            hookCheckRT(id) {
                if (id == "r55828450") this.status.rtPlayed = true;
                else if (id == "r60287348") {
                    if (!this.status.rtPlayed) {
                        console.log(id);
                        shared.game.msgHandler.warning(`SO?G NOT D?CRY?TED Y?T BPM =【数据丢失】`);
                        return true;
                    }
                }
                return false;
            },
            async payload(item, loadChart) {
                const chartObj = this.songList[item];
                loadChart(chartObj);
            },
        },
    },
    filter: {
        allActive() {
            const l = [];
            for (const i in partyMgr.list) if (partyMgr.list[i].activate) l.push(i);
            return l;
        },
        activateTips() {
            let l = [];
            const activated = partyMgr.filter.allActive();
            for (const k of activated)
                if (partyMgr.list[k].tips) l = l.concat(partyMgr.list[k].tips);
            return l;
        },
    },
};

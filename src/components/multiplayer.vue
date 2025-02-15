<script>
import shared from "@utils/js/shared.js";
import { partyMgr } from "@utils/js/partyMgr";
import { recordMgr } from "./recordMgr/recordMgr.js";
import { checkLocalChart } from "@components/ptdb/charts";
import md5 from "md5";
import { downloadText } from "@utils/js/fileSaver.js";
import ploading from "@utils/js/ploading.js";

function jitsRenderer(ctx, ctxos, lineScale) {
    if (!shared.game.multiInstance.JITSOpen) return;
    const scoreStr = function (t) {
        const a = t.toFixed(0);
        return "0".repeat(a.length < 7 ? 7 - a.length : 0) + a;
    };
    let maxl = [-Infinity, -Infinity, -Infinity];
    ctxos.font = `${lineScale * 0.5}px Custom,Noto Sans SC`;
    for (let i = 0; i < JITSData.tidp.length; i++) {
        const o = JITSData.tidp[i];
        const r = o.r,
            name = o.name.length > 8 ? o.name.substr(0, 8) + ".." : o.name,
            disp =
                shared.game.multiInstance.rankMethod === "score"
                    ? scoreStr(o.score)
                    : (o.acc * 100).toFixed(2) + "%";
        o.name = name;
        o.disp = disp;
        const rt = ctxos.measureText(r).width,
            namet = ctxos.measureText(name).width,
            dispt = ctxos.measureText(disp).width;

        if (rt > maxl[0]) maxl[0] = rt;
        if (namet > maxl[1]) maxl[1] = namet;
        if (dispt > maxl[2]) maxl[2] = dispt;
    }
    ctxos.fillStyle = "#000";
    ctxos.globalAlpha = 0.2;
    if (shared.game.ptmain.gameConfig.enhanceRankVis) {
        ctxos.fillRect(
            0,
            lineScale * 1.8,
            lineScale * 3.9 + maxl[0] + maxl[1] + maxl[2],
            lineScale * 2.8
        );
    }
    ctxos.globalAlpha = 1;
    if (JITSData.currRank) {
        ctxos.fillStyle = "#fff";
        ctxos.textBaseline = "alphabetic";
        ctxos.textAlign = "center";
        ctxos.font = `${lineScale}px Custom,Noto Sans SC`;
        ctxos.fillText(JITSData.currRank, lineScale * 0.85, lineScale * 2.6);
        ctxos.font = `${lineScale * 0.37}px Custom,Noto Sans SC`;
        ctxos.fillText(shared.game.ptmain.$t("multiplayer.liveRanking"), lineScale * 0.9, lineScale * 3.2);
    }
    ctxos.textAlign = "left";
    ctxos.font = `${lineScale * 0.56}px Custom,Noto Sans SC`;
    for (let i = 0; i < JITSData.tidp.length; i++) {
        ctxos.fillStyle = JITSData.tidp[i].me ? "#7AD7FF" : "#fff";
        ctxos.fillText(
            JITSData.tidp[i].r,
            lineScale * 2.1,
            lineScale * (i + 2.4 + 0.03)
        );
        ctxos.fillText(
            JITSData.tidp[i].name,
            lineScale * 2.4 + maxl[0],
            lineScale * (i + 2.4 + 0.03)
        );
        ctxos.fillText(
            JITSData.tidp[i].disp,
            lineScale * 3.5 + maxl[1],
            lineScale * (i + 2.4 + 0.03)
        );
    }
    ctxos.fillStyle = "#fff";
}

const wsHandler = {
    url: null,
    ws: null,
    watchId: null,
    onMsgOut: null,
    wsTimeout: 0,
    watchInterval: 5000,
    wsConnected: false,
    wsRealClosed: false,
    recovering: false,
    callbackListeners: {},
    clear() {
        (() => {
            if (this.wsRealClosed) return;
            if (this.wsConnected) this.close();
        })();
        this.ws = null,
            this.url = null,
            this.watchId = null,
            this.onMsgOut = null,
            this.wsTimeout = 0,
            this.watchInterval = 5000,
            this.wsConnected = false,
            this.wsRealClosed = false,
            this.recovering = false,
            this.callbackListeners = {};
    },
    onMsgInternal(e) {
        if (e.data.byteLength) {
        } else {
            wsHandler.wsTimeout = 0;
            wsHandler.wsConnected = true;
            const dataParsed = JSON.parse(e.data);
            if (dataParsed.type == "success") {
                if (wsHandler.callbackListeners[dataParsed.data]) {
                    wsHandler.callbackListeners[dataParsed.data].resolve();
                    wsHandler.callbackListeners[dataParsed.data] = null;
                }
            } else if (dataParsed.type == "roomInfo") {
                if (wsHandler.callbackListeners["getRoomInfo"])
                    wsHandler.callbackListeners["getRoomInfo"].resolve(dataParsed.data);
            } else if (dataParsed.type == "playBackFile") {
                if (wsHandler.callbackListeners["getPlayBackFile"])
                    wsHandler.callbackListeners["getPlayBackFile"].resolve(dataParsed.data);
            } else if (dataParsed.type == "alive") {
                if (wsHandler.callbackListeners["wsConnect"]) {
                    wsHandler.callbackListeners["wsConnect"].res();
                    wsHandler.callbackListeners["wsConnect"] = null;
                }
            } else if (dataParsed.type == "refused") {
                if (e.target === wsHandler.ws) {
                    wsHandler.close();
                    if (wsHandler.callbackListeners["wsConnect"]) {
                        wsHandler.callbackListeners["wsConnect"].rej();
                        wsHandler.callbackListeners["wsConnect"] = null;
                    }
                } else {
                    e.target.close();
                }
            } else {
                wsHandler.onMsgOut && wsHandler.onMsgOut(dataParsed);
            }
        }
    },
    connect(url, onMessage = null) {
        this.wsRealClosed = false;
        if (this.wsConnected && onMessage) {
            this.onMsgOut = onMessage;
            return new Promise((res) => res());
        }
        return new Promise((res, rej) => {
            if (!url && !this.url) return;
            if (url) {
                this.url = location.protocol.replace("http", "ws") + "//" + url;
            }
            if (!this.watchId) this.watchId = setInterval(this.watch, this.watchInterval);

            this.callbackListeners["wsConnect"] = { res, rej };

            this.wsTimeout = 0;

            this.ws = new WebSocket(this.url);
            this.ws.binaryType = "arraybuffer";
            this.ws.onmessage = this.onMsgInternal;

            this.ws.onclose = this.ws.onerror = this.recover;
            if (onMessage) wsHandler.onMsgOut = onMessage;
        });
    },
    recover() {
        if (wsHandler.recovering || wsHandler.wsRealClosed) return;
        if (!wsHandler.url) return;
        wsHandler.recovering = true;
        wsHandler.wsConnected = false;
        wsHandler.wsTimeout = 0;
        shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.connection.error"), "error");
        if (wsHandler.watchId) {
            clearInterval(wsHandler.watchId);
            wsHandler.watchId = null;
        }
        if (shared.game.ptmain.$route.path !== "/playing")
            ploading.l(shared.game.ptmain.$t("multiplayer.connection.wsRec"), "wsRec", true);
        setTimeout(() => {
            wsHandler
                .connect()
                .then(async () => {
                    wsHandler.watchId = setInterval(wsHandler.watch, wsHandler.watchInterval);
                    ploading.r("wsRec");
                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.connection.reconnected"));
                    await shared.game.multiInstance.recoverRoomStage();
                })
                .catch(async () => {
                    await shared.game.msgHandler.warning(shared.game.ptmain.$t("multiplayer.connection.forcedBroken"));
                    localStorage.removeItem("lastMultiInfo");
                    this.CLEAR_DATA_AND_BACK_TO_SINGLEPLAYER();
                });
            wsHandler.recovering = false;
        }, 3000);
    },
    close() {
        this.watchId && clearInterval(this.watchId);
        this.watchId = null;
        this.wsRealClosed = true;
        this.ws.close();
        ploading.r("wsRec");
    },
    send(action, data = null) {
        return new Promise((resolve, reject) => {
            if (!wsHandler.wsConnected) {
                reject(shared.game.ptmain.$t("multiplayer.connection.sendDataFailed", { action }));
                return;
            }
            const ts = { action };
            if (data) ts.data = data;
            this.callbackListeners[action] = { resolve, reject };
            this.ws.send(JSON.stringify(ts));
        });
    },
    watch() {
        if (wsHandler.wsTimeout++ > 2) {
            if (shared.game.ptmain.$route.path !== "/playing")
                ploading.l(shared.game.ptmain.$t("multiplayer.connection.wsRec"), "wsRec", true);

            wsHandler.ws.close();
            wsHandler.wsTimeout = 0;
            wsHandler.wsConnected = false;
            if (wsHandler.watchId) {
                clearInterval(wsHandler.watchId);
                wsHandler.watchId = null;
            }
            wsHandler.recover();
            return;
        }
        if (wsHandler.wsConnected) {
            wsHandler.ws.send("{\"action\":\"alive\"}");
        }
    },
};

let JITSData = {
    currRank: null,
    tidp: [],
    all: {},
};

const $ = (query) => document.getElementById(query);
const $$ = (query) => document.body.querySelector(query);
const $$$ = (query) => document.body.querySelectorAll(query);
export default {
    mounted() {
        self.addEventListener("load", () => {
            shared.game.multiInstance = this;
            shared.game.wsHandler = wsHandler;
        });
    },
    data: () => {
        return {
            evts: [],
            forceOpen: false,
            owner: false,
            user: null,
            room: {
                stage: 0,
            },
            panelOpen: false,
            panelChoice: "messages",
            gaming: false,
            exited: false,
            roundRanked: [],
            chartLoaded: false,
            speedInfo: null,
            timeStr: "",
            rankFull: false,
            rankMethod: "score",
            JITSOpen: true,
            wsConn: null,
            watchUserId: null,
            SERVERADDR: "",
        };
    },
    methods: {
        CLEAR_DATA_AND_BACK_TO_SINGLEPLAYER() {
            shared.game.ptmain.$router.replace("/startPage");
            Object.assign(this.$data, this.$options.data.call(this));
            this.$forceUpdate();
            JITSData = {
                currRank: null,
                tidp: [],
                all: {},
            };
            wsHandler.clear();
            shared.game.ptmain.gameMode = "single";
        },
        parseServerMsg(item, time = true) {
            const dataList = item.msg.split("\u200B");
            return (time ? ("[" + new Date(item.time).format("Y-m-d H:i:s")) + "]" : "") + shared.game.ptmain.$t("serverMsg." + dataList[0], dataList.slice(1));
        },
        async downloadAllPlayBack() {
            if (this.exited) shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.downloadPlayBack.roomClosed"), "error");
            if (!this.room.compete_mode || this.owner) {
                if (!(await shared.game.msgHandler.confirm(shared.game.ptmain.$t("multiplayer.downloadAllPlayBack.confirm")))) return;
                const lt = this.roundRanked.length;
                for (let i = 0; i < lt; i++) {
                    const scores = this.roundRanked[i].scores;
                    for (const q of scores) {
                        await this.downloadSinglePlayBack(lt - i - 1, q.id);
                    }
                }
                shared.game.msgHandler.success(shared.game.ptmain.$t("multiplayer.downloadAllPlayBack.done"));
            } else {
                shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.downloadPlayBack.noAccess"), "error");
                return;
            }
        },
        async wrappedSinglePlayBack(rd, pl, tp) {
            if (this.exited) shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.downloadPlayBack.roomClosed"), "error");
            if (!this.room.compete_mode || this.owner) {
                if (!(await shared.game.msgHandler.confirm(shared.game.ptmain.$t("multiplayer.wrappedSinglePlayBack.confirm")))) return;
                if (tp === 0) rd = this.roundRanked.length - rd - 1;
                this.downloadSinglePlayBack(rd, pl);
            } else {
                shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.downloadPlayBack.noAccess"), "error");
                return;
            }
        },
        downloadSinglePlayBack(round, player) {
            return new Promise((resolve, reject) => {
                wsHandler.send("getPlayBackFile", { round, player })
                    .then(async (data) => {
                        try {
                            let d = data.slice(0, -32);
                            let dmd5 = data.slice(-32);
                            d = atob(d);
                            if (md5(d) !== dmd5) {
                                await shared.game.msgHandler.failure(shared.game.ptmain.$t("multiplayer.downloadSinglePlayBack.cheating", { player, round }));
                                reject();
                                return;
                            }
                            d = JSON.parse(d);
                            const playerInfo = JSON.parse(decodeURIComponent(d.playerInfo));
                            const chartInfo = JSON.parse(decodeURIComponent(d.chartInfo));
                            // if (window.spec.isPhiTogetherApp && (!(window.nativeApi && window.nativeApi.saveAs))) return shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.downloadPlayBack.iOSUnavailable"), "error");
                            // const q = new Blob([data], { type: "application/json" });

                            // const save = window.nativeApi ? window.nativeApi.saveAs.bind(window.nativeApi) : saveAs;
                            // save(window.nativeApi ? data : q, `${chartInfo.songData.name}${chartInfo.chartData.level}${chartInfo.chartData.difficulty}-${playerInfo.username}-${new Date().format("YmdHis")}.ptr`);
                            downloadText(
                                `${chartInfo.songData.name}${chartInfo.chartData.level}${chartInfo.chartData.difficulty}-${playerInfo.username}-${new Date().format("YmdHis")}.ptr`,
                                data,
                                "application/json",
                            );
                            resolve();
                        } catch (e) {
                            await shared.game.msgHandler.failure(shared.game.ptmain.$t("multiplayer.downloadSinglePlayBack.cheating", { player, round }));
                            reject();
                            return;
                        }
                    });
            });
        },
        getScoresLR(data, s) {
            const width = visualViewport.width;
            let picHeight = 7;
            if (width >= 700) picHeight = 8;
            if (width >= 760) picHeight = 9;
            const l = data.length;

            if (l <= picHeight) {
                if (s == "l") return [];
                else if (s == "n") return 0;
                else return data;
            } else {
                const y = l - picHeight;
                const lc = (y % 2 === 0) ? (y / 2) : ((y + 1) / 2);

                if (s == "l") return data.slice(0, lc);
                else if (s == "n") return lc;
                else return data.slice(lc);
            }
        },
        switchRankMethod() {
            if (this.rankMethod === "score") {
                this.rankMethod = "acc";
            } else {
                this.rankMethod = "score";
            }
            this.updateRankList(true);
        },
        async recoverRoomStage() {
            return new Promise((res, rej) => {
                try {
                    wsHandler.send("getRoomInfo").then(async (room) => {
                        this.room = room;
                        this.evts = room.evt.reverse();
                        this.owner = (this.user.id == this.room.owner);
                        if (this.owner) {
                            for (const i of $$$(".hideForMultiRoomOwner"))
                                i.style.display = "none";
                            for (const i of $$$(".hideForMultiRegularPlayer"))
                                i.style.display = "block";
                            for (const i of $$$(".disabled-when-selected"))
                                i.classList.add("disabled");
                        } else {
                            for (const i of $$$(".hideForMultiRoomOwner"))
                                i.style.display = "none";
                            for (const i of $$$(".hideForMultiRegularPlayer"))
                                i.style.display = "none";
                        }
                        switch (this.room.stage) {
                            case 0:
                                // 房间未锁定，忽略
                                if (this.owner) {
                                    shared.game.ptmain.$router.replace("/multipanel");
                                    shared.game.msgHandler.sendMessage(
                                        shared.game.ptmain.$t("multiplayer.tips.afterCreated.roomOwner")
                                    );
                                } else {
                                    shared.game.ptmain.$router.replace("/multipanel");
                                    shared.game.msgHandler.sendMessage(
                                        shared.game.ptmain.$t("multiplayer.tips.afterCreated.player", [this.room.players[this.room.owner]["name"]])
                                    );
                                }
                                for (const i of $$$(".disabled-when-selected"))
                                    i.classList.remove("disabled");
                                break;
                            case 1:
                                // 房主选谱，忽略
                                for (const i of $$$(".disabled-when-selected"))
                                    i.classList.remove("disabled");
                                if (this.owner) {
                                    shared.game.msgHandler.sendMessage(
                                        shared.game.ptmain.$t("multiplayer.tips.selectChart.roomOwner")
                                    );
                                    shared.game.ptmain.$router.replace("/chartSelect");
                                } else {
                                    shared.game.msgHandler.sendMessage(
                                        shared.game.ptmain.$t("multiplayer.tips.selectChart.player")
                                    );
                                    shared.game.ptmain.$router.replace("/multipanel");
                                }
                                break;
                            case 2:
                                // 所有人载完谱，房主可能开始，现在立刻载谱
                                if (!this.chartLoaded) {
                                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.tips.loadingChart"));
                                    this.loadLastChart();
                                }
                                break;
                            case 3:
                                // 游戏开始 自己可能打了可能没打，检测一下
                                if (
                                    this.room.playRounds[this.room.playRound].scores &&
                                    this.room.playRounds[this.room.playRound].scores[this.user.id]
                                ) {
                                    shared.game.msgHandler.sendMessage(
                                        shared.game.ptmain.$t("multiplayer.tips.waitingForOthers")
                                    );
                                    shared.game.ptmain.$router.replace("/multipanel");
                                    break;
                                } else {
                                    if (shared.game.ptmain.$route.path != "/playing" && !this.chartLoaded) {
                                        shared.game.msgHandler.sendMessage(
                                            shared.game.ptmain.$t("multiplayer.tips.chartLoaded")
                                        );
                                        this.loadLastChart();
                                    }
                                }
                                break;
                            case 4:
                                //所有人打完（包括退出者），显示成绩即可
                                shared.game.msgHandler.sendMessage(
                                    shared.game.ptmain.$t("multiplayer.tips.thisRoundIsOver")
                                );
                                this.showStat();
                                break;
                            case 5:
                                //有人完成加载但不是所有人，游戏未开始，载谱
                                if (!this.chartLoaded) {
                                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.tips.loadingChart"));
                                    this.loadLastChart();
                                }
                                break;
                        }
                        res();
                    });
                } catch {
                    rej();
                }
            });
        },
        async recoverMulti(lastMultiInfo) {
            this.wsConn = lastMultiInfo.wsConn;
            try {
                await wsHandler.connect(this.wsConn, null);
            } catch {
                shared.game.msgHandler.warning(
                    shared.game.ptmain.$t("multiplayer.recoverMultiFailed")
                );
                localStorage.removeItem("lastMultiInfo");
                ploading.r("recoverMulti");
                ploading.r("wsRec");
            }
            shared.game.ptmain.gameMode = "multi";
            this.room = lastMultiInfo.room;
            this.user = lastMultiInfo.user;
            this.owner = this.room.owner === this.user.id;

            await this.recoverRoomStage();

            ploading.r("recoverMulti");
            this.renewEvents();
            shared.game.graphicHandler.register("whilePlayingHook", jitsRenderer);
            shared.game.ptmain.gameConfig.defaultRankMethod &&
                (this.rankMethod = shared.game.ptmain.gameConfig.defaultRankMethod);
            this.JITSOpen = shared.game.ptmain.gameConfig.JITSOpen;


        },
        loadLastChart() {
            for (let i = 0; i < this.evts.length; i++) {
                const thisevt = this.evts[i];
                if (thisevt.type == "loadChart") {
                    this.loadChartFirst(thisevt.extraInfo);
                    break;
                }
            }
        },
        doCreateRoom(roomid, server_addr, description, pub) {
            shared.game.ptmain.gameConfig.defaultRankMethod &&
                (this.rankMethod = shared.game.ptmain.gameConfig.defaultRankMethod);
            this.JITSOpen = shared.game.ptmain.gameConfig.JITSOpen;
            this.SERVERADDR = server_addr;
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let request = new Request(
                `${location.protocol}//${this.SERVERADDR}/api/multi/createRoom/${roomid}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        access_token:
                            shared.game.ptmain.gameConfig.account.tokenInfo
                                .access_token,
                        compete_mode: shared.game.ptmain.gameConfig.competeMode,
                        "public": pub,
                        description
                    }),
                    headers: myHeaders,
                }
            );
            fetch(request)
                .then((response) => response.json())
                .then((result) => {
                    ploading.r("createRoom");
                    if (result.code != 0) {
                        shared.game.msgHandler.failure(shared.game.ptmain.$t(`serverMsg.${result.msg}`));
                        return;
                    }
                    showTransition.checked = true;
                    shared.game.ptmain.gameMode = "multi";
                    this.owner = true;
                    this.room = result.selfRoom;
                    this.user = result.selfUser;
                    this.evts = this.room.evt.reverse();
                    this.wsConn = result.wsConn;
                    localStorage.lastMultiInfo = JSON.stringify({
                        room: this.room,
                        user: this.user,
                        wsConn: result.wsConn,
                    });
                    for (const i of $$$(".hideForMultiRoomOwner"))
                        i.style.display = "none";
                    shared.game.ptmain.$router.replace("/multipanel");
                    shared.game.msgHandler.sendMessage(
                        shared.game.ptmain.$t("multiplayer.tips.afterCreated.roomOwner")
                    );
                    this.renewEvents();
                    const shareInfo = shared.game.ptmain.$t("multiplayer.doCreateRoom.shareInfo", [window.location.protocol, window.location.host, this.room.id]);
                    shared.game.msgHandler
                        .confirm(
                            shared.game.ptmain.$t("multiplayer.doCreateRoom.copyShareInfoConfirm", { shareInfo }),
                            shared.game.ptmain.$t("multiplayer.doCreateRoom.copyShareInfo"),
                            shared.game.ptmain.$t("info.confirm"),
                            shared.game.ptmain.$t("info.cancel")
                        )
                        .then(async (e) => {
                            if (e) {
                                try {
                                    await navigator.clipboard.writeText(shareInfo);
                                } catch (e) {
                                    document.oncontextmenu = (e) => {
                                        return;
                                    };
                                    document.body.style.userSelect = "text", document.documentElement.style.userSelect = "text", document.querySelector(".main").style.userSelect = "text";
                                    await shared.game.msgHandler.failure(
                                        shared.game.ptmain.$t("multiplayer.doCreateRoom.autoCopyFailed", { shareInfo })
                                    );
                                    document.oncontextmenu = (e) =>
                                        e.preventDefault();
                                    document.body.style.userSelect = "none", document.documentElement.style.userSelect = "none", document.querySelector(".main").style.userSelect = "none";
                                }
                            }
                        });
                })
                .catch((e) => {
                    shared.game.msgHandler.sendMessage(
                        shared.game.ptmain.$t("multiplayer.doCreateRoom.failed"),
                        "error"
                    );
                    ploading.r("createRoom");
                });
        },
        doJoinRoom(roomid, server_addr) {
            shared.game.ptmain.gameConfig.defaultRankMethod &&
                (this.rankMethod = shared.game.ptmain.gameConfig.defaultRankMethod);
            this.JITSOpen = shared.game.ptmain.gameConfig.JITSOpen;
            this.SERVERADDR = server_addr;
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let request = new Request(
                `${location.protocol}//${this.SERVERADDR}/api/multi/joinRoom/${roomid}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        access_token:
                            shared.game.ptmain.gameConfig.account.tokenInfo
                                .access_token,
                    }),
                    headers: myHeaders,
                }
            );
            fetch(request)
                .then((response) => response.json())
                .then((result) => {
                    ploading.r("joinRoom");
                    if (result.code != 0) {
                        shared.game.msgHandler.failure(shared.game.ptmain.$t(`serverMsg.${result.msg}`));
                        return;
                    }
                    showTransition.checked = true;
                    shared.game.ptmain.gameMode = "multi";
                    this.room = result.selfRoom;
                    this.user = result.selfUser;
                    this.wsConn = result.wsConn;
                    this.evts = this.room.evt.reverse();
                    localStorage.lastMultiInfo = JSON.stringify({
                        room: this.room,
                        user: this.user,
                        wsConn: result.wsConn,
                    });
                    for (const i of $$$(".hideForMultiRoomOwner"))
                        i.style.display = "none";
                    for (const i of $$$(".hideForMultiRegularPlayer"))
                        i.style.display = "none";
                    shared.game.msgHandler.sendMessage(
                        shared.game.ptmain.$t("multiplayer.tips.afterCreated.player", [this.room.players[this.room.owner]["name"]])
                    );
                    shared.game.ptmain.$router.replace("/multipanel");
                    this.renewEvents();
                })
                .catch((e) => {
                    shared.game.msgHandler.sendMessage(
                        shared.game.ptmain.$t("multiplayer.joinRoom.failed"),
                        "error"
                    );
                    ploading.r("joinRoom");
                });
        },
        async actionPlayer(id, name, exited) {
            if (this.owner && id != this.user.id && !exited) {
                if (
                    !(await shared.game.msgHandler.confirm(shared.game.ptmain.$t("multiplayer.actionPlayer.confirm", { name })))
                )
                    return;
                setTimeout(async () => {
                    if (
                        (await shared.game.msgHandler.confirm(shared.game.ptmain.$t("multiplayer.actionPlayer.askForAction", { name }), shared.game.ptmain.$t("info.info"), shared.game.ptmain.$t("multiplayer.actionPlayer.actions.kickPlayer"), shared.game.ptmain.$t("multiplayer.actionPlayer.actions.transferOwnerShip")))
                    )
                        wsHandler.send("kickPlayer", id);
                    else {
                        if (this.room.compete_mode) {
                            shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.actionPlayer.error_competeMode"));
                            return;
                        }
                        wsHandler.send("transferOwnerShip", id);
                    }
                }, 500);
            }
        },
        exitRoom() {
            if (this.room.compete_mode && !this.owner) {
                shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.exitRoom.error_competeMode"), "error");
                return;
            }
            if (this.gaming) {
                playController.stop();
                this.gaming = false;
            }
            this.selfExit = true;
            wsHandler.send("kickPlayer", this.user.id);
        },
        lockRoom() {
            ploading.l(shared.game.ptmain.$t("multiplayer.lockRoom.locking"), "lockRoom", true);
            wsHandler
                .send("lockRoom")
                .then(async () => {
                    ploading.r("lockRoom");
                    await shared.game.msgHandler.success(
                        shared.game.ptmain.$t("multiplayer.lockRoom.locked")
                    );
                    shared.game.ptmain.$router.replace("/chartSelect");
                })
                .catch(() => {
                    ploading.r("lockRoom");
                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.lockRoom.err"), "error");
                });
        },
        sendMsg() {
            const content = $("sendMsgInput");
            const btn = $("msgSend");
            if (!content.value) {
                shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.sendMsg.cantBeEmpty"), "error");
                return;
            }
            content.classList.add("disabled");
            btn.classList.add("disabled");
            wsHandler.send("userMsg", content.value)
                .then(() => {
                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.sendMsg.success"));
                    content.value = "";
                    content.classList.remove("disabled");
                    btn.classList.remove("disabled");
                })
                .catch(() => {
                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.sendMsg.failed"), "error");
                    content.classList.remove("disabled");
                    btn.classList.remove("disabled");
                });
        },
        getDifficultyActual(chartInfo) {
            if (typeof chartInfo.difficulty === "string") return chartInfo.difficulty;
            else return chartInfo.difficulty === 0
                ? "?"
                : Math.floor(chartInfo.difficulty).toString();
        },
        updateRankList(force = false) {
            this.timeStr = `${new Date().format("Y-m-d H:i:s")}`;
            // 对每轮成绩排名
            let l = this.room["playRounds"];
            if (force) {
                this.roundRanked = [];
            }
            const rankedRoundNum = this.roundRanked.length;
            for (let i = rankedRoundNum; i < l.length; i++) {
                let qt = l[i];
                let tmp = [];
                if (!qt.finished) break;
                for (const t in qt.scores) {
                    qt.scores[t]["id"] = t;
                    tmp.push(qt.scores[t]);
                }
                tmp = this.sortByKey(
                    tmp,
                    this.rankMethod === "score" ? "scoreNum" : "accNum",
                    false
                );
                if (this.exited) {
                    this.roundRanked.push({ scores: tmp, chartInfo: qt.chartInfo });
                } else {
                    this.roundRanked.unshift({ scores: tmp, chartInfo: qt.chartInfo });
                }
            }

            //用户排
            this.rankedUser = [];
            for (const i in this.room.players) {
                if (this.room.compete_mode && this.room.players[i].id == this.room.owner) continue;
                this.rankedUser.push(this.room.players[i]);
            }
            this.rankedUser = this.sortByKey(
                this.rankedUser,
                this.rankMethod === "score" ? "scoreAvg" : "accAvg",
                false
            );
        },
        renewRoomInfoAll() {
            return new Promise((res, rej) => {
                wsHandler.send("getRoomInfo").then((result) => {
                    this.room = result;
                    this.user = result["players"][this.user.id];
                    this.updateRankList();
                    res(true);
                });
            });
        },
        updateJITS() {
            let rk = [];
            for (const i in JITSData.all) {
                rk.push(JITSData.all[i]);
            }
            rk = this.sortByKey(
                rk,
                this.rankMethod === "score" ? "score" : "acc",
                false
            );
            const len = rk.length;
            let me;
            if (this.room.compete_mode && this.owner) {
                me = rk.findIndex((x) => x["id"] == this.watchUserId);
                if (me < 0) {
                    me = 0;
                    this.watchUserId = rk[0]["id"];
                }
            } else {
                me = rk.findIndex((x) => x["id"] == this.user.id);
                if (me < 0) {
                    JITSData.all = {};
                    JITSData.currRank = null;
                    return;
                }
            }


            rk[me].me = true;
            JITSData.currRank = me + 1;
            if (len <= 3) {
                const g = [];
                for (let i = 0; i < len; i++) {
                    g.push({ ...rk[i], r: i + 1 });
                }
                JITSData.tidp = g;
            } else {
                if (me === 0) {
                    JITSData.tidp = [
                        { ...rk[0], r: 1 },
                        { ...rk[1], r: 2 },
                        { ...rk[2], r: 3 },
                    ];
                } else if (me === len - 1) {
                    JITSData.tidp = [
                        { ...rk[me - 2], r: me - 1 },
                        { ...rk[me - 1], r: me },
                        { ...rk[me], r: me + 1 },
                    ];
                } else {
                    JITSData.tidp = [
                        { ...rk[me - 1], r: me },
                        { ...rk[me], r: me + 1 },
                        { ...rk[me + 1], r: me + 2 },
                    ];
                }
            }
            //console.log(JITSData.tidp)
        },
        JITSStart() {
            this.JITSStop();
            this.JITSTimer = setInterval(() => {
                this.updateJITS();
                if (!(this.room.compete_mode && this.owner)) {
                    const stat = shared.game.stat;
                    let jd = {
                        acc: stat.accNum,
                        score: stat.scoreNum,
                        first: false,
                    };
                    JITSData.all[this.user.id].acc = jd.acc;
                    JITSData.all[this.user.id].score = jd.score;

                    wsHandler.send("JITS", jd).catch(() => { });
                }
            }, 500);
        },
        JITSStop() {
            if (this.JITSTimer) clearInterval(this.JITSTimer);
        },
        renewEvents() {
            const that = this;
            let t;
            function processEvt(thisevt) {
                switch (thisevt.type) {
                    case "JITS":
                        if (thisevt.extraInfo.id === that.user.id) return;
                        JITSData.all[thisevt.extraInfo.id] = thisevt.extraInfo;
                        return;
                    case "allJITS":
                        JITSData.all = thisevt.extraInfo;
                        that.updateJITS();
                        return;
                    case "userMsg":
                        if (shared.game.ptmain.$route.path !== "/playing" && (!that.panelOpen || that.panelChoice != "messages")) {
                            shared.game.msgHandler.sendMessage(shared.game.multiInstance.parseServerMsg(thisevt, false));
                        }
                        break;
                    case "ownerChanged":
                        const ownerback = that.owner;
                        that.room.owner = thisevt.extraInfo;
                        that.owner = (that.user.id == thisevt.extraInfo);
                        that.user.isOwner = that.owner;
                        that.room.players[thisevt.extraInfo].isOwner = that.owner;
                        localStorage.lastMultiInfo = JSON.stringify({
                            room: that.room,
                            user: that.user,
                            wsConn: that.wsConn,
                        });
                        if (that.owner) {
                            shared.game.msgHandler.warning(that.$t("multiplayer.tips.becameRoomOwner"));
                            that.recoverRoomStage();
                        } else if (ownerback) {
                            switch (that.room.stage) {
                                case 0:
                                    // 房间未锁定，忽略
                                    shared.game.ptmain.$router.replace("/multipanel");
                                    shared.game.msgHandler.sendMessage(
                                        that.$t("multiplayer.tips.afterCreated.player", [that.room.players[that.room.owner]["name"]])
                                    );
                                    for (const i of $$$(".disabled-when-selected"))
                                        i.classList.remove("disabled");
                                    break;
                                case 1:
                                    // 房主选谱，忽略
                                    for (const i of $$$(".disabled-when-selected"))
                                        i.classList.remove("disabled");
                                    shared.game.msgHandler.sendMessage(
                                        that.$t("multiplayer.tips.selectChart.player")
                                    );
                                    shared.game.ptmain.$router.replace("/multipanel");
                                    break;
                            }
                        }
                        break;
                    case "reOnline":
                        that.room.players[thisevt.extraInfo] &&
                            (that.room.players[thisevt.extraInfo].online = true);
                        break;
                    case "offline":
                        that.room.players[thisevt.extraInfo] &&
                            (that.room.players[thisevt.extraInfo].online = false);
                        break;
                    case "join":
                        let thisplayer = thisevt.extraInfo;
                        that.room.playerNumber++;
                        that.room.players[thisplayer["id"]] = thisplayer;
                        break;
                    case "close":
                        shared.game.msgHandler.info(that.$t("multiplayer.roomClosed"));
                        localStorage.removeItem("lastMultiInfo");
                        that.room = thisevt.extraInfo;
                        that.evts = thisevt.extraInfo.evt.reverse();
                        if (that.room.stage == 0) {
                            wsHandler.close();
                            that.CLEAR_DATA_AND_BACK_TO_SINGLEPLAYER();
                        } else
                            (that.exited = true),
                                (that.room.closed = true),
                                playController.stop(),
                                that.showStat("playerRank");
                        break;
                    case "exit":
                        if (thisevt.extraInfo.id === that.user.id) {
                            if (thisevt.extraInfo.type === 1 && !that.selfExit) break;
                            localStorage.removeItem("lastMultiInfo");
                            (that.exited = true),
                                playController.stop();
                            shared.game.msgHandler.info(that.$t("multiplayer.exitRoom.exited")).then(async () => {
                                localStorage.removeItem("lastMultiInfo");
                                if (that.room.stage == 0) {
                                    wsHandler.close();
                                    that.CLEAR_DATA_AND_BACK_TO_SINGLEPLAYER();
                                } else
                                    that.showStat("playerRank");
                            });
                        } else {
                            if (that.room.stage == 0)
                                delete that.room.players[thisevt.extraInfo.id];
                            else that.room.players[thisevt.extraInfo.id].exited = true;
                        }
                        break;
                    case "lock":
                        that.room.stage = 1;
                        shared.game.graphicHandler.register(
                            "whilePlayingHook",
                            jitsRenderer
                        );
                        shared.game.msgHandler.sendMessage(that.$t("multiplayer.tips.locked"));
                        break;
                    case "loadChart":
                        that.room.stage = 5;
                        that.loadChartFirst(thisevt.extraInfo);
                        break;
                    case "gameStart":
                        that.room.stage = 3;
                        if (that.chartLoaded) {
                            that.launchGame(true);
                        }
                        break;
                    case "allLoadFinish":
                        that.room.stage = 2;
                        const t = document.getElementById("waitMsg");
                        if (t) t.innerHTML = shared.game.ptmain.$t("multiplayer.tips.waitingToStart");
                        if (that.owner && that.chartLoaded) {
                            that.gameStartUI();
                        }
                        break;
                    case "sbScoreUploaded":
                        that.room.players[thisevt.extraInfo.id] = thisevt.extraInfo;
                        break;
                    case "allScoreUploaded":
                        shared.game.msgHandler.sendMessage(
                            that.$t("multiplayer.tips.scoreAllUploaded")
                        );
                        that.room.stage = 4;
                        if (that.room.playRounds.length - 1 < thisevt.extraInfo.n)
                            that.room.playRounds.push(thisevt.extraInfo);
                        else that.room.playRounds[thisevt.extraInfo.n] = thisevt.extraInfo;
                        setTimeout(() => {
                            shared.game.ptmain.$route.path !== "/multipanel" && (that.room.stage === 4) &&
                                that.showStat();
                        }, 10000);
                        break;
                    case "nextTrack":
                        playController.stop();
                        that.room.stage = 1;
                        that.chartLoaded = false;
                        that.room.playRound++;
                        for (const i of $$$(".disabled-when-selected"))
                            i.classList.remove("disabled");
                        if (that.owner) {
                            shared.game.ptmain.$router.replace("/chartSelect");
                            shared.game.msgHandler.sendMessage(
                                that.$t("multiplayer.tips.nextRoundStarted.roomOwner")
                            );
                        } else {
                            shared.game.ptmain.$router.replace("/multipanel");
                            shared.game.msgHandler.sendMessage(
                                that.$t("multiplayer.tips.nextRoundStarted.player")
                            );
                        }
                        break;
                    default:
                        break;
                }
                that.evts.unshift(thisevt);
            }
            wsHandler.connect(this.wsConn, processEvt);
        },
        sortByKey(array, key, order) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                if (order) {
                    return x < y ? -1 : x > y ? 1 : 0;
                } else {
                    return x < y ? (x > y ? 1 : 0) : -1;
                }
            });
        },
        showStat(s = "roundRank") {
            this.panelChoice = s;
            this.updateRankList();
            shared.game.ptmain.$router.replace("/multipanel");
        },
        async loadChartFirst(info) {
            this.chartLoaded = false;
            this.speedInfo = info.speedInfo;

            if (info.songData.song.startsWith("/PTVirtual/")) {
                // 本地谱面
                const check = await checkLocalChart(info.songData.id);
                if (!check) {
                    // 本地没有，不能加载，要求用户上传
                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.cantFindChartLocally", [info.songData.name, info.songData.id]));
                    // 为后面进detail作准备
                    sessionStorage.setItem("loadedChart", JSON.stringify(info.chartData));
                    sessionStorage.setItem("chartDetailsData", JSON.stringify(info.songData));
                    // 跳转到上传页
                    shared.game.ptmain.$router.replace({ path: "/chartUpload", query: { target: info.songData.id } });
                    return;
                }
            }

            ploading.l(shared.game.ptmain.$t("loadChart.loading"), "loadChart");
            shared.game.ptmain.loadChart(
                info.songData,
                info.chartData,
                this.loadChartSecond
            );
            shared.game.ptmain.$router.replace({
                path: "/chartSelect",
                query: { toSyncOrPlay: 3 },
            });
        },
        async loadChartSecond(songInfo, chartInfo) {
            const getPlayToken = async () => {
                const chartData = JSON.parse(sessionStorage.getItem("loadedChart"));
                if (!shared.game.ptmain.shouldNotUploadPhiZone) {
                    try {
                        await shared.game.ptmain.genPlayToken();
                    } catch(e) {
                        shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.failed_tryAfter3Sec"), "error");
                        setTimeout(updateLoadFinish, 3000);
                        return; 
                    }
                } 
                return;
            }
            this.chartLoaded = true;
            recordMgr.chartInfo = {
                songData: songInfo,
                chartData: chartInfo,
                speedInfo: this.speedInfo,
            };
            await getPlayToken();
            if (this.owner && this.room.stage === 2) {
                this.gameStartUI();
                ploading.r("loadChart");
                return;
            }
            if (this.room.stage === 3) {
                this.launchGame();
                ploading.r("loadChart");
                return;
            }
            const updateLoadFinish = async () => {
                try {
                    await wsHandler.send("loadChartFinish");
                } catch (e) {
                    ploading.r("playChart");
                    ploading.r("loadChart");
                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.failed_tryAfter3Sec"), "error");
                    setTimeout(updateLoadFinish, 3000);
                    return;
                }
            };
            updateLoadFinish();
        },
        launchGame(direct = false) {
            const startDirect = () => {
                this.panelOpen = false;
                this.gaming = true;
                // document.getElementById("gameAdjust").style.display = "block";
                shared.game.ptmain.playChart({
                    speed: this.speedInfo.disp,
                    mirror: false,
                    practiseMode: false,
                    previewMode: false,
                    adjustOffset: false,
                });
                ploading.r("waitToStartGame");
            };
            if (!(this.room.compete_mode && this.owner)) {
                wsHandler.send("JITS", {
                    first: true,
                    score: 0,
                    acc: 0,
                });
            }
            this.JITSStart();
            if (direct) {
                startDirect();
                return;
            }
            shared.game.msgHandler
                .warning(shared.game.ptmain.$t("multiplayer.gameStartedWarning.body"), shared.game.ptmain.$t("multiplayer.gameStartedWarning.title"), shared.game.ptmain.$t("info.confirm"))
                .then(() => {
                    if (this.chartLoaded === false) {
                        shared.game.msgHandler.sendMessage(
                            shared.game.ptmain.$t("multiplayer.gameStartedWarning.chartStillLoading")
                        );
                        return;
                    }
                    startDirect();
                });
        },
        syncChart(songData, chartData, speed) {
            return new Promise((res, rej) => {
                if (songData.origin) {
                    if (songData.origin.song) songData.song = songData.origin.song;
                    if (songData.origin.illustration) songData.illustration = songData.origin.illustration;
                    delete songData.origin;
                }
                if (chartData.origin) {
                    if (chartData.origin.chart) chartData.chart = chartData.origin.chart;
                    delete chartData.origin;
                }
                const speedInfo = {
                    val: 0,
                    disp: speed,
                };
                for (const i of $$$(".disabled-when-selected"))
                    i.classList.add("disabled");
                wsHandler
                    .send("syncChartInfo", {
                        songData,
                        chartData,
                        speedInfo,
                    })
                    .then(() => {
                        ploading.l(
                            shared.game.ptmain.$t("multiplayer.waitToStartGame"),
                            "waitToStartGame"
                        );
                        this.room.stage = 5;
                        res(true);
                    })
                    .catch(() => rej(false));
            });
        },
        gameStartUI() {
            shared.game.msgHandler
                .success(
                    shared.game.ptmain.$t("multiplayer.gameStartUI.body"),
                    shared.game.ptmain.$t("multiplayer.gameStartUI.title"),
                    shared.game.ptmain.$t("multiplayer.gameStartUI.start")
                )
                .then((e) => {
                    this.gameStart().catch(() => {
                        shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.failed_tryAfter3Sec"), "error");
                        setTimeout(this.gameStart, 3000);
                    });
                });
        },
        gameStart() {
            return wsHandler.send("startGamePlay");
        },
        uploadScore() {
            this.JITSStop();
            const stat = shared.game.stat;
            let scoreData = {
                accNum: stat.accNum,
                accStr: stat.accStr,
                all: stat.all,
                bad: stat.bad,
                good: stat.good,
                great: stat.great,
                perfect: stat.perfect,
                scoreNum: stat.scoreNum,
                scoreStr: stat.scoreStr,
                maxcombo: stat.maxcombo,
                extra: "",
                playbackFile: shared.game.recordMgr.export()[0],
            };
            if (stat.lineStatus == 1 || stat.lineStatus == 2)
                scoreData.extra = "ALL PERFECT";
            else if (stat.lineStatus == 3) scoreData.extra = "FULL COMBO";
            wsHandler
                .send("uploadScoreInfo", scoreData)
                .then(async (res) => {
                    this.gaming = false;
                })
                .catch(() => {
                    shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.uploadFailed_tryAfter3Sec"));
                    setTimeout(this.uploadScore, 3000);
                });
        },
        nextTrack() {
            wsHandler.send("nextTrack");
        },

        scoreStr(t) {
            const a = t.toFixed(0);
            return "0".repeat(a.length < 7 ? 7 - a.length : 0) + a;
        },

        // captureImage(area) {
        //   const element = document.querySelector(`#${area}`);
        //   if (
        //     getComputedStyle(document.body)["color"].toString() ==
        //     "rgb(255, 255, 255)"
        //   ) {
        //     //via夜间模式
        //     element.style.background = "black";
        //   }
        //   html2canvas(element, {
        //     useCORS: true, // 【重要】开启跨域配置
        //     scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
        //     allowTaint: true, // 允许跨域图片
        //   }).then((canvas) => {
        //     const imgData = canvas.toDataURL("image/jpeg", 1.0);
        //     this.imgData = imgData;
        //     this.imgTitle == `result${new Date().getTime()}.jpg`;
        //     this.panelChoice = 9998;
        //   });
        // },
        // downloadFile() {
        //   let content = this.imgData;
        //   let fileName = this.imgTitle;
        //   let aLink = document.createElement("a");
        //   aLink.download = fileName;
        //   aLink.href = content;
        //   aLink.click();
        // },
    },
    watch: {
        rankFull: {
            handler(newVal, oldVal) {
                if (newVal) shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("multiplayer.tips.exitRankFull"));
            },
        },
        panelOpen: {
            handler(newVal, oldVal) {
                if (newVal) {
                    document.body.style.overflow = "hidden";
                    window.scrollTo(0, 0);
                } else {
                    document.body.style.overflow = "scroll";
                }
            },
        },
        panelChoice: {
            handler(newVal, oldVal) {
                if (["playerRank", "roundRank"].includes(newVal)) {
                    this.updateRankList();
                }
            },
        },
        rankMethod: {
            handler(newVal, oldVal) {
                shared.game.ptmain.gameConfig.defaultRankMethod = newVal;
            },
        },
        exited: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.JITSStop();
                    this.roundRanked = this.roundRanked.reverse();
                    wsHandler.close();
                }
            },
        },
    },
    computed: {
        pzResUrlGlobal() {
            "res.phizone.cn";
        },
        evtsShow() {
            return this.evts.slice(0, 30);
        },
        verStr() {
            return spec.thisVersion;
        },
        aprFlMsg() {
            return partyMgr.list.aprfool2024.activate ? {
                lockRoom: "车门焊死",
                exitRoom: "下车",
                closeRoom: "炸车"
            } : {
                lockRoom: this.$t('multiplayer.multiActions.lockRoom'),
                exitRoom: this.$t('multiplayer.multiActions.exitRoom'),
                closeRoom: this.$t('multiplayer.multiActions.closeRoom')
            }
        }
    },
};

const showTransition = $("showTransition");
</script>

<template>
    <div>
        <div class="cover-mask" v-if="panelOpen"></div>
        <div :class="{ cover: true, coverFull: rankFull }" v-if="panelOpen">
            <div v-if="!forceOpen" style="display: block;float: right;position: absolute;right: .6em;top: 0.3em;"><input
                    type="button" id="close" v-on:click="panelOpen = false" style="background:unset;" value="❌"></div>
            <div class="panelSwitcher"
                v-if="room.stage > 0 && (['messages', 'playerRank', 'roundRank', 'players'].includes(panelChoice))">
                <div>
                    <input type="radio" id="pnc4" name="panelChoice" v-model="panelChoice" value="messages">
                    <label for="pnc4"> {{ $t("multiplayer.panels.messages.title") }} </label>
                </div>
                <div>
                    <input type="radio" id="pnc0" name="panelChoice" v-model="panelChoice" value="players">
                    <label for="pnc0"> {{ $t("multiplayer.panels.playerList.title") }} </label>
                </div>
                <div>
                    <input type="radio" id="pnc2" name="panelChoice" v-model="panelChoice" value="roundRank">
                    <label for="pnc2"> {{ $t("multiplayer.panels.roundRank.title") }} </label>
                </div>
                <div>
                    <input type="radio" id="pnc3" name="panelChoice" v-model="panelChoice" value="playerRank">
                    <label for="pnc3"> {{ $t("multiplayer.panels.playerRank.title") }} </label>
                </div>
            </div>
            <div class="divider">——— {{ $t("multiplayer.operations") }} ———</div>
            <div id="multiActions">
                <input type="button" id="switchRankMethod2" v-on:click="switchRankMethod()"
                    v-bind:value='rankMethod === "score" ? $t("multiplayer.multiActions.switchToRankByAcc") : $t("multiplayer.multiActions.switchToRankByScore")'
                    v-if="(['playerRank', 'roundRank'].includes(panelChoice))">
                <input type="button" v-on:click="nextTrack()" :value="$t('multiplayer.multiActions.nextTrack')"
                    v-if="(['messages', 'playerRank', 'roundRank', 'players'].includes(panelChoice)) && owner && room.stage === 4 && !exited">
                <input type="button" id="lockRoom" v-on:click="lockRoom()" :value="aprFlMsg.lockRoom"
                    v-if="(['messages', 'playerRank', 'roundRank', 'players'].includes(panelChoice)) && owner && room.stage === 0">
                <input type="button" id="exitRoom" v-on:click="exitRoom()"
                    v-bind:value='owner ? aprFlMsg.closeRoom : aprFlMsg.exitRoom'
                    v-if="(['messages', 'playerRank', 'roundRank', 'players'].includes(panelChoice)) && !exited">
                <input type="button" v-on:click="rankFull = true" :value='$t("multiplayer.multiActions.rankFull")'
                    v-if="(['playerRank', 'roundRank'].includes(panelChoice)) && exited">
                <input type="button" v-on:click="downloadAllPlayBack()"
                    :value='$t("multiplayer.multiActions.downloadAllPlayBack")'
                    v-if="(['playerRank', 'roundRank'].includes(panelChoice)) && !exited && (!room.compete_mode || owner)">
                <input type="button"
                    v-if="(['messages', 'playerRank', 'roundRank', 'players'].includes(panelChoice)) && exited"
                    :value="$t('multiplayer.multiActions.backToSingle')" @click="CLEAR_DATA_AND_BACK_TO_SINGLEPLAYER()">
            </div><br>
            <div class="divider">——— {{ $t("multiplayer.panels.messages.title") }} ———</div>
            <div v-if="panelChoice == 'messages' || room.stage === 0">
                <h1 v-if="room.stage !== 0">{{ $t("multiplayer.panels.messages.messagesList") }}</h1>
                <div id="sendMsg" style="margin: 15px;">
                    <input id="sendMsgInput" class="input" style="width: 15em;max-width: 100%;"
                        :placeholder="$t('multiplayer.panels.messages.msgInputPlaceholder')">
                    <input type="button" id="msgSend" :value="$t('multiplayer.panels.messages.send')"
                        @click="sendMsg()">
                </div>
                <div class="boxbox">
                    <div class="evtbox">
                        <p v-for="item, i in evtsShow">
                            <span v-if="item.type" v-bind:type="item.type">{{ parseServerMsg(item) }}</span>
                            <span v-else>{{ parseServerMsg(item) }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="panelChoice == 'players' || room.stage === 0">
                <h1> {{ $t("multiplayer.panels.playerList.title") }} </h1>
                <div class="boxbox" v-if="room && room.players">
                    <div class="scorebox multi-player-list">
                        <p v-for="item, i in room.players"
                            v-bind:style="{ color: ((!item.online) ? 'grey' : (item.id === room.owner ? 'red' : 'unset')), display: item.exited === 0 ? 'flex' : 'none' }"
                            v-on:click="actionPlayer(item.id, item.name, item.exited)">
                            <div :style="{ backgroundImage: 'url(' + item.avatar.replace('res.phi.zone', pzResUrlGlobal) + ')', filter: (!item.online) ? 'grayscale(1)' : 'unset', border: '3px solid ' + (item.id === room.owner ? 'red' : 'var(--color-box-border)') }"
                                class="multi-user-avatar">
                                {{ item.name }}
                            </div>
                        </p>
                    </div>
                </div>
            </div>
            <div :class="{ coverFull: rankFull, coverFullScore: true }"
                v-if="['playerRank', 'roundRank'].includes(panelChoice)">
                <div :class="{ scoreMainContainer: true, noHeaderExtraPadding: !exited }">
                    <div id="scoreHeader" class="color-primary" v-if="exited">
                        <div id="scoreLogo" v-on:click="rankFull = false"></div>
                        <div id="scoreTitle" v-on:click="rankFull = false"><b>Phi</b>Together</div>
                        <div id="scoreExtraInfo">
                            <div id="scoreVersion"> {{ $t("multiplayer.panels.rank.genVer", { verStr }) }} </div>
                            <div id="scoreTime">
                                <b>{{ timeStr }}</b>
                            </div>
                            <div>{{ rankMethod === "score" ? $t("multiplayer.multiActions.rankedByScore") :
                                $t("multiplayer.multiActions.rankedByAcc") }}</div>
                        </div>
                    </div>
                    <div id="scoreContent">
                        <div class="scoreRanking scoreRankingNoPic">
                            <div class="scoreRankingTitle color-primary">
                                {{ $t("multiplayer.panels.rank.totalRanking") }}
                            </div>
                            <div class="scoreRankingBody">
                                <div class="scoreRankingBodyColum">
                                    <div class="scoreRankingEle" v-for="item, i in rankedUser">
                                        <div class="scoreRankingNum">{{ i + 1 }}</div>
                                        <div class="scoreRankingUserName color-primary"
                                            :style="{ color: item.id === user.id ? 'red' : ((item.playRecord.length - 1) == room.playRound ? 'var(--color-text-primary)' : 'grey') }">
                                            {{ item.name }}</div>
                                        <div class="scoreRankingExtra">{{ (item.accAvg * 100).toFixed(2) }}%
                                            {{ scoreStr(item.scoreAvg) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="panelChoice == 'roundRank'">
                            <div class="scoreRanking scoreRankingPic" v-for="round, it in roundRanked">
                                <div class="scoreRankingBody">
                                    <div class="scoreRankingBodyColum">
                                        <div class="scoreRankingBodyLR">
                                            <div class="scoreSongCard">
                                                <img :src="round.chartInfo.songData.illustration">
                                                <div class="songCardCover"
                                                    :style="{ '--bg': 'url(' + round.chartInfo.songData.illustration + ')' }">
                                                    <div class="songCardName">
                                                        {{ round.chartInfo.songData.name }}
                                                        {{ round.chartInfo.speedInfo.disp ? "(" +
                                                        round.chartInfo.speedInfo.disp + ")" : "" }}
                                                    </div>
                                                    <div class="songCardLevel">
                                                        {{ round.chartInfo.chartData.level }}
                                                        {{ getDifficultyActual(round.chartInfo.chartData) }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="scoreRankingEle"
                                                v-for="item, i in getScoresLR(round.scores, 'l')">
                                                <div class="scoreRankingNum">{{ i + 1 }}</div>/
                                                <div class="scoreRankingUserName color-primary"
                                                    @click="wrappedSinglePlayBack(it, item.id, 0)"
                                                    :style="{ color: item.id === user.id ? 'red' : 'var(--color-text-primary)' }">
                                                    {{ item.name }}</div>
                                                <div class="scoreRankingExtra">{{ item.accStr }} {{ item.scoreStr }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="scoreRankingBodyLR">
                                            <div class="scoreRankingEle"
                                                v-for="item, i in getScoresLR(round.scores, 'r')">
                                                <div class="scoreRankingNum">{{ i + 1 + getScoresLR(round.scores, 'n')
                                                    }}
                                                </div>
                                                <div class="scoreRankingUserName color-primary"
                                                    @click="wrappedSinglePlayBack(it, item.id, 0)"
                                                    :style="{ color: item.id === user.id ? 'red' : 'var(--color-text-primary)' }">
                                                    {{ item.name }}</div>
                                                <div class="scoreRankingExtra">{{ item.accStr }} {{ item.scoreStr }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="panelChoice === 'playerRank'">
                            <div class="scoreRanking scoreRankingPerson">
                                <div class="scoreRankingTitle color-primary">
                                    {{ $t("multiplayer.panels.playerRank.my", [user.name]) }}
                                </div>
                                <div class="scoreRankingBody">
                                    <div class="scoreRankingBodyColum">
                                        <div class="scoreRankingCardEle"
                                            v-for="item, i in room.players[user.id].playRecord">
                                            <div class="scoreSongCard"
                                                v-if="roundRanked[(exited ? i : (roundRanked.length - i - 1))] && roundRanked[(exited ? i : (roundRanked.length - i - 1))].chartInfo">
                                                <img
                                                    :src="roundRanked[(exited ? i : (roundRanked.length - i - 1))].chartInfo.songData.illustration">
                                                <div class="songCardCoverAll"
                                                    @click="wrappedSinglePlayBack(i, user.id, 1)">
                                                    <div class="songCardID">#{{ i + 1 }}</div>
                                                    <div class="songCardName">
                                                        {{ roundRanked[(exited ? i : (roundRanked.length - i -
                                                        1))].chartInfo.songData.name }}
                                                    </div>
                                                    <div v-if="roundRanked[(exited ? i : (roundRanked.length - i - 1))].chartInfo.speedInfo.disp"
                                                        class="songCardSpeed">
                                                        ({{ roundRanked[(exited ? i : (roundRanked.length - i -
                                                        1))].chartInfo.speedInfo.disp }})
                                                    </div>
                                                    <div class="songCardLevel">
                                                        {{ roundRanked[(exited ? i : (roundRanked.length - i -
                                                        1))].chartInfo.chartData.level }}
                                                        {{ getDifficultyActual(roundRanked[(exited ? i :
                                                            (roundRanked.length
                                                        - i - 1))].chartInfo.chartData) }}
                                                    </div>
                                                    <div class="songCardScore">{{ item.scoreStr }}</div>
                                                    <div class="songCardAcc">{{ item.accStr }}</div>
                                                    <!--<div class="songCardExtra">{{item.extra}}</div>-->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-for="it1, t1 in room.players">
                                <div class="scoreRanking scoreRankingPerson"
                                    v-if="t1 != user.id && it1.playRecord.length > 0 && (!(room.compete_mode && t1 == room.owner))">
                                    <div>
                                        <div class="scoreRankingTitle color-primary">
                                            {{ $t("multiplayer.panels.playerRank.others", [it1.name]) }}
                                        </div>
                                        <div class="scoreRankingBody">
                                            <div class="scoreRankingBodyColum">
                                                <div class="scoreRankingCardEle" v-for="item, i in it1.playRecord">
                                                    <div class="scoreSongCard"
                                                        v-if="roundRanked[(exited ? i : (roundRanked.length - i - 1))] && roundRanked[(exited ? i : (roundRanked.length - i - 1))].chartInfo">
                                                        <img
                                                            :src="roundRanked[(exited ? i : (roundRanked.length - i - 1))].chartInfo.songData.illustration">
                                                        <div class="songCardCoverAll"
                                                            @click="wrappedSinglePlayBack(i, t1, 1)">
                                                            <div class="songCardID">#{{ i + 1 }}</div>
                                                            <div class="songCardName">
                                                                {{ roundRanked[(exited ? i : (roundRanked.length - i -
                                                                1))].chartInfo.songData.name }}
                                                            </div>
                                                            <div v-if="roundRanked[(exited ? i : (roundRanked.length - i - 1))].chartInfo.speedInfo.disp"
                                                                class="songCardSpeed">
                                                                ({{ roundRanked[(exited ? i : (roundRanked.length - i -
                                                                1))].chartInfo.speedInfo.disp }})
                                                            </div>
                                                            <div class="songCardLevel">
                                                                {{ roundRanked[(exited ? i : (roundRanked.length - i -
                                                                    1))].chartInfo.chartData.level }}
                                                                {{ roundRanked[(exited ? i : (roundRanked.length - i -
                                                                    1))].chartInfo.chartData.difficulty }}
                                                            </div>
                                                            <div class="songCardScore">{{ item.scoreStr }}</div>
                                                            <div class="songCardAcc">{{ item.accStr }}</div>
                                                            <!--<div class="songCardExtra">{{item.extra}}</div>-->
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style>
:root {
    --color-bg-light: #c5effb;
    --color-text-primary: #2f549a;
    --color-box-border: #9bb2de;
    --color-box-inner: rgb(210, 244, 253);
    --color-box-shadow: #9bb2dded;
    --color-level-box: rgb(211, 19, 20);
}

[v-cloak] {
    display: none;
}

.divider {
    color: #f5aaaa;
    font-size: .9em !important;
}

.evtbox {
    background-color: #90caf95e;
    max-width: 100vw;
    border-radius: 10px;
    padding: 5px;
}

.scorebox {
    background-color: #90caf95e;
    max-width: 100vw;
    max-height: max-content;
    border-radius: 10px;
    padding: 5px;
}

.boxbox {
    display: flex;
    justify-content: center;
    align-items: center;
}

.cover>div>.boxbox>.evtbox p span:not([type=userMsg]) {
    color: grey;
    font-size: .9em;
}

.cover-mask {
    margin-top: 25px;
    position: absolute;
    z-index: 1;
    background: #00000088;
    width: 100vw;
    height: 200vh;
    left: 0;
    top: 0;
}

.cover {
    background: #d0efff;
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: fit-content;
    max-width: 90vw;
    max-height: 70vh;
    overflow-y: scroll;
    border-radius: 20px;
    padding: 10px;
}

@media screen and (max-height: 625px) {
    .cover {
        position: fixed;
        left: 0;
        right: 0;
        top: 60px;
        bottom: 0;
        border-radius: 0;
        max-width: unset;
        max-height: unset;
        width: unset;
        height: calc(100vh - 60px);
        transform: unset;
    }
}

.coverFull {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 0;
    max-width: unset;
    max-height: unset;
    width: unset;
    height: unset;
    transform: unset;
    z-index: 10003;
}

.coverFull.coverFullScore {
    display: flex;
    justify-content: center;
}

.coverFull>.scoreMainContainer {
    max-width: 700px;
    width: 100%;
}

.panelSwitcher {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.panelSwitcher>div input[type=radio] {
    display: none;
}

.panelSwitcher div {
    display: inline;
    margin-right: 10px;
}

.panelSwitcher div input:checked~label {
    color: #36a4ff;
}

.panelSwitcher div label::before {
    content: unset !important;
}

.scoreSongCard {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    color: #fff;
    border: 1px solid var(--color-box-border);
    box-shadow: 0px 0px 8px .8px var(--color-box-shadow);
    border-radius: 10px;
    text-align: left;
    margin-bottom: 20px;
    margin: 5px;
    display: inline-flex;
}

.songCardCover {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: block;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid var(--color-box-border);
    border-radius: 0 0 10px 10px;
    z-index: 2;
    overflow: hidden;
    max-height: 86%;
}

.songCardCover::before {
    background: var(--bg);
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(3px);
    z-index: -1;
    background-position: bottom center;
}

.songCardCover::after {
    content: '';
    background: #0000004f;
    position: absolute;
    left: -30px;
    right: -30px;
    top: -30px;
    bottom: -30px;
    z-index: -1;
}

.songCardCover>div {
    display: -webkit-inline-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    z-index: 2;
    text-overflow: ellipsis;
    line-clamp: 2;
    -webkit-line-clamp: 2;
}

.scoreSongCard>img {
    width: 100%;
    display: block;
    aspect-ratio: 16/9;
}

.songCardComposer {
    font-size: .6em;
    height: 50%;
}

.songCardSpeed {
    font-size: .2em;
    margin-top: 5.5em;
}

#chartListAll {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
}

#chartListAll .scoreSongCard {
    width: 23.5%;
    /* margin-right: 2.4%; */
    font-size: 1.25vw;
}

.multi-player-list.scorebox {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}

.multi-user-avatar {
    width: 4.3em;
    height: 4.3em;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
}

.multi-player-list p {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
}

.color-primary {
    color: var(--color-text-primary);
}

div#scoreTitle {
    font-size: 2.2em;
    flex: auto;
    display: inline-block;
    margin-left: 0px;
    text-align: left;
}

div#scoreHeader {
    padding: 30px 28px 5px 28px;
    width: calc(100% - 35px - 28px);
    display: flex;
    justify-content: space-between;
}

div#scoreExtraInfo {
    text-align: right;
    display: inline-block;
    width: fit-content;
    margin-top: 5px;
}

.scoreRankingEle {
    display: inline-flex;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
}

.scoreRankingBodyLR .scoreRankingEle {
    width: 100% !important;
}

.scoreRankingBodyColum .scoreRankingBodyLR {
    width: 50%;
}

.scoreRankingEle>div {
    display: inline-block;
}

.scoreRankingBodyColum {
    display: block;
    width: 100%;
    line-height: 1em;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.scoreRanking {
    border: 2px solid var(--color-box-border);
    margin: 19px;
    padding: 16px;
    border-radius: 20px;
    background: var(--color-box-inner);
    box-shadow: 0px 0px 20px 3px var(--color-box-shadow);
    margin-top: 35px;
}

.scoreRankingNum {
    font-weight: bold;
    font-size: 1.2em;
    padding-right: 10px;
    padding-top: 2px;
}

.scoreRankingTitle {
    font-weight: bold;
    font-size: 1.3em;
    margin-bottom: 8px;
}

.scoreRankingUserName {
    font-size: 1em;
    width: 0;
    flex: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    line-height: 1.2em;
}

/* .scoreSongCard {
    width: 100%;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    color: #fff;
    border: 1px solid var(--color-box-border);
    box-shadow: 0px 0px 20px 3px var(--color-box-shadow);
    border-radius: 10px;
} */

/* .songCardCover {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 3px;
    background: #00000044;
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-box-border);
    border-radius: 0 0 10px 10px;
} */

/* .songCardCover>div {
    display: inline-block;
} */

/* .scoreSongCard>img {
    width: 100%;
    display: block;
} */

.songCardLevel {
    background-color: var(--color-level-box);
    font-size: .6em;
    height: 1.5em;
    width: 50px;
    text-align: center;
    border-radius: 15px;
    padding: 2px;
    position: absolute;
    right: 1em;
    padding-bottom: .1em;
    line-height: 1.2em;
}

.songCardCover .songCardLevel {
    bottom: 50%;
    transform: translate(0, 50%);
}

.songCardName {
    width: calc(100% - 50px);
}

#scoreCopyright {
    text-align: center;
    padding-bottom: 30px;
}

.scoreMainContainer {
    background-color: var(--color-bg-light);
    padding-bottom: 30px;
    border-radius: 20px;
}

.scoreMainContainer.noHeaderExtraPadding {
    padding-top: 1em;
}

div#scoreLogo {
    background: url(/src/core/lg512y512.png);
    width: 5em;
    height: 4em;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.scoreRankingPerson .scoreRankingBodyColum .scoreRankingCardEle {
    width: 33.3%;
}

.scoreRankingPerson img {
    filter: blur(3px);
}

.songCardCoverAll {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: block;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    background: #00000066;
}

.scoreRankingPerson .scoreSongCard {
    text-align: right;
}

.scoreRankingPerson .songCardID {
    background-color: var(--color-box-border);
    font-size: .6em;
    width: 2.5em;
    text-align: center;
    border-radius: 15px;
    padding: 2px;
    position: absolute;
    left: 1em;
    padding-bottom: .1em;
}

.scoreRankingPerson .songCardScore {
    text-align: left;
    font-size: 1.6em;
    margin-top: .2em;
    position: absolute;
    top: 36%;
}

.scoreRankingPerson .songCardAcc {
    text-align: left;
    margin-top: -.4em;
    position: absolute;
    bottom: .5em;
}

.scoreRankingPerson .songCardLevel {
    height: unset;
    bottom: 1em;
}

.scoreRankingPerson .songCardName {
    display: -webkit-inline-box;
    -webkit-box-orient: vertical;
    width: calc(100% - 3em);
    position: absolute;
    overflow: hidden;
    right: .5em;
    top: .4em;
    word-break: break-all;
    text-overflow: ellipsis;
    line-clamp: 1;
    -webkit-line-clamp: 1;
}

/* @media screen and (max-width: 875px) {
    #chartListAll .scoreSongCard {
        margin-right: 2.4%;
    }
} */

@media screen and (max-width: 600px) {
    #chartListAll .scoreSongCard {
        width: 45%;
        /* margin-right: 3.4%; */
        font-size: 2vw;
    }

    .scoreRankingBodyColum .scoreRankingBodyLR {
        width: 100%;
    }

    .scoreRankingBodyColum .scoreRankingEle {
        width: 100%;
    }

    .scoreRankingPerson .scoreRankingCardEle {
        width: 50%;
    }

    div#scoreLogo {
        width: 4em;
        height: 4em;
    }

    div#scoreTitle {
        font-size: 2.2em;
        margin-left: 0px;
    }

    div#scoreLogo {
        display: none;
    }
}

/* @media screen and (min-width: 800px) {
    #scoreContent {
        columns: 2
    }
} */
</style>
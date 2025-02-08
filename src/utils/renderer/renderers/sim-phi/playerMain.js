import simphi from "./simphi";
import { audio } from "@utils/js/aup";
import {
    Timer,
    FrameAnimater,
} from "@utils/js/common";
import { checkSupport } from "./utils/checkSupport";
import { uploader, ZipReader, readFile } from "./assetsProcessor/reader";
import { InteractProxy } from "@utils/js/interact";
import shared from "@utils/js/shared";
import ploading from "@utils/js/ploading.js";

import { loadModYukiOri } from "./plugins/aprfools/loadModYukiOri";
import videoRecorder from "./plugins/video-recorder";
import { loadSkinFromBuffer, loadSkinFromDB } from "./plugins/skin";
import { gauge } from "./plugins/gauge.js";

import {
    imgBlur,
    imgShader,
    imgSplit,
} from "./assetsProcessor/imgProcessor";
import { createCanvas } from "./utils/canvas";

import ptdb from "@utils/ptdb";
import { msgHandler } from "@utils/js/msgHandler";
import { Emitter } from "./utils/Emitter";
import { playBgm, playVideo } from "./utils/mediaPlayer";

import { judgeManager } from "./components/JudgeManager";
import { HitManager } from "./components/HitManager";
import { HitEvents } from "./components/HitManager/HitEvents";
import { HitWord } from "./components/HitManager/HitWord";
import { HitFeedback } from "./components/HitManager/HitFeedback";
import { LineImage } from "./components/LineImage";
import { specialDrag } from "./components/specialDrag";
import { specialClick } from "./components/specialClick";
import { loadLineData } from "./components/LoadLineData";

import { mainLoop } from "./renderer";
import { noteRender } from "./renderer/Notes/render";

const $id = query => document.getElementById(query);
const $ = query => document.body.querySelector(query);
const $$ = query => document.body.querySelectorAll(query);

export const simphiPlayer = {
    plugins: { videoRecorder },

    modify: a => a,
    pressTime: 0,
    before: new Map(),
    now: new Map(),
    after: new Map(),
    end: new Map(),
    /** @type {(ctx:CanvasRenderingContext2D,time:number)=>void} */
    filter: null,
    filterOptions: {},
    "flag{qwq}": _ => {},

    //qwq[water,demo,democlick]
    qwq: [null, false, null, null, 0, null],
    fucktemp2: null,
    resultPageData: false,

    res: {}, //存放资源

    qwqwq: false,

    /**@type {Map<ImageBitmap,LineImage>} */
    lineImages: new Map(),

    selectbg: $id("select-bg"),
    btnPlay: $id("btn-play"),
    btnPause: $id("btn-pause"),
    selectbgm: $id("select-bgm"),
    selectchart: $id("select-chart"),
    selectflip: $id("select-flip"),
    selectspeed: $id("select-speed"),
    inputName: $id("input-name"),
    inputArtist: $id("input-artist"),
    inputCharter: $id("input-charter"),
    inputIllustrator: $id("input-illustrator"),
    selectDifficulty: $id("select-difficulty"),
    selectLevel: $id("select-level"),
    showTransition: $id("showTransition"),

    stage: {
        resize(forced) {
            const ranking = forced || simphiPlayer.fucktemp2;
            simphiPlayer.app.stage.style.cssText = `;position:fixed;top:${forced ? 60 : 0}px;left:0;bottom:0;right:0;z-index:${ranking ? 0 : 1002};display:${location.hash.startsWith("#/playing") ? "block" : "none"};`;
        },
        async doFullScreen() {
            try {
                if (this.app.isFull) return;
                this.app.isFull = true;
                this.stage.resize();
            } catch (e) {
                this.stage.resize();
            }
        },
    },

    stat: new simphi.Stat(),
    app: new simphi.Renderer($id("stage")),

    status2: {
        text: "",
        list: [],
        reg(target, type, handler) {
            this.list[this.list.length] = { toString: () => handler(target) };
            target.addEventListener(type, this.update.bind(this));
        },
        update() {
            const arr = this.list.map(String).filter(Boolean);
            this.text = arr.length === 0 ? "" : `(${arr.join("+")})`;
        },
    },

    emitter: new Emitter("stop"),

    frameAnimater: new FrameAnimater(),
    timeInfo: {
        nowTime_ms: 0, //当前绝对时间(ms)
        curTime: 0, //最近一次暂停的音乐时间(s)
        curTime_ms: 0, //最近一次播放的绝对时间(ms)
        timeBgm: 0, //当前音乐时间(s)
        timeChart: 0, //当前谱面时间(s)
        duration: 0, //音乐时长(s)
    },
    animationInfo: {
        isInEnd: false, //开头过渡动画
        isOutStart: false, //结尾过渡动画
        isOutEnd: false, //临时变量
    },
    animationTimer: {
        in: new Timer(),
        out: new Timer(),
        end: new Timer(),
    },

    chartData: {
        levelText: "SP Lv.?",
        bgs: new Map(),
        bgsBlur: new Map(),
        bgms: new Map(),
        charts: new Map(),
        chartsMD5: new Map(),
        oriBuffers: new Map(),
        chartLineData: [], //line.csv
        chartInfoData: [], //info.csv
    },
    clearStat() {
        while (simphiPlayer.selectbg.options.length) simphiPlayer.selectbg.options.remove(0);
        while (simphiPlayer.selectchart.options.length) simphiPlayer.selectchart.options.remove(0);
        while (simphiPlayer.selectbgm.options.length) simphiPlayer.selectbgm.options.remove(0);
        simphiPlayer.chartData.bgs.clear();
        simphiPlayer.chartData.bgsBlur.clear();
        simphiPlayer.chartData.bgms.clear();
        simphiPlayer.chartData.oriBuffers.clear();
        simphiPlayer.chartData.charts.clear();
        simphiPlayer.chartData.chartsMD5.clear();
        simphiPlayer.chartData.chartLineData.length = 0;
        simphiPlayer.chartData.chartInfoData.length = 0;
    },

    tmps: {
        bgImage: null,
        bgVideo: null,
        bgMusic: _ => {},
        progress: 0,
        name: "",
        artist: "",
        illustrator: "",
        charter: "",
        level: "",
        combo: "",
        combo2: "",
        showStat: false,
        statStatus: {
            pause: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
            combonumber: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
            combo: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
            score: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
            bar: { show: true, offsetX: 0, offsetY: 0, alpha: 1 }, // 血量
            name: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
            level: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        },
        customForeDraw: null,
        customBackDraw: null,
        // canPause: true,
        get canPause() {
            return shared.game.ptmain.gameMode !== "multi";
        },
        hitFxRotate: false,
    },

    hitFeedbackList: new HitEvents({
        //存放点击特效
        updateCallback: i => ++i.time > 0,
        /**	@param {HitFeedback} i */
        iterateCallback: i => {
            simphiPlayer.app.ctxos.globalAlpha = 0.85;
            simphiPlayer.app.ctxos.setTransform(1, 0, 0, 1, i.offsetX, i.offsetY); //缩放
            simphiPlayer.app.ctxos.fillStyle = i.color;
            simphiPlayer.app.ctxos.beginPath();
            simphiPlayer.app.ctxos.arc(0, 0, simphiPlayer.app.lineScale * 0.5, 0, 2 * Math.PI);
            simphiPlayer.app.ctxos.fill();
        },
    }),
    hitImageList: new HitEvents({
        //存放点击特效
        updateCallback: i => simphiPlayer.timeInfo.nowTime_ms >= i.time + i.duration,
        /**	@param {HitImage} i */
        iterateCallback: i => {
            if (!simphiPlayer.emitter.eq("play") || simphiPlayer.app.pauseTime) return;
            const tick = (simphiPlayer.timeInfo.nowTime_ms - i.time) / i.duration;
            const effects = i.effects;
            simphiPlayer.app.ctxos.globalAlpha = 1;
            simphiPlayer.app.ctxos.setTransform(
                simphiPlayer.app.noteScaleRatio * 6,
                0,
                0,
                simphiPlayer.app.noteScaleRatio * 6,
                i.offsetX,
                i.offsetY
            ); //缩放
            simphiPlayer.app.ctxos.rotate(i.rotation);
            (effects[Math.floor(tick * effects.length)] || effects[effects.length - 1]).full(
                simphiPlayer.app.ctxos
            ); //停留约0.5秒
            simphiPlayer.app.ctxos.fillStyle = i.color;
            simphiPlayer.app.ctxos.globalAlpha = 1 - tick; //不透明度
            const r3 = 30 * (((0.2078 * tick - 1.6524) * tick + 1.6399) * tick + 0.4988); //方块大小
            if (r3 < 0) return;
            for (const j of i.direction) {
                const ds = j[0] * ((9 * tick) / (8 * tick + 1)); //打击点距离
                if (!simphiPlayer.customResourceMeta["loaded"]) {
                    simphiPlayer.app.ctxos.beginPath();
                    simphiPlayer.app.ctxos.arc(
                        ds * Math.cos(j[1]),
                        ds * Math.sin(j[1]),
                        (r3 / 3) * 2,
                        0,
                        2 * Math.PI
                    );
                    simphiPlayer.app.ctxos.fill();
                    simphiPlayer.app.ctxos.closePath();
                } else if (simphiPlayer.customResourceMeta["hitEvtDrawer"])
                    eval(
                        `{ const ctxos = simphiPlayer.app.ctxos; ${simphiPlayer.customResourceMeta["hitEvtDrawer"]} }`
                    );
            }
        },
    }),
    hitWordList: new HitEvents({
        //存放点击特效
        updateCallback: i => simphiPlayer.timeInfo.nowTime_ms >= i.time + i.duration,
        /**	@param {HitWord} i */
        iterateCallback: i => {
            const tick = (simphiPlayer.timeInfo.nowTime_ms - i.time) / i.duration;
            simphiPlayer.app.ctxos.setTransform(1, 0, 0, 1, i.offsetX, i.offsetY); //缩放
            simphiPlayer.app.ctxos.font = `bold ${
                simphiPlayer.app.noteScaleRatio *
                (256 + 128 * (((0.2078 * tick - 1.6524) * tick + 1.6399) * tick + 0.4988))
            }px Saira`;
            simphiPlayer.app.ctxos.textAlign = "center";
            simphiPlayer.app.ctxos.fillStyle = i.color;
            simphiPlayer.app.ctxos.globalAlpha = 1 - tick; //不透明度
            simphiPlayer.app.ctxos.fillText(i.text, 0, -simphiPlayer.app.noteScaleRatio * 128);
        },
    }),
    hitManager: new HitManager(),

    async pause() {
        if (simphiPlayer.btnPause.classList.contains("disabled") || !simphiPlayer.tmps.canPause) return;
        if (simphiPlayer.emitter.eq("stop") || simphiPlayer.resultPageData) return;
        simphiPlayer.btnPause.classList.add("disabled");
        if (simphiPlayer.emitter.eq("play")) {
            if (simphiPlayer.app.bgVideo) simphiPlayer.app.bgVideo.pause();
            simphiPlayer.app.pauseBackgroundDimPara1 = null;
            simphiPlayer.animationTimer.in.pause();
            if (simphiPlayer.showTransition.checked && simphiPlayer.animationInfo.isOutStart)
                simphiPlayer.animationTimer.out.pause();
            simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.timeBgm;
            audio.stop();
            simphiPlayer.emitter.emit("pause");
            simphiPlayer.btnPause.classList.remove("disabled");
        } else {
            if (shared.game.ptmain.playConfig.mode === "preview") {
                clearInterval(simphiPlayer.app.pauseNextTick);
                if (simphiPlayer.app.bgVideo)
                    await playVideo(
                        simphiPlayer.app.bgVideo,
                        simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed
                    );
                simphiPlayer.animationTimer.in.play();
                if (simphiPlayer.showTransition.checked && simphiPlayer.animationInfo.isOutStart)
                    simphiPlayer.animationTimer.out.play();
                if (simphiPlayer.animationInfo.isInEnd && !simphiPlayer.animationInfo.isOutStart)
                    playBgm(
                        simphiPlayer.app.bgMusic,
                        simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed
                    );
                simphiPlayer.emitter.emit("play");
                simphiPlayer.btnPause.classList.remove("disabled");
                return;
            }
            simphiPlayer.app.pauseTime = 3;
            simphiPlayer.app.pauseBackgroundDimPara1 = performance.now();
            simphiPlayer.app.pauseNextTick = setInterval(async () => {
                simphiPlayer.app.pauseTime--;
                if (simphiPlayer.app.pauseTime <= 0) {
                    simphiPlayer.app.pauseTime = 0;
                    clearInterval(simphiPlayer.app.pauseNextTick);
                    simphiPlayer.app.pauseNextTick = null;
                    simphiPlayer.app.pauseBackgroundDimPara1 = Infinity;
                    if (
                        !shared.game.ptmain.gameConfig.reviewWhenResume ||
                        simphiPlayer.timeInfo.curTime <= 3
                    ) {
                        if (simphiPlayer.app.bgVideo)
                            await playVideo(
                                simphiPlayer.app.bgVideo,
                                simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed
                            );
                        simphiPlayer.animationTimer.in.play();
                        if (simphiPlayer.showTransition.checked && simphiPlayer.animationInfo.isOutStart)
                            simphiPlayer.animationTimer.out.play();
                        if (
                            simphiPlayer.animationInfo.isInEnd &&
                            !simphiPlayer.animationInfo.isOutStart
                        )
                            playBgm(
                                simphiPlayer.app.bgMusic,
                                simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed
                            );
                        simphiPlayer.emitter.emit("play");
                    }
                    simphiPlayer.btnPause.classList.remove("disabled");
                }
            }, 1000);
            if (shared.game.ptmain.gameConfig.reviewWhenResume && simphiPlayer.timeInfo.curTime > 3) {
                if (simphiPlayer.timeInfo.curTime > 3)
                    simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime -= 3;
                if (simphiPlayer.app.bgVideo)
                    await playVideo(
                        simphiPlayer.app.bgVideo,
                        simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed
                    );
                simphiPlayer.animationTimer.in.play();
                if (simphiPlayer.showTransition.checked && simphiPlayer.animationInfo.isOutStart)
                    simphiPlayer.animationTimer.out.play();
                if (simphiPlayer.animationInfo.isInEnd && !simphiPlayer.animationInfo.isOutStart)
                    playBgm(
                        simphiPlayer.app.bgMusic,
                        simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed
                    );
                simphiPlayer.emitter.emit("play");
                simphiPlayer.btnPause.classList.add("disabled");
            }
        }
    },
};
document.oncontextmenu = e => e.preventDefault(); //qwq

shared.game.simphi = simphiPlayer.app;
shared.game.player = simphiPlayer;

simphiPlayer.now.set("gauge", gauge.calc);
//自动填写歌曲信息
function adjustInfo() {
    for (const i of simphiPlayer.chartData.chartInfoData) {
        if (simphiPlayer.selectchart.value.trim() === i.Chart) {
            if (i.Name) simphiPlayer.inputName.value = i.Name;
            if (i.Musician) simphiPlayer.inputArtist.value = i.Musician; //Alternative
            if (i.Composer) simphiPlayer.inputArtist.value = i.Composer; //Alternative
            if (i.Artist) simphiPlayer.inputArtist.value = i.Artist;
            if (i.Level) {
                simphiPlayer.chartData.levelText = i.Level;
                const p = simphiPlayer.chartData.levelText
                    .toLocaleUpperCase()
                    .split("LV.")
                    .map(a => a.trim());
                if (p[0]) simphiPlayer.selectDifficulty.value = p[0];
                if (p[1]) simphiPlayer.selectLevel.value = p[1];
            }
            if (i.Illustrator) simphiPlayer.inputIllustrator.value = i.Illustrator;
            if (i.Designer) simphiPlayer.inputCharter.value = i.Designer;
            if (i.Charter) simphiPlayer.inputCharter.value = i.Charter;
            if (simphiPlayer.chartData.bgms.has(i.Music)) simphiPlayer.selectbgm.value = i.Music;
            if (simphiPlayer.chartData.bgs.has(i.Image)) {
                simphiPlayer.selectbg.value = i.Image;
                simphiPlayer.selectbg.dispatchEvent(new Event("change"));
            }
            if (isFinite((i.AspectRatio = parseFloat(i.AspectRatio)))) {
                shared.game.ptmain.gameConfig.aspectRatio = i.AspectRatio;
            }
            if (isFinite((i.ScaleRatio = parseFloat(i.ScaleRatio)))) {
                //Legacy
                shared.game.ptmain.gameConfig.noteScale = 8080 / i.ScaleRatio;
                simphiPlayer.app.setNoteScale(8080 / i.ScaleRatio);
            }
            if (isFinite((i.NoteScale = parseFloat(i.NoteScale)))) {
                shared.game.ptmain.gameConfig.noteScale = i.NoteScale;
                simphiPlayer.app.setNoteScale(i.NoteScale);
            }
            if (isFinite((i.GlobalAlpha = parseFloat(i.GlobalAlpha)))) {
                //Legacy
                shared.game.ptmain.gameConfig.backgroundDim = i.GlobalAlpha;
                shared.game.ptmain.gameConfig.backgroundDim = Number(i.GlobalAlpha);
            }
            if (isFinite((i.BackgroundDim = parseFloat(i.BackgroundDim)))) {
                shared.game.ptmain.gameConfig.backgroundDim = i.BackgroundDim;
                shared.game.ptmain.gameConfig.backgroundDim = Number(i.BackgroundDim);
            }
            if (isFinite((i.Offset = parseFloat(i.Offset))))
                shared.game.ptmain.chartOffsetSurface = i.Offset;
        }
    }
}
shared.game.stage = simphiPlayer.stage;
self.addEventListener("resize", () => simphiPlayer.stage.resize());
//uploader
{
    let /** @type {Object<string,number>} */ dones = {};
    let /** @type {Object<string,number>} */ totals = {};
    let uploader_done = 0;
    let uploader_total = 0;
    /**
     * @param {string} tag
     * @param {number} total
     */
    const handleFile = async (tag, total, promise, oncomplete = _ => {}) => {
        if (!totals[tag] || total >= totals[tag]) totals[tag] = total;
        uploader_total = Object.values(totals).reduce((a, b) => a + b, 0);
        if (!(promise instanceof Promise)) promise = Promise.resolve();
        await promise.catch(err =>
            msgHandler.sendWarning(
                shared.game.i18n.t("simphi.handleFile.unsupportedFile", [err.cause.name])
            )
        );
        dones[tag] = (dones[tag] || 0) + 1;
        uploader_done = Object.values(dones).reduce((a, b) => a + b, 0);
        ploading.l(
            shared.game.i18n.t("simphi.handleFile.loadingFile", { uploader_done, uploader_total }),
            "loadChart"
        );
        if (dones[tag] === totals[tag]) oncomplete();
        loadComplete();
    };
    simphiPlayer.handleFile = handleFile;
    let file_total = 0;
    const options = {
        createAudioBuffer() {
            return audio.decode(...arguments);
        },
    };
    const zip = new ZipReader({ handler: data => readFile(data, options) });
    zip.addEventListener("loadstart", () => {});
    zip.addEventListener("read", evt => handleFile("zip", zip.total, pick(evt.detail)));
    $id("uploader-upload").addEventListener("click", uploader.uploadFile);
    $id("uploader-file").addEventListener("click", uploader.uploadFile);
    $id("uploader-dir").addEventListener("click", uploader.uploadDir);
    /** @type {((_:FileList) => void)} */
    uploader.reset = (i = false) => {
        dones = {};
        if (i) totals = { file: i };
        else totals = {};
        file_total = 0;
        uploader_done = 0;
        uploader_total = 0;
        zip.reset();
    };
    uploader.addEventListener("change", loadComplete);
    /** @type {((_:ProgressEvent<FileReader>) => void)} */
    uploader.addEventListener("progress", function (evt) {
        // //显示加载文件进度
        // if (!evt.total) return;
        // const percent = Math.floor((evt.loaded / evt.total) * 100);
        // msgHandler.sendMessage(
        //   `加载文件：${percent}% (${bytefm(evt.loaded)}/${bytefm(evt.total)})`
        // );
    });
    let lastEvtPromise = null;
    uploader.addEventListener(
        "load",
        /** @param {(ProgressEvent<FileReader>&{file:File,buffer:ArrayBuffer})} evt*/ async function (
            evt
        ) {
            await lastEvtPromise;
            lastEvtPromise = null;
            const {
                file: { name, webkitRelativePath: path },
                buffer,
            } = evt;
            const isZip =
                buffer.byteLength > 4 && new DataView(buffer).getUint32(0, false) === 0x504b0304;
            const data = { name: name, buffer, path: path || name };
            //检测buffer是否为zip
            if (isZip) {
                lastEvtPromise = zip.read(data);
                await lastEvtPromise;
                if (totals["file"] > file_total) {
                    if (dones["file"]) dones["file"]++;
                    else dones["file"] = 1;
                }
            } else {
                file_total++;
                readFile(data, options).then(result =>
                    handleFile("file", file_total, pick(result))
                );
            }
        }
    );
    simphiPlayer.uploader = uploader;
    /**
     * @typedef {import("../js/reader.js").ReaderData} ReaderData
     * @param {ReaderData} data
     */
    async function pick(data) {
        switch (data.type) {
            case "line":
                simphiPlayer.chartData.chartLineData.push(...data.data);
                break;
            case "info":
                simphiPlayer.chartData.chartInfoData.push(...data.data);
                break;
            case "media":
            case "audio":
                simphiPlayer.chartData.bgms.set(data.name, data.data);
                simphiPlayer.selectbgm.appendChild(createOption(data.name, data.name));
                break;
            case "image":
                simphiPlayer.chartData.bgs.set(data.name, data.data);
                simphiPlayer.chartData.bgsBlur.set(data.name, await imgBlur(data.data));
                simphiPlayer.selectbg.appendChild(createOption(data.name, data.name));
                break;
            case "chart":
                if (data.msg) data.msg.forEach(v => msgHandler.sendWarning(v));
                if (data.info) simphiPlayer.chartData.chartInfoData.push(data.info);
                if (data.line) simphiPlayer.chartData.chartLineData.push(...data.line);
                let basename = data.name;
                while (simphiPlayer.chartData.charts.has(basename)) basename += "\n"; //qwq
                data.data.md5 = data.md5;
                simphiPlayer.chartData.charts.set(basename, data.data);
                simphiPlayer.chartData.chartsMD5.set(basename, data.md5);
                simphiPlayer.selectchart.appendChild(createOption(basename, data.name));
                break;
            default:
                console.error(data["data"]);
                throw new Error(`Unsupported file: ${data["name"]}`, { cause: data });
        }
        if (data.name && data.buffer) simphiPlayer.chartData.oriBuffers.set(data.name, data.buffer);
    }
    /**
     * @param {string} innerhtml
     * @param {string} value
     */
    function createOption(value, innerhtml) {
        const option = document.createElement("option");
        const isHidden = /(^|\/)\./.test(innerhtml);
        option.innerHTML = isHidden ? "" : innerhtml;
        option.value = value;
        if (isHidden) option.classList.add("hide");
        return option;
    }

    function loadComplete() {
        if ("skin" in totals) return;
        if (uploader_done && uploader_done === uploader_total) {
            shared.game.ptmain.chartLoadedCB();
        }
    }
}
const interact = new InteractProxy(simphiPlayer.app.canvas);
//兼容PC鼠标
interact.setMouseEvent({
    mousedownCallback(evt) {
        const idx = evt.button;
        const { x, y } = getPos(evt);
        if (idx === 1) simphiPlayer.hitManager.activate("mouse", 4, x, y);
        else if (idx === 2) simphiPlayer.hitManager.activate("mouse", 2, x, y);
        else simphiPlayer.hitManager.activate("mouse", 1 << idx, x, y);
        specialClick.qwq(x, y);
        specialDrag.reg("mouse", x, y);
    },
    mousemoveCallback(evt) {
        const idx = evt.buttons;
        const { x, y } = getPos(evt);
        for (let i = 1; i < 32; i <<= 1) {
            // 同时按住多个键时，只有最后一个键的move事件会触发
            if (idx & i) simphiPlayer.hitManager.moving("mouse", i, x, y);
            else simphiPlayer.hitManager.deactivate("mouse", i);
            specialDrag.update("mouse", x, y);
        }
    },
    mouseupCallback(evt) {
        const idx = evt.button;
        if (idx === 1) simphiPlayer.hitManager.deactivate("mouse", 4);
        else if (idx === 2) simphiPlayer.hitManager.deactivate("mouse", 2);
        else simphiPlayer.hitManager.deactivate("mouse", 1 << idx);
        specialDrag.del("mouse");
    },
});
//兼容键盘(喵喵喵?)
interact.setKeyboardEvent({
    keydownCallback(evt) {
        if (simphiPlayer.emitter.eq("stop")) return;
        if (evt.key === "Shift") simphiPlayer.btnPause.click();
        if (evt.key === " " && shared.game.ptmain.playConfig.mode === "preview")
            simphiPlayer.btnPause.click();
        else if (
            simphiPlayer.hitManager.list.find(i => i.type === "keyboard" && i.id === evt.code) //按住一个键时，会触发多次keydown事件
        );
        else simphiPlayer.hitManager.activate("keyboard", evt.code, NaN, NaN);
    },
    keyupCallback(evt) {
        if (simphiPlayer.emitter.eq("stop")) return;
        simphiPlayer.hitManager.deactivate("keyboard", evt.code);
    },
});
self.addEventListener("blur", () => simphiPlayer.hitManager.clear("keyboard"));
//兼容移动设备
interact.setTouchEvent({
    touchstartCallback(evt) {
        for (const i of evt.changedTouches) {
            const { x, y } = getPos(i);
            simphiPlayer.hitManager.activate("touch", i.identifier, x, y);
            specialClick.qwq(x, y);
            specialDrag.reg(i.identifier, x, y);
        }
    },
    touchmoveCallback(evt) {
        for (const i of evt.changedTouches) {
            const { x, y } = getPos(i);
            simphiPlayer.hitManager.moving("touch", i.identifier, x, y);
            specialDrag.update(i.identifier, x, y);
        }
    },
    touchendCallback(evt) {
        for (const i of evt.changedTouches) {
            simphiPlayer.hitManager.deactivate("touch", i.identifier);
            specialDrag.del(i.identifier);
        }
    },
    touchcancelCallback(evt) {
        // if (emitter.eq('play')) qwqPause();
        for (const i of evt.changedTouches) {
            simphiPlayer.hitManager.deactivate("touch", i.identifier);
            specialDrag.del(i.identifier);
        }
    },
});
/** @param {MouseEvent|Touch} obj */
function getPos(obj) {
    const rect = simphiPlayer.app.canvas.getBoundingClientRect();
    return {
        x:
            ((obj.clientX - rect.left) / simphiPlayer.app.canvas.offsetWidth) *
                simphiPlayer.app.canvas.width -
            (simphiPlayer.app.canvas.width - simphiPlayer.app.canvasos.width) / 2,
        y:
            ((obj.clientY - rect.top) / simphiPlayer.app.canvas.offsetHeight) *
                simphiPlayer.app.canvas.height -
            (simphiPlayer.app.canvas.height - simphiPlayer.app.canvasos.height) / 2,
    };
}
//hit end
simphiPlayer.customResourceMeta = {};
let defaultCRM = {
    name: "PhiTogether Default 1",
    author: "Team PhiTogether",
};
const loadRes = (shared.game.simphi.reloadRes = async (
    url,
    manual = false,
    setAsDefault = false
) => {
    if (!url) {
        if (simphiPlayer.customResourceMeta == defaultCRM) return;
        // if (shared.game.ptmain.gameConfig.resourcesType === "prpr-custom") {
        // return;
        // try {
        // const f = await fetch("/PTVirtual/user/respack.zip");
        // const b = await f.arrayBuffer();
        // await loadSkinFromBuffer(b, true);
        // shared.game.msgHandler.sendMessage("自定义资源包应用完成");
        // } catch (e) {
        //   shared.game.msgHandler.sendMessage(
        //     "错误：无法应用自定义资源包，界面显示可能异常，请检查设置",
        //     "error"
        //   );
        // }
        // } else {
        // if (shared.game.ptmain.gameConfig.resourcesType === "prpr-custom") await loadprprCustomRes();
        // else {
        simphiPlayer.customResourceMeta = defaultCRM;
        // await updateRes(res);
        const entries = [
            "Tap",
            "TapHL",
            "Drag",
            "DragHL",
            "HoldHead",
            "HoldHeadHL",
            "Hold",
            "HoldHL",
            "HoldEnd",
            "Flick",
            "FlickHL",
            "HitFXRaw",
        ];
        for (const i of entries) await noteRender.update(i, simphiPlayer.res[i], 1);
        simphiPlayer.res["JudgeLineMP"] = await imgShader(simphiPlayer.res["JudgeLine"], "#feffa9");
        simphiPlayer.res["JudgeLineFC"] = await imgShader(simphiPlayer.res["JudgeLine"], "#a2eeff");
        simphiPlayer.tmps.hitPerfectColor = simphiPlayer.tmps.hitGoodColor = null;
        simphiPlayer.tmps.hitFxRotate = false;
        // }
        // }
        return;
    }
    const newres = {}; //存放资源
    let errorNum = 0;
    const urlBak = url;
    if (!url.startsWith("/") && !url.startsWith("http")) url = "https://" + url;
    await fetch(`${url}/meta.json`)
        .then(r =>
            r
                .json()
                .then(crm => {
                    if (crm["hitEvtDrawer"] && !urlBak.startsWith(atob("cGdyZXM0cHQucmVhbHR2b3Au")))
                        crm["hitEvtDrawer"] = null;
                    simphiPlayer.customResourceMeta = crm;
                    if (setAsDefault) defaultCRM = crm;
                })
                .then(() => (simphiPlayer.customResourceMeta.loaded = true))
        )
        .catch(e => {
            msgHandler.sendError(shared.game.i18n.t("respack.err"));
            return;
        });
    const erc = (name, src) => {
        try {
            return (
                simphiPlayer.customResourceMeta.res[name] ||
                simphiPlayer.customResourceMeta.res[src] ||
                ""
            );
        } catch {
            return "";
        }
    };
    await Promise.all(
        Object.entries({
            Tap: "Tap.png",
            TapHL: "TapHL.png",
            Drag: "Drag.png",
            DragHL: "DragHL.png",
            HoldHead: "HoldHead.png",
            HoldHeadHL: "HoldHeadHL.png",
            Hold: "Hold.png",
            HoldHL: "HoldHL.png",
            HoldEnd: "HoldEnd.png",
            Flick: "Flick.png",
            FlickHL: "FlickHL.png",
            HitSong0: "HitSong0.ogg",
            HitSong1: "HitSong1.ogg",
            HitSong2: "HitSong2.ogg",
            HitFXRaw: "clickRaw.png",
        }).map(
            ([name, src], _i, arr) =>
                new Promise(resolve => {
                    if (!erc(name, src)) return resolve();
                    const xhr = new XMLHttpRequest();
                    xhr.open("get", (src = erc(name, src)), true);
                    xhr.responseType = "arraybuffer";
                    xhr.send();
                    xhr.onloadend = async () => {
                        if (!xhr.response || !xhr.response.byteLength) {
                            msgHandler.sendError(
                                shared.game.i18n.t("simphi.loading.resLoadFailed1", [++errorNum]),
                                shared.game.i18n.t("simphi.loading.resLoadFailed2", [
                                    new URL(src, location),
                                ]),
                                true
                            );
                        } else {
                            const a = new DataView(xhr.response, 0, 8);
                            const header1 = a.getUint32(0);
                            const header2 = a.getUint32(4);
                            if (header1 === 0x4f676753)
                                newres[name] = await audio.decode(xhr.response);
                            else if (header1 === 0x89504e47 && header2 === 0x0d0a1a0a)
                                newres[name] = await createImageBitmap(new Blob([xhr.response]));
                            else
                                msgHandler.sendError(
                                    shared.game.i18n.t("simphi.loading.resLoadFailed1", [
                                        ++errorNum,
                                    ]),
                                    shared.game.i18n.t("simphi.loading.resLoadFailed2", [
                                        new URL(src, location),
                                    ]),
                                    true
                                );
                        }
                        resolve();
                    };
                })
        )
    );
    if (errorNum)
        return msgHandler.sendError(
            shared.game.i18n.t("simphi.loading.resLoadFailed1", [errorNum])
        );
    if (manual) defaultCRM = simphiPlayer.customResourceMeta;
    await updateRes(newres, manual);
});
async function updateRes(resources, manual = false) {
    const entries = [
        "Tap",
        "TapHL",
        "Drag",
        "DragHL",
        "HoldHead",
        "HoldHeadHL",
        "Hold",
        "HoldHL",
        "HoldEnd",
        "Flick",
        "FlickHL",
    ];
    for (const i of entries) {
        if (["prpr", "prpr-compacted"].includes(simphiPlayer.customResourceMeta["holdType"])) {
            if (["HoldHead", "HoldHeadHL", "HoldEnd"].includes(i)) continue;
            const img = resources[i];
            const noteScale = 1089 / img.width;
            const [bottom, top] = simphiPlayer.customResourceMeta["holdAtlas"] || [1, 1];
            const compacted = simphiPlayer.customResourceMeta["holdType"] === "prpr-compacted";
            if (i === "Hold") {
                noteRender.update(
                    "HoldEnd",
                    await createImageBitmap(img, 0, 0, img.width, bottom),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "Hold",
                    await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "HoldHead",
                    await createImageBitmap(img, 0, img.height - top, img.width, top),
                    noteScale,
                    compacted
                );
            } else if (i === "HoldHL") {
                noteRender.update(
                    "HoldEndHL",
                    await createImageBitmap(img, 0, 0, img.width, bottom),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "HoldHL",
                    await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "HoldHeadHL",
                    await createImageBitmap(img, 0, img.height - top, img.width, top),
                    noteScale,
                    compacted
                );
            } else await noteRender.update(i, resources[i], 1);
        } else {
            await noteRender.update(
                i.replaceAll(/\.(jpg|png)/gi, ""),
                resources[i],
                ["HoldHL", "HoldHeadHL"].includes(i) ? 8080 / 7875 : 1
            );
            if (manual) simphiPlayer.res[i.replaceAll(/\.(jpg|png)/gi, "")] = resources[i];
        }
    }
    if (resources["HitFXRaw"]) await noteRender.updateFX(resources["HitFXRaw"], 1);
    for (let i = 0; i < 3; i++) {
        const str = `HitSong${i}`;
        if (resources[str]) simphiPlayer.res[str] = resources[str];
    }
    if (manual)
        shared.game.msgHandler.sendMessage(
            shared.game.ptmain.$t("respack.customResApplied"),
            "success"
        );
}
//初始化
//初始化(踩坑：监听DOMContentLoaded似乎会阻塞页面导致长时间白屏)
window.addEventListener(
    "load",
    async function () {
        shared.game = {
            ...shared.game,
            init: true,
            app: simphiPlayer.app,
            res: simphiPlayer.res,
            charts: simphiPlayer.chartData.charts,
            stat: simphiPlayer.stat,
            hitManager: simphiPlayer.hitManager,
            judgeManager,
            stage: simphiPlayer.stage,
            clearStat: simphiPlayer.clearStat,
            loadSkinFromBuffer,
            loadSkinFromDB,
            updateLevelText: updateLevelTextOut,
            doFullScreen: simphiPlayer.stage.doFullScreen,
            adjustInfo,
            qwqStop,
            qwqPause: simphiPlayer.pause,
            frameAnimater: simphiPlayer.frameAnimater,
        };
        await shared.game.requestFullscreen();
        simphiPlayer.app.canvas.classList.add("fade");
        let loadedNum = 0;
        let errorNum = 0;
        if (await checkSupport()) return;
        const pth = "/src/respack/";
        let pack = "together-pack-1";

        shared.game.ptmain.playerLoaded();

        let ptSettings;
        try {
            ptSettings = await ptdb.gameConfig.get();
        } catch (e) {
            ptSettings = { resourcesType: "together-pack-1" };
        }

        if (ptSettings.resourcesType) {
            if (ptSettings.resourcesType === "pt-custom")
                loadRes(ptSettings["customResourceLink"], false, true);
            else if (ptSettings.resourcesType.startsWith("together-pack"))
                loadRes(`/src/respack/${ptSettings.resourcesType}`, false, true);
        }

        await Promise.all(
            Object.entries({
                JudgeLine: "JudgeLine.png",
                ProgressBar: "ProgressBar.png",
                Pause: "PauseNew.png",
                Rank: "Rank.png",
                FCV: "FCV.png",
                LevelOver0: "LevelOver0.ogg",
                LevelOver0_v2: "LevelOver0_v2.ogg",
                LevelOver1_v2: "LevelOver1_v2.ogg",
                LevelOver2_v2: "LevelOver2_v2.ogg",
                LevelOver3_v2: "LevelOver3_v2.ogg",
                Resume: "play.png",
                Retry: "replay.png",
                Back: "return.png",
                Loop: "loop.png",

                /* Default Respack Files, now replaced by `loadRes`.
        HitFXRaw: "clickRaw.png",
        Tap: "Tap.png",
        TapHL: "TapHL.png",
        Drag: "Drag.png",
        DragHL: "DragHL.png",
        Flick: "Flick.png",
        FlickHL: "FlickHL.png",
        HoldHead: "HoldHead.png",
        HoldHeadHL: "HoldHeadHL.png",
        Hold: "Hold.png",
        HoldHL: "HoldHL.png",
        HoldEnd: "HoldEnd.png",
        HitSong0: "HitSong0.ogg",
        HitSong1: "HitSong1.ogg",
        HitSong2: "HitSong2.ogg", */
            }).map(
                ([name, src], _i, arr) =>
                    new Promise(resolve => {
                        const xhr = new XMLHttpRequest();
                        const source = /* erc(src) ||  */ "/src/respack/shared/" + src;
                        xhr.open("get", (src = source), true);
                        xhr.responseType = "arraybuffer";
                        xhr.send();
                        xhr.onloadend = async () => {
                            if (!xhr.response || !xhr.response.byteLength) {
                                msgHandler.sendError(
                                    shared.game.ptmain.$t("simphi.loading.resLoadFailed1", [
                                        ++errorNum,
                                    ]),
                                    "",
                                    true
                                );
                            } else {
                                const a = new DataView(xhr.response, 0, 8);
                                const header1 = a.getUint32(0);
                                const header2 = a.getUint32(4);
                                if (header1 === 0x4f676753)
                                    simphiPlayer.res[name] = await audio.decode(xhr.response);
                                else if (header1 === 0x89504e47 && header2 === 0x0d0a1a0a)
                                    simphiPlayer.res[name] = await createImageBitmap(
                                        new Blob([xhr.response])
                                    );
                                else
                                    msgHandler.sendError(
                                        shared.game.ptmain.$t("simphi.loading.resLoadFailed1", [
                                            ++errorNum,
                                        ]),
                                        "",
                                        true
                                    );
                            }
                            resolve();
                        };
                    })
            )
        );
        if (errorNum)
            return msgHandler.sendError(
                shared.game.ptmain.$t("simphi.loading.resLoadFailed1", [errorNum])
            );
        simphiPlayer.res["NoImageBlack"] = await createImageBitmap(
            new ImageData(new Uint8ClampedArray(4).fill(0), 1, 1)
        );
        simphiPlayer.res["NoImageWhite"] = await createImageBitmap(
            new ImageData(new Uint8ClampedArray(4).fill(255), 1, 1)
        );
        simphiPlayer.res["JudgeLineMP"] = await imgShader(simphiPlayer.res["JudgeLine"], "#feffa9");
        simphiPlayer.res["JudgeLineFC"] = await imgShader(simphiPlayer.res["JudgeLine"], "#a2eeff");
        simphiPlayer.res["Ranks"] = await imgSplit(simphiPlayer.res["Rank"]);
        simphiPlayer.res["Rank"].close();
        simphiPlayer.res["mute"] = audio.mute(1);
        if (
            !(() => {
                const b = createCanvas(1, 1).getContext("2d");
                b.drawImage(simphiPlayer.res["JudgeLine"], 0, 0);
                return b.getImageData(0, 0, 1, 1).data[0];
            })()
        )
            return msgHandler.sendError(shared.game.i18n.t("simphi.loading.imgLoadingError"));
        // if (ptSettings.resourcesType === "prpr-custom") await loadprprCustomRes();
        // msgHandler.sendError(shared.game.i18n.t("respack.unavailableNow"));  // diasble custom respack for now
        shared.game.ptmain.simphiLoaded();
        $id("uploader").classList.remove("disabled");
        $id("select").classList.remove("disabled");
        simphiPlayer.emitter.dispatchEvent(new CustomEvent("change"));
        simphiPlayer.btnPause.classList.add("disabled");
    },
    { once: true }
);

simphiPlayer.frameAnimater.setCallback(mainLoop);
function onPageVisibilityChange() {
    if (document.visibilityState === "hidden")
        if (simphiPlayer.emitter.eq("play")) simphiPlayer.pause();
        else {
            if (!audio._actx) return;
            audio._actx.suspend();
            shared.game.afterShow.push(() => {
                audio._actx.resume();
            });
        }
}
document.addEventListener("visibilitychange", onPageVisibilityChange);
document.addEventListener("pagehide", onPageVisibilityChange); //兼容Safari

simphiPlayer.stage.resize(); //qwq

//html交互(WIP)
$id("select-note-scale").addEventListener("change", evt =>
    simphiPlayer.app.setNoteScale(evt.target.value)
);
$id("select-background-dim").addEventListener(
    "change",
    evt => (simphiPlayer.app.brightness = Number(evt.target.value))
);
$id("highLight").addEventListener(
    "change",
    evt => (simphiPlayer.app.multiHint = evt.target.checked)
);
simphiPlayer.selectflip.addEventListener("change", evt => {
    simphiPlayer.app.mirrorView(evt.target.value);
});
simphiPlayer.selectspeed.addEventListener("change", evt => {
    const dict = { Slowest: -9, Slower: -4, "": 0, Faster: 3, Fastest: 5 };
    simphiPlayer.app.speed = 2 ** (dict[evt.target.value] / 12);
});
const updateLevelText = type => {
    const diffString = simphiPlayer.selectDifficulty.value || "SP";
    const levelString = simphiPlayer.selectLevel.value || "?";
    return [diffString, levelString].join("\u2002Lv.");
};
function updateLevelTextOut(i) {
    simphiPlayer.chartData.levelText = updateLevelText(i);
}
updateLevelText();
simphiPlayer.selectDifficulty.addEventListener(
    "change",
    () => (simphiPlayer.chartData.levelText = updateLevelText(0))
);
simphiPlayer.selectLevel.addEventListener(
    "change",
    () => (simphiPlayer.chartData.levelText = updateLevelText(1))
);
$id("select-volume").addEventListener("change", evt => {
    const volume = Number(evt.target.value);
    simphiPlayer.app.musicVolume = Math.min(1, 1 / volume);
    simphiPlayer.app.soundVolume = Math.min(1, volume);
    Promise.resolve().then(simphiPlayer.pause).then(simphiPlayer.pause);
});
// TODO
const lowRes = $id("lowRes");
const maxFrame = $id("maxFrame");
const isMaxFrame = $id("isMaxFrame");
const isForcedMaxFrame = $id("isForcedMaxFrame");
const enableVP = $id("enableVP");
const enableFR = $id("enableFR");
enableVP.addEventListener("change", evt => (simphiPlayer.app.enableVP = evt.target.checked));
enableFR.addEventListener("change", evt => (simphiPlayer.app.enableFR = evt.target.checked));
simphiPlayer.app.playMode = 0;
lowRes.addEventListener("change", evt => {
    simphiPlayer.app.setLowResFactor(
        evt.target.checked ? (window.devicePixelRatio < 2 ? 0.85 : 0.5) : 1
    );
});
simphiPlayer.selectbg.onchange = () => {
    //qwq
    simphiPlayer.app.bgImage = simphiPlayer.chartData.bgs.get(simphiPlayer.selectbg.value);
    simphiPlayer.app.bgImageBlur = simphiPlayer.chartData.bgsBlur.get(simphiPlayer.selectbg.value);
    simphiPlayer.stage.resize();
};
maxFrame.addEventListener("change", function () {
    if (this.value < 25) shared.game.ptmain.gameConfig.maxFrame = 25;
    if (this.value > 1000) shared.game.ptmain.gameConfig.maxFrame = 1000;
    simphiPlayer.frameAnimater.setFrameRate(
        shared.game.ptmain.gameConfig.maxFrame,
        shared.game.ptmain.gameConfig.isForcedMaxFrame
    );
});
isMaxFrame.addEventListener("change", function () {
    simphiPlayer.frameAnimater.setFrameRate(
        this.checked ? maxFrame.value : 0,
        shared.game.ptmain.gameConfig.isForcedMaxFrame
    );
});
isForcedMaxFrame.addEventListener("change", function () {
    simphiPlayer.frameAnimater.setFrameRate(isMaxFrame.checked ? maxFrame.value : 0, this.checked);
});
//play
simphiPlayer.emitter.addEventListener(
    "change",
    /** @this {Emitter} */ function () {
        simphiPlayer.app.canvas.classList.toggle("fade", this.eq("stop"));
        simphiPlayer.btnPlay.value = this.eq("stop") ? "播放" : "停止";
        simphiPlayer.btnPause.value = this.eq("pause") ? "继续" : "暂停";
        simphiPlayer.btnPause.classList.toggle("disabled", this.eq("stop"));
        for (const i of $$(".disabled-when-playing"))
            i.classList.toggle("disabled", this.ne("stop"));
        if (this.eq("play"))
            simphiPlayer.app.playMode =
                (shared.game.ptmain.gameConfig.autoplay &&
                    shared.game.ptmain.gameConfig.account &&
                    shared.game.ptmain.gameConfig.account.userBasicInfo.isPTDeveloper) ||
                shared.game.ptmain.playConfig.mode === "preview"
                    ? 1
                    : 0;
    }
);
simphiPlayer.btnPlay.addEventListener("click", async function () {
    if (this.classList.contains("disabled")) return;
    this.classList.add("disabled");
    await qwqStop();
    this.classList.remove("disabled");
});
simphiPlayer.btnPause.addEventListener("click", async function () {
    if (this.classList.contains("disabled")) return;
    await simphiPlayer.pause();
});
simphiPlayer.status2.reg(simphiPlayer.emitter, "change", _ =>
    simphiPlayer.qwqwq ? "Reversed" : ""
); //qwq
simphiPlayer.status2.reg(
    simphiPlayer.selectflip,
    "change",
    target => ["", "FlipX", "FlipY", "FlipX&Y"][target.value]
);
simphiPlayer.status2.reg(simphiPlayer.selectspeed, "change", target => target.value);
simphiPlayer.status2.reg(simphiPlayer.emitter, "change", (/** @type {Emitter} */ target) =>
    target.eq("pause") ? "Paused" : ""
);
async function qwqStop() {
    if (simphiPlayer.emitter.eq("stop")) {
        if (!simphiPlayer.selectchart.value)
            return msgHandler.sendError(shared.game.i18n.t("simphi.playErr.noChartSelected"));
        if (!simphiPlayer.selectbgm.value)
            return msgHandler.sendError(shared.game.i18n.t("simphi.playErr.noMusicSelected"));
        simphiPlayer.app.stage.style.display = "block";
        for (const i of simphiPlayer.before.values()) await i();
        audio.play(simphiPlayer.res["mute"], { loop: true, isOut: false }); //播放空音频(避免音画不同步)
        simphiPlayer.app.prerenderChart(
            simphiPlayer.modify(simphiPlayer.chartData.charts.get(simphiPlayer.selectchart.value))
        ); //fuckqwq
        const md5 = simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value);
        simphiPlayer.stat.level = Number(simphiPlayer.chartData.levelText.match(/\d+$/));
        simphiPlayer.stat.reset(
            simphiPlayer.app.chart.numOfNotes,
            md5,
            simphiPlayer.selectspeed.value
        );
        await loadLineData();
        simphiPlayer.app.bgImage =
            simphiPlayer.chartData.bgs.get(simphiPlayer.selectbg.value) ||
            simphiPlayer.res["NoImageWhite"];
        simphiPlayer.app.bgImageBlur =
            simphiPlayer.chartData.bgsBlur.get(simphiPlayer.selectbg.value) ||
            simphiPlayer.res["NoImageWhite"];
        const bgm = simphiPlayer.chartData.bgms.get(simphiPlayer.selectbgm.value);
        simphiPlayer.app.bgMusic = bgm.audio;
        simphiPlayer.app.bgVideo = bgm.video;
        simphiPlayer.timeInfo.duration = simphiPlayer.app.bgMusic.duration / simphiPlayer.app.speed;
        simphiPlayer.animationInfo.isInEnd = false;
        simphiPlayer.animationInfo.isOutStart = false;
        simphiPlayer.animationInfo.isOutEnd = false;
        simphiPlayer.timeInfo.timeBgm = 0;
        if (!simphiPlayer.showTransition.checked) simphiPlayer.animationTimer.in.addTime(3e3);
        simphiPlayer.stage.resize();
        simphiPlayer.frameAnimater.start();
        simphiPlayer.animationTimer.in.play();
        interact.activate();
        simphiPlayer.emitter.emit("play");
    } else {
        simphiPlayer.emitter.emit("stop");
        interact.deactive();
        audio.stop();
        simphiPlayer.frameAnimater.stop();
        //清除原有数据
        simphiPlayer.resultPageData = false;
        simphiPlayer.fucktemp2 = null;
        if (simphiPlayer.app.pauseNextTick)
            clearInterval(simphiPlayer.app.pauseNextTick),
                (simphiPlayer.app.pauseTime = 0),
                (simphiPlayer.app.pauseNextTick = null);
        simphiPlayer.hitFeedbackList.clear();
        simphiPlayer.hitImageList.clear();
        simphiPlayer.hitWordList.clear();
        simphiPlayer.animationTimer.in.reset();
        simphiPlayer.animationTimer.out.reset();
        simphiPlayer.animationTimer.end.reset();
        simphiPlayer.timeInfo.curTime = 0;
        simphiPlayer.timeInfo.curTime_ms = 0;
        simphiPlayer.timeInfo.duration = 0;
        for (const i of simphiPlayer.end.values()) await i();
    }
}
simphiPlayer.stat = simphiPlayer.stat;
export var hook = (self.hook = simphiPlayer);
const flag0 = "flag{\x71w\x71}";
hook.before.set(flag0, () => {
    const md5 = hook.chartsMD5.get(hook.selectchart.value);
    const hashDF = [
        "cdb5987ad81b70e3dc96153af2efaa61",
        "86d23af0cc595a703241536a2d29ee4b",
        "f5f8c244d317006103b67e1cdf6eb85b",
        "0e8ff64e65bf35382e30f980b5eec041",
    ];
    const hashD321 = ["4ddcd5d923007d661911989e79fe8a59"];
    if (md5 === "ab9d2cc3eb569236ead459ad4caba109") hook.now.set(flag0, loadModYukiOri(hook));
    else if (hashDF.includes(md5) && simphiPlayer.inputName.value === "Distorted Fate ")
        import("./plugins/demo/DFLevelEffect.js").then(({ loadMod }) =>
            hook.now.set(flag0, loadMod())
        );
    else if (hashD321.includes(md5) && simphiPlayer.inputName.value === "DESTRUCTION 3,2,1 ")
        import("./plugins/demo/321LevelEffect.js").then(({ loadMod }) =>
            hook.now.set(flag0, loadMod())
        );
    else hook.now.delete(flag0);
});

//plugin(filter)
const enableFilter = $id("enableFilter");
(function () {
    const input = $id("filterInput");
    input.addEventListener("change", async function () {
        if (!input.value) return;
        const filter = await import("@utils/js/filter.js");
        try {
            const filter0 = new filter.default(input.value);
            simphiPlayer.filter = (ctx, time, now) => {
                filter0.apply(ctx.canvas);
                ctx.drawImage(filter0.getImage(time, now, hook.filterOptions), 0, 0);
            };
        } catch (e) {
            console.error(e);
            simphiPlayer.filter = null;
        }
    });
    enableFilter.addEventListener("change", function () {
        if (!this.checked) simphiPlayer.filter = null;
        else input.dispatchEvent(new Event("change"));
    });
    enableFilter.dispatchEvent(new Event("change"));
})();

simphiPlayer.res = simphiPlayer.res;
simphiPlayer.audio = audio;
simphiPlayer.msgHandler = msgHandler;

simphiPlayer.qwqEnd = simphiPlayer.animationTimer.end;
simphiPlayer.bgms = simphiPlayer.chartData.bgms;
simphiPlayer.oriBuffers = simphiPlayer.chartData.oriBuffers;
simphiPlayer.selectbgm = simphiPlayer.selectbgm;
simphiPlayer.selectchart = simphiPlayer.selectchart;
simphiPlayer.chartsMD5 = simphiPlayer.chartData.chartsMD5;
simphiPlayer.pauseHook = () => simphiPlayer.emitter.eq("play") && simphiPlayer.pause();
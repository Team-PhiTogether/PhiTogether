import simphi from "./simphi";
import { audio } from "@utils/js/aup";
import { Utils } from "@utils/js/utils";
import {
    full,
    Timer,
    getConstructorName,
    isUndefined,
    frameTimer,
    time2Str,
    orientation,
    FrameAnimater,
} from "@utils/js/common.js";
import { urls, loadJS } from "./assetsProcessor/loader";
import { uploader, ZipReader, readFile } from "./assetsProcessor/reader";
import { InteractProxy } from "@utils/js/interact";
import shared from "@utils/js/shared";
// import { recordMgr } from "@components/recordMgr/recordMgr";
import { replayMgr } from "@components/recordMgr/replayMgr";

import { loadModYukiOri } from "./plugins/aprfools/loadModYukiOri";
import saveAdjustedChart from "./plugins/saveAdjustedChart";
import videoRecorder from "./plugins/video-recorder";
import { loadSkinFromBuffer, loadSkinFromDB } from "./plugins/skin";
import { gauge } from "./plugins/gauge";

import {
    imgBlur,
    imgShader,
    imgPainter,
    imgSplit,
    hex2rgba,
    rgba2hex,
} from "./assetsProcessor/imgProcessor";
import { createCanvas, drawRoundRect } from "./utils/canvas";

import ptdb from "@utils/ptdb";
import { msgHandler } from "@utils/js/msgHandler";
import { tween, Emitter, clip } from "./utils/simphiUtils";

import { judgeManager } from "./components/JudgeManager";
import { HitManager } from "./components/HitManager";
import { HitEvents } from "./components/HitManager/HitEvents";
import { HitWord } from './components/HitManager/HitWord';
import { LineImage } from "./components/LineImage";

const $id = query => document.getElementById(query);
const $ = query => document.body.querySelector(query);
const $$ = query => document.body.querySelectorAll(query);

export const simphiPlayer = {
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

    res: {}, //存放资源

    qwqwq: false,

    /**@type {Map<ImageBitmap,LineImage>} */
    lineImages: new Map(),

    stage: {
        resize(forced) {
            const ranking = forced || fucktemp2;
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
        while (selectbg.options.length) selectbg.options.remove(0);
        while (selectchart.options.length) selectchart.options.remove(0);
        while (selectbgm.options.length) selectbgm.options.remove(0);
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

    /**
     * @typedef {Object} HitFX
     * @property {ScaledNote[]} effects
     * @property {number} numOfParts
     * @property {number} duration
     */
    noteRender: {
        /** @type {Object<string,ScaledNote>} */
        note: {},
        /** @type {Object<string,HitFX>} */
        hitFX: {},
        /**
         * @param {string} name
         * @param {ImageBitmap} img
         * @param {number} scale
         */
        async update(name, img, scale, compacted = false) {
            this.note[name] = new ScaledNote(img, scale, compacted);
            if (name === "Tap")
                this.note["TapBad"] = new ScaledNote(await imgPainter(img, "#6c4343"), scale);
        },
        async updateFX(img, scale, limitX, limitY, hideParts, duration) {
            const hitRaw = await imgSplit(img, limitX, limitY);
            const hitPerfect = hitRaw.map(
                async img =>
                    new ScaledNote(
                        await imgShader(img, simphiPlayer.tmps.hitPerfectColor || "rgba(255,236,160,0.8823529)"),
                        scale
                    )
            ); //#fce491,#ffeca0e1
            const hitGood = hitRaw.map(
                async img =>
                    new ScaledNote(
                        await imgShader(img, simphiPlayer.tmps.hitGoodColor || "rgba(180,225,255,0.9215686)"),
                        scale
                    )
            ); //#9ed5f3,#b4e1ffeb
            img.close();
            this.hitFX["Perfect"] = {
                effects: await Promise.all(hitPerfect),
                numOfParts: hideParts ? 0 : 4,
                duration: duration | 0 || 500,
            };
            this.hitFX["Good"] = {
                effects: await Promise.all(hitGood),
                numOfParts: hideParts ? 0 : 3,
                duration: duration | 0 || 500,
            };
            hitRaw.forEach(img => img.close());
        },
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
            (effects[Math.floor(tick * effects.length)] || effects[effects.length - 1]).full(simphiPlayer.app.ctxos); //停留约0.5秒
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
                    eval(`{ const ctxos = simphiPlayer.app.ctxos; ${simphiPlayer.customResourceMeta["hitEvtDrawer"]} }`);
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
};
document.oncontextmenu = e => e.preventDefault(); //qwq

shared.game.simphi = simphiPlayer.app;

simphiPlayer.now.set("gauge", gauge.calc);

async function checkSupport() {
    const loadLib = async (name, urls, check) => {
        if (!check()) return true;
        const errmsg1 = shared.game.i18n.t("simphi.loadLib.err.msg1", { name });
        const errmsg2 = shared.game.i18n.t("simphi.loadLib.err.msg2", { name });
        const errmsg3 = shared.game.i18n.t("simphi.loadLib.err.msg3", { name });
        if (
            !(await loadJS(urls).catch(e =>
                msgHandler.sendError(errmsg1, e.message.replace(/.+/, errmsg2), true)
            ))
        )
            return false;
        if (!check()) return true;
        return msgHandler.sendError(errmsg1, errmsg3, true);
    };
    await Utils.addFont("Cairo", { alt: "Custom" });
    // await Utils.addFont('Saira', { alt: 'Custom' });
    //兼容性检测
    const isMobile =
        navigator["standalone"] !== undefined ||
        (navigator.platform.indexOf("Linux") > -1 && navigator.maxTouchPoints === 5);
    if (isMobile) $id("uploader-select").style.display = "none";
    if (navigator.userAgent.indexOf("MiuiBrowser") > -1) {
        //实测 v17.1.8 问题仍然存在，v17.4.80113 问题已修复
        const version = navigator.userAgent.match(/MiuiBrowser\/(\d+\.\d+)/);
        if (!version || parseFloat(version[1]) < 17.4)
            msgHandler.sendWarning(shared.game.i18n.t("simphi.compatibilityWarning.miBrowser"));
    }
    if (
        !(await loadLib(
            shared.game.i18n.t("simphi.loadLib.libNames.createImageBitmap"),
            urls.bitmap,
            () => isUndefined("createImageBitmap")
        ))
    )
        return -1;
    const oggCompatible = !!new Audio().canPlayType("audio/ogg");
    if (
        !(await loadLib(
            shared.game.i18n.t("simphi.loadLib.libNames.oggmentedBundle"),
            "/src/oggmented-bundle.js",
            () => !oggCompatible && isUndefined("oggmented")
        ))
    )
        return -4;
    audio.init(
        oggCompatible
            ? self.AudioContext || self["webkitAudioContext"]
            : self["oggmented"].OggmentedAudioContext
    ); //兼容Safari
    const webpCompatible = document
        .createElement("canvas")
        .toDataURL("image/webp")
        .includes("data:image/webp");
    if (
        !(await loadLib(
            shared.game.i18n.t("simphi.loadLib.libNames.webp"),
            urls.webp,
            () => !webpCompatible && isUndefined("webp")
        ))
    )
        return -5;
}
//自动填写歌曲信息
function adjustInfo() {
    for (const i of simphiPlayer.chartData.chartInfoData) {
        if (selectchart.value.trim() === i.Chart) {
            if (i.Name) inputName.value = i.Name;
            if (i.Musician) inputArtist.value = i.Musician; //Alternative
            if (i.Composer) inputArtist.value = i.Composer; //Alternative
            if (i.Artist) inputArtist.value = i.Artist;
            if (i.Level) {
                simphiPlayer.chartData.levelText = i.Level;
                const p = simphiPlayer.chartData.levelText
                    .toLocaleUpperCase()
                    .split("LV.")
                    .map(a => a.trim());
                if (p[0]) selectDifficulty.value = p[0];
                if (p[1]) selectLevel.value = p[1];
            }
            if (i.Illustrator) inputIllustrator.value = i.Illustrator;
            if (i.Designer) inputCharter.value = i.Designer;
            if (i.Charter) inputCharter.value = i.Charter;
            if (simphiPlayer.chartData.bgms.has(i.Music)) selectbgm.value = i.Music;
            if (simphiPlayer.chartData.bgs.has(i.Image)) {
                selectbg.value = i.Image;
                selectbg.dispatchEvent(new Event("change"));
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
        shared.game.loadHandler.l(
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
                selectbgm.appendChild(createOption(data.name, data.name));
                break;
            case "image":
                simphiPlayer.chartData.bgs.set(data.name, data.data);
                simphiPlayer.chartData.bgsBlur.set(data.name, await imgBlur(data.data));
                selectbg.appendChild(createOption(data.name, data.name));
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
                selectchart.appendChild(createOption(basename, data.name));
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
//qwq[water,demo,democlick]
const qwq = [null, false, null, null, 0, null];
//qwq end
const specialDrag = {
    listeningEvts: new Map(),
    update(evt, offsetX, offsetY) {
        if (!this.listeningEvts.has(evt)) return;
        this.func[this.listeningEvts.get(evt)].update(offsetX, offsetY);
    },
    reg(evt, offsetX, offsetY) {
        const { lineScale } = simphiPlayer.app;
        if (!simphiPlayer.emitter.eq("play") && !simphiPlayer.app.pauseTime && shared.game.ptmain.playConfig.practiseMode) {
            if (
                offsetY >= simphiPlayer.app.hlen + lineScale * 2.5 &&
                offsetX >= simphiPlayer.app.wlen * 0.25 &&
                offsetX <= simphiPlayer.app.wlen * 1.75 &&
                offsetY <= simphiPlayer.app.hlen + lineScale * 3.75 /* &&
                qwqIn.second >= 3 */
            ) {
                this.listeningEvts.set(evt, 0);
                this.func[0].reg(offsetX, offsetY);
            } else if (
                offsetY >= simphiPlayer.app.hlen + lineScale * 0.1 &&
                offsetX >= simphiPlayer.app.wlen + lineScale * 4 &&
                offsetX <= simphiPlayer.app.wlen * 1.5 + lineScale * 4 &&
                offsetY <= simphiPlayer.app.hlen + lineScale * 0.5 /* &&
                qwqIn.second >= 3 */
            ) {
                this.listeningEvts.set(evt, 1);
                this.func[1].reg(offsetX, offsetY);
            }
        }
        this.update(evt, offsetX, offsetY);
    },
    del(evt) {
        if (!this.listeningEvts.has(evt)) return;
        this.func[this.listeningEvts.get(evt)].del();
        this.listeningEvts.delete(evt);
    },
    func: [
        {
            reg: () => {
                const oldOffset = simphiPlayer.app.chart.offset;
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(selectchart.value),
                    selectspeed.value
                );
                loadLineData();
                simphiPlayer.app.chart.offset = oldOffset;
            },
            update: offsetX => {
                let progress = Math.max((offsetX - simphiPlayer.app.wlen * 0.25) / (simphiPlayer.app.wlen * 1.5), 0);
                if (progress < 1) simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.duration * progress;
                else simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.duration - 0.01;
                // if (qwqIn.second < 3) qwqIn.addTime(3 - qwqIn.second);
            },
            del: () => {
                const oldOffset = simphiPlayer.app.chart.offset;
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(selectchart.value),
                    selectspeed.value
                );
                loadLineData();
                simphiPlayer.app.chart.offset = oldOffset;
            },
        },
        {
            reg: () => {
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(selectchart.value),
                    selectspeed.value
                );
                loadLineData();
            },
            update: offsetX => {
                const speedNew =
                    0.5 +
                    Math.round(
                        Math.min(
                            Math.max(
                                (offsetX - simphiPlayer.app.wlen - simphiPlayer.app.lineScale * 4) / (simphiPlayer.app.wlen * 0.5),
                                0
                            ),
                            1
                        ) * 30
                    ) *
                        0.05;
                const deltaSpeed = simphiPlayer.app.speed / speedNew;
                (simphiPlayer.app.speed = speedNew),
                    (simphiPlayer.timeInfo.duration = simphiPlayer.app.bgMusic.duration / speedNew),
                    (simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.curTime * deltaSpeed);
            },
            del: () => {
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(selectchart.value),
                    selectspeed.value
                );
                loadLineData();
            },
        },
    ],
};
//hit start
const specialClick = {
    time: [0, 0, 0, 0],
    func: [
        function spClickLT() {
            if (simphiPlayer.emitter.eq("play")) btnPause.click();
        },
        async function spClickRT() {
            if (this.gameMode === "multi") return;
            btnPause.value === "暂停" && btnPause.click();
            if (shared.game.app.pauseNextTick)
                clearInterval(shared.game.app.pauseNextTick),
                    (shared.game.app.pauseTime = 0),
                    (shared.game.app.pauseNextTick = null);
            await shared.game.ptmain.retry();
            Promise.resolve().then(shared.game.qwqStop).then(shared.game.qwqStop);
        },
        function spClickLB() {
            if (shared.game.isPlayFinished() && shared.game.ptmain.playConfig.mode !== "preview") {
                shared.game.exportRecord && shared.game.exportRecord();
            } else if (shared.game.ptmain.gameMode === "single") {
                if (btnPause.value == "暂停") return; //btnPause.click();
                selectflip.value = simphiPlayer.app.mirrorView([3 - selectflip.value]);
            } else {
                shared.game.multiInstance.JITSOpen = !shared.game.multiInstance.JITSOpen;
            }
        },
        function spClickRB() {
            if (!fucktemp2) return;
            if (
                shared.game.ptmain.$route.path !== "/multipanel" &&
                shared.game.ptmain.gameMode === "multi"
            )
                shared.game.multiInstance.showStat();
            else shared.game.ptmain.spClickRT();
        },
        () => {
            simphiPlayer.hitManager.clear();
            shared.game.ptmain.$router.back();
        },
    ],
    click(id) {
        const now = performance.now();
        if (now - this.time[id] < 300) this.func[id]();
        else this.time[id] = now;
    },
    qwq(offsetX, offsetY) {
        const { lineScale } = simphiPlayer.app;
        if (offsetX < lineScale * 1.5 && offsetY < lineScale * 1.5) this.click(0);
        if (offsetX > simphiPlayer.app.canvasos.width - lineScale * 1.5 && offsetY < lineScale * 1.5)
            this.click(1);
        if (offsetX < lineScale * 1.5 && offsetY > simphiPlayer.app.canvasos.height - lineScale * 1.5)
            this.click(2);
        if (
            offsetX > simphiPlayer.app.canvasos.width - lineScale * 1.5 &&
            offsetY > simphiPlayer.app.canvasos.height - lineScale * 1.5
        )
            this.click(3);
        if (!simphiPlayer.emitter.eq("play") && !simphiPlayer.app.pauseTime) {
            if (offsetY < simphiPlayer.app.hlen + lineScale && offsetY > simphiPlayer.app.hlen - lineScale) {
                const imgX = n => simphiPlayer.app.wlen + lineScale * (n * 2 - 0.5);
                const imgXs = [imgX(-1.1), imgX(0), imgX(1), imgX(1) + lineScale * 1.5];
                if (
                    // back
                    imgXs[0] < offsetX &&
                    offsetX < imgXs[1]
                )
                    this.func[4]();
                if (
                    // retry
                    imgXs[1] < offsetX &&
                    offsetX < imgXs[2]
                )
                    this.func[1]();
                if (
                    // resume
                    imgXs[2] < offsetX &&
                    offsetX < imgXs[3]
                )
                    btnPause.click();
            }
            if (
                shared.game.ptmain.playConfig.practiseMode &&
                offsetY >= simphiPlayer.app.hlen - lineScale * 0.6 &&
                offsetY <= simphiPlayer.app.hlen + lineScale * 0.2 /* &&
                qwqIn.second >= 3 */
            ) {
                if (
                    offsetX >= simphiPlayer.app.wlen * 1.5 + lineScale * 2.4 &&
                    offsetX <= simphiPlayer.app.wlen * 1.5 + lineScale * 3.2
                ) {
                    const speedNew = Math.max(simphiPlayer.app.speed - 0.05, 0.5);
                    const deltaSpeed = simphiPlayer.app.speed / speedNew;
                    (simphiPlayer.app.speed = speedNew),
                        (simphiPlayer.timeInfo.duration = simphiPlayer.app.bgMusic.duration / speedNew),
                        (simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.curTime * deltaSpeed);
                    simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(selectchart.value))); //fuckqwq
                    simphiPlayer.stat.reset(
                        simphiPlayer.app.chart.numOfNotes,
                        simphiPlayer.chartData.chartsMD5.get(selectchart.value),
                        selectspeed.value
                    );
                    loadLineData();
                } else if (
                    offsetX >= simphiPlayer.app.wlen * 1.5 + lineScale * 3.3 &&
                    offsetX <= simphiPlayer.app.wlen * 1.5 + lineScale * 4.1
                ) {
                    const speedNew = Math.min(simphiPlayer.app.speed + 0.05, 2);
                    const deltaSpeed = simphiPlayer.app.speed / speedNew;
                    (simphiPlayer.app.speed = speedNew),
                        (simphiPlayer.timeInfo.duration = simphiPlayer.app.bgMusic.duration / speedNew),
                        (simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.curTime * deltaSpeed);
                    simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(selectchart.value))); //fuckqwq
                    simphiPlayer.stat.reset(
                        simphiPlayer.app.chart.numOfNotes,
                        simphiPlayer.chartData.chartsMD5.get(selectchart.value),
                        selectspeed.value
                    );
                    loadLineData();
                }
            }
        }
        if (
            shared.game.ptmain.playConfig.adjustOffset &&
            simphiPlayer.emitter.eq("play") &&
            offsetX > simphiPlayer.app.canvasos.width - lineScale * 7.5 &&
            offsetY > simphiPlayer.app.canvasos.height - lineScale * 5 &&
            !fucktemp2
        ) {
            const getBtnAxis = (p, ps) => {
                const h = lineScale * 0.5 - lineScale * Math.abs(p) * 0.1;
                const x = simphiPlayer.app.canvasos.width - 3.75 * lineScale + lineScale * ps;
                const y = simphiPlayer.app.canvasos.height - lineScale * 2.5 - h;
                return [x, y, x + h * 2, y + h * 2];
            };
            const btns = [
                [-3, -3.5, -1],
                [-2, -3, -5],
                [-1, -2.25, -50],
                [1, 1.5, 50],
                [2, 2.45, 5],
                [3, 3.15, 1],
            ];
            for (const i of btns) {
                const btnAxis = getBtnAxis(i[0], i[1]);
                if (
                    btnAxis[0] < offsetX &&
                    offsetX < btnAxis[2] &&
                    btnAxis[1] < offsetY &&
                    offsetY < btnAxis[3]
                ) {
                    simphiPlayer.app.chart.offset = (simphiPlayer.app.chart.offset * 1e3 + i[2]) / 1e3;
                }
            }
            if (
                simphiPlayer.app.canvasos.width - 3.5 * lineScale < offsetX &&
                offsetX < simphiPlayer.app.canvasos.width - 0.5 * lineScale &&
                simphiPlayer.app.canvasos.height - lineScale * 1.25 < offsetY &&
                offsetY < simphiPlayer.app.canvasos.height - lineScale * 0.25
            ) {
                saveAdjustedChart(simphiPlayer.app, fucktemp2);
            } else if (
                simphiPlayer.app.canvasos.width - 7 * lineScale < offsetX &&
                offsetX < simphiPlayer.app.canvasos.width - 5 * lineScale &&
                simphiPlayer.app.canvasos.height - lineScale * 1.25 < offsetY &&
                offsetY < simphiPlayer.app.canvasos.height - lineScale * 0.25
            ) {
                simphiPlayer.app.chart.offset = simphiPlayer.app.chart.offsetBak;
            }
        }
        if (simphiPlayer.animationTimer.end.second > 0) simphiPlayer.pressTime = simphiPlayer.pressTime > 0 ? -simphiPlayer.animationTimer.end.second : simphiPlayer.animationTimer.end.second;
    },
};

class HitFeedback {
    constructor(offsetX, offsetY, n1, n2) {
        this.offsetX = Number(offsetX);
        this.offsetY = Number(offsetY);
        this.color = String(n1);
        this.text = String(n2);
        this.time = 0;
    }
    static tap(offsetX, offsetY) {
        return new HitFeedback(offsetX, offsetY, "cyan", "");
    }
    static hold(offsetX, offsetY) {
        return new HitFeedback(offsetX, offsetY, "lime", "");
    }
    static move(offsetX, offsetY) {
        return new HitFeedback(offsetX, offsetY, "violet", "");
    }
}
// class HitImage {
//     constructor(offsetX, offsetY, n1, n3, rotation) {
//         const packs = simphiPlayer.noteRender.hitFX[n1];
//         this.offsetX = Number(offsetX) || 0;
//         this.offsetY = Number(offsetY) || 0;
//         this.rotation = simphiPlayer.tmps.hitFxRotate ? Number(rotation) || 0 : 0;
//         this.time = performance.now();
//         this.duration = packs.duration;
//         this.effects = packs.effects;
//         this.direction = Array(packs.numOfParts || 0)
//             .fill()
//             .map(() => [Math.random() * 80 + 185, Math.random() * 2 * Math.PI]);
//         this.color = String(n3);
//     }
//     static perfect(offsetX, offsetY, note) {
//         return new HitImage(
//             offsetX,
//             offsetY,
//             "Perfect",
//             simphiPlayer.tmps.hitPerfectColor || "#ffeca0",
//             note.line.rotation
//         );
//     }
//     static good(offsetX, offsetY, note) {
//         return new HitImage(
//             offsetX,
//             offsetY,
//             "Good",
//             simphiPlayer.tmps.hitGoodColor || "#b4e1ff",
//             note.line.rotation
//         );
//     }
// }
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
        if (evt.key === "Shift") btnPause.click();
        if (evt.key === " " && shared.game.ptmain.playConfig.mode === "preview") btnPause.click();
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
            ((obj.clientX - rect.left) / simphiPlayer.app.canvas.offsetWidth) * simphiPlayer.app.canvas.width -
            (simphiPlayer.app.canvas.width - simphiPlayer.app.canvasos.width) / 2,
        y:
            ((obj.clientY - rect.top) / simphiPlayer.app.canvas.offsetHeight) * simphiPlayer.app.canvas.height -
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
        for (const i of entries) await simphiPlayer.noteRender.update(i, simphiPlayer.res[i], 1);
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
            return simphiPlayer.customResourceMeta.res[name] || simphiPlayer.customResourceMeta.res[src] || "";
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
                simphiPlayer.noteRender.update(
                    "HoldEnd",
                    await createImageBitmap(img, 0, 0, img.width, bottom),
                    noteScale,
                    compacted
                );
                simphiPlayer.noteRender.update(
                    "Hold",
                    await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top),
                    noteScale,
                    compacted
                );
                simphiPlayer.noteRender.update(
                    "HoldHead",
                    await createImageBitmap(img, 0, img.height - top, img.width, top),
                    noteScale,
                    compacted
                );
            } else if (i === "HoldHL") {
                simphiPlayer.noteRender.update(
                    "HoldEndHL",
                    await createImageBitmap(img, 0, 0, img.width, bottom),
                    noteScale,
                    compacted
                );
                simphiPlayer.noteRender.update(
                    "HoldHL",
                    await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top),
                    noteScale,
                    compacted
                );
                simphiPlayer.noteRender.update(
                    "HoldHeadHL",
                    await createImageBitmap(img, 0, img.height - top, img.width, top),
                    noteScale,
                    compacted
                );
            } else await simphiPlayer.noteRender.update(i, resources[i], 1);
        } else {
            await simphiPlayer.noteRender.update(
                i.replaceAll(/\.(jpg|png)/gi, ""),
                resources[i],
                ["HoldHL", "HoldHeadHL"].includes(i) ? 8080 / 7875 : 1
            );
            if (manual) simphiPlayer.res[i.replaceAll(/\.(jpg|png)/gi, "")] = resources[i];
        }
    }
    if (resources["HitFXRaw"]) await simphiPlayer.noteRender.updateFX(resources["HitFXRaw"], 1);
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
            qwqPause,
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
                                    simphiPlayer.res[name] = await createImageBitmap(new Blob([xhr.response]));
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
        btnPause.classList.add("disabled");
    },
    { once: true }
);

simphiPlayer.frameAnimater.setCallback(mainLoop);
function onPageVisibilityChange() {
    if (document.visibilityState === "hidden")
        if (simphiPlayer.emitter.eq("play")) qwqPause();
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
/**
 * 播放bgm
 * @param {AudioBuffer} data
 * @param {number} [offset]
 */
function playBgm(data, offset) {
    if (!offset) offset = 0;
    simphiPlayer.timeInfo.curTime_ms = performance.now();
    simphiPlayer.tmps.bgMusic = audio.play(data, {
        offset: offset,
        playbackrate: simphiPlayer.app.speed,
        gainrate: simphiPlayer.app.musicVolume,
        interval: shared.game.ptmain.gameConfig.autoDelay ? 1 : 0,
    });
}
/**
 * @param {HTMLVideoElement} data
 * @param {number} [offset]
 */
function playVideo(data, offset) {
    if (!offset) offset = 0;
    data.currentTime = offset;
    data.playbackRate = simphiPlayer.app.speed;
    data.muted = true;
    return data.play();
}
let resultPageData = false;
let fucktemp2 = null;
simphiPlayer.stage.resize(); //qwq
//作图
function mainLoop() {
    frameTimer.addTick(); //计算fps
    const { lineScale } = simphiPlayer.app;
    simphiPlayer.timeInfo.nowTime_ms = performance.now();
    simphiPlayer.app.resizeCanvas();
    //计算时间
    if (simphiPlayer.animationTimer.out.second < 0.67) {
        loopNoCanvas();
        // main["flag{qwq}"](timeBgm);
        for (const i of simphiPlayer.now.values()) i(simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
        loopCanvas();
    } else if (!resultPageData) {
        resultPageData = true;
        audio.stop();
        btnPause.classList.add("disabled"); //qwq
        simphiPlayer.app.ctxos.globalCompositeOperation = "source-over";
        simphiPlayer.app.ctxos.resetTransform();
        simphiPlayer.app.ctxos.globalAlpha = 1;
        if (shared.game.ptmain.gameConfig.imageBlur)
            simphiPlayer.app.ctxos.drawImage(simphiPlayer.app.bgImageBlur, ...adjustSize(simphiPlayer.app.bgImageBlur, simphiPlayer.app.canvasos, 1));
        else simphiPlayer.app.ctxos.drawImage(simphiPlayer.app.bgImage, ...adjustSize(simphiPlayer.app.bgImage, simphiPlayer.app.canvasos, 1));
        simphiPlayer.app.ctxos.fillStyle = "#000"; //背景变暗
        simphiPlayer.app.ctxos.globalAlpha = 0.2;
        simphiPlayer.app.ctxos.fillRect(0, 0, simphiPlayer.app.canvasos.width, simphiPlayer.app.canvasos.height);
        setTimeout(() => {
            if (!resultPageData) return; //避免快速重开后直接结算
            const difficulty = ["ez", "hd", "in", "at"].indexOf(
                simphiPlayer.chartData.levelText.slice(0, 2).toLocaleLowerCase()
            );
            audio.play(
                simphiPlayer.res[
                    `LevelOver${
                        !shared.game.ptmain.gameConfig.usekwlevelOverbgm
                            ? difficulty < 0
                                ? 2
                                : difficulty
                            : "0"
                    }${!shared.game.ptmain.gameConfig.usekwlevelOverbgm ? "_v2" : ""}`
                ],
                { loop: true }
            );
            simphiPlayer.animationTimer.end.reset();
            simphiPlayer.animationTimer.end.play();
            simphiPlayer.stat.level = Number(simphiPlayer.chartData.levelText.match(/\d+$/));
            fucktemp2 = simphiPlayer.stat.getData(simphiPlayer.app.playMode === 1, selectspeed.value);
        }, 1e3);
        shared.game.ptmain.playFinished();
        if (shared.game.ptmain.playConfig.adjustOffset) saveAdjustedChart(simphiPlayer.app, fucktemp2);
        simphiPlayer.app.stage.style.zIndex = 0;
        simphiPlayer.stage.resize(true);
    } //只让它执行一次
    if (fucktemp2) {
        resultPageRenderer(fucktemp2);
        simphiPlayer.app.ctxos.globalAlpha = 0.5;
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Retry"],
            simphiPlayer.app.canvasos.width - simphiPlayer.app.lineScale * 1,
            simphiPlayer.app.canvasos.height - simphiPlayer.app.lineScale * 1,
            simphiPlayer.app.lineScale * 0.75,
            simphiPlayer.app.lineScale * 0.75
        );
        simphiPlayer.app.ctxos.textAlign = "left";
        // if (shared.game.ptmain.playConfig.mode !== "preview") {
        // drawRoundRect(
        //   ctxos,
        //   -lineScale * 7.5,
        //   canvasos.height - lineScale * 5,
        //   lineScale * 7.5,
        //   lineScale * 5,
        //   lineScale * 0.25
        // ).fill();
        //   ctxos.fillText(
        //     "下载游玩回放",
        //     20,
        //     50
        //   )
        // };
        simphiPlayer.app.ctxos.textAlign = null;
    }
    if (!simphiPlayer.emitter.eq("play") && !simphiPlayer.app.pauseTime && !fucktemp2) {
        simphiPlayer.app.ctxos.globalAlpha = 0.5;
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Loop"],
            simphiPlayer.app.lineScale * 0.25,
            simphiPlayer.app.canvasos.height - simphiPlayer.app.lineScale * 1,
            simphiPlayer.app.lineScale * 0.75,
            simphiPlayer.app.lineScale * 0.75
        );
    }
    if (
        simphiPlayer.app.canvas.width > simphiPlayer.app.canvasos.width ||
        simphiPlayer.app.canvas.height > simphiPlayer.app.canvasos.height ||
        fucktemp2
    ) {
        simphiPlayer.app.ctx.globalAlpha = 1;
        if (shared.game.ptmain.gameConfig.imageBlur || fucktemp2)
            simphiPlayer.app.ctx.drawImage(simphiPlayer.app.bgImageBlur, ...adjustSize(simphiPlayer.app.bgImageBlur, simphiPlayer.app.canvas, 1.1));
        else simphiPlayer.app.ctx.drawImage(simphiPlayer.app.bgImage, ...adjustSize(simphiPlayer.app.bgImage, simphiPlayer.app.canvas, 1.1));
        simphiPlayer.app.ctx.fillStyle = "#000";
        simphiPlayer.app.ctx.globalAlpha = 0.2;
        simphiPlayer.app.ctx.fillRect(0, 0, simphiPlayer.app.canvas.width, simphiPlayer.app.canvas.height);
    }
    simphiPlayer.app.ctx.globalAlpha = 1;
    simphiPlayer.app.ctx.drawImage(
        simphiPlayer.app.canvasos,
        (simphiPlayer.app.canvas.width - simphiPlayer.app.canvasos.width) / 2,
        (simphiPlayer.app.canvas.height - simphiPlayer.app.canvasos.height) / 2
    );
    //Copyright
    simphiPlayer.app.ctx.font = `${lineScale * 0.3}px Saira`;
    simphiPlayer.app.ctx.fillStyle = "#FFF";
    simphiPlayer.app.ctx.globalAlpha = 0.25;
    simphiPlayer.app.ctx.textAlign = "center";
    simphiPlayer.app.ctx.textBaseline = "middle";
    simphiPlayer.app.ctx.fillText(
        simphiPlayer.app.playMode === 1
            ? `PhiTogether Preview (Respack by ${simphiPlayer.customResourceMeta["author"]})`
            : `${replayMgr.replaying ? `[ ·REC ${replayMgr.playerInfo.username || replayMgr.playerInfo.userName} (ID ${replayMgr.playerInfo.id}) ] ` : ""}PhiTogether ${
                  spec.thisVersion
              } @ sim-phi - P${judgeManager.time.p * 1000} G${
                  judgeManager.time.g * 1000
              } S${simphiPlayer.app.speed.toFixed(2)}${shared.game.ptmain.gameConfig.fullScreenJudge ? " F" : ""} - ${
                  shared.game.ptmain.noAccountMode ? "OFFLINE" : "ONLINE"
              } - RES ${simphiPlayer.customResourceMeta["author"]}`,
        simphiPlayer.app.canvas.width / 2 - lineScale * 0,
        simphiPlayer.app.canvas.height - lineScale * 0.3 - (simphiPlayer.app.canvas.height - simphiPlayer.app.canvasos.height) / 2
    );
}

function loopNoCanvas() {
    if (!simphiPlayer.animationInfo.isInEnd && (simphiPlayer.animationTimer.in.second >= 3 || simphiPlayer.timeInfo.timeBgm > 0)) {
        simphiPlayer.animationInfo.isInEnd = true;
        if (simphiPlayer.emitter.eq("play")) {
            playBgm(simphiPlayer.app.bgMusic);
            if (simphiPlayer.app.bgVideo) playVideo(simphiPlayer.app.bgVideo);
        }
    }
    if (simphiPlayer.emitter.eq("play") && simphiPlayer.animationInfo.isInEnd && !simphiPlayer.animationInfo.isOutStart)
        simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime + (simphiPlayer.timeInfo.nowTime_ms - simphiPlayer.timeInfo.curTime_ms) / 1e3;
    if (simphiPlayer.timeInfo.timeBgm >= simphiPlayer.timeInfo.duration)
        if (shared.game.ptmain.playConfig.practiseMode && !(shared.game.ptmain.playConfig.previewMode && !shared.game.ptmain.playConfig.adjustOffset))
            simphiPlayer.emitter.eq("play") && qwqPause();
        else simphiPlayer.animationInfo.isOutStart = true;
    if (showTransition.checked && simphiPlayer.animationInfo.isOutStart && !simphiPlayer.animationInfo.isOutEnd) {
        simphiPlayer.animationInfo.isOutEnd = true;
        simphiPlayer.animationTimer.out.play();
    }
    simphiPlayer.timeInfo.timeChart = Math.max(
        simphiPlayer.timeInfo.timeBgm -
            (simphiPlayer.app.chart.offset + Number(shared.game.ptmain.gameConfig.inputOffset) / 1e3 || 0) /
                simphiPlayer.app.speed,
        0
    );
    //遍历判定线events和Note
    simphiPlayer.app.updateByTime(simphiPlayer.timeInfo.timeChart);
    //更新打击特效和触摸点动画
    simphiPlayer.hitFeedbackList.update();
    simphiPlayer.hitImageList.update();
    simphiPlayer.hitWordList.update();
    for (const i of simphiPlayer.hitManager.list) {
        if (i.type === "keyboard") continue;
        if (!i.isTapped) simphiPlayer.hitFeedbackList.add(HitFeedback.tap(i.offsetX, i.offsetY));
        else if (i.isMoving)
            simphiPlayer.hitFeedbackList.add(HitFeedback.move(i.offsetX, i.offsetY)); //qwq
        else if (i.isActive) simphiPlayer.hitFeedbackList.add(HitFeedback.hold(i.offsetX, i.offsetY));
    }
    //触发判定和播放打击音效
    if (simphiPlayer.animationInfo.isInEnd && !simphiPlayer.app.pauseTime) {
        const judgeWidth = simphiPlayer.app.canvasos.width * 0.118125;
        if (!replayMgr.replaying) judgeManager.addEvent(simphiPlayer.app.notes, simphiPlayer.timeInfo.timeChart);
        judgeManager.execute(simphiPlayer.app.drags, simphiPlayer.timeInfo.timeChart, judgeWidth);
        judgeManager.execute(simphiPlayer.app.flicks, simphiPlayer.timeInfo.timeChart, judgeWidth);
        judgeManager.execute(simphiPlayer.app.tapholds, simphiPlayer.timeInfo.timeChart, judgeWidth);
    }
    //更新判定
    simphiPlayer.hitManager.update();
    simphiPlayer.tmps.bgImage = shared.game.ptmain.gameConfig.imageBlur ? simphiPlayer.app.bgImageBlur : simphiPlayer.app.bgImage;
    simphiPlayer.tmps.bgVideo = simphiPlayer.app.bgVideo;
    simphiPlayer.tmps.progress = (simphiPlayer.qwqwq ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm : simphiPlayer.timeInfo.timeBgm) / simphiPlayer.timeInfo.duration;
    simphiPlayer.tmps.name = inputName.value || inputName.placeholder;
    simphiPlayer.tmps.artist = inputArtist.value;
    simphiPlayer.tmps.illustrator = inputIllustrator.value || inputIllustrator.placeholder;
    simphiPlayer.tmps.charter = inputCharter.value || inputCharter.placeholder;
    simphiPlayer.tmps.level = simphiPlayer.chartData.levelText;
    if (simphiPlayer.stat.combo > 2) {
        simphiPlayer.tmps.combo = `${simphiPlayer.stat.combo}`;
        simphiPlayer.tmps.combo2 = shared.game.ptmain.playConfig.mode === "preview" ? "PREVIEW" : "COMBO";
    } else simphiPlayer.tmps.combo = simphiPlayer.tmps.combo2 = "";
    simphiPlayer.tmps.showStat = true;
    simphiPlayer.tmps.statStatus = {
        pause: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        combonumber: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        combo: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        score: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        bar: { show: true, offsetX: 0, offsetY: 0, alpha: 1 }, // 血量
        name: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        level: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
    };
    simphiPlayer.tmps.customForeDraw = null;
    simphiPlayer.tmps.customBackDraw = null;
    if (replayMgr.replaying)
        simphiPlayer.tmps.combo2 = `REPLAY (${replayMgr.playerInfo.username || replayMgr.playerInfo.userName})`;
}
function loopCanvas() {
    //尽量不要在这里出现app
    const { lineScale } = simphiPlayer.app;
    simphiPlayer.app.ctxos.clearRect(0, 0, simphiPlayer.app.canvasos.width, simphiPlayer.app.canvasos.height); //重置画面
    simphiPlayer.app.ctxos.globalAlpha = 1;
    //绘制背景
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.drawImage(simphiPlayer.tmps.bgImage, ...adjustSize(simphiPlayer.tmps.bgImage, simphiPlayer.app.canvasos, 1));
    if (simphiPlayer.animationInfo.isInEnd && simphiPlayer.tmps.bgVideo && !simphiPlayer.qwqwq) {
        const { videoWidth: width, videoHeight: height } = simphiPlayer.tmps.bgVideo;
        simphiPlayer.app.ctxos.drawImage(simphiPlayer.tmps.bgVideo, ...adjustSize({ width, height }, simphiPlayer.app.canvasos, 1));
    }
    // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
    if ((simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5) && !simphiPlayer.stat.lineStatus) drawLine(0, lineScale); //绘制判定线(背景后0)
    // if (qwq[4]) ctxos.filter = 'none';
    simphiPlayer.app.ctxos.resetTransform();
    simphiPlayer.app.ctxos.fillStyle = "#000"; //背景变暗
    if ((!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67))
        simphiPlayer.app.ctxos.globalAlpha =
            tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5) * shared.game.ptmain.gameConfig.backgroundDim;
    else
        simphiPlayer.app.ctxos.globalAlpha =
            shared.game.ptmain.gameConfig.backgroundDim -
            tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5) *
                (shared.game.ptmain.gameConfig.backgroundDim - 0.2);
    simphiPlayer.app.ctxos.fillRect(0, 0, simphiPlayer.app.canvasos.width, simphiPlayer.app.canvasos.height);
    if ((simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5) && simphiPlayer.tmps.customBackDraw != null) simphiPlayer.tmps.customBackDraw(simphiPlayer.app.ctxos); // 自定义背景
    // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
    if (simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5) drawLine(simphiPlayer.stat.lineStatus ? 2 : 1, lineScale); //绘制判定线(背景前1)
    // if (qwq[4]) ctxos.filter = 'none';
    simphiPlayer.app.ctxos.resetTransform();
    if (simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.out.second === 0) {
        //绘制note
        drawNotes();
        if (shared.game.ptmain.gameConfig.showPoint) {
            //绘制定位点
            simphiPlayer.app.ctxos.font = `${lineScale}px Saira`;
            simphiPlayer.app.ctxos.textAlign = "center";
            for (const i of simphiPlayer.app.linesReversed) {
                simphiPlayer.app.ctxos.setTransform(i.cosr, i.sinr, -i.sinr, i.cosr, i.offsetX, i.offsetY);
                simphiPlayer.app.ctxos.globalAlpha = 1;
                simphiPlayer.app.ctxos.fillStyle = "violet";
                simphiPlayer.app.ctxos.fillRect(
                    -lineScale * 0.2,
                    -lineScale * 0.2,
                    lineScale * 0.4,
                    lineScale * 0.4
                );
                simphiPlayer.app.ctxos.fillStyle = "yellow";
                simphiPlayer.app.ctxos.globalAlpha = (i.alpha + 0.5) / 1.5;
                simphiPlayer.app.ctxos.fillText(`${i.lineId.toString()}`, 0, -lineScale * 0.3);
            }
            for (const i of simphiPlayer.app.notesReversed) {
                if (!i.visible) continue;
                simphiPlayer.app.ctxos.setTransform(i.cosr, i.sinr, -i.sinr, i.cosr, i.offsetX, i.offsetY);
                simphiPlayer.app.ctxos.globalAlpha = 1;
                simphiPlayer.app.ctxos.fillStyle = "lime";
                simphiPlayer.app.ctxos.fillRect(
                    -lineScale * 0.2,
                    -lineScale * 0.2,
                    lineScale * 0.4,
                    lineScale * 0.4
                );
                simphiPlayer.app.ctxos.fillStyle = "cyan";
                simphiPlayer.app.ctxos.globalAlpha = i.realTime > simphiPlayer.timeInfo.timeChart ? 1 : 0.5;
                simphiPlayer.app.ctxos.fillText(`${i.name}:${i.line.speed}`, 0, -lineScale * 0.3);
            }
        }
    }
    // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
    simphiPlayer.hitImageList.animate(); //绘制打击特效1
    // if (qwq[4]) ctxos.filter = 'none';
    if (shared.game.ptmain.gameConfig.showCE2) simphiPlayer.hitWordList.animate(); //绘制打击特效2
    simphiPlayer.app.ctxos.globalAlpha = 1;
    //绘制进度条
    simphiPlayer.app.ctxos.setTransform(
        simphiPlayer.app.canvasos.width / 1920,
        0,
        0,
        simphiPlayer.app.canvasos.width / 1920,
        0,
        lineScale *
            ((!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67)
                ? tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5) - 1
                : -tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5)) *
            1.75
    );
    simphiPlayer.app.ctxos.drawImage(simphiPlayer.res["ProgressBar"], simphiPlayer.tmps.progress * 1920 - 1920, 0);
    //绘制文字
    simphiPlayer.app.ctxos.resetTransform();
    for (const i of simphiPlayer.after.values()) i();
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    //开头过渡动画
    if (!simphiPlayer.animationInfo.isInEnd) {
        if (simphiPlayer.animationTimer.in.second < 0.67) simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5);
        else if (simphiPlayer.animationTimer.in.second >= 2.5)
            simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(6 - simphiPlayer.animationTimer.in.second * 2);
        const name = simphiPlayer.tmps.name;
        const artist = simphiPlayer.tmps.artist;
        const illustrator = `Illustration designed by ${simphiPlayer.tmps.illustrator}`;
        const charter = `Level designed by ${simphiPlayer.tmps.charter}`;
        const theme = `Resource Pack ${simphiPlayer.customResourceMeta["name"]} designed by ${simphiPlayer.customResourceMeta["author"]}`;
        simphiPlayer.app.ctxos.textAlign = "center";
        //曲名
        simphiPlayer.app.ctxos.textBaseline = "alphabetic";
        simphiPlayer.app.ctxos.font = `${lineScale * 1.1}px Saira`;
        const dxsnm = simphiPlayer.app.ctxos.measureText(name).width;
        if (dxsnm > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 1.1) / dxsnm) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(name, simphiPlayer.app.wlen, simphiPlayer.app.hlen * 0.75);
        //曲师、曲绘和谱师
        simphiPlayer.app.ctxos.textBaseline = "top";
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxa = simphiPlayer.app.ctxos.measureText(artist).width;
        if (dxa > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxa) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(artist, simphiPlayer.app.wlen, simphiPlayer.app.hlen * 0.75 + lineScale * 0.85);
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxi = simphiPlayer.app.ctxos.measureText(illustrator).width;
        if (dxi > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxi) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(illustrator, simphiPlayer.app.wlen, simphiPlayer.app.hlen * 1.25 + lineScale * 0.15);
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxc = simphiPlayer.app.ctxos.measureText(charter).width;
        if (dxc > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxc) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(charter, simphiPlayer.app.wlen, simphiPlayer.app.hlen * 1.25 + lineScale * 1.0);
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxt = simphiPlayer.app.ctxos.measureText(theme).width;
        if (dxt > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxt) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(theme, simphiPlayer.app.wlen, simphiPlayer.app.hlen * 1.25 + lineScale * 1.75);
        //判定线(装饰用)
        simphiPlayer.app.ctxos.globalAlpha = 1;
        simphiPlayer.app.ctxos.setTransform(1, 0, 0, 1, simphiPlayer.app.wlen, simphiPlayer.app.hlen);
        const imgW =
            lineScale * 48 * (simphiPlayer.animationTimer.in.second < 0.67 ? tween.easeInCubic(simphiPlayer.animationTimer.in.second * 1.5) : 1);
        const imgH = lineScale * 0.15; //0.1333...
        if (simphiPlayer.animationTimer.in.second >= 2.5) simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(6 - simphiPlayer.animationTimer.in.second * 2);
        simphiPlayer.app.ctxos.drawImage(
            shared.game.ptmain.gameConfig.lineColor ? simphiPlayer.res["JudgeLineMP"] : simphiPlayer.res["JudgeLine"],
            -imgW / 2,
            -imgH / 2,
            imgW,
            imgH
        );
    }

    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.resetTransform();
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    //绘制分数和combo以及暂停按钮
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.setTransform(
        1,
        0,
        0,
        1,
        0,
        lineScale *
            ((!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67)
                ? tween.easeIOCubic(simphiPlayer.animationTimer.in.second * 1.5) - 1
                : -tween.easeIOCubic(simphiPlayer.animationTimer.out.second * 1.5)) *
            1.75
    );
    simphiPlayer.app.ctxos.textBaseline = "alphabetic";
    if (simphiPlayer.tmps.showStat) {
        // 绘制分数
        simphiPlayer.app.ctxos.font = `${lineScale * 0.95}px Saira`;
        simphiPlayer.app.ctxos.textAlign = "right";
        simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.score.alpha;
        simphiPlayer.app.ctxos.fillText(
            simphiPlayer.stat.scoreStr,
            simphiPlayer.app.canvasos.width - lineScale * 0.65 + simphiPlayer.tmps.statStatus.score.offsetX,
            lineScale * 1.375 + simphiPlayer.tmps.statStatus.score.offsetY
        );
        if (
            shared.game.ptmain.gameConfig.showAcc &&
            shared.game.ptmain.playConfig.mode !== "preview"
        ) {
            simphiPlayer.app.ctxos.font = `${lineScale * 0.66}px Saira`;
            simphiPlayer.app.ctxos.fillText(
                simphiPlayer.stat.accStr,
                simphiPlayer.app.canvasos.width - lineScale * 0.65 + simphiPlayer.tmps.statStatus.score.offsetX,
                lineScale * 2.05 + simphiPlayer.tmps.statStatus.score.offsetY
            );
        }
        shared.game.ptmain.playConfig.mode !== "preview" ? gauge.draw() : null;
    }
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "center";
    simphiPlayer.app.ctxos.font = `${lineScale * 1.32}px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.combonumber.alpha;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.tmps.combo,
        simphiPlayer.app.wlen + simphiPlayer.tmps.statStatus.combonumber.offsetX,
        lineScale * 1.375 + simphiPlayer.tmps.statStatus.combonumber.offsetY
    );
    simphiPlayer.app.ctxos.globalAlpha =
        (!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67)
            ? tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5)
            : 1 - tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5);
    simphiPlayer.app.ctxos.globalAlpha *= simphiPlayer.tmps.statStatus.combo.alpha;
    simphiPlayer.app.ctxos.font = `${lineScale * 0.5}px Saira`;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.tmps.combo2,
        simphiPlayer.app.wlen + simphiPlayer.tmps.statStatus.combo.offsetX,
        lineScale * 1.95 + simphiPlayer.tmps.statStatus.combo.offsetY
    );
    //绘制曲名和等级
    simphiPlayer.app.ctxos.setTransform(
        1,
        0,
        0,
        1,
        0,
        lineScale *
            ((!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67)
                ? 1 - tween.easeIOCubic(simphiPlayer.animationTimer.in.second * 1.5)
                : tween.easeIOCubic(simphiPlayer.animationTimer.out.second * 1.5)) *
            1.75
    );
    simphiPlayer.app.ctxos.textBaseline = "alphabetic";
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.font = `${lineScale * 0.63}px Saira`;
    const dxlvl = simphiPlayer.app.ctxos.measureText(simphiPlayer.chartData.levelText).width;
    if (dxlvl > simphiPlayer.app.wlen - lineScale)
        simphiPlayer.app.ctxos.font = `${((lineScale * 0.63) / dxlvl) * (simphiPlayer.app.wlen - lineScale)}px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.level.alpha;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.tmps.level,
        simphiPlayer.app.canvasos.width - lineScale * 0.75 + simphiPlayer.tmps.statStatus.level.offsetX,
        simphiPlayer.app.canvasos.height - lineScale * 0.66 + simphiPlayer.tmps.statStatus.level.offsetY
    );
    simphiPlayer.app.ctxos.textAlign = "left";
    // ctxos.textBaseline = "middle";
    simphiPlayer.app.ctxos.font = `${lineScale * 0.63}px Saira`;
    const dxsnm = simphiPlayer.app.ctxos.measureText(inputName.value || inputName.placeholder).width;
    if (dxsnm > simphiPlayer.app.wlen - lineScale)
        simphiPlayer.app.ctxos.font = `${((lineScale * 0.63) / dxsnm) * (simphiPlayer.app.wlen - lineScale)}px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.name.alpha;
    simphiPlayer.app.ctxos.fillText(
        inputName.value || inputName.placeholder,
        lineScale * 0.65 + simphiPlayer.tmps.statStatus.name.offsetX,
        simphiPlayer.app.canvasos.height - lineScale * 0.66 + simphiPlayer.tmps.statStatus.name.offsetY
    );
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.resetTransform();
    if ((simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5) && simphiPlayer.tmps.customForeDraw != null) simphiPlayer.tmps.customForeDraw(simphiPlayer.app.ctxos); // 自定义前景
    if (simphiPlayer.animationInfo.isInEnd && simphiPlayer.filter) simphiPlayer.filter(simphiPlayer.app.ctxos, simphiPlayer.timeInfo.timeBgm, simphiPlayer.timeInfo.nowTime_ms / 1e3); //滤镜处理
    if (shared.game.ptmain.gameConfig.feedback) simphiPlayer.hitFeedbackList.animate(); //绘制打击特效0
    simphiPlayer.app.ctxos.resetTransform();
    try {
        shared.game.graphicHandler.whilePlayingHook(simphiPlayer.app.ctx, simphiPlayer.app.ctxos, lineScale);
    } catch (e) {
        console.warn(e);
    }
    //绘制时间和帧率以及note打击数
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    if (!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67) simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5);
    else simphiPlayer.app.ctxos.globalAlpha = 1 - tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5);
    simphiPlayer.app.ctxos.font = `${lineScale * 0.4}px Saira`;
    simphiPlayer.app.ctxos.textBaseline = "middle";
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.globalAlpha = 0.5;
    simphiPlayer.app.ctxos.fillText(frameTimer.fpsStr, simphiPlayer.app.canvasos.width - lineScale * 0.05, lineScale * 0.5);
    simphiPlayer.app.ctxos.font = `${lineScale * 0.25}px Saira`;
    simphiPlayer.app.ctxos.fillText("FPS", simphiPlayer.app.canvasos.width - lineScale * 0.05, lineScale * 0.8);
    simphiPlayer.app.ctxos.textBaseline = "alphabetic";
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.resetTransform();
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.canPause ? simphiPlayer.tmps.statStatus.pause.alpha : 0.5;
    if (simphiPlayer.tmps.showStat)
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Pause"],
            lineScale * 0.6 + simphiPlayer.tmps.statStatus.pause.offsetX,
            lineScale * 0.7 + simphiPlayer.tmps.statStatus.pause.offsetY,
            lineScale * 0.63,
            lineScale * 0.7
        );
    if (shared.game.ptmain.playConfig.adjustOffset) {
        simphiPlayer.app.ctxos.fillStyle = "gray";
        simphiPlayer.app.ctxos.globalAlpha = 0.75;
        drawRoundRect(
            simphiPlayer.app.ctxos,
            simphiPlayer.app.canvasos.width - lineScale * 7.5,
            simphiPlayer.app.canvasos.height - lineScale * 5,
            lineScale * 7.5,
            lineScale * 5,
            lineScale * 0.25
        ).fill();
        simphiPlayer.app.ctxos.globalAlpha = 1;
        simphiPlayer.app.ctxos.fillStyle = "#fff";
        simphiPlayer.app.ctxos.textBaseline = "middle";
        simphiPlayer.app.ctxos.textAlign = "center";
        simphiPlayer.app.ctxos.font = `${lineScale * 0.75}px Saira`;
        simphiPlayer.app.ctxos.fillText(
            shared.game.i18n.t("simphi.adjustOffset.title"),
            simphiPlayer.app.canvasos.width - lineScale * 3.75,
            simphiPlayer.app.canvasos.height - lineScale * 4.25
        );
        simphiPlayer.app.ctxos.font = `${lineScale * 0.65}px Saira`;
        simphiPlayer.app.ctxos.fillText(
            `${(simphiPlayer.app.chart.offset * 1e3).toFixed(0)}ms`,
            simphiPlayer.app.canvasos.width - lineScale * 3.75,
            simphiPlayer.app.canvasos.height - lineScale * 2.5
        );
        simphiPlayer.app.ctxos.font = `${lineScale * 0.5}px Saira`;
        const drawIcon = (p, ps) => {
            const h = lineScale * 0.5 - lineScale * Math.abs(p) * 0.1;
            simphiPlayer.app.ctxos.fillStyle = "#fff";
            drawRoundRect(
                simphiPlayer.app.ctxos,
                simphiPlayer.app.canvasos.width - 3.75 * lineScale + lineScale * ps,
                simphiPlayer.app.canvasos.height - lineScale * 2.5 - h,
                h * 2,
                h * 2,
                lineScale * 0.1
            ).fill();
            simphiPlayer.app.ctxos.fillStyle = "#000";
            simphiPlayer.app.ctxos.fillText(
                p > 0 ? "+" : "-",
                simphiPlayer.app.canvasos.width - 3.75 * lineScale + lineScale * ps + h,
                simphiPlayer.app.canvasos.height - lineScale * 2.5
            );
        };
        drawIcon(-3, -3.5);
        drawIcon(-2, -3);
        drawIcon(-1, -2.25);
        drawIcon(1, 1.5);
        drawIcon(2, 2.45);
        drawIcon(3, 3.15);
        simphiPlayer.app.ctxos.fillStyle = "#fff";
        drawRoundRect(
            simphiPlayer.app.ctxos,
            simphiPlayer.app.canvasos.width - 7 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 1.25,
            lineScale * 3,
            lineScale,
            lineScale * 0.1
        ).fill();
        drawRoundRect(
            simphiPlayer.app.ctxos,
            simphiPlayer.app.canvasos.width - 3.5 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 1.25,
            lineScale * 3,
            lineScale,
            lineScale * 0.1
        ).fill();
        simphiPlayer.app.ctxos.fillStyle = "#000";
        simphiPlayer.app.ctxos.font = `${lineScale * 0.65}px Saira`;
        simphiPlayer.app.ctxos.fillText(
            shared.game.i18n.t("simphi.adjustOffset.reset"),
            simphiPlayer.app.canvasos.width - 5.5 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 0.75
        );
        simphiPlayer.app.ctxos.fillText(
            shared.game.i18n.t("simphi.adjustOffset.save"),
            simphiPlayer.app.canvasos.width - 2 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 0.75
        );
    }
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    if (!simphiPlayer.emitter.eq("play")) {
        simphiPlayer.app.ctxos.fillStyle = "#000"; //背景变暗
        simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.app.pauseBackgroundDimPara1
            ? Math.max(
                  0.6 -
                      0.6 *
                          tween.easeOutCubic(
                              (performance.now() - simphiPlayer.app.pauseBackgroundDimPara1) / 2000
                          ),
                  0
              )
            : 0.6; //背景不透明度
        simphiPlayer.app.ctxos.fillRect(0, 0, simphiPlayer.app.canvasos.width, simphiPlayer.app.canvasos.height);
        simphiPlayer.app.ctxos.globalAlpha = 0.5;
        if (!simphiPlayer.app.pauseTime) {
            simphiPlayer.app.ctxos.globalAlpha = 1;
            simphiPlayer.app.ctxos.fillStyle = "#fff";
            simphiPlayer.app.ctxos.textBaseline = "middle";
            simphiPlayer.app.ctxos.font = `${lineScale * 0.4}px Saira`;
            simphiPlayer.app.ctxos.textAlign = "left";
            simphiPlayer.app.ctxos.fillText(
                `${time2Str(simphiPlayer.qwqwq ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm : simphiPlayer.timeInfo.timeBgm)}/${time2Str(
                    simphiPlayer.timeInfo.duration
                )}${simphiPlayer.status2.text}`,
                lineScale * 0.05,
                lineScale * 0.35
            );
            // ctxos.textAlign = "right";
            [
                simphiPlayer.stat.noteRank[5] + simphiPlayer.stat.noteRank[4] + simphiPlayer.stat.noteRank[1], // Perfect
                simphiPlayer.stat.noteRank[7] + simphiPlayer.stat.noteRank[3], // Good
                simphiPlayer.stat.noteRank[7], // GoodEarly
                simphiPlayer.stat.noteRank[3], // GoodLate
                simphiPlayer.stat.noteRank[6], // Bad
                simphiPlayer.stat.noteRank[2], // Miss
                // stat.maxcombo,     // 肉眼可见
            ].forEach((val, idx) => {
                const comboColor = ["#f0ed69", "#0ac3ff", "#0ac3ff", "#0ac3ff", "#fe7b93", "#999"];
                const comboText = ["Perfect:", "Good:", "Early:", "Late:", "Bad:", "Miss:"];
                simphiPlayer.app.ctxos.fillStyle = comboColor[idx];
                simphiPlayer.app.ctxos.fillText(
                    comboText[idx],
                    lineScale * 0.05,
                    simphiPlayer.app.canvasos.height / 2 + lineScale * (idx - 2.8) * 0.5
                );
                simphiPlayer.app.ctxos.fillText(
                    val.toString(),
                    lineScale * 1.75,
                    simphiPlayer.app.canvasos.height / 2 + lineScale * (idx - 2.8) * 0.5
                );
            });
            simphiPlayer.app.ctxos.fillStyle = "#fff";
            simphiPlayer.app.ctxos.fillText(
                `DSP:  ${simphiPlayer.stat.curDispStr}`,
                lineScale * 0.05,
                simphiPlayer.app.canvasos.height / 2 + lineScale * 2.6
            );
            simphiPlayer.app.ctxos.fillText(
                `AVG:  ${simphiPlayer.stat.avgDispStr}`,
                lineScale * 0.05,
                simphiPlayer.app.canvasos.height / 2 + lineScale * 3.1
            );
            // ctxos.textBaseline = "alphabetic";
            // ctxos.textAlign = "center";
            // stat.combos.forEach((val, idx) => {
            //   const comboColor = ["#fff", "#0ac3ff", "#f0ed69", "#a0e9fd", "#fe4365"];
            //   ctxos.fillStyle = comboColor[idx];
            //   ctxos.fillText(
            //     val.toString(),
            //     lineScale * (idx + 0.55) * 1.1,
            //     canvasos.height - lineScale * 0.1
            //   );
            // });
            const imgBaseLine = n => simphiPlayer.app.hlen - (lineScale * n) / 2;
            const imgX = n => simphiPlayer.app.wlen + lineScale * (n * 2 - 0.5);
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.res["Back"],
                imgX(-1.1),
                imgBaseLine(1.5),
                lineScale * 1.5,
                lineScale * 1.5
            );
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.res["Retry"],
                imgX(0),
                imgBaseLine(1.25),
                lineScale * 1.25,
                lineScale * 1.25
            );
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.res["Resume"],
                imgX(1),
                imgBaseLine(1.5),
                lineScale * 1.5,
                lineScale * 1.5
            );
            if (shared.game.ptmain.playConfig.practiseMode) {
                simphiPlayer.app.ctxos.font = `${lineScale * 0.5}px Saira`;
                simphiPlayer.app.ctxos.fillStyle = "#fff";
                simphiPlayer.app.ctxos.textAlign = "center";
                simphiPlayer.app.ctxos.textBaseline = "middle";
                simphiPlayer.app.ctxos.fillText("00:00.000", simphiPlayer.app.wlen * 0.25, simphiPlayer.app.hlen + lineScale * 4.25);
                simphiPlayer.app.ctxos.fillText(
                    time2Str(simphiPlayer.timeInfo.duration, true),
                    simphiPlayer.app.wlen * 1.75,
                    simphiPlayer.app.hlen + lineScale * 4.25
                );
                const progress = (simphiPlayer.qwqwq ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm : simphiPlayer.timeInfo.timeBgm) / simphiPlayer.timeInfo.duration;
                simphiPlayer.app.ctxos.fillText(
                    time2Str(simphiPlayer.qwqwq ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm : simphiPlayer.timeInfo.timeBgm, true),
                    simphiPlayer.app.wlen * (0.25 + 1.5 * progress),
                    simphiPlayer.app.hlen + lineScale * 2
                );
                drawRoundRect(
                    simphiPlayer.app.ctxos,
                    simphiPlayer.app.wlen * 1.5 + lineScale * 2.5,
                    simphiPlayer.app.hlen - lineScale * 0.5,
                    lineScale * 0.6,
                    lineScale * 0.6,
                    lineScale * 0.1
                ).fill();
                drawRoundRect(
                    simphiPlayer.app.ctxos,
                    simphiPlayer.app.wlen * 1.5 + lineScale * 3.4,
                    simphiPlayer.app.hlen - lineScale * 0.5,
                    lineScale * 0.6,
                    lineScale * 0.6,
                    lineScale * 0.1
                ).fill();
                simphiPlayer.app.ctxos.textAlign = "left";
                simphiPlayer.app.ctxos.fillText(
                    `Speed: ${simphiPlayer.app.speed.toFixed(3)}`,
                    simphiPlayer.app.wlen + lineScale * 4,
                    simphiPlayer.app.hlen - lineScale * 0.25
                );
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen + lineScale * 4,
                    simphiPlayer.app.hlen + lineScale * 0.25,
                    simphiPlayer.app.wlen * 0.5,
                    lineScale * 0.1
                );
                simphiPlayer.app.ctxos.fillStyle = "#000";
                simphiPlayer.app.ctxos.textAlign = "center";
                simphiPlayer.app.ctxos.fillText(
                    "-",
                    simphiPlayer.app.wlen * 1.5 + lineScale * 2.8,
                    simphiPlayer.app.hlen - lineScale * 0.25
                );
                simphiPlayer.app.ctxos.fillText(
                    "+",
                    simphiPlayer.app.wlen * 1.5 + lineScale * 3.7,
                    simphiPlayer.app.hlen - lineScale * 0.2
                );
                simphiPlayer.app.ctxos.fillStyle = "#a9a9a9";
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen * 0.25,
                    simphiPlayer.app.hlen + lineScale * 2.5,
                    simphiPlayer.app.wlen * 1.5,
                    lineScale * 1.25
                );
                simphiPlayer.app.ctxos.fillStyle = "deepskyblue";
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen * (0.25 + 1.5 * progress),
                    simphiPlayer.app.hlen + lineScale * 2.25,
                    lineScale * 0.1,
                    lineScale * 1.5
                );
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen +
                        lineScale * 3.9 +
                        simphiPlayer.app.wlen * 0.5 * Math.min((simphiPlayer.app.speed - 0.5) / 1.5, 1),
                    simphiPlayer.app.hlen + lineScale * 0.15,
                    lineScale * 0.1,
                    lineScale * 0.3
                );
            }
        }
    }
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    if (simphiPlayer.app.pauseTime) {
        simphiPlayer.app.ctxos.font = `${lineScale * 2}px Saira`;
        simphiPlayer.app.ctxos.fillStyle = "#FFF";
        simphiPlayer.app.ctxos.globalAlpha = 1;
        simphiPlayer.app.ctxos.textAlign = "center";
        simphiPlayer.app.ctxos.textBaseline = "middle";
        simphiPlayer.app.ctxos.fillText(simphiPlayer.app.pauseTime, simphiPlayer.app.canvasos.width / 2, simphiPlayer.app.canvasos.height / 2);
    }
}
//判定线函数，undefined/0:默认,1:非,2:恒成立
function drawLine(bool, lineScale) {
    simphiPlayer.app.ctxos.globalAlpha = 1;
    const tw = 1 - tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5);
    for (const i of simphiPlayer.app.linesReversed) {
        if (bool ^ Number(i.imageD) && simphiPlayer.animationTimer.out.second < 0.67) {
            if (i.alpha < 0) continue;
            if (i.attachUI) {
                simphiPlayer.tmps.statStatus[i.attachUI] = {
                    show: true,
                    offsetX: i.offsetX - simphiPlayer.app.wlen,
                    offsetY: i.offsetY - simphiPlayer.app.hlen,
                    alpha: i.alpha,
                };

                continue;
            }
            simphiPlayer.app.ctxos.globalAlpha = i.alpha;
            simphiPlayer.app.ctxos.setTransform(
                i.cosr * tw,
                i.sinr,
                -i.sinr * tw,
                i.cosr,
                simphiPlayer.app.wlen + (i.offsetX - simphiPlayer.app.wlen) * tw,
                i.offsetY
            ); //hiahiah
            const imgS = ((i.imageU ? lineScale * 18.75 : simphiPlayer.app.canvasos.height) * i.imageS) / 1080;
            const imgW =
                imgS *
                i.imageW *
                i.imageA *
                (i.scaleX * (-0.0081 + 0.5214 * (simphiPlayer.app.canvasos.width / simphiPlayer.app.canvasos.height)) || 1); //1.5 0.774 1.78 0.92
            const imgH = imgS * i.imageH * (i.scaleY * 1 || 1);
            // ctxos.save();
            if (!i.text) {
                // const lineImage = i.imageL[i.imageC && shared.game.ptmain.gameConfig.lineColor ? stat.lineStatus : 0];
                // if (i.scaleX) ctxos.scale(-1, 1);
                try {
                    if (i.color && i.color != "#fff" && i.color != "#ffffff") {
                        if (!i.isCustomImage) {
                            simphiPlayer.app.ctxos.fillStyle = i.color || "#fff";
                            simphiPlayer.app.ctxos.fillRect(-imgW / 2, -imgH / 2, imgW, imgH);
                            simphiPlayer.app.ctxos.fillStyle = "#fff";
                        } else {
                            simphiPlayer.app.ctxos.drawImage(
                                getColoredLineImage(i, i.color),
                                -imgW / 2,
                                -imgH / 2,
                                imgW,
                                imgH
                            );
                        }
                    } else {
                        simphiPlayer.app.ctxos.drawImage(
                            i.imageL[
                                i.imageC && shared.game.ptmain.gameConfig.lineColor
                                    ? simphiPlayer.stat.lineStatus
                                    : 0
                            ],
                            -imgW / 2,
                            -imgH / 2,
                            imgW,
                            imgH
                        );
                    }
                } catch (err) {
                    simphiPlayer.app.ctxos.drawImage(
                        i.imageL[
                            i.imageC && shared.game.ptmain.gameConfig.lineColor
                                ? simphiPlayer.stat.lineStatus
                                : 0
                        ],
                        -imgW / 2,
                        -imgH / 2,
                        imgW,
                        imgH
                    );
                }
            } else {
                simphiPlayer.app.ctxos.fillStyle = i.color || "#fff";
                simphiPlayer.app.ctxos.textAlign = "center";
                simphiPlayer.app.ctxos.textBaseline = "middle";
                simphiPlayer.app.ctxos.font = `${lineScale * (i.scaleY || 1)}px Saira`;
                simphiPlayer.app.ctxos.fillText(i.text, 0, 0);
            }
            // ctxos.restore();
        }
    }
}
function getColoredLineImage(line, hex) {
    if (!hex)
        return line.imageL[
            line.imageC && shared.game.ptmain.gameConfig.lineColor ? simphiPlayer.stat.lineStatus : 0
        ];
    hex = hex.toLowerCase();
    return (
        line.imagesColored[hex] || (line.imagesColored[hex] = imgShader(line.imageL[0], hex, true))
    );
}

function resultPageRenderer(statData) {
    (simphiPlayer.app.ctxos.shadowBlur = 40), (simphiPlayer.app.ctxos.shadowColor = "#000000");
    simphiPlayer.app.ctxos.globalAlpha = 1;
    const k = 3.7320508075688776; //tan75°

    const qwq0 = (simphiPlayer.app.canvasos.width - simphiPlayer.app.canvasos.height / k) / (16 - 9 / k);
    simphiPlayer.app.ctxos.setTransform(
        qwq0 / 120,
        0,
        0,
        qwq0 / 120,
        simphiPlayer.app.wlen - qwq0 * 8,
        simphiPlayer.app.hlen - qwq0 * 4.5
    ); //?

    simphiPlayer.app.ctxos.globalAlpha = 1;
    let imgWidthAct = 700 * (simphiPlayer.app.bgImage.width / simphiPlayer.app.bgImage.height),
        imgHeightAct = 700;
    if (imgWidthAct < 1200) {
        imgWidthAct = 1200;
        imgHeightAct = 1200 * (simphiPlayer.app.bgImage.height / simphiPlayer.app.bgImage.width);
    }
    simphiPlayer.app.ctxos.drawImage(
        simphiPlayer.app.bgImage,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2460.5 - imgWidthAct / 2,
        208 - (imgHeightAct - 645) / 2,
        imgWidthAct,
        imgHeightAct
    );

    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2010.24,
        182,
        890,
        700,
        30
    );
    simphiPlayer.app.ctxos.globalCompositeOperation = "destination-in";
    simphiPlayer.app.ctxos.fill();
    simphiPlayer.app.ctxos.globalCompositeOperation = "source-over";
    simphiPlayer.app.ctxos.stroke();

    simphiPlayer.app.ctxos.globalAlpha = 0.5;
    simphiPlayer.app.ctxos.fillStyle = "black";
    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2740,
        180,
        800,
        360,
        30
    ).fill();

    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2040,
        563,
        800,
        150,
        30
    ).fill();
    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2040,
        735,
        800,
        150,
        30
    ).fill();

    //歌名和等级
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.restore();
    simphiPlayer.app.ctxos.setTransform(
        qwq0 / 120,
        0,
        0,
        qwq0 / 120,
        simphiPlayer.app.wlen - qwq0 * 8,
        simphiPlayer.app.hlen - qwq0 * 4.5
    ); //?
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `73.5px Saira`;
    const dxsnm = simphiPlayer.app.ctxos.measureText(inputName.value || inputName.placeholder).width;
    if (dxsnm > 600) simphiPlayer.app.ctxos.font = `${(73.5 / dxsnm) * 600}px Saira`;
    simphiPlayer.app.ctxos.fillText(
        inputName.value || inputName.placeholder,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2050,
        830
    );
    simphiPlayer.app.ctxos.font = `30px Saira`;
    const dxlvl = simphiPlayer.app.ctxos.measureText(simphiPlayer.chartData.levelText).width;
    if (dxlvl > 150) simphiPlayer.app.ctxos.font = `${(30 / dxlvl) * 150}px Saira`;
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.chartData.levelText,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2860,
        835
    );
    simphiPlayer.app.ctxos.textAlign = "left";
    //Rank图标
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 1.3) * 3.75);
    const qwq2 = 293 + clip((simphiPlayer.animationTimer.end.second - 1.3) * 3.75) * 100;
    const qwq3 = 410 - tween.ease15(clip((simphiPlayer.animationTimer.end.second - 1.3) * 1.5)) * 164;
    if (simphiPlayer.stat.lineStatus == 3)
        simphiPlayer.app.ctxos.drawImage(simphiPlayer.res["FCV"], 1685 - qwq3, 373 - qwq3, qwq3 * 2, qwq3 * 2);
    else
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Ranks"][simphiPlayer.stat.rankStatus],
            1685 - qwq3,
            373 - qwq3,
            qwq3 * 2,
            qwq3 * 2
        );
    //准度和连击
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 0.8) * 1.5);
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.font = `55px Saira`;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.accStr,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2785,
        638
    );
    simphiPlayer.app.ctxos.font = `26px Saira`;
    simphiPlayer.app.ctxos.fillText(
        "ACCURACY",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2783,
        673
    );
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `55px Saira`;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.maxcombo,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2095,
        638
    );
    simphiPlayer.app.ctxos.font = `26px Saira`;
    simphiPlayer.app.ctxos.fillText(
        "MAX COMBO",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2095,
        673
    );
    // ctxos.fillStyle = statData[4];
    //分数
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `86px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 0.4) * 2.0);
    simphiPlayer.app.ctxos.fillText(simphiPlayer.stat.scoreStr, -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2795, 415);
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.font = `25px Saira`;
    simphiPlayer.app.ctxos.fillStyle = "#83e691";
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.app.speed === 1 ? "" : statData.textAboveStr.replace("{SPEED}", simphiPlayer.app.speed.toFixed(2)),
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2860,
        792
    );

    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 0.4) * 2.5);
    simphiPlayer.app.ctxos.fillStyle = "#a2e27f";
    simphiPlayer.app.ctxos.font = `25px Saira`;
    simphiPlayer.app.ctxos.fillText(
        statData.newBestStr,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2800,
        337
    );
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `30px Saira`;
    simphiPlayer.app.ctxos.fillText(
        statData.scoreBest,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2800,
        460
    );
    // 	ctxos.globalAlpha = clip((qwqEnd.second - 1.87) * 2.50);
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.fillText(
        statData.scoreDelta,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2950,
        460
    );

    //Perfect, good, bad, miss
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.font = `45px Saira`;
    simphiPlayer.app.ctxos.textAlign = "center";
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 1.25) * 2.5);
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.perfect,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2140,
        812
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.good,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2288,
        812
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[6],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2395,
        812
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[2],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2502,
        812
    );
    simphiPlayer.app.ctxos.font = `20px Saira`;
    simphiPlayer.app.ctxos.fillText(
        "PERFECT",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2140,
        842
    );
    simphiPlayer.app.ctxos.fillText("GOOD", -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2288, 842);
    simphiPlayer.app.ctxos.fillText("BAD", -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2395, 842);
    simphiPlayer.app.ctxos.fillText("MISS", -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2502, 842);
    simphiPlayer.app.ctxos.font = `28px Saira`;
    //Early, Late
    const qwq4 = clip((qwq[3] > 0 ? simphiPlayer.animationTimer.end.second - qwq[3] : 0.2 - simphiPlayer.animationTimer.end.second - qwq[3]) * 5.0);
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.fillText("EARLY", -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2610, 800);
    simphiPlayer.app.ctxos.fillText("LATE", -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2625, 838);
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[7],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2775,
        800
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[3],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2775,
        838
    );
    // 控制按钮
    // // ctxos.fillStyle = "#fff";
    // ctxos.font = '40px Saira';
    // // ctxos.textAlign = 'right';
    // ctxos.fillText("BACK", 1620, 1075 + (canvasos.height / (qwq0 / 120) - 1075) / 2 - 40);
    // ctxos.textAlign = 'left';
    // ctxos.fillText("RETRY", 350, 1075 + (canvasos.height / (qwq0 / 120) - 1075) / 2 - 40);
    try {
        shared.game.graphicHandler.resultHook(simphiPlayer.app.ctx, simphiPlayer.app.ctxos);
    } catch (e) {
        console.warn(e);
    }
    (simphiPlayer.app.ctxos.shadowBlur = 0), (simphiPlayer.app.ctxos.shadowColor = "#000000");
    simphiPlayer.app.ctxos.resetTransform();
}

class ScaledNote {
    constructor(img, scale, compacted) {
        this.img = img;
        this.scale = scale;
        const dx = (-img.width / 2) * scale;
        const dy = (-img.height / 2) * scale;
        const dw = img.width * scale;
        const dh = img.height * scale;
        /** @param {CanvasRenderingContext2D} ctx */
        this.full = ctx => ctx.drawImage(img, dx, dy, dw, dh);
        /** @param {CanvasRenderingContext2D} ctx */
        this.head = ctx => ctx.drawImage(img, dx, 0, dw, dh);
        /** @param {CanvasRenderingContext2D} ctx */
        this.body = (ctx, offset, length) => ctx.drawImage(img, dx, offset, dw, length);
        /** @param {CanvasRenderingContext2D} ctx */
        this.tail = (ctx, offset) => ctx.drawImage(img, dx, offset - dh, dw, dh);
        if (compacted) {
            /** @param {CanvasRenderingContext2D} ctx */
            this.head = ctx => ctx.drawImage(img, dx, dy, dw, dh);
            /** @param {CanvasRenderingContext2D} ctx */
            this.tail = (ctx, offset) => ctx.drawImage(img, dx, offset - dh - dy, dw, dh);
        }
    }
}
//绘制Note
function drawNotes() {
    for (const i of simphiPlayer.app.holds) drawHold(i, simphiPlayer.timeInfo.timeChart);
    for (const i of simphiPlayer.app.dragsReversed) drawDrag(i);
    for (const i of simphiPlayer.app.tapsReversed) drawTap(i);
    for (const i of simphiPlayer.app.flicksReversed) drawFlick(i);
}

// function getNoteVisible(note) {
//   if (note.line.alpha >= 0) return true;
//   else if (note.line.alpha >= -1) return true;
//   else if (note.line.alpha >= -2) {
//     if (note.isAbove) return true;
//     else return false;
//   } else return true;
// }

function drawTap(note) {
    if (simphiPlayer.app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
    const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
    const nsr = simphiPlayer.app.noteScaleRatio * (note.size || 1);
    if (!note.visible || (note.scored && !note.badtime)) return;
    simphiPlayer.app.ctxos.setTransform(
        nsr * note.cosr,
        nsr * note.sinr,
        -nsr * note.sinr,
        nsr * note.cosr,
        note.offsetX,
        note.offsetY
    );
    if (note.badtime) {
        simphiPlayer.app.ctxos.globalAlpha = 1 - clip((performance.now() - note.badtime) / 500);
        simphiPlayer.noteRender.note["TapBad"].full(simphiPlayer.app.ctxos);
    } else {
        simphiPlayer.app.ctxos.globalAlpha =
            note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
        if (simphiPlayer.qwqwq) simphiPlayer.app.ctxos.globalAlpha *= Math.max(1 + (simphiPlayer.timeInfo.timeChart - note.realTime) / 1.5, 0); //过线前1.5s出现
        simphiPlayer.noteRender.note[HL ? "TapHL" : "Tap"].full(simphiPlayer.app.ctxos);
    }
}

function drawDrag(note) {
    if (simphiPlayer.app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
    const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
    const nsr = simphiPlayer.app.noteScaleRatio * (note.size || 1);
    if (!note.visible || (note.scored && !note.badtime)) return;
    simphiPlayer.app.ctxos.setTransform(
        nsr * note.cosr,
        nsr * note.sinr,
        -nsr * note.sinr,
        nsr * note.cosr,
        note.offsetX,
        note.offsetY
    );
    if (note.badtime);
    else {
        simphiPlayer.app.ctxos.globalAlpha =
            note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
        if (simphiPlayer.qwqwq) simphiPlayer.app.ctxos.globalAlpha *= Math.max(1 + (simphiPlayer.timeInfo.timeChart - note.realTime) / 1.5, 0);
        simphiPlayer.noteRender.note[HL ? "DragHL" : "Drag"].full(simphiPlayer.app.ctxos);
    }
}

function drawHold(note, realTime) {
    if (simphiPlayer.app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
    const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
    const nsr = simphiPlayer.app.noteScaleRatio * (note.size || 1);
    if (!note.visible || note.realTime + note.realHoldTime < realTime) return; //qwq
    simphiPlayer.app.ctxos.globalAlpha =
        note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
    if (simphiPlayer.qwqwq) simphiPlayer.app.ctxos.globalAlpha *= Math.max(1 + (simphiPlayer.timeInfo.timeChart - note.realTime) / 1.5, 0);
    simphiPlayer.app.ctxos.setTransform(
        nsr * note.cosr,
        nsr * note.sinr,
        -nsr * note.sinr,
        nsr * note.cosr,
        note.offsetX,
        note.offsetY
    );
    const baseLength = (simphiPlayer.app.scaleY / nsr) * note.speed * simphiPlayer.app.speed;
    const holdLength = baseLength * note.realHoldTime;
    if (note.realTime > realTime) {
        simphiPlayer.noteRender.note[HL ? "HoldHeadHL" : "HoldHead"].head(simphiPlayer.app.ctxos);
        simphiPlayer.noteRender.note[HL ? "HoldHL" : "Hold"].body(simphiPlayer.app.ctxos, -holdLength, holdLength);
    } else {
        simphiPlayer.noteRender.note[HL ? "HoldHL" : "Hold"].body(
            simphiPlayer.app.ctxos,
            -holdLength,
            holdLength - baseLength * (realTime - note.realTime)
        );
    }
    simphiPlayer.noteRender.note["HoldEnd"].tail(simphiPlayer.app.ctxos, -holdLength);
}

function drawFlick(note) {
    if (simphiPlayer.app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
    const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
    const nsr = simphiPlayer.app.noteScaleRatio * (note.size || 1);
    if (!note.visible || (note.scored && !note.badtime)) return;
    simphiPlayer.app.ctxos.setTransform(
        nsr * note.cosr,
        nsr * note.sinr,
        -nsr * note.sinr,
        nsr * note.cosr,
        note.offsetX,
        note.offsetY
    );
    if (note.badtime);
    else {
        simphiPlayer.app.ctxos.globalAlpha =
            note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
        if (simphiPlayer.qwqwq) simphiPlayer.app.ctxos.globalAlpha *= Math.max(1 + (simphiPlayer.timeInfo.timeChart - note.realTime) / 1.5, 0);
        simphiPlayer.noteRender.note[HL ? "FlickHL" : "Flick"].full(simphiPlayer.app.ctxos);
    }
}
//调节画面尺寸和全屏相关(返回source播放aegleseeker会出现迷之error)
function adjustSize(source, dest, scale) {
    const { width: sw, height: sh } = source;
    const { width: dw, height: dh } = dest;
    if (dw * sh > dh * sw)
        return [
            (dw * (1 - scale)) / 2,
            (dh - ((dw * sh) / sw) * scale) / 2,
            dw * scale,
            ((dw * sh) / sw) * scale,
        ];
    return [
        (dw - ((dh * sw) / sh) * scale) / 2,
        (dh * (1 - scale)) / 2,
        ((dh * sw) / sh) * scale,
        dh * scale,
    ];
}

//html交互(WIP)
$id("select-note-scale").addEventListener("change", evt => simphiPlayer.app.setNoteScale(evt.target.value));
$id("select-background-dim").addEventListener(
    "change",
    evt => (simphiPlayer.app.brightness = Number(evt.target.value))
);
$id("highLight").addEventListener("change", evt => (simphiPlayer.app.multiHint = evt.target.checked));
const selectbg = $id("select-bg");
const btnPlay = $id("btn-play");
const btnPause = $id("btn-pause");
const selectbgm = $id("select-bgm");
const selectchart = $id("select-chart");
const selectflip = $id("select-flip");
selectflip.addEventListener("change", evt => {
    simphiPlayer.app.mirrorView(evt.target.value);
});
const selectspeed = $id("select-speed");
selectspeed.addEventListener("change", evt => {
    const dict = { Slowest: -9, Slower: -4, "": 0, Faster: 3, Fastest: 5 };
    simphiPlayer.app.speed = 2 ** (dict[evt.target.value] / 12);
});
const inputName = $id("input-name");
const inputArtist = $id("input-artist");
const inputCharter = $id("input-charter");
const inputIllustrator = $id("input-illustrator");
const selectDifficulty = $id("select-difficulty");
const selectLevel = $id("select-level");
const updateLevelText = type => {
    const diffString = selectDifficulty.value || "SP";
    const levelString = selectLevel.value || "?";
    return [diffString, levelString].join("\u2002Lv.");
};
function updateLevelTextOut(i) {
    simphiPlayer.chartData.levelText = updateLevelText(i);
}
updateLevelText();
selectDifficulty.addEventListener("change", () => (simphiPlayer.chartData.levelText = updateLevelText(0)));
selectLevel.addEventListener("change", () => (simphiPlayer.chartData.levelText = updateLevelText(1)));
$id("select-volume").addEventListener("change", evt => {
    const volume = Number(evt.target.value);
    simphiPlayer.app.musicVolume = Math.min(1, 1 / volume);
    simphiPlayer.app.soundVolume = Math.min(1, volume);
    Promise.resolve().then(qwqPause).then(qwqPause);
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
const showTransition = $id("showTransition");
lowRes.addEventListener("change", evt => {
    simphiPlayer.app.setLowResFactor(evt.target.checked ? (window.devicePixelRatio < 2 ? 0.85 : 0.5) : 1);
});
selectbg.onchange = () => {
    //qwq
    simphiPlayer.app.bgImage = simphiPlayer.chartData.bgs.get(selectbg.value);
    simphiPlayer.app.bgImageBlur = simphiPlayer.chartData.bgsBlur.get(selectbg.value);
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
        btnPlay.value = this.eq("stop") ? "播放" : "停止";
        btnPause.value = this.eq("pause") ? "继续" : "暂停";
        btnPause.classList.toggle("disabled", this.eq("stop"));
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
btnPlay.addEventListener("click", async function () {
    if (this.classList.contains("disabled")) return;
    this.classList.add("disabled");
    await qwqStop();
    this.classList.remove("disabled");
});
btnPause.addEventListener("click", async function () {
    if (this.classList.contains("disabled")) return;
    await qwqPause();
});
simphiPlayer.status2.reg(simphiPlayer.emitter, "change", _ => (simphiPlayer.qwqwq ? "Reversed" : "")); //qwq
simphiPlayer.status2.reg(selectflip, "change", target => ["", "FlipX", "FlipY", "FlipX&Y"][target.value]);
simphiPlayer.status2.reg(selectspeed, "change", target => target.value);
simphiPlayer.status2.reg(simphiPlayer.emitter, "change", (/** @type {Emitter} */ target) =>
    target.eq("pause") ? "Paused" : ""
);
async function qwqStop() {
    if (simphiPlayer.emitter.eq("stop")) {
        if (!selectchart.value)
            return msgHandler.sendError(shared.game.i18n.t("simphi.playErr.noChartSelected"));
        if (!selectbgm.value)
            return msgHandler.sendError(shared.game.i18n.t("simphi.playErr.noMusicSelected"));
        simphiPlayer.app.stage.style.display = "block";
        for (const i of simphiPlayer.before.values()) await i();
        audio.play(simphiPlayer.res["mute"], { loop: true, isOut: false }); //播放空音频(避免音画不同步)
        simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(selectchart.value))); //fuckqwq
        const md5 = simphiPlayer.chartData.chartsMD5.get(selectchart.value);
        simphiPlayer.stat.level = Number(simphiPlayer.chartData.levelText.match(/\d+$/));
        simphiPlayer.stat.reset(simphiPlayer.app.chart.numOfNotes, md5, selectspeed.value);
        await loadLineData();
        simphiPlayer.app.bgImage = simphiPlayer.chartData.bgs.get(selectbg.value) || simphiPlayer.res["NoImageWhite"];
        simphiPlayer.app.bgImageBlur = simphiPlayer.chartData.bgsBlur.get(selectbg.value) || simphiPlayer.res["NoImageWhite"];
        const bgm = simphiPlayer.chartData.bgms.get(selectbgm.value);
        simphiPlayer.app.bgMusic = bgm.audio;
        simphiPlayer.app.bgVideo = bgm.video;
        simphiPlayer.timeInfo.duration = simphiPlayer.app.bgMusic.duration / simphiPlayer.app.speed;
        simphiPlayer.animationInfo.isInEnd = false;
        simphiPlayer.animationInfo.isOutStart = false;
        simphiPlayer.animationInfo.isOutEnd = false;
        simphiPlayer.timeInfo.timeBgm = 0;
        if (!showTransition.checked) simphiPlayer.animationTimer.in.addTime(3e3);
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
        resultPageData = false;
        fucktemp2 = null;
        if (simphiPlayer.app.pauseNextTick)
            clearInterval(simphiPlayer.app.pauseNextTick), (simphiPlayer.app.pauseTime = 0), (simphiPlayer.app.pauseNextTick = null);
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
async function loadLineData() {
    for (const i of simphiPlayer.app.lines) {
        i.imageW = 6220.8; //1920
        i.imageH = 7.68; //3
        i.imageL = [simphiPlayer.res["JudgeLine"], simphiPlayer.res["JudgeLineMP"], null, simphiPlayer.res["JudgeLineFC"]];
        i.imageS = 1; //2.56
        i.imageA = 1; //1.5625
        i.imageD = false;
        i.imageC = true;
        i.imageU = true;
    }
    for (const i of simphiPlayer.chartData.chartLineData) {
        if (selectchart.value === i.Chart) {
            if (!simphiPlayer.app.lines[i.LineId]) {
                msgHandler.sendWarning(
                    shared.game.i18n.t("simphi.playErr.judgeLineDoesentExist", [i.LineId])
                );
                continue;
            }
            if (!simphiPlayer.chartData.bgs.has(i.Image))
                msgHandler.sendWarning(
                    shared.game.i18n.t("simphi.playErr.imageDoesentExist", [i.image])
                );
            /** @type {ImageBitmap} */
            const image = simphiPlayer.chartData.bgs.get(i.Image) || simphiPlayer.res["NoImageBlack"];
            simphiPlayer.app.lines[i.LineId].imageW = image.width;
            simphiPlayer.app.lines[i.LineId].imageH = image.height;
            if (!simphiPlayer.lineImages.has(image)) simphiPlayer.lineImages.set(image, new LineImage(image));
            const lineImage = simphiPlayer.lineImages.get(image);
            simphiPlayer.app.lines[i.LineId].imageL = [
                image,
                await lineImage.getMP(),
                await lineImage.getAP(),
                await lineImage.getFC(),
            ];
            simphiPlayer.app.lines[i.LineId].isCustomImage = simphiPlayer.chartData.bgs.get(i.Image) ? true : false;
            if (isFinite((i.Vert = parseFloat(i.Vert)))) {
                //Legacy
                simphiPlayer.app.lines[i.LineId].imageS = (Math.abs(i.Vert) * 1080) / image.height;
                simphiPlayer.app.lines[i.LineId].imageU = i.Vert > 0;
            }
            if (isFinite((i.Horz = parseFloat(i.Horz)))) simphiPlayer.app.lines[i.LineId].imageA = i.Horz; //Legacy
            if (isFinite((i.IsDark = parseFloat(i.IsDark))))
                simphiPlayer.app.lines[i.LineId].imageD = !!i.IsDark; //Legacy
            if (isFinite((i.Scale = parseFloat(i.Scale)))) simphiPlayer.app.lines[i.LineId].imageS = i.Scale;
            if (isFinite((i.Aspect = parseFloat(i.Aspect)))) simphiPlayer.app.lines[i.LineId].imageA = i.Aspect;
            if (isFinite((i.UseBackgroundDim = parseFloat(i.UseBackgroundDim))))
                simphiPlayer.app.lines[i.LineId].imageD = !!i.UseBackgroundDim;
            if (isFinite((i.UseLineColor = parseFloat(i.UseLineColor))))
                simphiPlayer.app.lines[i.LineId].imageC = !!i.UseLineColor;
            if (isFinite((i.UseLineScale = parseFloat(i.UseLineScale))))
                simphiPlayer.app.lines[i.LineId].imageU = !!i.UseLineScale;
        }
    }
}
async function qwqPause() {
    if (btnPause.classList.contains("disabled") || !simphiPlayer.tmps.canPause) return;
    if (simphiPlayer.emitter.eq("stop") || resultPageData) return;
    btnPause.classList.add("disabled");
    if (simphiPlayer.emitter.eq("play")) {
        if (simphiPlayer.app.bgVideo) simphiPlayer.app.bgVideo.pause();
        simphiPlayer.app.pauseBackgroundDimPara1 = null;
        simphiPlayer.animationTimer.in.pause();
        if (showTransition.checked && simphiPlayer.animationInfo.isOutStart) simphiPlayer.animationTimer.out.pause();
        simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.timeBgm;
        audio.stop();
        simphiPlayer.emitter.emit("pause");
        btnPause.classList.remove("disabled");
    } else {
        if (shared.game.ptmain.playConfig.mode === "preview") {
            clearInterval(simphiPlayer.app.pauseNextTick);
            if (simphiPlayer.app.bgVideo) await playVideo(simphiPlayer.app.bgVideo, simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
            simphiPlayer.animationTimer.in.play();
            if (showTransition.checked && simphiPlayer.animationInfo.isOutStart) simphiPlayer.animationTimer.out.play();
            if (simphiPlayer.animationInfo.isInEnd && !simphiPlayer.animationInfo.isOutStart) playBgm(simphiPlayer.app.bgMusic, simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
            simphiPlayer.emitter.emit("play");
            btnPause.classList.remove("disabled");
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
                if (!shared.game.ptmain.gameConfig.reviewWhenResume || simphiPlayer.timeInfo.curTime <= 3) {
                    if (simphiPlayer.app.bgVideo) await playVideo(simphiPlayer.app.bgVideo, simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
                    simphiPlayer.animationTimer.in.play();
                    if (showTransition.checked && simphiPlayer.animationInfo.isOutStart) simphiPlayer.animationTimer.out.play();
                    if (simphiPlayer.animationInfo.isInEnd && !simphiPlayer.animationInfo.isOutStart) playBgm(simphiPlayer.app.bgMusic, simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
                    simphiPlayer.emitter.emit("play");
                }
                btnPause.classList.remove("disabled");
            }
        }, 1000);
        if (shared.game.ptmain.gameConfig.reviewWhenResume && simphiPlayer.timeInfo.curTime > 3) {
            if (simphiPlayer.timeInfo.curTime > 3) simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime -= 3;
            if (simphiPlayer.app.bgVideo) await playVideo(simphiPlayer.app.bgVideo, simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
            simphiPlayer.animationTimer.in.play();
            if (showTransition.checked && simphiPlayer.animationInfo.isOutStart) simphiPlayer.animationTimer.out.play();
            if (simphiPlayer.animationInfo.isInEnd && !simphiPlayer.animationInfo.isOutStart) playBgm(simphiPlayer.app.bgMusic, simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
            simphiPlayer.emitter.emit("play");
            btnPause.classList.add("disabled");
        }
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
    else if (hashDF.includes(md5) && inputName.value === "Distorted Fate ")
        import("./plugins/demo/DFLevelEffect.js").then(({ loadMod }) =>
            hook.now.set(flag0, loadMod())
        );
    else if (hashD321.includes(md5) && inputName.value === "DESTRUCTION 3,2,1 ")
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
// main.inputName = inputName;
simphiPlayer.oriBuffers = simphiPlayer.chartData.oriBuffers;
simphiPlayer.selectbgm = selectbgm;
simphiPlayer.selectchart = selectchart;
simphiPlayer.chartsMD5 = simphiPlayer.chartData.chartsMD5;
// shared.game.simphi.chartsMD5 = main.chartsMD5;
// shared.game.simphi.selectchart = main.selectchart;
simphiPlayer.noteRender = simphiPlayer.noteRender;
simphiPlayer.ZipReader = ZipReader;
simphiPlayer.qwq = qwq;
simphiPlayer.pause = () => simphiPlayer.emitter.eq("play") && qwqPause();
shared.game.simphiPlugins = { videoRecorder };
Object.defineProperty(simphiPlayer, "time", {
    get: () => simphiPlayer.timeInfo.timeBgm,
    set: async v => {
        if (simphiPlayer.emitter.eq("stop") || resultPageData) return;
        const isPlaying = simphiPlayer.emitter.eq("play");
        if (isPlaying) await qwqPause();
        simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.timeBgm = v;
        // app.notes.forEach(a => { a.status = 0;
        // 	a.scored = 0;
        // 	a.holdStatus = 1; });
        // stat.reset();
        if (isPlaying) await qwqPause();
    },
});

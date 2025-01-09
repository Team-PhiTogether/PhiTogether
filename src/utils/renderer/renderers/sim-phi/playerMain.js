import simphi from "./simphi";
import { audio } from "@utils/js/aup.js";
import Notiflix from "notiflix";
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
import { InteractProxy } from "@utils/js/interact.js";
import shared from "@utils/js/shared.js";
import { recordMgr } from "@components/recordMgr/recordMgr.js";
import { replayMgr } from "@components/recordMgr/replayMgr.js";

import saveAdjustedChart from "./plugins/saveAdjustedChart";
import videoRecorder from "./plugins/video-recorder";
import { loadSkinFromBuffer, loadSkinFromDB } from "./plugins/skin";

import { imgBlur, imgShader, imgPainter, imgSplit, hex2rgba, rgba2hex } from "./assetsProcessor/imgProcessor.js";
import { createCanvas } from "./utils/canvas.js";

import ptdb from "@utils/ptdb";

const $id = (query) => document.getElementById(query);
const $ = (query) => document.body.querySelector(query);
const $$ = (query) => document.body.querySelectorAll(query);
const tween = {
  easeInSine: (pos) => 1 - Math.cos((pos * Math.PI) / 2),
  easeOutSine: (pos) => Math.sin((pos * Math.PI) / 2),
  easeOutCubic: (pos) => 1 + (pos - 1) ** 3,
  easeIOCubic: (pos) => ((pos *= 2) < 1 ? pos ** 3 : (pos - 2) ** 3 + 2) / 2,
  easeInCubic: (pos) => pos ** 3, //9
  ease10: (pos) => 1 - (pos - 1) ** 4, //10
  ease15: (pos) => pos ** 5, //15
};
const main = {};
main.modify = (a) => a;
main.pressTime = 0;
// main.kfcFkXqsVw50 = [];
main.before = new Map();
main.now = new Map();
main.after = new Map();
main.end = new Map();
/** @type {(ctx:CanvasRenderingContext2D,time:number)=>void} */
main.filter = null;
main.filterOptions = {};
main["flag{qwq}"] = (_) => { };
document.oncontextmenu = (e) => e.preventDefault(); //qwq

const msgHandler = {
  lastMessage: "",
  msgbox(msg, type, fatal) {
    return;
  },
  sendMessage(msg, type) {
    if (!msg) return;
    if (type === "error") {
      Notiflix.Notify.failure(msg, {
        ID: "msgHandlerErr",
        zindex: 114515,
        cssAnimationStyle: "fade",
        opacity: "0.8",
        borderRadius: "15px",
      });
    } else {
      Notiflix.Notify.info(msg, {
        ID: "msgHandlerInfo",
        showOnlyTheLastOne: true,
        zindex: 114515,
        cssAnimationStyle: "fade",
        clickToClose: true,
        opacity: "0.8",
        borderRadius: "15px",
      });
    }
  },
  sendWarning(msg, isHTML) {
    const msgText = isHTML ? msg : Utils.escapeHTML(msg);
    this.msgbox(msgText, "warn");
    //this.sendMessage(this.lastMessage);
  },
  sendError(msg, html, fatal) {
    if (html) {
      const exp =
        /([A-Za-z][A-Za-z+-.]{2,}:\/\/|www\.)[^\s\x00-\x20\x7f-\x9f"]{2,}[^\s\x00-\x20\x7f-\x9f"!'),.:;?\]}]/g;
      const ahtml = html.replace(exp, (match = "") => {
        const url = match.startsWith("www.") ? `//${match}` : match;
        const rpath = match.replace(`${location.origin}/`, "");
        if (match.indexOf(location.origin) > -1)
          return `<a href="#"style="color:#023b8f;text-decoration:underline;">${rpath}</a>`;
        return `<a href="${url}"target="_blank"style="color:#023b8f;text-decoration:underline;">${rpath}</a>`;
      });
      this.msgbox(ahtml, "error", fatal);
    }
    this.sendMessage(msg, "error");
    return false;
  },
};
shared.game.spMsgHandler = msgHandler;
const stat = new simphi.Stat();
const app = new simphi.Renderer($id("stage")); //test
shared.game.simphi = app;
const { canvas, ctx, canvasos, ctxos } = app;
class Emitter extends EventTarget {
  constructor(statusInit) {
    super();
    this.status = statusInit;
  }
  emit(status) {
    if (this.status === status) return;
    this.status = status;
    this.dispatchEvent(new Event("change"));
  }
  eq(status) {
    return this.status === status;
  }
  ne(status) {
    return this.status !== status;
  }
}
const emitter = new Emitter("stop");
shared.game.simphi.emitter = emitter;
const status2 = {
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
};
let levelText = "SP Lv.?";
const bgs = new Map();
const bgsBlur = new Map();
const bgms = new Map();
const charts = new Map();
const chartsMD5 = new Map();
const oriBuffers = new Map();
const chartLineData = []; //line.csv
const chartInfoData = []; //info.csv
function clearStat() {
  while (selectbg.options.length) selectbg.options.remove(0);
  while (selectchart.options.length) selectchart.options.remove(0);
  while (selectbgm.options.length) selectbgm.options.remove(0);
  bgs.clear();
  bgsBlur.clear();
  bgms.clear();
  oriBuffers.clear();
  charts.clear();
  chartsMD5.clear();
  chartLineData.length = 0;
  chartInfoData.length = 0;
}
const gauge = {
  value: 100,
  dead: false,
  _flags: [null, 0, 0, 0, 0, 0, 0, 0],
  reset() {
    gauge.value = 100;
    gauge.dead = false;
  },
  init() {
    gauge.reset();
    gauge._flags[0] = app.chart;
    for (let i = 1; i < 8; i++) gauge._flags[i] = stat.noteRank[i];
  },
  calc(time) {
    if (gauge._flags[0] !== app.chart) gauge.init();
    if (gauge.dead) {
      for (const note of app.notes) {
        if (!note.scored) {
          note.status = 2;
          stat.addCombo(2, note.type);
          note.scored = true;
        }
      }
      timeBgm = curTime = app.bgMusic.duration;
      // gauge.reset();
      return;
    }
    const { noteRank } = stat;
    gauge.value -= (noteRank[6] - gauge._flags[6]) * 2.5;
    gauge.value += (noteRank[7] - gauge._flags[7]) * 0.025;
    gauge.value += (noteRank[5] - gauge._flags[5]) * 0.1;
    gauge.value += (noteRank[4] - gauge._flags[4]) * 0.2;
    gauge.value += (noteRank[1] - gauge._flags[1]) * 0.1;
    gauge.value += (noteRank[3] - gauge._flags[3]) * 0.025;
    gauge.value -= (noteRank[2] - gauge._flags[2]) * 5;
    gauge.value = Math.min(gauge.value, 100);
    if (gauge.value <= 0 && shared.game.ptmain.gameConfig.stopWhenNoLife) gauge.dead = true;
    for (let i = 1; i < 8; i++) gauge._flags[i] = stat.noteRank[i];
  },
  draw() {
    if(!shared.game.ptmain.gameConfig.enableLife) return;
    const gaugeValue = Math.max(gauge.value / 100, 0);
    gauge._drawGaugeBar('#3f3b71', 1);
    ctxos.fillStyle = "#fff";
    ctxos.font = `${app.lineScale * 0.5}px Saira`;
    ctxos.textAlign = "left";
    ctxos.globalAlpha = tmps.statStatus.pause.alpha;
    ctxos.fillText(
      "LIFE",
      app.lineScale * 1.75 + tmps.statStatus.pause.offsetX,
      app.lineScale * 0.95 + tmps.statStatus.pause.offsetY
    );
    ctxos.textAlign = "right";
    ctxos.fillText(
      shared.game.ptmain.playConfig.mode === "preview" ? "∞" : gaugeValue.toFixed(3) * 1000,
      app.lineScale * 6 + tmps.statStatus.pause.offsetX,
      app.lineScale * 0.95 + tmps.statStatus.pause.offsetY
    );
    gauge._drawGaugeBar(gaugeValue <= 0.25 ? "#f00" : "#0ff", gaugeValue);
  },
  _drawGaugeBar(c, p) {
    ctxos.fillStyle = c;
    drawRoundRect(
      ctxos,
      app.lineScale * 1.75 + tmps.statStatus.pause.offsetX,
      app.lineScale * 1.1 + tmps.statStatus.pause.offsetY,
      app.lineScale * 4.25 * Math.max(p, 0),
      app.lineScale * 0.4,
      app.lineScale * 0.1
    ).fill();
  },
};
main.now.set('gauge', gauge.calc);
async function checkSupport() {
  const loadLib = async (name, urls, check) => {
    if (!check()) return true;
    const errmsg1 = shared.game.i18n.t("simphi.loadLib.err.msg1", { name });
    const errmsg2 = shared.game.i18n.t("simphi.loadLib.err.msg2", { name });
    const errmsg3 = shared.game.i18n.t("simphi.loadLib.err.msg3", { name });
    if (
      !(await loadJS(urls).catch((e) =>
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
    (navigator.platform.indexOf("Linux") > -1 &&
      navigator.maxTouchPoints === 5);
  if (isMobile) $id("uploader-select").style.display = "none";
  if (navigator.userAgent.indexOf("MiuiBrowser") > -1) {
    //实测 v17.1.8 问题仍然存在，v17.4.80113 问题已修复
    const version = navigator.userAgent.match(/MiuiBrowser\/(\d+\.\d+)/);
    if (!version || parseFloat(version[1]) < 17.4) msgHandler.sendWarning(shared.game.i18n.t("simphi.compatibilityWarning.miBrowser"));
  }
  if (
    !(await loadLib(shared.game.i18n.t("simphi.loadLib.libNames.createImageBitmap"), urls.bitmap, () =>
      isUndefined("createImageBitmap")
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
  const webpCompatible = document.createElement('canvas').toDataURL('image/webp').includes('data:image/webp');
  if (!await loadLib(shared.game.i18n.t("simphi.loadLib.libNames.webp"), urls.webp, () => !webpCompatible && isUndefined('webp'))) return -5;
}
//自动填写歌曲信息
function adjustInfo() {
  for (const i of chartInfoData) {
    if (selectchart.value.trim() === i.Chart) {
      if (i.Name) inputName.value = i.Name;
      if (i.Musician) inputArtist.value = i.Musician; //Alternative
      if (i.Composer) inputArtist.value = i.Composer; //Alternative
      if (i.Artist) inputArtist.value = i.Artist;
      if (i.Level) {
        levelText = i.Level;
        const p = levelText
          .toLocaleUpperCase()
          .split("LV.")
          .map((a) => a.trim());
        if (p[0]) selectDifficulty.value = p[0];
        if (p[1]) selectLevel.value = p[1];
      }
      if (i.Illustrator) inputIllustrator.value = i.Illustrator;
      if (i.Designer) inputCharter.value = i.Designer;
      if (i.Charter) inputCharter.value = i.Charter;
      if (bgms.has(i.Music)) selectbgm.value = i.Music;
      if (bgs.has(i.Image)) {
        selectbg.value = i.Image;
        selectbg.dispatchEvent(new Event("change"));
      }
      if (isFinite((i.AspectRatio = parseFloat(i.AspectRatio)))) {
        shared.game.ptmain.gameConfig.aspectRatio = i.AspectRatio;
      }
      if (isFinite((i.ScaleRatio = parseFloat(i.ScaleRatio)))) {
        //Legacy
        shared.game.ptmain.gameConfig.noteScale = 8080 / i.ScaleRatio;
        app.setNoteScale(8080 / i.ScaleRatio);
      }
      if (isFinite((i.NoteScale = parseFloat(i.NoteScale)))) {
        shared.game.ptmain.gameConfig.noteScale = i.NoteScale;
        app.setNoteScale(i.NoteScale);
      }
      if (isFinite((i.GlobalAlpha = parseFloat(i.GlobalAlpha)))) {
        //Legacy
        shared.game.ptmain.gameConfig.backgroundDim = i.GlobalAlpha;
        shared.game.ptmain.gameConfig.shared.game.ptmain.gameConfig.backgroundDim = Number(i.GlobalAlpha);
      }
      if (isFinite((i.BackgroundDim = parseFloat(i.BackgroundDim)))) {
        shared.game.ptmain.gameConfig.backgroundDim = i.BackgroundDim;
        shared.game.ptmain.gameConfig.shared.game.ptmain.gameConfig.backgroundDim = Number(i.BackgroundDim);
      }
      if (isFinite((i.Offset = parseFloat(i.Offset))))
        shared.game.ptmain.chartOffsetSurface = i.Offset;
    }
  }
}
const stage = {
  resize(forced) {
    const ranking = forced || fucktemp2;
    app.stage.style.cssText =
      `;position:fixed;top:${forced ? 60 : 0}px;left:0;bottom:0;right:0;z-index:${ranking ? 0 : 1002};display:${location.hash.startsWith("#/playing") ? "block" : "none"};`;
  },
};
shared.game.stage = stage;
self.addEventListener("resize", () => stage.resize());
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
  const handleFile = async (tag, total, promise, oncomplete = (_) => { }) => {
    if (!totals[tag] || total >= totals[tag]) totals[tag] = total;
    uploader_total = Object.values(totals).reduce((a, b) => a + b, 0);
    if (!(promise instanceof Promise)) promise = Promise.resolve();
    await promise.catch((err) =>
      msgHandler.sendWarning(shared.game.i18n.t("simphi.handleFile.unsupportedFile", [ err.cause.name ]))
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
  main.handleFile = handleFile;
  let file_total = 0;
  const options = {
    createAudioBuffer() {
      return audio.decode(...arguments);
    },
  };
  const zip = new ZipReader({ handler: (data) => readFile(data, options) });
  zip.addEventListener("loadstart", () => { });
  zip.addEventListener("read", (evt) =>
    handleFile("zip", zip.total, pick(evt.detail))
  );
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
        buffer.byteLength > 4 &&
        new DataView(buffer).getUint32(0, false) === 0x504b0304;
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
        readFile(data, options).then((result) =>
          handleFile("file", file_total, pick(result))
        );
      }
    }
  );
  main.uploader = uploader;
  /**
   * @typedef {import("../js/reader.js").ReaderData} ReaderData
   * @param {ReaderData} data
   */
  async function pick(data) {
    switch (data.type) {
      case "line":
        chartLineData.push(...data.data);
        break;
      case "info":
        chartInfoData.push(...data.data);
        break;
      case "media":
      case "audio":
        bgms.set(data.name, data.data);
        selectbgm.appendChild(createOption(data.name, data.name));
        break;
      case "image":
        bgs.set(data.name, data.data);
        bgsBlur.set(data.name, await imgBlur(data.data));
        selectbg.appendChild(createOption(data.name, data.name));
        break;
      case "chart":
        if (data.msg) data.msg.forEach((v) => msgHandler.sendWarning(v));
        if (data.info) chartInfoData.push(data.info);
        if (data.line) chartLineData.push(...data.line);
        let basename = data.name;
        while (charts.has(basename)) basename += "\n"; //qwq
        data.data.md5 = data.md5;
        charts.set(basename, data.data);
        chartsMD5.set(basename, data.md5);
        selectchart.appendChild(createOption(basename, data.name));
        break;
      default:
        console.error(data["data"]);
        throw new Error(`Unsupported file: ${data["name"]}`, { cause: data });
    }
    if (data.name && data.buffer) oriBuffers.set(data.name, data.buffer);
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
const exitFull = () => {
  hitManager.clear("keyboard"); //esc退出全屏只有onchange事件能检测到
  app.isFull = full.check();
  stage.resize();
};
// document.addEventListener(full.onchange, exitFull);
const doFullScreen = async () => {
  try {
    const isFull = app.isFull;
    if (isFull) {
    } else {
      app.isFull = true;
      stage.resize();
    }
  } catch (e) {
    stage.resize();
  }
};
const specialDrag = {
  listeningEvts: new Map(),
  update(evt, offsetX, offsetY) {
    if (!this.listeningEvts.has(evt)) return;
    this.func[this.listeningEvts.get(evt)].update(offsetX, offsetY);
  },
  reg(evt, offsetX, offsetY) {
    const { lineScale } = app;
    if (!emitter.eq("play") && !app.pauseTime && shared.game.ptmain.playConfig.practiseMode) {
      if (offsetY >= app.hlen + lineScale * 2.5 && offsetX >= app.wlen * 0.25 && offsetX <= app.wlen * 1.75 && offsetY <= app.hlen + lineScale * 3.75 && qwqIn.second >= 3) {
        this.listeningEvts.set(evt, 0);
        this.func[0].reg(offsetX, offsetY);
      } else if (offsetY >= app.hlen + lineScale * 0.1 && offsetX >= app.wlen + lineScale * 4 && offsetX <= app.wlen * 1.5 + lineScale * 4 && offsetY <= app.hlen + lineScale * 0.5 && qwqIn.second >= 3) {
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
        const oldOffset = app.chart.offset;
        app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
        stat.reset(app.chart.numOfNotes, chartsMD5.get(selectchart.value), selectspeed.value);
        loadLineData();
        app.chart.offset = oldOffset;
      },
      update: offsetX => {
        timeBgm = curTime = duration * Math.min(Math.max((offsetX - app.wlen * 0.25) / (app.wlen * 1.5), 0), 1);
      },
      del: () => {
        const oldOffset = app.chart.offset;
        app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
        stat.reset(app.chart.numOfNotes, chartsMD5.get(selectchart.value), selectspeed.value);
        loadLineData();
        app.chart.offset = oldOffset;
      },
    },
    {
      reg: () => {
        app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
        stat.reset(app.chart.numOfNotes, chartsMD5.get(selectchart.value), selectspeed.value);
        loadLineData();
      },
      update: offsetX => {
        const speedNew = 0.5 + Math.round(Math.min(Math.max((offsetX - app.wlen - app.lineScale * 4) / (app.wlen * 0.5), 0), 1) * 30) * 0.05;
        const deltaSpeed = app.speed / speedNew;
        (app.speed = speedNew),
        (duration = app.bgMusic.duration / speedNew),
        (timeBgm = curTime = curTime * deltaSpeed);
      },
      del: () => {
        app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
        stat.reset(app.chart.numOfNotes, chartsMD5.get(selectchart.value), selectspeed.value);
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
      if (emitter.eq("play")) btnPause.click();
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
      if (
        shared.game.isPlayFinished() &&
        shared.game.ptmain.playConfig.mode !== "preview"
      ) {
        shared.game.exportRecord && shared.game.exportRecord();
      } else if (shared.game.ptmain.gameMode === "single") {
        if (btnPause.value == "暂停") return; //btnPause.click();
        selectflip.value = app.mirrorView([3 - selectflip.value]);
      } else {
        shared.game.multiInstance.JITSOpen =
          !shared.game.multiInstance.JITSOpen;
      }
    },
    function spClickRB() {
      if (!fucktemp2) return;
      if (shared.game.ptmain.$route.path !== "/multipanel" && shared.game.ptmain.gameMode === "multi")
        shared.game.multiInstance.showStat();
      else shared.game.ptmain.spClickRT();
    },
    () => { hitManager.clear(); shared.game.ptmain.$router.back(); },
  ],
  click(id) {
    const now = performance.now();
    if (now - this.time[id] < 300) this.func[id]();
    else this.time[id] = now;
  },
  qwq(offsetX, offsetY) {
    const { lineScale } = app;
    if (offsetX < lineScale * 1.5 && offsetY < lineScale * 1.5) this.click(0);
    if (offsetX > canvasos.width - lineScale * 1.5 && offsetY < lineScale * 1.5)
      this.click(1);
    if (
      offsetX < lineScale * 1.5 &&
      offsetY > canvasos.height - lineScale * 1.5
    )
      this.click(2);
    if (
      offsetX > canvasos.width - lineScale * 1.5 &&
      offsetY > canvasos.height - lineScale * 1.5
    )
      this.click(3);
    if (!emitter.eq("play") && !app.pauseTime) {
      if (offsetY < app.hlen + lineScale && offsetY > app.hlen - lineScale) {
        const imgX = n => app.wlen + lineScale * (n * 2 - 0.5);
        const imgXs = [imgX(-1.1), imgX(0), imgX(1), imgX(1) + lineScale * 1.5];
        if (
          // back
          imgXs[0] < offsetX && offsetX < imgXs[1]
        )
          this.func[4]();
        if (
          // retry
          imgXs[1] < offsetX && offsetX < imgXs[2]
        )
          this.func[1]();
        if (
          // resume
          imgXs[2] < offsetX && offsetX < imgXs[3]
        )
          btnPause.click();
      }
      if (shared.game.ptmain.playConfig.practiseMode && offsetY >= app.hlen - lineScale * 0.6 && offsetY <= app.hlen + lineScale * 0.2 && qwqIn.second >= 3) {
        if (offsetX >= app.wlen * 1.5 + lineScale * 2.4 && offsetX <= app.wlen * 1.5 + lineScale * 3.2) {
          const speedNew = Math.max(app.speed - 0.05, 0.5);
          const deltaSpeed = app.speed / speedNew;
          (app.speed = speedNew),
          (duration = app.bgMusic.duration / speedNew),
          (timeBgm = curTime = curTime * deltaSpeed);
          app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
          stat.reset(app.chart.numOfNotes, chartsMD5.get(selectchart.value), selectspeed.value);
          loadLineData();
        } else if (offsetX >= app.wlen * 1.5 + lineScale * 3.3 && offsetX <= app.wlen * 1.5 + lineScale * 4.1) {
          const speedNew = Math.min(app.speed + 0.05, 2);
          const deltaSpeed = app.speed / speedNew;
          (app.speed = speedNew),
          (duration = app.bgMusic.duration / speedNew),
          (timeBgm = curTime = curTime * deltaSpeed);
          app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
          stat.reset(app.chart.numOfNotes, chartsMD5.get(selectchart.value), selectspeed.value);
          loadLineData();
        }
      }
    }
    if (shared.game.ptmain.playConfig.adjustOffset && emitter.eq("play") && offsetX > canvasos.width - lineScale * 7.5 && offsetY > canvasos.height - lineScale * 5 && !fucktemp2) {
      const getBtnAxis = (p, ps) => {
        const h = lineScale * 0.5 - lineScale * Math.abs(p) * 0.1;
        const x = canvasos.width - 3.75 * lineScale + lineScale * ps;
        const y = canvasos.height - lineScale * 2.5 - h;
        return [
          x,
          y,
          x + h * 2,
          y + h * 2,
        ]
      };
      const btns = [
        [-3, -3.5, -1],
        [-2, -3, -5],
        [-1, -2.25, -50],
        [1, 1.5, 50],
        [2, 2.45, 5],
        [3, 3.15, 1]
      ];
      for (const i of btns) {
        const btnAxis = getBtnAxis(i[0], i[1]);
        if (btnAxis[0] < offsetX && offsetX < btnAxis[2] && btnAxis[1] < offsetY && offsetY < btnAxis[3]) {
          app.chart.offset = (app.chart.offset * 1e3 + i[2]) / 1e3;
        }
      }
      if (canvasos.width - 3.5 * lineScale < offsetX && offsetX < canvasos.width - 0.5 * lineScale && canvasos.height - lineScale * 1.25 < offsetY && offsetY < canvasos.height - lineScale * 0.25) {
        saveAdjustedChart(app, fucktemp2);
      } else if (canvasos.width - 7 * lineScale < offsetX && offsetX < canvasos.width - 5 * lineScale && canvasos.height - lineScale * 1.25 < offsetY && offsetY < canvasos.height - lineScale * 0.25) {
        app.chart.offset = app.chart.offsetBak;
      }
    }
    if (qwqEnd.second > 0)
      main.pressTime = main.pressTime > 0 ? -qwqEnd.second : qwqEnd.second;
  },
};
const hitManager = new simphi.HitManager();
class JudgeEvent {
  constructor(offsetX, offsetY, type, event) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.type = type | 0; //1-Tap,2-Hold/Drag,3-Move
    this.judged = false; //是否被判定
    this.event = event; //flick专用回调
    this.preventBad = false; //是否阻止判定为Bad
  }
}
/** @typedef {import('./simphi.js').NoteExtends} NoteExtends */
/**
 * 判定和音符的水平距离
 * @param {JudgeEvent} judgeEvent
 * @param {NoteExtends} note
 */
function getJudgeOffset(judgeEvent, note) {
  const { offsetX, offsetY } = judgeEvent;
  const { offsetX: x, offsetY: y, cosr, sinr } = note;
  return Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) || 0;
}
/**
 * 判定和音符的曼哈顿距离
 * @param {JudgeEvent} judgeEvent
 * @param {NoteExtends} note
 */
function getJudgeDistance(judgeEvent, note) {
  const { offsetX, offsetY } = judgeEvent;
  const { offsetX: x, offsetY: y, cosr, sinr } = note;
  return (
    Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) +
    Math.abs((offsetX - x) * sinr - (offsetY - y) * cosr) || 0
  );
}
const judgeManager = {
  time: {
    p: 0.08,
    g: 0.16,
    AP: 0.04,
  },
  setJudgeTime(p = 0.08, g = 0.16, AP = 0.04) {
    this.time.p = p;
    this.time.g = g;
    this.time.AP = AP;
  },
  /**@type {JudgeEvent[]} */
  list: [],
  /**@param {NoteExtends[]} notes */
  addEvent(notes, realTime) {
    const { list } = this;
    list.length = 0;
    if (app.playMode === 1) {
      const dispTime = Math.min(frameTimer.disp, this.time.AP);
      const minDispTime = -Math.max(frameTimer.disp * 2, this.time.g);
      for (const i of notes) {
        if (i.scored || i.isFake) continue;
        const deltaTime = i.realTime - realTime;
        if (i.type === 1) {
          if (deltaTime < dispTime)
            list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
        } else if (i.type === 2) {
          if (deltaTime < dispTime)
            list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
        } else if (i.type === 3) {
          if (i.holdTapTime)
            list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
          else if (deltaTime < dispTime)
            list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
        } else if (i.type === 4) {
          if (deltaTime < dispTime)
            list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3);
        }
      }
    } else if (emitter.eq("play")) {
      for (const i of hitManager.list) {
        if (!i.isTapped)
          list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
        if (i.isActive)
          list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
        if (i.type === "keyboard")
          list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3); //以后加上Flick判断
        if (i.flicking && !i.flicked) {
          list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3, i);
          // i.flicked = true; 不能在这里判断，因为可能会判定不到
        }
      }
    }
  },
  /**
   * @param {NoteExtends[]} notes
   * @param {number} realTime
   * @param {number} width
   */
  execute(notes, realTime, width) {
    const { list } = this;
    for (const note of notes) {
      if (note.scored || note.isFake) continue; //跳过已判分的Note和Fakenotes
      let deltaTime = note.realTime - realTime;
      if (deltaTime > (replayMgr.replaying ? 1 : 0.2)) break; //跳过判定范围外的Note
      if (note.type !== 1 && deltaTime > this.time.g) continue;
      note.statOffset = realTime;
      if (deltaTime < -this.time.g && note.frameCount > 4 && !note.holdStatus && !(replayMgr.replaying && replayMgr.data[note.name] && replayMgr.data[note.name].a !== 2)) {
        //超时且不为Hold拖判，判为Miss
        // console.log('Miss', i.name);
        note.status = 2;
        stat.addCombo(2, note.type);
        note.scored = true;
      } else if (note.type === 2) {
        //Drag音符
        if (deltaTime > 0) {
          for (const judgeEvent of list) {
            if (judgeEvent.type !== 1) continue; //跳过非Tap触摸事件
            if (getJudgeOffset(judgeEvent, note) > width) continue;
            judgeEvent.preventBad = true; // Drag后防bad
          }
        }
        if (note.status !== 4) {
          // 未判为PM
          if (replayMgr.replaying) {
            if (replayMgr.data[note.name]) {
              note.status = 4;
              continue;
            }
            continue;
          }
          for (const judgeEvent of list) {
            if (judgeEvent.type !== 2) continue; //跳过非Drag触摸事件
            if (getJudgeOffset(judgeEvent, note) > width) continue;
            // console.log('Perfect', i.name);
            note.status = 4; // 判为PM
            recordMgr.add(note);
            break;
          }
        } else if (deltaTime < 0) {
          // Drag过线
          if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong1"], { gainrate: app.soundVolume });
          hitImageList.add(
            HitImage.perfect(note.projectX, note.projectY, note)
          );
          stat.addCombo(4, 2);
          note.scored = true;
        }
      } else if (note.type === 4) {
        //Flick音符
        if (deltaTime > 0 || note.status !== 4) {
          // 对于未判为PM且未过线的Flick
          for (const judgeEvent of list) {
            if (judgeEvent.type !== 1) continue; //跳过非Tap触摸事件
            if (getJudgeOffset(judgeEvent, note) > width) continue;
            judgeEvent.preventBad = true; // 防止后判为Bad
          }
        }
        if (note.status !== 4) {
          if (replayMgr.replaying) {
            if (replayMgr.data[note.name]) {
              note.status = 4;
              continue;
            }
            continue;
          }
          for (const judgeEvent of list) {
            if (judgeEvent.type !== 3) continue; //跳过非Move触摸事件
            if (getJudgeOffset(judgeEvent, note) > width) continue;
            let distance = getJudgeDistance(judgeEvent, note);
            let noteJudge = note;
            let nearcomp = false;
            for (const nearNote of note.nearNotes) {
              if (nearNote.status) continue;
              if (
                nearNote.realTime - realTime /* deltaTime for nearNote */ >
                this.time.g
              )
                break;
              if (getJudgeOffset(judgeEvent, nearNote) > width) continue;
              const nearDistance = getJudgeDistance(judgeEvent, nearNote);
              if (nearDistance < distance) {
                distance = nearDistance;
                noteJudge = nearNote;
                nearcomp = true;
              }
            }
            //console.log('Perfect', i.name);
            if (judgeEvent.event == null) {
              noteJudge.status = 4;
              recordMgr.add(noteJudge);
              if (!nearcomp) break;
            } else if (!judgeEvent.event.flicked) {
              noteJudge.status = 4;
              judgeEvent.event.flicked = true;
              recordMgr.add(noteJudge);
              if (!nearcomp) break;
            }
          }
        } else if (deltaTime < 0) {
          if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong2"], { gainrate: app.soundVolume });
          hitImageList.add(
            HitImage.perfect(note.projectX, note.projectY, note)
          );
          stat.addCombo(4, 4);
          note.scored = true;
        }
      } else {
        //Hold & Tap音符
        if (replayMgr.replaying) {
          if (!replayMgr.data[note.name]) continue; // 录制文件无此note，直接跳过
          const re = replayMgr.data[note.name];
          if (realTime < re.s + note.realTime) continue; // 该note记录事件还未开始
          if (note.type === 3 && note.holdTapTime) {
            // hold
            //是否触发头判
            if (
              (performance.now() - note.holdTapTime) * note.holdTime >=
              8e3 * note.realHoldTime
            ) {
              //间隔时间与bpm成反比
              if (note.holdStatus % 4 === 0)
                // perfect max
                hitImageList.add(
                  HitImage.perfect(note.projectX, note.projectY, note)
                );
              else if (note.holdStatus % 4 === 1)
                // perfect early/late
                hitImageList.add(
                  HitImage.perfect(note.projectX, note.projectY, note)
                );
              else if (note.holdStatus % 4 === 3)
                // good early/late
                hitImageList.add(
                  HitImage.good(note.projectX, note.projectY, note)
                );
              note.holdTapTime = performance.now();
            }
            if (deltaTime + note.realHoldTime < 0.2) {
              if (!note.status)
                stat.addCombo((note.status = re.q), 3);
              if (deltaTime + note.realHoldTime < 0) note.scored = true;
              continue;
            }
            if (re.e && realTime >= re.e + note.realTime) {
              note.holdBroken = true;
            } else {
              note.holdBroken = false;
            }
          }
          if (!note.holdBroken && !note.holdTapTime) {
            let deltaTime2 = 2 * note.realTime - re.s;
            if (deltaTime2 > this.time.g && re.a === 6) {
              // 判bad
              if (note.type === 3) continue; // hold无bad
              note.status = 6; //console.log('Bad', i.name);
              note.badTime = performance.now();
            } else {
              stat.addDisp(
                Math.max(deltaTime2, (-1 - note.frameCount) * this.time.AP || 0)
              );
              if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong0"], { gainrate: app.soundVolume });
              if (re.a === 7) {
                note.holdStatus = 7; //console.log('Good(Early)', i.name);
                hitImageList.add(
                  HitImage.good(note.projectX, note.projectY, note)
                );
                hitWordList.add(HitWord.early(note.projectX, note.projectY));
              } else if (re.a === 5) {
                note.holdStatus = 5; //console.log('Perfect(Early)', i.name);
                hitImageList.add(
                  HitImage.perfect(note.projectX, note.projectY, note)
                );
                hitWordList.add(HitWord.early(note.projectX, note.projectY));
              } else if (re.a === 4) {
                note.holdStatus = 4; //console.log('Perfect(Max)', i.name);
                hitImageList.add(
                  HitImage.perfect(note.projectX, note.projectY, note)
                );
              } else if (re.a === 1) {
                note.holdStatus = 1; //console.log('Perfect(Late)', i.name);
                hitImageList.add(
                  HitImage.perfect(note.projectX, note.projectY, note)
                );
                hitWordList.add(HitWord.late(note.projectX, note.projectY));
              } else if (re.a === 3) {
                note.holdStatus = 3; //console.log('Good(Late)', i.name);
                hitImageList.add(
                  HitImage.good(note.projectX, note.projectY, note)
                );
                hitWordList.add(HitWord.late(note.projectX, note.projectY));
              }
              if (note.type === 1) note.status = note.holdStatus;
              if (note.type === 3) note.holdStart = realTime;
            }
            if (note.status) {
              // 只有tap才会在此处有status
              stat.addCombo(note.status, 1);
              note.scored = true;
            } else {
              note.holdTapTime = performance.now();
            }
          }
          if (emitter.eq("play") && note.holdTapTime && note.holdBroken && re.q === 2) {
            note.status = 2; //console.log('Miss', i.name);
            stat.addCombo(2, 3);
            note.scored = true;
          }
          continue;
        }

        // hold
        if (note.type === 3 && note.holdTapTime) {
          //是否触发头判
          if (
            (performance.now() - note.holdTapTime) * note.holdTime >=
            1.6e4 * note.realHoldTime
          ) {
            //间隔时间与bpm成反比
            if (note.holdStatus % 4 === 0)
              // perfect max
              hitImageList.add(
                HitImage.perfect(note.projectX, note.projectY, note)
              );
            else if (note.holdStatus % 4 === 1)
              // perfect early/late
              hitImageList.add(
                HitImage.perfect(note.projectX, note.projectY, note)
              );
            else if (note.holdStatus % 4 === 3)
              // good early/late
              hitImageList.add(
                HitImage.good(note.projectX, note.projectY, note)
              );
            note.holdTapTime = performance.now();
          }
          if (deltaTime + note.realHoldTime < 0.2) {
            if (!note.status)
              stat.addCombo((note.status = note.holdStatus), 3),
                recordMgr.add(note);
            if (deltaTime + note.realHoldTime < 0) note.scored = true;
            continue;
          }
          note.holdBroken = true; //若1帧内未按住并使其转为false，则判定为Miss
        }
        for (const judgeEvent of list) {
          // if (judgeEvent.event.flicked) continue; // 跳过已flick触摸事件
          if (note.holdTapTime) {
            //头判
            if (judgeEvent.type !== 2) continue;
            if (getJudgeOffset(judgeEvent, note) <= width) {
              note.holdBroken = false;
              break;
            }
            continue;
          }
          if (judgeEvent.type !== 1) continue; //跳过非Tap触摸事件
          if (judgeEvent.judged) continue; //跳过已触发的判定
          if (getJudgeOffset(judgeEvent, note) > width) continue;
          let deltaTime2 = deltaTime;
          let distance = getJudgeDistance(judgeEvent, note);
          let noteJudge = note;
          let nearcomp = false;
          for (const nearNote of note.nearNotes) {
            if (nearNote.status) continue; // 跳过已判
            if (nearNote.holdTapTime) continue; // 跳过tap已头判
            const nearDeltaTime = nearNote.realTime - realTime;
            if (nearDeltaTime > 0.2) break; // 跳过nearNote在判定范围外
            if (nearNote.type === 3 && nearDeltaTime > this.time.g) continue; // hold无bad
            if (getJudgeOffset(judgeEvent, nearNote) > width) continue;
            const nearDistance = getJudgeDistance(judgeEvent, nearNote);
            if (nearDistance < distance) {
              deltaTime2 = nearDeltaTime;
              distance = nearDistance;
              noteJudge = nearNote;
              noteJudge.statOffset = realTime;
              nearcomp = true;
            }
          }
          if (deltaTime2 > this.time.g) {
            // 判bad
            if (judgeEvent.preventBad) continue;
            noteJudge.status = 6; //console.log('Bad', i.name);
            recordMgr.add(noteJudge);
            noteJudge.badTime = performance.now();
          } else {
            const note = noteJudge;
            stat.addDisp(
              Math.max(deltaTime2, (-1 - note.frameCount) * this.time.AP || 0)
            );
            if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong0"], { gainrate: app.soundVolume });
            if (deltaTime2 > this.time.p) {
              note.holdStatus = 7; //console.log('Good(Early)', i.name);
              hitImageList.add(
                HitImage.good(note.projectX, note.projectY, note)
              );
              hitWordList.add(HitWord.early(note.projectX, note.projectY));
            } else if (deltaTime2 > this.time.AP) {
              note.holdStatus = 5; //console.log('Perfect(Early)', i.name);
              hitImageList.add(
                HitImage.perfect(note.projectX, note.projectY, note)
              );
              hitWordList.add(HitWord.early(note.projectX, note.projectY));
            } else if (deltaTime2 > -this.time.AP || note.frameCount < 1) {
              note.holdStatus = 4; //console.log('Perfect(Max)', i.name);
              hitImageList.add(
                HitImage.perfect(note.projectX, note.projectY, note)
              );
            } else if (deltaTime2 > -this.time.p || note.frameCount < 2) {
              note.holdStatus = 1; //console.log('Perfect(Late)', i.name);
              hitImageList.add(
                HitImage.perfect(note.projectX, note.projectY, note)
              );
              hitWordList.add(HitWord.late(note.projectX, note.projectY));
            } else {
              note.holdStatus = 3; //console.log('Good(Late)', i.name);
              hitImageList.add(
                HitImage.good(note.projectX, note.projectY, note)
              );
              hitWordList.add(HitWord.late(note.projectX, note.projectY));
            }
            if (note.type === 1) note.status = note.holdStatus;
            if (note.type === 3) note.holdStart = realTime;
            recordMgr.add(note);
          }
          if (noteJudge.status) {
            stat.addCombo(noteJudge.status, 1);
            noteJudge.scored = true;
          } else {
            noteJudge.holdTapTime = performance.now();
            noteJudge.holdBroken = false;
          }
          judgeEvent.judged = true;
          if (!nearcomp) break;
        }
        if (emitter.eq("play") && note.holdTapTime && note.holdBroken) {
          note.status = 2; //console.log('Miss', i.name);
          // note.brokenTime = realTime;
          recordMgr.add(note);
          stat.addCombo(2, 3);
          note.scored = true;
        }
      }
    }
  },
};
class HitEvents extends Array {
  constructor({
    updateCallback = (_) => { },
    iterateCallback = (_) => { },
  } = {}) {
    super();
    this.update = this.defilter.bind(this, updateCallback);
    this.animate = this.iterate.bind(this, iterateCallback);
  }
  /**	@param {(value)=>boolean} predicate */
  defilter(predicate) {
    let i = this.length;
    while (i--) predicate(this[i]) && this.splice(i, 1);
    return this;
  }
  /**	@param {(item)=>any} callback */
  iterate(callback) {
    for (const i of this) callback(i); //qwq
  }
  add(value) {
    this[this.length] = value;
  }
  clear() {
    this.length = 0;
  }
}
const hitFeedbackList = new HitEvents({
  //存放点击特效
  updateCallback: (i) => ++i.time > 0,
  /**	@param {HitFeedback} i */
  iterateCallback: (i) => {
    ctxos.globalAlpha = 0.85;
    ctxos.setTransform(1, 0, 0, 1, i.offsetX, i.offsetY); //缩放
    ctxos.fillStyle = i.color;
    ctxos.beginPath();
    ctxos.arc(0, 0, app.lineScale * 0.5, 0, 2 * Math.PI);
    ctxos.fill();
  },
});
const hitImageList = new HitEvents({
  //存放点击特效
  updateCallback: (i) => nowTime_ms >= i.time + i.duration,
  /**	@param {HitImage} i */
  iterateCallback: (i) => {
    if (!emitter.eq("play") || app.pauseTime) return;
    const tick = (nowTime_ms - i.time) / i.duration;
    const effects = i.effects;
    ctxos.globalAlpha = 1;
    ctxos.setTransform(
      app.noteScaleRatio * 6,
      0,
      0,
      app.noteScaleRatio * 6,
      i.offsetX,
      i.offsetY
    ); //缩放
    ctxos.rotate(i.rotation);
    (
      effects[Math.floor(tick * effects.length)] || effects[effects.length - 1]
    ).full(ctxos); //停留约0.5秒
    ctxos.fillStyle = i.color;
    ctxos.globalAlpha = 1 - tick; //不透明度
    const r3 =
      30 * (((0.2078 * tick - 1.6524) * tick + 1.6399) * tick + 0.4988); //方块大小
    if (r3 < 0) return;
    for (const j of i.direction) {
      const ds = j[0] * ((9 * tick) / (8 * tick + 1)); //打击点距离
      if (!main.customResourceMeta["loaded"]) {
        ctxos.beginPath();
        ctxos.arc(
          ds * Math.cos(j[1]),
          ds * Math.sin(j[1]),
          (r3 / 3) * 2,
          0,
          2 * Math.PI
        );
        ctxos.fill();
        ctxos.closePath();
      } else if (main.customResourceMeta["hitEvtDrawer"]) eval(main.customResourceMeta["hitEvtDrawer"]);
    }
  },
});
const hitWordList = new HitEvents({
  //存放点击特效
  updateCallback: (i) => nowTime_ms >= i.time + i.duration,
  /**	@param {HitWord} i */
  iterateCallback: (i) => {
    const tick = (nowTime_ms - i.time) / i.duration;
    ctxos.setTransform(1, 0, 0, 1, i.offsetX, i.offsetY); //缩放
    ctxos.font = `bold ${app.noteScaleRatio *
      (256 + 128 * (((0.2078 * tick - 1.6524) * tick + 1.6399) * tick + 0.4988))
      }px Saira`;
    ctxos.textAlign = "center";
    ctxos.fillStyle = i.color;
    ctxos.globalAlpha = 1 - tick; //不透明度
    ctxos.fillText(i.text, 0, -app.noteScaleRatio * 128);
  },
});
class HitFeedback {
  constructor(offsetX, offsetY, n1, n2) {
    this.offsetX = Number(offsetX);
    this.offsetY = Number(offsetY);
    this.color = String(n1);
    this.text = String(n2);
    this.time = 0;
  }
  static tap(offsetX, offsetY) {
    //console.log('Tap', offsetX, offsetY);
    return new HitFeedback(offsetX, offsetY, "cyan", "");
  }
  static hold(offsetX, offsetY) {
    //console.log('Hold', offsetX, offsetY);
    return new HitFeedback(offsetX, offsetY, "lime", "");
  }
  static move(offsetX, offsetY) {
    //console.log('Move', offsetX, offsetY);
    return new HitFeedback(offsetX, offsetY, "violet", "");
  }
}
class HitImage {
  constructor(offsetX, offsetY, n1, n3, rotation) {
    const packs = noteRender.hitFX[n1];
    this.offsetX = Number(offsetX) || 0;
    this.offsetY = Number(offsetY) || 0;
    this.rotation = tmps.hitFxRotate ? Number(rotation) || 0 : 0;
    this.time = performance.now();
    this.duration = packs.duration;
    this.effects = packs.effects;
    this.direction = Array(packs.numOfParts || 0)
      .fill()
      .map(() => [Math.random() * 80 + 185, Math.random() * 2 * Math.PI]);
    this.color = String(n3);
  }
  static perfect(offsetX, offsetY, note) {
    //console.log(note);
    return new HitImage(offsetX, offsetY, "Perfect", tmps.hitPerfectColor || "#ffeca0", note.line.rotation);
  }
  static good(offsetX, offsetY, note) {
    //console.log(note);
    return new HitImage(offsetX, offsetY, "Good", tmps.hitGoodColor || "#b4e1ff", note.line.rotation);
  }
}
class HitWord {
  constructor(offsetX, offsetY, n1, n2) {
    this.offsetX = Number(offsetX) || 0;
    this.offsetY = Number(offsetY) || 0;
    this.time = performance.now();
    this.duration = 250;
    this.color = String(n1);
    this.text = String(n2);
  }
  static early(offsetX, offsetY) {
    //console.log('Tap', offsetX, offsetY);
    return new HitWord(offsetX, offsetY, "#03aaf9", "Early");
  }
  static late(offsetX, offsetY) {
    //console.log('Hold', offsetX, offsetY);
    return new HitWord(offsetX, offsetY, "#ff4612", "Late");
  }
}
const interact = new InteractProxy(canvas);
//兼容PC鼠标
interact.setMouseEvent({
  mousedownCallback(evt) {
    const idx = evt.button;
    const { x, y } = getPos(evt);
    if (idx === 1) hitManager.activate("mouse", 4, x, y);
    else if (idx === 2) hitManager.activate("mouse", 2, x, y);
    else hitManager.activate("mouse", 1 << idx, x, y);
    specialClick.qwq(x, y);
    specialDrag.reg("mouse", x, y);
  },
  mousemoveCallback(evt) {
    const idx = evt.buttons;
    const { x, y } = getPos(evt);
    for (let i = 1; i < 32; i <<= 1) {
      // 同时按住多个键时，只有最后一个键的move事件会触发
      if (idx & i) hitManager.moving("mouse", i, x, y);
      else hitManager.deactivate("mouse", i);
      specialDrag.update("mouse", x, y);
    }
  },
  mouseupCallback(evt) {
    const idx = evt.button;
    if (idx === 1) hitManager.deactivate("mouse", 4);
    else if (idx === 2) hitManager.deactivate("mouse", 2);
    else hitManager.deactivate("mouse", 1 << idx);
    specialDrag.del("mouse");
  },
});
//兼容键盘(喵喵喵?)
interact.setKeyboardEvent({
  keydownCallback(evt) {
    if (emitter.eq("stop")) return;
    if (evt.key === "Shift") btnPause.click();
    if (evt.key === " " && shared.game.ptmain.playConfig.mode === "preview") btnPause.click();
    else if (
      hitManager.list.find((i) => i.type === "keyboard" && i.id === evt.code) //按住一个键时，会触发多次keydown事件
    );
    else hitManager.activate("keyboard", evt.code, NaN, NaN);
  },
  keyupCallback(evt) {
    if (emitter.eq("stop")) return;
    hitManager.deactivate("keyboard", evt.code);
  },
});
self.addEventListener("blur", () => hitManager.clear("keyboard"));
//兼容移动设备
interact.setTouchEvent({
  touchstartCallback(evt) {
    for (const i of evt.changedTouches) {
      const { x, y } = getPos(i);
      hitManager.activate("touch", i.identifier, x, y);
      specialClick.qwq(x, y);
      specialDrag.reg(i.identifier, x, y);
    }
  },
  touchmoveCallback(evt) {
    for (const i of evt.changedTouches) {
      const { x, y } = getPos(i);
      hitManager.moving("touch", i.identifier, x, y);
      specialDrag.update(i.identifier, x, y);
    }
  },
  touchendCallback(evt) {
    for (const i of evt.changedTouches) {
      hitManager.deactivate("touch", i.identifier);
      specialDrag.del(i.identifier);
    }
  },
  touchcancelCallback(evt) {
    // if (emitter.eq('play')) qwqPause();
    for (const i of evt.changedTouches) {
      hitManager.deactivate("touch", i.identifier);
      specialDrag.del(i.identifier);
    }
  },
});
/** @param {MouseEvent|Touch} obj */
function getPos(obj) {
  const rect = canvas.getBoundingClientRect();
  return {
    x:
      ((obj.clientX - rect.left) / canvas.offsetWidth) * canvas.width -
      (canvas.width - canvasos.width) / 2,
    y: ((obj.clientY - rect.top) / canvas.offsetHeight) * canvas.height-
    (canvas.height - canvasos.height) / 2,
  };
}
//hit end
const res = {}; //存放资源
main.customResourceMeta = {};
let defaultCRM = {
  name: "PhiTogether Default 1",
  author: "Team PhiTogether",
};
const loadRes = shared.game.simphi.reloadRes = async (url, manual = false, setAsDefault = false) => {
  if (!url) {
    if (main.customResourceMeta == defaultCRM) return;
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
    main.customResourceMeta = defaultCRM;
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
    for (const i of entries) await noteRender.update(i, res[i], 1);
    res["JudgeLineMP"] = await imgShader(res["JudgeLine"], "#feffa9");
    res["JudgeLineFC"] = await imgShader(res["JudgeLine"], "#a2eeff");
    tmps.hitPerfectColor = tmps.hitGoodColor = null;
    tmps.hitFxRotate = false;
    // }
    // }
    return;
  }
  const newres = {}; //存放资源
  let errorNum = 0;
  const urlBak = url;
  if (!url.startsWith("/") && !url.startsWith("http")) url = "https://" + url;
  await fetch(`${url}/meta.json`).then(r => r.json().then(crm => {
    if (crm["hitEvtDrawer"] && !urlBak.startsWith(atob("cGdyZXM0cHQucmVhbHR2b3Au"))) crm["hitEvtDrawer"] = null;
    main.customResourceMeta = crm;
    if (setAsDefault) defaultCRM = crm;
  }).then(() => main.customResourceMeta.loaded = true)).catch(e => {
    msgHandler.sendError(shared.game.i18n.t("respack.err"));
    return;
  });
  const erc = (name, src) => {
    try { return main.customResourceMeta.res[name] || main.customResourceMeta.res[src] || ""; }
    catch { return ""; }
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
        new Promise((resolve) => {
          if (!erc(name, src)) return resolve();
          const xhr = new XMLHttpRequest();
          xhr.open("get", (src = erc(name, src)), true);
          xhr.responseType = "arraybuffer";
          xhr.send();
          xhr.onloadend = async () => {
            if (!xhr.response || !xhr.response.byteLength) {
              msgHandler.sendError(
                shared.game.i18n.t("simphi.loading.resLoadFailed1", [ ++errorNum ]),
                shared.game.i18n.t("simphi.loading.resLoadFailed2", [ new URL(
                  src,
                  location
                )]),
                true
              );
            } else {
              // console.log(xhr.response)
              const a = new DataView(xhr.response, 0, 8);
              const header1 = a.getUint32(0);
              const header2 = a.getUint32(4);
              if (header1 === 0x4f676753)
                newres[name] = await audio.decode(xhr.response);
              else if (header1 === 0x89504e47 && header2 === 0x0d0a1a0a)
                newres[name] = await createImageBitmap(new Blob([xhr.response]));
              else
                msgHandler.sendError(
                  shared.game.i18n.t("simphi.loading.resLoadFailed1", [ ++errorNum ]),
                  shared.game.i18n.t("simphi.loading.resLoadFailed2", [ new URL(
                    src,
                    location
                  )]),
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
      shared.game.i18n.t("simphi.loading.resLoadFailed1", [ errorNum ])
    );
  if (manual) defaultCRM = main.customResourceMeta;
  await updateRes(newres, manual);
};
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
    if (["prpr", "prpr-compacted"].includes(main.customResourceMeta["holdType"])) {
      if (["HoldHead", "HoldHeadHL", "HoldEnd"].includes(i)) continue;
      const img = resources[i];
      const noteScale = 1089 / img.width;
      const [bottom, top] = main.customResourceMeta["holdAtlas"] || [1, 1];
      const compacted = main.customResourceMeta["holdType"] === "prpr-compacted";
      if (i === "Hold") {
        noteRender.update(
          "HoldEnd",
          await createImageBitmap(img, 0, 0, img.width, bottom),
          noteScale,
          compacted
        );
        noteRender.update(
          "Hold",
          await createImageBitmap(
            img,
            0,
            bottom,
            img.width,
            img.height - bottom - top
          ),
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
          await createImageBitmap(
            img,
            0,
            bottom,
            img.width,
            img.height - bottom - top
          ),
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
      await noteRender.update(i.replaceAll(/\.(jpg|png)/gi, ""), resources[i], ["HoldHL", "HoldHeadHL"].includes(i) ? 8080 / 7875 : 1);
      if(manual) res[i.replaceAll(/\.(jpg|png)/gi, "")] = resources[i];
    }
  }
  if (resources["HitFXRaw"]) await noteRender.updateFX(resources["HitFXRaw"], 1);
  for(let i=0;i<3;i++) {
    const str=`HitSong${i}`;
    if(resources[str]) res[str] = resources[str];
  }
  if (manual) shared.game.msgHandler.sendMessage(shared.game.ptmain.$t("respack.customResApplied"), "success");
}
//初始化
//初始化(踩坑：监听DOMContentLoaded似乎会阻塞页面导致长时间白屏)
window.addEventListener(
  "load",
  async function () {
    shared.game = {
      ...shared.game,
      init: true,
      app,
      res,
      charts,
      stat,
      hitManager,
      judgeManager,
      stage,
      clearStat,
      loadSkinFromBuffer,
      loadSkinFromDB,
      updateLevelText: updateLevelTextOut,
      doFullScreen,
      adjustInfo,
      qwqStop,
      qwqPause,
      frameAnimater,
    };
    await shared.game.requestFullscreen();
    canvas.classList.add("fade");
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
      if (ptSettings.resourcesType === "pt-custom") loadRes(ptSettings["customResourceLink"], false, true);
      else if (ptSettings.resourcesType.startsWith("together-pack")) loadRes(`/src/respack/${ptSettings.resourcesType}`, false, true);
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
          new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            const source = /* erc(src) ||  */"/src/respack/shared/" + src;
            xhr.open("get", (src = source), true);
            xhr.responseType = "arraybuffer";
            xhr.send();
            xhr.onloadend = async () => {
              if (!xhr.response || !xhr.response.byteLength) {
                msgHandler.sendError(
                  shared.game.ptmain.$t("simphi.loading.resLoadFailed1", [++errorNum]),
                  "",
                  true
                );
              } else {
                const a = new DataView(xhr.response, 0, 8);
                const header1 = a.getUint32(0);
                const header2 = a.getUint32(4);
                if (header1 === 0x4f676753)
                  res[name] = await audio.decode(xhr.response);
                else if (header1 === 0x89504e47 && header2 === 0x0d0a1a0a)
                  res[name] = await createImageBitmap(new Blob([xhr.response]));
                else
                  msgHandler.sendError(
                    shared.game.ptmain.$t("simphi.loading.resLoadFailed1", [++errorNum]),
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
    res["NoImageBlack"] = await createImageBitmap(
      new ImageData(new Uint8ClampedArray(4).fill(0), 1, 1)
    );
    res["NoImageWhite"] = await createImageBitmap(
      new ImageData(new Uint8ClampedArray(4).fill(255), 1, 1)
    );
    res["JudgeLineMP"] = await imgShader(res["JudgeLine"], "#feffa9");
    res["JudgeLineFC"] = await imgShader(res["JudgeLine"], "#a2eeff");
    res["Ranks"] = await imgSplit(res["Rank"]);
    res["Rank"].close();
    res["mute"] = audio.mute(1);
    if (
      !(() => {
        const b = createCanvas(1, 1).getContext("2d");
        b.drawImage(res["JudgeLine"], 0, 0);
        return b.getImageData(0, 0, 1, 1).data[0];
      })()
    )
      return msgHandler.sendError(
        shared.game.i18n.t("simphi.loading.imgLoadingError", [ err.cause.name ])
      );
    // if (ptSettings.resourcesType === "prpr-custom") await loadprprCustomRes();
    // msgHandler.sendError(shared.game.i18n.t("respack.unavailableNow"));  // diasble custom respack for now
    shared.game.ptmain.simphiLoaded();
    $id("uploader").classList.remove("disabled");
    $id("select").classList.remove("disabled");
    emitter.dispatchEvent(new CustomEvent("change"));
    btnPause.classList.add("disabled");

    function decode(img, border = 0) {
      const canvas = createCanvas(
        img.width - border * 2,
        img.height - border * 2
      );
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, -border, -border);
      const id = ctx.getImageData(0, 0, canvas.width, canvas.width);
      const ab = new Uint8Array((id.data.length / 4) * 3);
      for (let i = 0; i < ab.length; i++)
        ab[i] = id.data[((i / 3) | 0) * 4 + (i % 3)] ^ (i * 3473);
      const size = new DataView(ab.buffer, 0, 4).getUint32(0);
      return { result: ab.buffer.slice(4, size + 4) };
    }
  },
  { once: true }
);

//必要组件
const frameAnimater = new FrameAnimater();
frameAnimater.setCallback(mainLoop);
let nowTime_ms = 0; //当前绝对时间(ms)
let curTime = 0; //最近一次暂停的音乐时间(s)
let curTime_ms = 0; //最近一次播放的绝对时间(ms)
let timeBgm = 0; //当前音乐时间(s)
let timeChart = 0; //当前谱面时间(s)
let duration = 0; //音乐时长(s)
let isInEnd = false; //开头过渡动画
let isOutStart = false; //结尾过渡动画
let isOutEnd = false; //临时变量
function onPageVisibilityChange() {
  if (document.visibilityState === "hidden") 
    if (emitter.eq("play")) qwqPause()
    else {
      if (!audio._actx) return;
      audio._actx.suspend();
      shared.game.afterShow.push(() => {
        audio._actx.resume();
      });
    }
}
document.addEventListener(
  "visibilitychange",
  onPageVisibilityChange
);
document.addEventListener(
  "pagehide",
  onPageVisibilityChange
); //兼容Safari
const qwqIn = new Timer();
const qwqOut = new Timer();
const qwqEnd = new Timer();
/**
 * 播放bgm
 * @param {AudioBuffer} data
 * @param {number} [offset]
 */
function playBgm(data, offset) {
  if (!offset) offset = 0;
  curTime_ms = performance.now();
  tmps.bgMusic = audio.play(data, {
    offset: offset,
    playbackrate: app.speed,
    gainrate: app.musicVolume,
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
  data.playbackRate = app.speed;
  data.muted = true;
  return data.play();
}
let fucktemp1 = false;
let fucktemp2 = null;
const tmps = {
  bgImage: null,
  bgVideo: null,
  bgMusic: (_) => { },
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
};
stage.resize(); //qwq
//作图
function mainLoop() {
  frameTimer.addTick(); //计算fps
  const { lineScale } = app;
  nowTime_ms = performance.now();
  app.resizeCanvas();
  //计算时间
  if (qwqOut.second < 0.67) {
    loopNoCanvas();
    // main["flag{qwq}"](timeBgm);
    for (const i of main.now.values()) i(timeBgm * app.speed);
    loopCanvas();
  } else if (!fucktemp1) {
    fucktemp1 = true;
    audio.stop();
    btnPause.classList.add("disabled"); //qwq
    ctxos.globalCompositeOperation = "source-over";
    ctxos.resetTransform();
    ctxos.globalAlpha = 1;
    if (shared.game.ptmain.gameConfig.imageBlur)
      ctxos.drawImage(
        app.bgImageBlur,
        ...adjustSize(app.bgImageBlur, canvasos, 1)
      );
    else ctxos.drawImage(app.bgImage, ...adjustSize(app.bgImage, canvasos, 1));
    ctxos.fillStyle = "#000"; //背景变暗
    ctxos.globalAlpha = 0.2;
    ctxos.fillRect(0, 0, canvasos.width, canvasos.height);
    setTimeout(() => {
      if (!fucktemp1) return; //避免快速重开后直接结算
      const difficulty = ["ez", "hd", "in", "at"].indexOf(
        levelText.slice(0, 2).toLocaleLowerCase()
      );
      audio.play(
        res[
        `LevelOver${!shared.game.ptmain.gameConfig.usekwlevelOverbgm
          ? difficulty < 0
            ? 2
            : difficulty
          : "0"
        }${!shared.game.ptmain.gameConfig.usekwlevelOverbgm ? "_v2" : ""}`
        ],
        { loop: true }
      );
      qwqEnd.reset();
      qwqEnd.play();
      stat.level = Number(levelText.match(/\d+$/));
      fucktemp2 = stat.getData(app.playMode === 1, selectspeed.value);
    }, 1e3);
    shared.game.ptmain.playFinished();
    if (shared.game.ptmain.playConfig.adjustOffset) saveAdjustedChart(app, fucktemp2);
    app.stage.style.zIndex = 0;
    stage.resize(true);
  } //只让它执行一次
  if (fucktemp2) {
    qwqdraw3(fucktemp2);
    ctxos.globalAlpha = 0.5;
    ctxos.drawImage(
      res["Retry"],
      canvasos.width - app.lineScale * 1,
      canvasos.height - app.lineScale * 1,
      app.lineScale * 0.75,
      app.lineScale * 0.75
    );
    ctxos.textAlign = "left";
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
    ctxos.textAlign = null;
  }
  if (!emitter.eq("play") && !app.pauseTime && !fucktemp2) {
    ctxos.globalAlpha = 0.5;
    ctxos.drawImage(
      res["Loop"],
      app.lineScale * 0.25,
      canvasos.height - app.lineScale * 1,
      app.lineScale * 0.75,
      app.lineScale * 0.75
    );
  }
  if (canvas.width > canvasos.width || canvas.height > canvasos.height || fucktemp2) {
    ctx.globalAlpha = 1;
    if (shared.game.ptmain.gameConfig.imageBlur || fucktemp2)
      ctx.drawImage(app.bgImageBlur, ...adjustSize(app.bgImageBlur, canvas, 1.1));
    else ctx.drawImage(app.bgImage, ...adjustSize(app.bgImage, canvas, 1.1));
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(canvasos, (canvas.width - canvasos.width) / 2, (canvas.height - canvasos.height) / 2);
  //Copyright
  ctx.font = `${lineScale * 0.3}px Saira`;
  ctx.fillStyle = "#FFF";
  ctx.globalAlpha = 0.25;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    app.playMode === 1 ? `PhiTogether Preview (Respack by ${main.customResourceMeta["author"]})` : `${replayMgr.replaying ? `[ ·REC ${replayMgr.playerInfo.username || replayMgr.playerInfo.userName} (ID ${replayMgr.playerInfo.id}) ] ` : ''}PhiTogether ${spec.thisVersion
    } @ sim-phi - P${judgeManager.time.p * 1000} G${judgeManager.time.g * 1000
    } S${app.speed.toFixed(2)}${shared.game.ptmain.gameConfig.fullScreenJudge ? " F" : ""} - ${shared.game.ptmain.noAccountMode ? "OFFLINE" : "ONLINE"
    } - RES ${main.customResourceMeta["author"]}`,
    canvas.width / 2 - lineScale * 0,
    canvas.height - lineScale * 0.3 - (canvas.height - canvasos.height) / 2
  );
}

function loopNoCanvas() {
  if (!isInEnd && qwqIn.second >= 3) {
    isInEnd = true;
    playBgm(app.bgMusic);
    if (app.bgVideo) playVideo(app.bgVideo);
  }
  if (emitter.eq("play") && isInEnd && !isOutStart)
    timeBgm = curTime + (nowTime_ms - curTime_ms) / 1e3;
  if (timeBgm >= duration) isOutStart = true;
  if (showTransition.checked && isOutStart && !isOutEnd) {
    isOutEnd = true;
    qwqOut.play();
  }
  timeChart = Math.max(
    timeBgm -
    (app.chart.offset + Number(shared.game.ptmain.gameConfig.inputOffset) / 1e3 || 0) / app.speed,
    0
  );
  //遍历判定线events和Note
  app.updateByTime(timeChart);
  //更新打击特效和触摸点动画
  hitFeedbackList.update();
  hitImageList.update();
  hitWordList.update();
  for (const i of hitManager.list) {
    if (i.type === "keyboard") continue;
    if (!i.isTapped) hitFeedbackList.add(HitFeedback.tap(i.offsetX, i.offsetY));
    else if (i.isMoving)
      hitFeedbackList.add(HitFeedback.move(i.offsetX, i.offsetY)); //qwq
    else if (i.isActive)
      hitFeedbackList.add(HitFeedback.hold(i.offsetX, i.offsetY));
  }
  //触发判定和播放打击音效
  if (isInEnd && !app.pauseTime) {
    const judgeWidth = canvasos.width * 0.118125;
    if (!replayMgr.replaying) judgeManager.addEvent(app.notes, timeChart);
    judgeManager.execute(app.drags, timeChart, judgeWidth);
    judgeManager.execute(app.flicks, timeChart, judgeWidth);
    judgeManager.execute(app.tapholds, timeChart, judgeWidth);
  }
  //更新判定
  hitManager.update();
  tmps.bgImage = shared.game.ptmain.gameConfig.imageBlur ? app.bgImageBlur : app.bgImage;
  tmps.bgVideo = app.bgVideo;
  tmps.progress = (main.qwqwq ? duration - timeBgm : timeBgm) / duration;
  tmps.name = inputName.value || inputName.placeholder;
  tmps.artist = inputArtist.value;
  tmps.illustrator = inputIllustrator.value || inputIllustrator.placeholder;
  tmps.charter = inputCharter.value || inputCharter.placeholder;
  tmps.level = levelText;
  if (stat.combo > 2) {
    tmps.combo = `${stat.combo}`;
    tmps.combo2 = shared.game.ptmain.playConfig.mode === "preview" ? "PREVIEW" : "COMBO";
  } else tmps.combo = tmps.combo2 = "";
  tmps.showStat = true;
  tmps.statStatus = {
    pause: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
    combonumber: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
    combo: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
    score: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
    bar: { show: true, offsetX: 0, offsetY: 0, alpha: 1 }, // 血量
    name: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
    level: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
  };
  tmps.customForeDraw = null;
  tmps.customBackDraw = null;
  if (replayMgr.replaying) tmps.combo2 = `REPLAY (${replayMgr.playerInfo.username || replayMgr.playerInfo.userName})`
}
function loopCanvas() {
  //尽量不要在这里出现app
  const { lineScale } = app;
  ctxos.clearRect(0, 0, canvasos.width, canvasos.height); //重置画面
  ctxos.globalAlpha = 1;
  //绘制背景
  ctxos.globalAlpha = 1;
  ctxos.drawImage(tmps.bgImage, ...adjustSize(tmps.bgImage, canvasos, 1));
  if (isInEnd && tmps.bgVideo && !main.qwqwq) {
    const { videoWidth: width, videoHeight: height } = tmps.bgVideo;
    ctxos.drawImage(
      tmps.bgVideo,
      ...adjustSize({ width, height }, canvasos, 1)
    );
  }
  // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
  if (qwqIn.second >= 2.5 && !stat.lineStatus) drawLine(0, lineScale); //绘制判定线(背景后0)
  // if (qwq[4]) ctxos.filter = 'none';
  ctxos.resetTransform();
  ctxos.fillStyle = "#000"; //背景变暗
  if (qwqIn.second < 0.67)
    ctxos.globalAlpha = tween.easeOutSine(qwqIn.second * 1.5) * shared.game.ptmain.gameConfig.shared.game.ptmain.gameConfig.backgroundDim;
  else
    ctxos.globalAlpha =
      shared.game.ptmain.gameConfig.shared.game.ptmain.gameConfig.backgroundDim -
      tween.easeOutSine(qwqOut.second * 1.5) * (shared.game.ptmain.gameConfig.shared.game.ptmain.gameConfig.backgroundDim - 0.2);
  ctxos.fillRect(0, 0, canvasos.width, canvasos.height);
  if (qwqIn.second >= 2.5 && tmps.customBackDraw != null) tmps.customBackDraw(ctxos); // 自定义背景
  // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
  if (qwqIn.second >= 2.5) drawLine(stat.lineStatus ? 2 : 1, lineScale); //绘制判定线(背景前1)
  // if (qwq[4]) ctxos.filter = 'none';
  ctxos.resetTransform();
  if (qwqIn.second >= 3 && qwqOut.second === 0) {
    //绘制note
    drawNotes();
    if (shared.game.ptmain.gameConfig.showPoint) {
      //绘制定位点
      ctxos.font = `${lineScale}px Saira`;
      ctxos.textAlign = "center";
      for (const i of app.linesReversed) {
        ctxos.setTransform(
          i.cosr,
          i.sinr,
          -i.sinr,
          i.cosr,
          i.offsetX,
          i.offsetY
        );
        ctxos.globalAlpha = 1;
        ctxos.fillStyle = "violet";
        ctxos.fillRect(
          -lineScale * 0.2,
          -lineScale * 0.2,
          lineScale * 0.4,
          lineScale * 0.4
        );
        ctxos.fillStyle = "yellow";
        ctxos.globalAlpha = (i.alpha + 0.5) / 1.5;
        ctxos.fillText(`${i.lineId.toString()}`, 0, -lineScale * 0.3);
      }
      for (const i of app.notesReversed) {
        if (!i.visible) continue;
        ctxos.setTransform(
          i.cosr,
          i.sinr,
          -i.sinr,
          i.cosr,
          i.offsetX,
          i.offsetY
        );
        ctxos.globalAlpha = 1;
        ctxos.fillStyle = "lime";
        ctxos.fillRect(
          -lineScale * 0.2,
          -lineScale * 0.2,
          lineScale * 0.4,
          lineScale * 0.4
        );
        ctxos.fillStyle = "cyan";
        ctxos.globalAlpha = i.realTime > timeChart ? 1 : 0.5;
        ctxos.fillText(`${i.name}:${i.line.speed}`, 0, -lineScale * 0.3);
      }
    }
  }
  // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
  hitImageList.animate(); //绘制打击特效1
  // if (qwq[4]) ctxos.filter = 'none';
  if (shared.game.ptmain.gameConfig.showCE2) hitWordList.animate(); //绘制打击特效2
  ctxos.globalAlpha = 1;
  //绘制进度条
  ctxos.setTransform(
    canvasos.width / 1920,
    0,
    0,
    canvasos.width / 1920,
    0,
    lineScale *
    (qwqIn.second < 0.67
      ? tween.easeOutSine(qwqIn.second * 1.5) - 1
      : -tween.easeOutSine(qwqOut.second * 1.5)) *
    1.75
  );
  ctxos.drawImage(res["ProgressBar"], tmps.progress * 1920 - 1920, 0);
  //绘制文字
  ctxos.resetTransform();
  for (const i of main.after.values()) i();
  ctxos.fillStyle = "#fff";
  //开头过渡动画
  if (qwqIn.second < 3) {
    if (qwqIn.second < 0.67)
      ctxos.globalAlpha = tween.easeOutSine(qwqIn.second * 1.5);
    else if (qwqIn.second >= 2.5)
      ctxos.globalAlpha = tween.easeOutSine(6 - qwqIn.second * 2);
    const name = tmps.name;
    const artist = tmps.artist;
    const illustrator = `Illustration designed by ${tmps.illustrator}`;
    const charter = `Level designed by ${tmps.charter}`;
    const theme = `Resource Pack ${main.customResourceMeta["name"]} designed by ${main.customResourceMeta["author"]}`;
    ctxos.textAlign = "center";
    //曲名
    ctxos.textBaseline = "alphabetic";
    ctxos.font = `${lineScale * 1.1}px Saira`;
    const dxsnm = ctxos.measureText(name).width;
    if (dxsnm > canvasos.width - lineScale * 1.5)
      ctxos.font = `${((lineScale * 1.1) / dxsnm) * (canvasos.width - lineScale * 1.5)
        }px Saira`;
    ctxos.fillText(name, app.wlen, app.hlen * 0.75);
    //曲师、曲绘和谱师
    ctxos.textBaseline = "top";
    ctxos.font = `${lineScale * 0.55}px Saira`;
    const dxa = ctxos.measureText(artist).width;
    if (dxa > canvasos.width - lineScale * 1.5)
      ctxos.font = `${((lineScale * 0.55) / dxa) * (canvasos.width - lineScale * 1.5)
        }px Saira`;
    ctxos.fillText(artist, app.wlen, app.hlen * 0.75 + lineScale * 0.85);
    ctxos.font = `${lineScale * 0.55}px Saira`;
    const dxi = ctxos.measureText(illustrator).width;
    if (dxi > canvasos.width - lineScale * 1.5)
      ctxos.font = `${((lineScale * 0.55) / dxi) * (canvasos.width - lineScale * 1.5)
        }px Saira`;
    ctxos.fillText(illustrator, app.wlen, app.hlen * 1.25 + lineScale * 0.15);
    ctxos.font = `${lineScale * 0.55}px Saira`;
    const dxc = ctxos.measureText(charter).width;
    if (dxc > canvasos.width - lineScale * 1.5)
      ctxos.font = `${((lineScale * 0.55) / dxc) * (canvasos.width - lineScale * 1.5)
        }px Saira`;
    ctxos.fillText(charter, app.wlen, app.hlen * 1.25 + lineScale * 1.0);
    ctxos.font = `${lineScale * 0.55}px Saira`;
    const dxt = ctxos.measureText(theme).width;
    if (dxt > canvasos.width - lineScale * 1.5)
      ctxos.font = `${((lineScale * 0.55) / dxt) * (canvasos.width - lineScale * 1.5)
        }px Saira`;
    ctxos.fillText(theme, app.wlen, app.hlen * 1.25 + lineScale * 1.75);
    //判定线(装饰用)
    ctxos.globalAlpha = 1;
    ctxos.setTransform(1, 0, 0, 1, app.wlen, app.hlen);
    const imgW =
      lineScale *
      48 *
      (qwqIn.second < 0.67 ? tween.easeInCubic(qwqIn.second * 1.5) : 1);
    const imgH = lineScale * 0.15; //0.1333...
    if (qwqIn.second >= 2.5)
      ctxos.globalAlpha = tween.easeOutSine(6 - qwqIn.second * 2);
    ctxos.drawImage(
      shared.game.ptmain.gameConfig.lineColor ? res["JudgeLineMP"] : res["JudgeLine"],
      -imgW / 2,
      -imgH / 2,
      imgW,
      imgH
    );
  }

  ctxos.globalAlpha = 1;
  ctxos.resetTransform();
  ctxos.fillStyle = "#fff";
  //绘制分数和combo以及暂停按钮
  ctxos.globalAlpha = 1;
  ctxos.setTransform(
    1,
    0,
    0,
    1,
    0,
    lineScale *
    (qwqIn.second < 0.67
      ? tween.easeIOCubic(qwqIn.second * 1.5) - 1
      : -tween.easeIOCubic(qwqOut.second * 1.5)) *
    1.75
  );
  ctxos.textBaseline = "alphabetic";
  if (tmps.showStat) {
    // 绘制分数
    ctxos.font = `${lineScale * 0.95}px Saira`;
    ctxos.textAlign = "right";
    ctxos.globalAlpha = tmps.statStatus.score.alpha;
    ctxos.fillText(
      stat.scoreStr,
      canvasos.width - lineScale * 0.65 + tmps.statStatus.score.offsetX,
      lineScale * 1.375 + tmps.statStatus.score.offsetY
    );
    if (shared.game.ptmain.gameConfig.showAcc && shared.game.ptmain.playConfig.mode !== "preview") {
      ctxos.font = `${lineScale * 0.66}px Saira`;
      ctxos.fillText(
        stat.accStr,
        canvasos.width - lineScale * 0.65 + tmps.statStatus.score.offsetX,
        lineScale * 2.05 + tmps.statStatus.score.offsetY
      );
    }
    shared.game.ptmain.playConfig.mode !== "preview" ? gauge.draw() : null;
  }
  ctxos.fillStyle = "#fff";
  ctxos.textAlign = "center";
  ctxos.font = `${lineScale * 1.32}px Saira`;
  ctxos.globalAlpha = tmps.statStatus.combonumber.alpha;
  ctxos.fillText(tmps.combo, app.wlen + tmps.statStatus.combonumber.offsetX, lineScale * 1.375 + tmps.statStatus.combonumber.offsetY);
  ctxos.globalAlpha =
    qwqIn.second < 0.67
      ? tween.easeOutSine(qwqIn.second * 1.5)
      : 1 - tween.easeOutSine(qwqOut.second * 1.5);
  ctxos.globalAlpha *= tmps.statStatus.combo.alpha;
  ctxos.font = `${lineScale * 0.5}px Saira`;
  ctxos.fillText(tmps.combo2, app.wlen + tmps.statStatus.combo.offsetX, lineScale * 1.95 + tmps.statStatus.combo.offsetY);
  //绘制曲名和等级
  ctxos.setTransform(
    1,
    0,
    0,
    1,
    0,
    lineScale *
    (qwqIn.second < 0.67
      ? 1 - tween.easeIOCubic(qwqIn.second * 1.5)
      : tween.easeIOCubic(qwqOut.second * 1.5)) *
    1.75
  );
  ctxos.textBaseline = "alphabetic";
  ctxos.textAlign = "right";
  ctxos.font = `${lineScale * 0.63}px Saira`;
  const dxlvl = ctxos.measureText(levelText).width;
  if (dxlvl > app.wlen - lineScale)
    ctxos.font = `${((lineScale * 0.63) / dxlvl) * (app.wlen - lineScale)}px Saira`;
  ctxos.globalAlpha = tmps.statStatus.level.alpha;
  ctxos.fillText(
    tmps.level,
    canvasos.width - lineScale * 0.75 + tmps.statStatus.level.offsetX,
    canvasos.height - lineScale * 0.66 + tmps.statStatus.level.offsetY
  );
  ctxos.textAlign = "left";
  // ctxos.textBaseline = "middle";
  ctxos.font = `${lineScale * 0.63}px Saira`;
  const dxsnm = ctxos.measureText(
    inputName.value || inputName.placeholder
  ).width;
  if (dxsnm > app.wlen - lineScale)
    ctxos.font = `${((lineScale * 0.63) / dxsnm) * (app.wlen - lineScale)}px Saira`;
  ctxos.globalAlpha = tmps.statStatus.name.alpha;
  ctxos.fillText(
    inputName.value || inputName.placeholder,
    lineScale * 0.65 + tmps.statStatus.name.offsetX,
    canvasos.height - lineScale * 0.66 + tmps.statStatus.name.offsetY
  );
  ctxos.globalAlpha = 1;
  ctxos.resetTransform();
  if (qwqIn.second >= 2.5 && tmps.customForeDraw != null) tmps.customForeDraw(ctxos); // 自定义前景
  if (qwqIn.second > 3 && main.filter) main.filter(ctxos, timeBgm, nowTime_ms / 1e3); //滤镜处理
  if (shared.game.ptmain.gameConfig.feedback) hitFeedbackList.animate(); //绘制打击特效0
  ctxos.resetTransform();
  try {
    shared.game.graphicHandler.whilePlayingHook(ctx, ctxos, lineScale);
  } catch (e) {
    console.warn(e);
  }
  //绘制时间和帧率以及note打击数
  ctxos.fillStyle = "#fff";
  if (qwqIn.second < 0.67)
    ctxos.globalAlpha = tween.easeOutSine(qwqIn.second * 1.5);
  else ctxos.globalAlpha = 1 - tween.easeOutSine(qwqOut.second * 1.5);
  ctxos.font = `${lineScale * 0.4}px Saira`;
  ctxos.textBaseline = "middle";
  ctxos.textAlign = "right";
  ctxos.globalAlpha = 0.5;
  ctxos.fillText(
    frameTimer.fpsStr,
    canvasos.width - lineScale * 0.05,
    lineScale * 0.5
  );
  ctxos.font = `${lineScale * 0.25}px Saira`;
  ctxos.fillText("FPS", canvasos.width - lineScale * 0.05, lineScale * 0.8);
  ctxos.textBaseline = "alphabetic";
  ctxos.globalAlpha = 1;
  ctxos.resetTransform();
  ctxos.globalAlpha = tmps.canPause ? tmps.statStatus.pause.alpha : 0.5;
  if (tmps.showStat)
    ctxos.drawImage(
      res["Pause"],
      lineScale * 0.6 + tmps.statStatus.pause.offsetX,
      lineScale * 0.7 + tmps.statStatus.pause.offsetY,
      lineScale * 0.63,
      lineScale * 0.7
    );
  if (shared.game.ptmain.playConfig.adjustOffset) {
    ctxos.fillStyle = 'gray';
    ctxos.globalAlpha = 0.75;
    drawRoundRect(
      ctxos,
      canvasos.width - lineScale * 7.5,
      canvasos.height - lineScale * 5,
      lineScale * 7.5,
      lineScale * 5,
      lineScale * 0.25
    ).fill();
    ctxos.globalAlpha = 1;
    ctxos.fillStyle = "#fff";
    ctxos.textBaseline = "middle";
    ctxos.textAlign = "center";
    ctxos.font = `${lineScale * 0.75}px Saira`;
    ctxos.fillText(shared.game.i18n.t("simphi.adjustOffset.title"), canvasos.width - lineScale * 3.75, canvasos.height - lineScale * 4.25);
    ctxos.font = `${lineScale * 0.65}px Saira`;
    ctxos.fillText(`${(app.chart.offset * 1e3).toFixed(0)}ms`, canvasos.width - lineScale * 3.75, canvasos.height - lineScale * 2.5);
    ctxos.font = `${lineScale * 0.5}px Saira`;
    const drawIcon = (p, ps) => {
      const h = lineScale * 0.5 - lineScale * Math.abs(p) * 0.1;
      ctxos.fillStyle = "#fff";
      drawRoundRect(
        ctxos,
        canvasos.width - 3.75 * lineScale + lineScale * ps,
        canvasos.height - lineScale * 2.5 - h,
        h * 2,
        h * 2,
        lineScale * 0.1
      ).fill();
      ctxos.fillStyle = "#000";
      ctxos.fillText(p > 0 ? "+" : "-", canvasos.width - 3.75 * lineScale + lineScale * ps + h, canvasos.height - lineScale * 2.5)
    }
    drawIcon(-3, -3.5);
    drawIcon(-2, -3);
    drawIcon(-1, -2.25);
    drawIcon(1, 1.5);
    drawIcon(2, 2.45);
    drawIcon(3, 3.15);
    ctxos.fillStyle = "#fff";
    drawRoundRect(
      ctxos,
      canvasos.width - 7 * lineScale,
      canvasos.height - lineScale * 1.25,
      lineScale * 3,
      lineScale,
      lineScale * 0.1
    ).fill();
    drawRoundRect(
      ctxos,
      canvasos.width - 3.5 * lineScale,
      canvasos.height - lineScale * 1.25,
      lineScale * 3,
      lineScale,
      lineScale * 0.1
    ).fill();
    ctxos.fillStyle = "#000";
    ctxos.font = `${lineScale * 0.65}px Saira`;
    ctxos.fillText(shared.game.i18n.t("simphi.adjustOffset.reset"), canvasos.width - 5.5 * lineScale, canvasos.height - lineScale * 0.75);
    ctxos.fillText(shared.game.i18n.t("simphi.adjustOffset.save"), canvasos.width - 2 * lineScale, canvasos.height - lineScale * 0.75);
  }
  ctxos.fillStyle = "#fff";
  if (!emitter.eq("play")) {
    ctxos.fillStyle = "#000"; //背景变暗
    ctxos.globalAlpha = app.pauseBackgroundDimPara1
      ? Math.max(
        0.6 -
        0.6 *
        tween.easeOutCubic(
          (performance.now() - app.pauseBackgroundDimPara1) / 2000
        ),
        0
      )
      : 0.6; //背景不透明度
    ctxos.fillRect(0, 0, canvasos.width, canvasos.height);
    ctxos.globalAlpha = 0.5;
    if (!app.pauseTime) {
      ctxos.globalAlpha = 1;
      ctxos.fillStyle = "#fff";
      ctxos.textBaseline = "middle";
      ctxos.font = `${lineScale * 0.4}px Saira`;
      ctxos.textAlign = "left";
      ctxos.fillText(
        `${time2Str(main.qwqwq ? duration - timeBgm : timeBgm)}/${time2Str(
          duration
        )}${status2.text}`,
        lineScale * 0.05,
        lineScale * 0.35
      );
      // ctxos.textAlign = "right";
      [
        stat.noteRank[5] + stat.noteRank[4] + stat.noteRank[1],  // Perfect
        stat.noteRank[7] + stat.noteRank[3],  // Good
        stat.noteRank[7],  // GoodEarly
        stat.noteRank[3],  // GoodLate
        stat.noteRank[6],  // Bad
        stat.noteRank[2],  // Miss
        // stat.maxcombo,     // 肉眼可见
      ].forEach((val, idx) => {
        const comboColor = [
          "#f0ed69",
          "#0ac3ff",
          "#0ac3ff",
          "#0ac3ff",
          "#fe7b93",
          "#999",
        ];
        const comboText = [
          "Perfect:",
          "Good:",
          "Early:",
          "Late:",
          "Bad:",
          "Miss:",
        ];
        ctxos.fillStyle = comboColor[idx];
        ctxos.fillText(
          comboText[idx],
          lineScale * 0.05,
          canvasos.height / 2 + lineScale * (idx - 2.8) * 0.5
        );
        ctxos.fillText(
          val.toString(),
          lineScale * 1.75,
          canvasos.height / 2 + lineScale * (idx - 2.8) * 0.5
        );
      });
      ctxos.fillStyle = "#fff";
      ctxos.fillText(
        `DSP:  ${stat.curDispStr}`,
        lineScale * 0.05,
        canvasos.height / 2 + lineScale * 2.6
      );
      ctxos.fillText(
        `AVG:  ${stat.avgDispStr}`,
        lineScale * 0.05,
        canvasos.height / 2 + lineScale * 3.1
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
      const imgBaseLine = n => app.hlen - lineScale * n / 2;
      const imgX = n => app.wlen + lineScale * (n * 2 - 0.5);
      ctxos.drawImage(
        res["Back"],
        imgX(-1.1),
        imgBaseLine(1.5),
        lineScale * 1.5,
        lineScale * 1.5
      );
      ctxos.drawImage(
        res["Retry"],
        imgX(0),
        imgBaseLine(1.25),
        lineScale * 1.25,
        lineScale * 1.25
      );
      ctxos.drawImage(
        res["Resume"],
        imgX(1),
        imgBaseLine(1.5),
        lineScale * 1.5,
        lineScale * 1.5
      );
      if (shared.game.ptmain.playConfig.practiseMode && qwqIn.second >= 3) {
        ctxos.font = `${lineScale * 0.5}px Saira`;
        ctxos.fillStyle = "#fff";
        ctxos.textAlign = "center";
        ctxos.textBaseline = "middle";
        ctxos.fillText("00:00.000", app.wlen * 0.25, app.hlen + lineScale * 4.25);
        ctxos.fillText(time2Str(duration, true), app.wlen * 1.75, app.hlen + lineScale * 4.25);
        const progress = (main.qwqwq ? duration - timeBgm : timeBgm) / duration;
        ctxos.fillText(time2Str(main.qwqwq ? duration - timeBgm : timeBgm, true), app.wlen * (0.25 + 1.5 * progress), app.hlen + lineScale * 2);
        drawRoundRect(
          ctxos,
          app.wlen * 1.5 + lineScale * 2.5,
          app.hlen - lineScale * 0.5,
          lineScale * 0.6,
          lineScale * 0.6,
          lineScale * 0.1
        ).fill();
        drawRoundRect(
          ctxos,
          app.wlen * 1.5 + lineScale * 3.4,
          app.hlen - lineScale * 0.5,
          lineScale * 0.6,
          lineScale * 0.6,
          lineScale * 0.1
        ).fill();
        ctxos.textAlign = "left";
        ctxos.fillText(`Speed: ${app.speed.toFixed(3)}`, app.wlen + lineScale * 4, app.hlen - lineScale * 0.25);
        ctxos.fillRect(
          app.wlen + lineScale * 4,
          app.hlen + lineScale * 0.25,
          app.wlen * 0.5,
          lineScale * 0.1
        );
        ctxos.fillStyle = "#000";
        ctxos.textAlign = "center";
        ctxos.fillText("-", app.wlen * 1.5 + lineScale * 2.8, app.hlen - lineScale * 0.25);
        ctxos.fillText("+", app.wlen * 1.5 + lineScale * 3.7, app.hlen - lineScale * 0.2);
        ctxos.fillStyle = "#a9a9a9";
        ctxos.fillRect(
          app.wlen * 0.25,
          app.hlen + lineScale * 2.5,
          app.wlen * 1.5,
          lineScale * 1.25
        );
        ctxos.fillStyle = "deepskyblue";
        ctxos.fillRect(
          app.wlen * (0.25 + 1.5 * progress),
          app.hlen + lineScale * 2.25,
          lineScale * 0.1,
          lineScale * 1.5
        );
        ctxos.fillRect(
          app.wlen + lineScale * 3.9 + app.wlen * 0.5 * Math.min((app.speed - 0.5) / 1.5, 1),
          app.hlen + lineScale * 0.15,
          lineScale * 0.1,
          lineScale * 0.3
        );
      }
    }
  }
  ctxos.fillStyle = "#fff";
  if (app.pauseTime) {
    ctxos.font = `${lineScale * 2}px Saira`;
    ctxos.fillStyle = "#FFF";
    ctxos.globalAlpha = 1;
    ctxos.textAlign = "center";
    ctxos.textBaseline = "middle";
    ctxos.fillText(app.pauseTime, canvasos.width / 2, canvasos.height / 2);
  }
}
//判定线函数，undefined/0:默认,1:非,2:恒成立
function drawLine(bool, lineScale) {
  ctxos.globalAlpha = 1;
  const tw = 1 - tween.easeOutSine(qwqOut.second * 1.5);
  for (const i of app.linesReversed) {
    if (bool ^ Number(i.imageD) && qwqOut.second < 0.67) {
      if (i.alpha < 0) continue;
      if (i.attachUI) {
        tmps.statStatus[i.attachUI] = {
          show: true,
          offsetX: i.offsetX - app.wlen,
          offsetY: i.offsetY - app.hlen,
          alpha: i.alpha,
        };

        continue;
      }
      ctxos.globalAlpha = i.alpha;
      ctxos.setTransform(
        i.cosr * tw,
        i.sinr,
        -i.sinr * tw,
        i.cosr,
        app.wlen + (i.offsetX - app.wlen) * tw,
        i.offsetY
      ); //hiahiah
      const imgS = ((i.imageU ? lineScale * 18.75 : canvasos.height) * i.imageS) / 1080; 
      const imgW = imgS * i.imageW * i.imageA * ((i.scaleX * (-0.0081 + 0.5214 * (canvasos.width / canvasos.height))) || 1); //1.5 0.774 1.78 0.92
      const imgH = imgS * i.imageH * ((i.scaleY * 1) || 1);
      // ctxos.save();
      if (!i.text) {
        // const lineImage = i.imageL[i.imageC && shared.game.ptmain.gameConfig.lineColor ? stat.lineStatus : 0];
        // if (i.scaleX) ctxos.scale(-1, 1);
        try {
          if (i.color && i.color != "#fff" && i.color != "#ffffff") {
            if (!i.isCustomImage) {
              ctxos.fillStyle = i.color || "#fff";
              ctxos.fillRect(
                -imgW / 2,
                -imgH / 2,
                imgW,
                imgH
              );
              ctxos.fillStyle = "#fff";
            } else {
              ctxos.drawImage(
                getColoredLineImage(i, i.color),
                -imgW / 2,
                -imgH / 2,
                imgW,
                imgH
              );
            }
          } else {
            ctxos.drawImage(
              i.imageL[i.imageC && shared.game.ptmain.gameConfig.lineColor ? stat.lineStatus : 0],
              -imgW / 2,
              -imgH / 2,
              imgW,
              imgH
            );
          }
        } catch (err) {
          ctxos.drawImage(
            i.imageL[i.imageC && shared.game.ptmain.gameConfig.lineColor ? stat.lineStatus : 0],
            -imgW / 2,
            -imgH / 2,
            imgW,
            imgH
          );
        }
      } else {
        ctxos.fillStyle = i.color || "#fff";
        ctxos.textAlign = "center";
        ctxos.textBaseline = "middle";
        ctxos.font = `${lineScale * (i.scaleY || 1)}px Saira`;
        ctxos.fillText(i.text, 0, 0);
      }
      // ctxos.restore();
    }
  }
}
function getColoredLineImage(line, hex) {
  if (!hex) return line.imageL[i.imageC && shared.game.ptmain.gameConfig.lineColor ? stat.lineStatus : 0];
  hex = hex.toLowerCase();
  return line.imagesColored[hex] || (line.imagesColored[hex] = imgShader(line.imageL[0], hex, true));
}

function drawRoundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
}

function qwqdraw3(statData) {

  (ctxos.shadowBlur = 40), (ctxos.shadowColor = "#000000");
  ctxos.globalAlpha = 1;
  const k = 3.7320508075688776; //tan75°

  const qwq0 = (canvasos.width - canvasos.height / k) / (16 - 9 / k);
  ctxos.setTransform(
    qwq0 / 120,
    0,
    0,
    qwq0 / 120,
    app.wlen - qwq0 * 8,
    app.hlen - qwq0 * 4.5
  ); //?

  ctxos.globalAlpha = 1;
  let imgWidthAct = 700 * (app.bgImage.width / app.bgImage.height),
    imgHeightAct = 700;
  if (imgWidthAct < 1200) {
    imgWidthAct = 1200;
    imgHeightAct = 1200 * (app.bgImage.height / app.bgImage.width);
  }
  ctxos.drawImage(
    app.bgImage,
    -1920 * tween.ease10(clip(qwqEnd.second * 1)) + 2460.5 - imgWidthAct / 2,
    208 - (imgHeightAct - 645) / 2,
    imgWidthAct,
    imgHeightAct
  );

  drawRoundRect(
    ctxos,
    -1920 * tween.ease10(clip(qwqEnd.second * 1)) + 2010.24,
    182,
    890,
    700,
    30
  );
  ctxos.globalCompositeOperation = "destination-in";
  ctxos.fill();
  ctxos.globalCompositeOperation = "source-over";
  ctxos.stroke();

  ctxos.globalAlpha = 0.5;
  ctxos.fillStyle = "black";
  drawRoundRect(
    ctxos,
    -1720 * tween.ease10(clip(qwqEnd.second - 0.1)) + 2740,
    180,
    800,
    360,
    30
  ).fill();

  drawRoundRect(
    ctxos,
    -1020 * tween.ease10(clip(qwqEnd.second * 0.9 - 0.25)) + 2040,
    563,
    800,
    150,
    30
  ).fill();
  drawRoundRect(
    ctxos,
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2040,
    735,
    800,
    150,
    30
  ).fill();

  //歌名和等级
  ctxos.globalAlpha = 1;
  ctxos.restore();
  ctxos.setTransform(
    qwq0 / 120,
    0,
    0,
    qwq0 / 120,
    app.wlen - qwq0 * 8,
    app.hlen - qwq0 * 4.5
  ); //?
  ctxos.fillStyle = "#fff";
  ctxos.textAlign = "left";
  ctxos.font = `73.5px Saira`;
  const dxsnm = ctxos.measureText(
    inputName.value || inputName.placeholder
  ).width;
  if (dxsnm > 600)
    ctxos.font = `${(73.5 / dxsnm) * 600}px Saira`;
  ctxos.fillText(
    inputName.value || inputName.placeholder,
    -1920 * tween.ease10(clip(qwqEnd.second * 1)) + 2050,
    830
  );
  ctxos.font = `30px Saira`;
  const dxlvl = ctxos.measureText(levelText).width;
  if (dxlvl > 150)
    ctxos.font = `${(30 / dxlvl) * 150}px Saira`;
  ctxos.textAlign = "right";
  ctxos.fillText(
    levelText,
    -1920 * tween.ease10(clip(qwqEnd.second * 1)) + 2860,
    835
  );
  ctxos.textAlign = "left";
  //Rank图标
  ctxos.globalAlpha = clip((qwqEnd.second - 1.3) * 3.75);
  const qwq2 = 293 + clip((qwqEnd.second - 1.3) * 3.75) * 100;
  const qwq3 = 410 - tween.ease15(clip((qwqEnd.second - 1.3) * 1.5)) * 164;
  if (stat.lineStatus == 3)
    ctxos.drawImage(res["FCV"], 1685 - qwq3, 373 - qwq3, qwq3 * 2, qwq3 * 2);
  else
    ctxos.drawImage(
      res["Ranks"][stat.rankStatus],
      1685 - qwq3,
      373 - qwq3,
      qwq3 * 2,
      qwq3 * 2
    );
  //准度和连击
  ctxos.globalAlpha = clip((qwqEnd.second - 0.8) * 1.5);
  ctxos.textAlign = "right";
  ctxos.font = `55px Saira`;
  ctxos.fillText(
    stat.accStr,
    -1020 * tween.ease10(clip(qwqEnd.second * 0.9 - 0.25)) + 2785,
    638
  );
  ctxos.font = `26px Saira`;
  ctxos.fillText(
    "ACCURACY",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.9 - 0.25)) + 2783,
    673
  );
  ctxos.textAlign = "left";
  ctxos.font = `55px Saira`;
  ctxos.fillText(
    stat.maxcombo,
    -1020 * tween.ease10(clip(qwqEnd.second * 0.9 - 0.25)) + 2095,
    638
  );
  ctxos.font = `26px Saira`;
  ctxos.fillText(
    "MAX COMBO",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.9 - 0.25)) + 2095,
    673
  );
  // ctxos.fillStyle = statData[4];
  //分数
  ctxos.fillStyle = "#fff";
  ctxos.textAlign = "left";
  ctxos.font = `86px Saira`;
  ctxos.globalAlpha = clip((qwqEnd.second - 0.4) * 2.0);
  ctxos.fillText(
    stat.scoreStr,
    -1720 * tween.ease10(clip(qwqEnd.second - 0.1)) + 2795,
    415
  );
  ctxos.textAlign = "right";
  ctxos.font = `25px Saira`;
  ctxos.fillStyle = "#83e691";
  ctxos.fillText(
    app.speed === 1
      ? ""
      : statData.textAboveStr.replace("{SPEED}", app.speed.toFixed(2)),
    -1920 * tween.ease10(clip(qwqEnd.second * 1)) + 2860,
    792
  );

  ctxos.textAlign = "left";
  ctxos.globalAlpha = clip((qwqEnd.second - 0.4) * 2.5);
  ctxos.fillStyle = "#a2e27f";
  ctxos.font = `25px Saira`;
  ctxos.fillText(
    statData.newBestStr,
    -1720 * tween.ease10(clip(qwqEnd.second - 0.1)) + 2800,
    337
  );
  ctxos.fillStyle = "#fff";
  ctxos.textAlign = "left";
  ctxos.font = `30px Saira`;
  ctxos.fillText(
    statData.scoreBest,
    -1720 * tween.ease10(clip(qwqEnd.second - 0.1)) + 2800,
    460
  );
  // 	ctxos.globalAlpha = clip((qwqEnd.second - 1.87) * 2.50);
  ctxos.textAlign = "left";
  ctxos.fillText(
    statData.scoreDelta,
    -1720 * tween.ease10(clip(qwqEnd.second - 0.1)) + 2950,
    460
  );

  //Perfect, good, bad, miss
  ctxos.fillStyle = "#fff";
  ctxos.font = `45px Saira`;
  ctxos.textAlign = "center";
  ctxos.globalAlpha = clip((qwqEnd.second - 1.25) * 2.5);
  ctxos.fillText(
    stat.perfect,
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2140,
    812
  );
  ctxos.fillText(
    stat.good,
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2288,
    812
  );
  ctxos.fillText(
    stat.noteRank[6],
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2395,
    812
  );
  ctxos.fillText(
    stat.noteRank[2],
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2502,
    812
  );
  ctxos.font = `20px Saira`;
  ctxos.fillText(
    "PERFECT",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2140,
    842
  );
  ctxos.fillText(
    "GOOD",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2288,
    842
  );
  ctxos.fillText(
    "BAD",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2395,
    842
  );
  ctxos.fillText(
    "MISS",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2502,
    842
  );
  ctxos.font = `28px Saira`;
  //Early, Late
  const qwq4 = clip(
    (qwq[3] > 0 ? qwqEnd.second - qwq[3] : 0.2 - qwqEnd.second - qwq[3]) * 5.0
  );
  ctxos.textAlign = "left";
  ctxos.fillText(
    "EARLY",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2610,
    800
  );
  ctxos.fillText(
    "LATE",
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2625,
    838
  );
  ctxos.textAlign = "right";
  ctxos.fillText(
    stat.noteRank[7],
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2775,
    800
  );
  ctxos.fillText(
    stat.noteRank[3],
    -1020 * tween.ease10(clip(qwqEnd.second * 0.8 - 0.3)) + 2775,
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
    shared.game.graphicHandler.resultHook(ctx, ctxos);
  } catch (e) {
    console.warn(e);
  }
  (ctxos.shadowBlur = 0), (ctxos.shadowColor = "#000000");
  ctxos.resetTransform();
}

function clip(num) {
  if (num < 0) return 0;
  if (num > 1) return 1;
  return num;
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
    this.full = (ctx) => ctx.drawImage(img, dx, dy, dw, dh);
    /** @param {CanvasRenderingContext2D} ctx */
    this.head = (ctx) => ctx.drawImage(img, dx, 0, dw, dh);
    /** @param {CanvasRenderingContext2D} ctx */
    this.body = (ctx, offset, length) =>
      ctx.drawImage(img, dx, offset, dw, length);
    /** @param {CanvasRenderingContext2D} ctx */
    this.tail = (ctx, offset) => ctx.drawImage(img, dx, offset - dh, dw, dh);
    if (compacted) {
      /** @param {CanvasRenderingContext2D} ctx */
      this.head = (ctx) => ctx.drawImage(img, dx, dy, dw, dh);
      /** @param {CanvasRenderingContext2D} ctx */
      this.tail = (ctx, offset) =>
        ctx.drawImage(img, dx, offset - dh - dy, dw, dh);
    }
  }
}
/**
 * @typedef {Object} HitFX
 * @property {ScaledNote[]} effects
 * @property {number} numOfParts
 * @property {number} duration
 */
const noteRender = {
  /** @type {Object<string,ScaledNote>} */
  note: {},
  /** @type {Object<string,HitFX>} */
  hitFX: {},
  /**
   * @param {string} name
   * @param {ImageBitmap} img
   * @param {number} scale
   */
  async update(name, img, scale, compacted=false) {
    this.note[name] = new ScaledNote(img, scale, compacted);
    if (name === "Tap")
      this.note["TapBad"] = new ScaledNote(
        await imgPainter(img, "#6c4343"),
        scale
      );
  },
  async updateFX(img, scale, limitX, limitY, hideParts, duration) {
    const hitRaw = await imgSplit(img, limitX, limitY);
    const hitPerfect = hitRaw.map(
      async (img) =>
        new ScaledNote(
          await imgShader(img, tmps.hitPerfectColor || "rgba(255,236,160,0.8823529)"),
          scale
        )
    ); //#fce491,#ffeca0e1
    const hitGood = hitRaw.map(
      async (img) =>
        new ScaledNote(
          await imgShader(img, tmps.hitGoodColor || "rgba(180,225,255,0.9215686)"),
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
    hitRaw.forEach((img) => img.close());
  },
};
//绘制Note
function drawNotes() {
  for (const i of app.holds) drawHold(i, timeChart);
  for (const i of app.dragsReversed) drawDrag(i);
  for (const i of app.tapsReversed) drawTap(i);
  for (const i of app.flicksReversed) drawFlick(i);
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
  if (app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
  const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
  const nsr = app.noteScaleRatio * (note.size || 1);
  if (!note.visible || (note.scored && !note.badtime)) return;
  ctxos.setTransform(
    nsr * note.cosr,
    nsr * note.sinr,
    -nsr * note.sinr,
    nsr * note.cosr,
    note.offsetX,
    note.offsetY
  );
  if (note.badtime) {
    ctxos.globalAlpha = 1 - clip((performance.now() - note.badtime) / 500);
    noteRender.note["TapBad"].full(ctxos);
  } else {
    ctxos.globalAlpha =
      note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
    if (main.qwqwq)
      ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0); //过线前1.5s出现
    noteRender.note[HL ? "TapHL" : "Tap"].full(ctxos);
  }
}

function drawDrag(note) {
  if (app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
  const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
  const nsr = app.noteScaleRatio * (note.size || 1);
  if (!note.visible || (note.scored && !note.badtime)) return;
  ctxos.setTransform(
    nsr * note.cosr,
    nsr * note.sinr,
    -nsr * note.sinr,
    nsr * note.cosr,
    note.offsetX,
    note.offsetY
  );
  if (note.badtime);
  else {
    ctxos.globalAlpha =
      note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
    if (main.qwqwq)
      ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0);
    noteRender.note[HL ? "DragHL" : "Drag"].full(ctxos);
  }
}

function drawHold(note, realTime) {
  if (app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
  const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
  const nsr = app.noteScaleRatio * (note.size || 1);
  if (!note.visible || note.realTime + note.realHoldTime < realTime) return; //qwq
  ctxos.globalAlpha =
    note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
  if (main.qwqwq)
    ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0);
  ctxos.setTransform(
    nsr * note.cosr,
    nsr * note.sinr,
    -nsr * note.sinr,
    nsr * note.cosr,
    note.offsetX,
    note.offsetY
  );
  const baseLength = (app.scaleY / nsr) * note.speed * app.speed;
  const holdLength = baseLength * note.realHoldTime;
  if (note.realTime > realTime) {
    noteRender.note[HL ? "HoldHeadHL" : "HoldHead"].head(ctxos);
    noteRender.note[HL ? "HoldHL" : "Hold"].body(
      ctxos,
      -holdLength,
      holdLength
    );
  } else {
    noteRender.note[HL ? "HoldHL" : "Hold"].body(
      ctxos,
      -holdLength,
      holdLength - baseLength * (realTime - note.realTime)
    );
  }
  noteRender.note["HoldEnd"].tail(ctxos, -holdLength);
}

function drawFlick(note) {
  if (app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
  const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
  const nsr = app.noteScaleRatio * (note.size || 1);
  if (!note.visible || (note.scored && !note.badtime)) return;
  ctxos.setTransform(
    nsr * note.cosr,
    nsr * note.sinr,
    -nsr * note.sinr,
    nsr * note.cosr,
    note.offsetX,
    note.offsetY
  );
  if (note.badtime);
  else {
    ctxos.globalAlpha =
      note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
    if (main.qwqwq)
      ctxos.globalAlpha *= Math.max(1 + (timeChart - note.realTime) / 1.5, 0);
    noteRender.note[HL ? "FlickHL" : "Flick"].full(ctxos);
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
/**@type {Map<ImageBitmap,LineImage>} */
const lineImages = new Map();
class LineImage {
  /**@param {ImageBitmap} image */
  constructor(image) {
    this.image = image;
    this.imageFC = null;
    this.imageAP = null;
    this.imageMP = null;
  }
  async getFC() {
    if (!this.imageFC) this.imageFC = await imgShader(this.image, "#a2eeff");
    return this.imageFC;
  }
  async getAP() {
    if (!this.imageAP) this.imageAP = await imgShader(this.image, "#a3ffac");
    return this.imageAP;
  }
  async getMP() {
    if (!this.imageMP) this.imageMP = await imgShader(this.image, "#feffa9");
    return this.imageMP;
  }
}
//byte转人类可读
function bytefm(byte = 0) {
  if (byte < 1024) return `${byte}B`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}KB`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}MB`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}GB`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}TB`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}PB`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}EB`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}ZB`;
  byte /= 1024;
  if (byte < 1024) return `${byte.toFixed(2)}YB`;
  byte /= 1024;
  return `${byte}BB`;
}
//html交互(WIP)
$id("select-note-scale").addEventListener("change", (evt) =>
  app.setNoteScale(evt.target.value)
);
$id("select-background-dim").addEventListener(
  "change",
  (evt) => (app.brightness = Number(evt.target.value))
);
$id("highLight").addEventListener(
  "change",
  (evt) => (app.multiHint = evt.target.checked)
);
const selectbg = $id("select-bg");
const btnPlay = $id("btn-play");
const btnPause = $id("btn-pause");
const selectbgm = $id("select-bgm");
const selectchart = $id("select-chart");
const selectflip = $id("select-flip");
selectflip.addEventListener("change", (evt) => {
  app.mirrorView(evt.target.value);
});
const selectspeed = $id("select-speed");
selectspeed.addEventListener("change", (evt) => {
  const dict = { Slowest: -9, Slower: -4, "": 0, Faster: 3, Fastest: 5 };
  app.speed = 2 ** (dict[evt.target.value] / 12);
});
const inputName = $id("input-name");
const inputArtist = $id("input-artist");
const inputCharter = $id("input-charter");
const inputIllustrator = $id("input-illustrator");
const selectDifficulty = $id("select-difficulty");
const selectLevel = $id("select-level");
const updateLevelText = (type) => {
  const diffString = selectDifficulty.value || "SP";
  const levelString = selectLevel.value || "?";
  return [diffString, levelString].join("\u2002Lv.");
};
function updateLevelTextOut(i) {
  levelText = updateLevelText(i);
}
updateLevelText();
selectDifficulty.addEventListener(
  "change",
  () => (levelText = updateLevelText(0))
);
selectLevel.addEventListener("change", () => (levelText = updateLevelText(1)));
$id("select-volume").addEventListener("change", (evt) => {
  const volume = Number(evt.target.value);
  app.musicVolume = Math.min(1, 1 / volume);
  app.soundVolume = Math.min(1, volume);
  Promise.resolve().then(qwqPause).then(qwqPause);
});
// TODO
const lowRes = $id("lowRes");
const maxFrame = $id("maxFrame");
const isMaxFrame = $id("isMaxFrame");
const isForcedMaxFrame = $id("isForcedMaxFrame");
const enableVP = $id("enableVP");
const enableFR = $id("enableFR");
enableVP.addEventListener(
  "change",
  (evt) => (app.enableVP = evt.target.checked)
);
enableFR.addEventListener(
  "change",
  (evt) => (app.enableFR = evt.target.checked)
);
app.playMode = 0;
const showTransition = $id("showTransition");
lowRes.addEventListener("change", (evt) => {
  app.setLowResFactor(evt.target.checked ? window.devicePixelRatio < 2 ? 0.85 : 0.5 : 1);
});
selectbg.onchange = () => {
  //qwq
  app.bgImage = bgs.get(selectbg.value);
  app.bgImageBlur = bgsBlur.get(selectbg.value);
  stage.resize();
};
maxFrame.addEventListener("change", function () {
  if (this.value < 25) shared.game.ptmain.gameConfig.maxFrame = 25;
  if (this.value > 1000) shared.game.ptmain.gameConfig.maxFrame = 1000;
  frameAnimater.setFrameRate(shared.game.ptmain.gameConfig.maxFrame, shared.game.ptmain.gameConfig.isForcedMaxFrame);
});
isMaxFrame.addEventListener("change", function () {
  frameAnimater.setFrameRate(this.checked ? maxFrame.value : 0, shared.game.ptmain.gameConfig.isForcedMaxFrame);
});
isForcedMaxFrame.addEventListener("change", function () {
  frameAnimater.setFrameRate(isMaxFrame.checked ? maxFrame.value : 0, this.checked);
});
//play
emitter.addEventListener(
  "change",
  /** @this {Emitter} */ function () {
    canvas.classList.toggle("fade", this.eq("stop"));
    btnPlay.value = this.eq("stop") ? "播放" : "停止";
    btnPause.value = this.eq("pause") ? "继续" : "暂停";
    btnPause.classList.toggle("disabled", this.eq("stop"));
    for (const i of $$(".disabled-when-playing"))
      i.classList.toggle("disabled", this.ne("stop"));
    if (this.eq("play")) {
      if (!app.isFull && !shared.game.ptmain.gameConfig.allowNonFullscreen) doFullScreen();
      app.playMode = (shared.game.ptmain.gameConfig.autoplay && shared.game.ptmain.gameConfig.account && shared.game.ptmain.gameConfig.account.userBasicInfo.isPTDeveloper) || shared.game.ptmain.playConfig.mode === "preview" ? 1 : 0;
    }
    // console.log(this);
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
status2.reg(emitter, "change", (_) => (main.qwqwq ? "Reversed" : "")); //qwq
status2.reg(
  selectflip,
  "change",
  (target) => ["", "FlipX", "FlipY", "FlipX&Y"][target.value]
);
status2.reg(selectspeed, "change", (target) => target.value);
status2.reg(emitter, "change", (/** @type {Emitter} */ target) =>
  target.eq("pause") ? "Paused" : ""
);
async function qwqStop() {
  if (emitter.eq("stop")) {
    if (!selectchart.value) return msgHandler.sendError(shared.game.i18n.t("simphi.playErr.noChartSelected"));
    if (!selectbgm.value) return msgHandler.sendError(shared.game.i18n.t("simphi.playErr.noMusicSelected"));
    app.stage.style.display = "block";
    for (const i of main.before.values()) await i();
    audio.play(res["mute"], { loop: true, isOut: false }); //播放空音频(避免音画不同步)
    app.prerenderChart(main.modify(charts.get(selectchart.value))); //fuckqwq
    const md5 = chartsMD5.get(selectchart.value);
    stat.level = Number(levelText.match(/\d+$/));
    stat.reset(app.chart.numOfNotes, md5, selectspeed.value);
    await loadLineData();
    app.bgImage = bgs.get(selectbg.value) || res["NoImageWhite"];
    app.bgImageBlur = bgsBlur.get(selectbg.value) || res["NoImageWhite"];
    const bgm = bgms.get(selectbgm.value);
    app.bgMusic = bgm.audio;
    app.bgVideo = bgm.video;
    duration = app.bgMusic.duration / app.speed;
    isInEnd = false;
    isOutStart = false;
    isOutEnd = false;
    timeBgm = 0;
    if (!showTransition.checked) qwqIn.addTime(3e3);
    stage.resize();
    frameAnimater.start();
    qwqIn.play();
    interact.activate();
    emitter.emit("play");
  } else {
    emitter.emit("stop");
    interact.deactive();
    audio.stop();
    frameAnimater.stop();
    //清除原有数据
    fucktemp1 = false;
    fucktemp2 = null;
    if (app.pauseNextTick)
      clearInterval(app.pauseNextTick),
        (app.pauseTime = 0),
        (app.pauseNextTick = null);
    hitFeedbackList.clear();
    hitImageList.clear();
    hitWordList.clear();
    qwqIn.reset();
    qwqOut.reset();
    qwqEnd.reset();
    curTime = 0;
    curTime_ms = 0;
    duration = 0;
    for (const i of main.end.values()) await i();
  }
}
async function loadLineData() {
  for (const i of app.lines) {
    i.imageW = 6220.8; //1920
    i.imageH = 7.68; //3
    i.imageL = [res["JudgeLine"], res["JudgeLineMP"], null, res["JudgeLineFC"]];
    i.imageS = 1; //2.56
    i.imageA = 1; //1.5625
    i.imageD = false;
    i.imageC = true;
    i.imageU = true;
  }
  for (const i of chartLineData) {
    if (selectchart.value === i.Chart) {
      if (!app.lines[i.LineId]) {
        msgHandler.sendWarning(shared.game.i18n.t("simphi.playErr.judgeLineDoesentExist", [ i.LineId ]));
        continue;
      }
      if (!bgs.has(i.Image)) msgHandler.sendWarning(shared.game.i18n.t("simphi.playErr.imageDoesentExist", [ i.image ]));
      /** @type {ImageBitmap} */
      const image = bgs.get(i.Image) || res["NoImageBlack"];
      app.lines[i.LineId].imageW = image.width;
      app.lines[i.LineId].imageH = image.height;
      if (!lineImages.has(image)) lineImages.set(image, new LineImage(image));
      const lineImage = lineImages.get(image);
      app.lines[i.LineId].imageL = [
        image,
        await lineImage.getMP(),
        await lineImage.getAP(),
        await lineImage.getFC(),
      ];
      app.lines[i.LineId].isCustomImage = bgs.get(i.Image) ? true: false;
      if (isFinite((i.Vert = parseFloat(i.Vert)))) {
        //Legacy
        app.lines[i.LineId].imageS = (Math.abs(i.Vert) * 1080) / image.height;
        app.lines[i.LineId].imageU = i.Vert > 0;
      }
      if (isFinite((i.Horz = parseFloat(i.Horz))))
        app.lines[i.LineId].imageA = i.Horz; //Legacy
      if (isFinite((i.IsDark = parseFloat(i.IsDark))))
        app.lines[i.LineId].imageD = !!i.IsDark; //Legacy
      if (isFinite((i.Scale = parseFloat(i.Scale))))
        app.lines[i.LineId].imageS = i.Scale;
      if (isFinite((i.Aspect = parseFloat(i.Aspect))))
        app.lines[i.LineId].imageA = i.Aspect;
      if (isFinite((i.UseBackgroundDim = parseFloat(i.UseBackgroundDim))))
        app.lines[i.LineId].imageD = !!i.UseBackgroundDim;
      if (isFinite((i.UseLineColor = parseFloat(i.UseLineColor))))
        app.lines[i.LineId].imageC = !!i.UseLineColor;
      if (isFinite((i.UseLineScale = parseFloat(i.UseLineScale))))
        app.lines[i.LineId].imageU = !!i.UseLineScale;
    }
  }
}
async function qwqPause() {
  if (btnPause.classList.contains("disabled") || !tmps.canPause) return;
  if (emitter.eq("stop") || fucktemp1) return;
  btnPause.classList.add("disabled");
  if (emitter.eq("play")) {
    if (app.bgVideo) app.bgVideo.pause();
    app.pauseBackgroundDimPara1 = null;
    qwqIn.pause();
    if (showTransition.checked && isOutStart) qwqOut.pause();
    curTime = timeBgm;
    audio.stop();
    emitter.emit("pause");
    btnPause.classList.remove("disabled");
  } else {
    if (shared.game.ptmain.playConfig.mode === "preview") {
      clearInterval(app.pauseNextTick);
      if (app.bgVideo) await playVideo(app.bgVideo, timeBgm * app.speed);
      qwqIn.play();
      if (showTransition.checked && isOutStart) qwqOut.play();
      if (isInEnd && !isOutStart) playBgm(app.bgMusic, timeBgm * app.speed);
      // console.log(app.bgVideo);
      emitter.emit("play");
      btnPause.classList.remove("disabled");
      return;
    }
    app.pauseTime = 3;
    app.pauseBackgroundDimPara1 = performance.now();
    app.pauseNextTick = setInterval(async () => {
      app.pauseTime--;
      if (app.pauseTime <= 0) {
        app.pauseTime = 0;
        clearInterval(app.pauseNextTick);
        app.pauseNextTick = null;
        app.pauseBackgroundDimPara1 = Infinity;
        if (!shared.game.ptmain.gameConfig.reviewWhenResume || curTime <= 3) {
          if (app.bgVideo) await playVideo(app.bgVideo, timeBgm * app.speed);
          qwqIn.play();
          if (showTransition.checked && isOutStart) qwqOut.play();
          if (isInEnd && !isOutStart) playBgm(app.bgMusic, timeBgm * app.speed);
          // console.log(app.bgVideo);
          emitter.emit("play");
        }
        btnPause.classList.remove("disabled");
      }
    }, 1000);
    if (shared.game.ptmain.gameConfig.reviewWhenResume && curTime > 3) {
      if (curTime > 3) timeBgm = curTime -= 3;
      if (app.bgVideo) await playVideo(app.bgVideo, timeBgm * app.speed);
      qwqIn.play();
      if (showTransition.checked && isOutStart) qwqOut.play();
      if (isInEnd && !isOutStart) playBgm(app.bgMusic, timeBgm * app.speed);
      // console.log(app.bgVideo);
      emitter.emit("play");
      btnPause.classList.add("disabled");
    }
  }
}
main.stat = stat;
export var hook = (self.hook = main);
const flag0 = 'flag{\x71w\x71}';
hook.before.set(flag0, () => {
  const md5 = hook.chartsMD5.get(hook.selectchart.value);
  const hashDF = ['cdb5987ad81b70e3dc96153af2efaa61', '86d23af0cc595a703241536a2d29ee4b', 'f5f8c244d317006103b67e1cdf6eb85b', '0e8ff64e65bf35382e30f980b5eec041'];
  const hashD321 = ['4ddcd5d923007d661911989e79fe8a59'];
  if (md5 === 'ab9d2cc3eb569236ead459ad4caba109') hook.now.set(flag0, loadModYukiOri());
  else if (hashDF.includes(md5) && inputName.value === 'Distorted Fate ') import('./plugins/demo/DFLevelEffect.js').then(({ loadMod }) => hook.now.set(flag0, loadMod()));
  else if (hashD321.includes(md5) && inputName.value === 'DESTRUCTION 3,2,1 ') import('./plugins/demo/321LevelEffect.js').then(({ loadMod }) => hook.now.set(flag0, loadMod()));
  else hook.now.delete(flag0);
});

function loadModYukiOri() {
  console.log('好耶');
  const analyser = hook.audio.actx.createAnalyser();
  analyser.fftSize = 4096;
  // analyser.minDecibels = -180;
  const getFreq = () => {
    // progress变为频谱图
    const bufferLength = analyser.frequencyBinCount;
    const freq = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(freq);
    const avg = freq.reduce((a, b) => a + b) / bufferLength;
    return Math.min(1, avg / 255 * 2.15); // FIXME: more accurate formula
  };
  let flagMusic = null;
  let flagPerfect = NaN;
  let flagGood = NaN;
  let flagBad = NaN;
  let flagEm = '';
  let flagN = false;
  const setFlag = (flag, em, n) => {
    flagEm = em;
    flagN = n;
    return flag;
  };
  return time => {
    const time1 = time * 1.95;
    const bgMusic = hook.tmps.bgMusic();
    if (bgMusic && bgMusic !== flagMusic) {
      bgMusic.connect(analyser); // ?
      flagMusic = bgMusic;
    }
    if (time1 < 168) {
      hook.stat.numOfNotes = 305;
      hook.tmps.level = 'lN\u2002Lv.I2';
      hook.tmps.progress = time1 / 218;
    } else if (time1 < 169) {
      const progress = 1 - (169 - time1) ** 3; // easeCubicOut
      hook.stat.numOfNotes = 305 + 2195 * progress | 0;
      hook.tmps.progress = getFreq();
    } else {
      hook.stat.numOfNotes = 2500;
      hook.tmps.progress = getFreq();
    }
    if (time1 > 325 && time1 < 358) {
      // 监听判定变化
      const statusP = hook.stat.perfect;
      const statusG = hook.stat.good;
      const statusB = hook.stat.bad;
      if (isNaN(flagPerfect)) flagPerfect = statusP;
      if (isNaN(flagGood)) flagGood = statusG;
      if (isNaN(flagBad)) flagBad = statusB;
      if (statusP !== flagPerfect) flagPerfect = setFlag(statusP, '\uff2f(\u2267\u25bd\u2266)\uff2f', true);
      else if (statusG !== flagGood) flagGood = setFlag(statusG, '(\uff3e\u03c9\uff3e)', true);
      else if (statusB !== flagBad) flagBad = setFlag(statusB, '(\u2299\ufe4f\u2299;)', true);
      // 监听时间变化
      if (time1 < 327) setFlag(null, '(\u2299o\u2299)', false);
      else if (time1 > 334 && time1 < 335) setFlag(null, '(\u2299o\u2299)', false);
      else if (time1 > 342 && time1 < 343) setFlag(null, '(\u2299o\u2299)', false);
      else if (time1 > 350 && time1 < 351) setFlag(null, '(\u2299o\u2299)', false);
      else if (!flagN) flagEm = '(\u2299ω\u2299)';
      hook.tmps.combo = flagEm;
    }
  };
}

//plugin(filter)
const enableFilter = $id("enableFilter");
(function () {
  const input = $id("filterInput");
  input.addEventListener("change", async function () {
    if (!input.value) return;
    const filter = await import("@utils/js/filter.js");
    try {
      const filter0 = new filter.default(input.value);
      main.filter = (ctx, time, now) => {
        filter0.apply(ctx.canvas);
        ctx.drawImage(filter0.getImage(time, now, hook.filterOptions), 0, 0);
      };
    } catch (e) {
      console.error(e);
      main.filter = null;
    }
  });
  enableFilter.addEventListener("change", function () {
    if (!this.checked) main.filter = null;
    else input.dispatchEvent(new Event("change"));
  });
  enableFilter.dispatchEvent(new Event("change"));
})();

//debug
main.stat = stat;
main.app = app;
main.res = res;
main.audio = audio;
main.msgHandler = msgHandler;
main.frameAnimater = frameAnimater;
main.qwqEnd = qwqEnd;
main.bgms = bgms;
// main.inputName = inputName;
main.oriBuffers = oriBuffers;
main.selectbgm = selectbgm;
main.selectchart = selectchart;
main.chartsMD5 = chartsMD5;
// shared.game.simphi.chartsMD5 = main.chartsMD5;
// shared.game.simphi.selectchart = main.selectchart;
main.noteRender = noteRender;
main.ZipReader = ZipReader;
main.tmps = tmps;
main.qwq = qwq;
main.qwqwq = false;
main.pause = () => emitter.eq("play") && qwqPause();
shared.game.simphiPlugins = { videoRecorder };
Object.defineProperty(main, "time", {
  get: () => timeBgm,
  set: async (v) => {
    if (emitter.eq("stop") || fucktemp1) return;
    const isPlaying = emitter.eq("play");
    if (isPlaying) await qwqPause();
    curTime = timeBgm = v;
    // app.notes.forEach(a => { a.status = 0;
    // 	a.scored = 0;
    // 	a.holdStatus = 1; });
    // stat.reset();
    if (isPlaying) await qwqPause();
  },
});

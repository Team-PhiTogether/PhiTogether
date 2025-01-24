// import { replayMgr } from "@components/recordMgr/replayMgr.js";
import shared from "@utils/js/shared.js";
import ptdb from "@utils/ptdb";
import { Stat } from "./components/Stat";

class Renderer {
    constructor(stage) {
        if (!(stage instanceof HTMLDivElement)) throw new Error("Not a container");
        this.stage = stage;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d", { alpha: false }); //游戏界面(alpha:false会使Firefox显示异常/需要验证)
        this.canvasos = document.createElement("canvas"); //绘制游戏主界面(OffscreenCanvas会使Safari崩溃)
        this.ctxos = this.canvasos.getContext("2d");
        this.stage.appendChild(this.canvas);
        this.canvas.style.cssText = ";position:absolute;top:0px;left:0px;right:0px;bottom:0px;";
        this.isFull = false;
        console.log("Hello, PhiTogether(extended from lchzh3473/sim-phi)!");
        //qwq
        this.speed = 1;
        // this.config = {};
        this.chart = {};
        // this.music = {};
        // this.background = {};
        // this.width = 1920;
        // this.height = 1080;
        this.lineScale = 57.6;
        this.noteScale = 1.15; //note缩放设定值
        this.noteScaleRatio = 8e3; //note缩放比率，由noteScale计算而来
        this.brightness = 0.6;
        this.lastRatio = null;
        // this.songName = '';
        // this.chartLevel = '';
        // this.illustrator = '';
        // this.chartDesign = '';
        // this.feedback = true;
        // this.imageBlur = true;
        this.multiHint = true;
        // this.hitSound = true;
        // this.anchorPoint = false;
        // this.coloredLine = true;
        // this.perfectLine = '#feffa9';
        // this.goodLine = '#a2eeff';
        // this.perfectNote = '#ffeca0';
        // this.goodNote = '#b4e1ff';
        // this.badNote = '#6c4343';
        this.playMode = 1; //0:game,1:auto,2:hyper,3:auto&hyper
        this.musicVolume = 1;
        this.soundVolume = 1;
        // this.showTransition = true;
        // this.chartOffset = 0;
        this._mirrorType = 0;
        this.enableFR = false;
        this.enableVP = false;
        //qwq
        this.chart = null;
        this.bgImage = null;
        this.bgImageBlur = null;
        this.bgMusic = null;
        this.bgVideo = null;
        /** @type {JudgelineExtends[]} */
        this.lines = [];
        /** @type {NoteExtends[]} */
        this.notes = [];
        /** @type {NoteExtends[]} */
        this.taps = [];
        /** @type {NoteExtends[]} */
        this.drags = [];
        /** @type {NoteExtends[]} */
        this.flicks = [];
        /** @type {NoteExtends[]} */
        this.holds = [];
        /** @type {JudgelineExtends[]} */
        this.linesReversed = [];
        /** @type {NoteExtends[]} */
        this.notesReversed = [];
        /** @type {NoteExtends[]} */
        this.tapsReversed = [];
        /** @type {NoteExtends[]} */
        this.dragsReversed = [];
        /** @type {NoteExtends[]} */
        this.flicksReversed = [];
        /** @type {NoteExtends[]} */
        this.holdsReversed = [];
        /** @type {NoteExtends[]} */
        this.tapholds = [];

        //qwq2
        this._setLowResFactor(1);
        this.resizeCanvas();
    }
    init(options) {
        /*const _this = this;
    Object.assign(_this, options);*/
    }
    //config
    setNoteScale(num) {
        this.noteScale = Number(num) || 1;
        this.noteScaleRatio = (this.canvasos.width * this.noteScale) / 8080; //note、特效缩放
    }
    _setLowResFactor(num) {
        this.lowResFactor = num * self.devicePixelRatio;
    }
    setLowResFactor(num) {
        this._setLowResFactor(Number(num) || 1);
        this._resizeCanvas();
    }
    _resizeCanvas() {
        const pt = shared.game.ptmain;
        const { canvas, canvasos, width, height } = this;
        const widthLowRes = width * this.lowResFactor;
        const heightLowRes = height * this.lowResFactor;
        canvas.width = widthLowRes;
        canvas.height = heightLowRes;
        if (pt.aspectRatioComputed) {
            canvasos.height = widthLowRes / pt.aspectRatioComputed;
            canvasos.width = widthLowRes;
            if (canvasos.height > heightLowRes) {
                canvasos.height = heightLowRes;
                canvasos.width = heightLowRes * pt.aspectRatioComputed;
            }
        } else {
            canvasos.width = Math.min(widthLowRes, (heightLowRes * 16) / 9);
            if (canvas.width - canvasos.width === this.lowResFactor) canvasos.width = canvas.width;
            canvasos.height = heightLowRes;
        }

        this.wlen = canvasos.width / 2;
        this.hlen = canvasos.height / 2;
        this.mirrorView();
        this.setNoteScale(this.noteScale);
        this.lineScale =
            canvasos.width > canvasos.height * 0.75
                ? canvasos.height / 18.75
                : canvasos.width / 14.0625; //判定线、文字缩放
    }
    resizeCanvas() {
        const pt = shared.game.ptmain;
        const { clientWidth: width, clientHeight: height } = this.stage;
        if (
            this.width === width &&
            this.height === height &&
            pt.aspectRatioComputed === this.lastRatio
        )
            return;
        this.lastRatio = pt.aspectRatioComputed;
        this.width = width;
        this.height = height;
        this.canvas.style.cssText += `;width:${width}px;height:${height}px;top:0px;`; //只有inset还是会溢出
        this._resizeCanvas();
    }
    mirrorView(code = this._mirrorType) {
        const n = (this._mirrorType = 3 & code);
        this.transformView(1 & n ? -1 : 1, 2 & n ? -1 : 1, 0, 0);
        return code;
    }
    transformView(scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0) {
        const { canvasos } = this;
        const xa = canvasos.width * scaleX;
        const xb = (canvasos.width - xa) * 0.5;
        const ya = -canvasos.height * scaleY;
        const yb = (canvasos.height - ya) * 0.5;
        const ra = (-Math.sign(scaleX * scaleY) * Math.PI) / 180;
        const rb = scaleY > 0 ? 0 : Math.PI;
        const tx = Math.sign(scaleY) * xa * 0.05625;
        const ty = Math.sign(scaleY) * -ya * 0.6; //控制note流速
        this.matX = x => xb + xa * (x - offsetX);
        this.matY = y => yb + ya * (y - offsetY);
        this.matR = r => rb + ra * r;
        this.scaleX = tx;
        this.scaleY = ty;
    }
    //note预处理
    prerenderChart(chart) {
        this.lines.length = 0;
        this.notes.length = 0;
        this.taps.length = 0;
        this.drags.length = 0;
        this.flicks.length = 0;
        this.holds.length = 0;
        this.tapholds.length = 0;
        const chartNew = new Chart(chart);
        let maxTime = 0;
        //添加realTime
        const addRealTime = (events, bpm) => {
            for (const i of events) {
                i.startRealTime = (i.startTime / bpm) * 1.875;
                i.endRealTime = (i.endTime / bpm) * 1.875;
                if (i.startTime > 1 - 1e6 && i.startRealTime > maxTime) maxTime = i.startRealTime;
                if (i.endTime < 1e9 && i.endRealTime > maxTime) maxTime = i.endRealTime;
            }
        };
        //向Renderer添加Note
        /** @param {NoteExtends} note */
        const addNote = (note, beat32, line, noteId, isAbove) => {
            note.offsetX = 0;
            note.offsetY = 0;
            note.alpha = 0;
            note.realTime = note.time * beat32;
            note.realHoldTime = note.holdTime * beat32;
            note.line = line;
            note.lineId = line.lineId;
            note.noteId = noteId;
            note.isAbove = isAbove;
            note.name = `${line.lineId}${isAbove ? "+" : "-"}${noteId}${"?tdhf"[note.type]}`;
            this.notes.push(note);
            if (note.type === 1) this.taps.push(note);
            else if (note.type === 2) this.drags.push(note);
            else if (note.type === 3) this.holds.push(note);
            else if (note.type === 4) this.flicks.push(note);
            if (note.type === 1 || note.type === 3) this.tapholds.push(note);
        };
        const sortNote = (a, b) =>
            a.realTime - b.realTime || a.lineId - b.lineId || a.noteId - b.noteId;
        //优化events
        chartNew.judgeLineList.forEach((i, lineId) => (i.lineId = lineId));
        for (const i of chartNew.judgeLineList) {
            i.bpm *= this.speed;
            i.offsetX = 0;
            i.offsetY = 0;
            i.alpha = 0;
            i.rotation = 0;
            i.positionY = 0; //临时过渡用
            i.speedEvents = normalizeSpeedEvent(i.speedEvents);
            i.judgeLineDisappearEvents = normalizeLineEvent(i.judgeLineDisappearEvents);
            i.judgeLineMoveEvents = normalizeLineEvent(i.judgeLineMoveEvents);
            i.judgeLineRotateEvents = normalizeLineEvent(i.judgeLineRotateEvents);
            i.judgeLineColorEvents = normalizeLineEvent(i.judgeLineColorEvents || []);
            i.judgeLineTextEvents = normalizeLineEvent(i.judgeLineTextEvents || []);
            i.judgeLineScaleXEvents = normalizeLineEvent(i.judgeLineScaleXEvents || []);
            i.judgeLineScaleYEvents = normalizeLineEvent(i.judgeLineScaleYEvents || []);
            addRealTime(i.speedEvents, i.bpm);
            addRealTime(i.judgeLineDisappearEvents, i.bpm);
            addRealTime(i.judgeLineMoveEvents, i.bpm);
            addRealTime(i.judgeLineRotateEvents, i.bpm);
            addRealTime(i.judgeLineColorEvents, i.bpm);
            addRealTime(i.judgeLineTextEvents, i.bpm);
            addRealTime(i.judgeLineScaleXEvents, i.bpm);
            addRealTime(i.judgeLineScaleYEvents, i.bpm);
            this.lines.push(i); //qwq可以定义新类避免函数在循环里定义
            i.notesAbove.forEach((j, noteId) => addNote(j, 1.875 / i.bpm, i, noteId, true));
            i.notesBelow.forEach((j, noteId) => addNote(j, 1.875 / i.bpm, i, noteId, false));
        }
        this.notes.sort(sortNote);
        this.taps.sort(sortNote);
        this.drags.sort(sortNote);
        this.holds.sort(sortNote);
        this.flicks.sort(sortNote);
        this.notesReversed = this.notes.slice().reverse();
        this.tapsReversed = this.taps.slice().reverse();
        this.dragsReversed = this.drags.slice().reverse();
        this.holdsReversed = this.holds.slice().reverse();
        this.flicksReversed = this.flicks.slice().reverse();
        this.linesReversed = this.lines.slice().reverse();
        this.tapholds.sort(sortNote);
        //多押标记
        const timeOfMulti = {};
        for (const i of this.notes)
            timeOfMulti[i.realTime.toFixed(6)] = timeOfMulti[i.realTime.toFixed(6)] ? 2 : 1;
        for (const i of this.notes) i.isMulti = timeOfMulti[i.realTime.toFixed(6)] === 2;
        //分析邻近Note(0.01s内标记，用于预处理Flick,TapHold重叠判定)
        for (let i = 0; i < this.flicks.length; i++) {
            const note = this.flicks[i];
            note.nearNotes = [];
            for (let j = i + 1; j < this.flicks.length; j++) {
                const note2 = this.flicks[j];
                if (Math.fround(note2.realTime - note.realTime) > 0.01) break;
                note.nearNotes.push(note2);
            }
        }
        for (let i = 0; i < this.tapholds.length; i++) {
            const note = this.tapholds[i];
            note.nearNotes = [];
            for (let j = i + 1; j < this.tapholds.length; j++) {
                const note2 = this.tapholds[j];
                if (Math.fround(note2.realTime - note.realTime) > 0.01) break;
                note.nearNotes.push(note2);
            }
        }
        this.chart = chartNew;
    }
    updateByTime(timeChart) {
        for (const line of this.lines) {
            for (const i of line.judgeLineDisappearEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                const dt = (timeChart - i.startRealTime) / (i.endRealTime - i.startRealTime);
                line.alpha = i.start + (i.end - i.start) * dt;
            }
            for (const i of line.judgeLineMoveEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                const dt = (timeChart - i.startRealTime) / (i.endRealTime - i.startRealTime);
                line.realX = i.start + (i.end - i.start) * dt;
                line.realY = i.start2 + (i.end2 - i.start2) * dt;
                line.offsetX = this.matX(line.realX);
                line.offsetY = this.matY(line.realY);
            }
            for (const i of line.judgeLineRotateEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                const dt = (timeChart - i.startRealTime) / (i.endRealTime - i.startRealTime);
                line.rotation = this.matR(i.start + (i.end - i.start) * dt);
                line.cosr = Math.cos(line.rotation);
                line.sinr = Math.sin(line.rotation);
            }
            for (const i of line.judgeLineColorEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                const dt = (timeChart - i.startRealTime) / (i.endRealTime - i.startRealTime);
                line.color =
                    i.start == 0 || i.end == 0
                        ? null
                        : rgb2hex(
                              i.start.split(",").map((start, index) => {
                                  start = Number(start);
                                  const end = Number(i.end.split(",")[index]);
                                  return Math.round(start + dt * (end - start));
                              })
                          );
            }
            for (const i of line.judgeLineTextEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                if (i.start && (i.start.includes("%P%") || i.end.includes("%P%"))) {
                    const dt = (timeChart - i.startRealTime) / (i.endRealTime - i.startRealTime);
                    const startNum = Number(i.start.replace("%P%", ""));
                    const endNum = Number(i.end.replace("%P%", ""));
                    if (isNaN(startNum) || isNaN(endNum)) line.text = i.start || null;
                    else {
                        line.text = (startNum + dt * (endNum - startNum)).toFixed(
                            i.start.includes(".") || i.end.includes(".") ? 3 : 0
                        );
                    }
                } else line.text = i.start || null;
            }
            for (const i of line.judgeLineScaleXEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                const dt = (timeChart - i.startRealTime) / (i.endRealTime - i.startRealTime);
                line.scaleX = i.start + dt * (i.end - i.start);
            }
            for (const i of line.judgeLineScaleYEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                const dt = (timeChart - i.startRealTime) / (i.endRealTime - i.startRealTime);
                line.scaleY = i.start + dt * (i.end - i.start);
            }
            for (const i of line.speedEvents) {
                if (timeChart < i.startRealTime) break;
                if (timeChart > i.endRealTime) continue;
                line.positionY =
                    (timeChart - i.startRealTime) * i.value * this.speed +
                    (this.enableFR ? i.floorPosition2 : i.floorPosition);
            }
            const realgetY = i => {
                if (i.type !== 3) return (i.floorPosition - line.positionY) * i.speed;
                if (i.realTime < timeChart) return (i.realTime - timeChart) * i.speed * this.speed;
                return i.floorPosition - line.positionY;
            };
            const getY = i => {
                if (!i.badtime) return realgetY(i);
                if (performance.now() - i.badtime > 500) delete i.badtime;
                if (!i.badY) i.badY = realgetY(i);
                return i.badY;
            };
            const setAlpha = (i, dx, dy) => {
                i.projectX = line.offsetX + dx * i.cosr;
                i.offsetX = i.projectX + dy * i.sinr;
                i.projectY = line.offsetY + dx * i.sinr;
                i.offsetY = i.projectY - dy * i.cosr;
                i.visible =
                    i.realTime - i.visibleTime > timeChart
                        ? false
                        : i.line.alpha < -Number.EPSILON &&
                            (i.line.alpha * 255 >= -1 ||
                                (i.line.alpha * 255 >= -2 &&
                                    i.line.positionY * (i.isAbove ? -1 : 1) > 0))
                          ? false
                          : (i.offsetX - this.wlen) ** 2 + (i.offsetY - this.hlen) ** 2 <
                            (this.wlen * 1.23625 +
                                this.hlen +
                                this.scaleY * i.realHoldTime * i.speed * this.speed) **
                                2; //Math.hypot实测性能较低
                i.showPoint = false;
                if (i.badtime);
                else if (i.realTime > timeChart) {
                    i.showPoint = true;
                    i.alpha =
                        dy <= -1e-3 * this.scaleY || (this.enableVP && realgetY(i) * 0.6 > 2)
                            ? 0
                            : i.type === 3 && i.speed === 0
                              ? 0
                              : 1;
                } else {
                    i.frameCount = i.frameCount == null ? 0 : i.frameCount + 1;
                    if (i.type === 3) {
                        i.showPoint = true;
                        i.alpha = i.speed === 0 ? 0 : i.status % 4 === 2 ? 0.45 : 1;
                    } else i.alpha = Math.max(1 - (timeChart - i.realTime) / 0.16, 0); //过线后0.16s消失
                }
                i.alpha *= i.realAlpha;
            };
            for (const i of line.notesAbove) {
                i.cosr = line.cosr;
                i.sinr = line.sinr;
                setAlpha(i, this.scaleX * i.positionX, this.scaleY * getY(i));
            }
            for (const i of line.notesBelow) {
                i.cosr = -line.cosr;
                i.sinr = -line.sinr;
                setAlpha(i, -this.scaleX * i.positionX, this.scaleY * getY(i));
            }
        }
    }
}
//qwq
class Chart {
    constructor(chart) {
        chart = chart || {};
        this.formatVersion = parseInt(chart.formatVersion) || 0;
        // this.offset = getAdjustedOffset(chart);
        this.offset = parseFloat(chart.offset || 0);
        this.offsetBak = parseFloat(chart.offset) || 0;
        this.chartRPE = chart.chartRPE || null;
        this.chartPec = chart.chartPec || null;
        this.numOfNotes = parseInt(chart.numOfNotes) || 0;
        /** @type {JudgeLine[]} */
        this.judgeLineList = Array.isArray(chart.judgeLineList)
            ? chart.judgeLineList.map(i => new JudgeLine(i))
            : [];
        getAdjustedOffset(chart)
            .then(offset => (this.offset = offset))
            .catch(e => e);
    }
}
class JudgeLine {
    constructor(line) {
        line = line || {};
        this.numOfNotes = parseInt(line.numOfNotes) || 0;
        this.numOfNotesAbove = parseInt(line.numOfNotesAbove) || 0;
        this.numOfNotesBelow = parseInt(line.numOfNotesBelow) || 0;
        this.attachUI = line.attachUI;
        this.bpm = parseFloat(line.bpm) || 0;
        this.speed = 0;
        /** @type {SpeedEvent[]} */
        this.speedEvents = Array.isArray(line.speedEvents)
            ? line.speedEvents.map(i => new SpeedEvent(i))
            : [];
        /** @type {Note[]} */
        this.notesAbove = Array.isArray(line.notesAbove)
            ? line.notesAbove.map(i => new Note(i))
            : [];
        /** @type {Note[]} */
        this.notesBelow = Array.isArray(line.notesBelow)
            ? line.notesBelow.map(i => new Note(i))
            : [];
        /** @type {LineEvent[]} */
        this.judgeLineDisappearEvents = Array.isArray(line.judgeLineDisappearEvents)
            ? line.judgeLineDisappearEvents.map(i => new LineEvent(i))
            : [];
        /** @type {LineEvent[]} */
        this.judgeLineMoveEvents = Array.isArray(line.judgeLineMoveEvents)
            ? line.judgeLineMoveEvents.map(i => new LineEvent(i))
            : [];
        /** @type {LineEvent[]} */
        this.judgeLineRotateEvents = Array.isArray(line.judgeLineRotateEvents)
            ? line.judgeLineRotateEvents.map(i => new LineEvent(i))
            : [];
        /** @type {LineEvent[]} */
        this.judgeLineColorEvents = Array.isArray(line.judgeLineColorEvents)
            ? line.judgeLineColorEvents.map(i => new LineEvent(i))
            : [];
        /** @type {LineEvent[]} */
        this.judgeLineTextEvents = Array.isArray(line.judgeLineTextEvents)
            ? line.judgeLineTextEvents.map(i => new LineEvent(i))
            : [];
        /** @type {LineEvent[]} */
        this.judgeLineScaleXEvents = Array.isArray(line.judgeLineScaleXEvents)
            ? line.judgeLineScaleXEvents.map(i => new LineEvent(i))
            : [];
        /** @type {LineEvent[]} */
        this.judgeLineScaleYEvents = Array.isArray(line.judgeLineScaleYEvents)
            ? line.judgeLineScaleYEvents.map(i => new LineEvent(i))
            : [];
    }
}
class SpeedEvent {
    constructor(event) {
        event = event || {};
        this.startTime = parseInt(event.startTime) || 0;
        this.endTime = parseInt(event.endTime) || 0;
        this.value = parseFloat(event.value) || 0;
        this.floorPosition = parseFloat(event.floorPosition) || 0;
        this.floorPosition2 = parseFloat(event.floorPosition2) || 0;
    }
}
class Note {
    constructor(note) {
        note = note || {};
        this.type = parseInt(note.type) || 0;
        this.time = parseInt(note.time) || 0;
        this.isFake = note.isFake || false;
        this.visibleTime = parseFloat(note.visibleTime) || Infinity;
        this.positionX = parseFloat(note.positionX) || 0;
        this.holdTime = parseInt(note.holdTime) || 0;
        this.speed = parseFloat(note.speed) || 0;
        this.floorPosition = parseFloat(note.floorPosition) || 0;
        this.realAlpha = parseFloat(note.alpla || note.alpha === 0 ? note.alpha : 1);
        this.size = note.size || 1;
    }
}
class LineEvent {
    constructor(event) {
        event = event || {};
        this.startTime = parseInt(event.startTime) || 0;
        this.endTime = parseInt(event.endTime) || 0;
        this.start = typeof event.start === "string" ? event.start : parseFloat(event.start) || 0;
        this.end = typeof event.start === "string" ? event.end : parseFloat(event.end) || 0;
        this.start2 = parseFloat(event.start2) || 0;
        this.end2 = parseFloat(event.end2) || 0;
    }
}
//规范判定线事件
function normalizeLineEvent(events = []) {
    const oldEvents = events.map(i => new LineEvent(i)); //深拷贝
    if (!oldEvents.length) return [new LineEvent({ startTime: -999999, endTime: 1e9 })]; //如果没有事件，添加一个默认事件(以后添加warning)
    const newEvents = [
        new LineEvent({
            startTime: -999999,
            endTime: 0,
            start: oldEvents[0].start,
            end: oldEvents[0].start,
            start2: oldEvents[0].start2,
            end2: oldEvents[0].start2,
        }),
    ]; //以1-1e6开头
    oldEvents.push(
        new LineEvent({
            startTime: oldEvents[oldEvents.length - 1].endTime,
            endTime: 1e9,
            start: oldEvents[oldEvents.length - 1].end,
            end: oldEvents[oldEvents.length - 1].end,
            start2: oldEvents[oldEvents.length - 1].end2,
            end2: oldEvents[oldEvents.length - 1].end2,
        })
    ); //以1e9结尾
    for (const i2 of oldEvents) {
        //保证时间连续性
        if (i2.startTime > i2.endTime) continue;
        const i1 = newEvents[newEvents.length - 1];
        if (i1.endTime > i2.endTime);
        else if (i1.endTime === i2.startTime) newEvents.push(i2);
        else if (i1.endTime < i2.startTime)
            newEvents.push(
                new LineEvent({
                    startTime: i1.endTime,
                    endTime: i2.startTime,
                    start: i1.end,
                    end: i1.end,
                    start2: i1.end2,
                    end2: i1.end2,
                }),
                i2
            );
        else if (i1.endTime > i2.startTime)
            newEvents.push(
                new LineEvent({
                    startTime: i1.endTime,
                    endTime: i2.endTime,
                    start:
                        (i2.start * (i2.endTime - i1.endTime) +
                            i2.end * (i1.endTime - i2.startTime)) /
                        (i2.endTime - i2.startTime),
                    end: i1.end,
                    start2:
                        (i2.start2 * (i2.endTime - i1.endTime) +
                            i2.end2 * (i1.endTime - i2.startTime)) /
                        (i2.endTime - i2.startTime),
                    end2: i1.end2,
                })
            );
    }
    //合并相同变化率事件
    const newEvents2 = [newEvents.shift()];
    for (const i2 of newEvents) {
        const i1 = newEvents2[newEvents2.length - 1];
        const d1 = i1.endTime - i1.startTime;
        const d2 = i2.endTime - i2.startTime;
        if (i2.startTime === i2.endTime);
        else if (
            i1.end === i2.start &&
            i1.end2 === i2.start2 &&
            (i1.end - i1.start) * d2 === (i2.end - i2.start) * d1 &&
            (i1.end2 - i1.start2) * d2 === (i2.end2 - i2.start2) * d1
        ) {
            i1.endTime = i2.endTime;
            i1.end = i2.end;
            i1.end2 = i2.end2;
        } else newEvents2.push(i2);
    }
    return newEvents2;
}
//规范speedEvents
function normalizeSpeedEvent(events = []) {
    const newEvents = [];
    for (const i2 of events) {
        const i1 = newEvents[newEvents.length - 1];
        if (i1 && i1.value === i2.value) i1.endTime = i2.endTime;
        else newEvents.push(new SpeedEvent(i2));
    }
    return newEvents;
}
//导出json
function chartify(json) {
    const newChart = {
        formatVersion: 3,
        offset: json.offset,
        numOfNotes: json.numOfNotes,
        judgeLineList: [],
    };
    for (const i of json.judgeLineList) {
        const newLine = {
            numOfNotes: i.numOfNotes,
            numOfNotesAbove: i.numOfNotesAbove,
            numOfNotesBelow: i.numOfNotesBelow,
            bpm: i.bpm,
            speedEvents: [],
            notesAbove: [],
            notesBelow: [],
            judgeLineDisappearEvents: [],
            judgeLineMoveEvents: [],
            judgeLineRotateEvents: [],
        };
        for (const j of i.speedEvents) {
            if (j.startTime === j.endTime) continue;
            let newEvent = {};
            newEvent.startTime = j.startTime;
            newEvent.endTime = j.endTime;
            newEvent.value = Number(j.value.toFixed(6));
            newEvent.floorPosition = Number(j.floorPosition.toFixed(6));
            newLine.speedEvents.push(newEvent);
        }
        for (const j of i.notesAbove) {
            let newNote = {};
            newNote.type = j.type;
            newNote.time = j.time;
            newNote.positionX = Number(j.positionX.toFixed(6));
            newNote.holdTime = j.holdTime;
            newNote.speed = Number(j.speed.toFixed(6));
            newNote.floorPosition = Number(j.floorPosition.toFixed(6));
            newLine.notesAbove.push(newNote);
        }
        for (const j of i.notesBelow) {
            let newNote = {};
            newNote.type = j.type;
            newNote.time = j.time;
            newNote.positionX = Number(j.positionX.toFixed(6));
            newNote.holdTime = j.holdTime;
            newNote.speed = Number(j.speed.toFixed(6));
            newNote.floorPosition = Number(j.floorPosition.toFixed(6));
            newLine.notesBelow.push(newNote);
        }
        for (const j of i.judgeLineDisappearEvents) {
            if (j.startTime === j.endTime) continue;
            let newEvent = {};
            newEvent.startTime = j.startTime;
            newEvent.endTime = j.endTime;
            newEvent.start = Number(j.start.toFixed(6));
            newEvent.end = Number(j.end.toFixed(6));
            newEvent.start2 = Number(j.start2.toFixed(6));
            newEvent.end2 = Number(j.end2.toFixed(6));
            newLine.judgeLineDisappearEvents.push(newEvent);
        }
        for (const j of i.judgeLineMoveEvents) {
            if (j.startTime === j.endTime) continue;
            let newEvent = {};
            newEvent.startTime = j.startTime;
            newEvent.endTime = j.endTime;
            newEvent.start = Number(j.start.toFixed(6));
            newEvent.end = Number(j.end.toFixed(6));
            newEvent.start2 = Number(j.start2.toFixed(6));
            newEvent.end2 = Number(j.end2.toFixed(6));
            newLine.judgeLineMoveEvents.push(newEvent);
        }
        for (const j of i.judgeLineRotateEvents) {
            if (j.startTime === j.endTime) continue;
            let newEvent = {};
            newEvent.startTime = j.startTime;
            newEvent.endTime = j.endTime;
            newEvent.start = Number(j.start.toFixed(6));
            newEvent.end = Number(j.end.toFixed(6));
            newEvent.start2 = Number(j.start2.toFixed(6));
            newEvent.end2 = Number(j.end2.toFixed(6));
            newLine.judgeLineRotateEvents.push(newEvent);
        }
        newChart.judgeLineList.push(newLine);
    }
    return newChart;
}
function rgb2hex(rgb) {
    const validRGB = rgb.map(value => {
        if (typeof value !== "number" || value < 0 || value > 255) return 255;
        return value;
    });
    const hexValues = validRGB.map(value => {
        const hexValue = value.toString(16).toUpperCase();
        return hexValue.length === 1 ? "0" + hexValue : hexValue;
    });
    const hexColor = "#" + hexValues.join("");
    return hexColor;
}
function getAdjustedOffset(chart) {
    return new Promise(res => {
        ptdb.gameConfig
            .get("savedChartOffsets")
            .then(savedChartOffsets => {
                if (!savedChartOffsets || !chart.md5 || !savedChartOffsets[chart.md5])
                    res(parseFloat(chart.offset) || 0);
                res(parseFloat(savedChartOffsets[chart.md5]));
            })
            .catch(e => res(chart.offset || 0));
    });
}
export default { Stat, Renderer };

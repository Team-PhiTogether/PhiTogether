import shared from "@utils/js/shared.js";
import { rgb2hex } from "../utils/rgb2hex";

import { normalizeLineEvent, normalizeSpeedEvent } from "./Events";
import { Chart } from "./Chart";
import { JudgeLine, JudgelineExtends } from "./Chart/JudgeLine";
import { Note, NoteExtends } from "./Chart/Note";

export class Renderer {
    public stage: HTMLDivElement;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public canvasos: HTMLCanvasElement;
    public ctxos: CanvasRenderingContext2D;
    public isFull: boolean = false;
    public speed: number = 1;
    public chart: any = null;
    public lineScale: number = 57.6;
    public noteScale: number = 1.15;
    public noteScaleRatio: number = 8e3;
    public brightness: number = 0.6;
    public lastRatio: number | null = null;
    public multiHint: boolean = true;
    public playMode: number = 1;
    public musicVolume: number = 1;
    public soundVolume: number = 1;
    private _mirrorType: number = 0;
    public bgImage: any = null;
    public bgImageBlur: any = null;
    public bgMusic: any = null;
    public bgVideo: any = null;
    public lines: JudgelineExtends[] = [];
    public notes: NoteExtends[] = [];
    public taps: NoteExtends[] = [];
    public drags: NoteExtends[] = [];
    public flicks: NoteExtends[] = [];
    public holds: NoteExtends[] = [];
    public linesReversed: JudgelineExtends[] = [];
    public notesReversed: NoteExtends[] = [];
    public tapsReversed: NoteExtends[] = [];
    public dragsReversed: NoteExtends[] = [];
    public flicksReversed: NoteExtends[] = [];
    public holdsReversed: NoteExtends[] = [];
    public tapholds: NoteExtends[] = [];
    private lowResFactor: number;
    public width: number;
    public height: number;
    public wlen: number;
    public hlen: number;
    public scaleX: number;
    public scaleY: number;
    public matX: (x: number) => number;
    public matY: (y: number) => number;
    public matR: (r: number) => number;

    constructor(stage: HTMLDivElement) {
        if (!(stage instanceof HTMLDivElement)) throw new Error("Not a container");
        this.stage = stage;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d", { alpha: false }); //游戏界面(alpha:false会使Firefox显示异常/需要验证)
        this.canvasos = document.createElement("canvas"); //绘制游戏主界面(OffscreenCanvas会使Safari崩溃)
        this.ctxos = this.canvasos.getContext("2d");
        this.stage.appendChild(this.canvas);
        this.canvas.style.cssText = ";position:absolute;top:0px;left:0px;right:0px;bottom:0px;";
        console.log("Hello, PhiTogether(extended from lchzh3473/sim-phi)!");
        this._setLowResFactor(1);
        this.resizeCanvas();
    }
    //config
    setNoteScale(num: number): void {
        this.noteScale = Number(num) || 1;
        this.noteScaleRatio = (this.canvasos.width * this.noteScale) / 8080; //note、特效缩放
    }
    private _setLowResFactor(num: number): void {
        this.lowResFactor = num * self.devicePixelRatio;
    }
    setLowResFactor(num: number): void {
        this._setLowResFactor(Number(num) || 1);
        this._resizeCanvas();
    }
    private _resizeCanvas(): void {
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
    resizeCanvas(): void {
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
    mirrorView(code: number = this._mirrorType): number {
        const n = (this._mirrorType = 3 & code);
        this.transformView(1 & n ? -1 : 1, 2 & n ? -1 : 1, 0, 0);
        return code;
    }
    transformView(
        scaleX: number = 1,
        scaleY: number = 1,
        offsetX: number = 0,
        offsetY: number = 0
    ): void {
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
    prerenderChart(chart: any): void {
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
        const addRealTime = (events: any[], bpm: number) => {
            for (const i of events) {
                i.startRealTime = (i.startTime / bpm) * 1.875;
                i.endRealTime = (i.endTime / bpm) * 1.875;
                if (i.startTime > 1 - 1e6 && i.startRealTime > maxTime) maxTime = i.startRealTime;
                if (i.endTime < 1e9 && i.endRealTime > maxTime) maxTime = i.endRealTime;
            }
        };
        //向Renderer添加Note
        /** @param {NoteExtends} note */
        const addNote = (
            note: NoteExtends,
            beat32: number,
            line: JudgelineExtends,
            noteId: number,
            isAbove: boolean
        ) => {
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
        const sortNote = (a: NoteExtends, b: NoteExtends) =>
            a.realTime - b.realTime || a.lineId - b.lineId || a.noteId - b.noteId;
        //优化events
        chartNew.judgeLineList.forEach(
            (i: JudgeLine, lineId: number) => ((i as unknown as JudgelineExtends).lineId = lineId)
        );
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
            this.lines.push(i as unknown as JudgelineExtends); //qwq可以定义新类避免函数在循环里定义
            i.notesAbove.forEach((j: Note, noteId: number) =>
                addNote(
                    j as unknown as NoteExtends,
                    1.875 / i.bpm,
                    i as unknown as JudgelineExtends,
                    noteId,
                    true
                )
            );
            i.notesBelow.forEach((j: Note, noteId: number) =>
                addNote(
                    j as unknown as NoteExtends,
                    1.875 / i.bpm,
                    i as unknown as JudgelineExtends,
                    noteId,
                    false
                )
            );
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
        const timeOfMulti: { [key: string]: number } = {};
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
    updateByTime(timeChart: number): void {
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
                              i.start.split(",").map((start: number, index: number) => {
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
                    (shared.game.ptmain.gameConfig.enableFR ? i.floorPosition2 : i.floorPosition);
            }
            const realgetY = (i: NoteExtends) => {
                if (i.type !== 3) return (i.floorPosition - line.positionY) * i.speed;
                if (i.realTime < timeChart) return (i.realTime - timeChart) * i.speed * this.speed;
                return i.floorPosition - line.positionY;
            };
            const getY = (i: NoteExtends) => {
                if (!i.badtime) return realgetY(i);
                if (performance.now() - i.badtime > 500) delete i.badtime;
                if (!i.badY) i.badY = realgetY(i);
                return i.badY;
            };
            const setAlpha = (i: NoteExtends, dx: number, dy: number) => {
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
                if (!i.badtime)
                    if (i.realTime > timeChart) {
                        i.showPoint = true;
                        i.alpha =
                            dy <= -1e-3 * this.scaleY || (shared.game.ptmain.gameConfig.enableVP && realgetY(i) * 0.6 > 2)
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

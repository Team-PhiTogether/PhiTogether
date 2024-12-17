import { tween } from "../tween";

class EventLayer {
    constructor() {
        this.moveXEvents = [];
        this.moveYEvents = [];
        this.rotateEvents = [];
        this.alphaEvents = [];
        this.speedEvents = [];
    }
    pushMoveXEvent(startTime, endTime, start, end, easingType, easingLeft, easingRight) {
        this.moveXEvents.push({ startTime, endTime, start, end, easingType, easingLeft, easingRight });
    }
    pushMoveYEvent(startTime, endTime, start, end, easingType, easingLeft, easingRight) {
        this.moveYEvents.push({ startTime, endTime, start, end, easingType, easingLeft, easingRight });
    }
    pushRotateEvent(startTime, endTime, start, end, easingType, easingLeft, easingRight) {
        this.rotateEvents.push({ startTime, endTime, start, end, easingType, easingLeft, easingRight });
    }
    pushAlphaEvent(startTime, endTime, start, end, easingType, easingLeft, easingRight) {
        this.alphaEvents.push({ startTime, endTime, start, end, easingType, easingLeft, easingRight });
    }
    pushSpeedEvent(startTime, endTime, start, end) {
        this.speedEvents.push({ startTime, endTime, start, end });
    }
}
class LineRPE {
    constructor(bpm) {
        this.bpm = 120;
        this.zOrder = 0;
        this.notes = [];
        this.eventLayers = [];
        this.colorEvents = [];
        this.textEvents = [];
        this.scaleXEvents = [];
        this.scaleYEvents = [];
        this.attachUI = null;
        if (!isNaN(bpm)) this.bpm = bpm;
    }
    pushNote(type, time, positionX, holdTime, speed, isAbove, isFake, size = 1, alpha = 255, visibleTime = Infinity) {
        alpha = parseInt(alpha) / 255;
        this.notes.push({ type, time, positionX, holdTime, speed, isAbove, isFake, size, alpha, visibleTime });
    }
    setId(id = NaN) {
        this.id = id;
    }
    setZOrder(id = 0) {
        this.zOrder = id || 0;
    }
    setUIAttachment(id = null) {
        this.attachUI = id;
    }
    /** @param {LineRPE} fatherLine */
    setFather(fatherLine) {
        this.father = fatherLine;
    }
    preset() {
        const sortFn2 = (a, b) => a.startTime - b.startTime;
        const events = [];
        for (const e of this.eventLayers) {
            const moveXEvents = [];
            const moveYEvents = [];
            const rotateEvents = [];
            const alphaEvents = [];
            const speedEvents = [];
            for (const i of e.moveXEvents.sort(sortFn2)) pushLineEvent(moveXEvents, i);
            for (const i of e.moveYEvents.sort(sortFn2)) pushLineEvent(moveYEvents, i);
            for (const i of e.rotateEvents.sort(sortFn2)) pushLineEvent(rotateEvents, i);
            for (const i of e.alphaEvents.sort(sortFn2)) pushLineEvent(alphaEvents, i);
            for (const i of e.speedEvents.sort(sortFn2)) pushLineEvent(speedEvents, i);
            events.push({ moveXEvents, moveYEvents, rotateEvents, alphaEvents, speedEvents });
        }
        const moveXEvents = combineMultiEvents(events.map(i => i.moveXEvents));
        const moveYEvents = combineMultiEvents(events.map(i => i.moveYEvents));
        this.moveEvents = combineXYEvents(moveXEvents, moveYEvents);
        this.rotateEvents = combineMultiEvents(events.map(i => i.rotateEvents));
        this.alphaEvents = combineMultiEvents(events.map(i => i.alphaEvents));
        this.speedEvents = toSpeedEvent(combineMultiEvents(events.map(i => i.speedEvents)));
        this.settled = true;
    }
    fitFather(stack = [], onwarning = console.warn) {
        if (!this.settled) this.preset();
        if (stack.includes(this)) {
            onwarning(`检测到循环继承：${stack.concat(this).map(i => i.id).join('->')}(对应的father将被视为-1)`);
            stack.map(i => i.setFather(null));
            return;
        }
        if (this.father) {
            this.father.fitFather(stack.concat(this), onwarning);
            if (!this.father) return;
            if (!this.merged) mergeFather(this, this.father);
            this.merged = true;
        }
    }
    format({ onwarning = console.warn } = {}) {
        this.fitFather([], onwarning);
        const result = {
            bpm: this.bpm,
            zOrder: this.zOrder,
            attachUI: this.attachUI,
            speedEvents: [],
            numOfNotes: 0,
            numOfNotesAbove: 0,
            numOfNotesBelow: 0,
            notesAbove: [],
            notesBelow: [],
            judgeLineDisappearEvents: [],
            judgeLineMoveEvents: [],
            judgeLineRotateEvents: [],
            judgeLineColorEvents: [],
            judgeLineTextEvents: [],
            judgeLineScaleXEvents: [],
            judgeLineScaleYEvents: [],
        };
        for (const i of this.moveEvents) result.judgeLineMoveEvents.push({
            startTime: i.startTime,
            endTime: i.endTime,
            start: (i.start + 675) / 1350,
            end: (i.end + 675) / 1350,
            start2: (i.start2 + 450) / 900,
            end2: (i.end2 + 450) / 900
        });
        for (const i of this.rotateEvents) result.judgeLineRotateEvents.push({
            startTime: i.startTime,
            endTime: i.endTime,
            start: -i.start,
            end: -i.end,
            start2: 0,
            end2: 0
        });
        for (const i of this.alphaEvents) result.judgeLineDisappearEvents.push({
            startTime: i.startTime,
            endTime: i.endTime,
            start: parseFloat(i.start) / 255,
            end: parseFloat(i.end) / 255,
            start2: 0,
            end2: 0
        });
        for (const i of this.colorEvents) result.judgeLineColorEvents.push({
            startTime: i.startTime,
            endTime: i.endTime,
            start: i.start.join(","),
            end: i.end.join(","),
            start2: 0,
            end2: 0
        });
        for (const i of this.textEvents) result.judgeLineTextEvents.push({
            startTime: i.startTime,
            endTime: i.endTime,
            start: i.start,
            end: i.end,
            start2: 0,
            end2: 0
        });
        for (const i of this.scaleXEvents) result.judgeLineScaleXEvents.push({
            startTime: i.startTime,
            endTime: i.endTime,
            start: i.start,
            end: i.end,
            start2: 0,
            end2: 0
        });
        for (const i of this.scaleYEvents) result.judgeLineScaleYEvents.push({
            startTime: i.startTime,
            endTime: i.endTime,
            start: i.start,
            end: i.end,
            start2: 0,
            end2: 0
        });
        //添加floorPosition
        let floorPos = 0;
        const speedEvents = this.speedEvents;
        for (let i = 0; i < speedEvents.length; i++) {
            const startTime = Math.max(speedEvents[i].time, 0);
            const endTime = i < speedEvents.length - 1 ? speedEvents[i + 1].time : 1e9;
            const value = speedEvents[i].value * 2 / 9;
            const floorPosition = floorPos;
            floorPos += (endTime - startTime) * value / this.bpm * 1.875;
            floorPos = Math.fround(floorPos);
            result.speedEvents.push({ startTime, endTime, value, floorPosition });
        }
        //处理notes
        const sortFn = (a, b) => a.time - b.time;
        const getPositionValues = time => {
            let v1 = 0;
            let v2 = 0;
            let v3 = 0;
            for (const e of result.speedEvents) {
                if (time > e.endTime) continue;
                if (time < e.startTime) break;
                v1 = e.floorPosition;
                v2 = e.value;
                v3 = time - e.startTime;
            }
            return { v1, v4: v2 * v3 };
        };
        const getHoldSpeedValue = (time, holdTime) => {
            const start = getPositionValues(time);
            const end = getPositionValues(time + holdTime);
            return ((end.v1 - start.v1) / 1.875 * this.bpm + (end.v4 - start.v4)) / holdTime;
        };
        for (const i of this.notes.sort(sortFn)) {
            const { v1, v4 } = getPositionValues(i.time);
            const note = {
                type: i.type,
                time: i.time,
                isFake: i.isFake || false,
                visibleTime: i.visibleTime || Infinity,
                positionX: i.positionX,
                holdTime: i.holdTime,
                speed: i.speed * (i.type === 3 ? getHoldSpeedValue(i.time, i.holdTime) : 1),
                floorPosition: Math.fround(v1 + v4 / this.bpm * 1.875),
                size: i.size,
                alpha: i.alpha,
            };
            if (i.isAbove) {
                result.notesAbove.push(note);
                if (i.isFake) continue;
                result.numOfNotes++;
                result.numOfNotesAbove++;
            } else {
                result.notesBelow.push(note);
                if (i.isFake) continue;
                result.numOfNotes++;
                result.numOfNotesBelow++;
            }
        }
        return result;
    }
}

/**
 * @typedef {object} LineEvent
 * @property {number} startTime
 * @property {number} endTime
 * @property {number} start
 * @property {number} end
 * @property {number} [easingType]
 * @property {number} [easingLeft]
 * @property {number} [easingRight]
 * @property {number} [delta]
 * 
 * @param {LineEvent[]} ls
 * @param {LineEvent} le
 */
function pushLineEvent(ls, le) {
    const { startTime, endTime, start, end, easingType = 1, easingLeft = 0, easingRight = 1 } = le;
    const delta = (end - start) / (endTime - startTime);
    // 插入之前考虑事件时间的相互关系
    for (let i = ls.length - 1; i >= 0; i--) {
        const e = ls[i];
        if (e.endTime < startTime) { // 相离：补全空隙
            ls[i + 1] = { startTime: e.endTime, endTime: startTime, start: e.end, end: e.end, delta: 0 };
            break;
        }
        if (e.startTime === startTime) { // 相切：直接截断
            ls.length = i;
            break;
        }
        if (e.startTime < startTime) { // 相交：截断交点以后的部分
            e.end = e.start + (startTime - e.startTime) * e.delta;
            e.endTime = startTime;
            e.delta = (e.end - e.start) / (startTime - e.startTime);
            ls.length = i + 1;
            break;
        }
    }
    // 插入新事件
    if (easingType === 1 || start === end || easingLeft === easingRight) {
        ls.push({ startTime, endTime, start, end, delta });
    } else {
        if (!tween[easingType]) return; // Unsupported
        if (startTime >= endTime) {
            ls.push({ startTime, endTime: startTime, start: end, end, delta: 0 });
            return;
        }
        const eHead = tween[easingType](easingLeft);
        const eTail = tween[easingType](easingRight);
        const eSpeed = (easingRight - easingLeft) / (endTime - startTime);
        const eDelta = (eTail - eHead) / (end - start);
        let v1 = 0;
        let v2 = 0;
        for (let j = startTime; j < endTime; j++) {
            v1 = v2;
            v2 = (tween[easingType]((j + 1 - startTime) * eSpeed + easingLeft) - eHead) / eDelta;
            ls.push({ startTime: j, endTime: j + 1, start: start + v1, end: start + v2, delta: v2 - v1 });
        }
    }
}
/** @param {LineEvent[]} le */
function toSpeedEvent(le) {
    const result = [];
    for (const i of le) {
        const { startTime, endTime, start, end } = i;
        result.push({ time: startTime, value: start });
        if (start !== end) { //暂未考虑开始时间大于结束时间的情况
            const t1 = (end - start) / (endTime - startTime);
            for (let j = startTime; j < endTime; j++) {
                const x = j + 0.5 - startTime;
                result.push({ time: j, value: start + x * t1 });
            }
        }
    }
    return result;
}
/**
 * @param {LineEvent[]} e 
 * @param {number} t 
 * @param {boolean} d
 */
function getRotateValue(e, t, d) {
    let result = e[0] ? e[0].start : 0;
    for (const i of e) {
        const { startTime, endTime, start, end } = i;
        if (t < startTime) break;
        if (d && t === startTime) break;
        if (t >= endTime) result = end;
        else result = start + (t - startTime) * (end - start) / (endTime - startTime);
    }
    return result;
}
/**
 * @param {LineEvent[]} xe
 * @param {LineEvent[]} ye
 */
function combineXYEvents(xe, ye) {
    const le = [];
    const splits = [];
    for (const i of xe) splits.push(i.startTime, i.endTime);
    for (const i of ye) splits.push(i.startTime, i.endTime);
    splits.sort((a, b) => a - b);
    for (let i = 0; i < splits.length - 1; i++) {
        const startTime = splits[i];
        const endTime = splits[i + 1];
        if (startTime === endTime) continue;
        const startX = getEventsValue(xe, startTime, false);
        const endX = getEventsValue(xe, endTime, true);
        const startY = getEventsValue(ye, startTime, false);
        const endY = getEventsValue(ye, endTime, true);
        le.push({ startTime, endTime, start: startX, end: endX, start2: startY, end2: endY });
    }
    return le;
}
/** @param {LineEvent[][]} es */
function combineMultiEvents(es) {
    const le = [];
    const splits = [];
    for (const e of es) {
        for (const i of e) splits.push(i.startTime, i.endTime);
    }
    splits.sort((a, b) => a - b);
    for (let i = 0; i < splits.length - 1; i++) {
        const startTime = splits[i];
        const endTime = splits[i + 1];
        if (startTime === endTime) continue;
        const start = es.reduce((i, e) => i + getEventsValue(e, startTime, false), 0);
        const end = es.reduce((i, e) => i + getEventsValue(e, endTime, true), 0);
        le.push({ startTime, endTime, start, end, delta: (end - start) / (endTime - startTime) });
    }
    return le;
}
/**
 * @param {LineRPE} child
 * @param {LineRPE} father
 */
function mergeFather(child, father) {
    const moveEvents = [];
    const splits = [];
    for (const i of father.moveEvents) splits.push(i.startTime, i.endTime);
    for (const i of father.rotateEvents) splits.push(i.startTime, i.endTime);
    for (const i of child.moveEvents) splits.push(i.startTime, i.endTime);
    splits.sort((a, b) => a - b);
    for (let i = splits[0]; i < splits[splits.length - 1]; i++) {
        const startTime = i;
        const endTime = i + 1;
        if (startTime === endTime) continue;
        //计算父级移动和旋转
        const [fatherX, fatherY] = getMoveValue(father.moveEvents, startTime, false);
        const fatherR = getRotateValue(father.rotateEvents, startTime, false) * -Math.PI / 180;
        const [fatherX2, fatherY2] = getMoveValue(father.moveEvents, endTime, true);
        const fatherR2 = getRotateValue(father.rotateEvents, endTime, true) * -Math.PI / 180;
        //计算子级移动
        const [childX, childY] = getMoveValue(child.moveEvents, startTime, false);
        const [childX2, childY2] = getMoveValue(child.moveEvents, endTime, true);
        //坐标转换
        const start = fatherX + childX * Math.cos(fatherR) - childY * Math.sin(fatherR);
        const end = fatherX2 + childX2 * Math.cos(fatherR2) - childY2 * Math.sin(fatherR2);
        const start2 = fatherY + childX * Math.sin(fatherR) + childY * Math.cos(fatherR);
        const end2 = fatherY2 + childX2 * Math.sin(fatherR2) + childY2 * Math.cos(fatherR2);
        moveEvents.push({ startTime, endTime, start, end, start2, end2 })
    }
    child.moveEvents = moveEvents;
}
/**
 * @param {LineEvent[]} e 
 * @param {number} t 
 * @param {boolean} d
 */
function getEventsValue(e, t, d) {
    let result = e[0] ? e[0].start : 0;
    for (const i of e) {
        const { startTime, endTime, start, end, delta } = i;
        if (t < startTime) break;
        if (d && t === startTime) break;
        if (t >= endTime) result = end;
        else result = start + (t - startTime) * delta;
    }
    return result;
}
/**
 * @param {LineEvent[]} e 
 * @param {number} t 
 * @param {boolean} d
 */
function getMoveValue(e, t, d) {
    let result = e[0] ? e[0].start : 0;
    let result2 = e[0] ? e[0].start2 : 0;
    for (const i of e) {
        const { startTime, endTime, start, end, start2, end2 } = i;
        if (t < startTime) break;
        if (d && t === startTime) break;
        if (t >= endTime) {
            result = end;
            result2 = end2;
        } else {
            result = start + (t - startTime) * (end - start) / (endTime - startTime);
            result2 = start2 + (t - startTime) * (end2 - start2) / (endTime - startTime);
        }
    }
    return [result, result2];
}

export { EventLayer, LineRPE };
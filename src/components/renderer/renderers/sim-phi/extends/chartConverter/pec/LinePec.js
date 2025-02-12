import { tween } from "../tween";

class LinePec {
    constructor(bpm) {
        this.bpm = 120;
        this.numOfNotes = 0;
        this.numOfNotesAbove = 0;
        this.numOfNotesBelow = 0;
        this.speedEvents = [];
        this.notes = [];
        this.notesAbove = [];
        this.notesBelow = [];
        this.alphaEvents = [];
        this.moveEvents = [];
        this.rotateEvents = [];
        if (!isNaN(bpm)) this.bpm = bpm;
    }
    pushNote(type, time, positionX, holdTime, speed, isAbove, isFake) {
        this.notes.push({ type, time, positionX, holdTime, speed, isAbove, isFake });
    }
    pushSpeedEvent(time, value) {
        this.speedEvents.push({ time, value });
    }
    pushAlphaEvent(startTime, endTime, value, motionType) {
        this.alphaEvents.push({ startTime, endTime, value, motionType });
    }
    pushMoveEvent(startTime, endTime, value, value2, motionType) {
        this.moveEvents.push({ startTime, endTime, value, value2, motionType });
    }
    pushRotateEvent(startTime, endTime, value, motionType) {
        this.rotateEvents.push({ startTime, endTime, value, motionType });
    }
    format() {
        const sortFn = (a, b) => a.time - b.time;
        const sortFn2 = (a, b) => a.startTime - b.startTime + (a.endTime - b.endTime); //不单独判断以避免误差
        const result = {
            bpm: this.bpm,
            speedEvents: [],
            numOfNotes: 0,
            numOfNotesAbove: 0,
            numOfNotesBelow: 0,
            notesAbove: [],
            notesBelow: [],
            judgeLineDisappearEvents: [],
            judgeLineMoveEvents: [],
            judgeLineRotateEvents: [],
        };
        const pushDisappearEvent = (startTime, endTime, start, end) => {
            result.judgeLineDisappearEvents.push({
                startTime,
                endTime,
                start,
                end,
                start2: 0,
                end2: 0,
            });
        };
        const pushMoveEvent = (startTime, endTime, start, end, start2, end2) => {
            result.judgeLineMoveEvents.push({ startTime, endTime, start, end, start2, end2 });
        };
        const pushRotateEvent = (startTime, endTime, start, end) => {
            result.judgeLineRotateEvents.push({
                startTime,
                endTime,
                start,
                end,
                start2: 0,
                end2: 0,
            });
        };
        //cv和floorPosition一并处理
        const cvp = this.speedEvents.sort(sortFn);
        let s1 = 0;
        for (let i = 0; i < cvp.length; i++) {
            const startTime = Math.max(cvp[i].time, 0);
            const endTime = i < cvp.length - 1 ? cvp[i + 1].time : 1e9;
            const value = cvp[i].value;
            const floorPosition = s1;
            s1 += (((endTime - startTime) * value) / this.bpm) * 1.875;
            s1 = Math.fround(s1);
            result.speedEvents.push({ startTime, endTime, value, floorPosition });
        }
        for (const i of this.notes.sort(sortFn)) {
            const time = i.time;
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
            const note = {
                type: i.type,
                time: time,
                isFake: i.isFake || false,
                positionX: i.positionX,
                holdTime: i.holdTime,
                speed: i.speed * (i.type === 3 ? v2 : 1),
                floorPosition: Math.fround(v1 + ((v2 * v3) / this.bpm) * 1.875),
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
        //整合motionType
        let dt = 0;
        let d1 = 0;
        for (const e of this.alphaEvents.sort(sortFn2)) {
            pushDisappearEvent(dt, e.startTime, d1, d1);
            if (tween[e.motionType]) {
                const t1 = e.value - d1;
                let x1 = 0;
                let x2 = 0;
                for (let i = e.startTime; i < e.endTime; i++) {
                    x1 = x2;
                    x2 = tween[e.motionType]((i + 1 - e.startTime) / (e.endTime - e.startTime));
                    pushDisappearEvent(i, i + 1, d1 + x1 * t1, d1 + x2 * t1);
                }
            } else if (e.motionType) pushDisappearEvent(e.startTime, e.endTime, d1, e.value);
            dt = e.endTime;
            d1 = e.value;
        }
        pushDisappearEvent(dt, 1e9, d1, d1);
        //
        let mt = 0;
        let m1 = 0;
        let m2 = 0;
        for (const e of this.moveEvents.sort(sortFn2)) {
            pushMoveEvent(mt, e.startTime, m1, m1, m2, m2);
            if (e.motionType !== 1) {
                const t1 = e.value - m1;
                const t2 = e.value2 - m2;
                let x1 = 0;
                let x2 = 0;
                for (let i = e.startTime; i < e.endTime; i++) {
                    x1 = x2;
                    x2 = tween[e.motionType]((i + 1 - e.startTime) / (e.endTime - e.startTime));
                    pushMoveEvent(i, i + 1, m1 + x1 * t1, m1 + x2 * t1, m2 + x1 * t2, m2 + x2 * t2);
                }
            } else pushMoveEvent(e.startTime, e.endTime, m1, e.value, m2, e.value2);
            mt = e.endTime;
            m1 = e.value;
            m2 = e.value2;
        }
        pushMoveEvent(mt, 1e9, m1, m1, m2, m2);
        //
        let rt = 0;
        let r1 = 0;
        for (const e of this.rotateEvents.sort(sortFn2)) {
            pushRotateEvent(rt, e.startTime, r1, r1);
            if (e.motionType !== 1) {
                const t1 = e.value - r1;
                let x1 = 0;
                let x2 = 0;
                for (let i = e.startTime; i < e.endTime; i++) {
                    x1 = x2;
                    x2 = tween[e.motionType]((i + 1 - e.startTime) / (e.endTime - e.startTime));
                    pushRotateEvent(i, i + 1, r1 + x1 * t1, r1 + x2 * t1);
                }
            } else pushRotateEvent(e.startTime, e.endTime, r1, e.value);
            rt = e.endTime;
            r1 = e.value;
        }
        pushRotateEvent(rt, 1e9, r1, r1);
        //
        return result;
    }
}

export { LinePec };

export class BpmList {
    constructor(baseBpm) {
        this.baseBpm = Number(baseBpm) || 120;
        this.accTime = 0;
        /** @type {BpmEvent[]} */
        this.list = []; //存放bpm变速事件
    }
    push(start, end, bpm) {
        const value = this.accTime;
        this.list.push({ start, end, bpm, value });
        this.accTime += (end - start) / bpm;
    }
    calc(beat) { //将pec时间转换为pgr时间
        let time = 0;
        for (const i of this.list) {
            if (beat > i.end) continue;
            if (beat < i.start) break;
            time = Math.round(((beat - i.start) / i.bpm + i.value) * this.baseBpm * 32);
        }
        return time;
    }
}
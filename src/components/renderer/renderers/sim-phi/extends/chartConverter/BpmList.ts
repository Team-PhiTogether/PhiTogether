interface BpmEvent {
    start: number;
    end: number;
    bpm: number;
    value: number;
}

export class BpmList {
    public readonly baseBpm: number;
    private accTime: number;
    private list: BpmEvent[];

    constructor(baseBpm: number) {
        this.baseBpm = Number(baseBpm) || 120;
        this.accTime = 0;
        this.list = [];
    }

    push(start: number, end: number, bpm: number): void {
        const value = this.accTime;
        this.list.push({ start, end, bpm, value });
        this.accTime += (end - start) / bpm;
    }

    calc(beat: number): number {
        let time = 0;
        for (const i of this.list) {
            if (beat > i.end) continue;
            if (beat < i.start) break;
            time = Math.round(((beat - i.start) / i.bpm + i.value) * this.baseBpm * 32);
        }
        return time;
    }
}

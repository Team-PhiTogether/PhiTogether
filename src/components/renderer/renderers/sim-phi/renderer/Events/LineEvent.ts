interface LineEventParams {
    startTime?: number | string;
    endTime?: number | string;
    start?: number | string;
    end?: number | string;
    start2?: number | string;
    end2?: number | string;
}

export class LineEvent {
    readonly startTime: number;
    readonly endTime: number;
    readonly start: number | string;
    readonly end: number | string;
    readonly start2: number;
    readonly end2: number;

    constructor(event: LineEventParams) {
        event = event ?? {};
        this.startTime = parseInt(event.startTime as string) || 0;
        this.endTime = parseInt(event.endTime as string) || 0;
        this.start =
            typeof event.start === "string"
                ? event.start
                : parseFloat(event.start as unknown as string) || 0;
        this.end =
            typeof event.start === "string" ? event.end : parseFloat(event.end as string) || 0;
        this.start2 = parseFloat(event.start2 as string) || 0;
        this.end2 = parseFloat(event.end2 as string) || 0;
    }
}

//规范判定线事件
export function normalizeLineEvent(events = []) {
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
        if (i1.endTime <= i2.endTime)
            if (i1.endTime === i2.startTime) newEvents.push(i2);
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
        if (i2.startTime !== i2.endTime)
            if (
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

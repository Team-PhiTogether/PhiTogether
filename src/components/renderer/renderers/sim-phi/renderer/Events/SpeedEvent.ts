interface SpeedEventParams {
    startTime?: number | string;
    endTime?: number | string;
    value?: number | string;
    floorPosition?: number | string;
    floorPosition2?: number | string;
}

export class SpeedEvent {
    readonly startTime: number;
    readonly endTime: number;
    readonly value: number;
    readonly floorPosition: number;
    readonly floorPosition2: number;

    constructor(event: SpeedEventParams = {}) {
        this.startTime = parseInt(event.startTime as string) || 0;
        this.endTime = parseInt(event.endTime as string) || 0;
        this.value = parseFloat(event.value as string) || 0;
        this.floorPosition = parseFloat(event.floorPosition as string) || 0;
        this.floorPosition2 = parseFloat(event.floorPosition2 as string) || 0;
    }
}

//规范speedEvents
export function normalizeSpeedEvent(events = []) {
    const newEvents = [];
    for (const i2 of events) {
        const i1 = newEvents[newEvents.length - 1];
        if (i1 && i1.value === i2.value) i1.endTime = i2.endTime;
        else newEvents.push(new SpeedEvent(i2));
    }
    return newEvents;
}

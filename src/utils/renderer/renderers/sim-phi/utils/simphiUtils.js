export const tween = {
    easeInSine: pos => 1 - Math.cos((pos * Math.PI) / 2),
    easeOutSine: pos => Math.sin((pos * Math.PI) / 2),
    easeOutCubic: pos => 1 + (pos - 1) ** 3,
    easeIOCubic: pos => ((pos *= 2) < 1 ? pos ** 3 : (pos - 2) ** 3 + 2) / 2,
    easeInCubic: pos => pos ** 3, //9
    ease10: pos => 1 - (pos - 1) ** 4, //10
    ease15: pos => pos ** 5, //15
};

export class Emitter extends EventTarget {
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

export function clip(num) {
    if (num < 0) return 0;
    if (num > 1) return 1;
    return num;
}

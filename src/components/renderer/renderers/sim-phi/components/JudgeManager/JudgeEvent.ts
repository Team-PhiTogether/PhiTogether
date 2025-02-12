export class JudgeEvent {
    offsetX: number;
    offsetY: number;
    type: number;
    judged: boolean;
    event?: Function;
    preventBad: boolean;

    constructor(offsetX: number, offsetY: number, type: number, event?: Function) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.type = type | 0; //1-Tap,2-Hold/Drag,3-Move
        this.judged = false; //是否被判定
        this.event = event; //flick专用回调
        this.preventBad = false; //是否阻止判定为Bad
    }
}

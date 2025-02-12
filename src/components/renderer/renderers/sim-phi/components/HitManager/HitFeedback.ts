export class HitFeedback {
    offsetX: number;
    offsetY: number;
    color: string;
    text: string;
    time: number;

    constructor(offsetX: number, offsetY: number, n1: string, n2: string) {
        this.offsetX = Number(offsetX);
        this.offsetY = Number(offsetY);
        this.color = String(n1);
        this.text = String(n2);
        this.time = 0;
    }
    static tap(offsetX: number, offsetY: number) {
        return new HitFeedback(offsetX, offsetY, "cyan", "");
    }
    static hold(offsetX: number, offsetY: number) {
        return new HitFeedback(offsetX, offsetY, "lime", "");
    }
    static move(offsetX: number, offsetY: number) {
        return new HitFeedback(offsetX, offsetY, "violet", "");
    }
}

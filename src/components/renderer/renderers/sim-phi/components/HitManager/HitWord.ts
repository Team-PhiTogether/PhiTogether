export class HitWord {
    offsetX: number;
    offsetY: number;
    time: number;
    duration: number;
    color: string;
    text: string;

    constructor(offsetX: number | string, offsetY: number | string, n1: string, n2: string) {
        this.offsetX = Number(offsetX) || 0;
        this.offsetY = Number(offsetY) || 0;
        this.time = performance.now();
        this.duration = 250;
        this.color = String(n1);
        this.text = String(n2);
    }

    static early(offsetX: number, offsetY: number): HitWord {
        return new HitWord(offsetX, offsetY, "#03aaf9", "Early");
    }

    static late(offsetX: number, offsetY: number): HitWord {
        return new HitWord(offsetX, offsetY, "#ff4612", "Late");
    }
}

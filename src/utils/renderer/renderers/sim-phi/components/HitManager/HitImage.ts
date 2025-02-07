import { simphiPlayer } from "../../playerMain";

export class HitImage {
    public offsetX: number;
    public offsetY: number;
    public rotation: number;
    public time: number;
    public duration: number;
    public effects: any;
    public direction: [number, number][];
    public color: string;

    constructor(
        offsetX: number | string,
        offsetY: number | string,
        n1: string,
        n3: string,
        rotation: number | string
    ) {
        const packs = simphiPlayer.noteRender.hitFX[n1];
        this.offsetX = Number(offsetX) || 0;
        this.offsetY = Number(offsetY) || 0;
        this.rotation = simphiPlayer.tmps.hitFxRotate ? Number(rotation) || 0 : 0;
        this.time = performance.now();
        this.duration = packs.duration;
        this.effects = packs.effects;
        this.direction = Array(packs.numOfParts || 0)
            .fill()
            .map(() => [Math.random() * 80 + 185, Math.random() * 2 * Math.PI]);
        this.color = String(n3);
    }

    static perfect(offsetX: number, offsetY: number, note: { line: { rotation: number } }) {
        return new HitImage(
            offsetX,
            offsetY,
            "Perfect",
            simphiPlayer.tmps.hitPerfectColor || "#ffeca0",
            note.line.rotation
        );
    }

    static good(offsetX: number, offsetY: number, note: { line: { rotation: number } }) {
        return new HitImage(
            offsetX,
            offsetY,
            "Good",
            simphiPlayer.tmps.hitGoodColor || "#b4e1ff",
            note.line.rotation
        );
    }
}
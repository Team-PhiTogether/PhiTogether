import shared from "@utils/js/shared.js";

export enum HitEventType {
    Mouse = 'mouse',
    Keyboard = 'keyboard',
    Touch = 'touch',
}

export class HitEvent {
    type: HitEventType;
    id: number | string;
    realX: number;
    realY: number;
    isActive: boolean;
    isTapped: boolean;
    isMoving: boolean;
    lastDeltaX: number;
    lastDeltaY: number;
    nowDeltaX: number;
    nowDeltaY: number;
    deltaTime: number;
    currentTime: number;
    flicking: boolean;
    flicked: boolean;

    constructor(type: HitEventType, id: number | string, offsetX: number, offsetY: number) {
        this.type = type;
        this.id = id;
        this.realX = Number(offsetX);
        this.realY = Number(offsetY);
        this.isActive = true;
        this.isTapped = false;
        this.isMoving = false;
        this.lastDeltaX = 0;
        this.lastDeltaY = 0;
        this.nowDeltaX = 0;
        this.nowDeltaY = 0;
        this.deltaTime = 0;
        this.currentTime = performance.now();
        this.flicking = false;
        this.flicked = false;
    }

    get offsetX(): number {
        return !shared.game.ptmain.gameConfig.fullScreenJudge ? this.realX : NaN;
    }

    get offsetY(): number {
        return !shared.game.ptmain.gameConfig.fullScreenJudge ? this.realY : NaN;
    }

    move(offsetX: number, offsetY: number): void {
        this.lastDeltaX = this.nowDeltaX;
        this.lastDeltaY = this.nowDeltaY;
        this.nowDeltaX = offsetX - this.realX;
        this.nowDeltaY = offsetY - this.realY;
        this.realX = offsetX;
        this.realY = offsetY;
        const time = performance.now();
        this.deltaTime = time - this.currentTime;
        this.currentTime = time;
        this.isMoving = true;

        const denominator = Math.sqrt(this.lastDeltaX ** 2 + this.lastDeltaY ** 2) * this.deltaTime;
        const flickSpeed = denominator !== 0 
            ? (this.nowDeltaX * this.lastDeltaX + this.nowDeltaY * this.lastDeltaY) / denominator
            : 0;

        if (this.flicking && flickSpeed < 0.3) {
            this.flicking = false;
            this.flicked = false;
        } else if (!this.flicking && flickSpeed > 0.8) {
            this.flicking = true;
        }
    }
}
import shared from '@utils/js/shared.js';

class HitEvent {
    /**
     * @param {'mouse'|'keyboard'|'touch'} type
     * @param {number|string} id
     * @param {number} offsetX
     * @param {number} offsetY
     */
    constructor(type, id, offsetX, offsetY) {
        /** @type {string} */
        this.type = type;
        this.id = id;
        this.realX = Number(offsetX);
        this.realY = Number(offsetY);
        this.isActive = true; //是否标记为按下，若false则可以移除
        this.isTapped = false; //是否触发过Tap判定
        this.isMoving = false; //是否正在移动
        //flick(speed)
        this.lastDeltaX = 0;
        this.lastDeltaY = 0;
        this.nowDeltaX = 0;
        this.nowDeltaY = 0;
        this.deltaTime = 0; //按下时间差
        this.currentTime = performance.now(); //按下时间
        this.flicking = false; //是否触发Flick判定
        this.flicked = false; //是否触发过Flick判定
    }
    get offsetX() {
        return !shared.game.ptmain.gameConfig.fullScreenJudge ? this.realX : NaN;
    }
    get offsetY() {
        return !shared.game.ptmain.gameConfig.fullScreenJudge ? this.realY : NaN;
    }
    /**
     * @param {number} offsetX
     * @param {number} offsetY
     */
    move(offsetX, offsetY) {
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
        const flickSpeed =
            (this.nowDeltaX * this.lastDeltaX + this.nowDeltaY * this.lastDeltaY) /
            Math.sqrt(this.lastDeltaX ** 2 + this.lastDeltaY ** 2) /
            this.deltaTime;
        if (this.flicking && flickSpeed < 0.3) {
            // origin 0.5 test
            this.flicking = false;
            this.flicked = false;
        } else if (!this.flicking && flickSpeed > 0.8) this.flicking = true; // origin 1.0 test
    }
}
export class HitManager {
    constructor() {
        /** @type {HitEvent[]} */
        this.list = [];
    }
    /**
     * @param {'mouse'|'keyboard'|'touch'} type
     * @param {number|string} id
     * @param {number} offsetX
     * @param {number} offsetY
     */
    activate(type, id, offsetX, offsetY) {
        const { list } = this;
        const idx = list.findIndex((hit) => hit.type === type && hit.id === id);
        if (idx !== -1) list.splice(idx, 1);
        list.push(new HitEvent(type, id, offsetX, offsetY));
    }
    /**
     * @param {'mouse'|'keyboard'|'touch'} type
     * @param {number|string} id
     * @param {number} offsetX
     * @param {number} offsetY
     */
    moving(type, id, offsetX, offsetY) {
        const hitEl = this.list.find((hit) => hit.type === type && hit.id === id);
        if (hitEl) hitEl.move(offsetX, offsetY);
    }
    /**
     * @param {'mouse'|'keyboard'|'touch'} type
     * @param {number|string} id
     */
    deactivate(type, id) {
        const hitEl = this.list.find((hit) => hit.type === type && hit.id === id);
        if (hitEl) hitEl.isActive = false;
    }
    update() {
        const { list } = this;
        for (let i = 0; i < list.length; i++) {
            const hitEl = list[i];
            if (hitEl.isActive) {
                hitEl.isTapped = true;
                hitEl.isMoving = false;
            } else list.splice(i--, 1);
        }
    }
    /**
     * @param {'mouse'|'keyboard'|'touch'} type
     */
    clear(type) {
        for (const i of this.list) {
            if (i.type === type || !type) this.deactivate(i.type, i.id);
        }
    }
}
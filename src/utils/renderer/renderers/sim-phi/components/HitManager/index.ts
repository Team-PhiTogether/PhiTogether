import { HitEvent, HitEventType } from './HitEvent';

export class HitManager {
    list: HitEvent[];

    constructor() {
        this.list = [];
    }

    activate(type: HitEventType, id: number | string, offsetX: number, offsetY: number) {
        const { list } = this;
        const idx = list.findIndex(hit => hit.type === type && hit.id === id);
        if (idx !== -1) list.splice(idx, 1);
        list.push(new HitEvent(type, id, offsetX, offsetY));
    }

    moving(type: HitEventType, id: number | string, offsetX: number, offsetY: number) {
        const hitEl = this.list.find(hit => hit.type === type && hit.id === id);
        if (hitEl) hitEl.move(offsetX, offsetY);
    }

    deactivate(type: HitEventType, id: number | string) {
        const hitEl = this.list.find(hit => hit.type === type && hit.id === id);
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

    clear(type?: HitEventType) {
        for (const i of this.list) {
            if (i.type === type || !type) this.deactivate(i.type, i.id);
        }
    }
}

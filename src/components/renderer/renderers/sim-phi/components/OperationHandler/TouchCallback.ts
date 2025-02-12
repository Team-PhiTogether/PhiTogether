import { simphiPlayer } from "../../playerMain";
import { getPos } from "./getPos";
import { specialDrag } from "../SpecialDrag";
import { specialClick } from "../SpecialClick";
import { TouchCallbacks } from "@utils/js/interact";

export const TouchCallback: TouchCallbacks = {
    touchstartCallback(evt) {
        for (const i of Array.from(evt.changedTouches)) {
            const { x, y } = getPos(i);
            simphiPlayer.hitManager.activate("touch", i.identifier, x, y);
            specialClick.qwq(x, y);
            specialDrag.reg(i.identifier, x, y);
        }
    },
    touchmoveCallback(evt) {
        for (const i of Array.from(evt.changedTouches)) {
            const { x, y } = getPos(i);
            simphiPlayer.hitManager.moving("touch", i.identifier, x, y);
            specialDrag.update(i.identifier, x, y);
        }
    },
    touchendCallback(evt) {
        for (const i of Array.from(evt.changedTouches)) {
            simphiPlayer.hitManager.deactivate("touch", i.identifier);
            specialDrag.del(i.identifier);
        }
    },
    touchcancelCallback(evt) {
        // if (emitter.eq('play')) qwqPause();
        for (const i of Array.from(evt.changedTouches)) {
            simphiPlayer.hitManager.deactivate("touch", i.identifier);
            specialDrag.del(i.identifier);
        }
    },
};
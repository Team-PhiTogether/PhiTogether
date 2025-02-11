import { simphiPlayer } from "../../playerMain";
import { getPos } from "./getPos";
import { specialDrag } from "../SpecialDrag";
import { specialClick } from "../SpecialClick";
import { MouseCallbacks } from "@utils/js/interact";

export const MouseCallback: MouseCallbacks = {
    mousedownCallback(evt) {
        const idx = evt.button;
        const { x, y } = getPos(evt);
        if (idx === 1) simphiPlayer.hitManager.activate("mouse", 4, x, y);
        else if (idx === 2) simphiPlayer.hitManager.activate("mouse", 2, x, y);
        else simphiPlayer.hitManager.activate("mouse", 1 << idx, x, y);
        specialClick.qwq(x, y);
        specialDrag.reg("mouse", x, y);
    },
    mousemoveCallback(evt) {
        const idx = evt.buttons;
        const { x, y } = getPos(evt);
        for (let i = 1; i < 32; i <<= 1) {
            // 同时按住多个键时，只有最后一个键的move事件会触发
            if (idx & i) simphiPlayer.hitManager.moving("mouse", i, x, y);
            else simphiPlayer.hitManager.deactivate("mouse", i);
            specialDrag.update("mouse", x, y);
        }
    },
    mouseupCallback(evt) {
        const idx = evt.button;
        if (idx === 1) simphiPlayer.hitManager.deactivate("mouse", 4);
        else if (idx === 2) simphiPlayer.hitManager.deactivate("mouse", 2);
        else simphiPlayer.hitManager.deactivate("mouse", 1 << idx);
        specialDrag.del("mouse");
    },
};
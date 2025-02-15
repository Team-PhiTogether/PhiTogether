import { simphiPlayer } from "../../playerMain";
import { KeyboardCallbacks } from "@utils/js/interact";
import shared from "@utils/js/shared";

export const KeyboardCallback: KeyboardCallbacks = {
    keydownCallback(evt) {
        if (simphiPlayer.emitter.eq("stop")) return;
        if (evt.key === "Shift") simphiPlayer.playController.toggle();
        if (evt.key === " " && shared.game.ptmain.playConfig.mode === "preview")
            simphiPlayer.playController.toggle();
        else if (
            !simphiPlayer.hitManager.list.find(i => i.type === "keyboard" && i.id === evt.code) //按住一个键时，会触发多次keydown事件
        )
            simphiPlayer.hitManager.activate("keyboard", evt.code, NaN, NaN);
    },
    keyupCallback(evt) {
        if (simphiPlayer.emitter.eq("stop")) return;
        simphiPlayer.hitManager.deactivate("keyboard", evt.code);
    },
};

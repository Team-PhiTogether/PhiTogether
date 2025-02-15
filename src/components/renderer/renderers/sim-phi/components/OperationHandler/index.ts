import { InteractProxy } from "@utils/js/interact";
import { simphiPlayer } from "../../playerMain";
import { MouseCallback } from "./MouseCallback";
import { KeyboardCallback } from "./KeyboardCallback";
import { TouchCallback } from "./TouchCallback";

export class OperationHandler {
    private interactProxy: InteractProxy;

    constructor(element: HTMLElement) {
        this.interactProxy = new InteractProxy(element);

        //兼容PC鼠标
        this.interactProxy.setMouseEvent(MouseCallback);
        //兼容键盘(喵喵喵?)
        this.interactProxy.setKeyboardEvent(KeyboardCallback);
        self.addEventListener("blur", () => simphiPlayer.hitManager.clear("keyboard"));
        //兼容移动设备
        this.interactProxy.setTouchEvent(TouchCallback);
    }

    activate() {
        this.interactProxy.activate();
    }

    deactivate() {
        this.interactProxy.deactive();
    }
}

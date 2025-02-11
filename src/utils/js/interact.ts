export interface MouseCallbacks {
    mousedownCallback?: (ev: MouseEvent) => void;
    mousemoveCallback?: (ev: MouseEvent) => void;
    mouseupCallback?: (ev: MouseEvent) => void;
    mouseoutCallback?: (ev: MouseEvent) => void;
}

export interface TouchCallbacks {
    touchstartCallback?: (ev: TouchEvent) => void;
    touchmoveCallback?: (ev: TouchEvent) => void;
    touchendCallback?: (ev: TouchEvent) => void;
    touchcancelCallback?: (ev: TouchEvent) => void;
}

export interface KeyboardCallbacks {
    keydownCallback?: (ev: KeyboardEvent) => void;
    keyupCallback?: (ev: KeyboardEvent) => void;
}

interface CallbackSet {
    mousedown?: (ev: MouseEvent) => void;
    mousemove?: (ev: MouseEvent) => void;
    mouseup?: (ev: MouseEvent) => void;
    mouseout?: (ev: MouseEvent) => void;
    touchstart?: (ev: TouchEvent) => void;
    touchmove?: (ev: TouchEvent) => void;
    touchend?: (ev: TouchEvent) => void;
    touchcancel?: (ev: TouchEvent) => void;
    keydown?: (ev: KeyboardEvent) => void;
    keyup?: (ev: KeyboardEvent) => void;
}

export class Interact {
    private element: HTMLElement;
    private callbacks: (CallbackSet | null)[] = [];

    constructor(element: HTMLElement) {
        this.element = element;
    }

    setMouseEvent({
        mousedownCallback = () => {},
        mousemoveCallback = () => {},
        mouseupCallback = () => {},
        mouseoutCallback = () => {},
    }: MouseCallbacks): number {
        const mousedown = (evt: MouseEvent) => {
            evt.preventDefault();
            mousedownCallback(evt);
        };
        // 踩坑：对move和up进行preventDefault会影响input元素交互
        const mousemove = (evt: MouseEvent) => {
            mousemoveCallback(evt);
        };
        const mouseup = (evt: MouseEvent) => {
            mouseupCallback(evt);
        };
        const mouseout = (evt: MouseEvent) => {
            mouseoutCallback(evt);
        };
        this.element.addEventListener("mousedown", mousedown);
        self.addEventListener("mousemove", mousemove);
        self.addEventListener("mouseup", mouseup);
        this.element.addEventListener("mouseout", mouseout);
        return this.callbacks.push({ mousedown, mousemove, mouseup, mouseout });
    }

    clearMouseEvent(id?: number): void {
        const { mousedown, mousemove, mouseup, mouseout } = this.callbacks[id! - 1]!;
        this.element.removeEventListener("mousedown", mousedown!);
        self.removeEventListener("mousemove", mousemove!);
        self.removeEventListener("mouseup", mouseup!);
        this.element.removeEventListener("mouseout", mouseout!);
        this.callbacks[id! - 1] = null;
    }

    setTouchEvent({
        touchstartCallback = () => {},
        touchmoveCallback = () => {},
        touchendCallback = () => {},
        touchcancelCallback = () => {},
    }: TouchCallbacks): number {
        const passive = { passive: false }; //warning
        const touchstart = (evt: TouchEvent) => {
            evt.preventDefault();
            touchstartCallback(evt);
        };
        const touchmove = (evt: TouchEvent) => {
            evt.preventDefault();
            touchmoveCallback(evt);
        };
        const touchend = (evt: TouchEvent) => {
            evt.preventDefault();
            touchendCallback(evt);
        };
        const touchcancel = (evt: TouchEvent) => {
            evt.preventDefault();
            touchcancelCallback(evt);
        };
        this.element.addEventListener("touchstart", touchstart, passive);
        this.element.addEventListener("touchmove", touchmove, passive);
        this.element.addEventListener("touchend", touchend);
        this.element.addEventListener("touchcancel", touchcancel);
        return this.callbacks.push({ touchstart, touchmove, touchend, touchcancel });
    }

    clearTouchEvent(id?: number): void {
        const { touchstart, touchmove, touchend, touchcancel } = this.callbacks[id! - 1]!;
        this.element.removeEventListener("touchstart", touchstart!);
        this.element.removeEventListener("touchmove", touchmove!);
        this.element.removeEventListener("touchend", touchend!);
        this.element.removeEventListener("touchcancel", touchcancel!);
        this.callbacks[id! - 1] = null;
    }

    setKeyboardEvent({
        keydownCallback = () => {},
        keyupCallback = () => {},
    }: KeyboardCallbacks): number {
        const isInput = () => {
            if (document.activeElement instanceof HTMLTextAreaElement) return true;
            if (document.activeElement instanceof HTMLInputElement) {
                const type = document.activeElement.getAttribute("type");
                if (/^(button|checkbox|image|radio|reset|submit)$/.test(type)) return false;
                return true;
            }
            return false;
        };
        const keydown = (evt: KeyboardEvent) => {
            if (isInput()) return;
            evt.preventDefault();
            keydownCallback(evt);
        };
        const keyup = (evt: KeyboardEvent) => {
            if (isInput()) return;
            evt.preventDefault();
            keyupCallback(evt);
        };
        self.addEventListener("keydown", keydown);
        self.addEventListener("keyup", keyup);
        return this.callbacks.push({ keydown, keyup });
    }

    clearKeyboardEvent(id?: number): void {
        const { keydown, keyup } = this.callbacks[id! - 1]!;
        self.removeEventListener("keydown", keydown!);
        self.removeEventListener("keyup", keyup!);
        this.callbacks[id! - 1] = null;
    }
}

export class InteractProxy {
    private interact: Interact;
    private mouseEvent: MouseCallbacks | null;
    private touchEvent: TouchCallbacks | null;
    private keyboardEvent: KeyboardCallbacks | null;
    private mouseEventId: number;
    private touchEventId: number;
    private keyboardEventId: number;

    constructor(element: HTMLElement) {
        this.interact = new Interact(element);
        this.mouseEvent = null;
        this.touchEvent = null;
        this.keyboardEvent = null;
        this.mouseEventId = 0;
        this.touchEventId = 0;
        this.keyboardEventId = 0;
    }

    setMouseEvent(callbacks: MouseCallbacks): void {
        this.mouseEvent = callbacks;
    }

    setTouchEvent(callbacks: TouchCallbacks): void {
        this.touchEvent = callbacks;
    }

    setKeyboardEvent(callbacks: KeyboardCallbacks): void {
        this.keyboardEvent = callbacks;
    }

    activate(): void {
        if (this.mouseEvent) this.mouseEventId = this.interact.setMouseEvent(this.mouseEvent);
        if (this.touchEvent) this.touchEventId = this.interact.setTouchEvent(this.touchEvent);
        if (this.keyboardEvent)
            this.keyboardEventId = this.interact.setKeyboardEvent(this.keyboardEvent);
    }

    deactive(): void {
        if (this.mouseEventId) this.interact.clearMouseEvent(this.mouseEventId);
        if (this.touchEventId) this.interact.clearTouchEvent(this.touchEventId);
        if (this.keyboardEventId) this.interact.clearKeyboardEvent(this.keyboardEventId);
    }
}

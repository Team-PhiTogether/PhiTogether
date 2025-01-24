/* PLoading by realtvop
https://github.com/realtvop/ploading */

/**
 * ploading - a Phigros-like loading lib
 * @author 飞机上的长电视
 */
const ploading = {
    currentId: null,
    lastOver: 0,
    delayed: null,
    msg: "",
    _tip: "喵喵喵~",
    _tipsplit: "",
    get tip() {
        return this._tip;
    },
    set tip(t) {
        this._tip = t;
        this.measuredTip = null;
        this._tipsplit = /[\u4e00-\u9fa5]/.test(t) ? "" : " ";
    },
    measuredTip: null,
    canvas: null,
    ctx: null,
    startTime: 0,
    showing: false,
    // aboveMultiPanel: false,
    zIndex: 3,
    whenShow: () => "喵喵喵",
    whenHide: () => "喵喵喵",
    fadeInCompleted: false,
    fadingOut: false,
    useBlur: true,
    PX_RATIO: window.devicePixelRatio || 1,
    init(callbacks) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth * this.PX_RATIO;
        this.canvas.height = window.innerHeight * this.PX_RATIO;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.scale(this.PX_RATIO, this.PX_RATIO);
        this.canvas.style = `z-index: ${this.zIndex}; backdrop-filter: blur(24px) brightness(.75); -webkit-backdrop-filter: blur(24px) brightness(.75); opacity: 1; position: fixed; left: 0px; top: 55px; cursor: progress;`;
        if (callbacks) {
            if (typeof callbacks.whenShow === "function") this.whenShow = callbacks.whenShow;
            if (typeof callbacks.whenHide === "function") this.whenHide = callbacks.whenHide;
        }
    },
    refreshBlurState() {
        this.canvas.style = this.useBlur
            ? `z-index: ${this.zIndex}; backdrop-filter: blur(24px) brightness(.75);-webkit-backdrop-filter: blur(24px) brightness(.75); opacity: 1; position: fixed; left: 0px; top: 55px; cursor: progress;`
            : `z-index: ${this.zIndex}; backdrop-filter: brightness(.5);-webkit-backdrop-filter: brightness(.5); opacity: 1; position: fixed; left: 0px; top: 55px; cursor: progress;`;
    },
    l(msg, id = "default", aboveMultiPanel = false, aboveGame = false) {
        this.zIndex = aboveMultiPanel ? 5 : 3;
        this.zIndex = aboveGame ? 1003 : this.zIndex;
        this.canvas.zIndex = this.zIndex;
        this.canvas.style.zIndex = this.zIndex;
        if (this.currentId) {
            this.show(msg);
            this.currentId = id;
        } else {
            let toDelay = false;
            // this.aboveMultiPanel = aboveMultiPanel;
            const dow = () => {
                if (toDelay && id !== this.delayed) return;
                this.show(msg, true);
                this.currentId = id;
            };
            const now = new Date().getTime();
            if (now - this.lastOver <= 500) {
                setTimeout(dow, 500);
                toDelay = true;
                this.delayed = id;
            } else {
                dow();
                this.delayed = null;
            }
        }
        this.qwq();
    },
    r(id = "default") {
        if (id === this.currentId) {
            this.hide();
            this.lastOver = new Date().getTime();
            this.currentId = null;
        }
        if (id === this.delayed) {
            this.delayed = null;
        }
    },
    show(msg, fadeIn) {
        this.msg = msg;
        if (fadeIn) {
            this.startTime = performance.now();
            this.fadeInCompleted = false;
        }
        this.showing = true;
        this.whenShow();
        document.querySelector("div.main").appendChild(this.canvas);
    },
    hide() {
        // this.showing = false;
        this.fadingOut = performance.now();
        this.fadeInCompleted = false;
    },
    resizeCanvas() {
        const { innerWidth, innerHeight } = window;
        this.canvas.width = innerWidth * this.PX_RATIO * 0.85;
        this.canvas.height = (innerHeight - 55) * this.PX_RATIO * 0.85;
        this.canvas.style.width = innerWidth + "px";
        this.canvas.style.height = innerHeight - 55 + "px";
        this.ctx.scale(this.PX_RATIO, this.PX_RATIO);
        ploading.measuredTip = null;
    },
    qwq() {
        if (!ploading.showing || !ploading.canvas || !ploading.ctx) return;
        ploading.resizeCanvas();
        const height = ploading.canvas.height / ploading.PX_RATIO;
        const width = ploading.canvas.width / ploading.PX_RATIO;
        const now = performance.now();
        const t = (now - ploading.startTime) / 15;

        ploading.ctx.font = "35px Saira";
        ploading.ctx.textAlign = "center";
        ploading.ctx.textBaseline = "middle";
        ploading.ctx.fillStyle = "#ffffff";

        const dxstxt = ploading.ctx.measureText(ploading.msg).width;

        ploading.ctx.clearRect(0, 0, width, height);
        if (!ploading.fadeInCompleted) {
            const awa = Math.tan(t / 25);
            if (awa >= 0) {
                ploading.canvas.style.opacity = awa;
            } else {
                ploading.fadeInCompleted = true;
            }
        } else ploading.canvas.style.opacity = 1;
        if (ploading.fadingOut) {
            const awa = Math.cos((now - ploading.fadingOut) / 400);
            if (awa >= 0) {
                ploading.canvas.style.opacity = awa;
            } else {
                ploading.fadingOut = false;
                ploading.showing = false;
                ploading.canvas.style.opacity = 0;

                document.querySelector("div.main").removeChild(ploading.canvas);
                ploading.whenHide();
            }
        }

        ploading.ctx.globalCompositeOperation = "source-over";
        // ploading.ctx.fillRect(0, 0, width, height);
        ploading.ctx.globalCompositeOperation = "xor";

        const hw = 20 + dxstxt / 2;
        ploading.ctx.fillRect(
            Math.sin(t / 20) < 0 ? Math.cos(t / 20) * hw + width / 2 : width / 2 - hw,
            height / 2 - 25,
            -Math.cos(t / 20) * hw + hw,
            50
        );
        ploading.ctx.fillText(ploading.msg, width / 2, height / 2);

        ploading.ctx.font = "16px Saira";
        ploading.ctx.textAlign = "center";
        ploading.ctx.textBaseline = "bottom";
        const maxwidth = window.visualViewport.width * 0.8;
        if (!ploading.measuredTip) {
            const measuredPart = [""];
            const origin = ploading.tip.split(ploading._tipsplit);
            let nowPart = 0;
            for (let i = 0; i < origin.length; i++) {
                const now = origin[i];
                const ifAdd = measuredPart[nowPart] + ploading._tipsplit + now;
                if (ploading.ctx.measureText(ifAdd).width > maxwidth) {
                    nowPart++;
                    measuredPart[nowPart] = now;
                } else {
                    measuredPart[nowPart] = ifAdd;
                }
            }
            ploading.measuredTip = measuredPart;
        }
        const l = ploading.measuredTip.length;
        for (let i = 0; i < l; i++) {
            ploading.ctx.fillText(
                ploading.measuredTip[i],
                (window.innerWidth * 0.85) / 2,
                height - 40 - (l - i - 1) * 16,
                window.visualViewport.width * 0.8
            );
        }

        requestAnimationFrame(ploading.qwq);
    },
};

export default ploading;

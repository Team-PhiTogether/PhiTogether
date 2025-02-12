import shared from "@utils/js/shared";
import { FrameAnimater } from "@utils/js/common";

(function (window) {
    if (import.meta.env.VITE_DISABLE_BG === "true")
        return (shared.game.bubbleAnimator = {
            start: () => null,
            stop: () => null,
        });
    const canvas = document.getElementById("backgroundCanvas");
    const subcanvas = document.getElementById("gradientCanvas");
    const ctx = canvas.getContext("2d");
    const subctx = subcanvas.getContext("2d");

    const PX_RATIO = window.devicePixelRatio || 1;
    const DENSE_INVERSE = 1.5e4;
    const SHAKE_RATE = 0.0025;
    const RENDER_RATIO = 0.25;
    const numOfBubbles = parseInt(
        ((window.innerWidth * window.innerHeight) / DENSE_INVERSE).toFixed(0)
    );
    let bubbleArray = [];

    window.addEventListener("resize", resizeCanvas, false);
    window.addEventListener("resize", generateBubbles, false);
    window.addEventListener("orientationchange", resizeCanvas, false);
    window.addEventListener("orientationchange", generateBubbles, false);

    /**
     * 将原范围内某个数值映射到新的范围
     * @param {number} g 给定值
     * @param {number} as 原范围开始
     * @param {number} ae 原范围结束
     * @param {number} ts 目标范围开始
     * @param {number} te 目标范围结束
     * @returns {number} 新区间的映射值
     */
    function map(g, as, ae, ts, te) {
        if (ts >= te || as >= ae || g < as || g > ae) return NaN;
        let deltaT, deltaA, k;
        deltaT = te - ts;
        deltaA = ae - as;
        k = deltaT / deltaA;
        return ts + (g - as) * k;
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth * PX_RATIO * RENDER_RATIO;
        canvas.height = window.innerHeight * PX_RATIO * RENDER_RATIO;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(PX_RATIO * RENDER_RATIO * 2, PX_RATIO * RENDER_RATIO * 2);
        subcanvas.width = window.innerWidth * PX_RATIO * RENDER_RATIO;
        subcanvas.height = window.innerHeight * PX_RATIO * RENDER_RATIO;
        subcanvas.style.width = `${window.innerWidth}px`;
        subcanvas.style.height = `${window.innerHeight}px`;
        subctx.scale(PX_RATIO * RENDER_RATIO * 2, PX_RATIO * RENDER_RATIO * 2);
        subctx.translate(window.innerWidth / 2, window.innerHeight / 2);
        // ctx.scale(PX_RATIO, PX_RATIO);
    }

    function generateBubbles() {
        bubbleArray = [];
        for (let i = 0; i < numOfBubbles; i++) {
            bubbleArray.push({
                i: i,
                x: Math.random() * window.innerWidth * 0.5,
                y: Math.random() * window.innerHeight * 0.5,
                baseRadius: 25 + Math.random() * 50,
                baseAlpha: Math.random() * 0.5,
                velocity: 0.5 * (4 + Math.random() * 0.5),
                sinOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    const bgGradientImage = new Image();
    const ROT_SPD = Math.PI / 400;
    const SAFE_VALUE = 10;
    let bgAnimationAngle = 0,
        bgOnload = false;
    bgGradientImage.src = "/src/core/bgGradientHQ.png";
    bgGradientImage.onload = function () {
        bgOnload = true;
        //console.log("bgImage onload");
    };

    function bgLoop() {
        subctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const scn = {
            w: window.innerWidth + SAFE_VALUE,
            h: window.innerHeight + SAFE_VALUE,
        };
        const xAnchor = scn.w / 2 - Math.sqrt((0.5 * scn.w) ** 2 + (0.5 * scn.h) ** 2);
        const yAnchor = scn.h / 2 - (scn.w / 2 - xAnchor);
        subctx.drawImage(
            bgGradientImage,
            -(scn.w / 2 - xAnchor),
            -(scn.h / 2 - yAnchor),
            (scn.w / 2 - xAnchor) * 2,
            (scn.h / 2 - yAnchor) * 2
        );
        // console.log(window.innerWidth, window.innerHeight, xAnchor, yAnchor, (window.innerWidth / 2 - xAnchor) * 2, (window.innerHeight / 2 - yAnchor) * 2);
        subctx.rotate(ROT_SPD);
        bgAnimationAngle += ROT_SPD;
        if (bgAnimationAngle > Math.PI * 2) bgAnimationAngle = 0;
    }

    function loop() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (bgOnload) bgLoop();
        for (let i = 0; i < numOfBubbles; i++) {
            let curBubble = bubbleArray[i];
            let radius = curBubble.baseRadius * map(curBubble.y, 0, window.innerHeight + 75, 0, 1);
            ctx.globalAlpha =
                curBubble.baseAlpha * map(curBubble.y, 0, window.innerHeight * 0.5 + 75, 0, 1);
            ctx.fillStyle = "rgb(15, 34, 76)";
            ctx.beginPath();
            ctx.arc(curBubble.x, curBubble.y, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            /*
      const gradient = ctx.createRadialGradient(
        curBubble.x,
        curBubble.y,
        radius,
        curBubble.x,
        curBubble.y,
        radius * 1
      );
      gradient.addColorStop(0, `rgba(15, 34, 76, 1)`);
      gradient.addColorStop(1, `rgba(15, 34, 76, 0)`);
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(curBubble.x, curBubble.y, radius * 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      */
            curBubble.y -= curBubble.velocity;
            if (curBubble.y - radius * 2 <= 0) {
                curBubble.y = window.innerHeight * 0.5 + curBubble.baseRadius * 2;
            }
            if (i % 2 === 1) {
                curBubble.x += Math.sin((Date.now() * SHAKE_RATE) / 4 + curBubble.sinOffset) * 2;
            } else {
                curBubble.x -= Math.sin((Date.now() * SHAKE_RATE) / 4 + curBubble.sinOffset) * 2;
            }
        }
        ctx.globalAlpha = 1;
        const gradientBg = ctx.createLinearGradient(
            0,
            window.innerHeight * 0.5,
            0,
            window.innerHeight / 4
        );
        gradientBg.addColorStop(0, "rgba(150, 150, 200, 1)");
        gradientBg.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradientBg;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function animate() {
        resizeCanvas();
        const bubbleAnimator = new FrameAnimater();
        bubbleAnimator.setCallback(loop);
        bubbleAnimator.setFrameRate(30);
        generateBubbles();
        shared.game.bubbleAnimator = bubbleAnimator;
        setTimeout(() => {
            bubbleAnimator.start();
            document.getElementById("backgroundCanvas").classList.add("visible");
        }, 100);
    }

    animate();
})(window);

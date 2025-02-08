import { simphiPlayer } from "../playerMain";
import { audio } from "@utils/js/aup";

const valert = str => console.error(str);
let ready = false;
let manual = false;
let recording = false;
const video = {
    /** @type {HTMLDivElement} */
    container: null,
    createUI() {
        if (this.container) return;
        this.container = document.createElement("div");
        this.container.textContent = "VR";
        Object.assign(this.container.style, {
            background: "rgb(139, 195, 74)",
            color: "rgb(240, 241, 254)",
            borderRadius: "2vmin",
            padding: "1vmin",
            zIndex: "150",
            position: "absolute",
            fontFamily: '"Saira"',
            fontSize: "4vmin",
            opacity: "0.8",
            lineHeight: "initial",
            left: "100px",
            top: "100px",
        });
        this.container.addEventListener("mousedown", evt => {
            evt.preventDefault();
            let moved = false;
            const onmove = getMoveFn(this.container, evt, () => (moved = true));
            window.addEventListener("mousemove", onmove);
            window.addEventListener(
                "mouseup",
                () => {
                    window.removeEventListener("mousemove", onmove);
                    if (!moved) record();
                },
                { once: true }
            );
        });
        this.container.addEventListener("touchstart", evt => {
            evt.preventDefault();
            let moved = false;
            const onmove = getMoveFn(this.container, evt, () => (moved = true));
            window.addEventListener("touchmove", onmove, { passive: false });
            window.addEventListener(
                "touchend",
                () => {
                    window.removeEventListener("touchmove", onmove);
                    if (!moved) record();
                },
                { once: true }
            );
        });
        simphiPlayer.app.stage.appendChild(this.container);
    },
    destroyUI() {
        if (!this.container) return;
        this.container.remove();
        this.container = null;
    },
    // msdest: null,
    record() {
        if (!audio.actx.createMediaStreamDestination) {
            valert("Recording Failed: Your browser does not support MediaStreamDestination");
            return;
        }
        if (!simphiPlayer.app.canvas.captureStream) {
            valert(
                "Recording Failed: Your browser does not support HTMLCanvasElement.captureStream"
            );
            return;
        }
        if (!this.msdest) this.msdest = audio.actx.createMediaStreamDestination();
        if (!this.msdest) return;
        audio.dest = this.msdest;
        const support = [
            "video/mp4;codecs=avc1",
            "video/mp4;codecs=mp4a",
            "video/webm;codecs=vp9,pcm",
            "video/webm;codecs=vp8,pcm",
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp8,opus",
        ].find(n => MediaRecorder.isTypeSupported(n));
        const cStream = simphiPlayer.app.canvas.captureStream();
        const aStream = this.msdest.stream;
        // console.log(aStream.getAudioTracks()[0])
        const mixStream = new MediaStream([
            cStream.getVideoTracks()[0],
            aStream.getAudioTracks()[0],
        ]);
        try {
            const recorder = new MediaRecorder(mixStream, {
                videoBitsPerSecond: 2e7,
                mimeType: support || "",
            }); // mixStream
            const chunks = [];
            recorder.ondataavailable = evt => evt.data && evt.data.size && chunks.push(evt.data);
            recorder.onstop = () => {
                // mixStream.getTracks().forEach(n => n.stop());
                cStream.getTracks().forEach(n => n.stop());
                if (chunks.length) {
                    const blob = new Blob(chunks);
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `${parseInt(Date.now() / 1e3)}.${support.match(/\/(.+)?;/)[1]}`;
                    a.click();
                    chunks.length = 0;
                } else valert("Recording Failed");
            };
            recorder.start();
            recording = true;
            this.stop = () => {
                recorder.stop();
                recording = false;
            };
        } catch (e) {
            valert(`Recording Failed: ${e.message}`);
        }
    },
    stop() {},
};
function record() {
    if (ready) {
        if (recording) {
            video.container.style.background = "rgb(139, 195, 74)";
            video.stop();
        } else {
            video.container.style.background = "rgb(195, 75, 79)";
            video.record();
        }
    } else {
        manual = !manual;
        if (manual) video.container.textContent = "SR";
        else video.container.textContent = "VR";
    }
}
/**
 * @param {HTMLInputElement} checkbox
 * @param {HTMLDivElement} container
 */
function callback(checkbox, _container) {
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            video.createUI();
            simphiPlayer.before.set("video", () => {
                ready = true;
                if (!manual) record();
            });
            simphiPlayer.end.set("video", () => {
                if (recording) record();
                ready = false;
            });
        } else {
            video.destroyUI();
            simphiPlayer.before.delete("video");
            simphiPlayer.end.delete("video");
        }
    });
}
/** @param {HTMLDivElement} div */
function getMoveFn(div, evt, onmove) {
    /** @type {MouseEvent|Touch} */
    const evt1 = evt.changedTouches ? evt.changedTouches[0] : evt;
    const cx = evt1.pageX;
    const cy = evt1.pageY;
    const sx = div.offsetLeft;
    const sy = div.offsetTop;
    const dw = div.offsetWidth / 2;
    const dh = div.offsetHeight / 2;
    const parent = div.parentElement;
    return function (evt2) {
        /** @type {MouseEvent|Touch} */
        const evt3 = evt2.changedTouches ? evt2.changedTouches[0] : evt2;
        const dx = sx + evt3.pageX - cx + dw;
        const dy = sy + evt3.pageY - cy + dh;
        const pw = (dw / parent.offsetWidth) * 100;
        const ph = (dh / parent.offsetHeight) * 100;
        const px = (dx / parent.offsetWidth) * 100;
        const py = (dy / parent.offsetHeight) * 100;
        div.style.left = px > 50 ? "auto" : `${Math.max(0, px - pw)}%`;
        div.style.right = px > 50 ? `${100 - Math.min(100, px + pw)}%` : "auto";
        div.style.top = py > 50 ? "auto" : `${Math.max(0, py - ph)}%`;
        div.style.bottom = py > 50 ? `${100 - Math.min(100, py + ph)}%` : "auto";
        onmove();
    };
}

const videoRecorder = {
    _enabled: false,
    enable: () => {
        if (videoRecorder._enabled) return;
        video.createUI();
        simphiPlayer.before.set("video", () => {
            ready = true;
            if (!manual) record();
        });
        simphiPlayer.end.set("video", () => {
            if (recording) record();
            ready = false;
        });
        videoRecorder._enabled = true;
    },
    disable: () => {
        if (!videoRecorder._enabled) return;
        video.destroyUI();
        simphiPlayer.before.delete("video");
        simphiPlayer.end.delete("video");
        videoRecorder._enabled = false;
    },
};
export default videoRecorder;

// import { decodeAlt } from '/src/utils/imgAny';
// const $id = query => document.getElementById(query);
// const $ = query => document.body.querySelector(query);
const flag0 = "flag{\x71w\x71}";

(function () {
    const t = new Date();
    if (t.getDate() !== 1 || t.getMonth() !== 3) return;
    import("./reverse.js");
})();
hook.before.set(flag0, () => {
    const md5 = hook.chartData.chartsMD5.get(hook.selectchart.value);
    //console.log(hook.chartInfo.name);
    const hashDF = [
        "cdb5987ad81b70e3dc96153af2efaa61",
        "86d23af0cc595a703241536a2d29ee4b",
        "f5f8c244d317006103b67e1cdf6eb85b",
        "0e8ff64e65bf35382e30f980b5eec041",
    ];
    if (md5 === "ab9d2cc3eb569236ead459ad4caba109") hook.now.set(flag0, loadModYukiOri());
    else if (hashDF.includes(md5) && hook.chartInfo.name === "Distorted Fate ")
        import("./DFLevelEffect.js").then(({ loadMod }) => hook.now.set(flag0, loadMod()));
    // else import('./321LevelEffect.js').then(({ loadMod }) => hook.now.set(flag0, loadMod()));
    else hook.now.delete(flag0);
});

function loadModYukiOri() {
    //console.log('好耶');
    const analyser = hook.audio.actx.createAnalyser();
    analyser.fftSize = 4096;
    // analyser.minDecibels = -180;
    const getFreq = () => {
        // progress变为频谱图
        const bufferLength = analyser.frequencyBinCount;
        const freq = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(freq);
        const avg = freq.reduce((a, b) => a + b) / bufferLength;
        return Math.min(1, (avg / 255) * 2.15); // FIXME: more accurate formula
    };
    let flagMusic = null;
    let flagPerfect = NaN;
    let flagGood = NaN;
    let flagBad = NaN;
    let flagEm = "";
    let flagN = false;
    const setFlag = (flag, em, n) => {
        flagEm = em;
        flagN = n;
        return flag;
    };
    return time => {
        const time1 = time * 1.95;
        const bgMusic = hook.tmps.bgMusicHack();
        if (bgMusic && bgMusic !== flagMusic) {
            bgMusic.connect(analyser); // ?
            flagMusic = bgMusic;
        }
        if (time1 < 168) {
            hook.stat.numOfNotes = 305;
            hook.chartInfo.difficultyString = "lN\u2002Lv.I2";
            hook.tmps.progress = time1 / 218;
        } else if (time1 < 169) {
            const progress = 1 - (169 - time1) ** 3; // easeCubicOut
            hook.stat.numOfNotes = (305 + 2195 * progress) | 0;
            hook.tmps.progress = getFreq();
        } else {
            hook.stat.numOfNotes = 2500;
            hook.tmps.progress = getFreq();
        }
        if (time1 > 325 && time1 < 358) {
            // 监听判定变化
            const statusP = hook.stat.perfect;
            const statusG = hook.stat.good;
            const statusB = hook.stat.bad;
            if (isNaN(flagPerfect)) flagPerfect = statusP;
            if (isNaN(flagGood)) flagGood = statusG;
            if (isNaN(flagBad)) flagBad = statusB;
            if (statusP !== flagPerfect)
                flagPerfect = setFlag(statusP, "\uff2f(\u2267\u25bd\u2266)\uff2f", true);
            else if (statusG !== flagGood)
                flagGood = setFlag(statusG, "(\uff3e\u03c9\uff3e)", true);
            else if (statusB !== flagBad) flagBad = setFlag(statusB, "(\u2299\ufe4f\u2299;)", true);
            // 监听时间变化
            if (time1 < 327) setFlag(null, "(\u2299o\u2299)", false);
            else if (time1 > 334 && time1 < 335) setFlag(null, "(\u2299o\u2299)", false);
            else if (time1 > 342 && time1 < 343) setFlag(null, "(\u2299o\u2299)", false);
            else if (time1 > 350 && time1 < 351) setFlag(null, "(\u2299o\u2299)", false);
            else if (!flagN) flagEm = "(\u2299ω\u2299)";
            hook.tmps.combo = flagEm;
        }
    };
}
function setNoReferrer(handler = () => {}) {
    const meta = Object.assign(document.createElement("meta"), {
        content: "no-referrer",
        name: "referrer",
    });
    document.head.appendChild(meta);
    handler();
    meta.remove();
}

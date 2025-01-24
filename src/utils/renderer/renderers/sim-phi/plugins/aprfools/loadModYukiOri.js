export function loadModYukiOri(hook) {
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
        const bgMusic = hook.tmps.bgMusic();
        if (bgMusic && bgMusic !== flagMusic) {
            bgMusic.connect(analyser); // ?
            flagMusic = bgMusic;
        }
        if (time1 < 168) {
            hook.stat.numOfNotes = 305;
            hook.tmps.level = "lN\u2002Lv.I2";
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

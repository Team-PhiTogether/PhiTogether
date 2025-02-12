import { simphiPlayer } from "../playerMain";
import { drawRoundRect } from "../utils/canvas";
import shared from "@utils/js/shared.js";

export const gauge = {
    value: 100,
    dead: false,
    _flags: [null, 0, 0, 0, 0, 0, 0, 0],
    reset() {
        gauge.value = 100;
        gauge.dead = false;
    },
    init() {
        gauge.reset();
        gauge._flags[0] = simphiPlayer.app.chart;
        for (let i = 1; i < 8; i++) gauge._flags[i] = simphiPlayer.stat.noteRank[i];
    },
    calc(time) {
        if (gauge._flags[0] !== simphiPlayer.app.chart) gauge.init();
        if (gauge.dead) {
            for (const note of simphiPlayer.app.notes) {
                if (!note.scored) {
                    note.status = 2;
                    simphiPlayer.stat.addCombo(2, note.type);
                    note.scored = true;
                }
            }
            simphiPlayer.timeBgm = simphiPlayer.curTime = simphiPlayer.app.bgMusic.duration;
            // gauge.reset();
            return;
        }
        const { noteRank } = simphiPlayer.stat;
        gauge.value -= (noteRank[6] - gauge._flags[6]) * 2.5;
        gauge.value += (noteRank[7] - gauge._flags[7]) * 0.025;
        gauge.value += (noteRank[5] - gauge._flags[5]) * 0.1;
        gauge.value += (noteRank[4] - gauge._flags[4]) * 0.2;
        gauge.value += (noteRank[1] - gauge._flags[1]) * 0.1;
        gauge.value += (noteRank[3] - gauge._flags[3]) * 0.025;
        gauge.value -= (noteRank[2] - gauge._flags[2]) * 5;
        gauge.value = Math.min(gauge.value, 100);
        if (gauge.value <= 0 && shared.game.ptmain.gameConfig.stopWhenNoLife) gauge.dead = true;
        for (let i = 1; i < 8; i++) gauge._flags[i] = simphiPlayer.stat.noteRank[i];
    },
    draw() {
        if (!shared.game.ptmain.gameConfig.enableLife) return;
        const gaugeValue = Math.max(gauge.value / 100, 0);
        gauge._drawGaugeBar("#3f3b71", 1);
        simphiPlayer.app.ctxos.fillStyle = "#fff";
        simphiPlayer.app.ctxos.font = `${simphiPlayer.app.lineScale * 0.5}px Saira`;
        simphiPlayer.app.ctxos.textAlign = "left";
        simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.pause.alpha;
        simphiPlayer.app.ctxos.fillText(
            "LIFE",
            simphiPlayer.app.lineScale * 1.75 + simphiPlayer.tmps.statStatus.pause.offsetX,
            simphiPlayer.app.lineScale * 0.95 + simphiPlayer.tmps.statStatus.pause.offsetY
        );
        simphiPlayer.app.ctxos.textAlign = "right";
        simphiPlayer.app.ctxos.fillText(
            shared.game.ptmain.playConfig.mode === "preview" ? "∞" : gaugeValue.toFixed(3) * 1000,
            simphiPlayer.app.lineScale * 6 + simphiPlayer.tmps.statStatus.pause.offsetX,
            simphiPlayer.app.lineScale * 0.95 + simphiPlayer.tmps.statStatus.pause.offsetY
        );
        gauge._drawGaugeBar(gaugeValue <= 0.25 ? "#f00" : "#0ff", gaugeValue);
    },
    _drawGaugeBar(c, p) {
        simphiPlayer.app.ctxos.fillStyle = c;
        drawRoundRect(
            simphiPlayer.app.ctxos,
            simphiPlayer.app.lineScale * 1.75 + simphiPlayer.tmps.statStatus.pause.offsetX,
            simphiPlayer.app.lineScale * 1.1 + simphiPlayer.tmps.statStatus.pause.offsetY,
            simphiPlayer.app.lineScale * 4.25 * Math.max(p, 0),
            simphiPlayer.app.lineScale * 0.4,
            simphiPlayer.app.lineScale * 0.1
        ).fill();
    },
};

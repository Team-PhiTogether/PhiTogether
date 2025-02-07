import { drawRoundRect } from "../utils/canvas";
import shared from "@utils/js/shared.js";

export const gauge = {
    value: 100,
    dead: false,
    _flags: [null, 0, 0, 0, 0, 0, 0, 0],
    bind(player) {
        gauge.player = player;
    },
    reset() {
        gauge.value = 100;
        gauge.dead = false;
    },
    init() {
        gauge.reset();
        gauge._flags[0] = gauge.player.app.chart;
        for (let i = 1; i < 8; i++) gauge._flags[i] = gauge.player.stat.noteRank[i];
    },
    calc(time) {
        if (gauge._flags[0] !== gauge.player.app.chart) gauge.init();
        if (gauge.dead) {
            for (const note of gauge.player.app.notes) {
                if (!note.scored) {
                    note.status = 2;
                    gauge.player.stat.addCombo(2, note.type);
                    note.scored = true;
                }
            }
            gauge.player.timeBgm = gauge.player.curTime = gauge.player.app.bgMusic.duration;
            // gauge.reset();
            return;
        }
        const { noteRank } = gauge.player.stat;
        gauge.value -= (noteRank[6] - gauge._flags[6]) * 2.5;
        gauge.value += (noteRank[7] - gauge._flags[7]) * 0.025;
        gauge.value += (noteRank[5] - gauge._flags[5]) * 0.1;
        gauge.value += (noteRank[4] - gauge._flags[4]) * 0.2;
        gauge.value += (noteRank[1] - gauge._flags[1]) * 0.1;
        gauge.value += (noteRank[3] - gauge._flags[3]) * 0.025;
        gauge.value -= (noteRank[2] - gauge._flags[2]) * 5;
        gauge.value = Math.min(gauge.value, 100);
        if (gauge.value <= 0 && shared.game.ptmain.gameConfig.stopWhenNoLife) gauge.dead = true;
        for (let i = 1; i < 8; i++) gauge._flags[i] = gauge.player.stat.noteRank[i];
    },
    draw() {
        if (!shared.game.ptmain.gameConfig.enableLife) return;
        const gaugeValue = Math.max(gauge.value / 100, 0);
        gauge._drawGaugeBar("#3f3b71", 1);
        gauge.player.app.ctxos.fillStyle = "#fff";
        gauge.player.app.ctxos.font = `${gauge.player.app.lineScale * 0.5}px Saira`;
        gauge.player.app.ctxos.textAlign = "left";
        gauge.player.app.ctxos.globalAlpha = gauge.player.tmps.statStatus.pause.alpha;
        gauge.player.app.ctxos.fillText(
            "LIFE",
            gauge.player.app.lineScale * 1.75 + gauge.player.tmps.statStatus.pause.offsetX,
            gauge.player.app.lineScale * 0.95 + gauge.player.tmps.statStatus.pause.offsetY
        );
        gauge.player.app.ctxos.textAlign = "right";
        gauge.player.app.ctxos.fillText(
            shared.game.ptmain.playConfig.mode === "preview" ? "∞" : gaugeValue.toFixed(3) * 1000,
            gauge.player.app.lineScale * 6 + gauge.player.tmps.statStatus.pause.offsetX,
            gauge.player.app.lineScale * 0.95 + gauge.player.tmps.statStatus.pause.offsetY
        );
        gauge._drawGaugeBar(gaugeValue <= 0.25 ? "#f00" : "#0ff", gaugeValue);
    },
    _drawGaugeBar(c, p) {
        gauge.player.app.ctxos.fillStyle = c;
        drawRoundRect(
            gauge.player.app.ctxos,
            gauge.player.app.lineScale * 1.75 + gauge.player.tmps.statStatus.pause.offsetX,
            gauge.player.app.lineScale * 1.1 + gauge.player.tmps.statStatus.pause.offsetY,
            gauge.player.app.lineScale * 4.25 * Math.max(p, 0),
            gauge.player.app.lineScale * 0.4,
            gauge.player.app.lineScale * 0.1
        ).fill();
    },
};
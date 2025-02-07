import { simphiPlayer } from "@/utils/renderer/renderers/sim-phi/playerMain";
import shared from "@utils/js/shared";

export function drawHold(note, realTime) {
    if (simphiPlayer.app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored) return;
    const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
    const nsr = simphiPlayer.app.noteScaleRatio * (note.size || 1);
    if (!note.visible || note.realTime + note.realHoldTime < realTime) return; //qwq
    simphiPlayer.app.ctxos.globalAlpha =
        note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
    if (simphiPlayer.qwqwq) simphiPlayer.app.ctxos.globalAlpha *= Math.max(1 + (simphiPlayer.timeInfo.timeChart - note.realTime) / 1.5, 0);
    simphiPlayer.app.ctxos.setTransform(
        nsr * note.cosr,
        nsr * note.sinr,
        -nsr * note.sinr,
        nsr * note.cosr,
        note.offsetX,
        note.offsetY
    );
    const baseLength = (simphiPlayer.app.scaleY / nsr) * note.speed * simphiPlayer.app.speed;
    const holdLength = baseLength * note.realHoldTime;
    if (note.realTime > realTime) {
        simphiPlayer.noteRender.note[HL ? "HoldHeadHL" : "HoldHead"].head(simphiPlayer.app.ctxos);
        simphiPlayer.noteRender.note[HL ? "HoldHL" : "Hold"].body(simphiPlayer.app.ctxos, -holdLength, holdLength);
    } else {
        simphiPlayer.noteRender.note[HL ? "HoldHL" : "Hold"].body(
            simphiPlayer.app.ctxos,
            -holdLength,
            holdLength - baseLength * (realTime - note.realTime)
        );
    }
    simphiPlayer.noteRender.note["HoldEnd"].tail(simphiPlayer.app.ctxos, -holdLength);
}
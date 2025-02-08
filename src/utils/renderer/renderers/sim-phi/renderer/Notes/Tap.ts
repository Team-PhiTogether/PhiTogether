import { simphiPlayer } from "@/utils/renderer/renderers/sim-phi/playerMain";
import shared from "@utils/js/shared";
import { clip } from "@renderers/sim-phi/utils/clip";

export function drawTap(note) {
    if (simphiPlayer.app.pauseTime && shared.game.ptmain.gameConfig.reviewWhenResume && note.scored)
        return;
    const HL = note.isMulti && shared.game.ptmain.gameConfig.highLight;
    const nsr = simphiPlayer.app.noteScaleRatio * (note.size || 1);
    if (!note.visible || (note.scored && !note.badtime)) return;
    simphiPlayer.app.ctxos.setTransform(
        nsr * note.cosr,
        nsr * note.sinr,
        -nsr * note.sinr,
        nsr * note.cosr,
        note.offsetX,
        note.offsetY
    );
    if (note.badtime) {
        simphiPlayer.app.ctxos.globalAlpha = 1 - clip((performance.now() - note.badtime) / 500);
        simphiPlayer.noteRender.note["TapBad"].full(simphiPlayer.app.ctxos);
    } else {
        simphiPlayer.app.ctxos.globalAlpha =
            note.alpha || (note.showPoint && shared.game.ptmain.gameConfig.showPoint ? 0.45 : 0);
        if (simphiPlayer.qwqwq)
            simphiPlayer.app.ctxos.globalAlpha *= Math.max(
                1 + (simphiPlayer.timeInfo.timeChart - note.realTime) / 1.5,
                0
            ); //过线前1.5s出现
        simphiPlayer.noteRender.note[HL ? "TapHL" : "Tap"].full(simphiPlayer.app.ctxos);
    }
}

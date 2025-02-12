import { simphiPlayer } from "@renderers/sim-phi/playerMain";
import { audio } from "@utils/js/aup";
import shared from "@utils/js/shared";

export function playBgm(data: AudioBuffer, offset?: number) {
    if (!offset) offset = 0;
    simphiPlayer.timeInfo.curTime_ms = performance.now();
    simphiPlayer.tmps.bgMusic = audio.play(data, {
        offset: offset,
        playbackrate: simphiPlayer.app.speed,
        gainrate: simphiPlayer.app.musicVolume,
        interval: shared.game.ptmain.gameConfig.autoDelay ? 1 : 0,
    });
}
export function playVideo(data: HTMLVideoElement, offset?: number) {
    if (!offset) offset = 0;
    data.currentTime = offset;
    data.playbackRate = simphiPlayer.app.speed;
    data.muted = true;
    return data.play();
}

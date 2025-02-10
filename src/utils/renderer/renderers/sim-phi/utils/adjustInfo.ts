import { simphiPlayer } from "../playerMain";
import shared from "@utils/js/shared";

//自动填写歌曲信息
export function adjustInfo() {
    for (const i of simphiPlayer.chartData.chartInfoData) {
        if (simphiPlayer.selectchart.value.trim() === i.Chart) {
            if (i.Name) simphiPlayer.inputName.value = i.Name;
            if (i.Musician) simphiPlayer.inputArtist.value = i.Musician; //Alternative
            if (i.Composer) simphiPlayer.inputArtist.value = i.Composer; //Alternative
            if (i.Artist) simphiPlayer.inputArtist.value = i.Artist;
            if (i.Level) {
                simphiPlayer.chartData.levelText = i.Level;
                const p = simphiPlayer.chartData.levelText
                    .toLocaleUpperCase()
                    .split("LV.")
                    .map(a => a.trim());
                if (p[0]) simphiPlayer.selectDifficulty.value = p[0];
                if (p[1]) simphiPlayer.selectLevel.value = p[1];
            }
            if (i.Illustrator) simphiPlayer.inputIllustrator.value = i.Illustrator;
            if (i.Designer) simphiPlayer.inputCharter.value = i.Designer;
            if (i.Charter) simphiPlayer.inputCharter.value = i.Charter;
            if (simphiPlayer.chartData.bgms.has(i.Music)) simphiPlayer.selectbgm.value = i.Music;
            if (simphiPlayer.chartData.bgs.has(i.Image)) {
                simphiPlayer.selectbg.value = i.Image;
                simphiPlayer.selectbg.dispatchEvent(new Event("change"));
            }
            if (isFinite((i.AspectRatio = parseFloat(i.AspectRatio)))) {
                shared.game.ptmain.gameConfig.aspectRatio = i.AspectRatio;
            }
            if (isFinite((i.ScaleRatio = parseFloat(i.ScaleRatio)))) {
                //Legacy
                shared.game.ptmain.gameConfig.noteScale = 8080 / i.ScaleRatio;
                simphiPlayer.app.setNoteScale(8080 / i.ScaleRatio);
            }
            if (isFinite((i.NoteScale = parseFloat(i.NoteScale)))) {
                shared.game.ptmain.gameConfig.noteScale = i.NoteScale;
                simphiPlayer.app.setNoteScale(i.NoteScale);
            }
            if (isFinite((i.GlobalAlpha = parseFloat(i.GlobalAlpha)))) {
                //Legacy
                shared.game.ptmain.gameConfig.backgroundDim = i.GlobalAlpha;
                shared.game.ptmain.gameConfig.backgroundDim = Number(i.GlobalAlpha);
            }
            if (isFinite((i.BackgroundDim = parseFloat(i.BackgroundDim)))) {
                shared.game.ptmain.gameConfig.backgroundDim = i.BackgroundDim;
                shared.game.ptmain.gameConfig.backgroundDim = Number(i.BackgroundDim);
            }
            if (isFinite((i.Offset = parseFloat(i.Offset))))
                shared.game.ptmain.chartOffsetSurface = i.Offset;
        }
    }
}
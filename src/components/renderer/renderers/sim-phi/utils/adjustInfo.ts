import { simphiPlayer } from "../playerMain";
import shared from "@utils/js/shared";

//自动填写歌曲信息
export function adjustInfo() {
    for (const i of simphiPlayer.chartData.chartInfoData) {
        if (simphiPlayer.selectchart.value.trim() === i.Chart) {
            if (i.Name) simphiPlayer.chartInfo.name = i.Name;
            if (i.Musician) simphiPlayer.chartInfo.composer = i.Musician; //Alternative
            if (i.Composer) simphiPlayer.chartInfo.composer = i.Composer; //Alternative
            if (i.Artist) simphiPlayer.chartInfo.composer = i.Artist;
            if (i.Level) {
                simphiPlayer.chartData.levelText = i.Level;
                const p = simphiPlayer.chartData.levelText
                    .toLocaleUpperCase()
                    .split("LV.")
                    .map(a => a.trim());
                simphiPlayer.chartInfo.difficultyString = `${p[0] ?? "SP"} Lv.${p[0] ?? "?"}`;
            }
            if (i.Illustrator) simphiPlayer.chartInfo.illustrator = i.Illustrator;
            if (i.Designer) simphiPlayer.chartInfo.charter = i.Designer;
            if (i.Charter) simphiPlayer.chartInfo.charter = i.Charter;
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

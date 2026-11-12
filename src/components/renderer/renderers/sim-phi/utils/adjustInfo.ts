import { simphiPlayer } from "../playerMain";
import shared from "@utils/js/shared";

// 提取文件名的辅助函数，防止因为压缩包内带文件夹导致路径不匹配
function getBasename(filePath?: string): string {
    if (!filePath) return "";
    // 兼容 Windows 的 \ 和 Linux/Mac 的 /
    return filePath.split(/[/\\]/).pop()?.trim() || "";
}

// 自动填写歌曲信息
export function adjustInfo() {
    console.log("【adjustInfo 被执行了！】");
    const selectedChart = simphiPlayer.selectchart.value.trim();

    for (const i of simphiPlayer.chartData.chartInfoData) {
        // 兼容处理：两边都提取纯文件名进行对比
        const baseInfo = getBasename(i.Chart);
        const baseSelected = getBasename(selectedChart);
        
        console.log("【对比现场】", { selectedChart, infoChart: i.Chart, baseSelected, baseInfo });

        if (baseSelected === baseInfo) {
            // 收集所有需要更新的字段，最后一次性赋予，强制触发 Vue 响应式
            const newInfo: any = {};
            
            if (i.Name) newInfo.name = i.Name;
            
            // 曲师兼容处理
            if (i.Musician) newInfo.composer = i.Musician;
            if (i.Composer) newInfo.composer = i.Composer;
            if (i.Artist) newInfo.composer = i.Artist;

            // 谱师兼容处理
            if (i.Designer) newInfo.charter = i.Designer;
            if (i.Charter) newInfo.charter = i.Charter;
            
            if (i.Illustrator) newInfo.illustrator = i.Illustrator;

            // 难度解析修复
            if (i.Level) {
                simphiPlayer.chartData.levelText = i.Level;
                const p = simphiPlayer.chartData.levelText
                    .toLocaleUpperCase()
                    .split("LV.")
                    .map(a => a.trim());
                // 修复原先的 p[0] 写错的问题，等级应该是 p[1]
                newInfo.difficultyString = `${p[0] || "SP"} Lv.${p[1] || "?"}`;
            }

            // 使用 Object.assign 强制触发响应式更新
            Object.assign(simphiPlayer.chartInfo, newInfo);

            // 音乐和曲绘也要做路径兼容，取 BaseName 去匹配
            const musicName = getBasename(i.Music);
            if (musicName && simphiPlayer.chartData.bgms.has(musicName)) {
                simphiPlayer.selectbgm.value = musicName;
            }
            
            const imageName = getBasename(i.Image);
            if (imageName && simphiPlayer.chartData.bgs.has(imageName)) {
                simphiPlayer.selectbg.value = imageName;
                simphiPlayer.selectbg.dispatchEvent(new Event("change"));
            }

            // 其他高级参数保持不变
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

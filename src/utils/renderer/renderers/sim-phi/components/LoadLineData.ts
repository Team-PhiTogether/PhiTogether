import { simphiPlayer } from "../playerMain";
import { msgHandler } from "@utils/js/msgHandler";
import shared from "@utils/js/shared";
import { LineImage } from "./LineImage";

export async function loadLineData() {
    for (const i of simphiPlayer.app.lines) {
        i.imageW = 6220.8; //1920
        i.imageH = 7.68; //3
        i.imageL = [simphiPlayer.res["JudgeLine"], simphiPlayer.res["JudgeLineMP"], null, simphiPlayer.res["JudgeLineFC"]];
        i.imageS = 1; //2.56
        i.imageA = 1; //1.5625
        i.imageD = false;
        i.imageC = true;
        i.imageU = true;
    }
    for (const i of simphiPlayer.chartData.chartLineData) {
        if (simphiPlayer.selectchart.value === i.Chart) {
            if (!simphiPlayer.app.lines[i.LineId]) {
                msgHandler.sendWarning(
                    shared.game.i18n.t("simphi.playErr.judgeLineDoesentExist", [i.LineId])
                );
                continue;
            }
            if (!simphiPlayer.chartData.bgs.has(i.Image))
                msgHandler.sendWarning(
                    shared.game.i18n.t("simphi.playErr.imageDoesentExist", [i.image])
                );
            /** @type {ImageBitmap} */
            const image = simphiPlayer.chartData.bgs.get(i.Image) || simphiPlayer.res["NoImageBlack"];
            simphiPlayer.app.lines[i.LineId].imageW = image.width;
            simphiPlayer.app.lines[i.LineId].imageH = image.height;
            if (!simphiPlayer.lineImages.has(image)) simphiPlayer.lineImages.set(image, new LineImage(image));
            const lineImage = simphiPlayer.lineImages.get(image);
            simphiPlayer.app.lines[i.LineId].imageL = [
                image,
                await lineImage.getMP(),
                await lineImage.getAP(),
                await lineImage.getFC(),
            ];
            simphiPlayer.app.lines[i.LineId].isCustomImage = simphiPlayer.chartData.bgs.get(i.Image) ? true : false;
            if (isFinite((i.Vert = parseFloat(i.Vert)))) {
                //Legacy
                simphiPlayer.app.lines[i.LineId].imageS = (Math.abs(i.Vert) * 1080) / image.height;
                simphiPlayer.app.lines[i.LineId].imageU = i.Vert > 0;
            }
            if (isFinite((i.Horz = parseFloat(i.Horz)))) simphiPlayer.app.lines[i.LineId].imageA = i.Horz; //Legacy
            if (isFinite((i.IsDark = parseFloat(i.IsDark))))
                simphiPlayer.app.lines[i.LineId].imageD = !!i.IsDark; //Legacy
            if (isFinite((i.Scale = parseFloat(i.Scale)))) simphiPlayer.app.lines[i.LineId].imageS = i.Scale;
            if (isFinite((i.Aspect = parseFloat(i.Aspect)))) simphiPlayer.app.lines[i.LineId].imageA = i.Aspect;
            if (isFinite((i.UseBackgroundDim = parseFloat(i.UseBackgroundDim))))
                simphiPlayer.app.lines[i.LineId].imageD = !!i.UseBackgroundDim;
            if (isFinite((i.UseLineColor = parseFloat(i.UseLineColor))))
                simphiPlayer.app.lines[i.LineId].imageC = !!i.UseLineColor;
            if (isFinite((i.UseLineScale = parseFloat(i.UseLineScale))))
                simphiPlayer.app.lines[i.LineId].imageU = !!i.UseLineScale;
        }
    }
}
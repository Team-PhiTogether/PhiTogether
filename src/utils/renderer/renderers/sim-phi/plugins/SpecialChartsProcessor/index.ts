import { simphiPlayer } from "../../playerMain";
import { loadModYukiOri } from "./aprfools/loadModYukiOri";

export const flag0 = "flag{\x71w\x71}";
export const SpecialChartsProcessor = {
    before: () => {
        const md5 = simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value);
        const hashDF = [
            "cdb5987ad81b70e3dc96153af2efaa61",
            "86d23af0cc595a703241536a2d29ee4b",
            "f5f8c244d317006103b67e1cdf6eb85b",
            "0e8ff64e65bf35382e30f980b5eec041",
        ];
        const hashD321 = ["4ddcd5d923007d661911989e79fe8a59"];
        if (md5 === "ab9d2cc3eb569236ead459ad4caba109")
            simphiPlayer.now.set(flag0, loadModYukiOri(simphiPlayer));
        else if (hashDF.includes(md5) && simphiPlayer.inputName.value === "Distorted Fate ")
            import("./demo/DFLevelEffect.js").then(({ loadMod }) =>
                simphiPlayer.now.set(flag0, loadMod())
            );
        else if (hashD321.includes(md5) && simphiPlayer.inputName.value === "DESTRUCTION 3,2,1 ")
            import("./demo/321LevelEffect.js").then(({ loadMod }) =>
                simphiPlayer.now.set(flag0, loadMod())
            );
        else simphiPlayer.now.delete(flag0);
    },
}
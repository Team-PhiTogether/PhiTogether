import { ChartRenderer } from "@utils/renderer/class.ts";
import shared from "@utils/js/shared.js";

export const rendererInterface = new ChartRenderer({
    name: "sim-phi",
    displayName: "Phixos(legacy)",
    description: "Phixos legacy version by lchzh3473",

    init: () => {},
    loadRespack: url => shared.game.simphi.reloadRes(url),
    // loadChart: (url) => shared.game.simphi.reloadChart(url),
    // startGameplat: () => shared.game.simphi.startGameplat(),
});

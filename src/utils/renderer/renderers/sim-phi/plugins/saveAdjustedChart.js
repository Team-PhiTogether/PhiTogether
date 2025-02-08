import shared from "@utils/js/shared.js";
import ptdb from "@utils/ptdb";
import { downloadText } from "@utils/js/fileSaver.js";

export default async function saveAdjustedChart(app, fucktemp2) {
    if (
        fucktemp2 &&
        !(await shared.game.msgHandler.confirm(
            shared.game.ptmain.$t("simphi.adjustOffset.confirmSave")
        ))
    )
        return;
    const loadedChartMeta = JSON.parse(sessionStorage.getItem("loadedChart"));
    if (!loadedChartMeta || loadedChartMeta.isFromURL) downloadRPE(app);
    else {
        if (typeof app.chart.offset !== "number" || !hook.chartsMD5.get(hook.selectchart.value))
            shared.game.msgHandler.sendMessage(
                shared.game.ptmain.$t("simphi.adjustOffset.errorWhenSavingOffset"),
                "error"
            );
        const savedChartOffsets = await ptdb.gameConfig.get("savedChartOffsets", {});
        savedChartOffsets[hook.chartsMD5.get(hook.selectchart.value)] = app.chart.offset;
        await ptdb.gameConfig.save(savedChartOffsets, "savedChartOffsets");
        shared.game.msgHandler.sendMessage(
            shared.game.ptmain.$t("simphi.adjustOffset.offsetSaved"),
            "success"
        );
    }
}
function downloadRPE(app) {
    let text4dl, dlfilename;
    if (app.chart.chartRPE) {
        app.chart.chartRPE.META.offset = app.chart.offset * 1e3;
        text4dl = JSON.stringify(app.chart.chartRPE);
        dlfilename = `${app.chart.chartRPE.META.id}_adjusted.json`;
    } else if (app.chart.chartPec) {
        text4dl = modifyFirstLine(app.chart.chartPec, (app.chart.offset * 1e3 + 175).toFixed(0));
        dlfilename = `Chart_${inputName.value}_adjusted.pec`;
    } else
        return shared.game.msgHandler.sendMessage(
            shared.game.ptmain.$t("simphi.adjustOffset.onlyRPESupport"),
            "error"
        );
    downloadText(dlfilename, text4dl, "application/json");
    shared.game.msgHandler.sendMessage(
        shared.game.ptmain.$t("simphi.adjustOffset.adjustedChartSaved"),
        "success"
    );
}
function modifyFirstLine(inputText, newContent) {
    inputText = inputText.replaceAll("\r\n", "\n");
    const lines = inputText.split("\n");
    if (lines.length > 0) {
        lines[0] = newContent;
    }
    return lines.join("\n");
}

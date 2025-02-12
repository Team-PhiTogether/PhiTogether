import { simphiPlayer } from "@renderers/sim-phi/playerMain";
import shared from "@utils/js/shared";
import { drawRoundRect } from "../utils/canvas";
import { tween } from "../utils/tween";
import { clip } from "../utils/clip";

export function resultPageRenderer(statData) {
    (simphiPlayer.app.ctxos.shadowBlur = 40), (simphiPlayer.app.ctxos.shadowColor = "#000000");
    simphiPlayer.app.ctxos.globalAlpha = 1;
    const k = 3.7320508075688776; //tan75°

    const qwq0 =
        (simphiPlayer.app.canvasos.width - simphiPlayer.app.canvasos.height / k) / (16 - 9 / k);
    simphiPlayer.app.ctxos.setTransform(
        qwq0 / 120,
        0,
        0,
        qwq0 / 120,
        simphiPlayer.app.wlen - qwq0 * 8,
        simphiPlayer.app.hlen - qwq0 * 4.5
    ); //?

    simphiPlayer.app.ctxos.globalAlpha = 1;
    let imgWidthAct = 700 * (simphiPlayer.app.bgImage.width / simphiPlayer.app.bgImage.height),
        imgHeightAct = 700;
    if (imgWidthAct < 1200) {
        imgWidthAct = 1200;
        imgHeightAct = 1200 * (simphiPlayer.app.bgImage.height / simphiPlayer.app.bgImage.width);
    }
    simphiPlayer.app.ctxos.drawImage(
        simphiPlayer.app.bgImage,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) +
            2460.5 -
            imgWidthAct / 2,
        208 - (imgHeightAct - 645) / 2,
        imgWidthAct,
        imgHeightAct
    );

    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2010.24,
        182,
        890,
        700,
        30
    );
    simphiPlayer.app.ctxos.globalCompositeOperation = "destination-in";
    simphiPlayer.app.ctxos.fill();
    simphiPlayer.app.ctxos.globalCompositeOperation = "source-over";
    simphiPlayer.app.ctxos.stroke();

    simphiPlayer.app.ctxos.globalAlpha = 0.5;
    simphiPlayer.app.ctxos.fillStyle = "black";
    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2740,
        180,
        800,
        360,
        30
    ).fill();

    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2040,
        563,
        800,
        150,
        30
    ).fill();
    drawRoundRect(
        simphiPlayer.app.ctxos,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2040,
        735,
        800,
        150,
        30
    ).fill();

    //歌名和等级
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.restore();
    simphiPlayer.app.ctxos.setTransform(
        qwq0 / 120,
        0,
        0,
        qwq0 / 120,
        simphiPlayer.app.wlen - qwq0 * 8,
        simphiPlayer.app.hlen - qwq0 * 4.5
    ); //?
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `73.5px Saira`;
    const dxsnm = simphiPlayer.app.ctxos.measureText(
        simphiPlayer.inputName.value || simphiPlayer.inputName.placeholder
    ).width;
    if (dxsnm > 600) simphiPlayer.app.ctxos.font = `${(73.5 / dxsnm) * 600}px Saira`;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.inputName.value || simphiPlayer.inputName.placeholder,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2050,
        830
    );
    simphiPlayer.app.ctxos.font = `30px Saira`;
    const dxlvl = simphiPlayer.app.ctxos.measureText(simphiPlayer.chartData.levelText).width;
    if (dxlvl > 150) simphiPlayer.app.ctxos.font = `${(30 / dxlvl) * 150}px Saira`;
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.chartData.levelText,
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2860,
        835
    );
    simphiPlayer.app.ctxos.textAlign = "left";
    //Rank图标
    simphiPlayer.app.ctxos.globalAlpha = clip(
        (simphiPlayer.animationTimer.end.second - 1.3) * 3.75
    );
    const qwq2 = 293 + clip((simphiPlayer.animationTimer.end.second - 1.3) * 3.75) * 100;
    const qwq3 =
        410 - tween.ease15(clip((simphiPlayer.animationTimer.end.second - 1.3) * 1.5)) * 164;
    if (simphiPlayer.stat.lineStatus == 3)
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["FCV"],
            1685 - qwq3,
            373 - qwq3,
            qwq3 * 2,
            qwq3 * 2
        );
    else
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Ranks"][simphiPlayer.stat.rankStatus],
            1685 - qwq3,
            373 - qwq3,
            qwq3 * 2,
            qwq3 * 2
        );
    //准度和连击
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 0.8) * 1.5);
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.font = `55px Saira`;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.accStr,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2785,
        638
    );
    simphiPlayer.app.ctxos.font = `26px Saira`;
    simphiPlayer.app.ctxos.fillText(
        "ACCURACY",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2783,
        673
    );
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `55px Saira`;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.maxcombo,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2095,
        638
    );
    simphiPlayer.app.ctxos.font = `26px Saira`;
    simphiPlayer.app.ctxos.fillText(
        "MAX COMBO",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.9 - 0.25)) + 2095,
        673
    );
    // ctxos.fillStyle = statData[4];
    //分数
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `86px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 0.4) * 2.0);
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.scoreStr,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2795,
        415
    );
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.font = `25px Saira`;
    simphiPlayer.app.ctxos.fillStyle = "#83e691";
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.app.speed === 1
            ? ""
            : statData.textAboveStr.replace("{SPEED}", simphiPlayer.app.speed.toFixed(2)),
        -1920 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 1)) + 2860,
        792
    );

    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.globalAlpha = clip((simphiPlayer.animationTimer.end.second - 0.4) * 2.5);
    simphiPlayer.app.ctxos.fillStyle = "#a2e27f";
    simphiPlayer.app.ctxos.font = `25px Saira`;
    simphiPlayer.app.ctxos.fillText(
        statData.newBestStr,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2800,
        337
    );
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.font = `30px Saira`;
    simphiPlayer.app.ctxos.fillText(
        statData.scoreBest,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2800,
        460
    );
    // 	ctxos.globalAlpha = clip((qwqEnd.second - 1.87) * 2.50);
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.fillText(
        statData.scoreDelta,
        -1720 * tween.ease10(clip(simphiPlayer.animationTimer.end.second - 0.1)) + 2950,
        460
    );

    //Perfect, good, bad, miss
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.font = `45px Saira`;
    simphiPlayer.app.ctxos.textAlign = "center";
    simphiPlayer.app.ctxos.globalAlpha = clip(
        (simphiPlayer.animationTimer.end.second - 1.25) * 2.5
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.perfect,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2140,
        812
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.good,
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2288,
        812
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[6],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2395,
        812
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[2],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2502,
        812
    );
    simphiPlayer.app.ctxos.font = `20px Saira`;
    simphiPlayer.app.ctxos.fillText(
        "PERFECT",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2140,
        842
    );
    simphiPlayer.app.ctxos.fillText(
        "GOOD",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2288,
        842
    );
    simphiPlayer.app.ctxos.fillText(
        "BAD",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2395,
        842
    );
    simphiPlayer.app.ctxos.fillText(
        "MISS",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2502,
        842
    );
    simphiPlayer.app.ctxos.font = `28px Saira`;
    //Early, Late
    const qwq4 = clip(
        (simphiPlayer.qwq[3] > 0
            ? simphiPlayer.animationTimer.end.second - simphiPlayer.qwq[3]
            : 0.2 - simphiPlayer.animationTimer.end.second - simphiPlayer.qwq[3]) * 5.0
    );
    simphiPlayer.app.ctxos.textAlign = "left";
    simphiPlayer.app.ctxos.fillText(
        "EARLY",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2610,
        800
    );
    simphiPlayer.app.ctxos.fillText(
        "LATE",
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2625,
        838
    );
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[7],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2775,
        800
    );
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.stat.noteRank[3],
        -1020 * tween.ease10(clip(simphiPlayer.animationTimer.end.second * 0.8 - 0.3)) + 2775,
        838
    );
    // 控制按钮
    // // ctxos.fillStyle = "#fff";
    // ctxos.font = '40px Saira';
    // // ctxos.textAlign = 'right';
    // ctxos.fillText("BACK", 1620, 1075 + (canvasos.height / (qwq0 / 120) - 1075) / 2 - 40);
    // ctxos.textAlign = 'left';
    // ctxos.fillText("RETRY", 350, 1075 + (canvasos.height / (qwq0 / 120) - 1075) / 2 - 40);
    try {
        shared.game.graphicHandler.resultHook(simphiPlayer.app.ctx, simphiPlayer.app.ctxos);
    } catch (e) {
        console.warn(e);
    }
    (simphiPlayer.app.ctxos.shadowBlur = 0), (simphiPlayer.app.ctxos.shadowColor = "#000000");
    simphiPlayer.app.ctxos.resetTransform();
}

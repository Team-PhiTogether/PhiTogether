import { simphiPlayer } from "@renderers/sim-phi/playerMain";
import shared from "@utils/js/shared";
import { frameTimer, time2Str } from "@utils/js/common";
import { tween } from "../utils/tween";
import { drawRoundRect } from "../utils/canvas";
import { adjustSize } from "../utils/adjustSize";

import { gauge } from "../plugins/gauge.js";

import { drawNotes } from "./Notes";
import { drawLine } from "./Lines";

export function loopCanvas() {
    //尽量不要在这里出现app
    const { lineScale } = simphiPlayer.app;
    simphiPlayer.app.ctxos.clearRect(
        0,
        0,
        simphiPlayer.app.canvasos.width,
        simphiPlayer.app.canvasos.height
    ); //重置画面
    simphiPlayer.app.ctxos.globalAlpha = 1;
    //绘制背景
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.drawImage(
        simphiPlayer.tmps.bgImage,
        ...adjustSize(simphiPlayer.tmps.bgImage, simphiPlayer.app.canvasos, 1)
    );
    if (simphiPlayer.animationInfo.isInEnd && simphiPlayer.tmps.bgVideo && !simphiPlayer.qwqwq) {
        const { videoWidth: width, videoHeight: height } = simphiPlayer.tmps.bgVideo;
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.tmps.bgVideo,
            ...adjustSize({ width, height }, simphiPlayer.app.canvasos, 1)
        );
    }
    // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
    if (
        (simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5) &&
        !simphiPlayer.stat.lineStatus
    )
        drawLine(0, lineScale); //绘制判定线(背景后0)
    // if (qwq[4]) ctxos.filter = 'none';
    simphiPlayer.app.ctxos.resetTransform();
    simphiPlayer.app.ctxos.fillStyle = "#000"; //背景变暗
    if (!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67)
        simphiPlayer.app.ctxos.globalAlpha =
            tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5) *
            shared.game.ptmain.gameConfig.backgroundDim;
    else
        simphiPlayer.app.ctxos.globalAlpha =
            shared.game.ptmain.gameConfig.backgroundDim -
            tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5) *
                (shared.game.ptmain.gameConfig.backgroundDim - 0.2);
    simphiPlayer.app.ctxos.fillRect(
        0,
        0,
        simphiPlayer.app.canvasos.width,
        simphiPlayer.app.canvasos.height
    );
    if (
        (simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5) &&
        simphiPlayer.tmps.customBackDraw != null
    )
        simphiPlayer.tmps.customBackDraw(simphiPlayer.app.ctxos); // 自定义背景
    // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
    if (simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5)
        drawLine(simphiPlayer.stat.lineStatus ? 2 : 1, lineScale); //绘制判定线(背景前1)
    // if (qwq[4]) ctxos.filter = 'none';
    simphiPlayer.app.ctxos.resetTransform();
    if (simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.out.second === 0) {
        //绘制note
        drawNotes();
        if (shared.game.ptmain.gameConfig.showPoint) {
            //绘制定位点
            simphiPlayer.app.ctxos.font = `${lineScale}px Saira`;
            simphiPlayer.app.ctxos.textAlign = "center";
            for (const i of simphiPlayer.app.linesReversed) {
                simphiPlayer.app.ctxos.setTransform(
                    i.cosr,
                    i.sinr,
                    -i.sinr,
                    i.cosr,
                    i.offsetX,
                    i.offsetY
                );
                simphiPlayer.app.ctxos.globalAlpha = 1;
                simphiPlayer.app.ctxos.fillStyle = "violet";
                simphiPlayer.app.ctxos.fillRect(
                    -lineScale * 0.2,
                    -lineScale * 0.2,
                    lineScale * 0.4,
                    lineScale * 0.4
                );
                simphiPlayer.app.ctxos.fillStyle = "yellow";
                simphiPlayer.app.ctxos.globalAlpha = (i.alpha + 0.5) / 1.5;
                simphiPlayer.app.ctxos.fillText(`${i.lineId.toString()}`, 0, -lineScale * 0.3);
            }
            for (const i of simphiPlayer.app.notesReversed) {
                if (!i.visible) continue;
                simphiPlayer.app.ctxos.setTransform(
                    i.cosr,
                    i.sinr,
                    -i.sinr,
                    i.cosr,
                    i.offsetX,
                    i.offsetY
                );
                simphiPlayer.app.ctxos.globalAlpha = 1;
                simphiPlayer.app.ctxos.fillStyle = "lime";
                simphiPlayer.app.ctxos.fillRect(
                    -lineScale * 0.2,
                    -lineScale * 0.2,
                    lineScale * 0.4,
                    lineScale * 0.4
                );
                simphiPlayer.app.ctxos.fillStyle = "cyan";
                simphiPlayer.app.ctxos.globalAlpha =
                    i.realTime > simphiPlayer.timeInfo.timeChart ? 1 : 0.5;
                simphiPlayer.app.ctxos.fillText(`${i.name}:${i.line.speed}`, 0, -lineScale * 0.3);
            }
        }
    }
    // if (qwq[4]) ctxos.filter = `hue-rotate(${stat.combo*360/7}deg)`;
    simphiPlayer.hitImageList.animate(); //绘制打击特效1
    // if (qwq[4]) ctxos.filter = 'none';
    if (shared.game.ptmain.gameConfig.showCE2) simphiPlayer.hitWordList.animate(); //绘制打击特效2
    simphiPlayer.app.ctxos.globalAlpha = 1;
    //绘制进度条
    simphiPlayer.app.ctxos.setTransform(
        simphiPlayer.app.canvasos.width / 1920,
        0,
        0,
        simphiPlayer.app.canvasos.width / 1920,
        0,
        lineScale *
            (!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67
                ? tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5) - 1
                : -tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5)) *
            1.75
    );
    simphiPlayer.app.ctxos.drawImage(
        simphiPlayer.res["ProgressBar"],
        simphiPlayer.tmps.progress * 1920 - 1920,
        0
    );
    //绘制文字
    simphiPlayer.app.ctxos.resetTransform();
    for (const i of simphiPlayer.after.values()) i();
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    //开头过渡动画
    if (!simphiPlayer.animationInfo.isInEnd) {
        if (simphiPlayer.animationTimer.in.second < 0.67)
            simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(
                simphiPlayer.animationTimer.in.second * 1.5
            );
        else if (simphiPlayer.animationTimer.in.second >= 2.5)
            simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(
                6 - simphiPlayer.animationTimer.in.second * 2
            );
        const name = simphiPlayer.tmps.name;
        const artist = simphiPlayer.tmps.artist;
        const illustrator = `Illustration designed by ${simphiPlayer.tmps.illustrator}`;
        const charter = `Level designed by ${simphiPlayer.tmps.charter}`;
        const theme = `Resource Pack ${simphiPlayer.customResourceMeta["name"]} designed by ${simphiPlayer.customResourceMeta["author"]}`;
        simphiPlayer.app.ctxos.textAlign = "center";
        //曲名
        simphiPlayer.app.ctxos.textBaseline = "alphabetic";
        simphiPlayer.app.ctxos.font = `${lineScale * 1.1}px Saira`;
        const dxsnm = simphiPlayer.app.ctxos.measureText(name).width;
        if (dxsnm > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 1.1) / dxsnm) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(name, simphiPlayer.app.wlen, simphiPlayer.app.hlen * 0.75);
        //曲师、曲绘和谱师
        simphiPlayer.app.ctxos.textBaseline = "top";
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxa = simphiPlayer.app.ctxos.measureText(artist).width;
        if (dxa > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxa) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(
            artist,
            simphiPlayer.app.wlen,
            simphiPlayer.app.hlen * 0.75 + lineScale * 0.85
        );
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxi = simphiPlayer.app.ctxos.measureText(illustrator).width;
        if (dxi > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxi) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(
            illustrator,
            simphiPlayer.app.wlen,
            simphiPlayer.app.hlen * 1.25 + lineScale * 0.15
        );
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxc = simphiPlayer.app.ctxos.measureText(charter).width;
        if (dxc > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxc) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(
            charter,
            simphiPlayer.app.wlen,
            simphiPlayer.app.hlen * 1.25 + lineScale * 1.0
        );
        simphiPlayer.app.ctxos.font = `${lineScale * 0.55}px Saira`;
        const dxt = simphiPlayer.app.ctxos.measureText(theme).width;
        if (dxt > simphiPlayer.app.canvasos.width - lineScale * 1.5)
            simphiPlayer.app.ctxos.font = `${
                ((lineScale * 0.55) / dxt) * (simphiPlayer.app.canvasos.width - lineScale * 1.5)
            }px Saira`;
        simphiPlayer.app.ctxos.fillText(
            theme,
            simphiPlayer.app.wlen,
            simphiPlayer.app.hlen * 1.25 + lineScale * 1.75
        );
        //判定线(装饰用)
        simphiPlayer.app.ctxos.globalAlpha = 1;
        simphiPlayer.app.ctxos.setTransform(
            1,
            0,
            0,
            1,
            simphiPlayer.app.wlen,
            simphiPlayer.app.hlen
        );
        const imgW =
            lineScale *
            48 *
            (simphiPlayer.animationTimer.in.second < 0.67
                ? tween.easeInCubic(simphiPlayer.animationTimer.in.second * 1.5)
                : 1);
        const imgH = lineScale * 0.15; //0.1333...
        if (simphiPlayer.animationTimer.in.second >= 2.5)
            simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(
                6 - simphiPlayer.animationTimer.in.second * 2
            );
        simphiPlayer.app.ctxos.drawImage(
            shared.game.ptmain.gameConfig.lineColor
                ? simphiPlayer.res["JudgeLineMP"]
                : simphiPlayer.res["JudgeLine"],
            -imgW / 2,
            -imgH / 2,
            imgW,
            imgH
        );
    }

    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.resetTransform();
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    //绘制分数和combo以及暂停按钮
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.setTransform(
        1,
        0,
        0,
        1,
        0,
        lineScale *
            (!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67
                ? tween.easeIOCubic(simphiPlayer.animationTimer.in.second * 1.5) - 1
                : -tween.easeIOCubic(simphiPlayer.animationTimer.out.second * 1.5)) *
            1.75
    );
    simphiPlayer.app.ctxos.textBaseline = "alphabetic";
    if (simphiPlayer.tmps.showStat) {
        // 绘制分数
        simphiPlayer.app.ctxos.font = `${lineScale * 0.95}px Saira`;
        simphiPlayer.app.ctxos.textAlign = "right";
        simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.score.alpha;
        simphiPlayer.app.ctxos.fillText(
            simphiPlayer.stat.scoreStr,
            simphiPlayer.app.canvasos.width -
                lineScale * 0.65 +
                simphiPlayer.tmps.statStatus.score.offsetX,
            lineScale * 1.375 + simphiPlayer.tmps.statStatus.score.offsetY
        );
        if (
            shared.game.ptmain.gameConfig.showAcc &&
            shared.game.ptmain.playConfig.mode !== "preview"
        ) {
            simphiPlayer.app.ctxos.font = `${lineScale * 0.66}px Saira`;
            simphiPlayer.app.ctxos.fillText(
                simphiPlayer.stat.accStr,
                simphiPlayer.app.canvasos.width -
                    lineScale * 0.65 +
                    simphiPlayer.tmps.statStatus.score.offsetX,
                lineScale * 2.05 + simphiPlayer.tmps.statStatus.score.offsetY
            );
        }
        shared.game.ptmain.playConfig.mode !== "preview" ? gauge.draw() : null;
    }
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    simphiPlayer.app.ctxos.textAlign = "center";
    simphiPlayer.app.ctxos.font = `${lineScale * 1.32}px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.combonumber.alpha;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.tmps.combo,
        simphiPlayer.app.wlen + simphiPlayer.tmps.statStatus.combonumber.offsetX,
        lineScale * 1.375 + simphiPlayer.tmps.statStatus.combonumber.offsetY
    );
    simphiPlayer.app.ctxos.globalAlpha =
        !simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67
            ? tween.easeOutSine(simphiPlayer.animationTimer.in.second * 1.5)
            : 1 - tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5);
    simphiPlayer.app.ctxos.globalAlpha *= simphiPlayer.tmps.statStatus.combo.alpha;
    simphiPlayer.app.ctxos.font = `${lineScale * 0.5}px Saira`;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.tmps.combo2,
        simphiPlayer.app.wlen + simphiPlayer.tmps.statStatus.combo.offsetX,
        lineScale * 1.95 + simphiPlayer.tmps.statStatus.combo.offsetY
    );
    //绘制曲名和等级
    simphiPlayer.app.ctxos.setTransform(
        1,
        0,
        0,
        1,
        0,
        lineScale *
            (!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67
                ? 1 - tween.easeIOCubic(simphiPlayer.animationTimer.in.second * 1.5)
                : tween.easeIOCubic(simphiPlayer.animationTimer.out.second * 1.5)) *
            1.75
    );
    simphiPlayer.app.ctxos.textBaseline = "alphabetic";
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.font = `${lineScale * 0.63}px Saira`;
    const dxlvl = simphiPlayer.app.ctxos.measureText(simphiPlayer.chartData.levelText).width;
    if (dxlvl > simphiPlayer.app.wlen - lineScale)
        simphiPlayer.app.ctxos.font = `${((lineScale * 0.63) / dxlvl) * (simphiPlayer.app.wlen - lineScale)}px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.level.alpha;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.tmps.level,
        simphiPlayer.app.canvasos.width -
            lineScale * 0.75 +
            simphiPlayer.tmps.statStatus.level.offsetX,
        simphiPlayer.app.canvasos.height -
            lineScale * 0.66 +
            simphiPlayer.tmps.statStatus.level.offsetY
    );
    simphiPlayer.app.ctxos.textAlign = "left";
    // ctxos.textBaseline = "middle";
    simphiPlayer.app.ctxos.font = `${lineScale * 0.63}px Saira`;
    const dxsnm = simphiPlayer.app.ctxos.measureText(
        simphiPlayer.inputName.value || simphiPlayer.inputName.placeholder
    ).width;
    if (dxsnm > simphiPlayer.app.wlen - lineScale)
        simphiPlayer.app.ctxos.font = `${((lineScale * 0.63) / dxsnm) * (simphiPlayer.app.wlen - lineScale)}px Saira`;
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.statStatus.name.alpha;
    simphiPlayer.app.ctxos.fillText(
        simphiPlayer.inputName.value || simphiPlayer.inputName.placeholder,
        lineScale * 0.65 + simphiPlayer.tmps.statStatus.name.offsetX,
        simphiPlayer.app.canvasos.height -
            lineScale * 0.66 +
            simphiPlayer.tmps.statStatus.name.offsetY
    );
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.resetTransform();
    if (
        (simphiPlayer.animationInfo.isInEnd || simphiPlayer.animationTimer.in.second >= 2.5) &&
        simphiPlayer.tmps.customForeDraw != null
    )
        simphiPlayer.tmps.customForeDraw(simphiPlayer.app.ctxos); // 自定义前景
    if (simphiPlayer.animationInfo.isInEnd && simphiPlayer.filter)
        simphiPlayer.filter(
            simphiPlayer.app.ctxos,
            simphiPlayer.timeInfo.timeBgm,
            simphiPlayer.timeInfo.nowTime_ms / 1e3
        ); //滤镜处理
    if (shared.game.ptmain.gameConfig.feedback) simphiPlayer.hitFeedbackList.animate(); //绘制打击特效0
    simphiPlayer.app.ctxos.resetTransform();
    try {
        shared.game.graphicHandler.whilePlayingHook(
            simphiPlayer.app.ctx,
            simphiPlayer.app.ctxos,
            lineScale
        );
    } catch (e) {
        console.warn(e);
    }
    //绘制时间和帧率以及note打击数
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    if (!simphiPlayer.animationInfo.isInEnd && simphiPlayer.animationTimer.in.second < 0.67)
        simphiPlayer.app.ctxos.globalAlpha = tween.easeOutSine(
            simphiPlayer.animationTimer.in.second * 1.5
        );
    else
        simphiPlayer.app.ctxos.globalAlpha =
            1 - tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5);
    simphiPlayer.app.ctxos.font = `${lineScale * 0.4}px Saira`;
    simphiPlayer.app.ctxos.textBaseline = "middle";
    simphiPlayer.app.ctxos.textAlign = "right";
    simphiPlayer.app.ctxos.globalAlpha = 0.5;
    simphiPlayer.app.ctxos.fillText(
        frameTimer.fpsStr,
        simphiPlayer.app.canvasos.width - lineScale * 0.05,
        lineScale * 0.5
    );
    simphiPlayer.app.ctxos.font = `${lineScale * 0.25}px Saira`;
    simphiPlayer.app.ctxos.fillText(
        "FPS",
        simphiPlayer.app.canvasos.width - lineScale * 0.05,
        lineScale * 0.8
    );
    simphiPlayer.app.ctxos.textBaseline = "alphabetic";
    simphiPlayer.app.ctxos.globalAlpha = 1;
    simphiPlayer.app.ctxos.resetTransform();
    simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.tmps.canPause
        ? simphiPlayer.tmps.statStatus.pause.alpha
        : 0.5;
    if (simphiPlayer.tmps.showStat)
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Pause"],
            lineScale * 0.6 + simphiPlayer.tmps.statStatus.pause.offsetX,
            lineScale * 0.7 + simphiPlayer.tmps.statStatus.pause.offsetY,
            lineScale * 0.63,
            lineScale * 0.7
        );
    if (shared.game.ptmain.playConfig.adjustOffset) {
        simphiPlayer.app.ctxos.fillStyle = "gray";
        simphiPlayer.app.ctxos.globalAlpha = 0.75;
        drawRoundRect(
            simphiPlayer.app.ctxos,
            simphiPlayer.app.canvasos.width - lineScale * 7.5,
            simphiPlayer.app.canvasos.height - lineScale * 5,
            lineScale * 7.5,
            lineScale * 5,
            lineScale * 0.25
        ).fill();
        simphiPlayer.app.ctxos.globalAlpha = 1;
        simphiPlayer.app.ctxos.fillStyle = "#fff";
        simphiPlayer.app.ctxos.textBaseline = "middle";
        simphiPlayer.app.ctxos.textAlign = "center";
        simphiPlayer.app.ctxos.font = `${lineScale * 0.75}px Saira`;
        simphiPlayer.app.ctxos.fillText(
            shared.game.i18n.t("simphi.adjustOffset.title"),
            simphiPlayer.app.canvasos.width - lineScale * 3.75,
            simphiPlayer.app.canvasos.height - lineScale * 4.25
        );
        simphiPlayer.app.ctxos.font = `${lineScale * 0.65}px Saira`;
        simphiPlayer.app.ctxos.fillText(
            `${(simphiPlayer.app.chart.offset * 1e3).toFixed(0)}ms`,
            simphiPlayer.app.canvasos.width - lineScale * 3.75,
            simphiPlayer.app.canvasos.height - lineScale * 2.5
        );
        simphiPlayer.app.ctxos.font = `${lineScale * 0.5}px Saira`;
        const drawIcon = (p, ps) => {
            const h = lineScale * 0.5 - lineScale * Math.abs(p) * 0.1;
            simphiPlayer.app.ctxos.fillStyle = "#fff";
            drawRoundRect(
                simphiPlayer.app.ctxos,
                simphiPlayer.app.canvasos.width - 3.75 * lineScale + lineScale * ps,
                simphiPlayer.app.canvasos.height - lineScale * 2.5 - h,
                h * 2,
                h * 2,
                lineScale * 0.1
            ).fill();
            simphiPlayer.app.ctxos.fillStyle = "#000";
            simphiPlayer.app.ctxos.fillText(
                p > 0 ? "+" : "-",
                simphiPlayer.app.canvasos.width - 3.75 * lineScale + lineScale * ps + h,
                simphiPlayer.app.canvasos.height - lineScale * 2.5
            );
        };
        drawIcon(-3, -3.5);
        drawIcon(-2, -3);
        drawIcon(-1, -2.25);
        drawIcon(1, 1.5);
        drawIcon(2, 2.45);
        drawIcon(3, 3.15);
        simphiPlayer.app.ctxos.fillStyle = "#fff";
        drawRoundRect(
            simphiPlayer.app.ctxos,
            simphiPlayer.app.canvasos.width - 7 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 1.25,
            lineScale * 3,
            lineScale,
            lineScale * 0.1
        ).fill();
        drawRoundRect(
            simphiPlayer.app.ctxos,
            simphiPlayer.app.canvasos.width - 3.5 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 1.25,
            lineScale * 3,
            lineScale,
            lineScale * 0.1
        ).fill();
        simphiPlayer.app.ctxos.fillStyle = "#000";
        simphiPlayer.app.ctxos.font = `${lineScale * 0.65}px Saira`;
        simphiPlayer.app.ctxos.fillText(
            shared.game.i18n.t("simphi.adjustOffset.reset"),
            simphiPlayer.app.canvasos.width - 5.5 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 0.75
        );
        simphiPlayer.app.ctxos.fillText(
            shared.game.i18n.t("simphi.adjustOffset.save"),
            simphiPlayer.app.canvasos.width - 2 * lineScale,
            simphiPlayer.app.canvasos.height - lineScale * 0.75
        );
    }
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    if (!simphiPlayer.emitter.eq("play")) {
        simphiPlayer.app.ctxos.fillStyle = "#000"; //背景变暗
        simphiPlayer.app.ctxos.globalAlpha = simphiPlayer.app.pauseBackgroundDimPara1
            ? Math.max(
                  0.6 -
                      0.6 *
                          tween.easeOutCubic(
                              (performance.now() - simphiPlayer.app.pauseBackgroundDimPara1) / 2000
                          ),
                  0
              )
            : 0.6; //背景不透明度
        simphiPlayer.app.ctxos.fillRect(
            0,
            0,
            simphiPlayer.app.canvasos.width,
            simphiPlayer.app.canvasos.height
        );
        simphiPlayer.app.ctxos.globalAlpha = 0.5;
        if (!simphiPlayer.app.pauseTime) {
            simphiPlayer.app.ctxos.globalAlpha = 1;
            simphiPlayer.app.ctxos.fillStyle = "#fff";
            simphiPlayer.app.ctxos.textBaseline = "middle";
            simphiPlayer.app.ctxos.font = `${lineScale * 0.4}px Saira`;
            simphiPlayer.app.ctxos.textAlign = "left";
            simphiPlayer.app.ctxos.fillText(
                `${time2Str(simphiPlayer.qwqwq ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm : simphiPlayer.timeInfo.timeBgm)}/${time2Str(
                    simphiPlayer.timeInfo.duration
                )}${simphiPlayer.status2.text}`,
                lineScale * 0.05,
                lineScale * 0.35
            );
            // ctxos.textAlign = "right";
            [
                simphiPlayer.stat.noteRank[5] +
                    simphiPlayer.stat.noteRank[4] +
                    simphiPlayer.stat.noteRank[1], // Perfect
                simphiPlayer.stat.noteRank[7] + simphiPlayer.stat.noteRank[3], // Good
                simphiPlayer.stat.noteRank[7], // GoodEarly
                simphiPlayer.stat.noteRank[3], // GoodLate
                simphiPlayer.stat.noteRank[6], // Bad
                simphiPlayer.stat.noteRank[2], // Miss
                // stat.maxcombo,     // 肉眼可见
            ].forEach((val, idx) => {
                const comboColor = ["#f0ed69", "#0ac3ff", "#0ac3ff", "#0ac3ff", "#fe7b93", "#999"];
                const comboText = ["Perfect:", "Good:", "Early:", "Late:", "Bad:", "Miss:"];
                simphiPlayer.app.ctxos.fillStyle = comboColor[idx];
                simphiPlayer.app.ctxos.fillText(
                    comboText[idx],
                    lineScale * 0.05,
                    simphiPlayer.app.canvasos.height / 2 + lineScale * (idx - 2.8) * 0.5
                );
                simphiPlayer.app.ctxos.fillText(
                    val.toString(),
                    lineScale * 1.75,
                    simphiPlayer.app.canvasos.height / 2 + lineScale * (idx - 2.8) * 0.5
                );
            });
            simphiPlayer.app.ctxos.fillStyle = "#fff";
            simphiPlayer.app.ctxos.fillText(
                `DSP:  ${simphiPlayer.stat.curDispStr}`,
                lineScale * 0.05,
                simphiPlayer.app.canvasos.height / 2 + lineScale * 2.6
            );
            simphiPlayer.app.ctxos.fillText(
                `AVG:  ${simphiPlayer.stat.avgDispStr}`,
                lineScale * 0.05,
                simphiPlayer.app.canvasos.height / 2 + lineScale * 3.1
            );
            // ctxos.textBaseline = "alphabetic";
            // ctxos.textAlign = "center";
            // stat.combos.forEach((val, idx) => {
            //   const comboColor = ["#fff", "#0ac3ff", "#f0ed69", "#a0e9fd", "#fe4365"];
            //   ctxos.fillStyle = comboColor[idx];
            //   ctxos.fillText(
            //     val.toString(),
            //     lineScale * (idx + 0.55) * 1.1,
            //     canvasos.height - lineScale * 0.1
            //   );
            // });
            const imgBaseLine = n => simphiPlayer.app.hlen - (lineScale * n) / 2;
            const imgX = n => simphiPlayer.app.wlen + lineScale * (n * 2 - 0.5);
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.res["Back"],
                imgX(-1.1),
                imgBaseLine(1.5),
                lineScale * 1.5,
                lineScale * 1.5
            );
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.res["Retry"],
                imgX(0),
                imgBaseLine(1.25),
                lineScale * 1.25,
                lineScale * 1.25
            );
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.res["Resume"],
                imgX(1),
                imgBaseLine(1.5),
                lineScale * 1.5,
                lineScale * 1.5
            );
            if (shared.game.ptmain.playConfig.practiseMode) {
                simphiPlayer.app.ctxos.font = `${lineScale * 0.5}px Saira`;
                simphiPlayer.app.ctxos.fillStyle = "#fff";
                simphiPlayer.app.ctxos.textAlign = "center";
                simphiPlayer.app.ctxos.textBaseline = "middle";
                simphiPlayer.app.ctxos.fillText(
                    "00:00.000",
                    simphiPlayer.app.wlen * 0.25,
                    simphiPlayer.app.hlen + lineScale * 4.25
                );
                simphiPlayer.app.ctxos.fillText(
                    time2Str(simphiPlayer.timeInfo.duration, true),
                    simphiPlayer.app.wlen * 1.75,
                    simphiPlayer.app.hlen + lineScale * 4.25
                );
                const progress =
                    (simphiPlayer.qwqwq
                        ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm
                        : simphiPlayer.timeInfo.timeBgm) / simphiPlayer.timeInfo.duration;
                simphiPlayer.app.ctxos.fillText(
                    time2Str(
                        simphiPlayer.qwqwq
                            ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm
                            : simphiPlayer.timeInfo.timeBgm,
                        true
                    ),
                    simphiPlayer.app.wlen * (0.25 + 1.5 * progress),
                    simphiPlayer.app.hlen + lineScale * 2
                );
                drawRoundRect(
                    simphiPlayer.app.ctxos,
                    simphiPlayer.app.wlen * 1.5 + lineScale * 2.5,
                    simphiPlayer.app.hlen - lineScale * 0.5,
                    lineScale * 0.6,
                    lineScale * 0.6,
                    lineScale * 0.1
                ).fill();
                drawRoundRect(
                    simphiPlayer.app.ctxos,
                    simphiPlayer.app.wlen * 1.5 + lineScale * 3.4,
                    simphiPlayer.app.hlen - lineScale * 0.5,
                    lineScale * 0.6,
                    lineScale * 0.6,
                    lineScale * 0.1
                ).fill();
                simphiPlayer.app.ctxos.textAlign = "left";
                simphiPlayer.app.ctxos.fillText(
                    `Speed: ${simphiPlayer.app.speed.toFixed(3)}`,
                    simphiPlayer.app.wlen + lineScale * 4,
                    simphiPlayer.app.hlen - lineScale * 0.25
                );
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen + lineScale * 4,
                    simphiPlayer.app.hlen + lineScale * 0.25,
                    simphiPlayer.app.wlen * 0.5,
                    lineScale * 0.1
                );
                simphiPlayer.app.ctxos.fillStyle = "#000";
                simphiPlayer.app.ctxos.textAlign = "center";
                simphiPlayer.app.ctxos.fillText(
                    "-",
                    simphiPlayer.app.wlen * 1.5 + lineScale * 2.8,
                    simphiPlayer.app.hlen - lineScale * 0.25
                );
                simphiPlayer.app.ctxos.fillText(
                    "+",
                    simphiPlayer.app.wlen * 1.5 + lineScale * 3.7,
                    simphiPlayer.app.hlen - lineScale * 0.2
                );
                simphiPlayer.app.ctxos.fillStyle = "#a9a9a9";
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen * 0.25,
                    simphiPlayer.app.hlen + lineScale * 2.5,
                    simphiPlayer.app.wlen * 1.5,
                    lineScale * 1.25
                );
                simphiPlayer.app.ctxos.fillStyle = "deepskyblue";
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen * (0.25 + 1.5 * progress),
                    simphiPlayer.app.hlen + lineScale * 2.25,
                    lineScale * 0.1,
                    lineScale * 1.5
                );
                simphiPlayer.app.ctxos.fillRect(
                    simphiPlayer.app.wlen +
                        lineScale * 3.9 +
                        simphiPlayer.app.wlen *
                            0.5 *
                            Math.min((simphiPlayer.app.speed - 0.5) / 1.5, 1),
                    simphiPlayer.app.hlen + lineScale * 0.15,
                    lineScale * 0.1,
                    lineScale * 0.3
                );
            }
        }
    }
    simphiPlayer.app.ctxos.fillStyle = "#fff";
    if (simphiPlayer.app.pauseTime) {
        simphiPlayer.app.ctxos.font = `${lineScale * 2}px Saira`;
        simphiPlayer.app.ctxos.fillStyle = "#FFF";
        simphiPlayer.app.ctxos.globalAlpha = 1;
        simphiPlayer.app.ctxos.textAlign = "center";
        simphiPlayer.app.ctxos.textBaseline = "middle";
        simphiPlayer.app.ctxos.fillText(
            simphiPlayer.app.pauseTime,
            simphiPlayer.app.canvasos.width / 2,
            simphiPlayer.app.canvasos.height / 2
        );
    }
}

import { simphiPlayer } from "@renderers/sim-phi/playerMain";
import shared from "@utils/js/shared";
import { frameTimer } from "@utils/js/common";
import { audio } from "@utils/js/aup";
import { adjustSize } from "../utils/adjustSize";
import { replayMgr } from "@components/recordMgr/replayMgr";
import { playBgm, playVideo } from "../utils/mediaPlayer";
import saveAdjustedChart from "../plugins/saveAdjustedChart";

import { HitFeedback } from "../components/HitManager/HitFeedback";
import { judgeManager } from "../components/JudgeManager";

import { resultPageRenderer } from "./ResultPage";
import { loopCanvas } from "./Drawer";

// const frameTimer

export function mainLoop() {
    frameTimer.addTick(); //计算fps
    const { lineScale } = simphiPlayer.app;
    simphiPlayer.timeInfo.nowTime_ms = performance.now();
    simphiPlayer.app.resizeCanvas();
    //计算时间
    if (simphiPlayer.animationTimer.out.second < 0.67) {
        loopNoCanvas();
        // main["flag{qwq}"](timeBgm);
        for (const i of simphiPlayer.now.values())
            i(simphiPlayer.timeInfo.timeBgm * simphiPlayer.app.speed);
        loopCanvas();
    } else if (!simphiPlayer.resultPageData) {
        simphiPlayer.resultPageData = true;
        audio.stop();
        simphiPlayer.btnPause.classList.add("disabled"); //qwq
        simphiPlayer.app.ctxos.globalCompositeOperation = "source-over";
        simphiPlayer.app.ctxos.resetTransform();
        simphiPlayer.app.ctxos.globalAlpha = 1;
        if (shared.game.ptmain.gameConfig.imageBlur)
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.app.bgImageBlur,
                ...adjustSize(simphiPlayer.app.bgImageBlur, simphiPlayer.app.canvasos, 1)
            );
        else
            simphiPlayer.app.ctxos.drawImage(
                simphiPlayer.app.bgImage,
                ...adjustSize(simphiPlayer.app.bgImage, simphiPlayer.app.canvasos, 1)
            );
        simphiPlayer.app.ctxos.fillStyle = "#000"; //背景变暗
        simphiPlayer.app.ctxos.globalAlpha = 0.2;
        simphiPlayer.app.ctxos.fillRect(
            0,
            0,
            simphiPlayer.app.canvasos.width,
            simphiPlayer.app.canvasos.height
        );
        setTimeout(() => {
            if (!simphiPlayer.resultPageData) return; //避免快速重开后直接结算
            const difficulty = ["ez", "hd", "in", "at"].indexOf(
                simphiPlayer.chartData.levelText.slice(0, 2).toLocaleLowerCase()
            );
            audio.play(
                simphiPlayer.res[
                    `LevelOver${
                        !shared.game.ptmain.gameConfig.usekwlevelOverbgm
                            ? difficulty < 0
                                ? 2
                                : difficulty
                            : "0"
                    }${!shared.game.ptmain.gameConfig.usekwlevelOverbgm ? "_v2" : ""}`
                ],
                { loop: true }
            );
            simphiPlayer.animationTimer.end.reset();
            simphiPlayer.animationTimer.end.play();
            simphiPlayer.stat.level = Number(simphiPlayer.chartData.levelText.match(/\d+$/));
            simphiPlayer.fucktemp2 = simphiPlayer.stat.getData(
                simphiPlayer.app.playMode === 1,
                simphiPlayer.selectspeed.value
            );
        }, 1e3);
        shared.game.ptmain.playFinished();
        if (shared.game.ptmain.playConfig.adjustOffset)
            saveAdjustedChart(simphiPlayer.app, simphiPlayer.fucktemp2);
        simphiPlayer.app.stage.style.zIndex = 0;
        simphiPlayer.stage.resize(true);
    } //只让它执行一次
    if (simphiPlayer.fucktemp2) {
        resultPageRenderer(simphiPlayer.fucktemp2);
        simphiPlayer.app.ctxos.globalAlpha = 0.5;
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Retry"],
            simphiPlayer.app.canvasos.width - simphiPlayer.app.lineScale * 1,
            simphiPlayer.app.canvasos.height - simphiPlayer.app.lineScale * 1,
            simphiPlayer.app.lineScale * 0.75,
            simphiPlayer.app.lineScale * 0.75
        );
        simphiPlayer.app.ctxos.textAlign = "left";
        // if (shared.game.ptmain.playConfig.mode !== "preview") {
        // drawRoundRect(
        //   ctxos,
        //   -lineScale * 7.5,
        //   canvasos.height - lineScale * 5,
        //   lineScale * 7.5,
        //   lineScale * 5,
        //   lineScale * 0.25
        // ).fill();
        //   ctxos.fillText(
        //     "下载游玩回放",
        //     20,
        //     50
        //   )
        // };
        simphiPlayer.app.ctxos.textAlign = null;
    }
    if (
        !simphiPlayer.emitter.eq("play") &&
        !simphiPlayer.app.pauseTime &&
        !simphiPlayer.fucktemp2
    ) {
        simphiPlayer.app.ctxos.globalAlpha = 0.5;
        simphiPlayer.app.ctxos.drawImage(
            simphiPlayer.res["Loop"],
            simphiPlayer.app.lineScale * 0.25,
            simphiPlayer.app.canvasos.height - simphiPlayer.app.lineScale * 1,
            simphiPlayer.app.lineScale * 0.75,
            simphiPlayer.app.lineScale * 0.75
        );
    }
    if (
        simphiPlayer.app.canvas.width > simphiPlayer.app.canvasos.width ||
        simphiPlayer.app.canvas.height > simphiPlayer.app.canvasos.height ||
        simphiPlayer.fucktemp2
    ) {
        simphiPlayer.app.ctx.globalAlpha = 1;
        if (shared.game.ptmain.gameConfig.imageBlur || simphiPlayer.fucktemp2)
            simphiPlayer.app.ctx.drawImage(
                simphiPlayer.app.bgImageBlur,
                ...adjustSize(simphiPlayer.app.bgImageBlur, simphiPlayer.app.canvas, 1.1)
            );
        else
            simphiPlayer.app.ctx.drawImage(
                simphiPlayer.app.bgImage,
                ...adjustSize(simphiPlayer.app.bgImage, simphiPlayer.app.canvas, 1.1)
            );
        simphiPlayer.app.ctx.fillStyle = "#000";
        simphiPlayer.app.ctx.globalAlpha = 0.2;
        simphiPlayer.app.ctx.fillRect(
            0,
            0,
            simphiPlayer.app.canvas.width,
            simphiPlayer.app.canvas.height
        );
    }
    simphiPlayer.app.ctx.globalAlpha = 1;
    simphiPlayer.app.ctx.drawImage(
        simphiPlayer.app.canvasos,
        (simphiPlayer.app.canvas.width - simphiPlayer.app.canvasos.width) / 2,
        (simphiPlayer.app.canvas.height - simphiPlayer.app.canvasos.height) / 2
    );
    //Copyright
    simphiPlayer.app.ctx.font = `${lineScale * 0.3}px Saira`;
    simphiPlayer.app.ctx.fillStyle = "#FFF";
    simphiPlayer.app.ctx.globalAlpha = 0.25;
    simphiPlayer.app.ctx.textAlign = "center";
    simphiPlayer.app.ctx.textBaseline = "middle";
    simphiPlayer.app.ctx.fillText(
        simphiPlayer.app.playMode === 1
            ? `PhiTogether Preview (Respack by ${simphiPlayer.customResourceMeta["author"]})`
            : `${replayMgr.replaying ? `[ ·REC ${replayMgr.playerInfo.username || replayMgr.playerInfo.userName} (ID ${replayMgr.playerInfo.id}) ] ` : ""}PhiTogether ${
                  spec.thisVersion
              } @ sim-phi - P${judgeManager.time.p * 1000} G${
                  judgeManager.time.g * 1000
              } S${simphiPlayer.app.speed.toFixed(2)}${shared.game.ptmain.gameConfig.fullScreenJudge ? " F" : ""} - ${
                  shared.game.ptmain.noAccountMode ? "OFFLINE" : "ONLINE"
              } - RES ${simphiPlayer.customResourceMeta["author"]}`,
        simphiPlayer.app.canvas.width / 2 - lineScale * 0,
        simphiPlayer.app.canvas.height -
            lineScale * 0.3 -
            (simphiPlayer.app.canvas.height - simphiPlayer.app.canvasos.height) / 2
    );
}

function loopNoCanvas() {
    if (
        !simphiPlayer.animationInfo.isInEnd &&
        (simphiPlayer.animationTimer.in.second >= 3 || simphiPlayer.timeInfo.timeBgm > 0)
    ) {
        simphiPlayer.animationInfo.isInEnd = true;
        if (simphiPlayer.emitter.eq("play")) {
            playBgm(simphiPlayer.app.bgMusic);
            if (simphiPlayer.app.bgVideo) playVideo(simphiPlayer.app.bgVideo);
        }
    }
    if (
        simphiPlayer.emitter.eq("play") &&
        simphiPlayer.animationInfo.isInEnd &&
        !simphiPlayer.animationInfo.isOutStart
    )
        simphiPlayer.timeInfo.timeBgm =
            simphiPlayer.timeInfo.curTime +
            (simphiPlayer.timeInfo.nowTime_ms - simphiPlayer.timeInfo.curTime_ms) / 1e3;
    if (simphiPlayer.timeInfo.timeBgm >= simphiPlayer.timeInfo.duration)
        if (
            shared.game.ptmain.playConfig.practiseMode &&
            !(
                shared.game.ptmain.playConfig.previewMode &&
                !shared.game.ptmain.playConfig.adjustOffset
            )
        )
            simphiPlayer.emitter.eq("play") && simphiPlayer.pause();
        else simphiPlayer.animationInfo.isOutStart = true;
    if (
        simphiPlayer.showTransition.checked &&
        simphiPlayer.animationInfo.isOutStart &&
        !simphiPlayer.animationInfo.isOutEnd
    ) {
        simphiPlayer.animationInfo.isOutEnd = true;
        simphiPlayer.animationTimer.out.play();
    }
    simphiPlayer.timeInfo.timeChart = Math.max(
        simphiPlayer.timeInfo.timeBgm -
            (simphiPlayer.app.chart.offset +
                Number(shared.game.ptmain.gameConfig.inputOffset) / 1e3 || 0) /
                simphiPlayer.app.speed,
        0
    );
    //遍历判定线events和Note
    simphiPlayer.app.updateByTime(simphiPlayer.timeInfo.timeChart);
    //更新打击特效和触摸点动画
    simphiPlayer.hitFeedbackList.update();
    simphiPlayer.hitImageList.update();
    simphiPlayer.hitWordList.update();
    for (const i of simphiPlayer.hitManager.list) {
        if (i.type === "keyboard") continue;
        if (!i.isTapped) simphiPlayer.hitFeedbackList.add(HitFeedback.tap(i.offsetX, i.offsetY));
        else if (i.isMoving)
            simphiPlayer.hitFeedbackList.add(HitFeedback.move(i.offsetX, i.offsetY)); //qwq
        else if (i.isActive)
            simphiPlayer.hitFeedbackList.add(HitFeedback.hold(i.offsetX, i.offsetY));
    }
    //触发判定和播放打击音效
    if (simphiPlayer.animationInfo.isInEnd && !simphiPlayer.app.pauseTime) {
        const judgeWidth = simphiPlayer.app.canvasos.width * 0.118125;
        if (!replayMgr.replaying)
            judgeManager.addEvent(simphiPlayer.app.notes, simphiPlayer.timeInfo.timeChart);
        judgeManager.execute(simphiPlayer.app.drags, simphiPlayer.timeInfo.timeChart, judgeWidth);
        judgeManager.execute(simphiPlayer.app.flicks, simphiPlayer.timeInfo.timeChart, judgeWidth);
        judgeManager.execute(
            simphiPlayer.app.tapholds,
            simphiPlayer.timeInfo.timeChart,
            judgeWidth
        );
    }
    //更新判定
    simphiPlayer.hitManager.update();
    simphiPlayer.tmps.bgImage = shared.game.ptmain.gameConfig.imageBlur
        ? simphiPlayer.app.bgImageBlur
        : simphiPlayer.app.bgImage;
    simphiPlayer.tmps.bgVideo = simphiPlayer.app.bgVideo;
    simphiPlayer.tmps.progress =
        (simphiPlayer.qwqwq
            ? simphiPlayer.timeInfo.duration - simphiPlayer.timeInfo.timeBgm
            : simphiPlayer.timeInfo.timeBgm) / simphiPlayer.timeInfo.duration;
    simphiPlayer.tmps.name = simphiPlayer.inputName.value || simphiPlayer.inputName.placeholder;
    simphiPlayer.tmps.artist = simphiPlayer.inputArtist.value;
    simphiPlayer.tmps.illustrator =
        simphiPlayer.inputIllustrator.value || simphiPlayer.inputIllustrator.placeholder;
    simphiPlayer.tmps.charter =
        simphiPlayer.inputCharter.value || simphiPlayer.inputCharter.placeholder;
    simphiPlayer.tmps.level = simphiPlayer.chartData.levelText;
    if (simphiPlayer.stat.combo > 2) {
        simphiPlayer.tmps.combo = `${simphiPlayer.stat.combo}`;
        simphiPlayer.tmps.combo2 =
            shared.game.ptmain.playConfig.mode === "preview" ? "PREVIEW" : "COMBO";
    } else simphiPlayer.tmps.combo = simphiPlayer.tmps.combo2 = "";
    simphiPlayer.tmps.showStat = true;
    simphiPlayer.tmps.statStatus = {
        pause: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        combonumber: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        combo: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        score: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        bar: { show: true, offsetX: 0, offsetY: 0, alpha: 1 }, // 血量
        name: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
        level: { show: true, offsetX: 0, offsetY: 0, alpha: 1 },
    };
    simphiPlayer.tmps.customForeDraw = null;
    simphiPlayer.tmps.customBackDraw = null;
    if (replayMgr.replaying)
        simphiPlayer.tmps.combo2 = `REPLAY (${replayMgr.playerInfo.username || replayMgr.playerInfo.userName})`;
}

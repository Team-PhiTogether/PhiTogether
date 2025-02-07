import { simphiPlayer } from "../playerMain";
import shared from "@utils/js/shared";
import { loadLineData } from "./LoadLineData";
import saveAdjustedChart from "../plugins/saveAdjustedChart";

export const specialClick = {
    time: [0, 0, 0, 0],
    func: [
        function spClickLT() {
            if (simphiPlayer.emitter.eq("play")) simphiPlayer.btnPause.click();
        },
        async function spClickRT() {
            if (this.gameMode === "multi") return;
            simphiPlayer.btnPause.value === "暂停" && simphiPlayer.btnPause.click();
            if (shared.game.app.pauseNextTick)
                clearInterval(shared.game.app.pauseNextTick),
                    (shared.game.app.pauseTime = 0),
                    (shared.game.app.pauseNextTick = null);
            await shared.game.ptmain.retry();
            Promise.resolve().then(shared.game.qwqStop).then(shared.game.qwqStop);
        },
        function spClickLB() {
            if (shared.game.isPlayFinished() && shared.game.ptmain.playConfig.mode !== "preview") {
                shared.game.exportRecord && shared.game.exportRecord();
            } else if (shared.game.ptmain.gameMode === "single") {
                if (simphiPlayer.btnPause.value == "暂停") return; //btnPause.click();
                simphiPlayer.selectflip.value = simphiPlayer.app.mirrorView([
                    3 - simphiPlayer.selectflip.value,
                ]);
            } else {
                shared.game.multiInstance.JITSOpen = !shared.game.multiInstance.JITSOpen;
            }
        },
        function spClickRB() {
            if (!simphiPlayer.fucktemp2) return;
            if (
                shared.game.ptmain.$route.path !== "/multipanel" &&
                shared.game.ptmain.gameMode === "multi"
            )
                shared.game.multiInstance.showStat();
            else shared.game.ptmain.spClickRT();
        },
        () => {
            simphiPlayer.hitManager.clear();
            shared.game.ptmain.$router.back();
        },
    ],
    click(id) {
        const now = performance.now();
        if (now - this.time[id] < 300) this.func[id]();
        else this.time[id] = now;
    },
    qwq(offsetX, offsetY) {
        const { lineScale } = simphiPlayer.app;
        if (offsetX < lineScale * 1.5 && offsetY < lineScale * 1.5) this.click(0);
        if (
            offsetX > simphiPlayer.app.canvasos.width - lineScale * 1.5 &&
            offsetY < lineScale * 1.5
        )
            this.click(1);
        if (
            offsetX < lineScale * 1.5 &&
            offsetY > simphiPlayer.app.canvasos.height - lineScale * 1.5
        )
            this.click(2);
        if (
            offsetX > simphiPlayer.app.canvasos.width - lineScale * 1.5 &&
            offsetY > simphiPlayer.app.canvasos.height - lineScale * 1.5
        )
            this.click(3);
        if (!simphiPlayer.emitter.eq("play") && !simphiPlayer.app.pauseTime) {
            if (
                offsetY < simphiPlayer.app.hlen + lineScale &&
                offsetY > simphiPlayer.app.hlen - lineScale
            ) {
                const imgX = n => simphiPlayer.app.wlen + lineScale * (n * 2 - 0.5);
                const imgXs = [imgX(-1.1), imgX(0), imgX(1), imgX(1) + lineScale * 1.5];
                if (
                    // back
                    imgXs[0] < offsetX &&
                    offsetX < imgXs[1]
                )
                    this.func[4]();
                if (
                    // retry
                    imgXs[1] < offsetX &&
                    offsetX < imgXs[2]
                )
                    this.func[1]();
                if (
                    // resume
                    imgXs[2] < offsetX &&
                    offsetX < imgXs[3]
                )
                    simphiPlayer.btnPause.click();
            }
            if (
                shared.game.ptmain.playConfig.practiseMode &&
                offsetY >= simphiPlayer.app.hlen - lineScale * 0.6 &&
                offsetY <= simphiPlayer.app.hlen + lineScale * 0.2 /* &&
                qwqIn.second >= 3 */
            ) {
                if (
                    offsetX >= simphiPlayer.app.wlen * 1.5 + lineScale * 2.4 &&
                    offsetX <= simphiPlayer.app.wlen * 1.5 + lineScale * 3.2
                ) {
                    const speedNew = Math.max(simphiPlayer.app.speed - 0.05, 0.5);
                    const deltaSpeed = simphiPlayer.app.speed / speedNew;
                    (simphiPlayer.app.speed = speedNew),
                        (simphiPlayer.timeInfo.duration =
                            simphiPlayer.app.bgMusic.duration / speedNew),
                        (simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime =
                            simphiPlayer.timeInfo.curTime * deltaSpeed);
                    simphiPlayer.app.prerenderChart(
                        simphiPlayer.modify(
                            simphiPlayer.chartData.charts.get(simphiPlayer.selectchart.value)
                        )
                    ); //fuckqwq
                    simphiPlayer.stat.reset(
                        simphiPlayer.app.chart.numOfNotes,
                        simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value),
                        simphiPlayer.selectspeed.value
                    );
                    loadLineData();
                } else if (
                    offsetX >= simphiPlayer.app.wlen * 1.5 + lineScale * 3.3 &&
                    offsetX <= simphiPlayer.app.wlen * 1.5 + lineScale * 4.1
                ) {
                    const speedNew = Math.min(simphiPlayer.app.speed + 0.05, 2);
                    const deltaSpeed = simphiPlayer.app.speed / speedNew;
                    (simphiPlayer.app.speed = speedNew),
                        (simphiPlayer.timeInfo.duration =
                            simphiPlayer.app.bgMusic.duration / speedNew),
                        (simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime =
                            simphiPlayer.timeInfo.curTime * deltaSpeed);
                    simphiPlayer.app.prerenderChart(
                        simphiPlayer.modify(
                            simphiPlayer.chartData.charts.get(simphiPlayer.selectchart.value)
                        )
                    ); //fuckqwq
                    simphiPlayer.stat.reset(
                        simphiPlayer.app.chart.numOfNotes,
                        simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value),
                        simphiPlayer.selectspeed.value
                    );
                    loadLineData();
                }
            }
        }
        if (
            shared.game.ptmain.playConfig.adjustOffset &&
            simphiPlayer.emitter.eq("play") &&
            offsetX > simphiPlayer.app.canvasos.width - lineScale * 7.5 &&
            offsetY > simphiPlayer.app.canvasos.height - lineScale * 5 &&
            !simphiPlayer.fucktemp2
        ) {
            const getBtnAxis = (p, ps) => {
                const h = lineScale * 0.5 - lineScale * Math.abs(p) * 0.1;
                const x = simphiPlayer.app.canvasos.width - 3.75 * lineScale + lineScale * ps;
                const y = simphiPlayer.app.canvasos.height - lineScale * 2.5 - h;
                return [x, y, x + h * 2, y + h * 2];
            };
            const btns = [
                [-3, -3.5, -1],
                [-2, -3, -5],
                [-1, -2.25, -50],
                [1, 1.5, 50],
                [2, 2.45, 5],
                [3, 3.15, 1],
            ];
            for (const i of btns) {
                const btnAxis = getBtnAxis(i[0], i[1]);
                if (
                    btnAxis[0] < offsetX &&
                    offsetX < btnAxis[2] &&
                    btnAxis[1] < offsetY &&
                    offsetY < btnAxis[3]
                ) {
                    simphiPlayer.app.chart.offset =
                        (simphiPlayer.app.chart.offset * 1e3 + i[2]) / 1e3;
                }
            }
            if (
                simphiPlayer.app.canvasos.width - 3.5 * lineScale < offsetX &&
                offsetX < simphiPlayer.app.canvasos.width - 0.5 * lineScale &&
                simphiPlayer.app.canvasos.height - lineScale * 1.25 < offsetY &&
                offsetY < simphiPlayer.app.canvasos.height - lineScale * 0.25
            ) {
                saveAdjustedChart(simphiPlayer.app, simphiPlayer.fucktemp2);
            } else if (
                simphiPlayer.app.canvasos.width - 7 * lineScale < offsetX &&
                offsetX < simphiPlayer.app.canvasos.width - 5 * lineScale &&
                simphiPlayer.app.canvasos.height - lineScale * 1.25 < offsetY &&
                offsetY < simphiPlayer.app.canvasos.height - lineScale * 0.25
            ) {
                simphiPlayer.app.chart.offset = simphiPlayer.app.chart.offsetBak;
            }
        }
        if (simphiPlayer.animationTimer.end.second > 0)
            simphiPlayer.pressTime =
                simphiPlayer.pressTime > 0
                    ? -simphiPlayer.animationTimer.end.second
                    : simphiPlayer.animationTimer.end.second;
    },
};

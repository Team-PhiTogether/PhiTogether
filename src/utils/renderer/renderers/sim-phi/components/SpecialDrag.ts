import { simphiPlayer } from "../playerMain";
import shared from "@utils/js/shared";
import { loadLineData } from "./LoadLineData";

export const specialDrag = {
    listeningEvts: new Map(),
    update(evt, offsetX, offsetY) {
        if (!this.listeningEvts.has(evt)) return;
        this.func[this.listeningEvts.get(evt)].update(offsetX, offsetY);
    },
    reg(evt, offsetX, offsetY) {
        const { lineScale } = simphiPlayer.app;
        if (!simphiPlayer.emitter.eq("play") && !simphiPlayer.app.pauseTime && shared.game.ptmain.playConfig.practiseMode) {
            if (
                offsetY >= simphiPlayer.app.hlen + lineScale * 2.5 &&
                offsetX >= simphiPlayer.app.wlen * 0.25 &&
                offsetX <= simphiPlayer.app.wlen * 1.75 &&
                offsetY <= simphiPlayer.app.hlen + lineScale * 3.75 /* &&
                qwqIn.second >= 3 */
            ) {
                this.listeningEvts.set(evt, 0);
                this.func[0].reg(offsetX, offsetY);
            } else if (
                offsetY >= simphiPlayer.app.hlen + lineScale * 0.1 &&
                offsetX >= simphiPlayer.app.wlen + lineScale * 4 &&
                offsetX <= simphiPlayer.app.wlen * 1.5 + lineScale * 4 &&
                offsetY <= simphiPlayer.app.hlen + lineScale * 0.5 /* &&
                qwqIn.second >= 3 */
            ) {
                this.listeningEvts.set(evt, 1);
                this.func[1].reg(offsetX, offsetY);
            }
        }
        this.update(evt, offsetX, offsetY);
    },
    del(evt) {
        if (!this.listeningEvts.has(evt)) return;
        this.func[this.listeningEvts.get(evt)].del();
        this.listeningEvts.delete(evt);
    },
    func: [
        {
            reg: () => {
                const oldOffset = simphiPlayer.app.chart.offset;
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(simphiPlayer.selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value),
                    simphiPlayer.selectspeed.value
                );
                loadLineData();
                simphiPlayer.app.chart.offset = oldOffset;
            },
            update: offsetX => {
                let progress = Math.max((offsetX - simphiPlayer.app.wlen * 0.25) / (simphiPlayer.app.wlen * 1.5), 0);
                if (progress < 1) simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.duration * progress;
                else simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.duration - 0.01;
                // if (qwqIn.second < 3) qwqIn.addTime(3 - qwqIn.second);
            },
            del: () => {
                const oldOffset = simphiPlayer.app.chart.offset;
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(simphiPlayer.selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value),
                    simphiPlayer.selectspeed.value
                );
                loadLineData();
                simphiPlayer.app.chart.offset = oldOffset;
            },
        },
        {
            reg: () => {
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(simphiPlayer.selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value),
                    simphiPlayer.selectspeed.value
                );
                loadLineData();
            },
            update: offsetX => {
                const speedNew =
                    0.5 +
                    Math.round(
                        Math.min(
                            Math.max(
                                (offsetX - simphiPlayer.app.wlen - simphiPlayer.app.lineScale * 4) / (simphiPlayer.app.wlen * 0.5),
                                0
                            ),
                            1
                        ) * 30
                    ) *
                        0.05;
                const deltaSpeed = simphiPlayer.app.speed / speedNew;
                (simphiPlayer.app.speed = speedNew),
                    (simphiPlayer.timeInfo.duration = simphiPlayer.app.bgMusic.duration / speedNew),
                    (simphiPlayer.timeInfo.timeBgm = simphiPlayer.timeInfo.curTime = simphiPlayer.timeInfo.curTime * deltaSpeed);
            },
            del: () => {
                simphiPlayer.app.prerenderChart(simphiPlayer.modify(simphiPlayer.chartData.charts.get(simphiPlayer.selectchart.value))); //fuckqwq
                simphiPlayer.stat.reset(
                    simphiPlayer.app.chart.numOfNotes,
                    simphiPlayer.chartData.chartsMD5.get(simphiPlayer.selectchart.value),
                    simphiPlayer.selectspeed.value
                );
                loadLineData();
            },
        },
    ],
};
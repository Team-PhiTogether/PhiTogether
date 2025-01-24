import { BpmList } from "../BpmList";
import { EventLayer, LineRPE } from "./LineRPE";

function parse(pec, filename) {
    const data = JSON.parse(pec);
    const meta = data.META || data;
    if (!meta && !meta.RPEVersion) throw new Error("Invalid rpe file");
    const result = {
        formatVersion: 3,
        offset: 0,
        numOfNotes: 0,
        judgeLineList: [],
        chartRPE: JSON.parse(pec),
    };
    const warnings = [];
    warnings.push(`RPE谱面兼容建设中...\n检测到RPE版本:${meta.RPEVersion}\n来自${filename}`);
    //谱面信息
    const info = {};
    info.Chart = filename;
    info.Music = meta.song;
    info.Image = meta.background;
    info.Name = meta.name;
    info.Artist = meta.composer;
    info.Charter = meta.charter;
    info.Level = meta.level;
    result.offset = meta.offset / 1e3;
    //判定线贴图
    const line = [];
    data.judgeLineList = data.judgeLineList.sort((a, b) => (a.zOrder || 0) - (b.zOrder || 0));
    data.judgeLineList.reverse();
    data.judgeLineList.forEach((i, index) => {
        i.LineId = index;
        if (typeof i.father === "number" && i.father !== -1)
            i.father = data.judgeLineList.length - 1 - i.father;
    });
    //bpm变速
    const bpmList = new BpmList(data.BPMList[0].bpm);
    for (const i of data.BPMList) i.time = i.startTime[0] + i.startTime[1] / i.startTime[2];
    data.BPMList.sort((a, b) => a.time - b.time).forEach((i, idx, arr) => {
        if (arr[idx + 1] && arr[idx + 1].time <= 0) return; //过滤负数
        bpmList.push(i.time < 0 ? 0 : i.time, arr[idx + 1] ? arr[idx + 1].time : 1e9, i.bpm);
    });
    for (const i of data.judgeLineList) {
        if (i.zOrder === undefined) i.zOrder = 0;
        if (i.bpmfactor === undefined) i.bpmfactor = 1;
        if (i.father === undefined) i.father = -1;
        if (i.isCover !== 1)
            warnings.push(
                `未兼容isCover=${i.isCover}(可能无法正常显示)\n位于${i.LineId}号判定线\n来自${filename}`
            );
        if (i.zOrder !== 0)
            warnings.push(
                `未兼容zOrder=${i.zOrder}(可能无法正常显示)\n位于${i.LineId}号判定线\n来自${filename}`
            );
        if (i.bpmfactor !== 1)
            warnings.push(
                `未兼容bpmfactor=${i.bpmfactor}(可能无法正常显示)\n位于${i.LineId}号判定线\n来自${filename}`
            );
        const lineRPE = new LineRPE(bpmList.baseBpm);
        lineRPE.setId(i.LineId);
        lineRPE.setZOrder(i.zOrder);
        if (i.notes) {
            for (const note of i.notes) {
                if (note.alpha === undefined) note.alpha = 255;
                if (note.above !== 1 && note.above !== 2)
                    warnings.push(
                        `检测到非法方向:${note.above}(将被视为2)\n位于:"${JSON.stringify(note)}"\n来自${filename}`
                    );
                if (note.isFake !== 0)
                    warnings.push(
                        `检测到FakeNote(可能无法正常显示)\n位于:"${JSON.stringify(note)}"\n来自${filename}`
                    );
                if (note.yOffset !== 0)
                    warnings.push(
                        `未兼容yOffset=${note.yOffset}(可能无法正常显示)\n位于:"${JSON.stringify(note)}"\n来自${filename}`
                    );
                if (note.visibleTime !== 999999)
                    warnings.push(
                        `未兼容visibleTime=${note.visibleTime}(可能无法正常显示)\n位于:"${JSON.stringify(note)}"\n来自${filename}`
                    );
                if (note.alpha !== 255)
                    warnings.push(
                        `未兼容alpha=${note.alpha}(可能无法正常显示)\n位于:"${JSON.stringify(note)}"\n来自${filename}`
                    );
                const type = [0, 1, 4, 2, 3].indexOf(note.type);
                const time = bpmList.calc(
                    note.startTime[0] + note.startTime[1] / note.startTime[2]
                );
                const holdTime =
                    bpmList.calc(note.endTime[0] + note.endTime[1] / note.endTime[2]) - time;
                const speed = note.speed;
                const positionX = note.positionX / 75.375;
                lineRPE.pushNote(
                    type,
                    time,
                    positionX,
                    holdTime,
                    speed,
                    note.above === 1,
                    note.isFake !== 0,
                    note.size,
                    note.alpha,
                    note.visibleTime
                );
            }
        }
        for (const e of i.eventLayers) {
            if (!e) continue; //有可能是null
            const layer = new EventLayer();
            for (const j of e.moveXEvents || []) {
                if (j.linkgroup === undefined) j.linkgroup = 0;
                if (j.linkgroup !== 0)
                    warnings.push(
                        `未兼容linkgroup=${j.linkgroup}(可能无法正常显示)\n位于:"${JSON.stringify(j)}"\n来自${filename}`
                    );
                const startTime = bpmList.calc(j.startTime[0] + j.startTime[1] / j.startTime[2]);
                const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                layer.pushMoveXEvent(
                    startTime,
                    endTime,
                    j.start,
                    j.end,
                    j.easingType,
                    j.easingLeft,
                    j.easingRight
                );
            }
            for (const j of e.moveYEvents || []) {
                if (j.linkgroup === undefined) j.linkgroup = 0;
                if (j.linkgroup !== 0)
                    warnings.push(
                        `未兼容linkgroup=${j.linkgroup}(可能无法正常显示)\n位于:"${JSON.stringify(j)}"\n来自${filename}`
                    );
                const startTime = bpmList.calc(j.startTime[0] + j.startTime[1] / j.startTime[2]);
                const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                layer.pushMoveYEvent(
                    startTime,
                    endTime,
                    j.start,
                    j.end,
                    j.easingType,
                    j.easingLeft,
                    j.easingRight
                );
            }
            for (const j of e.rotateEvents || []) {
                if (j.linkgroup === undefined) j.linkgroup = 0;
                if (j.linkgroup !== 0)
                    warnings.push(
                        `未兼容linkgroup=${j.linkgroup}(可能无法正常显示)\n位于:"${JSON.stringify(j)}"\n来自${filename}`
                    );
                const startTime = bpmList.calc(j.startTime[0] + j.startTime[1] / j.startTime[2]);
                const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                layer.pushRotateEvent(
                    startTime,
                    endTime,
                    j.start,
                    j.end,
                    j.easingType,
                    j.easingLeft,
                    j.easingRight
                );
            }
            for (const j of e.alphaEvents || []) {
                if (j.linkgroup === undefined) j.linkgroup = 0;
                if (j.linkgroup !== 0)
                    warnings.push(
                        `未兼容linkgroup=${j.linkgroup}(可能无法正常显示)\n位于:"${JSON.stringify(j)}"\n来自${filename}`
                    );
                const startTime = bpmList.calc(j.startTime[0] + j.startTime[1] / j.startTime[2]);
                const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                layer.pushAlphaEvent(
                    startTime,
                    endTime,
                    j.start,
                    j.end,
                    j.easingType,
                    j.easingLeft,
                    j.easingRight
                );
            }
            for (const j of e.speedEvents || []) {
                if (j.linkgroup === undefined) j.linkgroup = 0;
                if (j.linkgroup !== 0)
                    warnings.push(
                        `未兼容linkgroup=${j.linkgroup}(可能无法正常显示)\n位于:"${JSON.stringify(j)}"\n来自${filename}`
                    );
                const startTime = bpmList.calc(j.startTime[0] + j.startTime[1] / j.startTime[2]);
                const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                layer.pushSpeedEvent(startTime, endTime, j.start, j.end);
            }
            lineRPE.eventLayers.push(layer);
        }
        if (i.extended) {
            if (i.extended.colorEvents)
                for (const j of i.extended.colorEvents) {
                    if (!j) continue;
                    const startTime = bpmList.calc(
                        j.startTime[0] + j.startTime[1] / j.startTime[2]
                    );
                    const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                    const start = j.start;
                    const end = j.end;
                    lineRPE.colorEvents.push({ startTime, endTime, start, end });
                }
            if (i.extended.textEvents)
                for (const j of i.extended.textEvents) {
                    if (!j) continue;
                    const startTime = bpmList.calc(
                        j.startTime[0] + j.startTime[1] / j.startTime[2]
                    );
                    const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                    const start = j.start;
                    const end = j.end;
                    lineRPE.textEvents.push({ startTime, endTime, start, end });
                }
            if (i.extended.scaleXEvents)
                for (const j of i.extended.scaleXEvents) {
                    if (!j) continue;
                    const startTime = bpmList.calc(
                        j.startTime[0] + j.startTime[1] / j.startTime[2]
                    );
                    const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                    const start = j.start;
                    const end = j.end;
                    lineRPE.scaleXEvents.push({ startTime, endTime, start, end });
                }
            if (i.extended.scaleYEvents)
                for (const j of i.extended.scaleYEvents) {
                    if (!j) continue;
                    const startTime = bpmList.calc(
                        j.startTime[0] + j.startTime[1] / j.startTime[2]
                    );
                    const endTime = bpmList.calc(j.endTime[0] + j.endTime[1] / j.endTime[2]);
                    const start = j.start;
                    const end = j.end;
                    lineRPE.scaleYEvents.push({ startTime, endTime, start, end });
                }
        }
        if (i.attachUI) lineRPE.setUIAttachment(i.attachUI);
        i.judgeLineRPE = lineRPE;
    }

    for (const i of data.judgeLineList) {
        /** @type {LineRPE} */
        const lineRPE = i.judgeLineRPE; //qwq
        const father = data.judgeLineList[i.father];
        if (father) lineRPE.setFather(father.judgeLineRPE);

        const texture = String(i.Texture).replace(/\0/g, "");
        if (!["line.png", "Line.png"].includes(texture)) {
            const extended = i.extended || {};
            let scaleX = extended.scaleXEvents
                ? extended.scaleXEvents[extended.scaleXEvents.length - 1].end
                : 1;
            let scaleY = extended.scaleYEvents
                ? extended.scaleYEvents[extended.scaleYEvents.length - 1].end
                : 1;
            line.push({
                Chart: filename,
                LineId: lineRPE.id,
                Image: texture,
                Scale: scaleY,
                Aspect: scaleX / scaleY,
                UseBackgroundDim: 0,
                UseLineColor: 1,
                UseLineScale: 1,
            });
        }

        const judgeLine = lineRPE.format({
            onwarning: msg => warnings.push(`${msg}\n来自${filename}`),
        });
        result.judgeLineList.push(judgeLine);
        result.numOfNotes += judgeLine.numOfNotes;
    }
    return { data: JSON.stringify(result), messages: warnings, info: info, line: line };
}

export { parse };

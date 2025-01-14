import { recordMgr } from "@components/recordMgr/recordMgr.js";
import { replayMgr } from "@components/recordMgr/replayMgr.js";
import { frameTimer } from "@utils/js/common.js";

/** @typedef {import('../simphi.js').NoteExtends} NoteExtends */
/**
 * 判定和音符的水平距离
 * @param {JudgeEvent} judgeEvent
 * @param {NoteExtends} note
 */
function getJudgeOffset(judgeEvent, note) {
    const { offsetX, offsetY } = judgeEvent;
    const { offsetX: x, offsetY: y, cosr, sinr } = note;
    return Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) || 0;
}
/**
 * 判定和音符的曼哈顿距离
 * @param {JudgeEvent} judgeEvent
 * @param {NoteExtends} note
 */
function getJudgeDistance(judgeEvent, note) {
    const { offsetX, offsetY } = judgeEvent;
    const { offsetX: x, offsetY: y, cosr, sinr } = note;
    return (
        Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) +
        Math.abs((offsetX - x) * sinr - (offsetY - y) * cosr) || 0
    );
}

export const judgeManager = {
    time: {
        p: 0.08,
        g: 0.16,
        AP: 0.04,
    },
    setJudgeTime(p = 0.08, g = 0.16, AP = 0.04) {
        this.time.p = p;
        this.time.g = g;
        this.time.AP = AP;
    },
    /**@type {JudgeEvent[]} */
    list: [],
    /**@param {NoteExtends[]} notes */
    addEvent(notes, realTime) {
        const { list } = this;
        list.length = 0;
        if (app.playMode === 1) {
            const dispTime = Math.min(frameTimer.disp, this.time.AP);
            const minDispTime = -Math.max(frameTimer.disp * 2, this.time.g);
            for (const i of notes) {
                if (i.scored || i.isFake) continue;
                const deltaTime = i.realTime - realTime;
                if (i.type === 1) {
                    if (deltaTime < dispTime)
                        list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
                } else if (i.type === 2) {
                    if (deltaTime < dispTime)
                        list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
                } else if (i.type === 3) {
                    if (i.holdTapTime)
                        list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
                    else if (deltaTime < dispTime)
                        list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
                } else if (i.type === 4) {
                    if (deltaTime < dispTime)
                        list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3);
                }
            }
        } else if (emitter.eq("play")) {
            for (const i of hitManager.list) {
                if (!i.isTapped)
                    list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 1);
                if (i.isActive)
                    list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 2);
                if (i.type === "keyboard")
                    list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3); //以后加上Flick判断
                if (i.flicking && !i.flicked) {
                    list[list.length] = new JudgeEvent(i.offsetX, i.offsetY, 3, i);
                    // i.flicked = true; 不能在这里判断，因为可能会判定不到
                }
            }
        }
    },
    /**
     * @param {NoteExtends[]} notes
     * @param {number} realTime
     * @param {number} width
     */
    execute(notes, realTime, width) {
        const { list } = this;
        for (const note of notes) {
            if (note.scored || note.isFake) continue; //跳过已判分的Note和Fakenotes
            let deltaTime = note.realTime - realTime;
            if (deltaTime > (replayMgr.replaying ? 1 : 0.2)) break; //跳过判定范围外的Note
            if (note.type !== 1 && deltaTime > this.time.g) continue;
            note.statOffset = realTime;
            if (deltaTime < -this.time.g && note.frameCount > 4 && !note.holdStatus && !(replayMgr.replaying && replayMgr.data[note.name] && replayMgr.data[note.name].a !== 2)) {
                //超时且不为Hold拖判，判为Miss
                // console.log('Miss', i.name);
                note.status = 2;
                stat.addCombo(2, note.type);
                note.scored = true;
            } else if (note.type === 2) {
                //Drag音符
                if (deltaTime > 0) {
                    for (const judgeEvent of list) {
                        if (judgeEvent.type !== 1) continue; //跳过非Tap触摸事件
                        if (getJudgeOffset(judgeEvent, note) > width) continue;
                        judgeEvent.preventBad = true; // Drag后防bad
                    }
                }
                if (note.status !== 4) {
                    // 未判为PM
                    if (replayMgr.replaying) {
                        if (replayMgr.data[note.name]) {
                            note.status = 4;
                            continue;
                        }
                        continue;
                    }
                    for (const judgeEvent of list) {
                        if (judgeEvent.type !== 2) continue; //跳过非Drag触摸事件
                        if (getJudgeOffset(judgeEvent, note) > width) continue;
                        // console.log('Perfect', i.name);
                        note.status = 4; // 判为PM
                        recordMgr.add(note);
                        break;
                    }
                } else if (deltaTime < 0) {
                    // Drag过线
                    if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong1"], { gainrate: app.soundVolume });
                    hitImageList.add(
                        HitImage.perfect(note.projectX, note.projectY, note)
                    );
                    stat.addCombo(4, 2);
                    note.scored = true;
                }
            } else if (note.type === 4) {
                //Flick音符
                if (deltaTime > 0 || note.status !== 4) {
                    // 对于未判为PM且未过线的Flick
                    for (const judgeEvent of list) {
                        if (judgeEvent.type !== 1) continue; //跳过非Tap触摸事件
                        if (getJudgeOffset(judgeEvent, note) > width) continue;
                        judgeEvent.preventBad = true; // 防止后判为Bad
                    }
                }
                if (note.status !== 4) {
                    if (replayMgr.replaying) {
                        if (replayMgr.data[note.name]) {
                            note.status = 4;
                            continue;
                        }
                        continue;
                    }
                    for (const judgeEvent of list) {
                        if (judgeEvent.type !== 3) continue; //跳过非Move触摸事件
                        if (getJudgeOffset(judgeEvent, note) > width) continue;
                        let distance = getJudgeDistance(judgeEvent, note);
                        let noteJudge = note;
                        let nearcomp = false;
                        for (const nearNote of note.nearNotes) {
                            if (nearNote.status) continue;
                            if (
                                nearNote.realTime - realTime /* deltaTime for nearNote */ >
                                this.time.g
                            )
                                break;
                            if (getJudgeOffset(judgeEvent, nearNote) > width) continue;
                            const nearDistance = getJudgeDistance(judgeEvent, nearNote);
                            if (nearDistance < distance) {
                                distance = nearDistance;
                                noteJudge = nearNote;
                                nearcomp = true;
                            }
                        }
                        //console.log('Perfect', i.name);
                        if (judgeEvent.event == null) {
                            noteJudge.status = 4;
                            recordMgr.add(noteJudge);
                            if (!nearcomp) break;
                        } else if (!judgeEvent.event.flicked) {
                            noteJudge.status = 4;
                            judgeEvent.event.flicked = true;
                            recordMgr.add(noteJudge);
                            if (!nearcomp) break;
                        }
                    }
                } else if (deltaTime < 0) {
                    if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong2"], { gainrate: app.soundVolume });
                    hitImageList.add(
                        HitImage.perfect(note.projectX, note.projectY, note)
                    );
                    stat.addCombo(4, 4);
                    note.scored = true;
                }
            } else {
                //Hold & Tap音符
                if (replayMgr.replaying) {
                    if (!replayMgr.data[note.name]) continue; // 录制文件无此note，直接跳过
                    const re = replayMgr.data[note.name];
                    if (realTime < re.s + note.realTime) continue; // 该note记录事件还未开始
                    if (note.type === 3 && note.holdTapTime) {
                        // hold
                        //是否触发头判
                        if (
                            (performance.now() - note.holdTapTime) * note.holdTime >=
                            8e3 * note.realHoldTime
                        ) {
                            //间隔时间与bpm成反比
                            if (note.holdStatus % 4 === 0)
                                // perfect max
                                hitImageList.add(
                                    HitImage.perfect(note.projectX, note.projectY, note)
                                );
                            else if (note.holdStatus % 4 === 1)
                                // perfect early/late
                                hitImageList.add(
                                    HitImage.perfect(note.projectX, note.projectY, note)
                                );
                            else if (note.holdStatus % 4 === 3)
                                // good early/late
                                hitImageList.add(
                                    HitImage.good(note.projectX, note.projectY, note)
                                );
                            note.holdTapTime = performance.now();
                        }
                        if (deltaTime + note.realHoldTime < 0.2) {
                            if (!note.status)
                                stat.addCombo((note.status = re.q), 3);
                            if (deltaTime + note.realHoldTime < 0) note.scored = true;
                            continue;
                        }
                        if (re.e && realTime >= re.e + note.realTime) {
                            note.holdBroken = true;
                        } else {
                            note.holdBroken = false;
                        }
                    }
                    if (!note.holdBroken && !note.holdTapTime) {
                        let deltaTime2 = 2 * note.realTime - re.s;
                        if (deltaTime2 > this.time.g && re.a === 6) {
                            // 判bad
                            if (note.type === 3) continue; // hold无bad
                            note.status = 6; //console.log('Bad', i.name);
                            note.badTime = performance.now();
                        } else {
                            stat.addDisp(
                                Math.max(deltaTime2, (-1 - note.frameCount) * this.time.AP || 0)
                            );
                            if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong0"], { gainrate: app.soundVolume });
                            if (re.a === 7) {
                                note.holdStatus = 7; //console.log('Good(Early)', i.name);
                                hitImageList.add(
                                    HitImage.good(note.projectX, note.projectY, note)
                                );
                                hitWordList.add(HitWord.early(note.projectX, note.projectY));
                            } else if (re.a === 5) {
                                note.holdStatus = 5; //console.log('Perfect(Early)', i.name);
                                hitImageList.add(
                                    HitImage.perfect(note.projectX, note.projectY, note)
                                );
                                hitWordList.add(HitWord.early(note.projectX, note.projectY));
                            } else if (re.a === 4) {
                                note.holdStatus = 4; //console.log('Perfect(Max)', i.name);
                                hitImageList.add(
                                    HitImage.perfect(note.projectX, note.projectY, note)
                                );
                            } else if (re.a === 1) {
                                note.holdStatus = 1; //console.log('Perfect(Late)', i.name);
                                hitImageList.add(
                                    HitImage.perfect(note.projectX, note.projectY, note)
                                );
                                hitWordList.add(HitWord.late(note.projectX, note.projectY));
                            } else if (re.a === 3) {
                                note.holdStatus = 3; //console.log('Good(Late)', i.name);
                                hitImageList.add(
                                    HitImage.good(note.projectX, note.projectY, note)
                                );
                                hitWordList.add(HitWord.late(note.projectX, note.projectY));
                            }
                            if (note.type === 1) note.status = note.holdStatus;
                            if (note.type === 3) note.holdStart = realTime;
                        }
                        if (note.status) {
                            // 只有tap才会在此处有status
                            stat.addCombo(note.status, 1);
                            note.scored = true;
                        } else {
                            note.holdTapTime = performance.now();
                        }
                    }
                    if (emitter.eq("play") && note.holdTapTime && note.holdBroken && re.q === 2) {
                        note.status = 2; //console.log('Miss', i.name);
                        stat.addCombo(2, 3);
                        note.scored = true;
                    }
                    continue;
                }

                // hold
                if (note.type === 3 && note.holdTapTime) {
                    //是否触发头判
                    if (
                        (performance.now() - note.holdTapTime) * note.holdTime >=
                        1.6e4 * note.realHoldTime
                    ) {
                        //间隔时间与bpm成反比
                        if (note.holdStatus % 4 === 0)
                            // perfect max
                            hitImageList.add(
                                HitImage.perfect(note.projectX, note.projectY, note)
                            );
                        else if (note.holdStatus % 4 === 1)
                            // perfect early/late
                            hitImageList.add(
                                HitImage.perfect(note.projectX, note.projectY, note)
                            );
                        else if (note.holdStatus % 4 === 3)
                            // good early/late
                            hitImageList.add(
                                HitImage.good(note.projectX, note.projectY, note)
                            );
                        note.holdTapTime = performance.now();
                    }
                    if (deltaTime + note.realHoldTime < 0.2) {
                        if (!note.status)
                            stat.addCombo((note.status = note.holdStatus), 3),
                                recordMgr.add(note);
                        if (deltaTime + note.realHoldTime < 0) note.scored = true;
                        continue;
                    }
                    note.holdBroken = true; //若1帧内未按住并使其转为false，则判定为Miss
                }
                for (const judgeEvent of list) {
                    // if (judgeEvent.event.flicked) continue; // 跳过已flick触摸事件
                    if (note.holdTapTime) {
                        //头判
                        if (judgeEvent.type !== 2) continue;
                        if (getJudgeOffset(judgeEvent, note) <= width) {
                            note.holdBroken = false;
                            break;
                        }
                        continue;
                    }
                    if (judgeEvent.type !== 1) continue; //跳过非Tap触摸事件
                    if (judgeEvent.judged) continue; //跳过已触发的判定
                    if (getJudgeOffset(judgeEvent, note) > width) continue;
                    let deltaTime2 = deltaTime;
                    let distance = getJudgeDistance(judgeEvent, note);
                    let noteJudge = note;
                    let nearcomp = false;
                    for (const nearNote of note.nearNotes) {
                        if (nearNote.status) continue; // 跳过已判
                        if (nearNote.holdTapTime) continue; // 跳过tap已头判
                        const nearDeltaTime = nearNote.realTime - realTime;
                        if (nearDeltaTime > 0.2) break; // 跳过nearNote在判定范围外
                        if (nearNote.type === 3 && nearDeltaTime > this.time.g) continue; // hold无bad
                        if (getJudgeOffset(judgeEvent, nearNote) > width) continue;
                        const nearDistance = getJudgeDistance(judgeEvent, nearNote);
                        if (nearDistance < distance) {
                            deltaTime2 = nearDeltaTime;
                            distance = nearDistance;
                            noteJudge = nearNote;
                            noteJudge.statOffset = realTime;
                            nearcomp = true;
                        }
                    }
                    if (deltaTime2 > this.time.g) {
                        // 判bad
                        if (judgeEvent.preventBad) continue;
                        noteJudge.status = 6; //console.log('Bad', i.name);
                        recordMgr.add(noteJudge);
                        noteJudge.badTime = performance.now();
                    } else {
                        const note = noteJudge;
                        stat.addDisp(
                            Math.max(deltaTime2, (-1 - note.frameCount) * this.time.AP || 0)
                        );
                        if (emitter.eq("play") && !app.pauseTime) audio.play(res["HitSong0"], { gainrate: app.soundVolume });
                        if (deltaTime2 > this.time.p) {
                            note.holdStatus = 7; //console.log('Good(Early)', i.name);
                            hitImageList.add(
                                HitImage.good(note.projectX, note.projectY, note)
                            );
                            hitWordList.add(HitWord.early(note.projectX, note.projectY));
                        } else if (deltaTime2 > this.time.AP) {
                            note.holdStatus = 5; //console.log('Perfect(Early)', i.name);
                            hitImageList.add(
                                HitImage.perfect(note.projectX, note.projectY, note)
                            );
                            hitWordList.add(HitWord.early(note.projectX, note.projectY));
                        } else if (deltaTime2 > -this.time.AP || note.frameCount < 1) {
                            note.holdStatus = 4; //console.log('Perfect(Max)', i.name);
                            hitImageList.add(
                                HitImage.perfect(note.projectX, note.projectY, note)
                            );
                        } else if (deltaTime2 > -this.time.p || note.frameCount < 2) {
                            note.holdStatus = 1; //console.log('Perfect(Late)', i.name);
                            hitImageList.add(
                                HitImage.perfect(note.projectX, note.projectY, note)
                            );
                            hitWordList.add(HitWord.late(note.projectX, note.projectY));
                        } else {
                            note.holdStatus = 3; //console.log('Good(Late)', i.name);
                            hitImageList.add(
                                HitImage.good(note.projectX, note.projectY, note)
                            );
                            hitWordList.add(HitWord.late(note.projectX, note.projectY));
                        }
                        if (note.type === 1) note.status = note.holdStatus;
                        if (note.type === 3) note.holdStart = realTime;
                        recordMgr.add(note);
                    }
                    if (noteJudge.status) {
                        stat.addCombo(noteJudge.status, 1);
                        noteJudge.scored = true;
                    } else {
                        noteJudge.holdTapTime = performance.now();
                        noteJudge.holdBroken = false;
                    }
                    judgeEvent.judged = true;
                    if (!nearcomp) break;
                }
                if (emitter.eq("play") && note.holdTapTime && note.holdBroken) {
                    note.status = 2; //console.log('Miss', i.name);
                    // note.brokenTime = realTime;
                    recordMgr.add(note);
                    stat.addCombo(2, 3);
                    note.scored = true;
                }
            }
        }
    },
};


class JudgeEvent {
    constructor(offsetX, offsetY, type, event) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.type = type | 0; //1-Tap,2-Hold/Drag,3-Move
        this.judged = false; //是否被判定
        this.event = event; //flick专用回调
        this.preventBad = false; //是否阻止判定为Bad
    }
}
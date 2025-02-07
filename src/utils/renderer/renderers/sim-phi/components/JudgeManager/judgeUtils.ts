import { NoteExtends } from '../../simphi';
import { JudgeEvent } from './JudgeEvent';

/**
 * 判定和音符的水平距离
 */
export function getJudgeOffset(judgeEvent: JudgeEvent, note: NoteExtends): number {
    const { offsetX, offsetY } = judgeEvent;
    const { offsetX: x, offsetY: y, cosr, sinr } = note;
    return Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) || 0;
}

/**
 * 判定和音符的曼哈顿距离
 */
export function getJudgeDistance(judgeEvent: JudgeEvent, note: NoteExtends): number {
    const { offsetX, offsetY } = judgeEvent;
    const { offsetX: x, offsetY: y, cosr, sinr } = note;
    return (
        Math.abs((offsetX - x) * cosr + (offsetY - y) * sinr) +
        Math.abs((offsetX - x) * sinr - (offsetY - y) * cosr) || 0
    );
}
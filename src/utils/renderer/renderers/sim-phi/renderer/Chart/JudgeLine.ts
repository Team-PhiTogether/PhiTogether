import { Note } from "./Note";
import { LineEvent } from "../Events/LineEvent";
import { SpeedEvent } from "../Events/SpeedEvent";

interface JudgeLineOptions {
    numOfNotes?: number;
    numOfNotesAbove?: number;
    numOfNotesBelow?: number;
    attachUI?: boolean;
    bpm?: number;
    speedEvents?: any[];
    notesAbove?: any[];
    notesBelow?: any[];
    judgeLineDisappearEvents?: any[];
    judgeLineMoveEvents?: any[];
    judgeLineRotateEvents?: any[];
    judgeLineColorEvents?: any[];
    judgeLineTextEvents?: any[];
    judgeLineScaleXEvents?: any[];
    judgeLineScaleYEvents?: any[];
}

export class JudgeLine {
    numOfNotes: number;
    numOfNotesAbove: number;
    numOfNotesBelow: number;
    attachUI: boolean;
    bpm: number;
    speed: number;
    speedEvents: SpeedEvent[];
    notesAbove: Note[];
    notesBelow: Note[];
    judgeLineDisappearEvents: LineEvent[];
    judgeLineMoveEvents: LineEvent[];
    judgeLineRotateEvents: LineEvent[];
    judgeLineColorEvents: LineEvent[];
    judgeLineTextEvents: LineEvent[];
    judgeLineScaleXEvents: LineEvent[];
    judgeLineScaleYEvents: LineEvent[];

    constructor(line: JudgeLineOptions = {}) {
        this.numOfNotes = parseInt(String(line.numOfNotes)) || 0;
        this.numOfNotesAbove = parseInt(String(line.numOfNotesAbove)) || 0;
        this.numOfNotesBelow = parseInt(String(line.numOfNotesBelow)) || 0;
        this.attachUI = line.attachUI || false;
        this.bpm = parseFloat(String(line.bpm)) || 0;
        this.speed = 0;
        this.speedEvents = Array.isArray(line.speedEvents)
            ? line.speedEvents.map(i => new SpeedEvent(i))
            : [];
        this.notesAbove = Array.isArray(line.notesAbove)
            ? line.notesAbove.map(i => new Note(i))
            : [];
        this.notesBelow = Array.isArray(line.notesBelow)
            ? line.notesBelow.map(i => new Note(i))
            : [];
        this.judgeLineDisappearEvents = Array.isArray(line.judgeLineDisappearEvents)
            ? line.judgeLineDisappearEvents.map(i => new LineEvent(i))
            : [];
        this.judgeLineMoveEvents = Array.isArray(line.judgeLineMoveEvents)
            ? line.judgeLineMoveEvents.map(i => new LineEvent(i))
            : [];
        this.judgeLineRotateEvents = Array.isArray(line.judgeLineRotateEvents)
            ? line.judgeLineRotateEvents.map(i => new LineEvent(i))
            : [];
        this.judgeLineColorEvents = Array.isArray(line.judgeLineColorEvents)
            ? line.judgeLineColorEvents.map(i => new LineEvent(i))
            : [];
        this.judgeLineTextEvents = Array.isArray(line.judgeLineTextEvents)
            ? line.judgeLineTextEvents.map(i => new LineEvent(i))
            : [];
        this.judgeLineScaleXEvents = Array.isArray(line.judgeLineScaleXEvents)
            ? line.judgeLineScaleXEvents.map(i => new LineEvent(i))
            : [];
        this.judgeLineScaleYEvents = Array.isArray(line.judgeLineScaleYEvents)
            ? line.judgeLineScaleYEvents.map(i => new LineEvent(i))
            : [];
    }
}
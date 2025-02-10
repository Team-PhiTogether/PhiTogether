import { JudgelineExtends } from './JudgeLine';

interface NoteParams {
    type?: number | string;
    time?: number | string;
    isFake?: boolean;
    visibleTime?: number | string;
    positionX?: number | string;
    holdTime?: number | string;
    speed?: number | string;
    floorPosition?: number | string;
    alpha?: number | string;
    size?: number;
}

export class Note {
    readonly type: number;
    readonly time: number;
    readonly isFake: boolean;
    readonly visibleTime: number;
    readonly positionX: number;
    readonly holdTime: number;
    readonly speed: number;
    readonly floorPosition: number;
    readonly realAlpha: number;
    readonly size: number;

    constructor(note: NoteParams) {
        note = note ?? {};
        this.type = parseInt(note.type as string) || 0;
        this.time = parseInt(note.time as string) || 0;
        this.isFake = note.isFake || false;
        this.visibleTime = parseFloat(note.visibleTime as string) || Infinity;
        this.positionX = parseFloat(note.positionX as string) || 0;
        this.holdTime = parseInt(note.holdTime as string) || 0;
        this.speed = parseFloat(note.speed as string) || 0;
        this.floorPosition = parseFloat(note.floorPosition as string) || 0;
        this.realAlpha = parseFloat(note.alpha || note.alpha === 0 ? note.alpha as string : '1');
        this.size = note.size || 1;
    }
}


export interface NoteExtends {
    type: number;
    time: number;
    holdTime: number;
    speed: number;
    realTime: number;
    realHoldTime: number;
    offsetX: number;
    offsetY: number;
    alpha: number;
    line: JudgelineExtends;
    lineId: number;
    noteId: number;
    isAbove: boolean;
    name: string;
    isMulti: boolean;
    nearNotes: NoteExtends[];
    badtime?: number;
    badY?: number;
    projectX: number;
    projectY: number;
    cosr: number;
    sinr: number;
    visible: boolean;
    showPoint: boolean;
    frameCount: number | null;
    status: number;
    realAlpha: number;
    visibleTime: number;
    positionX: number;
    floorPosition: number;
}
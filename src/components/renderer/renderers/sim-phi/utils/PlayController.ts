export class PlayController {
    private _status: PlayStatus = PlayStatus.Unprepared;
    public _operating: boolean = false;
    private _eventlisteners: { [key: string]: Function } = {};

    constructor() {
        this._status = PlayStatus.Unprepared;
    }

    get status(): PlayStatus {
        return this._status;
    }
    addEventListener(event: PlayEvent, listener: Function) {
        this._eventlisteners[event] = listener;
    }

    ready() {
        if (this._status === PlayStatus.Unprepared) this._status = PlayStatus.Stopped;
    }
    async toggle() {
        if (this._status === PlayStatus.Playing) return this.pause();
        if (this._status === PlayStatus.Paused) return this.resume();
    }
    async play() {
        if (this._operating || [PlayStatus.Playing, PlayStatus.Unprepared].includes(this._status))
            return;

        this._operating = true;
        this._status = PlayStatus.Playing;
        this._eventlisteners[PlayEvent.Play] && (await this._eventlisteners[PlayEvent.Play]());
        this._operating = false;
    }
    async resume() {
        if (this._operating || [PlayStatus.Playing, PlayStatus.Unprepared].includes(this._status))
            return;

        this._operating = true;
        this._status = PlayStatus.Playing;
        this._eventlisteners[PlayEvent.Resume] && (await this._eventlisteners[PlayEvent.Resume]());
        this._operating = false;
    }
    async pause() {
        if (this._operating || this._status !== PlayStatus.Playing) return;

        this._operating = true;
        this._status = PlayStatus.Paused;
        this._eventlisteners[PlayEvent.Pause] && (await this._eventlisteners[PlayEvent.Pause]());
        this._operating = false;
    }
    async stop() {
        if (this._operating || [PlayStatus.Unprepared, PlayStatus.Stopped].includes(this._status))
            return;

        this._operating = true;
        this._status = PlayStatus.Stopped;
        this._eventlisteners[PlayEvent.Stop] && (await this._eventlisteners[PlayEvent.Stop]());
        this._operating = false;
    }
    async startOver() {
        if (this._operating || [PlayStatus.Unprepared].includes(this._status)) return;

        this._operating = true;
        this._status = PlayStatus.Stopped;
        this._eventlisteners[PlayEvent.Stop] && (await this._eventlisteners[PlayEvent.Stop]());
        this._status = PlayStatus.Playing;
        this._eventlisteners[PlayEvent.Play] && (await this._eventlisteners[PlayEvent.Play]());
        this._operating = false;
    }
}

export enum PlayStatus {
    Unprepared,
    Stopped,
    Playing,
    Paused,
}

export enum PlayEvent {
    Play = "play",
    Resume = "resume",
    Pause = "pause",
    Stop = "stop",
}

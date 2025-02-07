import { Utils } from "@utils/js/utils";
interface AudioParamOptions {
    loop?: boolean;
    isOut?: boolean;
    offset?: number;
    playbackrate?: number;
    gainrate?: number;
    interval?: number;
    actx?: AudioContext;
    dest?: MediaStreamAudioDestinationNode;
    singleAudioAllowed?: boolean;
    gainrateTo?: number | null;
    gainrateToTime?: number | null;
}

interface AudioInterface {
    _actx: AudioContext | null;
    _inited: boolean;
    _started: boolean;
    _bfs: (AudioBufferSourceNode | IntervalBufferSource)[];
    dest: MediaStreamAudioDestinationNode | null;
    init(actx: typeof AudioContext): void;
    start(actx?: typeof AudioContext): void;
    decode(arraybuffer: ArrayBuffer): Promise<AudioBuffer>;
    mute(length: number): AudioBuffer;
    play(
        res: AudioBuffer,
        options?: AudioParamOptions
    ): () => AudioBufferSourceNode | IntervalBufferSource;
    stop(): void;
    readonly actx: AudioContext;
}

const audio: AudioInterface = {
    _actx: null,
    _inited: false,
    _started: false,
    _bfs: [],
    dest: null,

    init(actx: typeof AudioContext): void {
        this._actx = actx || self.AudioContext || (self as any).webkitAudioContext;
        this._inited = true;
    },

    start(actx?: typeof AudioContext): void {
        if (!this._inited) this.init(actx);
        if (!this._started) this._actx = new (this._actx as any)();
        this._started = true;
    },

    decode(arraybuffer: ArrayBuffer): Promise<AudioBuffer> {
        const { actx } = this;
        return actx.decodeAudioData(arraybuffer);
    },

    mute(length: number): AudioBuffer {
        const { actx } = this;
        return actx.createBuffer(2, 44100 * length, 44100);
    },

    play(
        res: AudioBuffer,
        {
            loop = false,
            isOut = true,
            offset = 0,
            playbackrate = 1,
            gainrate = 1,
            interval = 0,
            singleAudioAllowed = false,
            gainrateTo = null,
            gainrateToTime = null,
        }: AudioParamOptions = {}
    ): () => AudioBufferSourceNode | IntervalBufferSource {
        const href = String(location.href);
        const { actx, dest } = this;
        const bfs = this._bfs;
        const gain = actx.createGain();

        if (isFinite(interval) && interval > 0) {
            const options = { loop, isOut, offset, playbackrate, gainrate, interval, actx, dest };
            const bufferSource = new IntervalBufferSource(res, options);
            if (!gainrateToTime || !gainrateTo) gain.gain.value = gainrate;
            if (isOut) gain.connect(actx.destination);
            if (dest) gain.connect(dest);
            bufferSource.start();
            if (singleAudioAllowed || location.href !== href) this.stop();
            bfs[bfs.length] = bufferSource;
            return () => bufferSource.bfs;
        }

        const bufferSource = actx.createBufferSource();
        bufferSource.buffer = res;
        bufferSource.loop = loop;
        bufferSource.connect(gain);
        gain.gain.value = gainrate;
        if (gainrateTo && gainrateToTime) {
            gain.gain.linearRampToValueAtTime(gainrateTo, actx.currentTime + gainrateToTime);
        }
        bufferSource.playbackRate.value = playbackrate;
        if (isOut) gain.connect(actx.destination);
        if (dest) gain.connect(dest);
        bufferSource.start(0, offset);
        if (singleAudioAllowed || location.href !== href) this.stop();
        bfs[bfs.length] = bufferSource;
        return () => bufferSource;
    },

    stop(): void {
        const bfs = this._bfs;
        for (const i of bfs) i.stop();
        bfs.length = 0;
    },

    get actx(): AudioContext {
        if (!this._started) this.start();
        return this._actx!;
    },
};

class IntervalBufferSource {
    private res: AudioBuffer;
    private loop: boolean;
    private isOut: boolean;
    private offset: number;
    private playbackrate: number;
    private gainrate: number;
    private interval: number;
    private actx: AudioContext;
    private dest: MediaStreamAudioDestinationNode | null;
    private startTime!: number;
    private _gain!: GainNode;
    private _bfs!: AudioBufferSourceNode;

    constructor(res: AudioBuffer, options: AudioParamOptions = {}) {
        this.res = res;
        this.loop = options.loop ?? false;
        this.isOut = options.isOut ?? true;
        this.offset = options.offset ?? 0;
        this.playbackrate = options.playbackrate ?? 1;
        this.gainrate = options.gainrate ?? 1;
        this.interval = options.interval ?? 0;
        this.actx = options.actx ?? new AudioContext();
        this.dest = options.dest ?? null;
    }

    start(): void {
        this.startTime = performance.now() / 1000;
        this._gain = this.actx.createGain();
        this._gain.gain.value = this.gainrate;
        if (this.isOut) this._gain.connect(this.actx.destination);
        if (this.dest) this._gain.connect(this.dest);
        this._loop();
    }

    stop(): void {
        this._bfs.onended = null;
        this._bfs.stop();
    }

    private _loop(): void {
        this._bfs = this.actx.createBufferSource();
        const bfs = this._bfs;
        bfs.buffer = this.res;
        bfs.loop = this.loop;
        bfs.connect(this._gain);
        bfs.playbackRate.value = this.playbackrate;
        const currentOffset =
            (this.offset + (performance.now() / 1000 - this.startTime) * this.playbackrate) %
            this.res.duration;
        bfs.start(this.actx.currentTime, currentOffset, this.interval);
        bfs.onended = () => {
            bfs.onended = null;
            if (currentOffset + this.interval > this.res.duration && !this.loop) return;
            this._loop();
        };
    }

    get bfs(): AudioBufferSourceNode {
        return this._bfs || this.actx.createBufferSource();
    }
}

class AudioURLParam {
    private URLMap: Map<string, string>;

    constructor() {
        const map = JSON.parse(localStorage.getItem("URLMap") || "null");
        this.URLMap = map ? new Map(map) : new Map();
    }

    async getURL(id: string): Promise<string> {
        if (this.URLMap.has(id)) return this.URLMap.get(id)!;
        const obj = await this.jsonp(atob("aHR0cHM6Ly9hcGkubGNoemgueHl6L211c2ljP2lkPQ==") + id);
        const url = obj.data.replace(/^https?:/, "");
        this.URLMap.set(id, url);
        localStorage.setItem("URLMap", JSON.stringify(Array.from(this.URLMap)));
        return url;
    }

    private jsonp(src: string): Promise<{ data: string }> {
        return new Promise((resolve, reject) => {
            const cstr = `_${Utils.randomUUID("")}`;
            const a = document.createElement("script");
            a.src = `${src}&callback=${cstr}`;
            a.onload = () => a.remove();
            a.onerror = err => {
                reject(err);
                delete (window as any)[cstr];
            };
            (window as any)[cstr] = (data: any) => {
                resolve(data);
                delete (window as any)[cstr];
            };
            document.head.append(a);
        });
    }

    async loadURL(
        id: string,
        options: { actx?: AudioContext; reset?: boolean } = {}
    ): Promise<AudioBuffer> {
        try {
            const url = await this.getURL(id);
            const ab = await fetch(url).then(res => res.arrayBuffer());
            const actx = options.actx ?? new AudioContext();
            return await actx.decodeAudioData(ab);
        } catch (e) {
            if (!options.reset) {
                this.URLMap.delete(id);
                return this.loadURL(id, { ...options, reset: true });
            }
            throw e;
        }
    }
}

export { audio, AudioURLParam };

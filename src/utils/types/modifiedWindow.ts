export interface TmodifiedWindow extends Window {
    nativeApi?: TnativeApi;
    GoPZRecord(
        a: any,
        b: any,
        c: any,
        d: any,
        e: any,
        f: any,
        g: any,
        h: any,
        i: any,
        j: any,
        k: any,
        l: any
    ): Promise<Response>;
    hook: any;
}

interface TnativeApi {
    loginWithTapTap(): void;
    antiAddiction_enterGame(): void;
    antiAddiction_leaveGame(): void;
    antiAddiction_enabled(): boolean;
    saveAs(data: string, filename: string): void;
}

export interface TmodifiedMeta extends ImportMeta {
    env: any;
}

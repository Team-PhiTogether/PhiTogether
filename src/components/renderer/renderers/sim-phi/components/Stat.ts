export class Stat {
    public level: number;
    public noteRank: [number, number, number, number, number, number, number, number];
    public combos: [number, number, number, number, number];
    public maxcombo: number;
    public combo: number;
    private cumDisp: number;
    private curDisp: number;
    private numDisp: number;
    private numOfNotes: number;
    private data: Record<string, string>;
    private id: string;
    public constructor() {
        this.level = 0;
        this.noteRank = [0, 0, 0, 0, 0, 0, 0, 0];
        this.combos = [0, 0, 0, 0, 0];
        this.cumDisp = 0;
        this.curDisp = 0;
        this.numDisp = 0;
        this.maxcombo = 0;
        this.combo = 0;
        this.numOfNotes = 0;
        this.data = {};
        this.id = "";
    }
    public get good(): number {
        return this.noteRank[7] + this.noteRank[3];
    }
    public get bad(): number {
        return this.noteRank[6] + this.noteRank[2];
    }
    public get great(): number {
        return this.noteRank[5] + this.noteRank[1];
    }
    public get perfect(): number {
        return this.noteRank[4] + this.great;
    }
    public get all(): number {
        return this.perfect + this.good + this.bad;
    }
    public get scoreNum(): number {
        const a =
            (1e6 * (this.perfect * 0.9 + this.good * 0.585 + this.maxcombo * 0.1)) /
            this.numOfNotes;
        return isFinite(a) ? a : 0;
    }
    public get scoreStr(): string {
        const a = this.scoreNum.toFixed(0);
        return "0".repeat(a.length < 7 ? 7 - a.length : 0) + a;
    }
    public get accNum(): number {
        const a = (this.perfect + this.good * 0.65) / this.all;
        return isFinite(a) ? a : 1;
    }
    public get accStr(): string {
        return `${(100 * this.accNum).toFixed(2)}\uff05`;
    }
    public get avgDispStr(): string {
        const a = Math.trunc((this.cumDisp / this.numDisp) * 1e3) || 0;
        return `${a > 0 ? "+" : ""}${a.toFixed(0)}ms`;
    }
    public get curDispStr(): string {
        const a = Math.trunc(this.curDisp * 1e3);
        return `${a > 0 ? "+" : ""}${a.toFixed(0)}ms`;
    }
    public get lineStatus(): 0 | 1 | 3 {
        if (this.bad) return 0;
        if (this.good) return 3;
        return 1;
    }
    public get rankStatus(): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
        const a = Math.round(this.scoreNum);
        if (a >= 1e6) return 0;
        if (a >= 9.6e5) return 1;
        if (a >= 9.2e5) return 2;
        if (a >= 8.8e5) return 3;
        if (a >= 8.2e5) return 4;
        if (a >= 7e5) return 5;
        return 6;
    }
    get life(): number {
        const life = 1000 - this.good * 1 - this.bad * 10 - this.noteRank[2] * 40;
        return life > 0 ? life : 0;
    }
    public getData(isAuto: boolean, speed = ""): StatData {
        let scoreBest = "0000000"; // 补0历史最高分
        if (!speed) {
            const d = JSON.parse(sessionStorage.getItem("loadedChart") || "{}");
            if (d && d.userScore) scoreBest = d.userScore[1];
        }
        const s2 = parseInt(scoreBest);
        const l2 = this.scoreNum; // 本次原始分

        const scoreDeltaRaw = Math.abs(s2 - parseInt(this.scoreStr))
            .toString()
            .padStart(7, "0");
        const pbj = {
            newBestColor: s2 < l2 ? "#18ffbf" : "#fff",
            newBestStr: s2 < l2 ? "NEW BEST" : " ",
            scoreBest: scoreBest,
            scoreDelta: s2 > l2 ? " " : "+" + scoreDeltaRaw,
            textAboveColor: "#65fe43",
            textAboveStr: "SPEED {SPEED}x",
            textBelowColor: "#fe4365",
            textBelowStr: "AUTO PLAY",
        };
        if (isAuto)
            return Object.assign(pbj, {
                newBestColor: "#fff",
                scoreBest: "0000000",
                newBestStr: "PREVIEW",
                scoreDelta: "+1000000",
            });
        if (this.lineStatus === 1)
            return Object.assign(pbj, {
                textBelowStr: "ALL  PERFECT",
                textBelowColor: "#ffc500",
            });
        if (this.lineStatus === 3)
            return Object.assign(pbj, {
                textBelowStr: "FULL  COMBO",
                textBelowColor: "#00bef1",
            });
        return Object.assign(pbj, { textBelowStr: "" });
    }
    public reset(numOfNotes: number, id: string, speed = "", format: string): void {
        this.numOfNotes = Number(numOfNotes) || 0;
        this.combo = 0;
        this.maxcombo = 0;
        this.noteRank = [0, 0, 0, 0, 0, 0, 0, 0]; //4:PM,5:PE,1:PL,7:GE,3:GL,6:BE,2:BL
        this.combos = [0, 0, 0, 0, 0]; //不同种类note实时连击次数
        this.cumDisp = 0;
        this.curDisp = 0;
        this.numDisp = 0;
        this.data = {};
        if (id) this.id = id;
    }
    public addCombo(status: number, type: number): void {
        this.noteRank[status]++;
        this.combo = status % 4 === 2 ? 0 : this.combo + 1;
        if (this.combo > this.maxcombo) this.maxcombo = this.combo;
        this.combos[0]++;
        this.combos[type]++;
    }
    public addDisp(disp: number): void {
        this.curDisp = disp;
        this.cumDisp += disp;
        this.numDisp++;
    }
}

interface StatData {
    newBestColor: string;
    newBestStr: string;
    scoreBest: string;
    scoreDelta: string;
    textAboveColor: string;
    textAboveStr: string;
    textBelowColor: string;
    textBelowStr: string;
}

import ptdb from "@utils/ptdb";
import { JudgeLine } from "./JudgeLine";

interface ChartData {
    formatVersion?: string | number;
    offset?: string | number;
    chartRPE?: any;
    chartPec?: any;
    numOfNotes?: string | number;
    judgeLineList?: any[];
    md5?: string;
}

export class Chart {
    formatVersion: number;
    offset: number;
    offsetBak: number;
    chartRPE: any;
    chartPec: any;
    numOfNotes: number;
    judgeLineList: JudgeLine[];

    constructor(chart: ChartData) {
        chart = chart ?? {};
        this.formatVersion = parseInt(String(chart.formatVersion)) || 0;
        this.offset = parseFloat(String(chart.offset || 0));
        this.offsetBak = parseFloat(String(chart.offset)) || 0;
        this.chartRPE = chart.chartRPE || null;
        this.chartPec = chart.chartPec || null;
        this.numOfNotes = parseInt(String(chart.numOfNotes)) || 0;
        this.judgeLineList = Array.isArray(chart.judgeLineList)
            ? chart.judgeLineList.map(i => new JudgeLine(i))
            : [];
        getAdjustedOffset(chart)
            .then(offset => (this.offset = offset))
            .catch((e: Error) => e);
    }
}

function getAdjustedOffset(chart: ChartData): Promise<number> {
    return new Promise(res => {
        ptdb.gameConfig
            .get("savedChartOffsets")
            .then((savedChartOffsets: Record<string, number> | null) => {
                if (!savedChartOffsets || !chart.md5 || !savedChartOffsets[chart.md5])
                    res(parseFloat(String(chart.offset)) || 0);
                res(parseFloat(String(savedChartOffsets[chart.md5])));
            })
            .catch((e: Error) => res(parseFloat(String(chart.offset)) || 0));
    });
}

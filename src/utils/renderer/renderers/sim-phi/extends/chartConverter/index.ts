import { parse } from "./pec";
import { parse as parseRPE } from "./rpe";

interface ChartInfo {
    [key: string]: string;
}

function info(text: string): ChartInfo[] {
    const lines = String(text).split(/\r?\n/);
    const result: ChartInfo[] = [];
    let current: ChartInfo = {};
    for (const i of lines) {
        if (i.startsWith("#")) {
            if (Object.keys(current).length) result.push(current);
            current = {};
        } else {
            let [key, value] = i.split(/:(.+)/).map(i => i.trim());
            if (key === "Song") key = "Music";
            if (key === "Picture") key = "Image";
            if (key) current[key] = value;
        }
    }
    if (Object.keys(current).length) result.push(current);
    return result;
}

export default { parse, parseRPE, info };

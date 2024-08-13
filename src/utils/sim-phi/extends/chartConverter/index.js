import { parse } from "./pec";
import { parse as parseRPE } from "./rpe";

//读取info.txt
function info(text) {
    const lines = String(text).split(/\r?\n/);
    const result = [];
    let current = {};
    for (const i of lines) {
        if (i.startsWith('#')) {
            if (Object.keys(current).length) result.push(current);
            current = {};
        } else {
            let [key, value] = i.split(/:(.+)/).map(i => i.trim());
            if (key === 'Song') key = 'Music';
            if (key === 'Picture') key = 'Image';
            if (key) current[key] = value;
        }
    }
    if (Object.keys(current).length) result.push(current);
    return result;
}

export default { parse, parseRPE, info };
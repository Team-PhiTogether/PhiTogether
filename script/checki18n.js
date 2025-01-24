import zh_CN from "../src/locales/zh_CN.json" assert { type: "json" };
import zh_TW from "../src/locales/zh_TW.json" assert { type: "json" };
import en_US from "../src/locales/en_US.json" assert { type: "json" };
import * as fs from "fs";

function traverseFiles(dir) {
    const data = [];

    function processFile(pth) {
        let content = fs.readFileSync(pth, "utf-8").toString();
        const reg = /(\$|global\.|i18n\.)t\(['"]([^'"]+)['"]/;
        let res = reg.exec(content);
        while (res && res[2]) {
            if (!data.includes(res[1])) data.push(res[2]);
            content = content.replace(reg, "");
            res = reg.exec(content);
        }
    }

    function readDirectory(directoryPath) {
        try {
            const fileList = fs.readdirSync(directoryPath);

            for (let i = 0; i < fileList.length; i++) {
                const fileName = fileList[i];

                if (fileName.endsWith("wasm")) continue;

                const filePath = `${directoryPath}/${fileName}`;
                const stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    processFile(filePath);
                } else if (stats.isDirectory() && fileName !== "." && fileName !== "..") {
                    readDirectory(filePath);
                }
            }
        } catch (error) {
            console.log(`Error reading directory ${directoryPath}:`, error);
        }
    }

    readDirectory(dir);

    processFile("../index.html");

    return data;
}

const usedKeys = traverseFiles("../src");

function getAllKeys(ori, prefix = "") {
    let keys = [];
    for (const t in ori) {
        if (typeof ori[t] === "string") {
            keys.push(prefix + `${t}`);
        } else {
            const d = getAllKeys(ori[t], prefix + `${t}.`);
            keys = keys.concat(d);
        }
    }
    return keys;
}

function compare(a, b, tipsa = "在A中不在B中", tipsb = "在B中不在A中") {
    console.log(
        tipsa,
        a.filter(x => !b.includes(x))
    );
    console.log(
        tipsb,
        b.filter(x => !a.includes(x))
    );
}

const zhcnkeys = getAllKeys(zh_CN);
const zhtwkeys = getAllKeys(zh_TW);
const enuskeys = getAllKeys(en_US);

compare(
    usedKeys.filter(e => {
        return !e.startsWith("pages") && !e.startsWith("serverMsg");
    }),
    zhcnkeys.filter(e => {
        return !e.startsWith("pages") && !e.startsWith("serverMsg");
    }),
    "使用但未定义的",
    "未使用但定义的"
);
compare(zhcnkeys, zhtwkeys, "在简体中文而不在繁体中文的", "在繁体中文而不在简体中文的");
compare(zhcnkeys, enuskeys, "在简体中文而不在英文的", "在英文而不在简体中文的");

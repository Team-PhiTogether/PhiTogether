import ploading from "@utils/js/ploading.js";
import shared from "@utils/js/shared.js";
import { simphiPlayer } from "../playerMain";
import { msgHandler } from "@utils/js/msgHandler";
import { audio } from "@utils/js/aup";
import { uploader, ZipReader, readFile } from "./reader";
import { imgBlur } from "./imgProcessor";

interface ReaderData {
    type: string;
    name: string;
    data: any;
    buffer?: ArrayBuffer;
    msg?: string[];
    info?: any;
    line?: any[];
    md5?: string;
}

interface FileLoadEvent extends ProgressEvent<FileReader> {
    file: File;
    buffer: ArrayBuffer;
}

const $id = (query: string): HTMLElement | null => document.getElementById(query);

let dones: Record<string, number> = {};
let totals: Record<string, number> = {};
let uploader_done = 0;
let uploader_total = 0;

export const handleFile = async (
    tag: string,
    total: number,
    promise: Promise<any> | any,
    oncomplete: () => void = () => {}
): Promise<void> => {
    if (!totals[tag] || total >= totals[tag]) totals[tag] = total;
    uploader_total = Object.values(totals).reduce((a, b) => a + b, 0);
    if (!(promise instanceof Promise)) promise = Promise.resolve();
    await promise.catch(err =>
        msgHandler.sendWarning(
            shared.game.i18n.t("simphi.handleFile.unsupportedFile", [err.cause.name])
        )
    );
    dones[tag] = (dones[tag] || 0) + 1;
    uploader_done = Object.values(dones).reduce((a, b) => a + b, 0);
    ploading.l(
        shared.game.i18n.t("simphi.handleFile.loadingFile", { uploader_done, uploader_total }),
        "loadChart"
    );
    if (dones[tag] === totals[tag]) oncomplete();
    loadComplete();
};

let file_total = 0;
const options = {
    createAudioBuffer: (...args: any[]) => audio.decode(...args),
};

const zip = new ZipReader({ handler: (data: any) => readFile(data, options) });
zip.addEventListener("loadstart", () => {});
zip.addEventListener("read", (evt: CustomEvent) => handleFile("zip", zip.total, pick(evt.detail)));

const uploaderUpload = $id("uploader-upload");
const uploaderFile = $id("uploader-file");
const uploaderDir = $id("uploader-dir");

uploaderUpload?.addEventListener("click", uploader.uploadFile);
uploaderFile?.addEventListener("click", uploader.uploadFile);
uploaderDir?.addEventListener("click", uploader.uploadDir);

uploader.reset = (i: number | false = false): void => {
    dones = {};
    if (i !== false) totals = { file: i };
    else totals = {};
    file_total = 0;
    uploader_done = 0;
    uploader_total = 0;
    zip.reset();
};

uploader.addEventListener("change", loadComplete);
// uploader.addEventListener("progress", function (evt: ProgressEvent<FileReader>) {
// //显示加载文件进度
// if (!evt.total) return;
// const percent = Math.floor((evt.loaded / evt.total) * 100);
// msgHandler.sendMessage(
//   `加载文件：${percent}% (${bytefm(evt.loaded)}/${bytefm(evt.total)})`
// );
// });

let lastEvtPromise: Promise<void> | null = null;
uploader.addEventListener("load", async function (evt: FileLoadEvent) {
    await lastEvtPromise;
    lastEvtPromise = null;
    const {
        file: { name, webkitRelativePath: path },
        buffer,
    } = evt;
    const isZip = buffer.byteLength > 4 && new DataView(buffer).getUint32(0, false) === 0x504b0304;
    const data = { name: name, buffer, path: path || name };
    if (isZip) {
        lastEvtPromise = zip.read(data);
        await lastEvtPromise;
        if (totals["file"] > file_total) {
            if (dones["file"]) dones["file"]++;
            else dones["file"] = 1;
        }
    } else {
        file_total++;
        readFile(data, options).then(result => handleFile("file", file_total, pick(result)));
    }
});

async function pick(data: ReaderData): Promise<void> {
    switch (data.type) {
        case "line":
            simphiPlayer.chartData.chartLineData.push(...data.data);
            break;
        case "info":
            simphiPlayer.chartData.chartInfoData.push(...data.data);
            break;
        case "media":
        case "audio":
            simphiPlayer.chartData.bgms.set(data.name, data.data);
            simphiPlayer.selectbgm.appendChild(createOption(data.name, data.name));
            break;
        case "image":
            simphiPlayer.chartData.bgs.set(data.name, data.data);
            simphiPlayer.chartData.bgsBlur.set(data.name, await imgBlur(data.data));
            simphiPlayer.selectbg.appendChild(createOption(data.name, data.name));
            break;
        case "chart":
            if (data.msg) data.msg.forEach(v => msgHandler.sendWarning(v));
            if (data.info) simphiPlayer.chartData.chartInfoData.push(data.info);
            if (data.line) simphiPlayer.chartData.chartLineData.push(...data.line);
            let basename = data.name;
            while (simphiPlayer.chartData.charts.has(basename)) basename += "\n";
            data.data.md5 = data.md5;
            simphiPlayer.chartData.charts.set(basename, data.data);
            simphiPlayer.chartData.chartsMD5.set(basename, data.md5);
            simphiPlayer.selectchart.appendChild(createOption(basename, data.name));
            break;
        default:
            console.error(data["data"]);
            throw new Error(`Unsupported file: ${data["name"]}`, { cause: data });
    }
    if (data.name && data.buffer) simphiPlayer.chartData.oriBuffers.set(data.name, data.buffer);
}

function createOption(value: string, innerhtml: string): HTMLOptionElement {
    const option = document.createElement("option");
    const isHidden = /(^|\/)\./.test(innerhtml);
    option.innerHTML = isHidden ? "" : innerhtml;
    option.value = value;
    if (isHidden) option.classList.add("hide");
    return option;
}

function loadComplete(): void {
    if ("skin" in totals) return;
    if (uploader_done && uploader_done === uploader_total) {
        shared.game.ptmain.chartLoadedCB();
    }
}

import { audio } from "../../js/aup";
import { imgShader, hex2rgba } from "../assetsProcessor/imgProcessor.js";
import ptdb from "../../ptdb";

//plugin(skin)
export function loadSkinFromBuffer(buffer, init = false, callback) {
    return new Promise((resolve, reject) => {
        try {
            const id = `skin`;
            const files = [];
            const zip = new hook.ZipReader({
                handler: async (data) => files.push(data),
            });
            zip.addEventListener("loadstart", () => { });
            zip.addEventListener("read", (evt) =>
                hook.handleFile(id, zip.total, null, done)
            );
            zip.read({
                name: "skin.zip",
                buffer: buffer,
                path: "skin.zip",
            });
            async function done() {
                const config = Object.create(await loadConfig(files));
                /** @type {Object<string, string[]>} */
                const alias = {
                    Tap: ["Tap.png", "click.png"],
                    TapHL: ["TapHL.png", "click_mh.png"],
                    Drag: ["Drag.png", "drag.png"],
                    DragHL: ["DragHL.png", "drag_mh.png"],
                    Hold: ["Hold.png", "hold.png"],
                    HoldHL: ["HoldHL.png", "hold_mh.png"],
                    Flick: ["Flick.png", "flick.png"],
                    FlickHL: ["FlickHL.png", "flick_mh.png"],
                    HitFX: ["HitFX.png", "hit_fx.png"],
                    HitSong0: ["click.ogg"],
                    HitSong1: ["drag.ogg"],
                    HitSong2: ["flick.ogg"],
                };
                // 根据别名补全文件列表
                /** @type {Map<string, ReaderData>} */
                const entries = new Map();
                for (const [a, b] of Object.entries(alias)) {
                    const file = files.find(i => b.find((j) => String(i.name).endsWith(j)));
                    if (file) entries.set(a, file);
                }
                // 读取图片
                if (entries.has('Tap')) {
                    const img = await createImageBitmap(new Blob([entries.get('Tap').buffer]));
                    const noteScale = 1089 / img.width;
                    hook.noteRender.update('Tap', img, noteScale);
                    if (entries.has('TapHL')) {
                        hook.noteRender.update('TapHL', await createImageBitmap(new Blob([entries.get('TapHL').buffer])), noteScale);
                    } else {
                        hook.noteRender.update('TapHL', img, noteScale);
                    }
                }
                if (entries.has('Drag')) {
                    const img = await createImageBitmap(new Blob([entries.get('Drag').buffer]));
                    const noteScale = 1089 / img.width;
                    hook.noteRender.update('Drag', img, noteScale);
                    if (entries.has('DragHL')) {
                        hook.noteRender.update('DragHL', await createImageBitmap(new Blob([entries.get('DragHL').buffer])), noteScale);
                    } else {
                        hook.noteRender.update('DragHL', img, noteScale);
                    }
                }
                if (entries.has('Hold')) {
                    const img = await createImageBitmap(new Blob([entries.get('Hold').buffer]));
                    const noteScale = 1089 / img.width;
                    const [bottom, top] = config.holdAtlas;
                    const compacted = config.holdCompact;
                    hook.noteRender.update('HoldEnd', await createImageBitmap(img, 0, 0, img.width, bottom), noteScale, compacted);
                    hook.noteRender.update('Hold', await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top), noteScale, compacted);
                    hook.noteRender.update('HoldHead', await createImageBitmap(img, 0, img.height - top, img.width, top), noteScale, compacted);
                    if (entries.has('HoldHL')) {
                        const img2 = await createImageBitmap(new Blob([entries.get('HoldHL').buffer]));
                        const [bottom2, top2] = config.holdAtlasHL || config.holdAtlasMH || config.holdAtlas;
                        hook.noteRender.update('HoldEndHL', await createImageBitmap(img2, 0, 0, img2.width, bottom2), noteScale, compacted);
                        hook.noteRender.update('HoldHL', await createImageBitmap(img2, 0, bottom2, img2.width, img2.height - bottom2 - top2), noteScale, compacted);
                        hook.noteRender.update('HoldHeadHL', await createImageBitmap(img2, 0, img2.height - top2, img2.width, top2), noteScale, compacted);
                    } else {
                        hook.noteRender.update('HoldEndHL', await createImageBitmap(img, 0, 0, img.width, bottom), noteScale, compacted);
                        hook.noteRender.update('HoldHL', await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top), noteScale, compacted);
                        hook.noteRender.update('HoldHeadHL', await createImageBitmap(img, 0, img.height - top, img.width, top), noteScale, compacted);
                    }
                }
                if (entries.has('Flick')) {
                    const img = await createImageBitmap(new Blob([entries.get('Flick').buffer]));
                    const noteScale = 1089 / img.width;
                    hook.noteRender.update('Flick', img, noteScale);
                    if (entries.has('FlickHL')) {
                        hook.noteRender.update('FlickHL', await createImageBitmap(new Blob([entries.get('FlickHL').buffer])), noteScale);
                    } else {
                        hook.noteRender.update('FlickHL', img, noteScale);
                    }
                }
                if (entries.has('HitFX')) {
                    const img = await createImageBitmap(new Blob([entries.get('HitFX').buffer]));
                    const [x, y] = config.hitFx;
                    const scale = (config.hitFxScale || 1.0) / (img.width / x / 256);
                    const hideParts = config.hideParticles || false;
                    const duration = config.hitFxDuration * 1000 || 500;
                    hook.noteRender.updateFX(img, scale, img.width / x, img.height / y, hideParts, duration);
                }
                // 读取音频
                if (entries.has('HitSong0')) hook.res.HitSong0 = await audio.decode(entries.get('HitSong0').buffer.slice(0));
                if (entries.has('HitSong1')) hook.res.HitSong1 = await audio.decode(entries.get('HitSong1').buffer.slice(0));
                if (entries.has('HitSong2')) hook.res.HitSong2 = await audio.decode(entries.get('HitSong2').buffer.slice(0));
                if (typeof config.colorPerfect === "string" && config.colorPerfect.startsWith("0x")) config.colorPerfect = `#${config.colorPerfect.slice(2)}`;
                if (typeof config.colorGood === "string" && config.colorGood.startsWith("0x")) config.colorGood = `#${config.colorGood.slice(2)}`;
                hook.res["JudgeLineMP"] = await imgShader(hook.res["JudgeLine"], config.colorPerfect || "#feffa9");
                hook.res["JudgeLineFC"] = await imgShader(hook.res["JudgeLine"], config.colorGood || "#a2eeff");
                hook.tmps.hitPerfectColor = config.hitFxTinted ? hex2rgba(config.colorPerfect) || null : null;
                hook.tmps.hitGoodColor = config.hitFxTinted ? hex2rgba(config.colorGood) || null : null;
                hook.tmps.hitFxRotate = config.hitFxRotate;
                hook.customResourceMeta.author = config.author || "unknown";
                hook.customResourceMeta.name = config.name || "unknown";
                hook.customResourceMeta.loaded = true;
                shared.game.loadHandler.r("loadChart");
                const allConfig = {};
                for (const i in config) allConfig[i] = config[i];
                resolve(callback ? await callback(
                    entries,
                    { author: config.author, name: config.name },
                    allConfig,
                ) : null);
            }

            async function loadConfig(files = []) {
                const config0 = files.find(i => String(i.name).endsWith("config.txt"));
                if (config0) return yaml2json(await stringify(config0.buffer), /;?\r?\n/);
                const config1 = files.find(i => String(i.name).endsWith("info.yml"));
                if (config1) return yaml2json(await stringify(config1.buffer));
                reject();
                return {};
            }

            function yaml2json(text = "", split = /\r?\n/) {
                const parse = (value) => {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                };
                return text.split(split).reduce((i, j) => {
                    const [key, value] = j.split(/:(.+)/).map((i) => i.trim());
                    if (key) i[key] = parse(value);
                    if (i[key] === "True") i[key] = true;
                    if (i[key] === "False") i[key] = false;
                    return i;
                }, {});
            }
            async function stringify(i) {
                const labels = ["utf-8", "gbk", "big5", "shift_jis"];
                for (const label of labels) {
                    const decoder = new TextDecoder(label, { fatal: true }); // '\ufffd'
                    try {
                        return decoder.decode(i);
                    } catch (e) {
                        if (label === labels[labels.length - 1]) throw e;
                    }
                }
            }
        } catch (e) {
            reject();
        }
    });
}


export async function loadSkinFromDB(id) {
    const skin = await ptdb.skin.get(id);

    // 读取图片
    if (skin.files.has('Tap')) {
        const img = await skin.files.get('Tap').file;
        const noteScale = 1089 / img.width;
        hook.noteRender.update('Tap', img, noteScale);
        if (skin.files.has('TapHL')) {
            hook.noteRender.update('TapHL', await skin.files.get('TapHL').file, noteScale);
        } else {
            hook.noteRender.update('TapHL', img, noteScale);
        }
    }
    if (skin.files.has('Drag')) {
        const img = await skin.files.get('Drag').file;
        const noteScale = 1089 / img.width;
        hook.noteRender.update('Drag', img, noteScale);
        if (skin.files.has('DragHL')) {
            hook.noteRender.update('DragHL', await skin.files.get('DragHL').file, noteScale);
        } else {
            hook.noteRender.update('DragHL', img, noteScale);
        }
    }
    if (skin.files.has('Hold')) {
        const img = await skin.files.get('Hold').file;
        const noteScale = 1089 / img.width;
        const [bottom, top] = skin.config.holdAtlas;
        const compacted = skin.config.holdCompact;
        hook.noteRender.update('HoldEnd', await createImageBitmap(img, 0, 0, img.width, bottom), noteScale, compacted);
        hook.noteRender.update('Hold', await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top), noteScale, compacted);
        hook.noteRender.update('HoldHead', await createImageBitmap(img, 0, img.height - top, img.width, top), noteScale, compacted);
        if (skin.files.has('HoldHL')) {
            const img2 = await skin.files.get('HoldHL').file;
            const [bottom2, top2] = skin.config.holdAtlasHL || skin.config.holdAtlasMH || skin.config.holdAtlas;
            hook.noteRender.update('HoldEndHL', await createImageBitmap(img2, 0, 0, img2.width, bottom2), noteScale, compacted);
            hook.noteRender.update('HoldHL', await createImageBitmap(img2, 0, bottom2, img2.width, img2.height - bottom2 - top2), noteScale, compacted);
            hook.noteRender.update('HoldHeadHL', await createImageBitmap(img2, 0, img2.height - top2, img2.width, top2), noteScale, compacted);
        } else {
            hook.noteRender.update('HoldEndHL', await createImageBitmap(img, 0, 0, img.width, bottom), noteScale, compacted);
            hook.noteRender.update('HoldHL', await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top), noteScale, compacted);
            hook.noteRender.update('HoldHeadHL', await createImageBitmap(img, 0, img.height - top, img.width, top), noteScale, compacted);
        }
    }
    if (skin.files.has('Flick')) {
        const img = await skin.files.get('Flick').file;
        const noteScale = 1089 / img.width;
        hook.noteRender.update('Flick', img, noteScale);
        if (skin.files.has('FlickHL')) {
            hook.noteRender.update('FlickHL', await skin.files.get('FlickHL').file, noteScale);
        } else {
            hook.noteRender.update('FlickHL', img, noteScale);
        }
    }
    if (skin.files.has('HitFX')) {
        const img = await skin.files.get('HitFX').file;
        const [x, y] = skin.config.hitFx;
        const scale = (skin.config.hitFxScale || 1.0) / (img.width / x / 256);
        const hideParts = skin.config.hideParticles || false;
        const duration = skin.config.hitFxDuration * 1000 || 500;
        hook.noteRender.updateFX(img, scale, img.width / x, img.height / y, hideParts, duration);
    }
    // 读取音频
    if (skin.files.has('HitSong0')) hook.res.HitSong0 = await audio.decode(skin.files.get('HitSong0').file);
    if (skin.files.has('HitSong1')) hook.res.HitSong1 = await audio.decode(skin.files.get('HitSong1').file);
    if (skin.files.has('HitSong2')) hook.res.HitSong2 = await audio.decode(skin.files.get('HitSong2').file);

    if (typeof skin.config.colorPerfect === "string" && skin.config.colorPerfect.startsWith("0x")) skin.config.colorPerfect = `#${skin.config.colorPerfect.slice(2)}`;
    if (typeof skin.config.colorGood === "string" && skin.config.colorGood.startsWith("0x")) skin.config.colorGood = `#${skin.config.colorGood.slice(2)}`;
    hook.res["JudgeLineMP"] = await imgShader(hook.res["JudgeLine"], skin.config.colorPerfect || "#feffa9");
    hook.res["JudgeLineFC"] = await imgShader(hook.res["JudgeLine"], skin.config.colorGood || "#a2eeff");
    hook.tmps.hitPerfectColor = skin.config.hitFxTinted ? hex2rgba(skin.config.colorPerfect) || null : null;
    hook.tmps.hitGoodColor = skin.config.hitFxTinted ? hex2rgba(skin.config.colorGood) || null : null;
    hook.tmps.hitFxRotate = skin.config.hitFxRotate;
    hook.customResourceMeta.author = skin.config.author || "unknown";
    hook.customResourceMeta.name = skin.config.name || "unknown";
    hook.customResourceMeta.loaded = true;
    shared.game.loadHandler.r("loadChart");
    shared.game.msgHandler.sendMessage(shared.game.i18n.t("simphi.prprCustomRes.applied"), "success");

    hook.customResourceMeta.author = skin.author || "unknown";
    hook.customResourceMeta.name = skin.name || "unknown";

    hook.customResourceMeta.loaded = true;
}

// self.loadSkinFromBuffer = loadSkinFromBuffer; //debug
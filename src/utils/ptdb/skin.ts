import { openDB } from "./openDB";
import { ObjectStores } from "./ObjectStores";
import { generateUUID } from "../js/uuid";
import shared from "../js/shared";

interface CachedSkin<FileType = Blob> {
    name: string;
    author: string;
    files: FileType[];
    rawConfig?: prprSkinConfig;
}
interface prprSkinConfig {}
interface CachedSkinFile {
    // fileName: string,
    file: ImageBitmap | ArrayBuffer;
    imgOptions?: SkinImgOptions;
    type: SkinFileType;
}
interface SkinImgOptions {
    noteBaseScale: number | 1089;
}
enum SkinFileType {
    Tap = "Tap",
    TapHL = "TapHL",
    Drag = "Drag",
    DragHL = "DragHL",
    Hold = "Hold",
    HoldHL = "HoldHL",
    Flick = "Flick",
    FlickHL = "FlickHL",
    HitFX = "HitFX",
    HitSong0 = "HitSong0",
    HitSong1 = "HitSong1",
    HitSong2 = "HitSong2",
}

export function getCachedSkins(): Promise<CachedSkin<string>> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([ObjectStores.Skin]).objectStore(ObjectStores.Skin);
                objStore.getAll().onsuccess = e => {
                    const result = (e.target as IDBRequest).result;
                    // result.forEach((r: CachedSkin<ArrayBuffer | string>) => {
                    //   r.file = `/PTVirtual/db/skin/${result.id}`;
                    // });
                    res(result);
                };
            })
            .catch(e => rej(e));
    });
}

interface CustomResourceMeta {
    name: string;
    author: string;
}
export function saveSkin(
    entries: Map<
        string,
        {
            buffer: ArrayBuffer;
            name: string;
            path: string;
        }
    >,
    meta: CustomResourceMeta,
    config: prprSkinConfig
): Promise<string | void> {
    return new Promise(async (res, rej) => {
        if (
            (await haveCommonSkin(meta)) &&
            (await shared.game.msgHandler.confirm(shared.game.i18n.t("skin.haveCommon")))
        )
            return res();

        const files: Map<SkinFileType, CachedSkinFile> = new Map();

        if (entries.has("Tap")) {
            files.set(SkinFileType.Tap, {
                type: SkinFileType.Tap,
                file: await createImageBitmap(new Blob([entries.get("Tap")!.buffer])),
            });
            if (entries.has("TapHL"))
                files.set(SkinFileType.TapHL, {
                    type: SkinFileType.TapHL,
                    file: await createImageBitmap(new Blob([entries.get("TapHL")!.buffer])),
                });
        }
        if (entries.has("Drag")) {
            files.set(SkinFileType.Drag, {
                type: SkinFileType.Drag,
                file: await createImageBitmap(new Blob([entries.get("Drag")!.buffer])),
            });
            if (entries.has("DragHL"))
                files.set(SkinFileType.DragHL, {
                    type: SkinFileType.DragHL,
                    file: await createImageBitmap(new Blob([entries.get("DragHL")!.buffer])),
                });
        }
        if (entries.has("Flick")) {
            files.set(SkinFileType.Flick, {
                type: SkinFileType.Flick,
                file: await createImageBitmap(new Blob([entries.get("Flick")!.buffer])),
            });
            if (entries.has("FlickHL"))
                files.set(SkinFileType.FlickHL, {
                    type: SkinFileType.FlickHL,
                    file: await createImageBitmap(new Blob([entries.get("FlickHL")!.buffer])),
                });
        }
        if (entries.has("Hold")) {
            files.set(SkinFileType.Hold, {
                type: SkinFileType.Hold,
                file: await createImageBitmap(new Blob([entries.get("Hold")!.buffer])),
            });
            if (entries.has("HoldHL")) {
                files.set(SkinFileType.HoldHL, {
                    type: SkinFileType.HoldHL,
                    file: await createImageBitmap(new Blob([entries.get("HoldHL")!.buffer])),
                });
            }
            if (entries.has("HitFX")) {
                files.set(SkinFileType.HitFX, {
                    type: SkinFileType.HitFX,
                    file: await createImageBitmap(new Blob([entries.get("HitFX")!.buffer])),
                });
                // const [x, y] = config.hitFx;
                // const scale = (config.hitFxScale || 1.0) / (img.width / x / 256);
                // const hideParts = config.hideParticles || false;
                // const duration = config.hitFxDuration * 1000 || 500;
                // hook.noteRender.updateFX(img, scale, img.width / x, img.height / y, hideParts, duration);
            }
            // 读取音频
            if (entries.has("HitSong0"))
                files.set(SkinFileType.HitSong0, {
                    type: SkinFileType.HitSong0,
                    file: entries.get("HitSong0")!.buffer.slice(0),
                });
            if (entries.has("HitSong1"))
                files.set(SkinFileType.HitSong1, {
                    type: SkinFileType.HitSong1,
                    file: entries.get("HitSong1")!.buffer.slice(0),
                });
            if (entries.has("HitSong2"))
                files.set(SkinFileType.HitSong2, {
                    type: SkinFileType.HitSong2,
                    file: entries.get("HitSong2")!.buffer.slice(0),
                });

            openDB()
                .then(db => {
                    const id = generateUUID();
                    db.transaction([ObjectStores.Skin], "readwrite")
                        .objectStore(ObjectStores.Skin)
                        .add({
                            id,
                            name: meta.name || "unknown",
                            author: meta.author || "unknown",
                            files,
                            config,
                        });
                    // shared.game.msgHandler.sendMessage(shared.game.i18n.t("skin.saved"));
                    res(id);
                })
                .catch(e => rej(e));
        }
    });
}

export function getAllSkins(dbName: string = ObjectStores.Skin): Promise<CachedSkin[]> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([dbName]).objectStore(dbName);
                objStore.getAll().onsuccess = e => {
                    res((e.target as IDBRequest).result);
                };
            })
            .catch(e => rej(e));
    });
}
function haveCommonSkin(meta: CustomResourceMeta): Promise<boolean> {
    return new Promise(async res => {
        const allCharts = await getAllSkins(ObjectStores.Skin);
        for (const i of allCharts) {
            if (i.name === meta.name && i.author === meta.author) return res(true);
        }
        res(false);
    });
}

export function getSkin(id: string): Promise<CachedSkin<CachedSkinFile> | null> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction([ObjectStores.Skin]).objectStore(ObjectStores.Skin);
                const getReq = objStore.get(id);
                getReq.onsuccess = e => {
                    const result = getReq.result;
                    if (result) res(result);
                    else rej(e);
                };
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
    });
}

export function deleteSkin(id: string | null): Promise<boolean> | null {
    if (id === null) return null;
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db
                    .transaction([ObjectStores.Skin], "readwrite")
                    .objectStore(ObjectStores.Skin);
                const getReq = objStore.delete(id);
                getReq.onsuccess = e => res(true);
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
    });
}

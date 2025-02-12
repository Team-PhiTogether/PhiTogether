import { simphiPlayer } from "../../playerMain";
import { noteRender } from "../../renderer/Notes/render";
import { imgShader } from "../../assetsProcessor/imgProcessor";
import { msgHandler } from "@utils/js/msgHandler";
import { audio } from "@utils/js/aup";
import shared from "@utils/js/shared";

let defaultCRM = {
    name: "PhiTogether Default 1",
    author: "Team PhiTogether",
};
// const loadRes = (shared.game.simphi.reloadRes =
export async function loadRes(url: string, manual: boolean = false, setAsDefault: boolean = false) {
    if (!url) {
        if (simphiPlayer.customResourceMeta == defaultCRM) return;
        // if (shared.game.ptmain.gameConfig.resourcesType === "prpr-custom") {
        // return;
        // try {
        // const f = await fetch("/PTVirtual/user/respack.zip");
        // const b = await f.arrayBuffer();
        // await loadSkinFromBuffer(b, true);
        // shared.game.msgHandler.sendMessage("自定义资源包应用完成");
        // } catch (e) {
        //   shared.game.msgHandler.sendMessage(
        //     "错误：无法应用自定义资源包，界面显示可能异常，请检查设置",
        //     "error"
        //   );
        // }
        // } else {
        // if (shared.game.ptmain.gameConfig.resourcesType === "prpr-custom") await loadprprCustomRes();
        // else {
        simphiPlayer.customResourceMeta = defaultCRM;
        // await updateRes(res);
        const entries = [
            "Tap",
            "TapHL",
            "Drag",
            "DragHL",
            "HoldHead",
            "HoldHeadHL",
            "Hold",
            "HoldHL",
            "HoldEnd",
            "Flick",
            "FlickHL",
            "HitFXRaw",
        ];
        for (const i of entries) await noteRender.update(i, simphiPlayer.res[i], 1);
        simphiPlayer.res["JudgeLineMP"] = await imgShader(simphiPlayer.res["JudgeLine"], "#feffa9");
        simphiPlayer.res["JudgeLineFC"] = await imgShader(simphiPlayer.res["JudgeLine"], "#a2eeff");
        simphiPlayer.tmps.hitPerfectColor = simphiPlayer.tmps.hitGoodColor = null;
        simphiPlayer.tmps.hitFxRotate = false;
        // }
        // }
        return;
    }
    const newres = {}; //存放资源
    let errorNum = 0;
    const urlBak = url;
    if (!url.startsWith("/") && !url.startsWith("http")) url = "https://" + url;
    await fetch(`${url}/meta.json`)
        .then(r =>
            r
                .json()
                .then(crm => {
                    if (crm["hitEvtDrawer"] && !urlBak.startsWith(atob("cGdyZXM0cHQucmVhbHR2b3Au")))
                        crm["hitEvtDrawer"] = null;
                    simphiPlayer.customResourceMeta = crm;
                    if (setAsDefault) defaultCRM = crm;
                })
                .then(() => (simphiPlayer.customResourceMeta.loaded = true))
        )
        .catch(e => {
            msgHandler.sendError(shared.game.i18n.t("respack.err"));
            return;
        });
    const erc = (name, src) => {
        try {
            return (
                simphiPlayer.customResourceMeta.res[name] ||
                simphiPlayer.customResourceMeta.res[src] ||
                ""
            );
        } catch {
            return "";
        }
    };
    await Promise.all(
        Object.entries({
            Tap: "Tap.png",
            TapHL: "TapHL.png",
            Drag: "Drag.png",
            DragHL: "DragHL.png",
            HoldHead: "HoldHead.png",
            HoldHeadHL: "HoldHeadHL.png",
            Hold: "Hold.png",
            HoldHL: "HoldHL.png",
            HoldEnd: "HoldEnd.png",
            Flick: "Flick.png",
            FlickHL: "FlickHL.png",
            HitSong0: "HitSong0.ogg",
            HitSong1: "HitSong1.ogg",
            HitSong2: "HitSong2.ogg",
            HitFXRaw: "clickRaw.png",
        }).map(
            ([name, src], _i, arr) =>
                new Promise(resolve => {
                    if (!erc(name, src)) return resolve();
                    const xhr = new XMLHttpRequest();
                    xhr.open("get", (src = erc(name, src)), true);
                    xhr.responseType = "arraybuffer";
                    xhr.send();
                    xhr.onloadend = async () => {
                        if (!xhr.response || !xhr.response.byteLength) {
                            msgHandler.sendError(
                                shared.game.i18n.t("simphi.loading.resLoadFailed1", [++errorNum]),
                                shared.game.i18n.t("simphi.loading.resLoadFailed2", [
                                    new URL(src, location),
                                ]),
                                true
                            );
                        } else {
                            const a = new DataView(xhr.response, 0, 8);
                            const header1 = a.getUint32(0);
                            const header2 = a.getUint32(4);
                            if (header1 === 0x4f676753)
                                newres[name] = await audio.decode(xhr.response);
                            else if (header1 === 0x89504e47 && header2 === 0x0d0a1a0a)
                                newres[name] = await createImageBitmap(new Blob([xhr.response]));
                            else
                                msgHandler.sendError(
                                    shared.game.i18n.t("simphi.loading.resLoadFailed1", [
                                        ++errorNum,
                                    ]),
                                    shared.game.i18n.t("simphi.loading.resLoadFailed2", [
                                        new URL(src, location),
                                    ]),
                                    true
                                );
                        }
                        resolve();
                    };
                })
        )
    );
    if (errorNum)
        return msgHandler.sendError(
            shared.game.i18n.t("simphi.loading.resLoadFailed1", [errorNum])
        );
    if (manual) defaultCRM = simphiPlayer.customResourceMeta;
    await updateRes(newres, manual);
}
export async function updateRes(resources, manual = false) {
    const entries = [
        "Tap",
        "TapHL",
        "Drag",
        "DragHL",
        "HoldHead",
        "HoldHeadHL",
        "Hold",
        "HoldHL",
        "HoldEnd",
        "Flick",
        "FlickHL",
    ];
    for (const i of entries) {
        if (["prpr", "prpr-compacted"].includes(simphiPlayer.customResourceMeta["holdType"])) {
            if (["HoldHead", "HoldHeadHL", "HoldEnd"].includes(i)) continue;
            const img = resources[i];
            const noteScale = 1089 / img.width;
            const [bottom, top] = simphiPlayer.customResourceMeta["holdAtlas"] || [1, 1];
            const compacted = simphiPlayer.customResourceMeta["holdType"] === "prpr-compacted";
            if (i === "Hold") {
                noteRender.update(
                    "HoldEnd",
                    await createImageBitmap(img, 0, 0, img.width, bottom),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "Hold",
                    await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "HoldHead",
                    await createImageBitmap(img, 0, img.height - top, img.width, top),
                    noteScale,
                    compacted
                );
            } else if (i === "HoldHL") {
                noteRender.update(
                    "HoldEndHL",
                    await createImageBitmap(img, 0, 0, img.width, bottom),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "HoldHL",
                    await createImageBitmap(img, 0, bottom, img.width, img.height - bottom - top),
                    noteScale,
                    compacted
                );
                noteRender.update(
                    "HoldHeadHL",
                    await createImageBitmap(img, 0, img.height - top, img.width, top),
                    noteScale,
                    compacted
                );
            } else await noteRender.update(i, resources[i], 1);
        } else {
            await noteRender.update(
                i.replaceAll(/\.(jpg|png)/gi, ""),
                resources[i],
                ["HoldHL", "HoldHeadHL"].includes(i) ? 8080 / 7875 : 1
            );
            if (manual) simphiPlayer.res[i.replaceAll(/\.(jpg|png)/gi, "")] = resources[i];
        }
    }
    if (resources["HitFXRaw"]) await noteRender.updateFX(resources["HitFXRaw"], 1);
    for (let i = 0; i < 3; i++) {
        const str = `HitSong${i}`;
        if (resources[str]) simphiPlayer.res[str] = resources[str];
    }
    if (manual)
        shared.game.msgHandler.sendMessage(
            shared.game.ptmain.$t("respack.customResApplied"),
            "success"
        );
}

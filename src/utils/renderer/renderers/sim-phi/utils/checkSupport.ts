import shared from "@utils/js/shared";
import { msgHandler } from "@utils/js/msgHandler";
import { urls, loadJS } from "../assetsProcessor/loader.js";
import { audio } from "@/utils/js/aup.js";
import { isUndefined } from "@utils/js/common.js";

const $id = query => document.getElementById(query);
export async function checkSupport() {
    const loadLib = async (name, urls, check) => {
        if (!check()) return true;
        const errmsg1 = shared.game.i18n.t("simphi.loadLib.err.msg1", { name });
        const errmsg2 = shared.game.i18n.t("simphi.loadLib.err.msg2", { name });
        const errmsg3 = shared.game.i18n.t("simphi.loadLib.err.msg3", { name });
        if (
            !(await loadJS(urls).catch(e =>
                msgHandler.sendError(errmsg1, e.message.replace(/.+/, errmsg2), true)
            ))
        )
            return false;
        if (!check()) return true;
        return msgHandler.sendError(errmsg1, errmsg3, true);
    };
    await Utils.addFont("Cairo", { alt: "Custom" });
    // await Utils.addFont('Saira', { alt: 'Custom' });
    //兼容性检测
    const isMobile =
        navigator["standalone"] !== undefined ||
        (navigator.platform.indexOf("Linux") > -1 && navigator.maxTouchPoints === 5);
    if (isMobile) $id("uploader-select").style.display = "none";
    if (navigator.userAgent.indexOf("MiuiBrowser") > -1) {
        //实测 v17.1.8 问题仍然存在，v17.4.80113 问题已修复
        const version = navigator.userAgent.match(/MiuiBrowser\/(\d+\.\d+)/);
        if (!version || parseFloat(version[1]) < 17.4)
            msgHandler.sendWarning(shared.game.i18n.t("simphi.compatibilityWarning.miBrowser"));
    }
    if (
        !(await loadLib(
            shared.game.i18n.t("simphi.loadLib.libNames.createImageBitmap"),
            urls.bitmap,
            () => isUndefined("createImageBitmap")
        ))
    )
        return -1;
    const oggCompatible = !!new Audio().canPlayType("audio/ogg");
    if (
        !(await loadLib(
            shared.game.i18n.t("simphi.loadLib.libNames.oggmentedBundle"),
            "/src/oggmented-bundle.js",
            () => !oggCompatible && isUndefined("oggmented")
        ))
    )
        return -4;
    audio.init(
        oggCompatible
            ? self.AudioContext || self["webkitAudioContext"]
            : self["oggmented"].OggmentedAudioContext
    ); //兼容Safari
    const webpCompatible = document
        .createElement("canvas")
        .toDataURL("image/webp")
        .includes("data:image/webp");
    if (
        !(await loadLib(
            shared.game.i18n.t("simphi.loadLib.libNames.webp"),
            urls.webp,
            () => !webpCompatible && isUndefined("webp")
        ))
    )
        return -5;
}

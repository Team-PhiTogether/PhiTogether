import Notiflix from "notiflix";
import i18n from "@locales";
import { Utils } from "@utils/js/utils";

interface MsgHandler {
    nodeText: HTMLElement | null;
    lastMessage: string;
    sendMessage(msg: string, type: 'error' | 'success' | 'info', system?: boolean): void;
    confirm(msg: string, title?: string, yes?: string, no?: string): Promise<boolean>;
    info(msg: string, title?: string, yes?: string, type?: string): Promise<boolean>;
    success(msg: string, title?: string, yes?: string): Promise<boolean>;
    failure(msg: string, title?: string, yes?: string): Promise<boolean>;
    warning(msg: string, title?: string, yes?: string): Promise<boolean>;
    prompt(msg: string, title?: string, yes?: string, no?: string, placeholder?: string): Promise<string | null>;
    msgbox(msg: string, type: string, fatal?: boolean): void;
    sendWarning(msg: string, isHTML?: boolean): void;
    sendError(msg: string, html?: string, fatal?: boolean): boolean;
}

export const msgHandler: MsgHandler = {
    nodeText: document.getElementById("msg-out"),
    lastMessage: "",
    sendMessage(msg: string, type: 'error' | 'success' | 'info', system: boolean = true) {
        if (type === "error") {
            Notiflix.Notify.failure(msg, {
                ID: "msgHandlerErr",
                zindex: 114515,
                cssAnimationStyle: "fade",
                showOnlyTheLastOne: false,
                opacity: "0.8",
                borderRadius: "15px",
            });
        } else if (type === "success") {
            Notiflix.Notify.success(msg, {
                ID: "msgHandlerSuccess",
                zindex: 114515,
                cssAnimationStyle: "fade",
                showOnlyTheLastOne: false,
                opacity: "0.8",
                borderRadius: "15px",
            });
        } else {
            Notiflix.Notify.info(msg, {
                ID: "msgHandlerInfo",
                zindex: 114515,
                cssAnimationStyle: "fade",
                clickToClose: true,
                showOnlyTheLastOne: false,
                opacity: "0.8",
                borderRadius: "15px",
            });
        }
    },
    confirm(msg: string, title?: string, yes?: string, no?: string): Promise<boolean> {
        if (!title) title = i18n.global.t("info.info");
        if (!yes) yes = i18n.global.t("info.yes");
        if (!no) no = i18n.global.t("info.no");
        return new Promise(res => {
            Notiflix.Confirm.show(
                title,
                msg,
                yes,
                no,
                () => {
                    res(true);
                },
                () => {
                    res(false);
                },
                {
                    zindex: 114515,
                    titleColor: "black",
                    okButtonBackground: "#90caf9",
                    messageMaxLength: 1000,
                    plainText: false,
                }
            );
        });
    },
    info(msg: string, title?: string, yes?: string, type: string = "info"): Promise<boolean> {
        if (!title) title = i18n.global.t("info.info");
        if (!yes) yes = i18n.global.t("info.ok");
        return new Promise(res => {
            Notiflix.Report[type](
                title,
                msg,
                yes,
                () => {
                    res(true);
                },
                {
                    zindex: 114515,
                    titleColor: "black",
                    buttonBackground: "#90caf9",
                    svgSize: "30px",
                }
            );
        });
    },
    success(msg: string, title?: string, yes?: string): Promise<boolean> {
        if (!title) title = i18n.global.t("info.info");
        if (!yes) yes = i18n.global.t("info.ok");
        return this.info(msg, title, yes, "success");
    },
    failure(msg: string, title?: string, yes?: string): Promise<boolean> {
        if (!title) title = i18n.global.t("info.failure");
        if (!yes) yes = i18n.global.t("info.ok");
        return this.info(msg, title, yes, "failure");
    },
    warning(msg: string, title?: string, yes?: string): Promise<boolean> {
        if (!title) title = i18n.global.t("info.warning");
        if (!yes) yes = i18n.global.t("info.ok");
        return this.info(msg, title, yes, "warning");
    },
    prompt(msg: string, title?: string, yes?: string, no?: string, placeholder: string = ""): Promise<string | null> {
        if (!title) title = i18n.global.t("info.info");
        if (!yes) yes = i18n.global.t("info.confirm");
        if (!no) no = i18n.global.t("info.cancel");
        return new Promise(function (res) {
            Notiflix.Confirm.prompt(
                title,
                msg,
                placeholder,
                yes,
                no,
                clientAnswer => {
                    res(clientAnswer);
                },
                clientAnswer => {
                    res(null);
                },
                {
                    zindex: 114515,
                    titleColor: "black",
                    okButtonBackground: "#90caf9",
                }
            );
        });
    },
    msgbox(msg: string, type: string, fatal?: boolean): void {
        return;
    },
    sendWarning(msg: string, isHTML?: boolean): void {
        const msgText = isHTML ? msg : Utils.escapeHTML(msg);
        this.msgbox(msgText, "warn");
    },
    sendError(msg: string, html?: string, fatal?: boolean): boolean {
        if (html) {
            const exp =
                /([A-Za-z][A-Za-z+-.]{2,}:\/\/|www\.)[^\s\x00-\x20\x7f-\x9f"]{2,}[^\s\x00-\x20\x7f-\x9f"!'),.:;?\]}]/g;
            const ahtml = html.replace(exp, (match = "") => {
                const url = match.startsWith("www.") ? `//${match}` : match;
                const rpath = match.replace(`${location.origin}/`, "");
                if (match.indexOf(location.origin) > -1)
                    return `<a href="#"style="color:#023b8f;text-decoration:underline;">${rpath}</a>`;
                return `<a href="${url}"target="_blank"style="color:#023b8f;text-decoration:underline;">${rpath}</a>`;
            });
            this.msgbox(ahtml, "error", fatal);
        }
        this.sendMessage(msg, "error");
        return false;
    },
};
